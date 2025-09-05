// use-follow-count v1: 关注管理Hook

import { useState, useEffect, useCallback } from 'react';

import { useAuth } from '../../../context/AuthContext';
import { notificationService } from '../../../services';
import { getProfile } from '../../../services/mock/userProfileService';
import {
  followUser,
  unfollowUser,
  isFollowing as checkIsFollowing,
  getFollowers,
} from '../../../services/supabase/users';

/**
 * 关注管理Hook
 * @param {string} artistId - 艺术家ID
 * @param {number} initialFollowersCount - 初始关注者数量
 * @returns {Object} 关注状态和操作函数
 */
const useFollowCount = artistId => {
  const { user: currentUser } = useAuth();

  // 关注状态
  const [followersCount, setFollowersCount] = useState(0); // 默认为 0，不使用硬编码
  const [isFollowingState, setIsFollowingState] = useState(null);
  const [isToggling, setIsToggling] = useState(false);

  // 获取当前用户信息
  const isLoggedIn = !!currentUser?.id;

  // 切换关注状态
  const toggleFollow = useCallback(async () => {
    if (!artistId || !isLoggedIn || isToggling) {
      return;
    }

    // 不能关注自己
    if (currentUser.id === artistId) {
      console.warn('[FollowCount] Cannot follow yourself');
      return;
    }

    // 如果状态还未加载完成，等待加载
    if (isFollowingState === null) {
      console.log(
        '[FollowCount] Follow status not loaded yet, skipping toggle'
      );
      return;
    }

    try {
      setIsToggling(true);

      console.log(
        '[FollowCount] Toggling follow for artist:',
        artistId,
        'User:',
        currentUser.id,
        'Current state:',
        isFollowingState
      );

      // 使用已加载的状态，避免重复查询
      const currentlyFollowing = isFollowingState;
      let result;

      if (currentlyFollowing) {
        // 当前已关注，执行取消关注
        result = await unfollowUser(currentUser.id, artistId);
      } else {
        // 当前未关注，执行关注
        result = await followUser(currentUser.id, artistId);
      }

      if (result.success) {
        const newFollowingState = !currentlyFollowing;

        // 更新本地状态
        setIsFollowingState(newFollowingState);

        // 获取最新的关注者数量
        const followersResult = await getFollowers(artistId);
        if (followersResult.success) {
          setFollowersCount(followersResult.data.length);
        }

        console.log(
          '[FollowCount] Follow toggled successfully:',
          newFollowingState ? 'Following' : 'Unfollowing'
        );

        // 触发 follow:changed 事件，通知其他组件更新
        const followChangedEvent = new CustomEvent('follow:changed', {
          detail: {
            followerId: currentUser.id,
            artistId: artistId,
            isFollowing: newFollowingState,
            operation: newFollowingState ? 'follow' : 'unfollow',
          },
        });
        window.dispatchEvent(followChangedEvent);

        // 如果开始关注，创建关注通知
        if (newFollowingState) {
          try {
            // 获取当前用户的资料信息，使用自定义名字
            const profileResult = await getProfile(currentUser.id);
            const userDisplayName =
              profileResult.success && profileResult.data.fullName
                ? profileResult.data.fullName
                : currentUser.name || currentUser.username || 'Unknown User';

            await notificationService.createFollowNotification(
              currentUser.id,
              userDisplayName,
              artistId
            );
            console.log('[FollowCount] Created follow notification');
          } catch (error) {
            console.error(
              '[FollowCount] Failed to create follow notification:',
              error
            );
          }
        }

        // 触发关注状态变化事件，通知其他组件更新
        window.dispatchEvent(
          new CustomEvent('follow:changed', {
            detail: {
              followerId: currentUser.id,
              artistId,
              isFollowing: newFollowingState,
              followersCount: followersResult.success
                ? followersResult.data.length
                : followersCount,
            },
          })
        );
      } else {
        console.error('[FollowCount] Failed to toggle follow:', result.error);
      }
    } catch (error) {
      console.error('[FollowCount] Error toggling follow:', error);
    } finally {
      setIsToggling(false);
    }
  }, [
    artistId,
    isLoggedIn,
    currentUser?.id,
    currentUser?.name,
    currentUser?.username,
    isToggling,
    isFollowingState,
  ]);

  // 刷新关注状态
  const refreshFollowStatus = useCallback(async () => {
    if (!artistId || !isLoggedIn) return;

    try {
      // 检查关注状态
      const followResult = await checkIsFollowing(currentUser.id, artistId);
      if (!followResult.success) {
        console.error(
          '[FollowCount] Failed to check follow status:',
          followResult.error
        );
        return;
      }

      // 获取关注者数量
      const followersResult = await getFollowers(artistId);
      if (!followersResult.success) {
        console.error(
          '[FollowCount] Failed to get followers count:',
          followersResult.error
        );
        return;
      }

      setFollowersCount(followersResult.data.length);
      setIsFollowingState(followResult.isFollowing);
      console.log(
        '[FollowCount] Refreshed follow status:',
        followResult.isFollowing ? 'Following' : 'Not following',
        'Followers count:',
        followersResult.data.length
      );
    } catch (error) {
      console.error('[FollowCount] Error refreshing follow status:', error);
    }
  }, [artistId, isLoggedIn, currentUser?.id]);

  // 获取最新关注者数量
  const refreshFollowersCount = useCallback(async () => {
    if (!artistId) return;

    try {
      const result = await getFollowers(artistId);

      if (result.success) {
        setFollowersCount(result.data.length);
        console.log(
          '[FollowCount] Refreshed followers count:',
          result.data.length
        );
      } else {
        console.error(
          '[FollowCount] Failed to refresh followers count:',
          result.error
        );
      }
    } catch (error) {
      console.error('[FollowCount] Error refreshing followers count:', error);
    }
  }, [artistId]);

  // 监听 follow:changed 事件
  useEffect(() => {
    const handleFollowChanged = event => {
      const {
        followerId,
        artistId: changedArtistId,
        isFollowing: newIsFollowing,
      } = event.detail;

      // 只处理当前艺术家的关注状态变化
      if (changedArtistId === artistId) {
        // 如果是当前用户的操作，更新关注状态
        if (followerId === currentUser?.id) {
          setIsFollowingState(newIsFollowing);
        }

        // 刷新关注者数量
        refreshFollowersCount();
      }
    };

    window.addEventListener('follow:changed', handleFollowChanged);

    return () => {
      window.removeEventListener('follow:changed', handleFollowChanged);
    };
  }, [artistId, currentUser?.id, refreshFollowersCount]);

  // 页面加载时获取关注状态
  useEffect(() => {
    if (artistId && isLoggedIn) {
      refreshFollowStatus();
    }
  }, [artistId, isLoggedIn, refreshFollowStatus]);

  // 当artistId或用户变化时重置状态
  useEffect(() => {
    setIsFollowingState(null);
    setIsToggling(false);
    setFollowersCount(0);
  }, [artistId, currentUser?.id]);

  return {
    followersCount,
    isFollowing: isFollowingState,
    isToggling,
    toggleFollow,
    refreshFollowStatus,
    refreshFollowersCount,
  };
};

export default useFollowCount;

// use-follow-count v1: 关注管理Hook

import { useState, useEffect, useCallback } from 'react';

import { useAuth } from '../../../context/AuthContext';
import { notificationService } from '../../../services';
import {
  toggleFollow as mockToggleFollow,
  checkFollowStatus as mockCheckStatus,
  getFollowersCount as mockGetFollowersCount,
  getFollowingList as mockGetFollowingList,
  debugFollowStats as mockDebugStats,
} from '../../../services/mock/followService';
import { getProfile } from '../../../services/mock/userProfileService';

/**
 * 关注管理Hook
 * @param {string} artistId - 艺术家ID
 * @param {number} initialFollowersCount - 初始关注者数量
 * @returns {Object} 关注状态和操作函数
 */
const useFollowCount = (artistId, initialFollowersCount = 0) => {
  const { user: currentUser } = useAuth();

  // 关注状态
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isFollowing, setIsFollowing] = useState(false);
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

    try {
      setIsToggling(true);

      console.log(
        '[FollowCount] Toggling follow for artist:',
        artistId,
        'User:',
        currentUser.id
      );

      const result = await mockToggleFollow(currentUser.id, artistId);

      if (result.success) {
        // 更新本地状态
        setFollowersCount(result.data.followersCount);
        setIsFollowing(result.data.isFollowing);

        console.log(
          '[FollowCount] Follow toggled successfully:',
          result.data.isFollowing ? 'Following' : 'Unfollowing',
          'Followers count:',
          result.data.followersCount
        );

        // 如果开始关注，创建关注通知
        if (result.data.isFollowing) {
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
              isFollowing: result.data.isFollowing,
            },
          })
        );

        // 调试：打印详细的关注统计
        mockDebugStats(artistId);
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
  ]);

  // 刷新关注状态
  const refreshFollowStatus = useCallback(async () => {
    if (!artistId || !isLoggedIn) return;

    try {
      const result = await mockCheckStatus(currentUser.id, artistId);

      if (result.success) {
        setFollowersCount(result.data.followersCount);
        setIsFollowing(result.data.isFollowing);
        console.log(
          '[FollowCount] Refreshed follow status:',
          result.data.isFollowing ? 'Following' : 'Not following',
          'Followers count:',
          result.data.followersCount
        );
      } else {
        console.error(
          '[FollowCount] Failed to refresh follow status:',
          result.error
        );
      }
    } catch (error) {
      console.error('[FollowCount] Error refreshing follow status:', error);
    }
  }, [artistId, isLoggedIn, currentUser?.id]);

  // 获取最新关注者数量
  const refreshFollowersCount = useCallback(async () => {
    if (!artistId) return;

    try {
      const result = await mockGetFollowersCount(artistId);

      if (result.success) {
        setFollowersCount(result.data.followersCount);
        console.log(
          '[FollowCount] Refreshed followers count:',
          result.data.followersCount
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
          setIsFollowing(newIsFollowing);
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
    setIsFollowing(false);
    setIsToggling(false);
  }, [artistId, currentUser?.id]);

  return {
    followersCount,
    isFollowing,
    isToggling,
    toggleFollow,
    refreshFollowStatus,
    refreshFollowersCount,
  };
};

export default useFollowCount;

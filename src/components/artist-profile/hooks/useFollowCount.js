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
        // 取消关注
        result = await unfollowUser(currentUser.id, artistId);
        if (!result.success) {
          console.error('[FollowCount] Failed to unfollow:', result.error);
          return;
        }
        setIsFollowingState(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        // 关注
        result = await followUser(currentUser.id, artistId);
        if (!result.success) {
          // 如果是409错误，说明已关注，需要同步状态
          if (result.error && result.error.includes('already follows')) {
            console.log('[FollowCount] Already following, syncing state');
            setIsFollowingState(true);
            await refreshFollowStatus();
            return;
          }
          console.error('[FollowCount] Failed to follow:', result.error);
          return;
        }
        setIsFollowingState(true);
        setFollowersCount(prev => prev + 1);
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
        // 如果查询失败，默认设为 false
        setIsFollowingState(false);
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

      // 使用 count 字段或 data.length，優先使用 count
      const count =
        followersResult.count !== undefined
          ? followersResult.count
          : followersResult.data.length;
      setFollowersCount(count);
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
        // 使用 count 字段或 data.length，優先使用 count
        const count =
          result.count !== undefined ? result.count : result.data.length;
        setFollowersCount(count);
        console.log('[FollowCount] Refreshed followers count:', count);
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

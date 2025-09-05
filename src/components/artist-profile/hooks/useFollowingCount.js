// use-following-count v1: Following 计数管理 Hook

import { useState, useEffect, useCallback } from 'react';

import { getFollowing } from '../../../services/supabase/users';

/**
 * Following 计数管理 Hook
 * @param {string} userId - 用户ID
 * @returns {Object} Following 状态和操作函数
 */
const useFollowingCount = userId => {
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 获取 Following 计数
  const refreshFollowingCount = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const result = await getFollowing(userId);

      if (result.success) {
        setFollowingCount(result.data.length);
        console.log(
          '[FollowingCount] Refreshed following count:',
          result.data.length
        );
      } else {
        console.error(
          '[FollowingCount] Failed to refresh following count:',
          result.error
        );
      }
    } catch (error) {
      console.error(
        '[FollowingCount] Error refreshing following count:',
        error
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // 监听 follow:changed 事件
  useEffect(() => {
    const handleFollowChanged = event => {
      const { followerId } = event.detail;

      // 如果是当前用户的操作，刷新 Following 计数
      if (followerId === userId) {
        refreshFollowingCount();
      }
    };

    window.addEventListener('follow:changed', handleFollowChanged);

    return () => {
      window.removeEventListener('follow:changed', handleFollowChanged);
    };
  }, [userId, refreshFollowingCount]);

  // 页面加载时获取 Following 计数
  useEffect(() => {
    if (userId) {
      refreshFollowingCount();
    }
  }, [userId, refreshFollowingCount]);

  return {
    followingCount,
    isLoading,
    refreshFollowingCount,
  };
};

export default useFollowingCount;

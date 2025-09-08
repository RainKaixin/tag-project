// use-like-count v1: 喜欢管理Hook

import { useState, useEffect, useCallback } from 'react';

import { useAuth } from '../../../context/AuthContext';
import { notificationService } from '../../../services';
import { likeService } from '../../../services/likeService/index.js';
import { getProfile } from '../../../services/mock/userProfileService';

/**
 * 喜欢管理Hook
 * @param {string} artworkId - 作品ID
 * @param {number} initialLikeCount - 初始喜欢数
 * @param {Object} workData - 作品数据（包含标题和作者信息）
 * @returns {Object} 喜欢状态和操作函数
 */
const useLikeCount = (artworkId, initialLikeCount = 0, workData = null) => {
  const { user: currentUser } = useAuth();

  // 喜欢状态
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // 获取当前用户信息
  const isLoggedIn = !!currentUser?.id;

  // 切换喜欢状态
  const toggleLike = useCallback(async () => {
    if (!artworkId || !isLoggedIn || isToggling) {
      return;
    }

    try {
      setIsToggling(true);

      console.log(
        '[LikeCount] Toggling like for artwork:',
        artworkId,
        'User:',
        currentUser.id
      );

      const result = await likeService.toggleArtworkLike(
        artworkId,
        currentUser.id
      );

      if (result.success) {
        // 更新本地状态
        setLikeCount(result.data.likes);
        setIsLiked(result.data.liked);

        console.log(
          '[LikeCount] Like toggled successfully:',
          result.data.liked ? 'Liked' : 'Unliked',
          'Total likes:',
          result.data.likes
        );

        // 暫時禁用通知創建，等待數據庫約束問題修復
        // TODO: 修復 notifications_unique_follow 約束問題後重新啟用
        /*
        // 如果开始点赞，创建点赞通知（只有当点赞者不是作品作者时）
        if (
          result.data.liked &&
          workData &&
          currentUser.id !== (workData.author?.id || workData.authorId)
        ) {
          try {
            // 获取当前用户的资料信息，使用自定义名字
            const profileResult = await getProfile(currentUser.id);
            const userDisplayName =
              profileResult.success && profileResult.data.fullName
                ? profileResult.data.fullName
                : currentUser.name || currentUser.username || 'Unknown User';

            await notificationService.createLikeNotification(
              currentUser.id,
              userDisplayName,
              artworkId,
              workData.title || 'Untitled',
              workData.author?.id || workData.authorId
            );
            console.log('[LikeCount] Created like notification');
          } catch (error) {
            console.error(
              '[LikeCount] Failed to create like notification:',
              error
            );
          }
        }
        */

        // 調試：打印詳細的點讚統計
        console.log(
          `[LikeCount] Debug: Artwork ${artworkId} total likes: ${result.data.likes}`
        );
      } else {
        console.error('[LikeCount] Failed to toggle like:', result.error);
      }
    } catch (error) {
      console.error('[LikeCount] Error toggling like:', error);
    } finally {
      setIsToggling(false);
    }
  }, [
    artworkId,
    isLoggedIn,
    currentUser?.id,
    workData?.title,
    workData?.author?.id,
    workData?.authorId,
    isToggling,
    workData,
  ]);

  // 刷新喜欢状态
  const refreshLikeStatus = useCallback(async () => {
    if (!artworkId || !isLoggedIn) return;

    try {
      const result = await likeService.checkUserLikeStatus(
        artworkId,
        currentUser.id
      );

      if (result.success) {
        setLikeCount(result.data.likes);
        setIsLiked(result.data.liked);
        console.log(
          '[LikeCount] Refreshed like status:',
          result.data.liked ? 'Liked' : 'Not liked',
          'Total likes:',
          result.data.likes
        );
      } else {
        console.error(
          '[LikeCount] Failed to refresh like status:',
          result.error
        );
      }
    } catch (error) {
      console.error('[LikeCount] Error refreshing like status:', error);
    }
  }, [
    artworkId,
    isLoggedIn,
    currentUser?.id,
    currentUser?.name,
    currentUser?.username,
  ]);

  // 获取最新喜欢数
  const refreshLikeCount = useCallback(async () => {
    if (!artworkId) return;

    try {
      const result = await likeService.getArtworkLikeCount(artworkId);

      if (result.success) {
        setLikeCount(result.data.likes);
        console.log('[LikeCount] Refreshed like count:', result.data.likes);
      } else {
        console.error(
          '[LikeCount] Failed to refresh like count:',
          result.error
        );
      }
    } catch (error) {
      console.error('[LikeCount] Error refreshing like count:', error);
    }
  }, [artworkId]);

  // 页面加载时获取喜欢状态
  useEffect(() => {
    if (artworkId && isLoggedIn) {
      refreshLikeStatus();
    }
  }, [artworkId, isLoggedIn, refreshLikeStatus]);

  // 当artworkId或用户变化时重置状态
  useEffect(() => {
    setIsLiked(false);
    setIsToggling(false);
  }, [artworkId, currentUser?.id]);

  return {
    likeCount,
    isLiked,
    isToggling,
    toggleLike,
    refreshLikeStatus,
    refreshLikeCount,
  };
};

export default useLikeCount;

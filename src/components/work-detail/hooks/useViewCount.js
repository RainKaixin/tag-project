// use-view-count v1: 浏览量管理Hook

import { useState, useEffect, useCallback } from 'react';

import { useAuth } from '../../../context/AuthContext';
import {
  recordArtworkView as mockRecordView,
  getArtworkViewCount as mockGetViewCount,
  getUserFingerprint as mockGetFingerprint,
  debugViewStats as mockDebugViewStats,
} from '../../../services/mock/viewCountService';
import {
  recordArtworkView as supabaseRecordView,
  getArtworkViewCount as supabaseGetViewCount,
} from '../../../services/supabase/artworks';
import { checkSupabaseConnection } from '../../../services/supabase/client';
import { getOrCreateUserFingerprint } from '../../../utils/userFingerprint';

/**
 * 浏览量管理Hook
 * @param {string} artworkId - 作品ID
 * @param {number} initialViewCount - 初始浏览量
 * @returns {Object} 浏览量状态和操作函数
 */
const useViewCount = (artworkId, initialViewCount = 0) => {
  const { user: currentUser } = useAuth();

  // 浏览量状态 - 不依赖initialViewCount，让服务决定初始值
  const [viewCount, setViewCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  // 获取当前用户信息
  const isLoggedIn = !!currentUser?.id;

  // 获取最新浏览量 - 必须在recordView之前定义
  const refreshViewCount = useCallback(async () => {
    if (!artworkId) return;

    try {
      // 检查Supabase连接状态
      const isSupabaseConnected = await checkSupabaseConnection();

      // 根据连接状态选择API
      const result = isSupabaseConnected
        ? await supabaseGetViewCount(artworkId)
        : await mockGetViewCount(artworkId);

      if (result.success) {
        setViewCount(result.viewCount);
        console.log(
          '[ViewCount] Refreshed view count:',
          result.viewCount,
          `(Mode: ${isSupabaseConnected ? 'Supabase' : 'Mock'})`
        );
      } else {
        console.error(
          '[ViewCount] Failed to refresh view count:',
          result.error
        );
      }
    } catch (error) {
      console.error('[ViewCount] Error refreshing view count:', error);
    }
  }, [artworkId]);

  // 记录浏览的函数
  const recordView = useCallback(async () => {
    if (!artworkId || isRecording) {
      return;
    }

    // 检查是否已经记录过（基于当前用户和作品）
    const userKey = isLoggedIn ? currentUser?.id : 'visitor';
    const hasRecordedKey = `hasRecorded_${artworkId}_${userKey}`;

    // 从localStorage检查是否已经记录过
    let hasRecordedForThisWork = false;
    try {
      hasRecordedForThisWork = localStorage.getItem(hasRecordedKey) === 'true';
    } catch (error) {
      console.warn('[ViewCount] Failed to check recorded status:', error);
    }

    if (hasRecordedForThisWork) {
      console.log(
        `[ViewCount] Already recorded for user: ${userKey} on artwork: ${artworkId}`
      );
      return;
    }

    try {
      setIsRecording(true);

      // 检查Supabase连接状态
      const isSupabaseConnected = await checkSupabaseConnection();

      // 准备浏览记录参数 - 修复去重维度问题
      const viewParams = {
        userId: isLoggedIn ? currentUser.id : null,
        visitorFingerprint: !isLoggedIn
          ? isSupabaseConnected
            ? getOrCreateUserFingerprint()
            : mockGetFingerprint()
          : null,
        userAgent: navigator.userAgent,
      };

      // 确保登录用户不传递visitorFingerprint，未登录用户不传递userId
      if (isLoggedIn) {
        viewParams.visitorFingerprint = null;
      } else {
        viewParams.userId = null;
      }

      console.log(
        '[ViewCount] Recording view for artwork:',
        artworkId,
        viewParams,
        `(Mode: ${isSupabaseConnected ? 'Supabase' : 'Mock'})`
      );

      // 调试：打印当前用户信息
      console.log('[ViewCount] Current user info:', {
        isLoggedIn,
        userId: currentUser?.id,
        userName: currentUser?.name,
      });

      // 根据连接状态选择API
      const result = isSupabaseConnected
        ? await supabaseRecordView(artworkId, viewParams)
        : await mockRecordView(artworkId, viewParams);

      if (result.success) {
        // 更新本地浏览量
        setViewCount(result.viewCount);
        setHasRecorded(true);

        // 保存记录状态到localStorage
        try {
          localStorage.setItem(hasRecordedKey, 'true');
          console.log(
            `[ViewCount] Saved recorded status for ${userKey} on ${artworkId}`
          );
        } catch (error) {
          console.warn('[ViewCount] Failed to save recorded status:', error);
        }

        console.log(
          '[ViewCount] View recorded successfully, new count:',
          result.viewCount,
          `(Mode: ${isSupabaseConnected ? 'Supabase' : 'Mock'})`
        );

        // 调试：打印详细的浏览量统计
        if (!isSupabaseConnected) {
          mockDebugViewStats(artworkId);
        }

        // 立即刷新浏览量以确保显示最新数据
        setTimeout(() => {
          refreshViewCount();
        }, 100);
      } else {
        console.error('[ViewCount] Failed to record view:', result.error);
      }
    } catch (error) {
      console.error('[ViewCount] Error recording view:', error);
    } finally {
      setIsRecording(false);
    }
  }, [
    artworkId,
    isLoggedIn,
    currentUser?.id,
    refreshViewCount,
    currentUser?.name,
    isRecording,
  ]);

  // 页面加载时立即记录浏览并获取最新浏览量
  useEffect(() => {
    if (artworkId) {
      // 先获取最新浏览量
      refreshViewCount();

      // 然后记录新的浏览
      recordView();
    }
  }, [artworkId, recordView, refreshViewCount]);

  // 当artworkId或用户变化时重置状态
  useEffect(() => {
    setHasRecorded(false);
    setIsRecording(false);
  }, [artworkId, currentUser?.id]);

  return {
    viewCount,
    isRecording,
    hasRecorded,
    recordView,
    refreshViewCount,
  };
};

export default useViewCount;

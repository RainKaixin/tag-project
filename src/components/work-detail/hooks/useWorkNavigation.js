// use-work-navigation v1: 作品导航管理Hook

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { workService } from '../../../services';

/**
 * 作品导航管理Hook
 * @param {string} currentWorkId - 当前作品ID
 * @returns {Object} 导航状态和函数
 */
const useWorkNavigation = currentWorkId => {
  const navigate = useNavigate();

  // 导航状态
  const [allWorks, setAllWorks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取所有作品并按发布时间排序
  const loadAllWorks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await workService.getAllPublicWorks();

      if (result.success && result.data) {
        // 按发布时间排序（最新的在前）
        const sortedWorks = result.data.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date || 0);
          const dateB = new Date(b.createdAt || b.date || 0);
          return dateB - dateA; // 降序排列，最新的在前
        });

        setAllWorks(sortedWorks);

        // 找到当前作品在列表中的位置
        const index = sortedWorks.findIndex(work => work.id === currentWorkId);
        setCurrentIndex(index);

        console.log(
          `[WorkNavigation] Loaded ${sortedWorks.length} works, current index: ${index}`
        );
      } else {
        setError('Failed to load works');
      }
    } catch (err) {
      console.error('[WorkNavigation] Error loading works:', err);
      setError('Failed to load works');
    } finally {
      setLoading(false);
    }
  }, [currentWorkId]);

  // 初始化时加载所有作品
  useEffect(() => {
    if (currentWorkId) {
      loadAllWorks();
    }
  }, [currentWorkId, loadAllWorks]);

  // 导航到上一个作品
  const navigateToPrevious = useCallback(() => {
    if (allWorks.length === 0 || currentIndex === -1) return;

    let prevIndex;
    if (currentIndex === 0) {
      // 如果是第一个作品，跳转到最后一个作品（循环）
      prevIndex = allWorks.length - 1;
    } else {
      prevIndex = currentIndex - 1;
    }

    const prevWork = allWorks[prevIndex];
    if (prevWork) {
      console.log(
        `[WorkNavigation] Navigating to previous work: ${prevWork.id}`
      );
      navigate(`/work/${prevWork.id}`);
    }
  }, [allWorks, currentIndex, navigate]);

  // 导航到下一个作品
  const navigateToNext = useCallback(() => {
    if (allWorks.length === 0 || currentIndex === -1) return;

    let nextIndex;
    if (currentIndex === allWorks.length - 1) {
      // 如果是最后一个作品，跳转到第一个作品（循环）
      nextIndex = 0;
    } else {
      nextIndex = currentIndex + 1;
    }

    const nextWork = allWorks[nextIndex];
    if (nextWork) {
      console.log(`[WorkNavigation] Navigating to next work: ${nextWork.id}`);
      navigate(`/work/${nextWork.id}`);
    }
  }, [allWorks, currentIndex, navigate]);

  // 处理键盘导航
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateToPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigateToNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigateToPrevious, navigateToNext]);

  return {
    // 状态
    allWorks,
    currentIndex,
    loading,
    error,

    // 导航信息
    hasPrevious: allWorks.length > 0 && currentIndex > 0,
    hasNext: allWorks.length > 0 && currentIndex < allWorks.length - 1,
    totalWorks: allWorks.length,
    currentWorkNumber: currentIndex >= 0 ? currentIndex + 1 : 0,

    // 函数
    navigateToPrevious,
    navigateToNext,
    reloadWorks: loadAllWorks,
  };
};

export default useWorkNavigation;

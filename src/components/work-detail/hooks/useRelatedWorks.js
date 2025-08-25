// use-related-works v1: 相关作品管理Hook

import { useState, useEffect, useCallback } from 'react';

import { workService } from '../../../services';

/**
 * 相关作品管理Hook
 * @param {string} artistId - 艺术家ID
 * @param {string} currentWorkId - 当前作品ID
 * @param {number} maxWorks - 最大显示作品数量
 * @returns {Object} 相关作品状态和函数
 */
const useRelatedWorks = (artistId, currentWorkId, maxWorks = 4) => {
  // 相关作品状态
  const [relatedWorks, setRelatedWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取艺术家的所有作品并随机选择
  const loadRelatedWorks = useCallback(async () => {
    if (!artistId) {
      setRelatedWorks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await workService.getUserWorks(artistId);

      if (result.success && result.data) {
        // 过滤掉当前作品
        const filteredWorks = result.data.filter(
          work => work.id !== currentWorkId
        );

        if (filteredWorks.length === 0) {
          setRelatedWorks([]);
          return;
        }

        // 随机选择作品
        const shuffled = [...filteredWorks].sort(() => 0.5 - Math.random());
        const selectedWorks = shuffled.slice(
          0,
          Math.min(maxWorks, filteredWorks.length)
        );

        // 转换数据格式以匹配组件需求
        const formattedWorks = selectedWorks.map(work => ({
          id: work.id,
          title: work.title || 'Untitled',
          image:
            work.thumbnailPath || (work.imagePaths && work.imagePaths[0]) || '',
          category: work.category || 'Design',
        }));

        setRelatedWorks(formattedWorks);
        console.log(
          `[RelatedWorks] Loaded ${formattedWorks.length} related works for artist ${artistId}`
        );
      } else {
        setError('Failed to load related works');
        setRelatedWorks([]);
      }
    } catch (err) {
      console.error('[RelatedWorks] Error loading related works:', err);
      setError('Failed to load related works');
      setRelatedWorks([]);
    } finally {
      setLoading(false);
    }
  }, [artistId, currentWorkId, maxWorks]);

  // 初始化时加载相关作品
  useEffect(() => {
    loadRelatedWorks();
  }, [loadRelatedWorks]);

  return {
    // 状态
    relatedWorks,
    loading,
    error,

    // 函数
    reloadWorks: loadRelatedWorks,
  };
};

export default useRelatedWorks;

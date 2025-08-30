import { useState, useEffect } from 'react';

/**
 * 数据概览管理Hook
 * @returns {Object} 数据概览状态和方法
 */
export const useDataOverview = () => {
  const [dataOverview, setDataOverview] = useState({});

  // 获取数据概览
  const getDataOverview = () => {
    try {
      const allKeys = Object.keys(localStorage);

      const overview = {
        totalKeys: allKeys.length,
        users: {
          alice: 0,
          bryan: 0,
          alex: 0,
        },
        collaborations: 0,
        portfolios: 0,
        comments: 0,
        notifications: 0,
        likes: 0,
        views: 0,
        favorites: 0,
        other: 0,
      };

      allKeys.forEach(key => {
        if (key.includes('portfolio_')) {
          overview.portfolios++;
          const userId = key.replace('portfolio_', '');
          if (overview.users[userId] !== undefined) {
            overview.users[userId]++;
          }
        } else if (key.includes('collaboration')) {
          overview.collaborations++;
        } else if (key.includes('comment')) {
          overview.comments++;
        } else if (key.includes('notification')) {
          overview.notifications++;
        } else if (key.includes('like')) {
          overview.likes++;
        } else if (key.includes('view')) {
          overview.views++;
        } else if (key.includes('favorite')) {
          overview.favorites++;
        } else {
          overview.other++;
        }
      });

      return overview;
    } catch (error) {
      console.error('Error getting data overview:', error);
      return {};
    }
  };

  // 刷新数据概览
  const refreshDataOverview = () => {
    const overview = getDataOverview();
    setDataOverview(overview);
  };

  // 初始化数据概览
  useEffect(() => {
    refreshDataOverview();
  }, []);

  return {
    dataOverview,
    refreshDataOverview,
  };
};

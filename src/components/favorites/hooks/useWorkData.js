import { useState, useEffect } from 'react';

import { getAllPublicPortfolios } from '../../../services/supabase/portfolio';

/**
 * 获取作品数据的Hook
 * 用于收藏卡片显示正确的作品图片
 */
export const useWorkData = () => {
  const [worksData, setWorksData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 加载所有作品数据
  useEffect(() => {
    const loadWorksData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getAllPublicPortfolios();

        if (result.success) {
          // 将作品数据转换为以ID为键的对象
          const worksById = {};
          result.data.forEach(item => {
            if (item && item.id) {
              worksById[item.id] = {
                id: item.id,
                title: item.title || 'Untitled',
                artist: item.profiles?.full_name || 'Unknown Artist',
                image:
                  item.thumbnailPath ||
                  (item.imagePaths && item.imagePaths[0]) ||
                  '',
                category: item.category || 'design',
                tags: item.tags || [],
                description: item.description || '',
                createdAt: item.createdAt || new Date().toISOString(),
              };
            }
          });

          setWorksData(worksById);
          console.log('[useWorkData] Loaded works data:', worksById);
        } else {
          setError(result.error || 'Failed to load works data');
          console.error('[useWorkData] Failed to load works:', result.error);
        }
      } catch (error) {
        console.error('[useWorkData] Error loading works:', error);
        setError(error.message || 'Failed to load works data');
      } finally {
        setLoading(false);
      }
    };

    loadWorksData();
  }, []);

  // 根据itemId获取作品数据
  const getWorkById = itemId => {
    if (!itemId) return null;

    // 首先尝试从真实数据中获取
    const realWork = worksData[itemId];
    if (realWork) {
      console.log('[useWorkData] Found real work data for:', itemId, realWork);
      return realWork;
    }

    // 如果找不到真实数据，使用默认数据
    const defaultArtworks = [
      {
        id: 1,
        title: 'Explosive Energy',
        artist: 'Alex Chen',
        image:
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        category: 'Visual Effects',
      },
      {
        id: 2,
        title: 'Dark Knight',
        artist: 'Sarah Kim',
        image:
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
        category: 'Game Design',
      },
      {
        id: 3,
        title: 'Mobile UI Design',
        artist: 'Mike Johnson',
        image:
          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop',
        category: 'UI/UX',
      },
      {
        id: 4,
        title: 'Enchanted Forest',
        artist: 'Emma Wilson',
        image:
          'https://images.unsplash.com/photo-1489599435384-d5f1a131c7dc?w=400&h=400&fit=crop',
        category: 'Illustration',
      },
      {
        id: 5,
        title: 'Digital Sculpture',
        artist: 'David Lee',
        image:
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
        category: 'Fine Art',
      },
      {
        id: 6,
        title: 'Brand Identity',
        artist: 'Lisa Wang',
        image:
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
        category: 'Graphic Design',
      },
    ];

    // 尝试简单数字ID匹配
    const simpleMatch = defaultArtworks.find(
      art => art.id.toString() === itemId
    );
    if (simpleMatch) {
      console.log(
        '[useWorkData] Found default work for simple ID:',
        itemId,
        simpleMatch
      );
      return simpleMatch;
    }

    // 如果是复杂的mock ID，使用哈希映射
    if (itemId && itemId.startsWith('mock_')) {
      const imageIndex =
        Math.abs(itemId.split('_')[1] ? parseInt(itemId.split('_')[1]) : 0) %
        defaultArtworks.length;
      const selectedArtwork = defaultArtworks[imageIndex];

      const mockWork = {
        id: itemId,
        title: selectedArtwork.title,
        artist: selectedArtwork.artist,
        image: selectedArtwork.image,
        category: selectedArtwork.category,
      };

      console.log(
        '[useWorkData] Created mock work for complex ID:',
        itemId,
        mockWork
      );
      return mockWork;
    }

    console.warn('[useWorkData] No work found for itemId:', itemId);
    return null;
  };

  return {
    worksData,
    loading,
    error,
    getWorkById,
  };
};

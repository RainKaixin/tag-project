// tag-aggregation-page v1: 標籤聚合頁面

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { getTagStats, getWorksByTag } from '../services/tagService';
import { renderTagList } from '../utils/tagRenderer';

const TagAggregationPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [tagStats, setTagStats] = useState(null);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [worksCursor, setWorksCursor] = useState(null);
  const [hasMoreWorks, setHasMoreWorks] = useState(true);

  // 載入標籤統計
  const loadTagStats = async () => {
    try {
      const stats = await getTagStats(slug);
      setTagStats(stats);
    } catch (error) {
      console.error('Error loading tag stats:', error);
    }
  };

  // 載入作品
  const loadWorks = async (cursor = null) => {
    try {
      const result = await getWorksByTag(slug, {
        limit: 12,
        cursor,
      });

      if (cursor) {
        setWorks(prev => [...prev, ...result.items]);
      } else {
        setWorks(result.items);
      }

      setWorksCursor(result.cursor);
      setHasMoreWorks(result.hasMore);
    } catch (error) {
      console.error('Error loading works:', error);
    }
  };

  // 載入更多作品
  const loadMore = () => {
    if (hasMoreWorks) loadWorks(worksCursor);
  };

  // 標籤點擊處理
  const handleTagClick = tag => {
    navigate(`/t/${tag.slug}`);
  };

  // 初始化載入
  useEffect(() => {
    const initializePage = async () => {
      setLoading(true);
      await Promise.all([loadTagStats(), loadWorks()]);
      setLoading(false);
    };

    initializePage();
  }, [slug]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading tag content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>#{slug}</h1>
            {tagStats && (
              <p className='text-gray-600 mt-2'>{tagStats.works} works</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {works.map(work => (
              <div
                key={work.id}
                className='bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer'
                onClick={() => window.open(`/work/${work.id}`, '_blank')}
              >
                <div className='aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg'>
                  <img
                    src={work.image}
                    alt={work.title}
                    className='w-full h-48 object-cover rounded-t-lg'
                  />
                </div>
                <div className='p-4'>
                  <h3 className='font-medium text-gray-900 truncate'>
                    {work.title}
                  </h3>
                  <p className='text-sm text-gray-600 mt-1'>
                    by {work.author.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {hasMoreWorks && (
            <div className='text-center mt-8'>
              <button
                onClick={loadMore}
                className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700'
              >
                Load More Works
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagAggregationPage;

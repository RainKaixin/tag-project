// major-aggregation-page v1: 专业聚合页面

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { getArtworksByMajor } from '../services/majorService';

const MajorAggregationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMoreWorks, setHasMoreWorks] = useState(true);
  const [worksCursor, setWorksCursor] = useState(null);

  // 从 URL 参数获取筛选条件
  const categories = searchParams.get('categories')?.split(',') || [];
  const software = searchParams.get('software')?.split(',') || [];
  const sortBy = searchParams.get('sort') || 'latest';

  // 加载作品
  const loadWorks = async (cursor = null) => {
    try {
      setLoading(true);
      const result = await getArtworksByMajor({
        majors: categories,
        software: software,
        sortBy: sortBy,
        limit: 12,
        cursor: cursor,
      });

      if (cursor) {
        setWorks(prev => [...prev, ...result.items]);
      } else {
        setWorks(result.items);
      }

      setWorksCursor(result.cursor);
      setHasMoreWorks(result.hasMore);
      setError(null);
    } catch (error) {
      console.error('Error loading works by major:', error);
      setError('Failed to load works');
    } finally {
      setLoading(false);
    }
  };

  // 加载更多作品
  const loadMore = () => {
    if (hasMoreWorks) {
      loadWorks(worksCursor);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadWorks();
  }, [categories.join(','), software.join(','), sortBy]);

  // 生成页面标题
  const getPageTitle = () => {
    if (categories.length === 0 && software.length === 0) {
      return 'All Works';
    }

    const parts = [];
    if (categories.length > 0) {
      parts.push(`Major: ${categories.join(', ')}`);
    }
    if (software.length > 0) {
      parts.push(`Software: ${software.join(', ')}`);
    }
    return parts.join(' | ');
  };

  // 生成作品统计
  const getWorksCount = () => {
    if (works.length === 0) return '0 works';
    if (works.length === 1) return '1 work';
    return `${works.length} works`;
  };

  if (loading && works.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading works...</p>
        </div>
      </div>
    );
  }

  if (error && works.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-600 text-lg font-semibold mb-2'>Error</div>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={() => loadWorks()}
            className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                {getPageTitle()}
              </h1>
              <p className='text-gray-600 mt-2'>{getWorksCount()}</p>

              {/* 筛选条件显示 */}
              {(categories.length > 0 || software.length > 0) && (
                <div className='flex flex-wrap gap-2 mt-3'>
                  {categories.map(category => (
                    <span
                      key={category}
                      className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                    >
                      {category}
                    </span>
                  ))}
                  {software.map(sw => (
                    <span
                      key={sw}
                      className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 返回按钮 */}
            <button
              onClick={() => window.history.back()}
              className='flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200'
            >
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 19l-7-7m0 0l7-7m-7 7h18'
                />
              </svg>
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {works.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-gray-400 text-6xl mb-4'>🎨</div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No works found
            </h3>
            <p className='text-gray-600'>
              No works match the selected criteria. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <>
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
                      onError={e => {
                        e.target.src = '/assets/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className='p-4'>
                    <h3 className='font-medium text-gray-900 truncate'>
                      {work.title}
                    </h3>
                    <p className='text-sm text-gray-600 mt-1'>
                      by {work.author.name}
                    </p>
                    {work.author.majors && work.author.majors.length > 0 && (
                      <div className='flex flex-wrap gap-1 mt-2'>
                        {work.author.majors.slice(0, 2).map(major => (
                          <span
                            key={major}
                            className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800'
                          >
                            {major}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreWorks && (
              <div className='text-center mt-8'>
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200'
                >
                  {loading ? 'Loading...' : 'Load More Works'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MajorAggregationPage;

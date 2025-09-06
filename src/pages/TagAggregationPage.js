// tag-aggregation-page v2: 多維度聚合頁面

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

import {
  getAggregationStats,
  getAggregationWorks,
  parseAggregationParams,
  generateAggregationTitle,
  generateAggregationDescription,
  validateAggregationConfig,
} from '../services/aggregationService';
import { getTagStats, getWorksByTag } from '../services/tagService';
import { extractTags } from '../utils/tagParser';
import { renderTagList, renderWithTags } from '../utils/tagRenderer';

const TagAggregationPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [aggregationConfig, setAggregationConfig] = useState(null);
  const [stats, setStats] = useState(null);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [worksCursor, setWorksCursor] = useState(null);
  const [hasMoreWorks, setHasMoreWorks] = useState(true);

  // 解析聚合參數
  useEffect(() => {
    const params = {
      slug,
      type: searchParams.get('type'),
      value: searchParams.get('value'),
      major: searchParams.get('major'),
      software: searchParams.getAll('software'),
      tags: searchParams.getAll('tags'),
    };

    // 根據路由確定聚合類型
    let config;
    if (params.type && params.value) {
      // 直接指定類型和值
      config = parseAggregationParams(params);
    } else if (params.major) {
      // 專業聚合路由 /major/:major
      config = {
        type: 'major',
        value: params.major,
        filters: {},
      };
    } else if (params.slug && window.location.pathname.includes('/software/')) {
      // 軟件聚合路由 /software/:software
      config = {
        type: 'software',
        value: params.slug,
        filters: {},
      };
    } else if (
      params.major ||
      params.software.length > 0 ||
      params.tags.length > 0
    ) {
      // 組合查詢
      config = parseAggregationParams(params);
    } else {
      // 默認為標籤聚合
      config = {
        type: 'tag',
        value: params.slug || '',
        filters: {},
      };
    }

    setAggregationConfig(config);
  }, [slug, searchParams]);

  // 載入聚合統計
  const loadStats = async () => {
    if (!aggregationConfig || !validateAggregationConfig(aggregationConfig)) {
      console.error('Invalid aggregation config:', aggregationConfig);
      return;
    }

    try {
      const stats = await getAggregationStats(
        aggregationConfig.type,
        aggregationConfig.value,
        aggregationConfig.filters
      );
      setStats(stats);
    } catch (error) {
      console.error('Error loading aggregation stats:', error);
    }
  };

  // 載入作品
  const loadWorks = async (cursor = null) => {
    if (!aggregationConfig || !validateAggregationConfig(aggregationConfig)) {
      console.error('Invalid aggregation config:', aggregationConfig);
      return;
    }

    try {
      const result = await getAggregationWorks(
        aggregationConfig.type,
        aggregationConfig.value,
        { limit: 12, cursor },
        aggregationConfig.filters
      );

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

  // 當聚合配置改變時重新載入數據
  useEffect(() => {
    if (aggregationConfig) {
      const initializePage = async () => {
        setLoading(true);
        await Promise.all([loadStats(), loadWorks()]);
        setLoading(false);
      };

      initializePage();
    }
  }, [aggregationConfig]);

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
            <h1 className='text-3xl font-bold text-gray-900'>
              {aggregationConfig
                ? generateAggregationTitle(aggregationConfig)
                : `#${slug}`}
            </h1>
            {stats && (
              <p className='text-gray-600 mt-2'>
                {generateAggregationDescription(aggregationConfig, stats)}
              </p>
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

                  {/* Tags */}
                  {work.tags && work.tags.length > 0 && (
                    <div className='mt-3 flex flex-wrap gap-1'>
                      {work.tags.map((tag, index) => {
                        // 判断标签类型：以#开头的是Tags，否则是Software
                        const isTag = tag.startsWith('#');

                        if (isTag) {
                          // 使用標籤解析器處理可點擊的標籤
                          const parsedTags = extractTags(tag);
                          if (parsedTags.length > 0) {
                            return (
                              <div key={index} className='inline-block'>
                                {renderTagList(
                                  parsedTags,
                                  handleTagClick,
                                  'px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium hover:bg-blue-200 cursor-pointer'
                                )}
                              </div>
                            );
                          }
                        } else {
                          // Software標籤，不可點擊
                          return (
                            <span
                              key={index}
                              className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                            >
                              {tag}
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
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

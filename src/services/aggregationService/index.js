// 統一聚合查詢服務
// 支持標籤、專業、軟件的多維度聚合

import {
  getTagStats,
  getWorksByTag,
  getMajorStats,
  getWorksByMajor,
  getSoftwareStats,
  getWorksBySoftware,
  getWorksByCombination,
} from '../tagService/index.js';

/**
 * 聚合類型枚舉
 */
export const AGGREGATION_TYPES = {
  TAG: 'tag',
  MAJOR: 'major',
  SOFTWARE: 'software',
  COMBINED: 'combined',
};

/**
 * 獲取聚合統計信息
 * @param {string} type - 聚合類型
 * @param {string} value - 聚合值
 * @param {Object} filters - 額外篩選條件（用於組合查詢）
 * @returns {Promise<Object>} 統計信息
 */
export const getAggregationStats = async (type, value, filters = {}) => {
  try {
    console.log(`[AggregationService] Getting stats for ${type}: ${value}`);

    switch (type) {
      case AGGREGATION_TYPES.TAG:
        return await getTagStats(value);

      case AGGREGATION_TYPES.MAJOR:
        return await getMajorStats(value);

      case AGGREGATION_TYPES.SOFTWARE:
        return await getSoftwareStats(value);

      case AGGREGATION_TYPES.COMBINED: {
        // 組合查詢的統計需要特殊處理
        const { major, software, tags } = filters;
        let totalWorks = 0;

        if (major) {
          const majorStats = await getMajorStats(major);
          totalWorks = majorStats.works;
        }

        if (software && software.length > 0) {
          // 這裡可以實現更複雜的組合統計邏輯
          // 暫時返回軟件統計
          const softwareStats = await getSoftwareStats(software[0]);
          totalWorks = softwareStats.works;
        }

        return {
          works: totalWorks,
          users: 0, // 組合查詢的用戶統計較複雜，暫時設為0
          projects: 0,
        };
      }

      default:
        throw new Error(`Unsupported aggregation type: ${type}`);
    }
  } catch (error) {
    console.error(
      `[AggregationService] Error getting stats for ${type}:`,
      error
    );
    return { works: 0, users: 0, projects: 0 };
  }
};

/**
 * 獲取聚合作品列表
 * @param {string} type - 聚合類型
 * @param {string} value - 聚合值
 * @param {Object} options - 查詢選項
 * @param {Object} filters - 額外篩選條件
 * @returns {Promise<Object>} 作品列表和分頁信息
 */
export const getAggregationWorks = async (
  type,
  value,
  options = {},
  filters = {}
) => {
  try {
    console.log(`[AggregationService] Getting works for ${type}: ${value}`);

    switch (type) {
      case AGGREGATION_TYPES.TAG:
        return await getWorksByTag(value, options);

      case AGGREGATION_TYPES.MAJOR:
        return await getWorksByMajor(value, options);

      case AGGREGATION_TYPES.SOFTWARE:
        return await getWorksBySoftware(value, options);

      case AGGREGATION_TYPES.COMBINED:
        return await getWorksByCombination(filters, options);

      default:
        throw new Error(`Unsupported aggregation type: ${type}`);
    }
  } catch (error) {
    console.error(
      `[AggregationService] Error getting works for ${type}:`,
      error
    );
    return { items: [], hasMore: false, cursor: null };
  }
};

/**
 * 解析聚合URL參數
 * @param {Object} params - URL參數
 * @returns {Object} 解析後的聚合配置
 */
export const parseAggregationParams = params => {
  const { type, value, major, software, tags } = params;

  // 確定聚合類型
  let aggregationType;
  let aggregationValue;
  let filters = {};

  if (type && value) {
    // 直接指定類型和值
    aggregationType = type;
    aggregationValue = value;
  } else if (major || software || tags) {
    // 組合查詢
    aggregationType = AGGREGATION_TYPES.COMBINED;
    aggregationValue = 'combined';
    filters = {
      major: major || null,
      software: software
        ? Array.isArray(software)
          ? software
          : [software]
        : [],
      tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
    };
  } else {
    // 默認為標籤聚合
    aggregationType = AGGREGATION_TYPES.TAG;
    aggregationValue = value || '';
  }

  return {
    type: aggregationType,
    value: aggregationValue,
    filters,
  };
};

/**
 * 生成聚合頁面標題
 * @param {Object} config - 聚合配置
 * @returns {string} 頁面標題
 */
export const generateAggregationTitle = config => {
  const { type, value, filters } = config;

  switch (type) {
    case AGGREGATION_TYPES.TAG:
      return `#${value}`;

    case AGGREGATION_TYPES.MAJOR:
      return value;

    case AGGREGATION_TYPES.SOFTWARE:
      return value;

    case AGGREGATION_TYPES.COMBINED: {
      const parts = [];
      if (filters.major) parts.push(filters.major);
      if (filters.software && filters.software.length > 0) {
        parts.push(filters.software.join(' + '));
      }
      if (filters.tags && filters.tags.length > 0) {
        parts.push(filters.tags.map(tag => `#${tag}`).join(' + '));
      }
      return parts.join(' + ');
    }

    default:
      return 'Aggregation';
  }
};

/**
 * 生成聚合頁面描述
 * @param {Object} config - 聚合配置
 * @param {Object} stats - 統計信息
 * @returns {string} 頁面描述
 */
export const generateAggregationDescription = (config, stats) => {
  const { type, value, filters } = config;
  const { works, users } = stats;

  switch (type) {
    case AGGREGATION_TYPES.TAG:
      return `Discover ${works} works tagged with #${value} from ${users} artists`;

    case AGGREGATION_TYPES.MAJOR:
      return `Explore ${works} works by ${value} professionals from ${users} artists`;

    case AGGREGATION_TYPES.SOFTWARE:
      return `Browse ${works} works created with ${value} from ${users} artists`;

    case AGGREGATION_TYPES.COMBINED: {
      const parts = [];
      if (filters.major) parts.push(`${filters.major} professionals`);
      if (filters.software && filters.software.length > 0) {
        parts.push(`${filters.software.join(', ')} users`);
      }
      if (filters.tags && filters.tags.length > 0) {
        parts.push(
          `${filters.tags.map(tag => `#${tag}`).join(', ')} tagged works`
        );
      }
      return `Find ${works} works matching: ${parts.join(' + ')}`;
    }

    default:
      return `Browse ${works} works`;
  }
};

/**
 * 檢查聚合參數是否有效
 * @param {Object} config - 聚合配置
 * @returns {boolean} 是否有效
 */
export const validateAggregationConfig = config => {
  const { type, value, filters } = config;

  switch (type) {
    case AGGREGATION_TYPES.TAG:
    case AGGREGATION_TYPES.MAJOR:
    case AGGREGATION_TYPES.SOFTWARE:
      return value && value.trim().length > 0;

    case AGGREGATION_TYPES.COMBINED:
      return (
        filters.major ||
        (filters.software && filters.software.length > 0) ||
        (filters.tags && filters.tags.length > 0)
      );

    default:
      return false;
  }
};

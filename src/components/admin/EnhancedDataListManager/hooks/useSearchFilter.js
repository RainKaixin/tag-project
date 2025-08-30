import { useState, useMemo } from 'react';

/**
 * 搜索和过滤逻辑Hook
 * @param {Array} dataList - 原始数据列表
 * @returns {Object} 搜索过滤状态和方法
 */
export const useSearchFilter = dataList => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'table'

  // 获取所有项目（扁平化数据）
  const allItems = useMemo(() => {
    return dataList.flatMap(group => group.items || []);
  }, [dataList]);

  // 过滤和排序后的项目
  const sortedItems = useMemo(() => {
    let filtered = allItems;

    // 搜索过滤
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.title?.toLowerCase().includes(term) ||
          item.creator?.toLowerCase().includes(term) ||
          item.createdAt?.toLowerCase().includes(term)
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // 处理数字类型
      if (sortBy === 'size') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else {
        // 字符串类型
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [allItems, searchTerm, sortBy, sortOrder]);

  // 切换排序顺序
  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // 切换视图模式
  const toggleViewMode = () => {
    setViewMode(prev => (prev === 'list' ? 'table' : 'list'));
  };

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    allItems,
    sortedItems,
    toggleSortOrder,
    toggleViewMode,
  };
};

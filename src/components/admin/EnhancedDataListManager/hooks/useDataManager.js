import { useState, useEffect, useCallback } from 'react';

import { filterKeysByDataType, buildDataList } from '../utils/dataParser';

/**
 * 数据管理逻辑Hook
 * @param {string} dataType - 数据类型
 * @returns {Object} 数据管理状态和方法
 */
export const useDataManager = dataType => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 加载数据列表
  const loadDataList = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      const filteredKeys = filterKeysByDataType(dataType);
      const list = buildDataList(filteredKeys, dataType);

      setDataList(list);
    } catch (err) {
      console.error('加载数据列表失败:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dataType]);

  // 重新加载数据
  const reloadData = useCallback(() => {
    loadDataList();
  }, [loadDataList]);

  // 当数据类型改变时重新加载
  useEffect(() => {
    loadDataList();
  }, [loadDataList]);

  return {
    dataList,
    loading,
    error,
    reloadData,
  };
};

// collaboration-service-hooks v1: 協作項目服務 Hook
// 提供協作項目的狀態管理和操作接口

import { useState, useEffect, useCallback } from 'react';

import {
  createCollaboration,
  getCollaborations,
  getCollaborationById,
  updateCollaboration,
  deleteCollaboration,
  likeCollaboration,
  getCollaborationStats,
  resetMockData,
} from '../index';

/**
 * 協作項目服務 Hook
 * @param {Object} options - 初始選項
 * @returns {Object} 服務狀態和方法
 */
export const useCollaborationService = (options = {}) => {
  // 狀態管理
  const [collaborations, setCollaborations] = useState([]);
  const [currentCollaboration, setCurrentCollaboration] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // 查詢選項
  const [queryOptions, setQueryOptions] = useState({
    page: 1,
    limit: 12,
    status: 'active',
    authorId: null,
    searchTerm: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...options,
  });

  /**
   * 獲取協作項目列表
   */
  const fetchCollaborations = useCallback(
    async (newOptions = {}) => {
      setLoading(true);
      setError(null);

      try {
        const updatedOptions = { ...queryOptions, ...newOptions };
        setQueryOptions(updatedOptions);

        const response = await getCollaborations(updatedOptions);

        if (response.success) {
          setCollaborations(response.data);
          setPagination(response.pagination);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch collaborations');
      } finally {
        setLoading(false);
      }
    },
    [queryOptions]
  );

  /**
   * 獲取協作項目詳情
   */
  const fetchCollaborationById = useCallback(async id => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCollaborationById(id);

      if (response.success) {
        setCurrentCollaboration(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch collaboration details');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 創建協作項目
   */
  const createNewCollaboration = useCallback(
    async formData => {
      setLoading(true);
      setError(null);

      try {
        const response = await createCollaboration(formData);

        if (response.success) {
          // 重新獲取列表以顯示新項目
          await fetchCollaborations({ page: 1 });
          return { success: true, data: response.data };
        } else {
          setError(response.error);
          return { success: false, errors: response.data };
        }
      } catch (err) {
        const errorMsg = err.message || 'Failed to create collaboration';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [fetchCollaborations]
  );

  /**
   * 更新協作項目
   */
  const updateExistingCollaboration = useCallback(
    async (id, updateData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await updateCollaboration(id, updateData);

        if (response.success) {
          // 更新當前詳情
          if (currentCollaboration?.id === id) {
            setCurrentCollaboration(response.data);
          }
          // 重新獲取列表
          await fetchCollaborations();
          return { success: true, data: response.data };
        } else {
          setError(response.error);
          return { success: false, errors: response.data };
        }
      } catch (err) {
        const errorMsg = err.message || 'Failed to update collaboration';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [currentCollaboration, fetchCollaborations]
  );

  /**
   * 刪除協作項目
   */
  const deleteExistingCollaboration = useCallback(
    async id => {
      setLoading(true);
      setError(null);

      try {
        const response = await deleteCollaboration(id);

        if (response.success) {
          // 清除當前詳情（如果是被刪除的項目）
          if (currentCollaboration?.id === id) {
            setCurrentCollaboration(null);
          }
          // 重新獲取列表
          await fetchCollaborations();
          return { success: true };
        } else {
          setError(response.error);
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = err.message || 'Failed to delete collaboration';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [currentCollaboration, fetchCollaborations]
  );

  /**
   * 點讚協作項目
   */
  const likeExistingCollaboration = useCallback(
    async id => {
      try {
        const response = await likeCollaboration(id);

        if (response.success) {
          // 更新列表中的點讚數
          setCollaborations(prev =>
            prev.map(collab =>
              collab.id === id
                ? { ...collab, likes: response.data.likes }
                : collab
            )
          );

          // 更新當前詳情中的點讚數
          if (currentCollaboration?.id === id) {
            setCurrentCollaboration(prev => ({
              ...prev,
              likes: response.data.likes,
            }));
          }

          return { success: true, likes: response.data.likes };
        } else {
          return { success: false, error: response.error };
        }
      } catch (err) {
        return {
          success: false,
          error: err.message || 'Failed to like collaboration',
        };
      }
    },
    [currentCollaboration]
  );

  /**
   * 獲取統計信息
   */
  const fetchStats = useCallback(async () => {
    try {
      const response = await getCollaborationStats();

      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  /**
   * 重置 Mock 數據
   */
  const resetData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await resetMockData();

      if (response.success) {
        // 重新獲取數據
        await fetchCollaborations({ page: 1 });
        await fetchStats();
        return { success: true };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to reset data';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [fetchCollaborations, fetchStats]);

  /**
   * 搜索協作項目
   */
  const searchCollaborations = useCallback(
    searchTerm => {
      fetchCollaborations({ searchTerm, page: 1 });
    },
    [fetchCollaborations]
  );

  /**
   * 篩選協作項目
   */
  const filterCollaborations = useCallback(
    filters => {
      fetchCollaborations({ ...filters, page: 1 });
    },
    [fetchCollaborations]
  );

  /**
   * 排序協作項目
   */
  const sortCollaborations = useCallback(
    (sortBy, sortOrder = 'desc') => {
      fetchCollaborations({ sortBy, sortOrder, page: 1 });
    },
    [fetchCollaborations]
  );

  /**
   * 分頁導航
   */
  const goToPage = useCallback(
    page => {
      fetchCollaborations({ page });
    },
    [fetchCollaborations]
  );

  /**
   * 清除錯誤
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 清除當前詳情
   */
  const clearCurrentCollaboration = useCallback(() => {
    setCurrentCollaboration(null);
  }, []);

  // 初始化加載
  useEffect(() => {
    fetchCollaborations();
    fetchStats();
  }, []); // 只在組件掛載時執行一次

  return {
    // 狀態
    collaborations,
    currentCollaboration,
    stats,
    loading,
    error,
    pagination,
    queryOptions,

    // 方法
    fetchCollaborations,
    fetchCollaborationById,
    createNewCollaboration,
    updateExistingCollaboration,
    deleteExistingCollaboration,
    likeExistingCollaboration,
    fetchStats,
    resetData,
    searchCollaborations,
    filterCollaborations,
    sortCollaborations,
    goToPage,
    clearError,
    clearCurrentCollaboration,

    // 便捷方法
    hasNextPage: pagination.hasNext,
    hasPrevPage: pagination.hasPrev,
    currentPage: pagination.page,
    totalPages: pagination.totalPages,
    totalItems: pagination.total,
  };
};

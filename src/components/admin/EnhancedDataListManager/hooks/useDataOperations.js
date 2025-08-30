import { useState, useCallback } from 'react';

/**
 * 数据操作逻辑Hook
 * @param {Array} sortedItems - 排序后的项目列表
 * @param {Function} onDeleteSelected - 删除选中项的回调
 * @param {Function} reloadData - 重新加载数据的函数
 * @returns {Object} 数据操作状态和方法
 */
export const useDataOperations = (
  sortedItems,
  onDeleteSelected,
  reloadData
) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // 切换单个项目选择状态
  const toggleItemSelection = useCallback(itemId => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []);

  // 切换全选状态
  const toggleSelectAll = useCallback(() => {
    if (selectedItems.length === sortedItems.length && sortedItems.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedItems.map(item => item.id));
    }
  }, [selectedItems.length, sortedItems]);

  // 处理删除选中项
  const handleDeleteSelected = useCallback(() => {
    if (selectedItems.length > 0) {
      setShowConfirmDialog(true);
    }
  }, [selectedItems.length]);

  // 确认删除
  const confirmDelete = useCallback(() => {
    if (selectedItems.length > 0) {
      // 按组删除选中的项目
      const itemsToDelete = selectedItems.map(itemId => {
        const item = sortedItems.find(i => i.id === itemId);
        return { groupKey: item.groupKey, itemId: itemId };
      });

      // 从localStorage中删除
      itemsToDelete.forEach(({ groupKey, itemId }) => {
        try {
          const currentData = JSON.parse(localStorage.getItem(groupKey));

          // 处理草稿数据（对象格式）
          if (groupKey.includes('draft') && typeof currentData === 'object') {
            // 草稿数据是按用户ID分组的对象
            let foundAndDeleted = false;
            Object.keys(currentData).forEach(userId => {
              const userDrafts = currentData[userId];
              if (Array.isArray(userDrafts)) {
                const originalLength = userDrafts.length;
                const filteredDrafts = userDrafts.filter(
                  draft => draft.id !== itemId
                );
                if (filteredDrafts.length < originalLength) {
                  currentData[userId] = filteredDrafts;
                  foundAndDeleted = true;
                  console.log(`删除了用户 ${userId} 的草稿 ${itemId}`);
                }
              }
            });
            if (foundAndDeleted) {
              localStorage.setItem(groupKey, JSON.stringify(currentData));
            }
          }
          // 处理数组格式的数据
          else if (Array.isArray(currentData)) {
            const filteredData = currentData.filter(
              item => (item.id || item.collaborationId) !== itemId
            );
            localStorage.setItem(groupKey, JSON.stringify(filteredData));
          }
        } catch (error) {
          console.error('Error deleting item:', error);
        }
      });

      // 重新加载数据
      if (reloadData) {
        reloadData();
      }

      // 清空选择
      setSelectedItems([]);

      // 调用父组件的回调
      if (onDeleteSelected) {
        onDeleteSelected(selectedItems.length);
      }
    }
    setShowConfirmDialog(false);
  }, [selectedItems, onDeleteSelected, reloadData, sortedItems]);

  // 取消删除
  const cancelDelete = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  // 清空选择
  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  return {
    selectedItems,
    showConfirmDialog,
    toggleItemSelection,
    toggleSelectAll,
    handleDeleteSelected,
    confirmDelete,
    cancelDelete,
    clearSelection,
  };
};

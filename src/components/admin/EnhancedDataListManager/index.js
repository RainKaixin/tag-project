import React from 'react';

import ConfirmDialog from '../../common/ConfirmDialog';

import ActionBar from './components/ActionBar';
import DataList from './components/DataList';
import Toolbar from './components/Toolbar';
import { useDataManager } from './hooks/useDataManager';
import { useDataOperations } from './hooks/useDataOperations';
import { useSearchFilter } from './hooks/useSearchFilter';

/**
 * 增强版数据列表管理组件
 * @param {Object} props - 组件属性
 * @param {string} props.dataType - 数据类型
 * @param {Function} props.onDeleteSelected - 删除选中项的回调
 */
const EnhancedDataListManager = ({ dataType, onDeleteSelected }) => {
  // 使用自定义hooks
  const { dataList, loading, error, reloadData } = useDataManager(dataType);
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    viewMode,
    toggleViewMode,
    allItems,
    sortedItems,
  } = useSearchFilter(dataList);
  const {
    selectedItems,
    showConfirmDialog,
    toggleItemSelection,
    toggleSelectAll,
    handleDeleteSelected,
    confirmDelete,
    cancelDelete,
  } = useDataOperations(sortedItems, onDeleteSelected, reloadData);

  // 加载状态
  if (loading) {
    return (
      <div className='bg-white rounded-lg shadow'>
        <div className='p-8 text-center text-gray-500'>加载中...</div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className='bg-white rounded-lg shadow'>
        <div className='p-8 text-center text-red-500'>加载失败: {error}</div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow'>
      {/* 工具栏 */}
      <Toolbar
        dataType={dataType}
        totalItems={allItems.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        toggleSortOrder={toggleSortOrder}
        viewMode={viewMode}
        toggleViewMode={toggleViewMode}
      />

      {/* 操作栏 */}
      <ActionBar
        selectedItems={selectedItems}
        sortedItems={sortedItems}
        toggleSelectAll={toggleSelectAll}
        handleDeleteSelected={handleDeleteSelected}
      />

      {/* 数据列表 */}
      <div className='max-h-96 overflow-y-auto'>
        <DataList
          items={sortedItems}
          selectedItems={selectedItems}
          toggleItemSelection={toggleItemSelection}
          viewMode={viewMode}
        />
      </div>

      {/* 确认对话框 */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title='确认删除'
        message={`确定要删除选中的 ${selectedItems.length} 个项目吗？\n\n此操作不可撤销！`}
        confirmText='确认删除'
        cancelText='取消'
        type='danger'
      />
    </div>
  );
};

export default EnhancedDataListManager;

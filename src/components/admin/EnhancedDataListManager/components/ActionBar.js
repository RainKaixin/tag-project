import React from 'react';

/**
 * 操作栏组件
 * @param {Object} props - 组件属性
 * @param {Array} props.selectedItems - 选中的项目
 * @param {Array} props.sortedItems - 排序后的项目
 * @param {Function} props.toggleSelectAll - 切换全选
 * @param {Function} props.handleDeleteSelected - 处理删除选中项
 */
const ActionBar = ({
  selectedItems,
  sortedItems,
  toggleSelectAll,
  handleDeleteSelected,
}) => {
  return (
    <div className='p-4 border-b border-gray-200 bg-gray-50'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <label className='flex items-center'>
            <input
              type='checkbox'
              checked={
                selectedItems.length === sortedItems.length &&
                sortedItems.length > 0
              }
              onChange={toggleSelectAll}
              className='mr-2'
            />
            全选
          </label>
          <span className='text-sm text-gray-600'>
            已选择 {selectedItems.length} 项
          </span>
        </div>

        <button
          onClick={handleDeleteSelected}
          disabled={selectedItems.length === 0}
          className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          🗑️ 删除选中 ({selectedItems.length})
        </button>
      </div>
    </div>
  );
};

export default ActionBar;

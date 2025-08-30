import React from 'react';

/**
 * 工具栏组件
 * @param {Object} props - 组件属性
 * @param {string} props.dataType - 数据类型
 * @param {number} props.totalItems - 总项目数
 * @param {string} props.searchTerm - 搜索词
 * @param {Function} props.setSearchTerm - 设置搜索词
 * @param {string} props.sortBy - 排序字段
 * @param {Function} props.setSortBy - 设置排序字段
 * @param {string} props.sortOrder - 排序顺序
 * @param {Function} props.toggleSortOrder - 切换排序顺序
 * @param {string} props.viewMode - 视图模式
 * @param {Function} props.toggleViewMode - 切换视图模式
 */
const Toolbar = ({
  dataType,
  totalItems,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  toggleSortOrder,
  viewMode,
  toggleViewMode,
}) => {
  // 获取数据类型标题
  const getDataTypeTitle = () => {
    switch (dataType) {
      case 'collaborations':
        return '协作项目数据管理';
      case 'portfolios':
        return '作品数据管理';
      case 'comments':
        return '评论数据管理';
      case 'notifications':
        return '通知数据管理';
      case 'likes':
        return '点赞数据管理';
      case 'views':
        return '浏览统计数据管理';
      case 'drafts':
        return '协作草稿数据管理';
      default:
        return '数据管理';
    }
  };

  return (
    <div className='p-4 border-b border-gray-200'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex items-center space-x-4'>
          <h3 className='text-lg font-semibold text-gray-800'>
            {getDataTypeTitle()}
          </h3>
          <span className='text-sm text-gray-500'>共 {totalItems} 个项目</span>
        </div>

        <div className='flex items-center space-x-2'>
          <input
            type='text'
            placeholder='搜索项目...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='px-3 py-1 border border-gray-300 rounded text-sm'
          />

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className='px-3 py-1 border border-gray-300 rounded text-sm'
          >
            <option value='title'>按标题</option>
            <option value='creator'>按创建者</option>
            <option value='createdAt'>按时间</option>
            <option value='size'>按大小</option>
          </select>

          <button
            onClick={toggleSortOrder}
            className='px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50'
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          <button
            onClick={toggleViewMode}
            className='px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50'
          >
            {viewMode === 'list' ? '📋 表格' : '📝 列表'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;

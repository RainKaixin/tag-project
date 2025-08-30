import React from 'react';

import EnhancedDataListManager from '../../../components/admin/EnhancedDataListManager';

/**
 * 数据管理器弹窗组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.showDataManager - 是否显示数据管理器
 * @param {string} props.currentDataType - 当前数据类型
 * @param {Function} props.onClose - 关闭弹窗回调
 * @param {Function} props.onDeleteSelected - 删除选中项回调
 */
const DataManagerModal = ({
  showDataManager,
  currentDataType,
  onClose,
  onDeleteSelected,
}) => {
  if (!showDataManager) return null;

  const getDataTypeTitle = () => {
    switch (currentDataType) {
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
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden'>
        <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
          <h2 className='text-xl font-semibold text-gray-800'>
            {getDataTypeTitle()}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 text-2xl'
          >
            ×
          </button>
        </div>
        <div className='p-4 overflow-y-auto max-h-[calc(90vh-80px)]'>
          <EnhancedDataListManager
            dataType={currentDataType}
            onDeleteSelected={onDeleteSelected}
          />
        </div>
      </div>
    </div>
  );
};

export default DataManagerModal;

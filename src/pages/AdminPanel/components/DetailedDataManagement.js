import React from 'react';

/**
 * 详细数据管理区域组件
 * @param {Object} props - 组件属性
 * @param {Function} props.openDataManager - 打开数据管理器
 */
const DetailedDataManagement = ({ openDataManager }) => {
  return (
    <div className='bg-white rounded-lg shadow mb-8'>
      <div className='p-6 border-b'>
        <h2 className='text-xl font-semibold text-gray-800'>详细数据管理</h2>
        <p className='text-gray-600 mt-2'>查看和选择性删除特定数据项</p>
      </div>
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <button
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
            onClick={() => openDataManager('collaborations')}
          >
            📋 管理协作项目数据
          </button>
          <button
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
            onClick={() => openDataManager('portfolios')}
          >
            📋 管理作品数据
          </button>
          <button
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
            onClick={() => openDataManager('comments')}
          >
            📋 管理评论数据
          </button>
          <button
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
            onClick={() => openDataManager('notifications')}
          >
            📋 管理通知数据
          </button>
          <button
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
            onClick={() => openDataManager('likes')}
          >
            📋 管理点赞数据
          </button>
          <button
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
            onClick={() => openDataManager('views')}
          >
            📋 管理浏览记录数据
          </button>
          <button
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
            onClick={() => openDataManager('drafts')}
          >
            📋 管理协作草稿数据
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedDataManagement;

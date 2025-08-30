import React from 'react';

/**
 * 数据概览卡片组件
 * @param {Object} props - 组件属性
 * @param {Object} props.dataOverview - 数据概览对象
 */
const DataOverviewCards = ({ dataOverview }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
      <div className='bg-white p-6 rounded-lg shadow'>
        <h3 className='text-lg font-semibold text-gray-800'>总数据项</h3>
        <p className='text-3xl font-bold text-blue-600'>
          {dataOverview.totalKeys || 0}
        </p>
      </div>
      <div className='bg-white p-6 rounded-lg shadow'>
        <h3 className='text-lg font-semibold text-gray-800'>作品集</h3>
        <p className='text-3xl font-bold text-green-600'>
          {dataOverview.portfolios || 0}
        </p>
      </div>
      <div className='bg-white p-6 rounded-lg shadow'>
        <h3 className='text-lg font-semibold text-gray-800'>协作项目</h3>
        <p className='text-3xl font-bold text-purple-600'>
          {dataOverview.collaborations || 0}
        </p>
      </div>
      <div className='bg-white p-6 rounded-lg shadow'>
        <h3 className='text-lg font-semibold text-gray-800'>其他数据</h3>
        <p className='text-3xl font-bold text-orange-600'>
          {dataOverview.other || 0}
        </p>
      </div>
    </div>
  );
};

export default DataOverviewCards;

import React from 'react';

/**
 * 用户数据概览组件
 * @param {Object} props - 组件属性
 * @param {Object} props.dataOverview - 数据概览对象
 */
const UserDataOverview = ({ dataOverview }) => {
  return (
    <div className='bg-white rounded-lg shadow mb-8'>
      <div className='p-6 border-b'>
        <h2 className='text-xl font-semibold text-gray-800'>用户数据概览</h2>
      </div>
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {Object.entries(dataOverview.users || {}).map(([user, count]) => (
            <div
              key={user}
              className='flex justify-between items-center p-4 bg-gray-50 rounded'
            >
              <span className='font-medium text-gray-700 capitalize'>
                {user}
              </span>
              <span className='text-lg font-bold text-blue-600'>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDataOverview;

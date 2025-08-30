import React from 'react';

/**
 * 管理员面板头部组件
 * @param {Object} props - 组件属性
 * @param {Object} props.authData - 认证数据
 * @param {Function} props.onLogout - 退出登录回调
 */
const AdminHeader = ({ authData, onLogout }) => {
  return (
    <div className='bg-red-600 text-white p-4'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold'>🔧 超级管理员测试面板</h1>
          <p className='text-red-100'>具有最高权限的数据管理工具</p>
        </div>
        <div className='flex items-center space-x-4'>
          <span className='text-red-100'>
            欢迎，{authData?.username || '管理员'}
          </span>
          <button
            onClick={onLogout}
            className='bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded transition-colors'
          >
            🚪 退出登录
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;

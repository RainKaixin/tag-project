// AdminLogin.js - 管理员登录组件

import React, { useState } from 'react';

const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 管理员凭据（硬编码，只有您知道）
  const ADMIN_CREDENTIALS = {
    username: 'shuwang09',
    password: '139680',
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // 验证用户名和密码
      if (
        username === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password
      ) {
        // 登录成功，保存认证状态
        const authData = {
          isAuthenticated: true,
          username: username,
          loginTime: new Date().toISOString(),
          token: 'admin_auth_' + Date.now(),
          // 添加额外的安全信息
          userAgent: navigator.userAgent,
          loginIP: 'local', // 在实际环境中可以从服务器获取
          sessionId: Math.random().toString(36).substring(2),
        };

        localStorage.setItem('admin_auth_data', JSON.stringify(authData));

        // 记录登录日志
        console.log(
          `[Admin Login] 管理员 ${username} 登录成功 - ${new Date().toLocaleString()}`
        );

        // 调用成功回调
        onLoginSuccess(authData);
      } else {
        setError('用户名或密码错误');
        // 记录失败的登录尝试
        console.warn(
          `[Admin Login] 登录失败尝试 - 用户名: ${username} - ${new Date().toLocaleString()}`
        );
      }
    } catch (error) {
      setError('登录过程中发生错误');
      console.error('[Admin Login] 登录错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>
            🔐 管理员登录
          </h1>
          <p className='text-gray-600'>请输入管理员凭据以访问管理面板</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              用户名
            </label>
            <input
              id='username'
              type='text'
              value={username}
              onChange={e => setUsername(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='请输入用户名'
              required
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              密码
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='请输入密码'
              required
            />
          </div>

          {error && (
            <div className='bg-red-50 border border-red-200 rounded-md p-3'>
              <p className='text-red-600 text-sm'>{error}</p>
            </div>
          )}

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {isLoading ? (
              <div className='flex items-center justify-center'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                登录中...
              </div>
            ) : (
              '登录'
            )}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-xs text-gray-500'>
            ⚠️ 此页面仅供管理员使用，请勿泄露凭据
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

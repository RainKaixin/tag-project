// SupabaseTest.js
// 測試 Supabase 環境變量和連接

import React, { useState, useEffect } from 'react';

import { useAuth } from '../context/AuthContext.js';
import {
  supabase,
  checkSupabaseConnection,
} from '../services/supabase/client.js';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [authStatus, setAuthStatus] = useState('checking');
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('testpassword123');
  const [authResult, setAuthResult] = useState(null);

  const { user, login, register, logout, isAuthenticated } = useAuth();

  // 测试 Supabase 连接
  useEffect(() => {
    const testConnection = async () => {
      try {
        const isConnected = await checkSupabaseConnection();
        setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      } catch (error) {
        console.error('Connection test failed:', error);
        setConnectionStatus('error');
      }
    };

    testConnection();
  }, []);

  // 测试认证状态
  useEffect(() => {
    if (user) {
      setAuthStatus('authenticated');
    } else {
      setAuthStatus('unauthenticated');
    }
  }, [user]);

  // 测试登录
  const testLogin = async () => {
    try {
      setAuthResult('Logging in...');
      const result = await login(testEmail, testPassword);
      setAuthResult(
        result.success ? 'Login successful!' : `Login failed: ${result.error}`
      );
    } catch (error) {
      setAuthResult(`Login error: ${error.message}`);
    }
  };

  // 测试注册
  const testRegister = async () => {
    try {
      setAuthResult('Registering...');
      const result = await register(testEmail, testPassword, {
        name: 'Test User',
      });
      setAuthResult(
        result.success
          ? 'Registration successful!'
          : `Registration failed: ${result.error}`
      );
    } catch (error) {
      setAuthResult(`Registration error: ${error.message}`);
    }
  };

  // 测试登出
  const testLogout = async () => {
    try {
      setAuthResult('Logging out...');
      const result = await logout();
      setAuthResult(
        result.success ? 'Logout successful!' : `Logout failed: ${result.error}`
      );
    } catch (error) {
      setAuthResult(`Logout error: ${error.message}`);
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h1 className='text-2xl font-bold mb-6 text-center'>
        Supabase 连接与 Auth 测试
      </h1>

      {/* 连接状态 */}
      <div className='mb-6 p-4 border rounded-lg'>
        <h2 className='text-lg font-semibold mb-3'>🔗 连接状态</h2>
        <div className='flex items-center space-x-2'>
          <span>状态:</span>
          <span
            className={`px-2 py-1 rounded text-sm font-medium ${
              connectionStatus === 'connected'
                ? 'bg-green-100 text-green-800'
                : connectionStatus === 'disconnected'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {connectionStatus === 'connected'
              ? '✅ 已连接'
              : connectionStatus === 'disconnected'
              ? '⚠️ 未连接'
              : '❌ 连接错误'}
          </span>
        </div>
        <div className='mt-2 text-sm text-gray-600'>
          URL: {process.env.REACT_APP_SUPABASE_URL || '未设置'}
        </div>
      </div>

      {/* 认证状态 */}
      <div className='mb-6 p-4 border rounded-lg'>
        <h2 className='text-lg font-semibold mb-3'>🔐 认证状态</h2>
        <div className='flex items-center space-x-2 mb-2'>
          <span>状态:</span>
          <span
            className={`px-2 py-1 rounded text-sm font-medium ${
              authStatus === 'authenticated'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {authStatus === 'authenticated' ? '✅ 已认证' : '❌ 未认证'}
          </span>
        </div>
        {user && (
          <div className='mt-2 p-3 bg-gray-50 rounded'>
            <div className='text-sm'>
              <div>
                <strong>用户ID:</strong> {user.id}
              </div>
              <div>
                <strong>邮箱:</strong> {user.email}
              </div>
              <div>
                <strong>姓名:</strong> {user.name}
              </div>
              <div>
                <strong>角色:</strong> {user.role}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth 测试 */}
      <div className='mb-6 p-4 border rounded-lg'>
        <h2 className='text-lg font-semibold mb-3'>🧪 Auth 功能测试</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>测试邮箱:</label>
            <input
              type='email'
              value={testEmail}
              onChange={e => setTestEmail(e.target.value)}
              className='w-full px-3 py-2 border rounded-md'
              placeholder='test@example.com'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>测试密码:</label>
            <input
              type='password'
              value={testPassword}
              onChange={e => setTestPassword(e.target.value)}
              className='w-full px-3 py-2 border rounded-md'
              placeholder='testpassword123'
            />
          </div>
        </div>

        <div className='flex flex-wrap gap-2 mb-4'>
          <button
            onClick={testLogin}
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
          >
            测试登录
          </button>
          <button
            onClick={testRegister}
            className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors'
          >
            测试注册
          </button>
          <button
            onClick={testLogout}
            className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
          >
            测试登出
          </button>
        </div>

        {authResult && (
          <div className='p-3 bg-gray-50 rounded'>
            <div className='text-sm font-medium'>测试结果:</div>
            <div className='text-sm text-gray-700'>{authResult}</div>
          </div>
        )}
      </div>

      {/* 环境变量检查 */}
      <div className='p-4 border rounded-lg'>
        <h2 className='text-lg font-semibold mb-3'>⚙️ 环境变量检查</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div>
            <strong>REACT_APP_SUPABASE_URL:</strong>
            <div className='text-gray-600 break-all'>
              {process.env.REACT_APP_SUPABASE_URL || '未设置'}
            </div>
          </div>
          <div>
            <strong>REACT_APP_SUPABASE_ANON_KEY:</strong>
            <div className='text-gray-600 break-all'>
              {process.env.REACT_APP_SUPABASE_ANON_KEY
                ? '✅ 已设置'
                : '❌ 未设置'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;

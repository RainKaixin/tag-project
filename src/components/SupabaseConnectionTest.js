import React, { useState, useEffect } from 'react';

import {
  supabase,
  checkSupabaseConnection,
} from '../services/supabase/client.js';

const SupabaseConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [envVars, setEnvVars] = useState({});
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    // 檢查環境變量
    setEnvVars({
      VITE_SUPABASE_URL:
        process.env.REACT_APP_SUPABASE_URL ||
        import.meta?.env?.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY:
        process.env.REACT_APP_SUPABASE_ANON_KEY ||
        import.meta?.env?.VITE_SUPABASE_ANON_KEY
          ? '✅ 已設置'
          : '❌ 未設置',
    });

    // 測試連接
    const testConnection = async () => {
      try {
        const isConnected = await checkSupabaseConnection();
        setConnectionStatus(isConnected ? 'connected' : 'disconnected');

        // 測試基本功能
        await testBasicFunctions();
      } catch (error) {
        console.error('Connection test failed:', error);
        setConnectionStatus('error');
      }
    };

    testConnection();
  }, []);

  const testBasicFunctions = async () => {
    const results = {};

    try {
      // 測試 auth 功能
      results.auth = !!supabase.auth;

      // 測試 from 功能
      results.from = !!supabase.from;

      // 測試 storage 功能
      results.storage = !!supabase.storage;

      setTestResults(results);
    } catch (error) {
      console.error('Basic functions test failed:', error);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-100';
      case 'disconnected':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'connected':
        return '✅ 已連接';
      case 'disconnected':
        return '⚠️ 連接失敗';
      case 'error':
        return '❌ 連接錯誤';
      default:
        return '🔄 檢查中...';
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h1 className='text-2xl font-bold mb-6 text-center'>
        Supabase 連接狀態檢查
      </h1>

      {/* 環境變量狀態 */}
      <div className='mb-6 p-4 border rounded-lg'>
        <h2 className='text-lg font-semibold mb-3'>📋 環境變量檢查</h2>
        <div className='space-y-2'>
          <div>
            <strong>REACT_APP_SUPABASE_URL:</strong>
            <div className='text-gray-600 break-all'>
              {envVars.REACT_APP_SUPABASE_URL || '未設置'}
            </div>
          </div>
          <div>
            <strong>REACT_APP_SUPABASE_ANON_KEY:</strong>
            <div className='text-gray-600'>
              {envVars.REACT_APP_SUPABASE_ANON_KEY}
            </div>
          </div>
        </div>
      </div>

      {/* 連接狀態 */}
      <div className='mb-6 p-4 border rounded-lg'>
        <h2 className='text-lg font-semibold mb-3'>🔗 連接狀態</h2>
        <div className='flex items-center space-x-2'>
          <span>狀態:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              connectionStatus
            )}`}
          >
            {getStatusText(connectionStatus)}
          </span>
        </div>
      </div>

      {/* 基本功能測試 */}
      <div className='mb-6 p-4 border rounded-lg'>
        <h2 className='text-lg font-semibold mb-3'>🧪 基本功能測試</h2>
        <div className='space-y-2'>
          <div>
            <strong>Auth 功能:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded text-sm ${
                testResults.auth
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {testResults.auth ? '✅ 可用' : '❌ 不可用'}
            </span>
          </div>
          <div>
            <strong>Database 功能:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded text-sm ${
                testResults.from
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {testResults.from ? '✅ 可用' : '❌ 不可用'}
            </span>
          </div>
          <div>
            <strong>Storage 功能:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded text-sm ${
                testResults.storage
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {testResults.storage ? '✅ 可用' : '❌ 不可用'}
            </span>
          </div>
        </div>
      </div>

      {/* 測試按鈕 */}
      <div className='text-center'>
        <button
          onClick={() => window.location.reload()}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
        >
          重新測試連接
        </button>
      </div>

      {/* 說明 */}
      <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
        <h3 className='font-semibold mb-2'>📝 說明</h3>
        <ul className='text-sm text-gray-600 space-y-1'>
          <li>• 如果環境變量未設置，請檢查 .env.local 文件</li>
          <li>• 如果連接失敗，請檢查 Supabase 項目狀態和網絡連接</li>
          <li>• 連接成功後，用戶認證功能將自動啟用</li>
          <li>• 訪問路徑: /test-supabase</li>
        </ul>
      </div>
    </div>
  );
};

export default SupabaseConnectionTest;

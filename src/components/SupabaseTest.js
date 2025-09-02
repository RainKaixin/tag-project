// SupabaseTest.js
// 測試 Supabase 環境變量和連接

import React, { useState } from 'react';

const SupabaseTest = () => {
  const [testResult, setTestResult] = useState('');

  const testEnvironmentVariables = () => {
    const url = process.env.REACT_APP_SUPABASE_URL;
    const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

    const result = `
🧪 環境變量測試結果:
📋 Supabase URL: ${url || '❌ 未設置'}
🔑 Supabase Key: ${key ? '✅ 已設置' : '❌ 未設置'}
🌐 環境: ${process.env.NODE_ENV}
    `;

    setTestResult(result);
    console.log(result);
  };

  const testSupabaseConnection = async () => {
    try {
      const { checkSupabaseConnection } = await import(
        '../services/supabase/client.js'
      );
      const isConnected = await checkSupabaseConnection();

      const result = isConnected
        ? '✅ Supabase 連接成功！'
        : '❌ Supabase 連接失敗，將使用 mock 數據';

      setTestResult(prev => prev + '\n' + result);
      console.log(result);
    } catch (error) {
      const result = '❌ 測試 Supabase 連接時出錯: ' + error.message;
      setTestResult(prev => prev + '\n' + result);
      console.error(result);
    }
  };

  return (
    <div className='p-4 bg-gray-100 rounded-lg'>
      <h3 className='text-lg font-semibold mb-4'>🔧 Supabase 連接測試</h3>

      <div className='space-y-3'>
        <button
          onClick={testEnvironmentVariables}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          測試環境變量
        </button>

        <button
          onClick={testSupabaseConnection}
          className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2'
        >
          測試 Supabase 連接
        </button>
      </div>

      {testResult && (
        <div className='mt-4 p-3 bg-white rounded border'>
          <pre className='text-sm whitespace-pre-wrap'>{testResult}</pre>
        </div>
      )}
    </div>
  );
};

export default SupabaseTest;

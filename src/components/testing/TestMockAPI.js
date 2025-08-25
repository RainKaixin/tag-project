import React, { useState, useEffect } from 'react';

import {
  getMyPortfolio,
  createPortfolioItem,
  uploadPortfolioImage,
} from '../../services/supabase/portfolio';
import { getCurrentUser } from '../../utils/currentUser';

const TestMockAPI = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const currentUser = getCurrentUser();

  // 测试加载作品
  const testLoadPortfolio = async () => {
    setLoading(true);
    setMessage('Loading portfolio...');

    try {
      const result = await getMyPortfolio();
      console.log('Load result:', result);

      if (result.success) {
        setPortfolio(result.data);
        setMessage(`Loaded ${result.data.length} items successfully`);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Exception: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 测试创建作品
  const testCreatePortfolio = async () => {
    setLoading(true);
    setMessage('Creating portfolio item...');

    try {
      const testData = {
        title: `Test Item ${Date.now()}`,
        description: 'This is a test item',
        category: 'Test',
        tags: ['test', 'mock'],
        imagePaths: ['test/path/image.jpg'],
        thumbnailPath: 'test/path/thumbnail.jpg',
        isPublic: true,
      };

      const result = await createPortfolioItem(testData);
      console.log('Create result:', result);

      if (result.success) {
        setMessage('Created successfully! Reloading portfolio...');
        await testLoadPortfolio();
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Exception: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 测试上传图片
  const testUploadImage = async () => {
    setLoading(true);
    setMessage('Testing image upload...');

    try {
      // 创建一个模拟的文件对象
      const mockFile = new File(['mock image data'], 'test.jpg', {
        type: 'image/jpeg',
      });

      const result = await uploadPortfolioImage(mockFile, currentUser.id);
      console.log('Upload result:', result);

      if (result.success) {
        setMessage(`Uploaded successfully! Path: ${result.data.path}`);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Exception: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 清空 localStorage
  const clearStorage = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('portfolio_')) {
        localStorage.removeItem(key);
      }
    });
    setPortfolio([]);
    setMessage('Cleared portfolio storage');
  };

  useEffect(() => {
    testLoadPortfolio();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Mock API 测试</h2>
      <p>
        当前用户: {currentUser.name} (ID: {currentUser.id})
      </p>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testLoadPortfolio}
          disabled={loading}
          style={{ marginRight: '10px' }}
        >
          加载作品
        </button>
        <button
          onClick={testCreatePortfolio}
          disabled={loading}
          style={{ marginRight: '10px' }}
        >
          创建测试作品
        </button>
        <button
          onClick={testUploadImage}
          disabled={loading}
          style={{ marginRight: '10px' }}
        >
          测试上传图片
        </button>
        <button onClick={clearStorage} disabled={loading}>
          清空存储
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>状态:</strong> {message}
      </div>

      <div>
        <strong>作品列表 ({portfolio.length} 个):</strong>
        <pre
          style={{
            background: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px',
            maxHeight: '300px',
            overflow: 'auto',
          }}
        >
          {JSON.stringify(portfolio, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <strong>localStorage 中的 portfolio 键:</strong>
        <pre
          style={{
            background: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          {Object.keys(localStorage)
            .filter(key => key.startsWith('portfolio_'))
            .join('\n')}
        </pre>
      </div>
    </div>
  );
};

export default TestMockAPI;

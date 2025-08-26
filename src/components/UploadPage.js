import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import UploadCollaboration from './upload/UploadCollaboration';
import UploadJobs from './upload/UploadJobs';
import UploadMilestones from './upload/UploadMilestones';
import UploadArtMarket from './upload-art-market/UploadArtMarket_refactored';
import UploadPortfolio from './upload-portfolio/UploadPortfolio_refactored';

const UploadPage = () => {
  const location = useLocation();
  const [uploadType, setUploadType] = useState('portfolio'); // 恢复默认设置为portfolio
  const [showTestModal, setShowTestModal] = useState(false);
  const [testModalMessage, setTestModalMessage] = useState('');
  const [pendingUploadType, setPendingUploadType] = useState(null);

  // 处理从UploadSuccess页面传递过来的activeUploadType状态和URL参数
  useEffect(() => {
    // 首先检查URL参数
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');

    if (tabParam) {
      setUploadType(tabParam);

      // 清除URL参数，避免重复设置
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (
      location.state?.activeUploadType &&
      location.state?.from === 'upload-success'
    ) {
      setUploadType(location.state.activeUploadType);

      // 清除状态，避免重复设置
      window.history.replaceState({}, document.title);
    }
  }, [location.state, location.search]);

  // 处理按钮点击
  const handleButtonClick = (typeId, typeName) => {
    if (typeId === 'art-market' || typeId === 'jobs') {
      setTestModalMessage(
        `${typeName} upload is currently in testing phase and not available yet.`
      );
      setShowTestModal(true);
      // 暫時存儲要切換的類型，等用戶確認後再切換
      setPendingUploadType(typeId);
    } else {
      setUploadType(typeId);
    }
  };

  // 处理弹框确认
  const handleModalConfirm = () => {
    setShowTestModal(false);
    if (pendingUploadType) {
      setUploadType(pendingUploadType);
      setPendingUploadType(null);
    }
  };

  // 上传类型配置
  const uploadTypes = [
    {
      id: 'art-market',
      name: 'Art Market',
      theme: 'blue',
      icon: (
        <svg
          className='w-6 h-6 text-current'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
          />
        </svg>
      ),
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      theme: 'blue',
      icon: (
        <svg
          className='w-6 h-6 text-current'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
          />
        </svg>
      ),
    },
    {
      id: 'collaboration',
      name: 'Collaboration',
      theme: 'purple',
      icon: (
        <svg
          className='w-6 h-6 text-current'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
          />
        </svg>
      ),
    },
    {
      id: 'milestones',
      name: 'Milestones',
      theme: 'purple',
      icon: (
        <svg
          className='w-6 h-6 text-current'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 3v18m0-16h12l-2 4 2 4H6'
          />
        </svg>
      ),
    },
    {
      id: 'jobs',
      name: 'Jobs',
      theme: 'purple',
      icon: (
        <svg
          className='w-6 h-6 text-current'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 7a2 2 0 012-2h12a2 2 0 012 2v2H4V7zM4 9h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9z'
          />
        </svg>
      ),
    },
  ];

  // 获取按钮样式类
  const getButtonClasses = type => {
    const isSelected = uploadType === type.id;
    const isBlueTheme = type.theme === 'blue';
    const isPurpleTheme = type.theme === 'purple';

    if (isSelected) {
      if (isBlueTheme) {
        return 'border-tag-blue bg-blue-50 text-tag-blue ring-2 ring-tag-blue/20';
      } else if (isPurpleTheme) {
        return 'border-tag-purple bg-purple-50 text-tag-purple ring-2 ring-tag-purple/20';
      }
    }
    return 'text-gray-600 hover:text-gray-800';
  };

  // 获取图标样式类
  const getIconClasses = type => {
    const isSelected = uploadType === type.id;
    const isBlueTheme = type.theme === 'blue';
    const isPurpleTheme = type.theme === 'purple';

    if (isSelected) {
      if (isBlueTheme) {
        return 'text-tag-blue';
      } else if (isPurpleTheme) {
        return 'text-tag-purple';
      }
    }
    return 'text-gray-400';
  };

  return (
    <div className='min-h-screen bg-gray-50 pt-16'>
      <div className='max-w-4xl mx-auto px-4 py-10'>
        {/* 页面标题 */}
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-semibold text-gray-800 mb-2'>
            What would you like to upload?
          </h1>
          <p className='text-base text-gray-500'>
            Choose the type of content you want to share with the community
          </p>
        </div>

        {/* 上传类型选择区域 */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8'>
          {uploadTypes.map(type => (
            <button
              key={type.id}
              onClick={() => handleButtonClick(type.id, type.name)}
              className={`bg-white border border-gray-200 rounded-lg px-4 py-3 text-center transition-all duration-200 hover:shadow ${
                type.theme === 'blue'
                  ? 'hover:border-tag-blue'
                  : 'hover:border-tag-purple'
              } ${getButtonClasses(type)}`}
            >
              <div className='flex flex-col items-center space-y-2'>
                <div className={getIconClasses(type)}>{type.icon}</div>
                <span className='text-sm font-medium'>{type.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* 动态渲染对应的上传组件 */}
        <div
          className={`mt-8 rounded-lg p-6 ${
            uploadType === 'portfolio' || uploadType === 'art-market'
              ? 'bg-blue-50' // 淡藍色背景 - TAG Gallery
              : 'bg-purple-50' // 淡紫色背景 - TAG Me
          }`}
        >
          {console.log('🔍 Rendering uploadType:', uploadType)}
          {uploadType === 'portfolio' && <UploadPortfolio />}
          {uploadType === 'art-market' && <UploadArtMarket />}
          {uploadType === 'collaboration' && <UploadCollaboration />}
          {uploadType === 'jobs' && <UploadJobs />}
          {uploadType === 'milestones' && <UploadMilestones />}
        </div>
      </div>

      {/* 测试弹框 */}
      {showTestModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-xl max-w-sm w-full'>
            <h3 className='text-lg font-semibold text-red-600 mb-2'>
              Feature Under Development
            </h3>
            <p className='text-sm text-gray-800 mb-4'>{testModalMessage}</p>
            <div className='flex justify-end space-x-2'>
              <button
                onClick={handleModalConfirm}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;

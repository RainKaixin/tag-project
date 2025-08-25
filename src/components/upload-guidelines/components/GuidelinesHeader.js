// guidelines-header v1: 上传指南页面头部组件
// 从 UploadGuidelines.js 中提取的页面头部

import React from 'react';

/**
 * GuidelinesHeader 组件 - 上传指南页面头部
 * @returns {JSX.Element} 页面头部组件
 */
const GuidelinesHeader = () => {
  return (
    <div className='text-center mb-8'>
      <h1 className='text-3xl font-bold text-gray-900 mb-4'>
        Posting Guidelines
      </h1>
      <p className='text-lg text-gray-600'>Artwork Submission Tips</p>
    </div>
  );
};

export default GuidelinesHeader;

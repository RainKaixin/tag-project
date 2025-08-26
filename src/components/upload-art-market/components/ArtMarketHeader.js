// art-market-header v1: 艺术市场头部组件
// 从 UploadArtMarket.js 中提取的头部区域

import React from 'react';

/**
 * ArtMarketHeader 组件 - 艺术市场上传页面头部
 * @returns {JSX.Element} 头部组件
 */
const ArtMarketHeader = () => {
  return (
    <div className='text-center mb-6'>
      <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
        <svg
          className='w-8 h-8 text-tag-blue'
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
      </div>
      <h2 className='text-xl font-semibold text-gray-800 mb-2'>
        Sell Your Art Assets
      </h2>
      <p className='text-gray-600'>
        Upload digital assets to the marketplace and earn from your creative
        work
      </p>
    </div>
  );
};

export default ArtMarketHeader;

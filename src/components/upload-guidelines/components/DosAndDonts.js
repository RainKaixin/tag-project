// dos-and-donts v1: Do's and Don'ts组件
// 从 UploadGuidelines.js 中提取的Do's and Don'ts列表

import React from 'react';

import { DOS_DATA, DONTS_DATA } from '../utils/guidelinesData';

/**
 * DosAndDonts 组件 - Do's and Don'ts列表
 * @returns {JSX.Element} Do's and Don'ts组件
 */
const DosAndDonts = () => {
  const renderIcon = type => {
    if (type === 'check') {
      return (
        <svg
          className='w-4 h-4 text-green-600'
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path
            fillRule='evenodd'
            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
            clipRule='evenodd'
          />
        </svg>
      );
    } else {
      return (
        <svg
          className='w-4 h-4 text-red-600'
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path
            fillRule='evenodd'
            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
            clipRule='evenodd'
          />
        </svg>
      );
    }
  };

  const renderList = (items, bgColorClass) => {
    return items.map(item => (
      <div key={item.id} className='flex items-start space-x-3'>
        <div
          className={`flex-shrink-0 w-6 h-6 ${bgColorClass} rounded-full flex items-center justify-center`}
        >
          {renderIcon(item.icon)}
        </div>
        <p className='text-gray-700 font-semibold'>{item.text}</p>
      </div>
    ));
  };

  return (
    <div className='grid md:grid-cols-2 gap-8'>
      {/* Do's */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-gray-900 mb-4'>✅ Do's</h3>
        <div className='space-y-3'>{renderList(DOS_DATA, 'bg-green-100')}</div>
      </div>

      {/* Don'ts */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-gray-900 mb-4'>❌ Don'ts</h3>
        <div className='space-y-3'>{renderList(DONTS_DATA, 'bg-red-100')}</div>
      </div>
    </div>
  );
};

export default DosAndDonts;

// pro-tip v1: Pro Tip组件
// 从 UploadGuidelines.js 中提取的专业提示

import React from 'react';

import { PRO_TIP_DATA } from '../utils/guidelinesData';

/**
 * ProTip 组件 - 专业提示
 * @returns {JSX.Element} Pro Tip组件
 */
const ProTip = () => {
  return (
    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
      <div className='flex items-start space-x-3'>
        <div className='flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-4 h-4 text-blue-600'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z' />
          </svg>
        </div>
        <div>
          <p className='font-semibold text-blue-900'>{PRO_TIP_DATA.title}</p>
          <p className='text-blue-800 text-sm'>{PRO_TIP_DATA.content}</p>
        </div>
      </div>
    </div>
  );
};

export default ProTip;

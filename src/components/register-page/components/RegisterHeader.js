// register-header v1: 注册页面头部组件
// 从 RegisterPage.js 中提取的头部区域

import React from 'react';

/**
 * RegisterHeader 组件 - 注册页面头部
 * @returns {JSX.Element} 头部组件
 */
const RegisterHeader = () => {
  return (
    <div className='text-center mb-8'>
      <img
        src="/TAG_Logo.png"
        alt='TAG Logo'
        className='h-12 w-auto mx-auto mb-6'
        onError={e => {
          console.error('Logo failed to load:', e.target.src);
          e.target.style.display = 'none';
        }}
      />
      <h2 className='text-3xl font-bold text-gray-900 mb-2'>
        Create your account
      </h2>
      <p className='text-sm text-gray-600 mb-4 whitespace-nowrap'>
        Only <span className='text-red-600 font-semibold'>scad.edu</span> emails
        are currently eligible for TAG registration
      </p>
    </div>
  );
};

export default RegisterHeader;

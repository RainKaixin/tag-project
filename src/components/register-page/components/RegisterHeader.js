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
        src='/TAG_Logo.png'
        alt='TAG Logo'
        className='h-12 w-auto mx-auto mb-6'
      />
      <h2 className='text-3xl font-bold text-gray-900 mb-2'>
        Create your account
      </h2>
    </div>
  );
};

export default RegisterHeader;

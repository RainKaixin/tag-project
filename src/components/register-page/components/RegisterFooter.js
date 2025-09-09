// register-footer v1: 注册页面底部组件
// 从 RegisterPage.js 中提取的底部区域

import React, { useState } from 'react';

import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsOfServiceModal from './TermsOfServiceModal';

/**
 * RegisterFooter 组件 - 注册页面底部区域
 * @param {Object} props - 组件属性
 * @param {Function} props.onLoginClick - 登录点击处理函数
 * @returns {JSX.Element} 底部组件
 */
const RegisterFooter = ({ onLoginClick }) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handlePrivacyClick = () => {
    setShowPrivacyModal(true);
  };

  const handleTermsClick = () => {
    setShowTermsModal(true);
  };

  return (
    <>
      {/* Bottom Options */}
      <div className='mt-6 flex justify-center'>
        <button
          onClick={onLoginClick}
          className='w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tag-blue transition-colors duration-200'
        >
          Login
        </button>
      </div>

      {/* Footer */}
      <footer className='bg-white border-t border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex justify-between items-center'>
            <div className='text-sm text-gray-500'>
              <span className='font-bold'>Tech Art Guide</span>
              <span className='ml-2'>© 2025 TAG. All rights reserved.</span>
            </div>
            <div className='flex space-x-6 text-sm text-gray-500'>
              <button
                onClick={handlePrivacyClick}
                className='hover:text-gray-700 transition-colors duration-200'
              >
                Privacy Policy
              </button>
              <button
                onClick={handleTermsClick}
                className='hover:text-gray-700 transition-colors duration-200'
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* 彈窗組件 */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </>
  );
};

export default RegisterFooter;

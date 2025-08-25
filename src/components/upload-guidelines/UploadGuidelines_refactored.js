// UploadGuidelines_refactored v1: 重构后的上传指南主组件
// 从 UploadGuidelines.js 重构而来，使用模块化组件和自定义Hook

import React from 'react';

import { useAuth } from '../../context/AuthContext';

import {
  BackButton,
  GuidelinesHeader,
  DosAndDonts,
  VisualExamples,
  CommunityNotice,
  ProTip,
  ConfirmationSection,
} from './components';
import { useGuidelinesState, useGuidelinesActions } from './hooks';

/**
 * UploadGuidelines_refactored 组件 - 重构后的上传指南页面
 * @returns {JSX.Element} 上传指南页面
 */
const UploadGuidelines_refactored = () => {
  const { user } = useAuth();

  // 使用自定义Hook管理状态
  const { guidelinesConfirmed, handleCheckboxChange } = useGuidelinesState();

  // 使用自定义Hook管理操作
  const { handleConfirm, handleBackToHome } = useGuidelinesActions({
    guidelinesConfirmed,
    user,
  });

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      {/* Back Button */}
      <BackButton onBackClick={handleBackToHome} />

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8'>
        <div className='max-w-4xl w-full space-y-8'>
          {/* Guidelines Card */}
          <div className='bg-white rounded-lg shadow-lg p-8'>
            {/* Header */}
            <GuidelinesHeader />

            {/* Guidelines Content */}
            <div className='space-y-8'>
              {/* Do's and Don'ts */}
              <DosAndDonts />

              {/* Visual Examples */}
              <VisualExamples />

              {/* Community Review Notice */}
              <CommunityNotice />

              {/* Pro Tip */}
              <ProTip />
            </div>

            {/* Confirmation Section */}
            <ConfirmationSection
              guidelinesConfirmed={guidelinesConfirmed}
              onCheckboxChange={handleCheckboxChange}
              onConfirm={handleConfirm}
              user={user}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadGuidelines_refactored;

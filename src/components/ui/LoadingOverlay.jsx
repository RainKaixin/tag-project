import React from 'react';

import { useAppContext } from '../../context/AppContext';

/**
 * 全局加载遮罩组件
 * 从AppContext获取loading状态并显示全屏加载动画
 */
export function LoadingOverlay() {
  const { state } = useAppContext();

  if (!state.isLoading) {
    return null;
  }

  return (
    <div className='fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-tag-blue mx-auto mb-4'></div>
        <p className='text-gray-600'>Loading...</p>
      </div>
    </div>
  );
}

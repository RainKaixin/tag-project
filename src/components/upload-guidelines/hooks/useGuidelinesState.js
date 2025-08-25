// use-guidelines-state v1: 上传指南状态管理Hook
// 从 UploadGuidelines.js 中提取的状态管理逻辑

import { useState } from 'react';

/**
 * useGuidelinesState Hook - 管理上传指南状态
 * @returns {Object} 状态和设置函数
 */
const useGuidelinesState = () => {
  const [guidelinesConfirmed, setGuidelinesConfirmed] = useState(false);

  // 处理复选框变化
  const handleCheckboxChange = e => {
    setGuidelinesConfirmed(e.target.checked);
  };

  // 重置状态
  const resetState = () => {
    setGuidelinesConfirmed(false);
  };

  return {
    guidelinesConfirmed,
    handleCheckboxChange,
    resetState,
  };
};

export default useGuidelinesState;

import React from 'react';
import { Navigate } from 'react-router-dom';

const UploadFormGuard = ({ children }) => {
  // 檢查用戶是否已確認指南
  const guidelinesAccepted = localStorage.getItem('tag_guidelines_accepted');

  // 如果未確認指南，重定向到指南頁面
  if (guidelinesAccepted !== 'true') {
    return <Navigate to='/upload/guidelines' replace />;
  }

  // 如果已確認，顯示上傳表單
  return children;
};

export default UploadFormGuard;

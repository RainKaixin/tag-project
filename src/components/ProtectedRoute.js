import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 加載中時顯示加載狀態
  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-tag-blue mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // 未登錄時重定向到登錄頁面
  if (!user) {
    return <Navigate to='/login' replace />;
  }

  // 已登錄時顯示正常內容
  return children;
};

export default ProtectedRoute;

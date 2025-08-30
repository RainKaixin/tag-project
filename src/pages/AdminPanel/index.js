import React from 'react';

import AdminLogin from '../../components/admin/AdminLogin';
import ConfirmDialog from '../../components/common/ConfirmDialog';

import AdminHeader from './components/AdminHeader';
import DataManagerModal from './components/DataManagerModal';
import DataOverviewCards from './components/DataOverviewCards';
import DetailedDataManagement from './components/DetailedDataManagement';
import FunctionButtons from './components/FunctionButtons';
import OperationLog from './components/OperationLog';
import UserDataOverview from './components/UserDataOverview';
import { useAdminAuth } from './hooks/useAdminAuth';
import { useAdminOperations } from './hooks/useAdminOperations';
import { useDataOverview } from './hooks/useDataOverview';

/**
 * 重构后的管理员面板主组件
 */
const AdminPanel = () => {
  // 使用自定义hooks
  const { isAuthorized, authData, loading, handleLoginSuccess, handleLogout } =
    useAdminAuth();
  const { dataOverview, refreshDataOverview } = useDataOverview();
  const {
    operationLog,
    isOperating,
    showConfirmDialog,
    currentDataType,
    showDataManager,
    showConfirm,
    handleConfirm,
    openDataManager,
    handleDataManagerDelete,
    setShowConfirmDialog,
    setShowDataManager,
  } = useAdminOperations(refreshDataOverview);

  // 加载状态
  if (loading) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>验证管理员权限...</p>
        </div>
      </div>
    );
  }

  // 未认证状态
  if (!isAuthorized) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* 管理员面板头部 */}
      <AdminHeader authData={authData} onLogout={handleLogout} />

      {/* 主要内容区域 */}
      <div className='max-w-7xl mx-auto p-6'>
        {/* 数据概览卡片 */}
        <DataOverviewCards dataOverview={dataOverview} />

        {/* 用户数据概览 */}
        <UserDataOverview dataOverview={dataOverview} />

        {/* 功能按钮区域 */}
        <FunctionButtons
          isOperating={isOperating}
          showConfirm={showConfirm}
          openDataManager={openDataManager}
        />

        {/* 详细数据管理区域 */}
        <DetailedDataManagement openDataManager={openDataManager} />

        {/* 操作日志区域 */}
        <OperationLog operationLog={operationLog} />
      </div>

      {/* 确认弹窗 */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirm}
        title='确认操作'
        message='确定要执行此操作吗？\n\n此操作不可撤销！'
        confirmText='确认'
        cancelText='取消'
        type='danger'
      />

      {/* 数据管理器弹窗 */}
      <DataManagerModal
        showDataManager={showDataManager}
        currentDataType={currentDataType}
        onClose={() => setShowDataManager(false)}
        onDeleteSelected={handleDataManagerDelete}
      />
    </div>
  );
};

export default AdminPanel;

import { useState } from 'react';

import { adminService } from '../../../services/adminService';

/**
 * 管理员操作管理Hook
 * @param {Function} refreshDataOverview - 刷新数据概览的函数
 * @returns {Object} 操作管理状态和方法
 */
export const useAdminOperations = refreshDataOverview => {
  const [operationLog, setOperationLog] = useState([]);
  const [isOperating, setIsOperating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [currentDataType, setCurrentDataType] = useState(null);
  const [showDataManager, setShowDataManager] = useState(false);

  // 添加操作日志
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { timestamp, message, type };
    setOperationLog(prev => [logEntry, ...prev.slice(0, 49)]); // 保留最近50条
  };

  // 执行清理操作
  const executeClearOperation = async (operation, operationName) => {
    if (isOperating) return;

    setIsOperating(true);
    addLog(`开始执行: ${operationName}`, 'info');

    try {
      const result = await operation();

      if (result.success) {
        addLog(`✅ ${result.message}`, 'success');
        // 刷新数据概览
        refreshDataOverview();
      } else {
        addLog(`❌ 操作失败: ${result.error}`, 'error');
      }
    } catch (error) {
      addLog(`❌ 操作异常: ${error.message}`, 'error');
    } finally {
      setIsOperating(false);
    }
  };

  // 显示确认弹窗
  const showConfirm = (action, operationName, message) => {
    setConfirmAction(() => () => executeClearOperation(action, operationName));
    setShowConfirmDialog(true);
  };

  // 确认执行操作
  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
  };

  // 打开数据管理器
  const openDataManager = dataType => {
    setCurrentDataType(dataType);
    setShowDataManager(true);
  };

  // 数据管理器删除回调
  const handleDataManagerDelete = deletedCount => {
    addLog(`✅ 通过数据管理器删除了 ${deletedCount} 项数据`, 'success');
    refreshDataOverview();
  };

  return {
    operationLog,
    isOperating,
    showConfirmDialog,
    currentDataType,
    showDataManager,
    addLog,
    showConfirm,
    handleConfirm,
    openDataManager,
    handleDataManagerDelete,
    setShowConfirmDialog,
    setShowDataManager,
  };
};

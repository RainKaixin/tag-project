// AdminPanel.js - 超级管理员测试页面
// 具有最高权限管理所有已发布内容的测试工具

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import AdminLogin from '../components/admin/AdminLogin';
import DataListManager from '../components/admin/DataListManager';
import EnhancedDataListManager from '../components/admin/EnhancedDataListManager';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { adminService } from '../services/adminService';

const AdminPanel = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [dataOverview, setDataOverview] = useState({});
  const [loading, setLoading] = useState(true);
  const [operationLog, setOperationLog] = useState([]);
  const [isOperating, setIsOperating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [currentDataType, setCurrentDataType] = useState(null);
  const [showDataManager, setShowDataManager] = useState(false);
  const [authData, setAuthData] = useState(null);
  const location = useLocation();

  // 权限验证函数
  const validateAdminAccess = () => {
    try {
      // 只检查新的密码验证系统，不再兼容旧的URL参数验证
      const authDataStr = localStorage.getItem('admin_auth_data');
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);

        // 检查认证是否有效（24小时内）
        const loginTime = new Date(authData.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

        if (authData.isAuthenticated && hoursDiff < 24) {
          setIsAuthorized(true);
          setAuthData(authData);
          return true;
        } else {
          // 认证过期，清除所有认证数据
          localStorage.removeItem('admin_auth_data');
          localStorage.removeItem('admin_super_token');
          localStorage.removeItem('admin_token_timestamp');
        }
      }

      // 不再支持URL参数验证，必须通过密码登录
      return false;
    } catch (error) {
      console.error('Admin validation error:', error);
      return false;
    }
  };

  // 获取数据概览
  const getDataOverview = () => {
    try {
      const allKeys = Object.keys(localStorage);

      const overview = {
        totalKeys: allKeys.length,
        users: {
          alice: 0,
          bryan: 0,
          alex: 0,
        },
        collaborations: 0,
        portfolios: 0,
        comments: 0,
        notifications: 0,
        likes: 0,
        views: 0,
        favorites: 0,
        other: 0,
      };

      allKeys.forEach(key => {
        if (key.includes('portfolio_')) {
          overview.portfolios++;
          const userId = key.replace('portfolio_', '');
          if (overview.users[userId] !== undefined) {
            overview.users[userId]++;
          }
        } else if (key.includes('collaboration')) {
          overview.collaborations++;
        } else if (key.includes('comment')) {
          overview.comments++;
        } else if (key.includes('notification')) {
          overview.notifications++;
        } else if (key.includes('like')) {
          overview.likes++;
        } else if (key.includes('view')) {
          overview.views++;
        } else if (key.includes('favorite')) {
          overview.favorites++;
        } else {
          overview.other++;
        }
      });

      return overview;
    } catch (error) {
      console.error('Error getting data overview:', error);
      return {};
    }
  };

  // 处理登录成功
  const handleLoginSuccess = authData => {
    setAuthData(authData);
    setIsAuthorized(true);
  };

  // 退出登录
  const handleLogout = () => {
    // 清除所有可能的认证数据
    localStorage.removeItem('admin_auth_data');
    localStorage.removeItem('admin_super_token');
    localStorage.removeItem('admin_token_timestamp');

    // 重置状态
    setIsAuthorized(false);
    setAuthData(null);
    setAdminToken('');

    // 记录退出日志
    console.log(
      `[Admin Logout] 管理员退出登录 - ${new Date().toLocaleString()}`
    );
  };

  // 激活管理员模式（已废弃，现在必须通过密码登录）
  const activateAdminMode = () => {
    console.warn('[Admin] 旧的激活方式已废弃，请使用密码登录');
    alert('请使用用户名和密码登录管理员面板');
  };

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
        const overview = getDataOverview();
        setDataOverview(overview);
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
    const overview = getDataOverview();
    setDataOverview(overview);
  };

  // 初始化
  useEffect(() => {
    const isValid = validateAdminAccess();
    if (isValid) {
      const overview = getDataOverview();
      setDataOverview(overview);
    }
    setLoading(false);

    // 暴露激活函数到全局（已废弃）
    window.activateAdminMode = activateAdminMode;

    // 设置会话超时检测（每小时检查一次）
    const sessionCheckInterval = setInterval(() => {
      const authDataStr = localStorage.getItem('admin_auth_data');
      if (authDataStr) {
        try {
          const authData = JSON.parse(authDataStr);
          const loginTime = new Date(authData.loginTime);
          const now = new Date();
          const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

          if (hoursDiff >= 24) {
            // 会话过期，自动退出
            handleLogout();
            alert('会话已过期，请重新登录');
          }
        } catch (error) {
          console.error('Session check error:', error);
        }
      }
    }, 60 * 60 * 1000); // 每小时检查一次

    // 清理定时器
    return () => clearInterval(sessionCheckInterval);
  }, []);

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

  if (!isAuthorized) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* 管理员面板头部 */}
      <div className='bg-red-600 text-white p-4'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold'>🔧 超级管理员测试面板</h1>
            <p className='text-red-100'>具有最高权限的数据管理工具</p>
          </div>
          <div className='flex items-center space-x-4'>
            <span className='text-red-100'>
              欢迎，{authData?.username || '管理员'}
            </span>
            <button
              onClick={handleLogout}
              className='bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded transition-colors'
            >
              🚪 退出登录
            </button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className='max-w-7xl mx-auto p-6'>
        {/* 数据概览卡片 */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-lg font-semibold text-gray-800'>总数据项</h3>
            <p className='text-3xl font-bold text-blue-600'>
              {dataOverview.totalKeys || 0}
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-lg font-semibold text-gray-800'>作品集</h3>
            <p className='text-3xl font-bold text-green-600'>
              {dataOverview.portfolios || 0}
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-lg font-semibold text-gray-800'>协作项目</h3>
            <p className='text-3xl font-bold text-purple-600'>
              {dataOverview.collaborations || 0}
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-lg font-semibold text-gray-800'>其他数据</h3>
            <p className='text-3xl font-bold text-orange-600'>
              {dataOverview.other || 0}
            </p>
          </div>
        </div>

        {/* 用户数据概览 */}
        <div className='bg-white rounded-lg shadow mb-8'>
          <div className='p-6 border-b'>
            <h2 className='text-xl font-semibold text-gray-800'>
              用户数据概览
            </h2>
          </div>
          <div className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {Object.entries(dataOverview.users || {}).map(([user, count]) => (
                <div
                  key={user}
                  className='flex justify-between items-center p-4 bg-gray-50 rounded'
                >
                  <span className='font-medium text-gray-700 capitalize'>
                    {user}
                  </span>
                  <span className='text-lg font-bold text-blue-600'>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 功能按钮区域 */}
        <div className='bg-white rounded-lg shadow mb-8'>
          <div className='p-6 border-b'>
            <h2 className='text-xl font-semibold text-gray-800'>
              批量清理功能
            </h2>
          </div>
          <div className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <button
                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50'
                disabled={isOperating}
                onClick={() =>
                  showConfirm(
                    adminService.clearAllCollaborations,
                    '清理所有Collaborations',
                    '确定要删除所有协作项目数据吗？\n\n此操作将删除所有协作项目、申请、点赞等相关数据。'
                  )
                }
              >
                🗑️ 清理所有Collaborations
              </button>
              <button
                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50'
                disabled={isOperating}
                onClick={() =>
                  showConfirm(
                    adminService.clearAllPortfolios,
                    '清理所有作品',
                    '确定要删除所有作品数据吗？\n\n此操作将删除所有用户的作品集数据。'
                  )
                }
              >
                🗑️ 清理所有作品
              </button>
              <button
                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50'
                disabled={isOperating}
                onClick={() =>
                  showConfirm(
                    adminService.clearAllComments,
                    '清理所有评论',
                    '确定要删除所有评论数据吗？\n\n此操作将删除所有作品的评论数据。'
                  )
                }
              >
                🗑️ 清理所有评论
              </button>
              <button
                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50'
                disabled={isOperating}
                onClick={() =>
                  showConfirm(
                    adminService.clearAllNotifications,
                    '清理所有通知',
                    '确定要删除所有通知数据吗？\n\n此操作将删除所有用户的通知数据。'
                  )
                }
              >
                🗑️ 清理所有通知
              </button>
              <button
                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50'
                disabled={isOperating}
                onClick={() =>
                  showConfirm(
                    adminService.clearAllLikes,
                    '清理所有点赞',
                    '确定要删除所有点赞数据吗？\n\n此操作将删除所有作品的点赞记录。'
                  )
                }
              >
                🗑️ 清理所有点赞
              </button>
              <button
                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50'
                disabled={isOperating}
                onClick={() =>
                  showConfirm(
                    adminService.clearAllViews,
                    '清理所有浏览记录',
                    '确定要删除所有浏览记录数据吗？\n\n此操作将删除所有作品的浏览统计。'
                  )
                }
              >
                🗑️ 清理所有浏览记录
              </button>
            </div>

            {/* 危险操作区域 */}
            <div className='mt-6 pt-6 border-t border-red-200'>
              <h3 className='text-lg font-semibold text-red-700 mb-4'>
                ⚠️ 危险操作
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <button
                  className='bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded transition-colors disabled:opacity-50'
                  disabled={isOperating}
                  onClick={() =>
                    showConfirm(
                      adminService.clearAllTAGData,
                      '清理所有TAG数据',
                      '⚠️ 危险操作！\n\n确定要删除所有TAG相关数据吗？\n\n这将删除：\n• 所有用户数据\n• 所有作品数据\n• 所有评论数据\n• 所有通知数据\n• 所有点赞数据\n• 所有浏览记录\n• 所有协作项目\n\n此操作不可撤销！'
                    )
                  }
                >
                  💥 清理所有TAG数据
                </button>
                <button
                  className='bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50'
                  disabled={isOperating}
                  onClick={() => {
                    const user = prompt(
                      '请输入要清理的用户ID (alice/bryan/alex):'
                    );
                    if (user && ['alice', 'bryan', 'alex'].includes(user)) {
                      showConfirm(
                        () => adminService.clearUserData(user),
                        `清理用户 ${user} 的数据`,
                        `确定要删除用户 ${user} 的所有数据吗？\n\n这将删除该用户的所有作品、评论、通知等相关数据。`
                      );
                    }
                  }}
                >
                  👤 清理特定用户数据
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 详细数据管理区域 */}
        <div className='bg-white rounded-lg shadow mb-8'>
          <div className='p-6 border-b'>
            <h2 className='text-xl font-semibold text-gray-800'>
              详细数据管理
            </h2>
            <p className='text-gray-600 mt-2'>查看和选择性删除特定数据项</p>
          </div>
          <div className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
                onClick={() => openDataManager('collaborations')}
              >
                📋 管理协作项目数据
              </button>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
                onClick={() => openDataManager('portfolios')}
              >
                📋 管理作品数据
              </button>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
                onClick={() => openDataManager('comments')}
              >
                📋 管理评论数据
              </button>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
                onClick={() => openDataManager('notifications')}
              >
                📋 管理通知数据
              </button>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
                onClick={() => openDataManager('likes')}
              >
                📋 管理点赞数据
              </button>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
                onClick={() => openDataManager('views')}
              >
                📋 管理浏览记录数据
              </button>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
                onClick={() => openDataManager('drafts')}
              >
                📋 管理协作草稿数据
              </button>
            </div>
          </div>
        </div>

        {/* 操作日志区域 */}
        <div className='bg-white rounded-lg shadow'>
          <div className='p-6 border-b'>
            <h2 className='text-xl font-semibold text-gray-800'>操作日志</h2>
          </div>
          <div className='p-6'>
            <div className='max-h-64 overflow-y-auto'>
              {operationLog.length === 0 ? (
                <p className='text-gray-500 text-center py-4'>暂无操作记录</p>
              ) : (
                <div className='space-y-2'>
                  {operationLog.map((log, index) => (
                    <div
                      key={index}
                      className='flex items-start space-x-2 text-sm'
                    >
                      <span className='text-gray-500 min-w-[60px]'>
                        {log.timestamp}
                      </span>
                      <span
                        className={`flex-1 ${
                          log.type === 'success'
                            ? 'text-green-600'
                            : log.type === 'error'
                            ? 'text-red-600'
                            : 'text-gray-700'
                        }`}
                      >
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
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
      {showDataManager && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden'>
            <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
              <h2 className='text-xl font-semibold text-gray-800'>
                {currentDataType === 'collaborations' && '协作项目数据管理'}
                {currentDataType === 'portfolios' && '作品数据管理'}
                {currentDataType === 'comments' && '评论数据管理'}
                {currentDataType === 'notifications' && '通知数据管理'}
                {currentDataType === 'likes' && '点赞数据管理'}
                {currentDataType === 'views' && '浏览统计数据管理'}
                {currentDataType === 'drafts' && '协作草稿数据管理'}
              </h2>
              <button
                onClick={() => setShowDataManager(false)}
                className='text-gray-500 hover:text-gray-700 text-2xl'
              >
                ×
              </button>
            </div>
            <div className='p-4 overflow-y-auto max-h-[calc(90vh-80px)]'>
              <EnhancedDataListManager
                dataType={currentDataType}
                onDeleteSelected={handleDataManagerDelete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

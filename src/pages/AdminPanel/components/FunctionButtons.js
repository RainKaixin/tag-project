import React from 'react';

import { adminService } from '../../../services/adminService';

/**
 * 功能按钮区域组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.isOperating - 是否正在执行操作
 * @param {Function} props.showConfirm - 显示确认弹窗
 * @param {Function} props.openDataManager - 打开数据管理器
 */
const FunctionButtons = ({ isOperating, showConfirm, openDataManager }) => {
  return (
    <div className='bg-white rounded-lg shadow mb-8'>
      <div className='p-6 border-b'>
        <h2 className='text-xl font-semibold text-gray-800'>批量清理功能</h2>
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
                const user = prompt('请输入要清理的用户ID (alice/bryan/alex):');
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
  );
};

export default FunctionButtons;

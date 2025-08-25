import React, { useState } from 'react';

import { getNotificationIcon } from '../utils/notificationHelpers';

import ConfirmationModal from './ConfirmationModal';
import FinalCommentDetailModal from './FinalCommentDetailModal';

const NotificationItem = ({
  notification,
  onNotificationClick,
  onReviewRequest,
  onCollaborationRequest,
  onMarkAsRead,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showFinalCommentModal, setShowFinalCommentModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const handleNotificationClick = () => {
    // 如果是final_comment类型的通知，显示评论详情弹窗
    if (notification.type === 'final_comment') {
      setShowFinalCommentModal(true);
      return;
    }

    // 如果是需要操作的通知（review_request 或 collaboration），顯示模態框
    if (
      (notification.type === 'review_request' && !notification.isRead) ||
      (notification.type === 'collaboration' &&
        notification.meta?.requestId &&
        notification.meta?.status === 'pending' &&
        !notification.isRead)
    ) {
      setShowModal(true);
    } else {
      // 其他通知（如 follow, like）直接标记为已读并调用点击处理
      if (!notification.isRead && onMarkAsRead) {
        onMarkAsRead(notification.id);
      }
      // 调用点击处理函数
      onNotificationClick(notification);
    }
  };

  const handleModalConfirm = () => {
    if (modalAction === 'review') {
      onReviewRequest(notification, 'approved');
    } else if (modalAction === 'collaboration') {
      onCollaborationRequest(notification, 'approve');
    }
    setShowModal(false);
    setModalAction(null);
  };

  const handleModalDeny = () => {
    if (modalAction === 'review') {
      onReviewRequest(notification, 'denied');
    } else if (modalAction === 'collaboration') {
      onCollaborationRequest(notification, 'deny');
    }
    setShowModal(false);
    setModalAction(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalAction(null);
  };

  const handleFinalCommentModalClose = () => {
    setShowFinalCommentModal(false);
    // 关闭弹窗时标记通知为已读
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  // 設置模態框的動作類型
  React.useEffect(() => {
    if (notification.type === 'review_request') {
      setModalAction('review');
    } else if (notification.type === 'collaboration') {
      setModalAction('collaboration');
    }
  }, [notification.type]);

  return (
    <div
      onClick={e => {
        // 如果点击的是按钮区域，不触发通知点击事件
        if (e.target.closest('button')) {
          return;
        }
        handleNotificationClick();
      }}
      className={`rounded-lg border p-6 hover:shadow-md transition-all duration-200 cursor-pointer ${
        !notification.isRead
          ? notification.type === 'collaboration'
            ? 'bg-purple-50 border-l-4 border-l-purple-500' // Collaboration未读：淡紫色背景
            : 'bg-blue-50 border-l-4 border-l-blue-500' // 其他未读：淡蓝色背景
          : 'bg-white border-gray-200' // 已读：白色背景
      }`}
    >
      <div className='flex items-start space-x-4'>
        {/* 未读标记 */}
        {!notification.isRead && (
          <div
            className={`w-2 h-2 rounded-full mt-3 flex-shrink-0 ${
              notification.type === 'collaboration'
                ? 'bg-purple-500'
                : 'bg-blue-500'
            }`}
          ></div>
        )}

        {/* 通知图标 */}
        <div className='flex-shrink-0'>
          {getNotificationIcon(notification.type, null)}
        </div>

        {/* 通知内容 */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <h3 className='text-sm font-semibold text-gray-900 mb-1'>
                {notification.title || notification.content}
              </h3>
              {notification.message && (
                <p className='text-sm text-gray-600 mb-2'>
                  {notification.message}
                </p>
              )}

              {/* 操作提示 - 點擊通知進行操作 */}
              {((notification.type === 'review_request' &&
                !notification.isRead) ||
                (notification.type === 'collaboration' &&
                  notification.meta?.requestId &&
                  notification.meta?.status === 'pending' &&
                  !notification.isRead)) && (
                <div className='mt-3'>
                  <p className='text-xs text-gray-500 italic'>
                    Click to approve or deny this request
                  </p>
                </div>
              )}
            </div>
            <span className='text-xs text-gray-500 ml-4 flex-shrink-0'>
              {new Date(notification.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* 確認模態框 */}
      <ConfirmationModal
        isOpen={showModal}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        onDeny={handleModalDeny}
        notification={notification}
        actionType={modalAction}
      />

      {/* 最终评论详情弹窗 */}
      <FinalCommentDetailModal
        isOpen={showFinalCommentModal}
        onClose={handleFinalCommentModalClose}
        notification={notification}
      />
    </div>
  );
};

export default NotificationItem;

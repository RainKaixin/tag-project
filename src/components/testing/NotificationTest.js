// review-flow v1: 開發測試工具
import React, { useState } from 'react';

import { notificationService } from '../../services';
import {
  createTestNotification,
  clearUserNotifications,
  getUserNotifications,
  createCollaborationNotification,
  createGeneralNotification,
} from '../../services/mock/notificationService.mock.js';
import {
  resetReviewRequests,
  getAllReviewRequests,
} from '../../services/mock/reviewRequestService.js';
import { getCurrentUser, setCurrentUserId } from '../../utils/currentUser';

const NotificationTest = () => {
  const [currentUser, setCurrentUserState] = useState(getCurrentUser());

  const handleUserSwitch = async userId => {
    await setCurrentUserId(userId);
    setCurrentUserState(getCurrentUser());
    window.dispatchEvent(new CustomEvent('user:changed'));
  };

  const handleCancelRequests = () => {
    resetReviewRequests();
    console.log('All review requests cancelled');
  };

  const handleShowRequests = () => {
    const requests = getAllReviewRequests();
    console.log('Current review requests:', requests);
  };

  const handleShowNotifications = async () => {
    try {
      const result = await notificationService.getUserNotifications(
        currentUser.id
      );
      if (result.success) {
        const notifications = result.data || [];
        console.log(
          'Current notifications for',
          currentUser.name,
          ':',
          notifications
        );
        console.log('Notification count:', notifications.length);
        console.log(
          'Unread count:',
          notifications.filter(n => !n.isRead).length
        );
      } else {
        console.log('No notifications found for', currentUser.id);
      }
    } catch (error) {
      console.error('Error getting notifications:', error);
    }
  };

  const handleCreateCollaborationNotification = async () => {
    try {
      const notification = await createCollaborationNotification({
        userId: currentUser.id,
        title: 'Collaboration Request',
        message: `New collaboration request for project "Interactive Web Experience" from ${
          currentUser.name
        } at ${new Date().toLocaleTimeString()}`,
        projectId: 'collab_project_001',
      });

      console.log('Collaboration notification created:', notification);
    } catch (error) {
      console.error('Error creating collaboration notification:', error);
    }
  };

  const handleCreateGeneralNotification = async () => {
    try {
      const notification = await createGeneralNotification({
        userId: currentUser.id,
        type: 'system',
        title: 'System Update',
        message: `System maintenance completed for ${
          currentUser.name
        } at ${new Date().toLocaleTimeString()}`,
        projectId: null,
      });

      console.log('General notification created:', notification);
    } catch (error) {
      console.error('Error creating general notification:', error);
    }
  };

  const handleClearNotifications = async () => {
    try {
      // 获取当前用户的所有通知
      const result = await notificationService.getUserNotifications(
        currentUser.id
      );
      if (result.success) {
        const notifications = result.data || [];

        // 删除所有通知
        for (const notification of notifications) {
          await notificationService.deleteNotification(notification.id);
        }

        // 触发通知变化事件
        window.dispatchEvent(
          new CustomEvent('notif:unreadChanged', {
            detail: { userId: currentUser.id },
          })
        );

        console.log(`All notifications cleared for ${currentUser.name}`);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
      <h2 className='text-lg font-bold text-gray-900 mb-4'>
        Review Request Test Tools
      </h2>

      <div className='space-y-4'>
        {/* 當前用戶顯示 */}
        <div className='bg-gray-50 p-3 rounded-lg'>
          <p className='text-sm text-gray-600'>Current User:</p>
          <p className='font-medium text-gray-900'>
            {currentUser.name} ({currentUser.id})
          </p>
        </div>

        {/* 用戶切換 */}
        <div>
          <p className='text-sm font-medium text-gray-700 mb-2'>Switch User:</p>
          <div className='flex space-x-2'>
            <button
              onClick={() => handleUserSwitch('alice')}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                currentUser.id === 'alice'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Alice (Owner)
            </button>
            <button
              onClick={() => handleUserSwitch('bryan')}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                currentUser.id === 'bryan'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Bryan (Collaborator)
            </button>
            <button
              onClick={() => handleUserSwitch('alex')}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                currentUser.id === 'alex'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Alex (Default)
            </button>
          </div>
        </div>

        {/* 開發工具 */}
        <div>
          <p className='text-sm font-medium text-gray-700 mb-2'>
            Development Tools:
          </p>
          <div className='flex space-x-2'>
            <button
              onClick={handleCancelRequests}
              className='px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200'
            >
              Cancel All Requests
            </button>
            <button
              onClick={handleShowRequests}
              className='px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200'
            >
              Show Requests (Console)
            </button>
            <button
              onClick={handleShowNotifications}
              className='px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors duration-200'
            >
              Show Notifications (Console)
            </button>
          </div>
        </div>

        {/* 通知測試工具 */}
        <div>
          <p className='text-sm font-medium text-gray-700 mb-2'>
            Notification Test Tools:
          </p>
          <div className='flex space-x-2'>
            <button
              onClick={handleCreateCollaborationNotification}
              className='px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors duration-200'
            >
              Create Collaboration Notification
            </button>
            <button
              onClick={handleCreateGeneralNotification}
              className='px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200'
            >
              Create General Notification
            </button>
            <button
              onClick={handleClearNotifications}
              className='px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors duration-200'
            >
              Clear Notifications
            </button>
          </div>
        </div>

        {/* 收藏数据修复工具 */}

        {/* 測試步驟說明 */}
        <div className='bg-blue-50 p-3 rounded-lg'>
          <p className='text-sm font-medium text-blue-900 mb-2'>Test Steps:</p>
          <ol className='text-xs text-blue-800 space-y-1'>
            <li>1. Switch to Bryan → Go to Alice's collaboration project</li>
            <li>
              2. Click "Send Standard Request" → Should show "Pending Approval"
            </li>
            <li>3. Switch to Alice → Check Notification Center</li>
            <li>4. Click "Approve" or "Deny" on the review request</li>
            <li>5. Switch back to Bryan → Check if status changed</li>
          </ol>
        </div>

        {/* 通知測試步驟說明 */}
        <div className='bg-green-50 p-3 rounded-lg'>
          <p className='text-sm font-medium text-green-900 mb-2'>
            Notification Test Steps:
          </p>
          <ol className='text-xs text-green-800 space-y-1'>
            <li>
              1. Select a user (e.g., Bryan) → Click "Create Collaboration
              Notification" (Purple theme)
            </li>
            <li>2. Click "Create General Notification" (Blue theme)</li>
            <li>3. Go to Notification Center → Check different color themes</li>
            <li>
              4. Click on notifications → Verify "mark as read" functionality
            </li>
            <li>
              5. Check unread count → Should decrease after marking as read
            </li>
            <li>
              6. Click "Clear Notifications" → Verify all notifications are
              removed
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default NotificationTest;

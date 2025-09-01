import { useCallback, useEffect } from 'react';

import { notificationService } from '../../../services';
import {
  approveCollaborationRequest,
  denyCollaborationRequest,
} from '../../../services/mock/collaborationRequestService.js';
import { updateReviewRequest } from '../../../services/mock/reviewRequestService.js';
import { getCurrentUserId } from '../../../utils/currentUser.js';
import { filterNotifications } from '../utils/notificationHelpers';

const useNotificationActions = ({ state, setters }) => {
  const { setItems, setFilteredNotifications, setIsLoading } = setters;

  // 加载通知数据
  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await notificationService.getUserNotifications(
        getCurrentUserId()
      );
      if (result.success) {
        const notifications = result.data || [];
        console.log(
          'NotificationCenter: Loaded notifications:',
          notifications.length
        );
        setItems(notifications);
        console.log('NotificationCenter: Updated items state');
      } else {
        console.error('Failed to load notifications:', result.error);
        setItems([]);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [setItems, setIsLoading]);

  // 初始化加载
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (mounted) {
        await loadNotifications();
      }
    };

    load();

    const onChange = e => {
      const id = e?.detail?.userId;
      console.log(
        'NotificationCenter: Received event:',
        e.type,
        'for user:',
        id,
        'current user:',
        getCurrentUserId()
      );
      if (!id || id === getCurrentUserId()) {
        console.log(
          'NotificationCenter: Reloading notifications due to change'
        );
        // 延迟加载，确保数据已更新
        setTimeout(() => {
          if (mounted) {
            load();
          }
        }, 100);
      }
    };

    window.addEventListener('notif:unreadChanged', onChange);
    window.addEventListener('user:changed', load);

    return () => {
      mounted = false;
      window.removeEventListener('notif:unreadChanged', onChange);
      window.removeEventListener('user:changed', load);
    };
  }, [loadNotifications]);

  // 筛选通知
  useEffect(() => {
    const filtered = filterNotifications(
      state.items,
      state.activeTab,
      state.timeFilter
    );
    setFilteredNotifications(filtered);
  }, [
    state.items,
    state.activeTab,
    state.timeFilter,
    setFilteredNotifications,
  ]);

  // 处理通知点击，标记为已读
  const handleNotificationClick = useCallback(async notification => {
    // 注意：这里不需要再次调用 markAsRead，因为 NotificationItem 已经调用了 onMarkAsRead
    // 我们只需要处理导航逻辑

    if (notification.projectId) {
      // 实现项目页面跳转
    }

    console.log('Navigate to notification detail:', notification);
  }, []);

  // 标记单个通知为已读
  const handleMarkAsRead = useCallback(
    async notificationId => {
      try {
        await notificationService.markAsRead(notificationId);
        console.log(
          'NotificationCenter: Marked notification as read:',
          notificationId
        );

        // 重新加载通知列表以更新状态
        const result = await notificationService.getUserNotifications(
          getCurrentUserId()
        );
        if (result.success) {
          setItems(result.data || []);
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },
    [setItems]
  );

  // 标记所有为已读
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead(getCurrentUserId());
      console.log('NotificationCenter: Marked all as read');
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  }, []);

  // 处理review request审批
  const handleReviewRequest = useCallback(async (notification, action) => {
    try {
      const { requestId } = notification.meta;
      const updatedRequest = updateReviewRequest(requestId, action);

      if (updatedRequest) {
        console.log(`Review request ${action}:`, updatedRequest);
        await notificationService.markAsRead(notification.id);
      }
    } catch (error) {
      console.error('Error handling review request:', error);
    }
  }, []);

  // 处理协作请求审批
  const handleCollaborationRequest = useCallback(
    async (notification, action) => {
      try {
        const { requestId } = notification.meta;
        const currentUserId = getCurrentUserId();

        console.log('Handling collaboration request:', {
          requestId,
          action,
          currentUserId,
        });

        let updatedRequest;
        if (action === 'approve') {
          updatedRequest = await approveCollaborationRequest(
            requestId,
            currentUserId
          );
        } else if (action === 'deny') {
          updatedRequest = await denyCollaborationRequest(
            requestId,
            currentUserId
          );
        }

        if (updatedRequest) {
          console.log(`Collaboration request ${action}:`, updatedRequest);
          await notificationService.markAsRead(notification.id);

          // 重新加载通知列表
          const result = await notificationService.getUserNotifications(
            currentUserId
          );
          if (result.success) {
            setItems(result.data || []);
          }
        }
      } catch (error) {
        console.error('Error handling collaboration request:', error);
      }
    },
    [setItems]
  );

  return {
    loadNotifications,
    handleNotificationClick,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleReviewRequest,
    handleCollaborationRequest,
  };
};

export default useNotificationActions;

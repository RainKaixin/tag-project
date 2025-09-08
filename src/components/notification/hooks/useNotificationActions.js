import { useCallback, useEffect } from 'react';

import { notificationService } from '../../../services';
import {
  approveCollaborationRequest,
  denyCollaborationRequest,
} from '../../../services/mock/collaborationRequestService.js';
import { getCurrentUserId } from '../../../utils/currentUser.js';
import { filterNotifications } from '../utils/notificationHelpers';

const useNotificationActions = ({ state, setters }) => {
  const { setItems, setFilteredNotifications, setIsLoading } = setters;

  // 加载通知数据
  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await notificationService.getUserNotifications(
        await getCurrentUserId()
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

    const onChange = async e => {
      const id = e?.detail?.userId;
      console.log(
        'NotificationCenter: Received event:',
        e.type,
        'for user:',
        id,
        'current user:',
        await getCurrentUserId()
      );
      if (!id || id === (await getCurrentUserId())) {
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
    console.log('Notification clicked:', notification);

    // 只处理 Collaboration Application 通知的跳转
    if (notification.type === 'collaboration') {
      // 尝试从不同位置获取项目ID
      const projectId =
        notification.projectId ||
        notification.meta?.projectId ||
        notification.meta?.requestId ||
        notification.meta?.collaborationId; // 添加这个字段！

      console.log('Notification projectId lookup:', {
        direct: notification.projectId,
        metaProjectId: notification.meta?.projectId,
        metaRequestId: notification.meta?.requestId,
        metaCollaborationId: notification.meta?.collaborationId,
        final: projectId,
      });

      if (projectId) {
        // 跳转到协作项目详情页面
        console.log('Navigating to collaboration project:', projectId);
        window.location.href = `/tagme/collaboration/${projectId}`;
      } else {
        console.log('No projectId found in notification:', notification);
      }
    } else {
      // 其他通知类型只标记为已读，不进行跳转
      console.log('Notification clicked, marked as read:', notification.type);
    }
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
          await getCurrentUserId()
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
      await notificationService.markAllAsRead(await getCurrentUserId());
      console.log('NotificationCenter: Marked all as read');
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  }, []);

  // 处理review request审批 - 已移除，改为 Add Experience 功能
  const handleReviewRequest = useCallback(async (notification, action) => {
    console.log(
      'Review request functionality has been replaced with Add Experience'
    );
  }, []);

  // 处理协作请求审批
  const handleCollaborationRequest = useCallback(
    async (notification, action) => {
      try {
        const { requestId } = notification.meta;
        const currentUserId = await getCurrentUserId();

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

import React from 'react';

import NotificationHeader from './components/NotificationHeader';
import NotificationList from './components/NotificationList';
import useNotificationActions from './hooks/useNotificationActions';
import useNotificationData from './hooks/useNotificationData';
import useNotificationState from './hooks/useNotificationState';

const NotificationCenter = () => {
  const { state, setters } = useNotificationState();
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  } = useNotificationData();

  const actions = useNotificationActions({ state, setters });

  // 更新 state 当通知加载完成
  React.useEffect(() => {
    setters.setItems(notifications);
    setters.setFilteredNotifications(notifications);
    setters.setIsLoading(isLoading);
  }, [notifications, isLoading]);

  const handleLoadMore = () => {
    // 实现加载更多逻辑
    fetchNotifications();
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationHeader
        activeTab={state.activeTab}
        timeFilter={state.timeFilter}
        items={notifications}
        onTabChange={setters.setActiveTab}
        onTimeFilterChange={setters.setTimeFilter}
        onMarkAllAsRead={markAllAsRead}
      />
      <NotificationList
        isLoading={isLoading}
        filteredNotifications={notifications}
        hasMore={state.hasMore}
        onNotificationClick={actions.handleNotificationClick}
        onReviewRequest={actions.handleReviewRequest}
        onCollaborationRequest={actions.handleCollaborationRequest}
        onMarkAsRead={markAsRead}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default NotificationCenter;

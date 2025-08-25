import React from 'react';

// Import hooks

// Import components
import NotificationHeader from './components/NotificationHeader';
import NotificationList from './components/NotificationList';
import useNotificationActions from './hooks/useNotificationActions';
import useNotificationState from './hooks/useNotificationState';

const NotificationCenter = () => {
  // Use custom hooks
  const { state, setters } = useNotificationState();
  const actions = useNotificationActions({ state, setters });

  // 加载更多处理函数
  const handleLoadMore = () => {
    // 实现加载更多逻辑
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationHeader
        activeTab={state.activeTab}
        timeFilter={state.timeFilter}
        items={state.items}
        onTabChange={setters.setActiveTab}
        onTimeFilterChange={setters.setTimeFilter}
        onMarkAllAsRead={actions.handleMarkAllAsRead}
      />

      <NotificationList
        isLoading={state.isLoading}
        filteredNotifications={state.filteredNotifications}
        hasMore={state.hasMore}
        onNotificationClick={actions.handleNotificationClick}
        onReviewRequest={actions.handleReviewRequest}
        onCollaborationRequest={actions.handleCollaborationRequest}
        onMarkAsRead={actions.handleMarkAsRead}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default NotificationCenter;

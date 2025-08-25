import React from 'react';

import { LoadingSpinner } from '../../ui';

import NotificationItem from './NotificationItem';

const NotificationList = ({
  isLoading,
  filteredNotifications,
  hasMore,
  onNotificationClick,
  onReviewRequest,
  onCollaborationRequest,
  onMarkAsRead,
  onLoadMore,
}) => {
  if (isLoading) {
    return (
      <div className='text-center py-12'>
        <LoadingSpinner />
        <p className='mt-2 text-gray-600'>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='space-y-4'>
        {filteredNotifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onNotificationClick={onNotificationClick}
            onReviewRequest={onReviewRequest}
            onCollaborationRequest={onCollaborationRequest}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>

      {/* 加载更多 */}
      {hasMore && !isLoading && (
        <div className='text-center mt-8'>
          <button
            onClick={onLoadMore}
            className='text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 mx-auto transition-colors duration-200'
          >
            <span>Load more notifications</span>
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;

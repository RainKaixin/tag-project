import { notificationTypeMap } from '../data/notificationOptions';

// 筛选通知
export const filterNotifications = (items, activeTab, timeFilter) => {
  let filtered = [...items];

  // 按标签筛选
  if (activeTab !== 'All') {
    const typeToFilter = notificationTypeMap[activeTab];
    filtered = filtered.filter(
      notification => notification.type === typeToFilter
    );
  }

  // 按时间筛选（暂时保留，但不再使用typeFilter）
  if (timeFilter !== 'Last 7 days') {
    // 这里可以添加时间筛选逻辑
  }

  return filtered;
};

// 获取通知计数
export const getNotificationCount = (items, type) => {
  if (type === 'All') {
    return items.length;
  }
  const typeToCount = notificationTypeMap[type];
  return items.filter(n => n.type === typeToCount).length;
};

// 获取通知图标
export const getNotificationIcon = (type, userAvatar) => {
  switch (type) {
    case 'system':
      return (
        <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-4 h-4 text-blue-600'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
          </svg>
        </div>
      );
    case 'comments':
      return (
        <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-4 h-4 text-green-600'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      );
    case 'comment':
      return (
        <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-4 h-4 text-blue-600'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      );
    case 'collaboration':
      return (
        <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-4 h-4 text-purple-600'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z' />
          </svg>
        </div>
      );
    case 'review_request':
      return (
        <div className='w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-4 h-4 text-orange-600'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
        </div>
      );
    case 'final_comment':
      return (
        <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-4 h-4 text-blue-600'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      );
    case 'follow':
      return (
        <div className='w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-4 h-4 text-pink-600'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
            <path
              fillRule='evenodd'
              d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      );
    case 'like':
      return (
        <div className='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-4 h-4 text-red-600'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      );
    default:
      return (
        <div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-4 h-4 text-gray-600'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      );
  }
};

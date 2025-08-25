import React from 'react';

import { Badge } from '../../ui';
import { tabOptions, timeFilterOptions } from '../data/notificationOptions';
import { getNotificationCount } from '../utils/notificationHelpers';

const NotificationHeader = ({
  activeTab,
  timeFilter,
  items,
  onTabChange,
  onTimeFilterChange,
  onMarkAllAsRead,
}) => {
  return (
    <div className='bg-white border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <h1 className='text-3xl font-bold text-gray-900 mb-6'>
          Notification Center
        </h1>

        {/* 筛选标签 */}
        <div className='flex space-x-8 border-b border-gray-200'>
          {tabOptions.map(tab => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab
                  ? tab === 'Collaboration'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
              <Badge
                count={getNotificationCount(items, tab)}
                color={
                  activeTab === tab
                    ? tab === 'Collaboration'
                      ? 'purple'
                      : 'blue'
                    : 'gray'
                }
              />
            </button>
          ))}
        </div>

        {/* 筛选工具条 */}
        <div className='flex items-center justify-between mt-4'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-gray-600'>Filter by:</span>
              <select
                value={timeFilter}
                onChange={e => onTimeFilterChange(e.target.value)}
                className='text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                {timeFilterOptions.map(option => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={onMarkAllAsRead}
            className='text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1 transition-colors duration-200'
          >
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            <span>Mark all as read</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationHeader;

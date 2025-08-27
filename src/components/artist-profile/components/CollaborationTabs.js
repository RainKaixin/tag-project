// collaboration-tabs v1: Collaboration Tab 切換組件

import React from 'react';

/**
 * Collaboration Tab 切換組件
 * @param {string} activeTab - 當前選中的 tab ('published' | 'drafts')
 * @param {Function} onTabChange - Tab 切換事件處理函數
 * @param {string} className - 額外的 CSS 類名
 */
const CollaborationTabs = ({ activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`bg-gray-100 rounded-lg p-1 ${className}`}>
      <div className='flex bg-white rounded-md'>
        <button
          onClick={() => onTabChange('published')}
          className={`flex-1 py-2 px-4 text-sm font-bold rounded-md transition-colors duration-200 ${
            activeTab === 'published'
              ? 'bg-tag-purple text-white'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Published
        </button>
        <button
          onClick={() => onTabChange('drafts')}
          className={`flex-1 py-2 px-4 text-sm font-bold rounded-md transition-colors duration-200 ${
            activeTab === 'drafts'
              ? 'bg-tag-purple text-white'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Drafts
        </button>
      </div>
    </div>
  );
};

export default CollaborationTabs;

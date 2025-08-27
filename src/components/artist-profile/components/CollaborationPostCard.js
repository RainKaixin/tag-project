// collaboration-post-card v1: Collaboration Post 卡片組件

import React, { useState } from 'react';

/**
 * Collaboration Post 卡片組件
 * @param {Object} post - Collaboration post 數據
 * @param {string} className - 額外的 CSS 類名
 * @param {Function} onDelete - 刪除回調函數（僅用於草稿）
 */
const CollaborationPostCard = ({ post, className = '', onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 檢查是否為草稿
  const isDraft = post.isDraft;
  // 處理刪除確認
  const handleDeleteClick = e => {
    e.stopPropagation(); // 阻止事件冒泡，避免觸發卡片點擊
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = e => {
    e.stopPropagation(); // 阻止事件冒泡
    if (onDelete) {
      onDelete(post.id);
    }
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = e => {
    e.stopPropagation(); // 阻止事件冒泡
    setShowDeleteConfirm(false);
  };

  const handleModalClick = e => {
    e.stopPropagation(); // 阻止事件冒泡
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
    >
      {/* 圖片區域 */}
      <div className='relative'>
        <img
          src={post.image || '/assets/placeholder.svg'}
          alt={post.title}
          className='w-full h-48 object-cover'
        />

        {/* 刪除按鈕（僅草稿顯示） */}
        {isDraft && onDelete && (
          <button
            onClick={handleDeleteClick}
            className='absolute top-3 right-3 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-sm transition-all duration-200 hover:scale-110'
            title='Delete draft'
          >
            <svg
              className='w-4 h-4 text-red-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        )}
      </div>

      {/* 內容區域 */}
      <div className='p-4'>
        <div className='flex items-center gap-2 mb-2'>
          <h4 className='font-medium text-gray-900'>{post.title}</h4>
          {isDraft && (
            <span className='px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full'>
              Draft
            </span>
          )}
        </div>

        {/* 作者和日期 */}
        <div className='flex items-center gap-2 mb-3'>
          <div className='w-6 h-6 bg-gray-300 rounded-full flex-shrink-0'></div>
          <span className='text-sm text-gray-700'>{post.author}</span>
          <span className='text-sm text-gray-500'>•</span>
          <span className='text-sm text-gray-500'>{post.date}</span>
        </div>

        {/* 標籤 */}
        {post.tags && post.tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className='px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full'
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className='px-2 py-1 text-xs text-gray-500'>
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* 刪除確認對話框 */}
      {showDeleteConfirm && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
          onClick={handleModalClick}
        >
          <div className='bg-white rounded-lg p-6 max-w-sm mx-4'>
            <div className='flex items-center mb-4'>
              <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3'>
                <svg
                  className='w-6 h-6 text-red-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>
                Delete Draft
              </h3>
            </div>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete "{post.title}"? This action cannot
              be undone.
            </p>
            <div className='flex gap-3'>
              <button
                onClick={handleCancelDelete}
                className='flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200'
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className='flex-1 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors duration-200'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationPostCard;

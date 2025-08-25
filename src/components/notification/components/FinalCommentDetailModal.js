import React from 'react';

/**
 * FinalCommentDetailModal组件 - 显示最终评论详细信息
 * @param {Object} props - 组件属性
 * @param {boolean} props.isOpen - 是否显示弹窗
 * @param {Function} props.onClose - 关闭弹窗函数
 * @param {Object} props.notification - 通知对象
 * @param {string} props.className - 额外的CSS类名
 */
const FinalCommentDetailModal = ({
  isOpen = false,
  onClose = () => {},
  notification = null,
  className = '',
}) => {
  // 如果弹窗未打开，不渲染
  if (!isOpen || !notification) {
    return null;
  }

  // 从通知中提取评论信息
  const commentData = notification.meta || {};
  const commentText = commentData.commentText || 'No comment content available';
  const authorName = commentData.authorName || 'Unknown User';
  const authorRole = commentData.authorRole || 'Member';
  const projectName =
    commentData.projectName || notification.projectId || 'Unknown Project';
  const sentiment = commentData.sentiment || 'positive';

  // 获取情感标签
  const getSentimentLabel = sentiment => {
    switch (sentiment) {
      case 'positive':
        return 'Positive';
      case 'neutral':
        return 'Neutral';
      case 'negative':
        return 'Negative';
      default:
        return 'Positive';
    }
  };

  // 获取情感颜色
  const getSentimentColor = sentiment => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'neutral':
        return 'bg-gray-100 text-gray-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div
        className={`bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${className}`}
      >
        {/* 头部 */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <svg
                className='w-8 h-8 text-blue-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                />
              </svg>
            </div>
            <div className='ml-4'>
              <h3 className='text-xl font-semibold text-gray-900'>
                Final Comment Details
              </h3>
              <p className='text-sm text-gray-600 mt-1'>
                Review the submitted final comment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors duration-200'
          >
            <svg
              className='w-6 h-6'
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
        </div>

        {/* 项目信息 */}
        <div className='bg-gray-50 rounded-lg p-4 mb-6'>
          <h4 className='text-sm font-medium text-gray-900 mb-2'>
            Project Information
          </h4>
          <div className='text-sm text-gray-700'>
            <p>
              <strong>Project:</strong> {projectName}
            </p>
            <p>
              <strong>Notification:</strong> {notification.title}
            </p>
            <p>
              <strong>Received:</strong>{' '}
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* 评论者信息 */}
        <div className='bg-blue-50 rounded-lg p-4 mb-6'>
          <h4 className='text-sm font-medium text-gray-900 mb-2'>
            Comment Author
          </h4>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-gray-700'>
              <p>
                <strong>Name:</strong> {authorName}
              </p>
              <p>
                <strong>Role:</strong> {authorRole}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(
                sentiment
              )}`}
            >
              {getSentimentLabel(sentiment)}
            </span>
          </div>
        </div>

        {/* 评论内容 */}
        <div className='mb-6'>
          <h4 className='text-sm font-medium text-gray-900 mb-3'>
            Comment Content
          </h4>
          <div className='bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500'>
            <blockquote className='text-gray-700 italic leading-relaxed'>
              "{commentText}"
            </blockquote>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className='flex justify-end space-x-4 pt-4 border-t border-gray-200'>
          <button
            onClick={onClose}
            className='px-6 py-3 text-base text-gray-600 hover:text-gray-800 transition-colors duration-200'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalCommentDetailModal;

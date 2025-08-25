// comment-reply-form v1: 评论回复输入组件

import React from 'react';

import { getCurrentUserAvatar } from '../../../utils/currentUser';

/**
 * 评论回复输入组件
 * @param {string} parentId - 父评论ID
 * @param {string} parentAuthorName - 父评论作者姓名
 * @param {string} draft - 草稿内容
 * @param {Function} onChange - 内容变化事件
 * @param {Function} onSubmit - 提交事件
 * @param {Function} onCancel - 取消事件
 * @param {string} className - 额外的CSS类名
 */
const CommentReplyForm = ({
  parentId,
  parentAuthorName,
  draft,
  onChange,
  onSubmit,
  onCancel,
  className = '',
}) => {
  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(parentId);
    }
  };

  return (
    <div className={`mt-2 pl-10 ${className}`}>
      <div className='flex items-start space-x-3'>
        <img
          src={getCurrentUserAvatar()}
          alt='Your avatar'
          className='w-8 h-8 rounded-full flex-shrink-0'
        />
        <div className='flex-1'>
          <textarea
            value={draft || ''}
            onChange={e => onChange(parentId, e.target.value)}
            placeholder={`Reply to ${parentAuthorName}…`}
            rows={2}
            className='w-full p-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-transparent'
            onKeyDown={handleKeyDown}
          />
          <div className='mt-2 flex gap-2'>
            <button
              className='px-3 py-1 rounded bg-tag-blue text-white text-sm hover:bg-tag-dark-blue transition-colors duration-200'
              onClick={() => onSubmit(parentId)}
            >
              Post
            </button>
            <button
              className='px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50 transition-colors duration-200'
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentReplyForm;









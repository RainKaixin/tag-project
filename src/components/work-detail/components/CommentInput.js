// comment-input v1: 评论输入组件

import { useState, useEffect } from 'react';

import { getCurrentUserAvatar } from '../../../utils/currentUser';

/**
 * 评论输入组件
 * @param {string} comment - 评论内容
 * @param {Function} onCommentChange - 评论内容变化事件
 * @param {Function} onCommentSubmit - 评论提交事件
 * @param {string} replyTo - 回复的评论ID
 * @param {Function} onCancelReply - 取消回复事件
 * @param {string} className - 额外的CSS类名
 */
const CommentInput = ({
  comment,
  onCommentChange,
  onCommentSubmit,
  replyTo,
  onCancelReply,
  className = '',
}) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        setIsLoadingAvatar(true);
        const avatar = await getCurrentUserAvatar();
        setAvatarUrl(avatar);
      } catch (error) {
        console.warn('[CommentInput] Failed to load avatar:', error);
        setAvatarUrl(null);
      } finally {
        setIsLoadingAvatar(false);
      }
    };

    loadAvatar();
  }, []);

  return (
    <div className={`flex items-start space-x-3 mb-6 ${className}`}>
      <img
        src={avatarUrl || '/default-avatar.png'}
        alt='Your avatar'
        className='w-10 h-10 rounded-full'
      />
      <div className='flex-1'>
        {replyTo && (
          <div className='mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-blue-700'>
                Replying to a comment
              </span>
              <button
                onClick={onCancelReply}
                className='text-blue-500 hover:text-blue-700 text-sm'
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <textarea
          value={comment}
          onChange={onCommentChange}
          placeholder={replyTo ? 'Write your reply...' : 'Add a comment...'}
          className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-transparent'
          rows='3'
        />
        <div className='flex justify-end mt-2'>
          <button
            onClick={onCommentSubmit}
            className='px-4 py-2 bg-tag-blue text-white rounded-lg hover:bg-tag-dark-blue transition-colors duration-200'
          >
            {replyTo ? 'Reply' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;

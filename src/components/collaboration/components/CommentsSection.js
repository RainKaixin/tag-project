import React from 'react';
import { Link } from 'react-router-dom';

import { PrimaryButton } from '../../ui';

const CommentsSection = ({
  comment,
  onCommentChange,
  onSubmitComment,
  positionComments,
  positionId,
}) => {
  return (
    <div className='space-y-6'>
      {/* Comment Input */}
      <div className='bg-gray-50 rounded-lg p-4'>
        <form onSubmit={onSubmitComment} className='space-y-4'>
          <textarea
            value={comment}
            onChange={onCommentChange}
            placeholder='Share your thoughts, questions, or feedback about this position...'
            className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            rows='3'
          />
          <div className='flex items-center justify-between'>
            <button
              type='button'
              className='flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13'
                />
              </svg>
              Attach Image
            </button>
            <PrimaryButton
              type='submit'
              disabled={!comment.trim()}
              size='sm'
              className='disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Comment
            </PrimaryButton>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className='space-y-4'>
        {positionComments[positionId]?.map(commentItem => (
          <div key={commentItem.id} className='bg-gray-50 rounded-lg p-4'>
            <div className='flex items-start gap-4'>
              <Link
                to={`/artist/${commentItem.user}`}
                className='w-10 h-10 rounded-full flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-200'
              >
                <img
                  src={commentItem.avatar}
                  alt={commentItem.user}
                  className='w-10 h-10 rounded-full'
                />
              </Link>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <Link
                    to={`/artist/${commentItem.user}`}
                    className='font-medium text-gray-900 cursor-pointer hover:text-tag-blue transition-colors duration-200'
                  >
                    {commentItem.user}
                  </Link>
                  <span className='text-xs text-gray-500'>•</span>
                  <span className='text-xs text-gray-500'>
                    {commentItem.role}
                  </span>
                  <span className='text-xs text-gray-500'>•</span>
                  <span className='text-xs text-gray-500'>
                    {commentItem.timestamp}
                  </span>
                </div>
                <p className='text-gray-700 mb-3'>{commentItem.comment}</p>
                <div className='flex items-center gap-4'>
                  <button className='flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200'>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                      />
                    </svg>
                    {commentItem.likes}
                  </button>
                  <button className='text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200'>
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;

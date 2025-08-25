import React, { useState } from 'react';

const FinalCommentModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    // Validation
    if (!comment.trim()) {
      setError('Please enter your comment');
      return;
    }

    if (comment.length < 100) {
      setError('Comment must be at least 100 characters');
      return;
    }

    if (comment.length > 600) {
      setError('Comment must be less than 600 characters');
      return;
    }

    setError('');
    onSubmit(comment);
  };

  const handleClose = () => {
    setComment('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-bold text-gray-900'>
            Write Final Comment
          </h3>
          <button
            onClick={handleClose}
            className='text-gray-400 hover:text-gray-600 transition-colors duration-200'
            aria-label='Close modal'
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

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Your Final Comment *
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
              rows='4'
              placeholder='Share your final thoughts about this project collaboration (100-600 characters)...'
              aria-describedby='comment-help comment-error'
            />
            <div className='flex justify-between items-center mt-2'>
              <p id='comment-help' className='text-xs text-gray-500'>
                {comment.length}/600 characters
              </p>
              {error && (
                <p id='comment-error' className='text-xs text-red-500'>
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={handleClose}
              className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200'
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinalCommentModal;























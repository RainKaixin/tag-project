import React from 'react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  onDeny,
  notification,
  actionType = 'collaboration', // 'collaboration' 或 'review'
}) => {
  if (!isOpen) return null;

  const getActionText = () => {
    if (actionType === 'collaboration') {
      return {
        title: 'Collaboration Request',
        confirmText: 'Approve',
        denyText: 'Deny',
        message: `Are you sure you want to approve the collaboration request from "${
          notification?.meta?.requesterName || 'Unknown'
        }"?`,
      };
    } else {
      return {
        title: 'Review Request',
        confirmText: 'Approve',
        denyText: 'Deny',
        message: `Are you sure you want to approve the review request?`,
      };
    }
  };

  const actionText = getActionText();

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl'>
        {/* Header */}
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>
            {actionText.title}
          </h3>
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

        {/* Content */}
        <div className='mb-6'>
          <p className='text-sm text-gray-600 mb-4'>{actionText.message}</p>

          {/* Notification details */}
          {notification && (
            <div className='bg-gray-50 rounded-lg p-3'>
              <p className='text-sm font-medium text-gray-900 mb-1'>
                {notification.title}
              </p>
              {notification.message && (
                <p className='text-xs text-gray-600'>{notification.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className='flex space-x-3'>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200'
          >
            Cancel
          </button>
          <button
            onClick={onDeny}
            className='flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200'
          >
            {actionText.denyText}
          </button>
          <button
            onClick={onConfirm}
            className='flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200'
          >
            {actionText.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

/**
 * FinalCommentModal组件 - 最终评论确认弹窗
 * @param {Object} props - 组件属性
 * @param {boolean} props.isOpen - 是否显示弹窗
 * @param {Function} props.onClose - 关闭弹窗函数
 * @param {Function} props.onConfirm - 确认函数
 * @param {string} props.commentText - 评论文本
 * @param {boolean} props.isLoading - 是否加载中
 * @param {string} props.className - 额外的CSS类名
 */
const FinalCommentModal = ({
  isOpen = false,
  onClose = () => {},
  onConfirm = () => {},
  commentText = '',
  isLoading = false,
  className = '',
}) => {
  // 如果弹窗未打开，不渲染
  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div
        className={`bg-white rounded-lg p-8 max-w-lg w-full mx-4 ${className}`}
      >
        <div className='flex items-center mb-6'>
          <div className='flex-shrink-0'>
            <svg
              className='w-8 h-8 text-yellow-500'
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
          <div className='ml-4'>
            <h3 className='text-xl font-semibold text-gray-900'>
              Final Comment Confirmation
            </h3>
            <p className='text-sm text-gray-600 mt-1'>
              Please read this important notice
            </p>
          </div>
        </div>

        <div className='mb-8'>
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='w-5 h-5 text-yellow-400'
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
              <div className='ml-3'>
                <h4 className='text-sm font-medium text-yellow-800'>
                  Important Notice
                </h4>
                <div className='mt-2 text-sm text-yellow-700'>
                  <p className='mb-2'>
                    Once you submit your final comment, it{' '}
                    <strong>cannot be changed or deleted</strong>.
                  </p>
                  <p>
                    This comment will be permanently associated with your
                    participation in this project.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-gray-50 rounded-lg p-4'>
            <h4 className='text-sm font-medium text-gray-900 mb-2'>
              Your Comment Preview:
            </h4>
            <div className='text-sm text-gray-700 italic'>
              &quot;{commentText}&quot;
            </div>
          </div>
        </div>

        <div className='flex justify-end space-x-4'>
          <button
            onClick={onClose}
            disabled={isLoading}
            className='px-6 py-3 text-base text-gray-600 hover:text-gray-800 transition-colors duration-200 disabled:opacity-50'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-3 text-base rounded-lg font-medium transition-colors duration-200 ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isLoading ? 'Submitting...' : 'Confirm & Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalCommentModal;

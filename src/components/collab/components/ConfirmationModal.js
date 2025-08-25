import React, { useState } from 'react';

/**
 * ConfirmationModal组件 - 参与确认弹窗
 * @param {Object} props - 组件属性
 * @param {boolean} props.isOpen - 是否显示弹窗
 * @param {Function} props.onClose - 关闭弹窗函数
 * @param {Function} props.onConfirm - 确认函数
 * @param {string} props.title - 弹窗标题
 * @param {string} props.className - 额外的CSS类名
 */
const ConfirmationModal = ({
  isOpen = false,
  onClose = () => {},
  onConfirm = () => {},
  title = 'Participation Verification',
  className = '',
}) => {
  const [userParticipationStatus, setUserParticipationStatus] = useState({
    hasApplied: false,
    hasCompleted: false,
  });

  // 如果弹窗未打开，不渲染
  if (!isOpen) {
    return null;
  }

  // 检查是否可以确认
  const canConfirm =
    userParticipationStatus.hasApplied && userParticipationStatus.hasCompleted;

  // 处理确认
  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm();
      onClose();
      // 重置状态
      setUserParticipationStatus({
        hasApplied: false,
        hasCompleted: false,
      });
    }
  };

  // 处理关闭
  const handleClose = () => {
    onClose();
    // 重置状态
    setUserParticipationStatus({
      hasApplied: false,
      hasCompleted: false,
    });
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div
        className={`bg-white rounded-lg p-8 max-w-lg w-full mx-4 ${className}`}
      >
        <h3 className='text-xl font-semibold text-gray-900 mb-6'>{title}</h3>

        <div className='space-y-6 mb-8'>
          <div className='flex items-center'>
            <input
              type='checkbox'
              checked={userParticipationStatus.hasApplied}
              onChange={e =>
                setUserParticipationStatus(prev => ({
                  ...prev,
                  hasApplied: e.target.checked,
                }))
              }
              className='w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500'
            />
            <label className='ml-4 text-base text-gray-700'>
              I have applied to participate in this project
            </label>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              checked={userParticipationStatus.hasCompleted}
              onChange={e =>
                setUserParticipationStatus(prev => ({
                  ...prev,
                  hasCompleted: e.target.checked,
                }))
              }
              className='w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500'
            />
            <label className='ml-4 text-base text-gray-700'>
              I have completed my tasks in this project
            </label>
          </div>
        </div>

        <div className='flex justify-end space-x-4'>
          <button
            onClick={handleClose}
            className='px-6 py-3 text-base text-gray-600 hover:text-gray-800 transition-colors duration-200'
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`px-6 py-3 text-base rounded-lg font-medium transition-colors duration-200 ${
              canConfirm
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

import React, { useEffect, useRef, useState } from 'react';

import { isApplicationApproved } from '../../../utils/applicationStorage';
import { PrimaryButton, SecondaryButton } from '../../ui';

const ApplicationInfoPopover = ({
  isOpen,
  onClose,
  application,
  onApprove,
  onContact,
  isInitiator = false,
  anchorElement, // 锚定元素（头像）
  positionId, // 添加职位ID参数
  positions, // 添加positions数据，用于检查状态
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const popoverRef = useRef(null);

  // 改进状态检查逻辑：优先使用applicationStorage检查申请状态
  const isApproved = React.useMemo(() => {
    console.log('[ApplicationInfoPopover] Checking approval status...');
    console.log('[ApplicationInfoPopover] Application:', application);
    console.log(
      '[ApplicationInfoPopover] Application type:',
      typeof application
    );
    console.log(
      '[ApplicationInfoPopover] Application keys:',
      application ? Object.keys(application) : 'null'
    );
    console.log('[ApplicationInfoPopover] Position ID:', positionId);
    console.log('[ApplicationInfoPopover] Positions:', positions);
    console.log(
      '[ApplicationInfoPopover] Application status:',
      application?.status
    );

    // 优先检查applicationStorage中的状态
    // 统一使用application.id作为键，如果没有则回退到userId
    const applicantId = application?.id || application?.userId;
    if (positionId && applicantId) {
      const storageApproved = isApplicationApproved(positionId, applicantId);
      if (storageApproved) {
        console.log(
          '[ApplicationInfoPopover] Application is approved in storage'
        );
        return true;
      }
    }

    // 回退到检查application对象本身的状态
    if (application?.status === 'approved') {
      console.log('[ApplicationInfoPopover] Application is already approved');
      return true;
    }

    // 如果有positionId和positions，检查特定职位中的状态
    if (positionId && positions) {
      const position = positions.find(p => p.id === positionId);
      if (position && position.applications) {
        const appInPosition = position.applications.find(
          app =>
            app.id === application?.id || app.userId === application?.userId
        );

        console.log('[ApplicationInfoPopover] App in position:', appInPosition);
        console.log(
          '[ApplicationInfoPopover] App status in position:',
          appInPosition?.status
        );

        if (appInPosition?.status === 'approved') {
          console.log(
            '[ApplicationInfoPopover] App is approved in this specific position'
          );
          return true;
        }
      }
    }

    // 如果没有positionId，回退到检查application.status
    if (!positionId && application?.status === 'approved') {
      console.log(
        '[ApplicationInfoPopover] No positionId, but application is approved'
      );
      return true;
    }

    console.log(
      '[ApplicationInfoPopover] Application is not approved for this position'
    );
    return false;
  }, [application, positionId, positions]);

  // 添加调试日志
  console.log(
    '[ApplicationInfoPopover] Application status:',
    application?.status
  );
  console.log('[ApplicationInfoPopover] Position ID:', positionId);
  console.log('[ApplicationInfoPopover] Is approved:', isApproved);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        !anchorElement?.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose, anchorElement]);

  // 计算Popover位置
  const getPopoverStyle = () => {
    if (!anchorElement) return {};

    const rect = anchorElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    return {
      position: 'absolute',
      top: rect.bottom + scrollTop + 8, // 头像下方8px
      left: rect.left + scrollLeft - 150, // 居中对齐（假设Popover宽度300px）
      zIndex: 1000,
    };
  };

  if (!isOpen || !application || !anchorElement) return null;

  const handleContact = () => {
    if (application.email) {
      try {
        // 尝试打开邮件客户端
        const mailtoLink = `mailto:${application.email}`;
        window.open(mailtoLink, '_blank');

        // 添加一些调试信息
        console.log(
          '[ApplicationInfoPopover] Opening mailto link:',
          mailtoLink
        );

        // 如果浏览器不支持mailto，提供备用方案
        setTimeout(() => {
          // 检查是否成功打开了邮件客户端
          // 如果没有，可以显示一个提示
          console.log(
            '[ApplicationInfoPopover] Mailto link should have opened'
          );
        }, 100);
      } catch (error) {
        console.error(
          '[ApplicationInfoPopover] Failed to open mailto link:',
          error
        );
        // 备用方案：复制邮箱到剪贴板
        navigator.clipboard
          .writeText(application.email)
          .then(() => {
            alert(`Email address copied to clipboard: ${application.email}`);
          })
          .catch(() => {
            alert(`Please copy this email address: ${application.email}`);
          });
      }
    } else {
      console.warn('[ApplicationInfoPopover] No email address available');
    }
    onContact?.();
  };

  const handleApprove = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmApprove = () => {
    console.log(
      '[ApplicationInfoPopover] Confirming approval for:',
      application.name,
      'position:',
      positionId
    );
    onApprove?.(application, positionId);
    setShowConfirmModal(false);

    // 添加成功提示
    console.log('[ApplicationInfoPopover] Application approved successfully');
  };

  const handleCancelApprove = () => {
    setShowConfirmModal(false);
  };

  return (
    <div
      ref={popoverRef}
      style={getPopoverStyle()}
      className='bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-w-sm'
    >
      {/* 小箭头 */}
      <div className='absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45'></div>

      {/* 内容 */}
      <div className='p-4 space-y-4'>
        {/* 头部 */}
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Application Details
          </h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors duration-200'
          >
            <svg
              className='w-5 h-5'
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

        {/* 申请人信息 */}
        <div className='flex items-center gap-3'>
          <img
            src={application.avatar || '/assets/placeholder.svg'}
            alt={application.name}
            className='w-12 h-12 rounded-full object-cover border-2 border-gray-200'
          />
          <div>
            <h4 className='text-lg font-semibold text-gray-900'>
              {application.name}
            </h4>
            <p className='text-sm text-gray-500'>
              Applied on{' '}
              {new Date(
                application.timestamp || Date.now()
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* 申请信息 */}
        <div className='space-y-3'>
          {/* Email */}
          <div>
            <div className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </div>
            <a
              href={`mailto:${application.email}`}
              className='text-purple-600 hover:text-purple-700 underline text-sm'
              onClick={e => {
                e.preventDefault();
                handleContact();
              }}
            >
              {application.email}
            </a>
          </div>

          {/* Portfolio Link */}
          {application.portfolio && (
            <div>
              <div className='block text-sm font-medium text-gray-700 mb-1'>
                Portfolio
              </div>
              <a
                href={
                  application.portfolio.startsWith('http')
                    ? application.portfolio
                    : `https://${application.portfolio}`
                }
                target='_blank'
                rel='noopener noreferrer'
                className='text-purple-600 hover:text-purple-700 underline break-all text-sm'
              >
                {application.portfolio}
              </a>
            </div>
          )}

          {/* Message */}
          {application.message && (
            <div>
              <div className='block text-sm font-medium text-gray-700 mb-1'>
                Message
              </div>
              <div className='bg-gray-50 rounded-lg p-3'>
                <p className='text-gray-900 whitespace-pre-wrap text-sm'>
                  {application.message}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 操作按钮 - 仅Initiator可见 */}
        {isInitiator && (
          <div className='flex gap-2 pt-2'>
            <SecondaryButton
              onClick={handleContact}
              className='flex-1 text-sm py-2'
            >
              Contact
            </SecondaryButton>
            <PrimaryButton
              onClick={handleApprove}
              disabled={isApproved}
              className={`flex-1 text-sm py-2 transition-all duration-300 ${
                isApproved
                  ? 'bg-green-100 text-green-800 border border-green-300 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
              title={
                isApproved
                  ? 'Already approved for this position'
                  : 'Approve this application for this position'
              }
            >
              {isApproved ? '✓ Approved' : 'Approve'}
            </PrimaryButton>
          </div>
        )}

        {/* 确认弹窗 */}
        {showConfirmModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Confirm Approval
              </h3>
              <p className='text-gray-700 mb-6'>
                Are you sure you want to approve{' '}
                <span className='font-medium'>{application.name}</span> for this
                position? This action cannot be undone.
              </p>
              <div className='flex gap-3 justify-end'>
                <SecondaryButton
                  onClick={handleCancelApprove}
                  className='px-4 py-2'
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  onClick={handleConfirmApprove}
                  className='px-4 py-2 bg-green-600 hover:bg-green-700'
                >
                  Confirm Approve
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationInfoPopover;

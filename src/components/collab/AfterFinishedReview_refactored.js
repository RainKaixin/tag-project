import React, { useState } from 'react';

import { ErrorDisplay } from '../ui';

import {
  ReviewHeader,
  ReviewButton,
  ReviewInput,
  ReviewComments,
  ConfirmationModal,
  FinalCommentModal,
} from './components';
import { useReviewState, useReviewActions } from './hooks';

/**
 * AfterFinishedReview组件 - 重构版本
 * 使用自定义hooks和组件化的UI元素
 */
const AfterFinishedReview = ({
  isLoggedIn = true,
  isProjectMember = true,
  hasCompletedTasks = false,
  requestStatus = 'none',
  hasSubmittedFinalComment = false,
  finalComments = [],
  projectId = '1',
  userId = 'current_user',
  userName = 'Current User',
  userRole = 'Member',
  projectName = 'Project Name',
  onSendRequest = () => {
    // TODO: Implement send request
  },
  onSubmitComment = () => {
    // TODO: Implement submit comment
  },
}) => {
  // 使用自定义hooks管理状态
  const { state, setters } = useReviewState({
    projectId,
    userId,
    isLoggedIn,
    isProjectMember,
    hasCompletedTasks,
    initialRequestStatus: requestStatus,
    initialFinalComments: finalComments,
    initialHasSubmitted: hasSubmittedFinalComment,
  });

  // 使用自定义hooks管理操作
  const actions = useReviewActions({
    state,
    setters,
    projectId,
    userId,
    userName,
    userRole,
    projectName,
    onSendRequest,
    onSubmitComment,
  });

  // 本地状态管理
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showFinalCommentModal, setShowFinalCommentModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // 处理按钮点击
  const handleButtonClick = () => {
    if (!isLoggedIn) {
      console.log('Sign in to request review');
      return;
    }

    if (!isProjectMember || !hasCompletedTasks) {
      return;
    }

    // 如果已经提交了最终评论，不允许再次操作
    if (state.hasSubmittedLocal) {
      return;
    }

    if (state.localRequestStatus === 'none') {
      setShowConfirmationModal(true);
    }

    if (state.localRequestStatus === 'approved' && !state.hasSubmittedLocal) {
      setShowFinalCommentModal(true);
    }
  };

  // 处理确认弹窗确认
  const handleConfirmationConfirm = async () => {
    try {
      await actions.handleSendRequest();
      // 发送请求成功后关闭弹窗
      setShowConfirmationModal(false);
    } catch (error) {
      // 如果发送失败，保持弹窗打开，错误会通过state.error显示
      console.error('Failed to send request:', error);
    }
  };

  // 处理最终评论确认
  const handleFinalCommentConfirm = async () => {
    try {
      await actions.handleSubmitFinalComment();
      // 提交成功后关闭弹窗
      setShowFinalCommentModal(false);
    } catch (error) {
      // 如果提交失败，保持弹窗打开，错误会通过state.error显示
      console.error('Failed to submit final comment:', error);
    }
  };

  // 渲染按钮
  const renderButton = () => {
    if (!isLoggedIn) {
      return (
        <ReviewButton
          state='none'
          onClick={() => {}}
          ariaLabel='Sign in to request review'
        >
          Sign in to request review
        </ReviewButton>
      );
    }

    if (!isProjectMember || !hasCompletedTasks) {
      return (
        <div className='relative'>
          <ReviewButton
            state='disabled'
            disabled={true}
            ariaLabel='Send a Request (disabled)'
            title='Only completed project members can request to comment.'
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            Send a Request
          </ReviewButton>
          {showTooltip && (
            <div className='absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-10'>
              Only completed project members can request to comment.
              <div className='absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900'></div>
            </div>
          )}
        </div>
      );
    }

    // 确定按钮状态
    let buttonState = state.localRequestStatus;

    // 如果已经提交了最终评论，显示为submitted状态
    if (state.hasSubmittedLocal) {
      buttonState = 'submitted';
    }

    return (
      <ReviewButton
        state={buttonState}
        onClick={handleButtonClick}
        disabled={state.isLoading}
      />
    );
  };

  return (
    <div className='mt-6'>
      {/* 标题和说明 */}
      <ReviewHeader />

      {/* 错误提示 */}
      <ErrorDisplay error={state.error} />

      {/* 按钮区域 */}
      <div className='flex justify-start items-center space-x-3'>
        {renderButton()}

        {/* 手动刷新状态按钮（仅在pending状态时显示） */}
        {state.localRequestStatus === 'pending' && (
          <button
            onClick={actions.handleRefreshStatus}
            className='px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200'
            title='Check for status updates'
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
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
          </button>
        )}

        {/* 开发辅助按钮 */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={actions.handleResetRequests}
            className='px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200'
            title='Cancel all review requests (dev only)'
          >
            Cancel Requests
          </button>
        )}
      </div>

      {/* 评论输入区域 */}
      <ReviewInput
        isLoggedIn={isLoggedIn}
        isProjectMember={isProjectMember}
        hasCompletedTasks={hasCompletedTasks}
        requestStatus={state.localRequestStatus}
        hasSubmitted={state.hasSubmittedLocal}
        commentText={state.commentText}
        onCommentChange={actions.handleCommentTextChange}
      />

      {/* 评论列表 */}
      <ReviewComments comments={state.localFinalComments} />

      {/* 确认弹窗 */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmationConfirm}
      />

      {/* 最终评论确认弹窗 */}
      <FinalCommentModal
        isOpen={showFinalCommentModal}
        onClose={() => setShowFinalCommentModal(false)}
        onConfirm={handleFinalCommentConfirm}
        commentText={state.commentText}
        isLoading={state.isLoading}
      />
    </div>
  );
};

export default AfterFinishedReview;

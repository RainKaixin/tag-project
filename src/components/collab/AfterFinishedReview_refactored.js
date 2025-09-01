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
  projectData = null, // 添加项目数据参数
  onSendRequest = () => {
    // TODO: Implement send request
  },
  onSubmitComment = () => {
    // TODO: Implement submit comment
  },
  selectedCollaborator = null,
  onCollaboratorReviewSubmit = () => {
    // TODO: Implement collaborator review submit
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
    projectData, // 传递项目数据
    onSendRequest,
    onSubmitComment,
  });

  // 本地状态管理
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showFinalCommentModal, setShowFinalCommentModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

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
      {selectedCollaborator ? (
        // 针对特定合作者的评价界面
        <div>
          {/* 标题和说明 */}
          <div className='mb-4'>
            <div className='flex items-center gap-2 mb-2'>
              <h3 className='text-lg font-semibold text-gray-900'>
                After-Finished Review - {selectedCollaborator.name}
              </h3>

              {/* 帮助图标 */}
              <button
                onClick={() => setShowHelpModal(true)}
                className='text-purple-500 hover:text-purple-700 transition-colors duration-200'
                title='Learn more about After-Finished Review'
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
                    d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </button>
            </div>
            <p className='text-sm text-gray-600 mt-1'>
              Final, qualitative comments after project completion only.
            </p>
          </div>

          {/* 选中的合作者信息 */}
          <div className='flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg'>
            <img
              src={selectedCollaborator.avatar}
              alt={selectedCollaborator.name}
              className='w-10 h-10 rounded-full object-cover'
            />
            <div>
              <div className='font-medium text-gray-900'>
                {selectedCollaborator.name}
              </div>
              <div className='text-sm text-gray-600'>
                {selectedCollaborator.role}
              </div>
            </div>
          </div>

          {/* 错误提示 */}
          <ErrorDisplay error={state.error} />

          {/* 按钮区域 - 与原有功能完全一致 */}
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

          {/* 评论输入区域 - 与原有功能完全一致 */}
          <ReviewInput
            isLoggedIn={isLoggedIn}
            isProjectMember={isProjectMember}
            hasCompletedTasks={hasCompletedTasks}
            requestStatus={state.localRequestStatus}
            hasSubmitted={state.hasSubmittedLocal}
            commentText={state.commentText}
            onCommentChange={actions.handleCommentTextChange}
          />

          {/* 评论列表 - 与原有功能完全一致 */}
          <ReviewComments comments={state.localFinalComments} />

          {/* 确认弹窗 - 与原有功能完全一致 */}
          <ConfirmationModal
            isOpen={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
            onConfirm={handleConfirmationConfirm}
          />

          {/* 最终评论确认弹窗 - 与原有功能完全一致 */}
          <FinalCommentModal
            isOpen={showFinalCommentModal}
            onClose={() => setShowFinalCommentModal(false)}
            onConfirm={handleFinalCommentConfirm}
            commentText={state.commentText}
            isLoading={state.isLoading}
          />

          {/* 帮助弹窗 */}
          {showHelpModal && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
              <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4'>
                {/* 弹窗标题 */}
                <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                  <h3 className='text-xl font-bold text-gray-900'>
                    After-Finished Review Guide
                  </h3>
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className='text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1'
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

                {/* 弹窗内容 */}
                <div className='p-6 space-y-6'>
                  {/* 第一部分 */}
                  <div className='flex items-start gap-4'>
                    <div className='flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'>
                      <span className='text-purple-600 font-semibold text-sm'>
                        1
                      </span>
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-bold text-gray-900 mb-2 text-lg'>
                        Done with your part? 🎉
                      </h4>
                      <p className='text-gray-600 mb-3 leading-relaxed'>
                        Send a request to confirm completion:
                      </p>
                      <ul className='text-gray-600 space-y-2 ml-4'>
                        <li className='flex items-start gap-2'>
                          <span className='text-purple-500 mt-1'>•</span>
                          <span>
                            Collaborators send a request to the Initiator.
                          </span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-purple-500 mt-1'>•</span>
                          <span>
                            Initiators send a request to collaborators.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* 第二部分 */}
                  <div className='flex items-start gap-4'>
                    <div className='flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'>
                      <span className='text-purple-600 font-semibold text-sm'>
                        2
                      </span>
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-bold text-gray-900 mb-2 text-lg'>
                        Reviews are a mutual exchange
                      </h4>
                      <p className='text-gray-600 leading-relaxed'>
                        They unlock only once both sides agree the work is
                        complete. After approval, you'll be able to leave a
                        After-Finished Review (final review) of the project and
                        its lead — your feedback will remain as a part of the
                        Collaboration History.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 关闭按钮 */}
                <div className='flex justify-end p-6 border-t border-gray-200'>
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className='px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 text-base'
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // 原有的通用评价界面
        <div>
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
      )}
    </div>
  );
};

export default AfterFinishedReview;

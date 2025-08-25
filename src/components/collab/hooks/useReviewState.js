import { useState, useEffect } from 'react';

import { getReviewState } from '../../../services';

/**
 * useReviewState Hook - 管理review相关的状态
 * @param {Object} params - 参数对象
 * @param {string} params.projectId - 项目ID
 * @param {string} params.userId - 用户ID
 * @param {boolean} params.isLoggedIn - 是否已登录
 * @param {boolean} params.isProjectMember - 是否是项目成员
 * @param {boolean} params.hasCompletedTasks - 是否完成任务
 * @param {string} params.initialRequestStatus - 初始请求状态
 * @param {Array} params.initialFinalComments - 初始最终评论
 * @param {boolean} params.initialHasSubmitted - 初始是否已提交
 * @returns {Object} 状态和设置函数
 */
const useReviewState = ({
  projectId,
  userId,
  isLoggedIn = true,
  isProjectMember = true,
  hasCompletedTasks = false,
  initialRequestStatus = 'none',
  initialFinalComments = [],
  initialHasSubmitted = false,
}) => {
  // 基础状态
  const [localRequestStatus, setLocalRequestStatus] =
    useState(initialRequestStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localFinalComments, setLocalFinalComments] =
    useState(initialFinalComments);
  const [hasSubmittedLocal, setHasSubmittedLocal] =
    useState(initialHasSubmitted);
  const [commentText, setCommentText] = useState('');

  // 同步props中的requestStatus变化
  useEffect(() => {
    setLocalRequestStatus(initialRequestStatus);
  }, [initialRequestStatus]);

  // 加载review状态
  useEffect(() => {
    const loadReviewState = async () => {
      try {
        // 先尝试加载协作请求状态
        const { getCollaborationRequestStatus } = await import(
          '../../../services'
        );
        const collaborationStatus = await getCollaborationRequestStatus(
          projectId,
          userId
        );

        if (collaborationStatus !== 'none') {
          setLocalRequestStatus(collaborationStatus);

          return;
        }

        // 如果没有协作请求，则加载review状态
        const state = await getReviewState(projectId, userId);
        setLocalRequestStatus(state);
      } catch (error) {
        console.error('Error loading request state:', error);
        setError('Failed to load review state');
      }
    };

    if (isLoggedIn && isProjectMember && hasCompletedTasks) {
      loadReviewState();
    }
  }, [projectId, userId, isLoggedIn, isProjectMember, hasCompletedTasks]);

  // 监听review状态变化事件
  useEffect(() => {
    const handleReviewStatusChange = event => {
      const { projectId: eventProjectId, requesterId, status } = event.detail;
      if (eventProjectId === projectId && requesterId === userId) {
        setLocalRequestStatus(status);
        // 如果状态变为approved，清除错误信息
        if (status === 'approved') {
          setError(null);
        }
      }
    };

    // 监听review状态变化事件
    window.addEventListener(
      'review:requestStatusChanged',
      handleReviewStatusChange
    );

    return () => {
      window.removeEventListener(
        'review:requestStatusChanged',
        handleReviewStatusChange
      );
    };
  }, [projectId, userId]);

  // 监听协作请求状态变化
  useEffect(() => {
    const handleCollaborationStatusChange = event => {
      const { requestId, status, request } = event.detail;
      if (request.requesterId === userId && request.projectId === projectId) {
        setLocalRequestStatus(status);
        // 如果状态变为approved，清除错误信息
        if (status === 'approved') {
          setError(null);
        }
      }
    };

    // 监听协作请求状态变化事件
    window.addEventListener(
      'collaboration:requestStatusChanged',
      handleCollaborationStatusChange
    );

    return () => {
      window.removeEventListener(
        'collaboration:requestStatusChanged',
        handleCollaborationStatusChange
      );
    };
  }, [projectId, userId]);

  // 当状态变为approved时清除错误信息
  useEffect(() => {
    if (localRequestStatus === 'approved') {
      setError(null);
    }
  }, [localRequestStatus]);

  // 加载最终评论
  useEffect(() => {
    // 实现最终评论加载逻辑
    setLocalFinalComments([]);
  }, [projectId]);

  // 设置函数
  const setters = {
    setLocalRequestStatus,
    setIsLoading,
    setError,
    setLocalFinalComments,
    setHasSubmittedLocal,
    setCommentText,
  };

  // 状态对象
  const state = {
    localRequestStatus,
    isLoading,
    error,
    localFinalComments,
    hasSubmittedLocal,
    commentText,
  };

  return { state, setters };
};

export default useReviewState;

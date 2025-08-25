import { useCallback } from 'react';

import {
  createCollaborationRequest,
  createCollaborationRequestNotification,
  submitFinalComment,
  getReviewState,
} from '../../../services';
import { getCurrentUser } from '../../../utils/currentUser';

/**
 * useReviewActions Hook - 处理用户操作和业务逻辑
 * @param {Object} params - 参数对象
 * @param {Object} params.state - 状态对象
 * @param {Object} params.setters - 设置函数对象
 * @param {string} params.projectId - 项目ID
 * @param {string} params.userId - 用户ID
 * @param {string} params.userName - 用户名
 * @param {string} params.projectName - 项目名称
 * @param {Function} params.onSendRequest - 发送请求回调
 * @param {Function} params.onSubmitComment - 提交评论回调
 * @returns {Object} 操作函数
 */
const useReviewActions = ({
  state,
  setters,
  projectId,
  userId,
  userName,
  userRole,
  projectName,
  onSendRequest = () => {
    // TODO: Implement send request
  },
  onSubmitComment = () => {
    // TODO: Implement submit comment
  },
}) => {
  const {
    setLocalRequestStatus,
    setIsLoading,
    setError,
    setHasSubmittedLocal,
    setCommentText,
  } = setters;
  const { commentText } = state;

  // 处理发送请求
  const handleSendRequest = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const currentUser = getCurrentUser();

      // 创建协作请求
      const collaborationRequest = await createCollaborationRequest({
        projectId,
        projectName,
        requesterId: userId,
        requesterName: userName,
        requesterAvatar: currentUser?.avatar || '',
        ownerId: 'alice',
        ownerName: 'Alice Chen',
        message: 'I would like to join this collaboration project.',
      });

      // 为项目所有者创建通知
      await createCollaborationRequestNotification({
        userId: 'alice',
        projectId,
        projectName,
        requestId: collaborationRequest.id,
        requesterId: userId,
        requesterName: userName,
        requesterAvatar: currentUser?.avatar || '',
      });

      // 更新本地状态
      setLocalRequestStatus('pending');
      onSendRequest();
      return collaborationRequest; // 返回成功结果
    } catch (error) {
      setError(error.message);
      console.error('Error sending collaboration request:', error);
      throw error; // 重新抛出错误，让调用者知道失败
    } finally {
      setIsLoading(false);
    }
  }, [
    projectId,
    userId,
    userName,
    projectName,
    onSendRequest,
    setLocalRequestStatus,
    setIsLoading,
    setError,
  ]);

  // 处理提交最终评论
  const handleSubmitFinalComment = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const comment = await submitFinalComment(
        projectId,
        userId,
        commentText,
        'positive',
        'alice',
        projectName,
        userName,
        userRole
      );
      if (comment) {
        setHasSubmittedLocal(true);
        setCommentText('');
        onSubmitComment(commentText);
        return comment; // 返回成功结果
      }
      throw new Error('Failed to create comment');
    } catch (error) {
      setError(error.message);
      console.error('Error submitting final comment:', error);
      throw error; // 重新抛出错误，让调用者知道失败
    } finally {
      setIsLoading(false);
    }
  }, [
    projectId,
    userId,
    commentText,
    onSubmitComment,
    setHasSubmittedLocal,
    setCommentText,
    setIsLoading,
    setError,
    projectName,
    userName,
    userRole,
  ]);

  // 手动刷新状态
  const handleRefreshStatus = useCallback(async () => {
    try {
      const state = await getReviewState(projectId, userId);
      setLocalRequestStatus(state);
    } catch (error) {
      console.error('Error refreshing review status:', error);
      setError('Failed to refresh status');
    }
  }, [projectId, userId, setLocalRequestStatus, setError]);

  // 重置所有请求
  const handleResetRequests = useCallback(async () => {
    try {
      const { resetReviewRequests } = await import('../../../services');
      await resetReviewRequests();
      setLocalRequestStatus('none');
    } catch (error) {
      console.error('Error resetting review requests:', error);
      setError('Failed to reset requests');
    }
  }, [setLocalRequestStatus, setError]);

  // 处理评论文本变化
  const handleCommentTextChange = useCallback(
    text => {
      setCommentText(text);
    },
    [setCommentText]
  );

  // 清除错误
  const handleClearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    handleSendRequest,
    handleSubmitFinalComment,
    handleRefreshStatus,
    handleResetRequests,
    handleCommentTextChange,
    handleClearError,
  };
};

export default useReviewActions;

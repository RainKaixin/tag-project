// use-work-detail-actions v1: 作品详情页操作管理Hook

import { useCallback, useState } from 'react';

import { useAuth } from '../../../context/AuthContext';
import {
  favoritesService,
  commentService,
  notificationService,
} from '../../../services';
import { useNavigation } from '../../../utils/navigation';
import { getArtistById } from '../../artist-profile/utils/artistHelpers';
import { LoginModal } from '../../ui/LoginModal';

/**
 * 作品详情页操作管理Hook
 * @param {Object} state - 状态对象
 * @param {Object} setters - 设置函数对象
 * @returns {Object} 操作函数
 */
const useWorkDetailActions = ({ state, setters }) => {
  const { goBack, navigateToArtist, navigateToWork } = useNavigation();
  const { user: currentUser } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingSaveAction, setPendingSaveAction] = useState(null);

  // 处理返回按钮点击
  const handleBackClick = useCallback(() => {
    goBack();
  }, [goBack]);

  // 处理点赞按钮点击
  const handleLikeClick = useCallback(() => {
    setters.toggleLike();
  }, [setters]);

  // 处理收藏按钮点击
  const handleSaveClick = useCallback(
    async (itemType, itemId, shouldFavorite) => {
      console.log('[Favorites] Save toggle payload:', {
        itemType,
        itemId,
        shouldFavorite,
      });

      try {
        const result = await favoritesService.toggleFavorite(
          itemType,
          itemId,
          shouldFavorite
        );
        console.log('[Favorites] Save toggle result:', result);

        // 檢查是否需要認證
        if (result.needAuth) {
          console.log(
            '[Favorites] Authentication required, showing login modal'
          );
          // 保存待執行的操作
          setPendingSaveAction({ itemType, itemId, shouldFavorite });
          // 顯示登錄 Modal
          setIsLoginModalOpen(true);
          return;
        }

        if (result.success) {
          // 更新本地状态
          setters.toggleSave();
          console.log('[Favorites] Save toggle successful');
        } else {
          console.error('[Favorites] Save toggle failed:', result.error);
          // 可以在这里添加Toast错误提示
        }

        // 触发全局收藏状态刷新（如果有全局状态管理）
        // 这里可以添加事件触发或其他状态更新机制
      } catch (error) {
        console.error('[Favorites] Failed to toggle favorite:', error);
        // 可以在这里添加Toast错误提示
      }
    },
    [setters]
  );

  // 處理登錄成功後的重試
  const handleLoginSuccess = useCallback(async () => {
    if (pendingSaveAction) {
      console.log('[Favorites] Retrying save action after login');
      // 重試保存操作
      await handleSaveClick(
        pendingSaveAction.itemType,
        pendingSaveAction.itemId,
        pendingSaveAction.shouldFavorite
      );
      // 清除待執行的操作
      setPendingSaveAction(null);
    }
  }, [pendingSaveAction, handleSaveClick]);

  // 處理登錄 Modal 關閉
  const handleLoginModalClose = useCallback(() => {
    setIsLoginModalOpen(false);
    setPendingSaveAction(null);
  }, []);

  // 处理评论提交
  const handleCommentSubmit = useCallback(async () => {
    if (!state.comment.trim()) {
      console.warn('[WorkDetail] Comment is empty');
      return;
    }

    if (!currentUser) {
      console.warn('[WorkDetail] No current user found');
      return;
    }

    try {
      // 获取用户的真实profile数据
      const authorProfile = await getArtistById(currentUser.id);
      const authorName = authorProfile?.name || currentUser.name;

      const result = await commentService.createComment(
        state.workData.id,
        currentUser.id,
        authorName, // 使用profile中的真实姓名
        state.comment.trim(),
        state.replyTo // 传递父评论ID（如果是回复）
      );

      if (result.success) {
        console.log('[WorkDetail] Comment created successfully:', result.data);

        // 创建评论通知（只有当评论者不是作品作者时）
        if (currentUser.id !== state.workData.author.id) {
          try {
            await notificationService.createCommentNotification(
              currentUser.id,
              authorName,
              state.workData.id,
              state.workData.title,
              state.workData.author.id,
              state.comment.trim()
            );
            console.log(
              '[WorkDetail] Comment notification created successfully'
            );
          } catch (notificationError) {
            console.warn(
              '[WorkDetail] Failed to create comment notification:',
              notificationError
            );
            // 通知创建失败不影响评论功能
          }
        }

        // 清空评论输入
        setters.setComment('');
        // 取消回复模式
        setters.setReplyTo(null);
        // 重新加载评论列表
        setters.loadComments();
      } else {
        console.error('[WorkDetail] Failed to create comment:', result.error);
      }
    } catch (error) {
      console.error('[WorkDetail] Error creating comment:', error);
    }
  }, [
    setters,
    state.comment,
    state.workData?.id,
    state.replyTo,
    state.workData?.author?.id,
    state.workData?.title,
  ]);

  // 处理回复提交
  const handleSubmitReply = useCallback(
    async parentId => {
      const text = (state.replyDrafts[parentId] || '').trim();
      if (!text) return;

      if (!currentUser) {
        console.warn('[WorkDetail] No current user found for reply');
        return;
      }

      const parent = state.comments.find(c => c.id === parentId);
      if (!parent) {
        console.warn('[WorkDetail] Parent comment not found');
        return;
      }

      // 获取用户的真实profile数据
      const authorProfile = await getArtistById(currentUser.id);
      const authorName = authorProfile?.name || currentUser.name;

      const tempId = `tmp_${Date.now()}`;

      // 1) 乐观插入
      const optimistic = {
        id: tempId,
        workId: parent.workId,
        authorId: currentUser.id,
        authorName: authorName,
        text: text,
        parentId: parent.id,
        rootId: parent.rootId || parent.id,
        likes: 0,
        replies: [],
        isDeleted: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setters.addCommentOptimistic(optimistic);

      try {
        // 2) 调服务
        const result = await commentService.createComment(
          parent.workId,
          currentUser.id,
          authorName,
          text,
          parent.id
        );

        if (result.success) {
          // 3) 用真实数据替换临时数据
          setters.replaceTempComment({ tempId, saved: result.data });
          setters.setReplyDraft(parentId, '');
          setters.cancelReply();
          console.log('[WorkDetail] Reply submitted successfully');
        } else {
          // 4) 失败回滚
          setters.removeTempComment(tempId);
          console.error('[WorkDetail] Failed to submit reply:', result.error);
          // 这里可以添加Toast错误提示
        }
      } catch (error) {
        // 4) 失败回滚
        setters.removeTempComment(tempId);
        console.error('[WorkDetail] Error submitting reply:', error);
        // 这里可以添加Toast错误提示
      }
    },
    [setters, state.replyDrafts, state.comments]
  );

  // 处理开始回复
  const handleStartReply = useCallback(
    parent => {
      setters.startReply(parent);
    },
    [setters]
  );

  // 处理取消回复
  const handleCancelReply = useCallback(() => {
    setters.cancelReply();
  }, [setters]);

  // 处理设置回复草稿
  const handleSetReplyDraft = useCallback(
    (parentId, text) => {
      setters.setReplyDraft(parentId, text);
    },
    [setters]
  );

  // 处理评论输入变化
  const handleCommentChange = useCallback(
    e => {
      setters.setComment(e.target.value);
    },
    [setters]
  );

  // 处理作者点击
  const handleAuthorClick = useCallback(() => {
    // 使用作品的作者ID进行导航
    const authorId = state.workData?.author?.id;
    if (authorId) {
      console.log(`[WorkDetail] Navigating to artist: ${authorId}`);
      navigateToArtist(authorId, 'gallery', 'Works');
    } else {
      console.warn('[WorkDetail] No author ID found for navigation');
    }
  }, [navigateToArtist, state.workData?.author?.id]);

  // 处理评论用户点击
  const handleCommentUserClick = useCallback(
    userId => {
      navigateToArtist(userId);
    },
    [navigateToArtist]
  );

  // 处理相关作品点击
  const handleRelatedWorkClick = useCallback(
    workId => {
      if (workId) {
        console.log('[WorkDetail] Navigating to related work:', workId);
        navigateToWork(workId);
      }
    },
    [navigateToWork]
  );

  // 处理图片导航
  const handleImageNavigation = useCallback(direction => {
    // 这里可以添加图片导航逻辑
    console.log('Image navigation:', direction);
  }, []);

  // 处理评论点赞
  const handleCommentLike = useCallback(
    async commentId => {
      if (!currentUser) {
        console.warn('[WorkDetail] No current user found for comment like');
        return;
      }

      try {
        const result = await commentService.likeComment(
          commentId,
          currentUser.id
        );
        if (result.success) {
          console.log('[WorkDetail] Comment like toggled:', result.data);
          // 重新加载评论列表以更新点赞状态
          setters.loadComments();
        } else {
          console.error('[WorkDetail] Failed to like comment:', result.error);
        }
      } catch (error) {
        console.error('[WorkDetail] Error liking comment:', error);
      }
    },
    [setters]
  );

  // 处理评论回复
  const handleCommentReply = useCallback(
    commentId => {
      // 设置回复模式，在评论输入框中显示回复提示
      setters.setReplyTo(commentId);
      // 这里可以添加更多回复逻辑，比如自动聚焦到评论输入框
      console.log('[WorkDetail] Reply to comment:', commentId);
    },
    [setters]
  );

  // 处理评论删除
  const handleCommentDelete = useCallback(
    async commentId => {
      if (!currentUser) {
        console.warn('[WorkDetail] No current user found for comment delete');
        return;
      }

      try {
        const result = await commentService.deleteComment(
          commentId,
          currentUser.id
        );
        if (result.success) {
          console.log('[WorkDetail] Comment deleted successfully');
          // 重新加载评论列表
          setters.loadComments();
        } else {
          console.error('[WorkDetail] Failed to delete comment:', result.error);
        }
      } catch (error) {
        console.error('[WorkDetail] Error deleting comment:', error);
      }
    },
    [setters]
  );

  return {
    // 导航操作
    handleBackClick,
    handleAuthorClick,
    handleCommentUserClick,
    handleRelatedWorkClick,

    // 交互操作
    handleLikeClick,
    handleSaveClick,
    handleCommentSubmit,
    handleCommentChange,
    handleCommentLike,
    handleCommentReply,
    handleCommentDelete,
    handleCancelReply,
    handleImageNavigation,

    // 回复相关操作
    handleStartReply,
    handleSubmitReply,
    handleSetReplyDraft,

    // 登錄 Modal 相關
    isLoginModalOpen,
    handleLoginModalClose,
    handleLoginSuccess,
    LoginModalComponent: () => (
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onLoginSuccess={handleLoginSuccess}
      />
    ),
  };
};

export default useWorkDetailActions;

// comment-item v1: 评论项组件

import { useState, useEffect, useMemo } from 'react';

import { useAuth } from '../../../context/AuthContext';
import { getArtistById } from '../../artist-profile/utils/artistHelpers';

import CommentReplyForm from './CommentReplyForm';

/**
 * 回复项组件
 */
const ReplyItem = ({
  reply,
  currentUser,
  onUserClick,
  onLikeClick,
  onDeleteClick,
  formatTime,
}) => {
  const { user: authUser } = useAuth();
  const [replyAuthorInfo, setReplyAuthorInfo] = useState(null);
  const [isLoadingReply, setIsLoadingReply] = useState(true);

  // 获取回复作者的真实信息
  useEffect(() => {
    const fetchReplyAuthorInfo = async () => {
      if (reply.authorId) {
        try {
          setIsLoadingReply(true);
          const author = await getArtistById(reply.authorId);
          setReplyAuthorInfo(author);
        } catch (error) {
          console.warn(
            `[ReplyItem] Failed to get reply author info for ${reply.authorId}:`,
            error
          );
          setReplyAuthorInfo(null);
        } finally {
          setIsLoadingReply(false);
        }
      } else {
        setIsLoadingReply(false);
      }
    };

    fetchReplyAuthorInfo();
  }, [reply.authorId]);

  // 获取回复作者的头像
  const getReplyAuthorAvatar = () => {
    if (isLoadingReply) {
      return replyAuthorInfo?.avatar || '/default-avatar.png'; // 加载时显示默认头像
    }

    if (replyAuthorInfo?.avatar) {
      return replyAuthorInfo.avatar;
    }

    return '/default-avatar.png'; // 回退到默认头像
  };

  return (
    <div className='flex space-x-3'>
      <img
        src={getReplyAuthorAvatar()}
        alt={reply.authorName || 'Reply author'}
        className='w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity duration-200'
        onClick={() => onUserClick(reply.authorId)}
      />
      <div className='flex-1'>
        <div className='bg-gray-50 rounded-lg p-3'>
          <div className='flex items-center justify-between mb-1'>
            <span
              className='font-medium text-gray-900 cursor-pointer hover:text-tag-blue transition-colors duration-200'
              onClick={() => onUserClick(reply.authorId)}
            >
              {reply.authorName}
            </span>
            <span className='text-sm text-gray-500'>
              {formatTime(reply.createdAt)}
            </span>
          </div>
          <p className='text-gray-700'>{reply.text || reply.content}</p>
        </div>
        <div className='flex items-center space-x-4 mt-2 text-sm'>
          <button
            onClick={() => onLikeClick(reply.id)}
            className={`flex items-center gap-1 ${
              reply.likedBy?.includes(currentUser?.id)
                ? 'text-red-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg
              className='w-4 h-4'
              fill={
                reply.likedBy?.includes(currentUser?.id)
                  ? 'currentColor'
                  : 'none'
              }
              stroke='currentColor'
              viewBox='0 0 24 24'
              strokeWidth='2'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
              />
            </svg>
            <span>{reply.likes || 0}</span>
          </button>
          {currentUser && reply.authorId === currentUser.id && (
            <button
              onClick={() => onDeleteClick(reply.id)}
              className='text-red-500 hover:text-red-700'
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 评论项组件
 * @param {Object} comment - 评论数据
 * @param {Array} comments - 所有评论数组（用于查找子回复）
 * @param {Function} onUserClick - 用户点击事件
 * @param {Function} onLikeClick - 点赞点击事件
 * @param {Function} onReplyClick - 回复点击事件
 * @param {Function} onDeleteClick - 删除点击事件
 * @param {Object} replyingTo - 当前回复状态
 * @param {Object} replyDrafts - 回复草稿
 * @param {Function} onStartReply - 开始回复事件
 * @param {Function} onCancelReply - 取消回复事件
 * @param {Function} onSetReplyDraft - 设置回复草稿事件
 * @param {Function} onSubmitReply - 提交回复事件
 * @param {string} className - 额外的CSS类名
 */
const CommentItem = ({
  comment,
  comments,
  onUserClick,
  onLikeClick,
  onReplyClick,
  onDeleteClick,
  replyingTo,
  replyDrafts,
  onStartReply,
  onCancelReply,
  onSetReplyDraft,
  onSubmitReply,
  className = '',
}) => {
  const { user: currentUser } = useAuth();
  const isOwnComment = currentUser && comment.authorId === currentUser.id;
  const isReplyingToThis = replyingTo?.parentId === comment.id;

  // 获取当前评论的子回复
  const replies = useMemo(
    () =>
      comments
        .filter(r => String(r.parentId) === String(comment.id))
        .sort((a, b) => a.createdAt - b.createdAt),
    [comments, comment.id]
  );

  // 状态存储作者信息
  const [authorInfo, setAuthorInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 获取评论作者的真实信息
  useEffect(() => {
    const fetchAuthorInfo = async () => {
      if (comment.authorId) {
        try {
          setIsLoading(true);
          const author = await getArtistById(comment.authorId);
          setAuthorInfo(author);
        } catch (error) {
          console.warn(
            `[CommentItem] Failed to get author info for ${comment.authorId}:`,
            error
          );
          setAuthorInfo(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchAuthorInfo();
  }, [comment.authorId]);

  // 获取评论作者的头像
  const getAuthorAvatar = () => {
    if (isLoading) {
      return authorInfo?.avatar || '/default-avatar.png'; // 加载时显示默认头像
    }

    if (authorInfo?.avatar) {
      return authorInfo.avatar;
    }

    return '/default-avatar.png'; // 回退到默认头像
  };

  // 获取评论作者的显示名称
  const getAuthorDisplayName = () => {
    if (isLoading) {
      return comment.authorName || 'Loading...';
    }

    if (authorInfo?.name) {
      return authorInfo.name;
    }

    return comment.authorName || 'Unknown User';
  };

  // 格式化时间
  const formatTime = timestamp => {
    // 兼容旧数据：如果是字符串时间戳，转换为数字
    const time =
      typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
    const date = new Date(time);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // 获取评论内容（兼容旧数据）
  const getCommentContent = () => {
    return comment.text || comment.content || '';
  };

  return (
    <div className={`flex space-x-3 ${className}`}>
      <img
        src={getAuthorAvatar()}
        alt={getAuthorDisplayName()}
        className='w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity duration-200'
        onClick={() => onUserClick(comment.authorId)}
      />
      <div className='flex-1'>
        <div className='bg-gray-50 rounded-lg p-3'>
          <div className='flex items-center justify-between mb-1'>
            <span
              className='font-medium text-gray-900 cursor-pointer hover:text-tag-blue transition-colors duration-200'
              onClick={() => onUserClick(comment.authorId)}
            >
              {getAuthorDisplayName()}
            </span>
            <span className='text-sm text-gray-500'>
              {formatTime(comment.createdAt)}
            </span>
          </div>
          <p className='text-gray-700'>{getCommentContent()}</p>
        </div>
        <div className='flex items-center space-x-4 mt-2 text-sm'>
          <button
            onClick={() => onLikeClick(comment.id)}
            className={`flex items-center gap-1 ${
              comment.likedBy?.includes(currentUser?.id)
                ? 'text-red-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg
              className='w-4 h-4'
              fill={
                comment.likedBy?.includes(currentUser?.id)
                  ? 'currentColor'
                  : 'none'
              }
              stroke='currentColor'
              viewBox='0 0 24 24'
              strokeWidth='2'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
              />
            </svg>
            <span>{comment.likes || 0}</span>
          </button>
          {/* 只在非本人评论上显示 Reply */}
          {!isOwnComment && (
            <button
              onClick={() => onStartReply(comment)}
              className='text-gray-500 hover:text-gray-700'
            >
              Reply
            </button>
          )}
          {isOwnComment && (
            <button
              onClick={() => onDeleteClick(comment.id)}
              className='text-red-500 hover:text-red-700'
            >
              Delete
            </button>
          )}
        </div>

        {/* 内联回复输入框（只在当前父评论下显示） */}
        {isReplyingToThis && (
          <CommentReplyForm
            parentId={comment.id}
            parentAuthorName={getAuthorDisplayName()}
            draft={replyDrafts?.[comment.id] || ''}
            onChange={onSetReplyDraft}
            onSubmit={onSubmitReply}
            onCancel={onCancelReply}
          />
        )}

        {/* 子回复列表 */}
        {replies.length > 0 && (
          <div className='mt-3 border-l-2 border-gray-200 pl-4 space-y-3'>
            {replies.map(reply => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                currentUser={currentUser}
                onUserClick={onUserClick}
                onLikeClick={onLikeClick}
                onDeleteClick={onDeleteClick}
                formatTime={formatTime}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;

// comments-section v1: 评论区域组件

import React, { useMemo } from 'react';

import CommentInput from './CommentInput';
import CommentItem from './CommentItem';

/**
 * 评论区域组件
 * @param {Array} comments - 评论数据数组
 * @param {string} comment - 当前评论输入内容
 * @param {Function} onCommentChange - 评论内容变化事件
 * @param {Function} onCommentSubmit - 评论提交事件
 * @param {Function} onCommentUserClick - 评论用户点击事件
 * @param {Function} onCommentLike - 评论点赞事件
 * @param {Function} onCommentReply - 评论回复事件
 * @param {Function} onCommentDelete - 评论删除事件
 * @param {Object} replyingTo - 当前回复状态
 * @param {Object} replyDrafts - 回复草稿
 * @param {Function} onStartReply - 开始回复事件
 * @param {Function} onCancelReply - 取消回复事件
 * @param {Function} onSetReplyDraft - 设置回复草稿事件
 * @param {Function} onSubmitReply - 提交回复事件
 * @param {string} replyTo - 回复的评论ID（兼容旧版本）
 * @param {Function} onCancelReplyOld - 取消回复事件（兼容旧版本）
 * @param {string} className - 额外的CSS类名
 */
const CommentsSection = ({
  comments,
  comment,
  onCommentChange,
  onCommentSubmit,
  onCommentUserClick,
  onCommentLike,
  onCommentReply,
  onCommentDelete,
  replyingTo,
  replyDrafts,
  onStartReply,
  onCancelReply,
  onSetReplyDraft,
  onSubmitReply,
  replyTo,
  onCancelReplyOld,
  className = '',
}) => {
  // 根列表只渲染顶级评论（没有parentId的评论）
  const topLevelComments = useMemo(
    () =>
      comments
        .filter(c => !c.parentId)
        .sort((a, b) => a.createdAt - b.createdAt),
    [comments]
  );

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        Comments ({comments.length})
      </h3>

      {/* Comment Input */}
      <CommentInput
        comment={comment}
        onCommentChange={onCommentChange}
        onCommentSubmit={onCommentSubmit}
        replyTo={replyTo}
        onCancelReply={onCancelReplyOld}
      />

      {/* Comments List - 只渲染顶级评论 */}
      <div className='space-y-4'>
        {topLevelComments.map(commentItem => (
          <CommentItem
            key={commentItem.id}
            comment={commentItem}
            comments={comments} // 传递所有评论用于查找子回复
            onUserClick={onCommentUserClick}
            onLikeClick={onCommentLike}
            onReplyClick={onCommentReply}
            onDeleteClick={onCommentDelete}
            replyingTo={replyingTo}
            replyDrafts={replyDrafts}
            onStartReply={onStartReply}
            onCancelReply={onCancelReply}
            onSetReplyDraft={onSetReplyDraft}
            onSubmitReply={onSubmitReply}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;

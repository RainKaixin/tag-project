
import { getSentimentColor, formatCommentDate } from '../utils/reviewHelpers';

/**
 * ReviewComments组件 - 显示评论列表
 * @param {Object} props - 组件属性
 * @param {Array} props.comments - 评论列表
 * @param {number} props.maxDisplay - 最大显示数量
 * @param {string} props.className - 额外的CSS类名
 */
const ReviewComments = ({ comments = [], maxDisplay = 3, className = '' }) => {
  // 如果没有评论，不显示
  if (comments.length === 0) {
    return null;
  }

  return (
    <div className={`mt-6 ${className}`}>
      <h4 className='text-sm font-medium text-gray-900 mb-3'>Final Comments</h4>
      <div className='space-y-3'>
        {comments.slice(0, maxDisplay).map((comment, index) => (
          <div key={index} className='bg-gray-50 rounded-lg p-3'>
            <div className='flex items-start justify-between mb-2'>
              <div className='text-xs text-gray-500'>
                {comment.userName} · {comment.userRole} ·{' '}
                {formatCommentDate(comment.createdAt)}
              </div>
              {comment.sentiment && (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(
                    comment.sentiment
                  )}`}
                >
                  {comment.sentiment.charAt(0).toUpperCase() +
                    comment.sentiment.slice(1)}
                </span>
              )}
            </div>
            <p className='text-sm text-gray-700'>{comment.comment}</p>
          </div>
        ))}

        {/* 显示更多提示 */}
        {comments.length > maxDisplay && (
          <div className='text-center py-2'>
            <span className='text-xs text-gray-500'>
              +{comments.length - maxDisplay} more comments
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewComments;

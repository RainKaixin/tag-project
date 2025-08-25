import {
  getCommentCharCount,
  isValidCommentLength,
} from '../utils/reviewHelpers';

/**
 * ReviewInput组件 - 处理评论输入区域
 * @param {Object} props - 组件属性
 * @param {boolean} props.isLoggedIn - 是否已登录
 * @param {boolean} props.isProjectMember - 是否是项目成员
 * @param {boolean} props.hasCompletedTasks - 是否完成任务
 * @param {string} props.requestStatus - 请求状态
 * @param {boolean} props.hasSubmitted - 是否已提交
 * @param {string} props.commentText - 评论文本
 * @param {Function} props.onCommentChange - 评论变化处理函数
 * @param {string} props.className - 额外的CSS类名
 */
const ReviewInput = ({
  isLoggedIn = true,
  isProjectMember = true,
  hasCompletedTasks = false,
  requestStatus = 'none',
  hasSubmitted = false,
  commentText = '',
  onCommentChange = () => {},
  className = '',
}) => {
  // 计算字符数
  const charCount = getCommentCharCount(commentText);

  // 根据状态获取占位符文本
  const getPlaceholderText = () => {
    if (!isLoggedIn) {
      return 'Please log in to write a final comment.';
    }

    if (!isProjectMember || !hasCompletedTasks) {
      return 'You need approval from the Project Lead to write a final comment.';
    }

    if (requestStatus === 'none') {
      return 'Send a request to the Project Lead to write a final comment.';
    }

    if (requestStatus === 'pending') {
      return 'Your request is being reviewed by the Project Lead.';
    }

    if (requestStatus === 'approved' && !hasSubmitted) {
      return 'Share your final thoughts about the project collaboration...';
    }

    return 'Comment input';
  };

  // 根据状态判断是否禁用
  const isDisabled =
    !isLoggedIn ||
    !isProjectMember ||
    !hasCompletedTasks ||
    requestStatus === 'none' ||
    requestStatus === 'pending' ||
    hasSubmitted;

  // 如果已提交，显示已提交的评论
  if (hasSubmitted) {
    return (
      <div className={`mt-4 ${className}`}>
        <blockquote className='w-full p-3 bg-gray-50 border-l-4 border-purple-500 rounded-r-lg min-h-[120px]'>
          <p className='text-gray-700 italic'>&quot;{commentText}&quot;</p>
        </blockquote>
      </div>
    );
  }

  return (
    <div className={`mt-4 ${className}`}>
      <textarea
        value={commentText}
        onChange={e => onCommentChange(e.target.value)}
        placeholder={getPlaceholderText()}
        disabled={isDisabled}
        className={`w-full p-3 border rounded-lg resize-none min-h-[120px] focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
          charCount > 600 ? 'border-red-300' : 'border-gray-300'
        } ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
        aria-label='Final comment input'
        maxLength={600}
      />

      {/* 字符计数和提示 */}
      <div className='flex justify-between items-center mt-2 text-sm'>
        <span className='text-gray-500'>Share your thoughts</span>
        <span
          className={`${charCount > 600 ? 'text-red-500' : 'text-gray-500'}`}
        >
          {charCount}/600
        </span>
      </div>

      {/* 错误提示 */}
      {charCount > 600 && (
        <div className='mt-1 text-sm text-red-500' role='alert'>
          Comment exceeds maximum length
        </div>
      )}
    </div>
  );
};

export default ReviewInput;

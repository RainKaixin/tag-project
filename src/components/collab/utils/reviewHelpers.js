// review-helpers v1: 工具函数集合
// 从 AfterFinishedReview.js 中提取的通用工具函数

/**
 * 获取情绪标签的颜色样式
 * @param {string} sentiment - 情绪类型
 * @returns {string} CSS类名
 */
export const getSentimentColor = sentiment => {
  switch (sentiment) {
    case 'positive':
      return 'bg-green-100 text-green-800';
    case 'neutral':
      return 'bg-gray-100 text-gray-800';
    case 'constructive':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * 验证评论长度
 * @param {string} commentText - 评论文本
 * @param {number} maxLength - 最大长度
 * @returns {boolean} 是否有效
 */
export const isValidCommentLength = (commentText, maxLength = 600) => {
  return commentText.length <= maxLength;
};

/**
 * 格式化评论时间
 * @param {string} dateString - 日期字符串
 * @returns {string} 格式化后的日期
 */
export const formatCommentDate = dateString => {
  return new Date(dateString).toLocaleDateString();
};

/**
 * 获取评论字符数
 * @param {string} commentText - 评论文本
 * @returns {number} 字符数
 */
export const getCommentCharCount = commentText => {
  return commentText.length;
};

/**
 * 检查用户是否有权限提交评论
 * @param {boolean} isLoggedIn - 是否已登录
 * @param {boolean} isProjectMember - 是否是项目成员
 * @param {boolean} hasCompletedTasks - 是否完成任务
 * @returns {boolean} 是否有权限
 */
export const canSubmitComment = (
  isLoggedIn,
  isProjectMember,
  hasCompletedTasks
) => {
  return isLoggedIn && isProjectMember && hasCompletedTasks;
};

/**
 * 获取按钮状态
 * @param {string} requestStatus - 请求状态
 * @param {boolean} hasSubmitted - 是否已提交
 * @param {boolean} isLoading - 是否加载中
 * @returns {string} 按钮状态
 */
export const getButtonState = (requestStatus, hasSubmitted, isLoading) => {
  if (isLoading) return 'loading';
  if (hasSubmitted) return 'submitted';
  if (requestStatus === 'none') return 'none';
  if (requestStatus === 'pending') return 'pending';
  if (requestStatus === 'approved') return 'approved';
  if (requestStatus === 'denied') return 'denied';
  return 'none';
};

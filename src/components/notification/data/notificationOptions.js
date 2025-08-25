// 通知类型映射
export const notificationTypeMap = {
  System: 'system',
  Comments: 'comments',
  Comment: 'comment',
  Collaboration: 'collaboration',
  // Works 相关通知类型（不单独分类，都显示在 All 中）
  Follow: 'follow',
  Like: 'like',
};

// 标签选项
export const tabOptions = ['All', 'System', 'Comments', 'Collaboration'];

// 时间筛选选项
export const timeFilterOptions = ['Last 7 days', 'Today', 'Last 30 days'];

// 默认筛选设置
export const getDefaultFilters = () => ({
  activeTab: 'All',
  timeFilter: 'Last 7 days',
});

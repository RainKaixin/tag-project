// 通知类型映射
export const notificationTypeMap = {
  System: 'system',
  Gallery: 'gallery',
  Collaboration: 'collaboration',
  // Works 相关通知类型（不单独分类，都显示在 All 中）
  Follow: 'follow',
  Like: 'like',
  Comment: 'comment',
};

// 标签选项
export const tabOptions = ['All', 'System', 'Gallery', 'Collaboration'];

// 时间筛选选项
export const timeFilterOptions = ['Last 7 days', 'Today', 'Last 30 days'];

// 默认筛选设置
export const getDefaultFilters = () => ({
  activeTab: 'All',
  timeFilter: 'Last 7 days',
});

// 通知类型到分类的映射
export const getNotificationCategory = notificationType => {
  switch (notificationType) {
    case 'system':
      return 'System';
    case 'gallery':
    case 'comment':
    case 'like':
    case 'follow':
      return 'Gallery';
    case 'collaboration':
    case 'collaboration_application':
      return 'Collaboration';
    default:
      return 'System';
  }
};

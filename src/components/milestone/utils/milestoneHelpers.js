// 获取状态颜色
export const getStatusColor = status => {
  const colors = {
    completed: 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    upcoming: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// 获取状态文本
export const getStatusText = status => {
  const texts = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    upcoming: 'Upcoming',
  };
  return texts[status] || 'Unknown';
};

// 收藏服务常量定义
export const ITEM_TYPES = {
  WORK: 'work',
  COLLABORATION: 'collaboration',
};

// 验证itemType是否有效
export const isValidItemType = itemType => {
  return Object.values(ITEM_TYPES).includes(itemType);
};

// 获取itemType的显示名称
export const getItemTypeLabel = itemType => {
  const labels = {
    [ITEM_TYPES.WORK]: 'Work',
    [ITEM_TYPES.COLLABORATION]: 'Collaboration',
  };
  return labels[itemType] || 'Unknown';
};

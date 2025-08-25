// navbar-helpers v1: 导航栏工具函数集合

/**
 * 检查用户是否已登录
 * @param {Object} user - 用户对象
 * @returns {boolean} 是否已登录
 */
export const isUserLoggedIn = user => {
  return user && user.id && user.id !== 'guest';
};

/**
 * 获取用户显示名称
 * @param {Object} user - 用户对象
 * @param {Object} currentMockUser - 当前模拟用户
 * @returns {string} 用户显示名称
 */
export const getUserDisplayName = (user, currentMockUser) => {
  if (isUserLoggedIn(user)) {
    return currentMockUser?.name || user.name || 'User';
  }
  return 'Guest';
};

/**
 * 获取用户头像URL
 * @param {Object} user - 用户对象
 * @param {Object} currentMockUser - 当前模拟用户
 * @returns {string|null} 用户头像URL
 */
export const getUserAvatar = (user, currentMockUser) => {
  if (isUserLoggedIn(user)) {
    // 優先從頭像服務獲取數據，如果沒有則使用靜態數據
    const userId = currentMockUser?.id || user?.id;
    if (userId && typeof window !== 'undefined') {
      try {
        const avatarData = window.localStorage.getItem(`tag.avatars.${userId}`);
        if (avatarData) {
          const parsedData = JSON.parse(avatarData);
          if (parsedData && parsedData.avatarUrl) {
            console.log(
              '[getUserAvatar] Found avatar in localStorage:',
              parsedData.avatarUrl?.substring(0, 30)
            );
            return parsedData.avatarUrl;
          }
        }
      } catch (error) {
        console.warn('[getUserAvatar] Failed to read avatar data:', error);
      }
    }

    // 回退到靜態數據
    const fallbackAvatar = currentMockUser?.avatar || user.avatar || null;
    console.log(
      '[getUserAvatar] Using fallback avatar:',
      fallbackAvatar?.substring(0, 30)
    );
    return fallbackAvatar;
  }
  return null;
};

/**
 * 获取通知角标样式
 * @param {number} unreadCount - 未读数量
 * @returns {Object} 样式对象
 */
export const getNotificationBadgeStyle = unreadCount => {
  if (unreadCount <= 0) {
    return { display: 'none' };
  }

  return {
    display: 'flex',
    width: '20px',
    height: '20px',
    backgroundColor: '#ef4444',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  };
};

/**
 * 格式化通知数量显示
 * @param {number} unreadCount - 未读数量
 * @returns {string} 格式化后的数量
 */
export const formatNotificationCount = unreadCount => {
  if (unreadCount <= 0) return '0';
  if (unreadCount > 99) return '99+';
  return unreadCount.toString();
};

/**
 * 检查点击是否在元素外部
 * @param {Event} event - 点击事件
 * @param {React.RefObject} ref - 元素引用
 * @returns {boolean} 是否在外部
 */
export const isClickOutside = (event, ref) => {
  return ref.current && !ref.current.contains(event.target);
};

/**
 * 获取下拉菜单箭头样式
 * @param {boolean} isOpen - 是否打开
 * @returns {string} CSS类名
 */
export const getDropdownArrowStyle = isOpen => {
  const baseStyle = 'w-4 h-4 self-center transition-transform duration-200';
  return isOpen ? `${baseStyle} rotate-180` : baseStyle;
};

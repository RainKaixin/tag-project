// user-avatar v1: 用户头像组件

import { useState, useEffect } from 'react';

import { getUnifiedAvatar } from '../../../services/avatarService';
import { isUserLoggedIn, getUserAvatar } from '../utils/navbarHelpers';

/**
 * 用户头像组件
 * @param {Object} user - 用户对象
 * @param {Object} currentMockUser - 当前模拟用户
 * @param {Function} onClick - 点击事件处理函数
 * @param {string} className - 额外的CSS类名
 */
const UserAvatar = ({ user, currentMockUser, onClick, className = '' }) => {
  const [avatarUrl, setAvatarUrl] = useState(
    getUserAvatar(user, currentMockUser)
  );
  const isLoggedIn = isUserLoggedIn(user);

  // 監聽頭像更新事件
  useEffect(() => {
    const handleAvatarUpdate = event => {
      const { userId, avatarUrl: newAvatarUrl } = event.detail;
      const currentUserId = currentMockUser?.id || user?.id;

      console.log('[UserAvatar] Avatar update event received:', {
        eventUserId: userId,
        currentUserId,
        newAvatarUrl: newAvatarUrl?.substring(0, 30),
      });

      if (userId === currentUserId) {
        console.log(
          '[UserAvatar] Avatar updated, setting new URL:',
          newAvatarUrl?.substring(0, 30)
        );
        setAvatarUrl(newAvatarUrl);
      }
    };

    const handleAvatarDeleted = event => {
      const { userId } = event.detail;
      const currentUserId = currentMockUser?.id || user?.id;

      if (userId === currentUserId) {
        console.log('[UserAvatar] Avatar deleted, resetting to default');
        setAvatarUrl(currentMockUser?.avatar || user?.avatar || null);
      }
    };

    // 添加事件監聽器
    window.addEventListener('avatar:updated', handleAvatarUpdate);
    window.addEventListener('avatar:deleted', handleAvatarDeleted);

    // 清理事件監聽器
    return () => {
      window.removeEventListener('avatar:updated', handleAvatarUpdate);
      window.removeEventListener('avatar:deleted', handleAvatarDeleted);
    };
  }, [currentMockUser?.id, user?.id]);

  // 當用戶或 currentMockUser 改變時，更新頭像
  useEffect(() => {
    const updateAvatar = async () => {
      const userId = currentMockUser?.id || user?.id;
      if (userId) {
        // 使用統一的頭像服務
        const unifiedAvatar = await getUnifiedAvatar(userId);
        if (unifiedAvatar) {
          setAvatarUrl(unifiedAvatar);
        } else {
          // 回退到原有邏輯
          setAvatarUrl(getUserAvatar(user, currentMockUser));
        }
      } else {
        setAvatarUrl(getUserAvatar(user, currentMockUser));
      }
    };

    updateAvatar();
  }, [user?.id, currentMockUser?.id]);

  if (isLoggedIn && avatarUrl) {
    // 已登录且有头像：显示用户头像
    return (
      <img
        src={avatarUrl}
        alt={currentMockUser?.name || user?.name || 'User'}
        className={`w-8 h-8 rounded-full object-cover hover:opacity-80 transition-opacity duration-200 ${className}`}
        onClick={onClick}
      />
    );
  } else {
    // 未登录或无头像：显示默认图标
    return (
      <div
        className={`w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity duration-200 ${className}`}
        onClick={onClick}
      >
        <svg
          className='w-5 h-5 text-gray-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
          />
        </svg>
      </div>
    );
  }
};

export default UserAvatar;

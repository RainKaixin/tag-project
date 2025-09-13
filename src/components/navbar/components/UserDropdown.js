// user-dropdown v1: 用户下拉菜单组件

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { NotificationBadge } from '../../ui';
import { isUserLoggedIn } from '../utils/navbarHelpers';

import LogoutConfirmModal from './LogoutConfirmModal';
import UserAvatar from './UserAvatar';

/**
 * 用户下拉菜单组件
 * @param {Object} user - 用户对象
 * @param {Object} currentMockUser - 当前模拟用户
 * @param {boolean} showDropdown - 是否显示下拉菜单
 * @param {Function} onToggle - 切换下拉菜单事件
 * @param {Function} onSettingsClick - 设置按钮点击事件
 * @param {Function} onNotificationsClick - 通知按钮点击事件
 * @param {Function} onLogoutClick - 登出按钮点击事件
 * @param {number} unreadCount - 未读通知数量
 * @param {React.RefObject} dropdownRef - 下拉菜单引用
 * @param {string} className - 额外的CSS类名
 */
const UserDropdown = ({
  user,
  currentMockUser,
  showDropdown,
  onToggle,
  onLogoutClick,
  unreadCount = 0,
  dropdownRef,
  className = '',
}) => {
  const isLoggedIn = isUserLoggedIn(user);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 处理头像点击 - 直接跳转到艺术家主页面
  const handleAvatarClick = () => {
    if (isLoggedIn) {
      navigate('/artist/me');
    }
  };

  // 处理登出按钮点击 - 显示确认弹窗
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // 处理确认登出
  const handleConfirmLogout = () => {
    onLogoutClick();
  };

  // 处理取消登出
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div
      className={`relative ${className}`}
      ref={dropdownRef}
      data-navbar-dropdown
    >
      <div className='flex items-center space-x-1'>
        {/* 用户头像 - 点击跳转到艺术家主页面 */}
        <UserAvatar
          user={user}
          currentMockUser={currentMockUser}
          className='hover:opacity-80 transition-opacity duration-200 cursor-pointer'
          onClick={handleAvatarClick}
        />

        {/* 下拉箭头按钮 - 只在已登录时显示，点击显示/隐藏下拉菜单 */}
        {isLoggedIn && (
          <button
            onClick={onToggle}
            className='flex items-center text-white hover:text-white transition-colors duration-200 cursor-pointer'
          >
            <svg
              className={`w-4 h-4 self-center transition-transform duration-200 ${
                showDropdown ? 'rotate-180' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>
        )}
      </div>

      {/* 下拉菜单 - 只在已登录时显示 */}
      {isLoggedIn && showDropdown && (
        <div className='absolute right-0 mt-2 w-28 bg-white py-1 z-50 border border-gray-200'>
          {/* 设置选项 */}
          <Link
            to='/settings/edit-profile'
            className='flex justify-end w-full px-2 py-3 text-sm font-semibold text-gray-700 hover:bg-black hover:text-white transition-colors duration-200'
          >
            SETTINGS
          </Link>

          {/* 通知选项 */}
          <Link
            to='/notifications'
            className='flex justify-end w-full px-2 py-3 text-sm font-semibold text-gray-700 hover:bg-black hover:text-white transition-colors duration-200'
          >
            INBOX
          </Link>

          {/* 登出选项 */}
          <button
            onClick={handleLogoutClick}
            className='flex justify-end w-full px-2 py-3 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-colors duration-200 border-t border-gray-100'
          >
            Logout
          </button>
        </div>
      )}

      {/* 登出确认弹窗 */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        userEmail={user?.email || user?.user_metadata?.email}
      />
    </div>
  );
};

export default UserDropdown;

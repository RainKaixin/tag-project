// user-dropdown v1: 用户下拉菜单组件

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { NotificationBadge } from '../../ui';
import { isUserLoggedIn } from '../utils/navbarHelpers';

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

  // 处理头像点击 - 直接跳转到艺术家主页面
  const handleAvatarClick = () => {
    if (isLoggedIn) {
      navigate('/artist/me');
    }
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
            className='flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer'
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
        <div className='absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200'>
          {/* 设置选项 */}
          <Link
            to='/settings/edit-profile'
            className='flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200'
          >
            <svg
              className='w-4 h-4 mr-2 text-gray-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
            Settings
          </Link>

          {/* 通知选项 */}
          <Link
            to='/notifications'
            className='flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200'
          >
            <div className='flex items-center'>
              <svg
                className='w-4 h-4 mr-2 text-gray-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                />
              </svg>
              <span>Notifications</span>
            </div>
            {/* 通知角标 */}
            <NotificationBadge unreadCount={unreadCount} />
          </Link>

          {/* 登出选项 */}
          <button
            onClick={onLogoutClick}
            className='flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 border-t border-gray-100'
          >
            <svg
              className='w-4 h-4 mr-2 text-gray-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
              />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

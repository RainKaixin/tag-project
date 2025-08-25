// navbar-refactored v1: 重构后的导航栏主组件

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import { NavbarLogo, ActionButtons, UserDropdown } from './components';
import { useNavbarState, useNavbarActions } from './hooks';

/**
 * 重构后的导航栏组件
 * 使用自定义hooks和组件化的UI元素
 */
const NavBar = () => {
  const { user, loading } = useAuth();
  const dropdownRef = useRef(null);

  // 使用自定义hooks管理状态
  const state = useNavbarState(user);

  // 使用自定义hooks管理操作
  const actions = useNavbarActions({
    state,
    setters: {
      setShowDropdown: state.setShowDropdown,
      setUnreadCount: state.setUnreadCount,
      setCurrentMockUser: state.setCurrentMockUser,
    },
    user,
  });

  // 当前用户数据（如果已登录）
  const currentUser = user || {
    id: 'guest',
    name: 'Guest',
    avatar: null,
  };

  return (
    <nav className='fixed top-0 left-0 right-0 bg-white shadow-sm z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <NavbarLogo onClick={actions.handleLogoClick} />

          {/* Center Upload Button - Absolute Centering */}
          <div className='absolute left-1/2 transform -translate-x-1/2'>
            <button
              onClick={actions.handleUploadClick}
              className='bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              aria-label='Upload Work'
            >
              <svg
                className='w-4 h-4 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                />
              </svg>
              Upload Work
            </button>
          </div>

          {/* Right Side Buttons */}
          <div className='flex items-center space-x-4'>
            {/* Gallery Button - Same size as TAGMe */}
            <button
              onClick={actions.handleGalleryClick}
              onMouseDown={e => {
                // 中键点击（button === 1）时在新窗口打开主页
                if (e.button === 1) {
                  e.preventDefault();
                  window.open('/', '_blank');
                }
              }}
              className='bg-tag-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 min-w-[80px] text-center'
            >
              Gallery
            </button>

            {/* TAGMe Button - Same size as Gallery */}
            <Link
              to='/tagme'
              className='bg-tag-purple text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors duration-200 min-w-[80px] text-center'
            >
              TAGMe
            </Link>

            {/* User Dropdown */}
            {!loading && (
              <UserDropdown
                user={currentUser}
                currentMockUser={state.currentMockUser}
                showDropdown={state.showDropdown}
                onToggle={actions.handleDropdownToggle}
                onSettingsClick={actions.handleSettingsClick}
                onNotificationsClick={actions.handleNotificationsClick}
                onLogoutClick={actions.handleLogoutClick}
                unreadCount={state.unreadCount}
                dropdownRef={dropdownRef}
              />
            )}
            {loading && (
              <div className='w-8 h-8 rounded-full bg-gray-200 animate-pulse'></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

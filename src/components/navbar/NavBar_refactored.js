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
    <nav className='fixed top-0 left-0 right-0 bg-black shadow-sm z-50 hidden md:block'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo - Hidden on mobile */}
          <div className='hidden md:block'>
            <NavbarLogo onClick={actions.handleLogoClick} />
          </div>

          {/* Center Upload Button - Absolute Centering - Hidden on mobile */}
          <div className='absolute left-1/2 transform -translate-x-1/2 hidden md:block'>
            <button
              onClick={actions.handleUploadClick}
              className='bg-transparent text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/30 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:border-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              aria-label='Upload Work'
            >
              Upload Work
            </button>
          </div>

          {/* Right Side Buttons */}
          <div className='flex items-center space-x-4'>
            {/* Gallery Button - Same size as TAGMe - Hidden on mobile */}
            <button
              onClick={actions.handleGalleryClick}
              onMouseDown={e => {
                // 中键点击（button === 1）时在新窗口打开主页
                if (e.button === 1) {
                  e.preventDefault();
                  window.open('/', '_blank');
                }
              }}
              className='bg-transparent text-white px-4 py-2 rounded-md text-sm font-semibold border border-white/30 hover:bg-tag-blue hover:border-transparent transition-colors duration-200 min-w-[80px] text-center hidden md:block'
            >
              Gallery
            </button>

            {/* TAGMe Button - Same size as Gallery - Hidden on mobile */}
            <Link
              to='/tagme'
              className='bg-transparent text-white px-4 py-2 rounded-md text-sm font-semibold border border-white/30 hover:bg-tag-purple hover:border-transparent transition-colors duration-200 min-w-[80px] text-center hidden md:block'
            >
              TAGMe
            </Link>

            {/* User Dropdown - Hidden on mobile */}
            {!loading && (
              <div className='hidden md:block'>
                <UserDropdown
                  user={currentUser}
                  currentUser={state.currentUser}
                  showDropdown={state.showDropdown}
                  onToggle={actions.handleDropdownToggle}
                  onSettingsClick={actions.handleSettingsClick}
                  onNotificationsClick={actions.handleNotificationsClick}
                  onLogoutClick={actions.handleLogoutClick}
                  unreadCount={state.unreadCount}
                  dropdownRef={dropdownRef}
                />
              </div>
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

// navbar-logo v1: 导航栏Logo组件

import { useState } from 'react';
import { Link } from 'react-router-dom';

import ImportantNoticeModal from '../../ImportantNoticeModal';

/**
 * 导航栏Logo组件
 * @param {Function} onClick - 点击事件处理函数
 * @param {string} className - 额外的CSS类名
 */
const NavbarLogo = ({ onClick, className = '' }) => {
  const [showImportantModal, setShowImportantModal] = useState(false);

  // 处理Logo点击
  const handleLogoClick = e => {
    // 检查是否已经看过重要通知
    const hasSeenImportantNotice = localStorage.getItem(
      'hasSeenImportantNotice'
    );

    if (!hasSeenImportantNotice) {
      // 显示重要通知弹窗
      setShowImportantModal(true);
    }

    // 调用原始的onClick处理函数
    if (onClick) {
      onClick(e);
    }
  };

  // 处理重要通知弹窗关闭
  const handleImportantModalClose = () => {
    setShowImportantModal(false);
    // 标记用户已看过重要通知（永久存储）
    localStorage.setItem('hasSeenImportantNotice', 'true');
  };

  return (
    <>
      <Link
        to='/'
        className={`flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-200 ${className}`}
        onClick={handleLogoClick}
      >
        <img
          src={`${process.env.PUBLIC_URL}/TAG_Logo.png`}
          alt='TAG Logo'
          className='h-12 w-auto'
        />
      </Link>

      {/* 重要通知弹窗 */}
      <ImportantNoticeModal
        isOpen={showImportantModal}
        onClose={handleImportantModalClose}
      />
    </>
  );
};

export default NavbarLogo;

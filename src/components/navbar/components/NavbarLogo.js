// navbar-logo v1: 导航栏Logo组件

import { Link } from 'react-router-dom';

/**
 * 导航栏Logo组件
 * @param {Function} onClick - 点击事件处理函数
 * @param {string} className - 额外的CSS类名
 */
const NavbarLogo = ({ onClick, className = '' }) => {
  return (
    <Link
      to='/'
      className={`flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-200 ${className}`}
      onClick={onClick}
    >
      <img src='/TAG_Logo.png' alt='TAG Logo' className='h-12 w-auto' />
    </Link>
  );
};

export default NavbarLogo;

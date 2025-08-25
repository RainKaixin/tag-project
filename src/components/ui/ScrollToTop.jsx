import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 页面滚动到顶部组件
 * 监听路由变化，自动滚动到页面顶部
 * 主页（Gallery页面）除外
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 如果是主页（Gallery页面），不执行 scrollTo(0,0)
    if (pathname === '/') {
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

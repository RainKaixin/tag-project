import { useNavigate, useLocation } from 'react-router-dom';

import { useAppContext } from '../context/AppContext';

import { getCurrentUser } from './currentUser.js';

// 导航工具Hook
export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { actions, state } = useAppContext();

  // 保存当前页面滚动位置
  const saveCurrentScrollPosition = () => {
    const currentPosition = window.pageYOffset;
    actions.saveScrollPosition(location.pathname, currentPosition);
  };

  // 恢复页面滚动位置
  const restoreScrollPosition = path => {
    const savedPosition = state.scrollPositions[path];
    if (savedPosition !== undefined) {
      // 使用setTimeout确保DOM渲染完成后再恢复位置
      setTimeout(() => {
        window.scrollTo({ top: savedPosition, behavior: 'instant' });
      }, 100);
    }
  };

  // 滚动到指定元素
  const scrollToElement = (selector, offset = 64) => {
    setTimeout(() => {
      const element = document.querySelector(selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset + rect.top - offset;
        window.scrollTo({ top: scrollTop, behavior: 'instant' });
      } else {
        window.scrollTo(0, 0);
      }
    }, 100);
  };

  // 导航到作品详情页
  const navigateToWork = (workId, from = 'gallery') => {
    actions.setLoading(true);
    actions.addToHistory({ path: location.pathname, from });

    // 保存当前Gallery页面的滚动位置
    if (location.pathname === '/') {
      actions.saveScrollPosition('/', window.scrollY);
    }

    // 预加载资源
    setTimeout(() => {
      actions.setShowDetail(true);
      actions.setLoading(false);
      navigate(`/work/${workId}`, { state: { from } });
      window.scrollTo(0, 0);
    }, 300); // 增加延迟确保加载完成
  };

  // 导航到艺术家档案页
  const navigateToArtist = (
    artistId,
    from = 'gallery',
    activeTab = 'Artists'
  ) => {
    actions.setLoading(true);
    actions.setSelectedArtist(artistId);
    actions.addToHistory({ path: location.pathname, from, activeTab });

    // 保存当前Gallery页面的滚动位置和元素信息
    if (location.pathname === '/') {
      const currentScrollY = window.scrollY;
      const elementInfo = document.querySelector(
        `[data-artist-id="${artistId}"]`
      );
      const elementPosition = elementInfo
        ? {
            id: artistId,
            type: 'artist',
            scrollY: currentScrollY,
            elementRect: elementInfo.getBoundingClientRect
              ? elementInfo.getBoundingClientRect()
              : null,
            elementIndex: elementInfo.dataset?.index || null,
          }
        : null;

      console.log('[Navigation] Saving scroll position:', currentScrollY);
      console.log('[Navigation] Saving element info:', elementPosition);

      actions.saveScrollPosition('/', currentScrollY, elementPosition);
    }

    // 预加载资源
    setTimeout(() => {
      actions.setLoading(false);
      // 统一使用 /artist/:id 路由，在组件内判断是否为当前用户
      const targetUrl = `/artist/${artistId}`;

      navigate(targetUrl);
      window.scrollTo(0, 0);
    }, 300); // 增加延迟确保加载完成
  };

  // 导航到TAGMe页面
  const navigateToTAGMe = () => {
    // 保存上一个页面的滚动位置
    actions.saveScrollPosition('/tag', window.scrollY);

    // 正确标记来源路径
    actions.addToHistory({
      from: 'tagme',
      path: '/tagme',
      activeTab: 'Collaborations',
    });

    navigate('/tagme');
    // 恢复TAGMe页面的滚动位置
    setTimeout(() => {
      restoreScrollPosition('/tagme');
    }, 100);
  };

  // 导航到里程碑页面
  const navigateToMilestone = (milestone, from = 'tagme') => {
    // 保存当前TAGMe页面的滚动位置（tab独立）
    if (location.pathname === '/tagme') {
      actions.saveScrollPosition('/tagme-Milestones', window.scrollY);
    }
    actions.setLoading(true);
    actions.setSelectedMilestone(milestone);
    actions.addToHistory({
      path: location.pathname,
      from: 'tagme',
      activeTab: 'Milestones',
    });

    // 预加载资源
    setTimeout(() => {
      actions.setShowDetail(true); // 添加这一行，与 navigateToWork 保持一致
      actions.setLoading(false);
      const targetUrl = `/tagme/milestone/${milestone.id}`;

      navigate(targetUrl, { state: { milestone } });
      // 确保Post页面从顶部开始
      window.scrollTo(0, 0);
    }, 300);
  };

  // 导航到合作详情页面
  const navigateToCollaboration = project => {
    // 保存当前TAGMe页面的滚动位置（tab独立）
    if (location.pathname === '/tagme') {
      actions.saveScrollPosition('/tagme-Collaborations', window.scrollY);
    }
    actions.setLoading(true);
    actions.setSelectedCollaboration(project);
    actions.addToHistory({
      path: location.pathname,
      from: 'tagme',
      activeTab: 'Collaborations',
    });

    // 立即导航，让目标页面自己处理滚动
    const targetUrl = `/tagme/collaboration/${project.id}`;

    navigate(targetUrl, { state: { project } });

    // 延迟关闭loading状态
    setTimeout(() => {
      actions.setLoading(false);
    }, 100);
  };

  // 返回上一页
  const goBack = () => {
    const previousHistory =
      state.navigationHistory.length > 0
        ? state.navigationHistory[state.navigationHistory.length - 1]
        : { path: '/', from: 'home' };

    console.log('[Navigation] goBack - previousHistory:', previousHistory);

    // 处理从Artists板块返回的情况
    if (previousHistory.from === 'artists') {
      console.log('[Navigation] Returning from artists section');
      actions.setLoading(true);

      // 直接导航到主页并设置Artists标签页
      navigate('/', {
        state: {
          from: 'artist-profile',
          activeTab: 'Artists',
          scrollToGallery: true,
        },
      });

      setTimeout(() => {
        actions.setLoading(false);
      }, 100);
      return;
    }

    // 简化返回逻辑，让目标页面自己处理滚动恢复
    if (previousHistory.path === '/tagme') {
      actions.setLoading(true);
      navigate(-1);
      // 移除这里的滚动恢复逻辑，让TAGMePage自己处理
      setTimeout(() => {
        actions.setLoading(false);
      }, 100);
    } else if (previousHistory.path === '/') {
      actions.setLoading(true);
      navigate(-1);
      setTimeout(() => {
        actions.setLoading(false);
      }, 100);
    } else {
      navigate(-1);
    }
  };

  // 返回主页
  const goHome = () => {
    actions.resetState();
    navigate('/');
    window.scrollTo(0, 0);
  };

  // 导航到Gallery区域
  const navigateToGallery = () => {
    // 添加导航历史，标记这是从导航栏直接点击Gallery按钮
    actions.addToHistory({
      path: location.pathname,
      from: 'gallery',
      fromNavbar: true,
      activeTab: 'Works',
    });

    // 如果已经在主页，直接滚动到Gallery区域
    if (location.pathname === '/') {
      console.log(
        '[Navigation] Already on homepage, scrolling to gallery section'
      );

      // 添加调试信息：检查所有section元素
      const allSections = document.querySelectorAll('section');
      console.log('[Navigation] All sections found:', allSections.length);
      allSections.forEach((section, index) => {
        console.log(`[Navigation] Section ${index}:`, {
          className: section.className,
          dataSection: section.getAttribute('data-section'),
          textContent: section.textContent?.substring(0, 50) + '...',
        });
      });

      const gallerySection = document.querySelector('[data-section="gallery"]');
      console.log('[Navigation] Gallery section found:', !!gallerySection);

      if (gallerySection) {
        const rect = gallerySection.getBoundingClientRect();
        console.log('[Navigation] Gallery section position:', {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
        });
        const scrollTop = window.pageYOffset + rect.top - 80; // 减去80px避免遮挡导航栏
        console.log('[Navigation] Scrolling to position:', scrollTop);
        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
        console.log('[Navigation] Scrolled to gallery section');
      } else {
        console.warn(
          '[Navigation] Gallery section not found, scrolling to top'
        );
        window.scrollTo(0, 0);
      }
    } else {
      // 如果不在主页，先导航到主页，然后滚动到Gallery区域
      console.log(
        '[Navigation] Navigating to homepage first, then scrolling to gallery'
      );
      actions.resetState();
      navigate('/');
      // 延迟滚动，确保页面加载完成
      setTimeout(() => {
        const gallerySection = document.querySelector(
          '[data-section="gallery"]'
        );
        if (gallerySection) {
          const rect = gallerySection.getBoundingClientRect();
          const scrollTop = window.pageYOffset + rect.top - 80; // 减去80px避免遮挡导航栏
          window.scrollTo({ top: scrollTop, behavior: 'smooth' });
          console.log(
            '[Navigation] Scrolled to gallery section after navigation'
          );
        } else {
          console.warn(
            '[Navigation] Gallery section not found after navigation'
          );
          window.scrollTo(0, 0);
        }
      }, 300); // 增加延迟确保页面渲染完成
    }
  };

  return {
    navigateToWork,
    navigateToArtist,
    navigateToTAGMe,
    navigateToMilestone,
    navigateToCollaboration,
    goBack,
    goHome,
    navigateToGallery,
    scrollToElement,
    saveCurrentScrollPosition,
    restoreScrollPosition,
  };
};

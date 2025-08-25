import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '../context/AppContext';
import { getCurrentUser } from '../utils/currentUser.js';
import { useNavigation } from '../utils/navigation';

import ArtistsList from './ArtistsList';
import GalleryGrid from './GalleryGrid';
import MarketTemplate from './MarketTemplate';
import SearchBar from './navbar/components/SearchBar';
import { FilterPanel } from './ui';

const GallerySection = () => {
  const [activeTab, setActiveTab] = useState('Works');
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const { navigateToArtist } = useNavigation();
  const { state } = useAppContext();
  const location = useLocation();

  // 恢复Gallery页面的滚动位置和标签页状态
  useEffect(() => {
    // 处理从UploadSuccess传递过来的状态
    if (location.state?.from === 'upload-success') {
      // 立即设置activeTab，避免状态变化导致的重新渲染
      setActiveTab(location.state.activeTab || 'Works');

      // 如果需要滚动到Gallery标题，使用requestAnimationFrame优化时机
      if (location.state.scrollToGallery) {
        requestAnimationFrame(() => {
          const gallerySection = document.querySelector(
            '[data-section="gallery"]'
          );
          if (gallerySection) {
            const rect = gallerySection.getBoundingClientRect();
            const scrollTop = window.pageYOffset + rect.top - 80; // 减去80px避免遮挡按钮
            window.scrollTo({ top: scrollTop, behavior: 'auto' });
          }
          // 完成初始化
          setIsInitializing(false);
        });
      } else {
        setIsInitializing(false);
      }

      // 清除状态，避免重复处理
      window.history.replaceState({}, document.title);
    } else {
      // 原有的滚动位置恢复逻辑
      const savedPosition = state.scrollPositions['/'];
      if (savedPosition !== undefined) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: savedPosition, behavior: 'auto' });
        });
      }

      // 恢复标签页状态 - 但优先使用Works作为默认标签页
      if (state.navigationHistory.length > 0) {
        const lastHistory =
          state.navigationHistory[state.navigationHistory.length - 1];
        // 只有当来源是gallery且不是从导航栏直接点击Gallery按钮时，才恢复之前的标签页
        if (
          lastHistory.activeTab &&
          lastHistory.from === 'gallery' &&
          !lastHistory.fromNavbar
        ) {
          setActiveTab(lastHistory.activeTab);
        } else {
          // 默认显示Works标签页
          setActiveTab('Works');
        }
      } else {
        // 没有历史记录时，默认显示Works标签页
        setActiveTab('Works');
      }

      // 完成初始化
      setIsInitializing(false);
    }
  }, [location.state, state.scrollPositions, state.navigationHistory]);

  // 监听用户切换事件
  useEffect(() => {
    const handleUserChange = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener('user:changed', handleUserChange);
    return () => {
      window.removeEventListener('user:changed', handleUserChange);
    };
  }, []);

  const tabs = ['Works', 'Artists', 'Market'];

  // 处理艺术家点击事件
  const handleArtistClick = artwork => {
    navigateToArtist(artwork.id, 'gallery', activeTab);
  };

  // 如果正在初始化，显示加载状态
  if (isInitializing) {
    return (
      <section className='py-16 bg-gray-50' data-section='gallery'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col mb-8'>
            <h2 className='text-3xl font-bold text-gray-400 mb-6'>
              TAG Gallery
            </h2>
            <div className='flex items-center space-x-6'>
              {/* Search Bar Placeholder */}
              <div className='w-7/12'>
                <div className='h-10 bg-gray-200 rounded-md animate-pulse'></div>
              </div>
              <div className='inline-flex rounded-full border border-gray-300 bg-white p-1'>
                {tabs.map(tab => (
                  <button
                    key={tab}
                    className={`relative px-12 py-3 text-base font-semibold tracking-wide ${
                      activeTab === tab ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {activeTab === tab && (
                      <div className='absolute inset-0 bg-tag-blue rounded-full' />
                    )}
                    <span className='relative z-10'>{tab}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className='flex-1'>
            <div className='animate-pulse'>
              <div className='h-64 bg-gray-200 rounded-lg'></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='py-16 bg-gray-50' data-section='gallery'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='flex flex-col mb-8'>
          <h2 className='text-3xl font-bold text-gray-400 mb-6'>TAG Gallery</h2>

          {/* Search Bar and Tab Button Group - Left Aligned */}
          <div className='flex items-center space-x-6'>
            {/* Search Bar - 70% width */}
            <div className='w-7/12'>
              <SearchBar
                onInputChange={e => console.log('Search:', e.target.value)}
                placeholder='Search for Works or Artists'
                className='w-full'
              />
            </div>

            {/* Segmented Tab Button Group - 30% width */}
            <div className='inline-flex rounded-full border border-gray-300 bg-white p-1'>
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-12 py-3 text-base font-semibold tracking-wide transition-all duration-300 ease-in-out ${
                    activeTab === tab
                      ? 'text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {/* Active Background */}
                  {activeTab === tab && (
                    <div className='absolute inset-0 bg-tag-blue rounded-full transition-all duration-300 ease-in-out' />
                  )}

                  {/* Text Content */}
                  <span className='relative z-10'>{tab}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Filter Panel - Hidden on mobile, visible on large screens */}
          <div className='hidden lg:block lg:w-64 flex-shrink-0'>
            <FilterPanel />
          </div>

          {/* Content Area */}
          <div className='flex-1'>
            {activeTab === 'Works' && <GalleryGrid currentUser={currentUser} />}
            {activeTab === 'Artists' && (
              <ArtistsList onArtistClick={handleArtistClick} />
            )}
            {activeTab === 'Market' && <MarketTemplate />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

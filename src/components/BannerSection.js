import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const BannerSection = () => {
  const navigate = useNavigate();
  const [hoveredSection, setHoveredSection] = useState(null); // 'blue' | 'purple' | null

  const handleTAGClick = () => {
    // 滚动到Gallery区域
    const gallerySection = document.querySelector('[data-section="gallery"]');
    if (gallerySection) {
      const rect = gallerySection.getBoundingClientRect();
      const scrollTop = window.pageYOffset + rect.top - 40;
      window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  };

  // 计算宽度百分比
  const getBlueWidth = () => {
    if (hoveredSection === 'blue') return '80%';
    if (hoveredSection === 'purple') return '20%';
    return '50%';
  };

  const getPurpleWidth = () => {
    if (hoveredSection === 'blue') return '20%';
    if (hoveredSection === 'purple') return '80%';
    return '50%';
  };

  // 键盘导航
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <section className='relative min-h-[140px] lg:min-h-[160px] overflow-hidden'>
      <div className='flex flex-col lg:flex-row'>
        {/* 左栏 - TAG */}
        <div
          className='relative w-full lg:w-1/2 bg-black hover:bg-gradient-to-b hover:from-blue-600 hover:to-blue-700 min-h-[140px] lg:min-h-[160px] flex items-center justify-center px-8 lg:px-8 py-8 cursor-pointer transition-all duration-500 ease-out'
          style={{
            width: window.innerWidth >= 1024 ? getBlueWidth() : '100%',
            transitionTimingFunction: 'cubic-bezier(.22,.61,.36,1)',
          }}
          onClick={handleTAGClick}
          onKeyDown={e => handleKeyDown(e, handleTAGClick)}
          onMouseEnter={() => setHoveredSection('blue')}
          onMouseLeave={() => setHoveredSection(null)}
          role='link'
          tabIndex={0}
        >
          <div className='flex flex-col items-center text-center'>
            {/* 主标题 */}
            <div className='leading-[0.8] mb-4'>
              <h1
                className='text-transparent font-black uppercase tracking-[-0.03em]'
                style={{
                  fontSize: 'clamp(40px, 5vw, 64px)',
                  fontFamily: 'Poppins, Inter, system-ui, sans-serif',
                  textRendering: 'optimizeLegibility',
                  WebkitTextStroke: '1px white',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                TAG
              </h1>
              <h1
                className='text-blue-200 font-black tracking-[-0.03em]'
                style={{
                  fontSize: 'clamp(24px, 3vw, 40px)',
                  fontFamily: 'Poppins, Inter, system-ui, sans-serif',
                  textRendering: 'optimizeLegibility',
                }}
              >
                Gallery
              </h1>
            </div>

            {/* 副标题 */}
            <p
              className='text-white font-black leading-tight'
              style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
            >
              Show your work
            </p>
          </div>
        </div>

        {/* 右栏 - TAG ME */}
        <Link
          to='/tagme'
          className='relative w-full lg:w-1/2 bg-black hover:bg-gradient-to-b hover:from-purple-600 hover:to-purple-700 min-h-[140px] lg:min-h-[160px] flex items-center justify-center px-8 lg:px-8 py-8 cursor-pointer transition-all duration-500 ease-out'
          style={{
            width: window.innerWidth >= 1024 ? getPurpleWidth() : '100%',
            transitionTimingFunction: 'cubic-bezier(.22,.61,.36,1)',
          }}
          onMouseEnter={() => setHoveredSection('purple')}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div className='flex flex-col items-center text-center'>
            {/* 主标题 */}
            <div className='leading-[0.8] mb-4'>
              <h1
                className='text-transparent font-black uppercase tracking-[-0.03em]'
                style={{
                  fontSize: 'clamp(40px, 5vw, 64px)',
                  fontFamily: 'Poppins, Inter, system-ui, sans-serif',
                  textRendering: 'optimizeLegibility',
                  WebkitTextStroke: '1px white',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                TAG
              </h1>
              <h1
                className='text-purple-200 font-black tracking-[-0.03em]'
                style={{
                  fontSize: 'clamp(24px, 3vw, 40px)',
                  fontFamily: 'Poppins, Inter, system-ui, sans-serif',
                  textRendering: 'optimizeLegibility',
                }}
              >
                Me
              </h1>
            </div>

            {/* 副标题 */}
            <p
              className='text-white font-black leading-tight'
              style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
            >
              Find your team
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default BannerSection;

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
    <section className='relative min-h-[560px] lg:min-h-[640px] overflow-hidden'>
      <div className='flex flex-col lg:flex-row'>
        {/* 左栏 - TAG */}
        <div
          className='relative w-full lg:w-1/2 bg-gradient-to-b from-blue-600 to-blue-700 min-h-[560px] lg:min-h-[640px] flex items-start justify-center px-8 lg:px-8 pt-20 lg:pt-24 pb-16 lg:pb-20 cursor-pointer transition-all duration-500 ease-out'
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
          <div className='flex flex-col items-end max-w-md gap-6 lg:pr-0'>
            {/* 主标题 */}
            <div className='leading-[0.8]'>
              <h1
                className='text-white font-black uppercase tracking-[-0.03em]'
                style={{
                  fontSize: 'clamp(56px, 7vw, 96px)',
                  fontFamily: 'Poppins, Inter, system-ui, sans-serif',
                  textRendering: 'optimizeLegibility',
                }}
              >
                TAG
              </h1>
              <h1
                className='text-blue-200 font-black tracking-[-0.03em]'
                style={{
                  fontSize: 'clamp(32px, 4vw, 56px)',
                  fontFamily: 'Poppins, Inter, system-ui, sans-serif',
                  textRendering: 'optimizeLegibility',
                }}
              >
                Gallery
              </h1>
            </div>

            {/* 副标题 */}
            <div className='space-y-2 mt-6 md:mt-8 text-right'>
              <p
                className='text-white/95 font-semibold leading-tight'
                style={{ fontSize: 'clamp(20px, 2.2vw, 28px)' }}
              >
                Show your work
              </p>
              <p
                className='text-white/95 font-semibold leading-tight'
                style={{ fontSize: 'clamp(20px, 2.2vw, 28px)' }}
              >
                Get hired!
              </p>
            </div>

            {/* 描述 */}
            <p className='text-white text-lg opacity-80 leading-relaxed text-right'>
              Explore TAG Gallery
            </p>
          </div>
        </div>

        {/* 右栏 - TAG ME */}
        <Link
          to='/tagme'
          className='relative w-full lg:w-1/2 bg-gradient-to-b from-purple-600 to-purple-700 min-h-[560px] lg:min-h-[640px] flex items-start justify-center px-8 lg:px-8 pt-20 lg:pt-24 pb-16 lg:pb-20 cursor-pointer transition-all duration-500 ease-out'
          style={{
            width: window.innerWidth >= 1024 ? getPurpleWidth() : '100%',
            transitionTimingFunction: 'cubic-bezier(.22,.61,.36,1)',
          }}
          onMouseEnter={() => setHoveredSection('purple')}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div className='flex flex-col items-start max-w-md gap-6 lg:pl-0'>
            {/* 主标题 */}
            <div className='leading-[0.8]'>
              <h1
                className='text-white font-black uppercase tracking-[-0.03em]'
                style={{
                  fontSize: 'clamp(56px, 7vw, 96px)',
                  fontFamily: 'Poppins, Inter, system-ui, sans-serif',
                  textRendering: 'optimizeLegibility',
                }}
              >
                TAG
              </h1>
              <h1
                className='text-purple-200 font-black tracking-[-0.03em]'
                style={{
                  fontSize: 'clamp(48px, 6vw, 80px)',
                  fontFamily: 'Poppins, Inter, system-ui, sans-serif',
                  textRendering: 'optimizeLegibility',
                }}
              >
                Me
              </h1>
            </div>

            {/* 副标题 */}
            <div className='space-y-2 mt-6 md:mt-8'>
              <p
                className='text-white/95 font-semibold leading-tight'
                style={{ fontSize: 'clamp(20px, 2.2vw, 28px)' }}
              >
                Find your team
              </p>
              <p
                className='text-white/95 font-semibold leading-tight'
                style={{ fontSize: 'clamp(20px, 2.2vw, 28px)' }}
              >
                Build experience!
              </p>
            </div>

            {/* 描述 */}
            <p className='text-white text-lg opacity-80 leading-relaxed'>
              Explore TAGMe
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default BannerSection;

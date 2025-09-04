import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleAboutClick = () => {
    navigate('/about');
  };

  return (
    <section className='pt-20 pb-16 bg-white'>
      {/* 1) 容器加宽：max-w-7xl（或 6xl），让长句能装下 */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <h1 className='text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight'>
          One Platform
        </h1>

        {/* 2) 中屏以上不换行：md:whitespace-nowrap；字距更紧：tracking-tight
              3) 与副标题间距更大：mb-12（原来是 mb-10） */}
        <p className='font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 md:whitespace-nowrap tracking-tight mb-12'>
          All Students Across All Majors
        </p>

        {/* 4) 副标题稍小一点并上方留一点呼吸感（mt-1），整体层级更清晰 */}
        <p className='text-base md:text-lg text-gray-600 mt-1 mb-10 max-w-3xl mx-auto leading-relaxed'>
          A bridge for art students to showcase, connect, and collaborate
        </p>

        <button
          onClick={handleAboutClick}
          className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
        >
          About TAG
        </button>
      </div>
    </section>
  );
};

export default HeroSection;

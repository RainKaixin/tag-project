import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const UploadSuccess = ({
  module = 'Milestones',
  title = 'Your milestone has been shared successfully!',
  subtitle = 'The community can now see your achievement and celebrate with you.',
  icon = '🏁',
  bannerSubtitle = 'Celebrate achievements and track creative journeys',
}) => {
  const navigate = useNavigate();

  // 根据模块动态设置内容
  const getModuleConfig = moduleName => {
    const configs = {
      Milestones: {
        icon: '🏁',
        bannerTitle: 'Milestones Feed',
        bannerSubtitle: 'Celebrate achievements and track creative journeys',
        successTitle: 'Your milestone has been shared successfully!',
        successSubtitle:
          'The community can now see your achievement and celebrate with you.',
      },
      'Art Market': {
        icon: '🏪',
        bannerTitle: 'Art Market Feed',
        bannerSubtitle: 'Showcase your artwork to the world',
        successTitle: 'Your artwork has been published successfully!',
        successSubtitle:
          'Art lovers can now discover and appreciate your creation.',
      },
      Portfolio: {
        icon: '📁',
        bannerTitle: 'Portfolio Feed',
        bannerSubtitle: 'Build your professional portfolio',
        successTitle: 'Your portfolio has been updated successfully!',
        successSubtitle:
          'Your professional showcase is now live for the community.',
      },
      Collaboration: {
        icon: '🤝',
        bannerTitle: 'Collaboration Feed',
        bannerSubtitle: 'Connect and collaborate with fellow artists',
        successTitle: 'Your collaboration has been shared successfully!',
        successSubtitle:
          'Other artists can now discover and join your project.',
      },
      Jobs: {
        icon: '💼',
        bannerTitle: 'Jobs Feed',
        bannerSubtitle: 'Find opportunities and grow your career',
        successTitle: 'Your job post has been published successfully!',
        successSubtitle:
          'Talented artists can now discover and apply for your opportunity.',
      },
    };

    return configs[moduleName] || configs['Milestones'];
  };

  const config = getModuleConfig(module);

  const handleViewFeed = () => {
    // 根据模块类型跳转到不同的页面
    console.log('🔍 handleViewFeed called with module:', module);

    if (module === 'Milestones') {
      console.log('🎯 Navigating to TAGMe with Milestones tab');
      // 跳转到TAGMe页面的Milestones模块
      const navigationState = {
        activeTab: 'Milestones',
        from: 'upload-success',
      };
      console.log('🎯 Navigation state being passed:', navigationState);
      navigate('/tagme', { state: navigationState });
    } else if (module === 'Collaboration') {
      console.log('🎯 Navigating to TAGMe with Collaborations tab');
      // 跳转到TAGMe页面的Collaborations模块
      const navigationState = {
        activeTab: 'Collaborations',
        from: 'upload-success',
      };
      console.log('🎯 Navigation state being passed:', navigationState);
      navigate('/tagme', { state: navigationState });
    } else if (module === 'Jobs') {
      console.log('🎯 Navigating to TAGMe with Jobs tab');
      // 跳转到TAGMe页面的Jobs模块
      const navigationState = {
        activeTab: 'Jobs',
        from: 'upload-success',
      };
      console.log('🎯 Navigation state being passed:', navigationState);
      navigate('/tagme', { state: navigationState });
    } else if (module === 'Portfolio') {
      console.log('🎯 Navigating to Gallery with Works tab');
      // 跳转到Gallery页面的Works模块
      const navigationState = {
        activeTab: 'Works',
        from: 'upload-success',
        scrollToGallery: true,
      };
      console.log('🎯 Navigation state being passed:', navigationState);
      navigate('/', { state: navigationState });
    } else if (module === 'Art Market') {
      console.log('🎯 Navigating to Gallery with Market tab');
      // 跳转到Gallery页面的Market模块
      const navigationState = {
        activeTab: 'Market',
        from: 'upload-success',
        scrollToGallery: true,
      };
      console.log('🎯 Navigation state being passed:', navigationState);
      navigate('/', { state: navigationState });
    } else {
      console.log('🎯 Navigating to home page');
      // 其他模块跳转到首页
      navigate('/');
    }
  };

  const handleUploadMore = () => {
    // 导航回上传页面，并传递状态来选中对应的标签页
    console.log('🔍 handleUploadMore called with module:', module);
    console.log('🔍 Current module value:', module);

    try {
      if (module === 'Milestones') {
        console.log('🎯 Navigating back to upload page with Milestones tab');
        window.location.href = '/upload?tab=milestones';
      } else if (module === 'Collaboration') {
        console.log('🎯 Navigating back to upload page with Collaboration tab');
        window.location.href = '/upload?tab=collaboration';
      } else if (module === 'Jobs') {
        console.log('🎯 Navigating back to upload page with Jobs tab');
        window.location.href = '/upload?tab=jobs';
      } else if (module === 'Art Market') {
        console.log('🎯 Navigating back to upload page with Art Market tab');
        window.location.href = '/upload?tab=art-market';
      } else if (module === 'Portfolio') {
        console.log('🎯 Navigating back to upload page with Portfolio tab');
        window.location.href = '/upload?tab=portfolio';
      } else {
        console.log('🎯 Navigating back to upload page with default tab');
        console.log('⚠️ Unknown module type:', module);
        window.location.href = '/upload';
      }
    } catch (error) {
      console.error('❌ Error in handleUploadMore:', error);
      // 如果出错，至少跳转到上传页面
      window.location.href = '/upload';
    }
  };

  // 根据模块确定主题色
  const isBlueTheme = module === 'Portfolio' || module === 'Art Market';
  const bannerGradient = isBlueTheme
    ? 'bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8]'
    : 'bg-gradient-to-r from-[#9333EA] to-[#7e22ce]';
  const buttonBg = isBlueTheme ? 'bg-tag-blue' : 'bg-tag-purple';
  const buttonHover = isBlueTheme ? 'hover:bg-blue-700' : 'hover:bg-purple-700';
  const buttonBorder = isBlueTheme ? 'border-tag-blue' : 'border-tag-purple';
  const buttonText = isBlueTheme ? 'text-tag-blue' : 'text-tag-purple';
  const buttonHoverBg = isBlueTheme ? 'hover:bg-blue-50' : 'hover:bg-purple-50';

  return (
    <div className='fixed inset-0 bg-gray-50 z-50 overflow-y-auto'>
      {/* 顶部横幅 - 根据模块使用不同颜色 */}
      <div
        className={`${bannerGradient} h-48 flex flex-col items-center justify-center text-white`}
      >
        <div className='text-4xl mb-4'>{config.icon}</div>
        <h1 className='text-2xl font-bold mb-2'>{config.bannerTitle}</h1>
        <p className='text-white/90 text-center max-w-md'>
          {config.bannerSubtitle}
        </p>
      </div>

      {/* 成功提示卡片 */}
      <div className='max-w-md mx-auto -mt-8 relative z-10'>
        <div className='bg-[#ECFDF5] rounded-lg shadow-lg p-6 border border-green-200'>
          <div className='flex items-start space-x-4'>
            {/* 成功图标 */}
            <div className='flex-shrink-0'>
              <div className='w-10 h-10 bg-green-500 rounded-full flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
            </div>

            {/* 成功信息 */}
            <div className='flex-1'>
              <h2 className='text-lg font-bold text-green-800 mb-2'>
                {config.successTitle}
              </h2>
              <p className='text-green-700 text-sm leading-relaxed'>
                {config.successSubtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className='max-w-md mx-auto mt-8 px-4 pb-8'>
        <div className='space-y-4'>
          {/* 查看Feed按钮 */}
          <button
            onClick={handleViewFeed}
            className={`w-full ${buttonBg} text-white font-semibold py-3 rounded-lg ${buttonHover} transition-colors duration-200 flex items-center justify-center`}
          >
            <svg
              className='w-5 h-5 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
              />
            </svg>
            View {module} Feed
          </button>

          {/* 继续上传按钮 */}
          <button
            onClick={handleUploadMore}
            className={`w-full bg-white ${buttonText} font-semibold py-3 rounded-lg border-2 ${buttonBorder} ${buttonHoverBg} transition-colors duration-200 flex items-center justify-center`}
          >
            <svg
              className='w-5 h-5 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 6v6m0 0v6m0-6h6m-6 0H6'
              />
            </svg>
            Upload More Content
          </button>
        </div>

        {/* 返回首页链接 */}
        <div className='text-center mt-6'>
          <Link
            to='/'
            className='text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200'
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UploadSuccess;

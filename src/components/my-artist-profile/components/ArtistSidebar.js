// artist-sidebar v1: 艺术家侧边栏组件
// 从 MyArtistProfile.js 中提取的侧边栏区域

import React from 'react';

// 验证 URL 是否安全
const isValidUrl = url => {
  if (!url || !url.trim()) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// 处理社交链接点击
const handleSocialLinkClick = (platform, url) => {
  if (!isValidUrl(url)) {
    console.warn(`Invalid ${platform} URL:`, url);
    return;
  }

  // 在新标签页中打开链接
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * ArtistSidebar 组件 - 艺术家档案页面侧边栏
 * @param {Object} props - 组件属性
 * @param {Object} props.artist - 艺术家数据
 * @returns {JSX.Element} 侧边栏组件
 */
const ArtistSidebar = ({ artist }) => {
  if (!artist) {
    return null;
  }

  return (
    <div className='lg:w-80 flex-shrink-0'>
      <div className='pb-8'>
        {/* Personal Details Section */}
        <div className='mb-6'>
          {artist.school && (
            <div className='mb-3'>
              <span className='text-sm font-medium text-gray-700'>School:</span>
              <p className='text-gray-600 mt-1'>{artist.school}</p>
            </div>
          )}

          {artist.pronouns && (
            <div className='mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Pronouns:
              </span>
              <p className='text-gray-600 mt-1'>{artist.pronouns}</p>
            </div>
          )}

          {((artist.majors && artist.majors.length > 0) ||
            (artist.minors && artist.minors.length > 0)) && (
            <div className='mb-3'>
              <span className='text-sm font-medium text-gray-700'>
                Major & Minor:
              </span>
              <div className='flex flex-wrap gap-1 mt-1'>
                {artist.majors?.map((major, index) => (
                  <span
                    key={`major-${index}`}
                    className='bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full'
                  >
                    {major}
                  </span>
                ))}
                {artist.minors?.map((minor, index) => (
                  <span
                    key={`minor-${index}`}
                    className='bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full'
                  >
                    {minor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* About Section */}
        <h3 className='text-lg font-bold text-gray-900 mb-3'>About</h3>
        <p className='text-gray-600 mb-4'>{artist.bio}</p>

        <h4 className='font-bold text-gray-900 mb-2'>Skills</h4>
        <div className='flex flex-wrap gap-2 mb-6'>
          {artist.skills.map((skill, index) => (
            <span
              key={index}
              className='bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full'
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Connect Section */}
        <h3 className='text-lg font-bold text-gray-900 mb-3'>Connect</h3>
        <div className='flex gap-3'>
          {isValidUrl(artist.socialLinks.discord) && (
            <button
              onClick={() =>
                handleSocialLinkClick('discord', artist.socialLinks.discord)
              }
              className='text-gray-600 hover:text-gray-900 transition-colors duration-200'
              title='Discord'
            >
              <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z' />
              </svg>
            </button>
          )}
          {isValidUrl(artist.socialLinks.instagram) && (
            <button
              onClick={() =>
                handleSocialLinkClick('instagram', artist.socialLinks.instagram)
              }
              className='text-gray-600 hover:text-gray-900 transition-colors duration-200'
              title='Instagram'
            >
              <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
              </svg>
            </button>
          )}
          {isValidUrl(artist.socialLinks.portfolio) && (
            <button
              onClick={() =>
                handleSocialLinkClick('portfolio', artist.socialLinks.portfolio)
              }
              className='text-gray-600 hover:text-gray-900 transition-colors duration-200'
              title='Portfolio'
            >
              <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' />
              </svg>
            </button>
          )}
        </div>

        {/* Other Websites Section */}
        {artist.socialLinks.otherLinks &&
          artist.socialLinks.otherLinks.length > 0 && (
            <div className='mt-4'>
              <h4 className='font-bold text-gray-900 mb-2'>Other Websites</h4>
              <div className='space-y-2'>
                {artist.socialLinks.otherLinks.map(link => (
                  <div key={link.id} className='flex items-center gap-2'>
                    <div className='flex-shrink-0'>
                      <svg
                        className='w-4 h-4 text-gray-600'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' />
                      </svg>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='text-sm font-medium text-gray-900'>
                        {link.label}
                      </div>
                      <a
                        href={link.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200'
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ArtistSidebar;

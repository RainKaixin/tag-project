// work-image-gallery v1: 作品图片画廊组件

import React, { useState, useEffect } from 'react';

import { getPortfolioImageUrl } from '../../../services/supabase/portfolio';

import ImageViewer from './ImageViewer';

/**
 * 作品图片画廊组件
 * @param {Array} images - 图片URL数组或图片路径数组
 * @param {string} workTitle - 作品标题
 * @param {string} className - 额外的CSS类名
 */
const WorkImageGallery = ({
  images = [],
  workTitle = 'Work',
  className = '',
}) => {
  // 图片查看器状态
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  // 获取图片URL
  useEffect(() => {
    const loadImageUrls = async () => {
      if (!images || images.length === 0) {
        setImageUrls([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const urls = [];

        console.log('[WorkImageGallery] Processing images:', images);

        for (const image of images) {
          if (typeof image === 'string') {
            // 如果已经是完整的 URL，直接使用
            if (
              image.startsWith('data:image/') ||
              image.startsWith('blob:') ||
              image.startsWith('http')
            ) {
              if (image !== '/assets/placeholder.svg' && image.trim() !== '') {
                console.log(
                  '[WorkImageGallery] Using direct URL:',
                  image.substring(0, 50) + '...'
                );
                urls.push(image);
              } else {
                console.log(
                  '[WorkImageGallery] Skipping placeholder path:',
                  image
                );
              }
            } else {
              // 如果是文件路径，需要转换为 URL
              console.log(
                '[WorkImageGallery] Converting file path to URL:',
                image
              );
              try {
                const result = await getPortfolioImageUrl(image);
                console.log(
                  '[WorkImageGallery] getPortfolioImageUrl result:',
                  result
                );

                if (result.success && result.data?.url) {
                  console.log(
                    '[WorkImageGallery] Successfully converted path to URL:',
                    result.data.url.substring(0, 50) + '...'
                  );
                  urls.push(result.data.url);
                } else {
                  console.warn(
                    '[WorkImageGallery] Failed to convert path to URL:',
                    image,
                    result.error
                  );
                  // 如果转换失败，尝试检查 IndexedDB 中是否有这个路径的数据
                  console.log(
                    '[WorkImageGallery] Checking if image exists in IndexedDB...'
                  );
                }
              } catch (conversionError) {
                console.error(
                  '[WorkImageGallery] Error converting path to URL:',
                  image,
                  conversionError
                );
              }
            }
          } else {
            console.log(
              `[WorkImageGallery] Skipping non-string: ${typeof image} - ${image}`
            );
          }
        }

        console.log(
          `[WorkImageGallery] Final URLs count: ${urls.length}`,
          urls.map(url => url?.substring(0, 30) + '...')
        );

        setImageUrls(urls);
      } catch (error) {
        console.error('Error loading image URLs:', error);
        setImageUrls([]);
      } finally {
        setLoading(false);
      }
    };

    loadImageUrls();
  }, [images]);

  // 处理图片点击
  const handleImageClick = index => {
    setCurrentImageIndex(index);
    setIsImageViewerOpen(true);
  };

  // 关闭图片查看器
  const handleCloseImageViewer = () => {
    setIsImageViewerOpen(false);
  };

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div className={`${className}`}>
        <div className='relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center'>
          <div className='text-center text-gray-500'>
            <svg
              className='w-8 h-8 mx-auto mb-2 animate-spin'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
            <p>Loading images...</p>
          </div>
        </div>
      </div>
    );
  }

  // 如果没有图片，显示占位符
  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className={`${className}`}>
        <div className='relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center'>
          <div className='text-center text-gray-500'>
            <svg
              className='w-16 h-16 mx-auto mb-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
            <p>No images available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* 图片画廊 */}
      <div className='space-y-4'>
        {imageUrls.map((imageUrl, index) => (
          <div key={index} className='relative'>
            <div className='relative aspect-square bg-white rounded-lg shadow-sm overflow-hidden'>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`${workTitle} - ${index + 1}`}
                  className='w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity duration-200'
                  onClick={() => handleImageClick(index)}
                />
              ) : (
                <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                  <div className='text-center text-gray-500'>
                    <svg
                      className='w-12 h-12 mx-auto mb-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1}
                        d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                    <p className='text-sm'>Image not found</p>
                  </div>
                </div>
              )}

              {/* 图片序号指示器 */}
              {imageUrls.length > 1 && (
                <div className='absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm'>
                  {index + 1} / {imageUrls.length}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 图片查看器模态框 */}
      {isImageViewerOpen && imageUrls[currentImageIndex] && (
        <ImageViewer
          imageUrl={imageUrls[currentImageIndex]}
          imageAlt={`${workTitle} - ${currentImageIndex + 1}`}
          isOpen={isImageViewerOpen}
          onClose={handleCloseImageViewer}
        />
      )}
    </div>
  );
};

export default WorkImageGallery;

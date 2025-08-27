import React, { useState, useEffect } from 'react';

import imageStorage from '../../../utils/indexedDB.js';

/**
 * Collaboration 圖片組件
 * 使用與 Works 相同的 imageStorage 方法
 */
const CollaborationImage = ({
  imageKey,
  alt = 'Collaboration image',
  className = 'w-full h-56 object-cover',
  fallbackClassName = 'w-full h-56 bg-gray-200 flex items-center justify-center',
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      if (!imageKey) {
        setImageUrl(null);
        return;
      }

      // 如果已經是完整的 URL（blob:, data:, http:），直接使用
      if (
        imageKey.startsWith('blob:') ||
        imageKey.startsWith('data:') ||
        imageKey.startsWith('http')
      ) {
        // 對於 blob URL，直接使用
        if (imageKey.startsWith('blob:')) {
          setImageUrl(imageKey);
          return;
        }
        setImageUrl(imageKey);
        return;
      }

      // 如果是 IndexedDB 存儲的 key，從 IndexedDB 獲取
      if (imageKey.startsWith('collaboration_')) {
        setLoading(true);
        setError(false);

        try {
          const url = await imageStorage.getImageUrl(imageKey);
          setImageUrl(url);
        } catch (err) {
          console.warn(
            `[CollaborationImage] Failed to load image: ${imageKey}`,
            err
          );
          setError(true);
        } finally {
          setLoading(false);
        }
      } else {
        // 其他情況，直接使用
        setImageUrl(imageKey);
      }
    };

    loadImage();
  }, [imageKey]);

  // 加載中狀態
  if (loading) {
    return (
      <div className={fallbackClassName}>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600'></div>
      </div>
    );
  }

  // 錯誤狀態或無圖片
  if (error || !imageUrl) {
    return (
      <div className={fallbackClassName}>
        <svg
          className='w-12 h-12 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
          />
        </svg>
      </div>
    );
  }

  // 正常顯示圖片
  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={e => {
        console.warn(`[CollaborationImage] Image failed to load: ${imageUrl}`);
        e.target.style.display = 'none';
        // 防止無限循環：只在還沒有設置錯誤狀態時才設置
        if (!error) {
          setError(true);
        }
      }}
    />
  );
};

export default CollaborationImage;

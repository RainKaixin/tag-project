import React, { useState, useEffect } from 'react';

import imageStorage from '../../../utils/indexedDB.js';

/**
 * Collaboration 詳情頁頭部圖片組件
 * 使用與 Works 相同的 imageStorage 方法
 */
const CollaborationHeaderImage = ({
  imageKey,
  alt = 'Collaboration hero image',
  className = 'w-full h-full object-cover',
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      if (!imageKey) {
        setImageUrl(null);
        setError(false);
        return;
      }

      // 重置狀態
      setLoading(true);
      setError(false);

      try {
        console.log(
          `[CollaborationHeaderImage] Loading image for key: ${imageKey}`
        );

        // 統一通過 imageStorage 獲取圖片 URL
        const url = await imageStorage.getImageUrl(imageKey);

        if (url) {
          console.log(
            `[CollaborationHeaderImage] Successfully loaded image: ${url.substring(
              0,
              50
            )}...`
          );
          setImageUrl(url);
        } else {
          console.warn(
            `[CollaborationHeaderImage] No image URL returned for key: ${imageKey}`
          );
          setError(true);
        }
      } catch (err) {
        console.warn(
          `[CollaborationHeaderImage] Failed to load image: ${imageKey}`,
          err
        );
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImage();

    // 清理函數：組件卸載時安全釋放 ObjectURL
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        console.log(
          `[CollaborationHeaderImage] Cleaning up blob URL: ${imageUrl.substring(
            0,
            50
          )}...`
        );
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageKey]);

  // 加載中狀態
  if (loading) {
    return (
      <div className='w-full h-full bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
      </div>
    );
  }

  // 錯誤狀態或無圖片
  if (error || !imageUrl) {
    return (
      <div className='w-full h-full bg-gradient-to-r from-purple-600 to-purple-700'></div>
    );
  }

  // 正常顯示圖片
  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={e => {
        console.warn(
          `[CollaborationHeaderImage] Image failed to load: ${imageUrl.substring(
            0,
            50
          )}...`
        );
        // 僅替換為靜態占位圖，不要 setState 重試
        e.target.style.display = 'none';
      }}
    />
  );
};

export default CollaborationHeaderImage;

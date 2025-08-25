import { useState, useCallback } from 'react';

import { uploadAvatar } from '../services';
import { getCurrentUserId } from '../utils/currentUser';

// 文件验证
const validateImageFile = file => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Please select a valid image file (JPG, PNG, WebP)');
  }

  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB');
  }

  return true;
};

// Canvas导出Data URL
const exportToDataURL = (canvas, quality = 0.85) => {
  // 直接從 Canvas 生成 Data URL，跳過 Blob 步驟以避免生命週期問題
  const dataURL = canvas.toDataURL('image/webp', quality);

  // 調試日誌
  console.log('[exportToDataURL] Canvas dimensions:', {
    width: canvas.width,
    height: canvas.height,
  });
  console.log('[exportToDataURL] Generated dataURL length:', dataURL?.length);
  console.log(
    '[exportToDataURL] Generated dataURL preview:',
    dataURL?.substring(0, 50)
  );

  return dataURL;
};

// 裁剪图片到Canvas
const cropImageToCanvas = (image, crop, pixelCrop, outputSize = 512) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = outputSize;
  canvas.height = outputSize;

  // 直接使用 pixelCrop 的座標，不需要額外的縮放計算
  // pixelCrop 已經包含了正確的像素座標
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  // 調試日誌
  console.log('[cropImageToCanvas] Image dimensions:', {
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
  });
  console.log('[cropImageToCanvas] Pixel crop:', pixelCrop);
  console.log('[cropImageToCanvas] Output size:', outputSize);

  return canvas;
};

export const useAvatarUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  // 处理文件选择
  const handleFileSelect = useCallback(async file => {
    try {
      setError(null);
      validateImageFile(file);

      // 直接將文件轉換為 Data URL 用於預覽，避免 Blob URL 生命週期問題
      const previewUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      console.log(
        '[handleFileSelect] Generated preview URL:',
        previewUrl?.substring(0, 30)
      );

      return { file, previewUrl };
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  // 处理裁剪完成
  const handleCropComplete = useCallback(async (image, crop, pixelCrop) => {
    try {
      setIsUploading(true);
      setUploadProgress(10);

      // 調試日誌
      console.log('[handleCropComplete] Input parameters:', {
        imageNaturalWidth: image.naturalWidth,
        imageNaturalHeight: image.naturalHeight,
        crop,
        pixelCrop,
      });

      // 裁剪到Canvas
      const canvas = cropImageToCanvas(image, crop, pixelCrop, 512);
      setUploadProgress(30);

      // 导出Data URL
      const dataURL = exportToDataURL(canvas, 0.85);
      setUploadProgress(50);

      // 调试日志
      console.log(
        '[useAvatarUpload] Generated dataURL:',
        dataURL?.substring(0, 30)
      );

      // 调用上传服务
      const userId = getCurrentUserId();
      setUploadProgress(80);

      const result = await uploadAvatar(dataURL, userId);

      // 确保上传到100%
      setUploadProgress(100);

      // 添加小延迟确保用户看到100%
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log(
        '[useAvatarUpload] Upload successful, returning:',
        result.data
      );
      return result.data;
    } catch (err) {
      console.error('[useAvatarUpload] Upload failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  // 清理资源
  const cleanup = useCallback(previewUrl => {
    // 由於現在使用 Data URL，不需要清理 Blob URL
    // Data URL 會自動被垃圾回收
    console.log('[cleanup] Data URL cleanup completed');
  }, []);

  return {
    isUploading,
    uploadProgress,
    error,
    handleFileSelect,
    handleCropComplete,
    cleanup,
  };
};

import { useCallback, useRef } from 'react';

import { useAvatarUpload } from '../../../hooks/useAvatarUpload';
import { CROP_CONFIG } from '../utils/constants';

export const useAvatarCropActions = (
  state,
  setters,
  onClose,
  onAvatarUpdate
) => {
  const { selectedImage, previewUrl, croppedAreaPixels, crop } = state;

  const {
    setSelectedImage,
    setPreviewUrl,
    setCrop,
    setZoom,
    setCroppedAreaPixels,
    setUploadCompleted,
    resetState,
  } = setters;

  const fileInputRef = useRef(null);

  const {
    isUploading,
    uploadProgress,
    error,
    handleFileSelect,
    handleCropComplete,
    cleanup,
  } = useAvatarUpload();

  // Handle file selection
  const handleFileChange = useCallback(
    async event => {
      const file = event.target.files?.[0];
      if (!file) return;

      const result = await handleFileSelect(file);
      if (result) {
        setSelectedImage(result.file);
        setPreviewUrl(result.previewUrl);
        setCrop({ x: 0, y: 0 });
        setZoom(CROP_CONFIG.DEFAULT_ZOOM);
      }
    },
    [handleFileSelect, setSelectedImage, setPreviewUrl, setCrop, setZoom]
  );

  // Handle crop area change
  const onCropComplete = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [setCroppedAreaPixels]
  );

  // Handle confirm crop
  const handleConfirmCrop = useCallback(async () => {
    console.log('[AvatarCropModal] handleConfirmCrop called');
    console.log('[AvatarCropModal] selectedImage:', !!selectedImage);
    console.log('[AvatarCropModal] croppedAreaPixels:', !!croppedAreaPixels);

    if (!selectedImage || !croppedAreaPixels) {
      console.error('[AvatarCropModal] Missing required data for crop');
      return;
    }

    try {
      // Create Image object to get image data
      const img = new Image();
      img.src = previewUrl;
      await new Promise(resolve => {
        img.onload = resolve;
      });

      console.log('[AvatarCropModal] Image loaded, calling handleCropComplete');
      const result = await handleCropComplete(img, crop, croppedAreaPixels);

      console.log('[AvatarCropModal] Crop result:', result);

      // Validate avatarUrl format (accept both data URLs and HTTP URLs)
      if (
        !result.avatarUrl ||
        (!result.avatarUrl.startsWith('data:image/') &&
          !result.avatarUrl.startsWith('http'))
      ) {
        console.error(
          '[AvatarCropModal] Invalid avatarUrl format:',
          result.avatarUrl
        );
        throw new Error('Invalid avatar URL format');
      }

      console.log(
        '[AvatarCropModal] Calling onAvatarUpdate with:',
        result.avatarUrl?.substring(0, 30)
      );
      // Update avatar
      onAvatarUpdate(result.avatarUrl, result.avatarUpdatedAt);

      // Cleanup resources
      cleanup(previewUrl);

      // Set upload completed state
      setUploadCompleted(true);
    } catch (err) {
      console.error('Crop failed:', err);
    }
  }, [
    selectedImage,
    croppedAreaPixels,
    crop,
    handleCropComplete,
    onAvatarUpdate,
    cleanup,
    previewUrl,
    setUploadCompleted,
  ]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    cleanup(previewUrl);
    resetState();
    onClose();
  }, [cleanup, previewUrl, resetState, onClose]);

  // Handle complete
  const handleComplete = useCallback(() => {
    setUploadCompleted(false);
    onClose();
  }, [setUploadCompleted, onClose]);

  // Handle upload click
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    // Refs
    fileInputRef,

    // Upload state
    isUploading,
    uploadProgress,
    error,

    // Event handlers
    handleFileChange,
    onCropComplete,
    handleConfirmCrop,
    handleCancel,
    handleComplete,
    handleUploadClick,
  };
};

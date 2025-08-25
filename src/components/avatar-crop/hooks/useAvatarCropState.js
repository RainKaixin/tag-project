import { useState, useEffect } from 'react';

import { CROP_CONFIG } from '../utils/constants';

export const useAvatarCropState = isOpen => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(CROP_CONFIG.DEFAULT_ZOOM);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadCompleted, setUploadCompleted] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCrop({ x: 0, y: 0 });
      setZoom(CROP_CONFIG.DEFAULT_ZOOM);
      setCroppedAreaPixels(null);
      setSelectedImage(null);
      setPreviewUrl(null);
      setUploadCompleted(false);
    }
  }, [isOpen]);

  const resetState = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(CROP_CONFIG.DEFAULT_ZOOM);
    setCroppedAreaPixels(null);
    setSelectedImage(null);
    setPreviewUrl(null);
    setUploadCompleted(false);
  };

  return {
    // State
    crop,
    zoom,
    croppedAreaPixels,
    selectedImage,
    previewUrl,
    uploadCompleted,

    // Setters
    setCrop,
    setZoom,
    setCroppedAreaPixels,
    setSelectedImage,
    setPreviewUrl,
    setUploadCompleted,

    // Actions
    resetState,
  };
};

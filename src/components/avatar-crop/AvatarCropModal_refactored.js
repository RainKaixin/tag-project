/* eslint-disable import/order */
import React from 'react';

import {
  ModalHeader,
  FileSelectionView,
  CropView,
  SuccessView,
} from './components';

import { useAvatarCropState, useAvatarCropActions } from './hooks';
/* eslint-enable import/order */

const AvatarCropModal = ({
  isOpen,
  onClose,
  onAvatarUpdate,
  currentAvatar,
}) => {
  // State management
  const state = useAvatarCropState(isOpen);
  const {
    crop,
    zoom,
    croppedAreaPixels,
    selectedImage,
    previewUrl,
    uploadCompleted,
    setCrop,
    setZoom,
  } = state;

  // Actions
  const actions = useAvatarCropActions(state, state, onClose, onAvatarUpdate);
  const {
    fileInputRef,
    isUploading,
    uploadProgress,
    error,
    handleFileChange,
    onCropComplete,
    handleConfirmCrop,
    handleCancel,
    handleComplete,
    handleUploadClick,
  } = actions;

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
        <ModalHeader onCancel={handleCancel} error={error} />

        {uploadCompleted ? (
          <SuccessView onComplete={handleComplete} />
        ) : !selectedImage ? (
          <FileSelectionView
            currentAvatar={currentAvatar}
            onUploadClick={handleUploadClick}
            onFileChange={handleFileChange}
            fileInputRef={fileInputRef}
          />
        ) : (
          <CropView
            previewUrl={previewUrl}
            crop={crop}
            zoom={zoom}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            croppedAreaPixels={croppedAreaPixels}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            onCancel={handleCancel}
            onConfirmCrop={handleConfirmCrop}
          />
        )}
      </div>
    </div>
  );
};

export default AvatarCropModal;

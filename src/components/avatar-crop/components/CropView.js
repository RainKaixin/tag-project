import React from 'react';
import Cropper from 'react-easy-crop';

import { CROP_CONFIG, UI_TEXTS, STYLES } from '../utils/constants';

const CropView = ({
  previewUrl,
  crop,
  zoom,
  isUploading,
  uploadProgress,
  croppedAreaPixels,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onCancel,
  onConfirmCrop,
}) => {
  return (
    <div>
      <div className='mb-4'>
        <div className='relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden'>
          <Cropper
            image={previewUrl}
            crop={crop}
            zoom={zoom}
            aspect={CROP_CONFIG.ASPECT_RATIO}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
            showGrid={false}
            objectFit='contain'
            minZoom={CROP_CONFIG.MIN_ZOOM}
            maxZoom={CROP_CONFIG.MAX_ZOOM}
            wheelZoomRatio={CROP_CONFIG.WHEEL_ZOOM_RATIO}
            style={STYLES.CROPPER}
          />
        </div>
      </div>

      {/* Zoom Control */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {UI_TEXTS.ZOOM_LABEL}
        </label>
        <input
          type='range'
          min={CROP_CONFIG.MIN_ZOOM}
          max={CROP_CONFIG.MAX_ZOOM}
          step={CROP_CONFIG.STEP_ZOOM}
          value={zoom}
          onChange={e => onZoomChange(Number(e.target.value))}
          className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
        />
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className='mb-4'>
          <div className='flex items-center justify-between text-sm text-gray-600 mb-1'>
            <span>{UI_TEXTS.UPLOADING}</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-purple-600 h-2 rounded-full transition-all duration-300'
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className='flex gap-3'>
        <button
          onClick={onCancel}
          disabled={isUploading}
          className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50'
        >
          {UI_TEXTS.CANCEL}
        </button>
        <button
          onClick={onConfirmCrop}
          disabled={isUploading || !croppedAreaPixels}
          className='flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50'
        >
          {isUploading ? UI_TEXTS.UPLOADING : UI_TEXTS.SAVE}
        </button>
      </div>
    </div>
  );
};

export default CropView;

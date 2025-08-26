// Avatar Crop Modal Constants
export const CROP_CONFIG = {
  DEFAULT_ZOOM: 1.375,
  MIN_ZOOM: 0.5,
  MAX_ZOOM: 4,
  STEP_ZOOM: 0.1,
  ASPECT_RATIO: 1,
  OUTPUT_SIZE: 512,
  WHEEL_ZOOM_RATIO: 0.1,
};

export const UI_TEXTS = {
  TITLE: 'Update Profile Photo',
  CHOOSE_PHOTO: 'Choose Photo',
  UPLOAD_SUCCESS: 'Upload Successful!',
  SUCCESS_MESSAGE: 'Your profile photo has been updated.',
  DONE: 'Done',
  CANCEL: 'Cancel',
  SAVE: 'Save',
  UPLOADING: 'Uploading...',
  ZOOM_LABEL: 'Zoom',
  CHOOSE_NEW_PHOTO: 'Choose a new profile photo',
  CURRENT_AVATAR_ALT: 'Current avatar',
};

export const STYLES = {
  CROPPER: {
    containerStyle: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f3f4f6',
    },
    cropAreaStyle: {
      border: '2px solid #8b5cf6',
      borderRadius: '50%',
      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3)',
    },
    mediaStyle: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
  },
};

export const DEFAULT_AVATAR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIzMiIgeT0iMjQiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOEM5Q0E2Ij4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+';

export const FILE_ACCEPT = 'image/jpeg,image/png,image/webp';

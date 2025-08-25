import React from 'react';

import { UI_TEXTS, DEFAULT_AVATAR, FILE_ACCEPT } from '../utils/constants';

const FileSelectionView = ({
  currentAvatar,
  onUploadClick,
  onFileChange,
  fileInputRef,
}) => {
  return (
    <div className='text-center'>
      <div className='mb-4'>
        <img
          src={currentAvatar}
          alt={UI_TEXTS.CURRENT_AVATAR_ALT}
          className='w-24 h-24 rounded-full mx-auto border-2 border-gray-200'
          onError={e => {
            // Use default avatar if current avatar fails to load
            e.target.style.display = 'none';
            e.target.src = DEFAULT_AVATAR;
            e.target.style.display = 'block';
          }}
        />
      </div>
      <p className='text-gray-600 mb-4'>{UI_TEXTS.CHOOSE_NEW_PHOTO}</p>
      <button
        onClick={onUploadClick}
        className='bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors'
      >
        {UI_TEXTS.CHOOSE_PHOTO}
      </button>
      <input
        ref={fileInputRef}
        type='file'
        accept={FILE_ACCEPT}
        onChange={onFileChange}
        className='hidden'
      />
    </div>
  );
};

export default FileSelectionView;

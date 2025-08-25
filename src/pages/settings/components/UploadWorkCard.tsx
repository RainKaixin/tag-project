import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../EditProfile.module.css';
import type { UploadWorkCardProps } from '../types';

const UploadWorkCard: React.FC<UploadWorkCardProps> = () => {
  const navigate = useNavigate();

  // 跳转到上传指南页面
  const handleUploadClick = () => {
    navigate('/upload/guidelines');
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Upload New Work</h3>

      <div
        className={`${styles.uploadArea} ${styles.uploadAreaClickable}`}
        onClick={handleUploadClick}
        style={{ cursor: 'pointer' }}
      >
        <svg
          className={styles.uploadIcon}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
          />
        </svg>
        <p className={styles.uploadText}>Click to upload new work</p>
        <p className={styles.uploadSubtext}>
          You'll be redirected to the upload guidelines
        </p>
        <button
          type='button'
          className={styles.chooseFilesButton}
          onClick={handleUploadClick}
        >
          Upload New Work
        </button>
      </div>

      {/* 公开提示 */}
      <div className={styles.publicNotice}>
        <svg
          className={styles.publicIcon}
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path
            fillRule='evenodd'
            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
            clipRule='evenodd'
          />
        </svg>
        <span>Click to start the upload process</span>
      </div>
    </div>
  );
};

export default UploadWorkCard;

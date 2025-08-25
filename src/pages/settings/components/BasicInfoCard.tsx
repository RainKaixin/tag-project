import React, { useState, useCallback } from 'react';

import styles from '../EditProfile.module.css';
import type { BasicInfoCardProps, BasicInfo } from '../types';

import MajorSelector from './MajorSelector';

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  data,
  onChange,
  onMajorsChange,
  onMinorsChange,
  errors,
}) => {
  const handleChange = (field: keyof BasicInfo, value: string) => {
    onChange(field, value);
  };

  const handleAddMajor = useCallback(
    major => {
      // 检查重复（不区分大小写）
      const normalizedMajor = major.toLowerCase();
      const allMajors = [...(data.majors || []), ...(data.minors || [])];
      const isDuplicate = allMajors.some(
        existing => existing.toLowerCase() === normalizedMajor
      );

      if (isDuplicate) {
        return; // MajorSelector 会显示错误信息
      }

      // 智能添加：如果 majors 少于 3 个，添加到 majors；否则添加到 minors
      const currentMajors = data.majors || [];
      const currentMinors = data.minors || [];

      if (currentMajors.length < 3) {
        // 添加到 majors
        const newMajors = [...currentMajors, major];
        onMajorsChange(newMajors);
      } else if (currentMinors.length < 3) {
        // 添加到 minors
        const newMinors = [...currentMinors, major];
        onMinorsChange(newMinors);
      }
      // 如果都满了，MajorSelector 会处理错误
    },
    [data.majors, data.minors, onMajorsChange, onMinorsChange]
  );

  const handleRemoveMajor = useCallback(
    (majorToRemove: string) => {
      const newMajors = (data.majors || []).filter(
        major => major !== majorToRemove
      );
      onMajorsChange(newMajors);
    },
    [data.majors, onMajorsChange]
  );

  const handleRemoveMinor = useCallback(
    (minorToRemove: string) => {
      const newMinors = (data.minors || []).filter(
        minor => minor !== minorToRemove
      );
      onMinorsChange(newMinors);
    },
    [data.minors, onMinorsChange]
  );

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Basic Information</h3>

      <div className={styles.basicInfoGrid}>
        {/* Full Name */}
        <div className={styles.formField}>
          <label htmlFor='fullName' className={styles.label}>
            Full Name *
          </label>
          <input
            id='fullName'
            type='text'
            value={data.fullName}
            onChange={e => handleChange('fullName', e.target.value)}
            className={`${styles.input} ${
              errors.fullName ? styles.inputError : ''
            }`}
            placeholder='Enter your full name'
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          />
          {errors.fullName && (
            <div id='fullName-error' className={styles.errorMessage}>
              {errors.fullName}
            </div>
          )}
        </div>

        {/* Title */}
        <div className={styles.formField}>
          <label htmlFor='title' className={styles.label}>
            Title
          </label>
          <input
            id='title'
            type='text'
            value={data.title}
            onChange={e => handleChange('title', e.target.value)}
            className={styles.input}
            placeholder='e.g., Visual Designer, UI/UX Designer'
          />
        </div>

        {/* School */}
        <div className={styles.formField}>
          <label htmlFor='school' className={styles.label}>
            School
          </label>
          <input
            id='school'
            type='text'
            value={data.school}
            onChange={e => handleChange('school', e.target.value)}
            className={styles.input}
            placeholder='e.g., Art Institute of Chicago, Parsons School of Design'
          />
        </div>

        {/* Pronouns */}
        <div className={styles.formField}>
          <label htmlFor='pronouns' className={styles.label}>
            Pronouns
          </label>
          <input
            id='pronouns'
            type='text'
            value={data.pronouns}
            onChange={e => handleChange('pronouns', e.target.value)}
            className={styles.input}
            placeholder='e.g., she/her, they/them, he/him'
          />
        </div>

        {/* Majors - 整行 */}
        <div className={styles.fullRow}>
          <label className={styles.label}>Major & Minor</label>
          <div className={styles.majorsContainer}>
            {/* 现有专业标签 */}
            <div className={styles.majorsList}>
              {data.majors?.map((major, index) => (
                <div key={`major-${index}`} className={styles.majorTag}>
                  <span className={styles.majorText}>{major}</span>
                  <button
                    type='button'
                    onClick={() => handleRemoveMajor(major)}
                    className={styles.removeMajorButton}
                    aria-label={`Remove ${major} major`}
                  >
                    <svg
                      className={styles.removeIcon}
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
              ))}
              {data.minors?.map((minor, index) => (
                <div key={`minor-${index}`} className={styles.majorTag}>
                  <span className={styles.majorText}>{minor}</span>
                  <button
                    type='button'
                    onClick={() => handleRemoveMinor(minor)}
                    className={styles.removeMajorButton}
                    aria-label={`Remove ${minor} minor`}
                  >
                    <svg
                      className={styles.removeIcon}
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* 添加专业输入 */}
            <div className={styles.addMajorContainer}>
              <MajorSelector onAddMajor={handleAddMajor} disabled={false} />
            </div>
          </div>
        </div>

        {/* About - 整行 */}
        <div className={styles.fullRow}>
          <label htmlFor='bio' className={styles.label}>
            About
          </label>
          <textarea
            id='bio'
            value={data.bio}
            onChange={e => handleChange('bio', e.target.value)}
            className={`${styles.bioTextarea} ${
              errors.bio ? styles.inputError : ''
            }`}
            placeholder='Tell us about yourself...'
            rows={4}
            maxLength={280}
            aria-describedby={errors.bio ? 'bio-error' : 'bio-counter'}
          />
          <div className={styles.bioFooter}>
            <div
              id='bio-counter'
              className={`${styles.charCount} ${
                data.bio.length > 250 ? styles.charCountWarning : ''
              }`}
            >
              {data.bio.length}/280
            </div>
            {errors.bio && (
              <div id='bio-error' className={styles.errorMessage}>
                {errors.bio}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoCard;

import React, { useState, useCallback } from 'react';

import styles from '../EditProfile.module.css';
import type { SkillsCardProps } from '../types';

const SkillsCard: React.FC<SkillsCardProps> = ({ skills, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleAddSkill = useCallback(() => {
    const skill = inputValue.trim();

    // 验证输入
    if (!skill) {
      setError('Please enter a skill');
      return;
    }

    if (skill.length > 20) {
      setError('Skill name must be 20 characters or less');
      return;
    }

    if (skill.length < 2) {
      setError('Skill name must be at least 2 characters');
      return;
    }

    // 检查重复（不区分大小写）
    const normalizedSkill = skill.toLowerCase();
    const isDuplicate = skills.some(
      existingSkill => existingSkill.toLowerCase() === normalizedSkill
    );

    if (isDuplicate) {
      setError('This skill already exists');
      return;
    }

    // 检查数量限制
    if (skills.length >= 12) {
      setError('Maximum 12 skills allowed');
      return;
    }

    // 添加技能
    const newSkills = [...skills, skill];
    onChange(newSkills);
    setInputValue('');
    setError('');
  }, [inputValue, skills, onChange]);

  const handleRemoveSkill = useCallback(
    (skillToRemove: string) => {
      const newSkills = skills.filter(skill => skill !== skillToRemove);
      onChange(newSkills);
    },
    [skills, onChange]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddSkill();
      }
    },
    [handleAddSkill]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (error) {
        setError('');
      }
    },
    [error]
  );

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Skills</h3>

      <div className={styles.skillsContainer}>
        {/* 现有技能标签 */}
        <div className={styles.skillsList}>
          {skills.map((skill, index) => (
            <div key={index} className={styles.skillTag}>
              <span className={styles.skillText}>{skill}</span>
              <button
                type='button'
                onClick={() => handleRemoveSkill(skill)}
                className={styles.removeSkillButton}
                aria-label={`Remove ${skill} skill`}
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

        {/* 添加技能输入 */}
        <div className={styles.addSkillContainer}>
          <div className={styles.addSkillInputGroup}>
            <input
              type='text'
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={`${styles.addSkillInput} ${
                error ? styles.inputError : ''
              }`}
              placeholder='Add a skill...'
              maxLength={20}
              aria-describedby={error ? 'skill-error' : 'skill-help'}
            />
            <button
              type='button'
              onClick={handleAddSkill}
              className={styles.addSkillButton}
              disabled={!inputValue.trim() || skills.length >= 12}
              aria-label='Add skill'
            >
              <svg
                className={styles.addIcon}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                />
              </svg>
            </button>
          </div>

          {error && (
            <div id='skill-error' className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div id='skill-help' className={styles.helpText}>
            Press Enter or click + to add. Maximum 12 skills.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsCard;

import React, { useState, useCallback } from 'react';

import styles from './SaveButton.module.css';

/**
 * 统一的Save按钮组件
 * 支持收藏/取消收藏状态切换，包含乐观更新和无障碍支持
 *
 * @param {Object} props
 * @param {boolean} props.isFavorited - 是否已收藏
 * @param {string} props.itemType - 项目类型 ('work' | 'collaboration')
 * @param {string} props.itemId - 项目ID
 * @param {Function} props.onToggle - 切换收藏状态的回调函数
 * @param {string} props.className - 额外的CSS类名
 * @param {boolean} props.disabled - 是否禁用
 * @param {string} props.size - 按钮大小 ('sm' | 'md' | 'lg')
 */
export function SaveButton(props) {
  const {
    isFavorited = false,
    itemType,
    itemId,
    onToggle,
    className = '',
    disabled = false,
    size = 'md',
  } = props;

  const [isOptimistic, setIsOptimistic] = useState(false);
  const [optimisticState, setOptimisticState] = useState(null);

  // 当前显示的状态（乐观更新优先）
  const currentState = isOptimistic ? optimisticState : isFavorited;

  // 处理点击事件
  const handleClick = useCallback(async () => {
    if (disabled) return;

    // 乐观更新：立即切换状态
    setIsOptimistic(true);
    setOptimisticState(!currentState);

    try {
      // 调用父组件的切换函数
      await onToggle(itemType, itemId, !currentState);

      // 成功：清除乐观状态
      setIsOptimistic(false);
      setOptimisticState(null);
    } catch (error) {
      // 失败：回滚到原始状态
      setIsOptimistic(false);
      setOptimisticState(null);
      console.error('Save toggle failed:', error);
    }
  }, [disabled, currentState, onToggle, itemType, itemId]);

  // 处理键盘事件
  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  // 按钮样式类
  const buttonClass = `
    ${styles.saveButton}
    ${styles[size]}
    ${
      currentState
        ? itemType === 'work'
          ? styles.favoritedWork
          : styles.favoritedCollab
        : styles.unfavorited
    }
    ${disabled ? styles.disabled : ''}
    ${className}
  `.trim();

  // 图标样式类
  const iconClass = `
    ${styles.icon}
    ${currentState ? styles.filled : styles.outlined}
  `.trim();

  return (
    <button
      type='button'
      className={buttonClass}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-pressed={currentState}
      aria-label={currentState ? 'Remove from favorites' : 'Add to favorites'}
      title={currentState ? 'Remove from favorites' : 'Add to favorites'}
    >
      {/* 收藏图标 */}
      <svg
        className={iconClass}
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        aria-hidden='true'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
        />
      </svg>

      {/* 按钮文案 */}
      <span className={styles.text}>{currentState ? 'Saved' : 'Save'}</span>
    </button>
  );
}

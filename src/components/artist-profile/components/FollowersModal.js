// followers-modal v1: 关注者列表弹窗

import React, { useEffect } from 'react';

import { BaseModal } from '../../ui';

import FollowList from './FollowList';

/**
 * 关注者列表弹窗
 * @param {boolean} isOpen - 是否打开
 * @param {Function} onClose - 关闭回调
 * @param {string} artistId - 艺术家ID
 * @param {boolean} isOwnProfile - 是否为查看自己的档案
 * @param {string} currentUserId - 当前用户ID
 */
const FollowersModal = ({
  isOpen,
  onClose,
  artistId,
  isOwnProfile = false,
  currentUserId = 'alice',
}) => {
  // ESC 关闭
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title='Followers'
      maxWidth='max-w-3xl'
    >
      <div className='h-96'>
        <FollowList
          type='followers'
          targetId={artistId}
          onClose={onClose}
          isOwnProfile={isOwnProfile}
          currentUserId={currentUserId}
        />
      </div>
    </BaseModal>
  );
};

export default FollowersModal;

import React, { useState, useCallback, useEffect } from 'react';

import AvatarCropModal from '../../../components/avatar-crop/AvatarCropModal_refactored';
import { getAvatarUrlWithCacheBust } from '../../../services';
import { updateCurrentUserAvatar } from '../../../services/avatarService';
import { clearAvatarCache } from '../../../utils/avatarCache';
import styles from '../EditProfile.module.css';
import type { ProfilePhotoCardProps } from '../types';

const ProfilePhotoCard: React.FC<ProfilePhotoCardProps> = ({
  avatar,
  onAvatarChange,
}) => {
  const [showCropModal, setShowCropModal] = useState(false);
  const [avatarUpdatedAt, setAvatarUpdatedAt] = useState<string | null>(null);
  const [localAvatar, setLocalAvatar] = useState<string | null>(avatar);

  // 监听 avatar prop 的变化
  useEffect(() => {
    if (avatar && avatar !== localAvatar) {
      console.log(
        '[ProfilePhotoCard] Avatar prop changed:',
        avatar?.substring(0, 30)
      );
      setLocalAvatar(avatar);
    }
  }, [avatar, localAvatar]);

  // 初始化時從 localStorage 獲取頭像
  useEffect(() => {
    if (!localAvatar && typeof window !== 'undefined') {
      try {
        const avatarData = window.localStorage.getItem('tag.avatars.alice');
        if (avatarData) {
          const parsedData = JSON.parse(avatarData);
          if (parsedData && parsedData.avatarUrl) {
            console.log(
              '[ProfilePhotoCard] Initialized from localStorage:',
              parsedData.avatarUrl?.substring(0, 30)
            );
            setLocalAvatar(parsedData.avatarUrl);
          }
        }
      } catch (error) {
        console.warn(
          '[ProfilePhotoCard] Failed to read avatar from localStorage:',
          error
        );
      }
    }
  }, []);

  // 默认头像 SVG
  const DEFAULT_AVATAR =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIzMiIgeT0iMjQiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOEM5Q0E2Ij4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+';

  const avatarUrl = localAvatar
    ? getAvatarUrlWithCacheBust(localAvatar, avatarUpdatedAt)
    : null;

  // 调试日志 - 已注释以避免控制台刷屏
  // console.log('[ProfilePhotoCard] Input avatar:', avatar?.substring(0, 30));
  // console.log(
  //   '[ProfilePhotoCard] Local avatar:',
  //   localAvatar?.substring(0, 30)
  // );
  // console.log(
  //   '[ProfilePhotoCard] Computed avatarUrl:',
  //   avatarUrl?.substring(0, 30)
  // );

  // 处理头像更新
  const handleAvatarUpdate = useCallback(
    async (newAvatarUrl: string, newAvatarUpdatedAt: string) => {
      // 调试日志
      console.log(
        '[ProfilePhotoCard] Received new avatar URL:',
        newAvatarUrl?.substring(0, 30)
      );
      console.log('[ProfilePhotoCard] Avatar URL type:', typeof newAvatarUrl);
      console.log('[ProfilePhotoCard] Full avatar URL:', newAvatarUrl);

      // 驗證新的頭像 URL 格式
      if (!newAvatarUrl || !newAvatarUrl.startsWith('data:image/')) {
        console.error(
          '[ProfilePhotoCard] Invalid avatar URL format:',
          newAvatarUrl
        );
        return;
      }

      // 更新本地状态
      setLocalAvatar(newAvatarUrl);
      setAvatarUpdatedAt(newAvatarUpdatedAt);

      // 传递新的头像URL给父组件
      onAvatarChange(newAvatarUrl);

      // 使用統一的頭像更新服務
      try {
        const success = await updateCurrentUserAvatar(newAvatarUrl);
        if (success) {
          console.log('[ProfilePhotoCard] Successfully updated unified avatar');
        } else {
          console.error('[ProfilePhotoCard] Failed to update unified avatar');
        }
      } catch (error) {
        console.error(
          '[ProfilePhotoCard] Error updating unified avatar:',
          error
        );
      }

      console.log('[onAvatarUpdate] prefix:', newAvatarUrl?.substring(0, 4));
      console.log('[ProfilePhotoCard] Successfully updated avatar');

      // 关闭裁剪模态框
      setShowCropModal(false);
    },
    [onAvatarChange]
  );

  // 处理打开裁剪模态框
  const handleOpenCropModal = useCallback(() => {
    setShowCropModal(true);
  }, []);

  // 处理关闭裁剪模态框
  const handleCloseCropModal = useCallback(() => {
    setShowCropModal(false);
  }, []);

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Profile Photo</h3>

      <div className={styles.avatarSection}>
        <div className={styles.avatarContainer}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt='Profile avatar'
              className={styles.avatar}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = DEFAULT_AVATAR;
              }}
            />
          ) : (
            <img
              src={DEFAULT_AVATAR}
              alt='Default profile avatar'
              className={styles.avatar}
            />
          )}
        </div>

        <div className={styles.avatarActions}>
          <button
            type='button'
            onClick={handleOpenCropModal}
            className={styles.changePhotoButton}
            aria-label='Change profile photo'
          >
            <svg
              className={styles.cameraIcon}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
            Change Photo
          </button>
        </div>
      </div>

      {/* 头像裁剪模态框 */}
      <AvatarCropModal
        isOpen={showCropModal}
        onClose={handleCloseCropModal}
        onAvatarUpdate={handleAvatarUpdate}
        currentAvatar={avatarUrl || DEFAULT_AVATAR}
      />
    </div>
  );
};

export default ProfilePhotoCard;

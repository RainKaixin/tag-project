import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { invalidate } from '../../components/artist-profile/utils/artistHelpers';
import { saveProfile, getProfile } from '../../services';
import { updateCurrentUserAvatar } from '../../services/avatarService';
import {
  getMyPortfolio,
  updatePortfolioItem,
  deletePortfolioItem,
} from '../../services/supabase/portfolio';
import {
  clearAvatarCache,
  checkLocalStorageStatus,
} from '../../utils/avatarCache';
import avatarStorage from '../../utils/avatarStorage';
import { getCurrentUser } from '../../utils/currentUser';

import BasicInfoCard from './components/BasicInfoCard';
import PortfolioGridCard from './components/PortfolioGridCard';
import ProfilePhotoCard from './components/ProfilePhotoCard';
import SkillsCard from './components/SkillsCard';
import SocialLinksCard from './components/SocialLinksCard';
import UploadWorkCard from './components/UploadWorkCard';
import styles from './EditProfile.module.css';
import type { ProfileData, PortfolioItem, BasicInfo, LinkItem } from './types';

// 从当前用户数据获取初始值
const currentUser = getCurrentUser();
const initialProfileData: ProfileData = {
  fullName: currentUser?.name || '',
  title: currentUser?.role || '',
  school: currentUser?.school || '',
  pronouns: currentUser?.pronouns || '',
  majors: currentUser?.majors || [],
  minors: [],
  bio: currentUser?.bio || '',
  avatar: currentUser?.avatar || null,
  socialLinks: {
    instagram: currentUser?.socialLinks?.instagram || '',
    portfolio: currentUser?.socialLinks?.portfolio || '',
    discord: currentUser?.socialLinks?.discord || '',
    otherLinks: currentUser?.socialLinks?.otherLinks || [],
  },
  skills: currentUser?.skills || [],
};

// 移除冗余的初始作品数据，现在使用 Mock API 加载真实数据

const EditProfile = () => {
  const navigate = useNavigate();

  // 使用已经包含头像的初始数据
  const initialDataWithAvatar: ProfileData = {
    ...initialProfileData,
  };

  const [profileData, setProfileData] = useState<ProfileData>({
    ...initialDataWithAvatar,
    socialLinks: {
      ...initialDataWithAvatar.socialLinks,
      otherLinks: [],
    },
  });

  // 加载用户档案数据 - 简化版本
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userId = currentUser?.id || 'alice';
        const result = await getProfile(userId);

        if (result.success && result.data) {
          // 合并新数据，包括 socialLinks 字段
          setProfileData(prev => ({
            ...prev,
            fullName: result.data.fullName,
            title: result.data.title,
            school: result.data.school,
            pronouns: result.data.pronouns,
            majors: result.data.majors,
            minors: result.data.minors || [],
            skills: result.data.skills || [],
            bio: result.data.bio || '',
            avatar: result.data.avatar || prev.avatar, // 加载头像数据
            socialLinks: result.data.socialLinks || prev.socialLinks, // 加载社交链接数据
          }));
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    // 只在组件挂载时加载一次
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser]); // 添加 currentUser 依赖

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // 加载用户作品数据
  const loadUserArtworks = useCallback(async () => {
    console.log('[EditProfile] Loading portfolio from Supabase...');
    try {
      const result = await getMyPortfolio();
      console.log('[EditProfile] Portfolio load result:', result);

      if (result.success) {
        // 转换作品数据格式以匹配 PortfolioItem 类型
        const portfolioData = result.data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '', // 添加 description 字段
          image:
            item.thumbnailPath || (item.imagePaths && item.imagePaths[0]) || '',
          isPublic: item.isPublic, // Mock API 使用 isPublic，不是 is_public
          tags: item.tags || [], // 添加 tags 字段用于软件信息
        }));
        console.log('[EditProfile] Setting portfolio items:', portfolioData);
        setPortfolioItems(portfolioData);
      } else {
        console.log(
          '[EditProfile] Failed to load portfolio, using empty array'
        );
        // 如果加载失败，使用空数组而不是默认数据
        setPortfolioItems([]);
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setPortfolioItems([]);
    }
  }, []);

  // 初始加载作品数据
  useEffect(() => {
    loadUserArtworks();
  }, [loadUserArtworks]);

  // 处理作品删除
  const handleDeleteArtwork = useCallback(
    async (artworkId: string) => {
      try {
        const result = await deletePortfolioItem(artworkId);

        if (result.success) {
          // 删除成功后，重新加载作品列表
          loadUserArtworks();
        } else {
          console.error('Failed to delete portfolio item:', result.error);
        }
      } catch (error) {
        console.error('Error deleting portfolio item:', error);
      }
    },
    [loadUserArtworks]
  );

  // 处理作品公开/私有切换
  const handleToggleArtworkVisibility = useCallback(
    async (artworkId: string, isPublic: boolean) => {
      try {
        const result = await updatePortfolioItem(artworkId, {
          isPublic: !isPublic, // Mock API 使用 isPublic，不是 is_public
        });

        if (result.success) {
          // 更新成功后，重新加载作品列表
          loadUserArtworks();
        } else {
          console.error('Failed to update portfolio visibility:', result.error);
        }
      } catch (error) {
        console.error('Error updating portfolio visibility:', error);
      }
    },
    [loadUserArtworks]
  );

  // 检查表单是否有效
  const isFormValid = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!profileData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (profileData.bio.length > 280) {
      errors.bio = 'Bio must be 280 characters or less';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }, [profileData]);

  // 处理表单数据变化
  const handleProfileChange = useCallback(
    (field: keyof BasicInfo, value: string) => {
      setProfileData(prev => ({
        ...prev,
        [field]: value,
      }));
      setIsDirty(true);
    },
    []
  );

  // URL格式化函数
  const formatUrl = (url: string): string => {
    if (!url.trim()) return url;

    // 如果已经包含协议，直接返回
    if (url.match(/^https?:\/\//i)) {
      return url;
    }

    // 如果以www开头，添加https://
    if (url.match(/^www\./i)) {
      return `https://${url}`;
    }

    // 其他情况，添加https://
    return `https://${url}`;
  };

  // 处理社交链接变化
  const handleSocialLinkChange = useCallback(
    (platform: 'instagram' | 'portfolio' | 'discord', value: string) => {
      // 在保存时格式化URL
      const formattedValue = formatUrl(value);
      setProfileData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: formattedValue,
        },
      }));
      setIsDirty(true);
    },
    []
  );

  // 处理其他网站链接变化
  const handleOtherLinksChange = useCallback((otherLinks: LinkItem[]) => {
    setProfileData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        otherLinks,
      },
    }));
    setIsDirty(true);
  }, []);

  // 处理技能变化
  const handleSkillsChange = useCallback((skills: string[]) => {
    setProfileData(prev => ({
      ...prev,
      skills,
    }));
    setIsDirty(true);
  }, []);

  // 处理专业变化
  const handleMajorsChange = useCallback((majors: string[]) => {
    setProfileData(prev => ({
      ...prev,
      majors,
    }));
    setIsDirty(true);
  }, []);

  // 处理副修变化
  const handleMinorsChange = useCallback((minors: string[]) => {
    setProfileData(prev => ({
      ...prev,
      minors,
    }));
    setIsDirty(true);
  }, []);

  // 处理作品集变化 - 现在直接操作 artworkService
  const handlePortfolioChange = useCallback((items: PortfolioItem[]) => {
    // 这个函数现在主要用于处理删除和可见性切换
    // 实际的删除和更新操作已经在 handleDeleteArtwork 和 handleToggleArtworkVisibility 中处理
    setPortfolioItems(items);
  }, []);

  // 处理取消
  const handleCancel = useCallback(() => {
    setProfileData(initialProfileData);
    // 重新加载 portfolio 数据而不是使用默认数据
    loadUserArtworks();
    setIsDirty(false);
    setValidationErrors({});
  }, [loadUserArtworks]);

  // 处理保存
  const handleSave = useCallback(async () => {
    const validation = isFormValid();
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    try {
      const userId = currentUser?.id || 'alice'; // 当前用户ID

      // 保存用户档案数据
      const result = await saveProfile(userId, {
        fullName: profileData.fullName,
        title: profileData.title,
        school: profileData.school,
        pronouns: profileData.pronouns,
        majors: profileData.majors,
        minors: profileData.minors || [],
        skills: profileData.skills || [],
        bio: profileData.bio || '',
        avatar: profileData.avatar || null, // 添加头像数据
        socialLinks: profileData.socialLinks, // 添加社交链接数据
      });

      if (result.success) {
        console.log('Profile saved successfully:', result.data);

        // 清除艺术家数据缓存，确保下次访问时获取最新数据
        invalidate(['artist', userId]);

        // 如果有頭像更新，使用統一的頭像服務
        if (
          profileData.avatar &&
          profileData.avatar.startsWith('data:image/')
        ) {
          try {
            const success = await updateCurrentUserAvatar(profileData.avatar);
            if (success) {
              console.log('[EditProfile] Successfully updated unified avatar');
            } else {
              console.error('[EditProfile] Failed to update unified avatar');
            }
          } catch (error) {
            console.error(
              '[EditProfile] Error updating unified avatar:',
              error
            );
          }
        }

        setIsDirty(false);
        setShowSuccessMessage(true);

        // 3秒后隐藏成功消息
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        console.error('Failed to save profile:', result.error);
        // 可以在这里添加错误提示
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      // 可以在这里添加错误提示
    }
  }, [profileData, portfolioItems, isFormValid, currentUser]);

  // 处理返回
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // 处理头像变化
  const handleAvatarChange = useCallback((newAvatar: File | string) => {
    // 调试日志
    console.log(
      '[EditProfile] handleAvatarChange called with:',
      typeof newAvatar
    );

    if (typeof newAvatar === 'string') {
      console.log(
        '[EditProfile] Setting new avatar:',
        newAvatar?.substring(0, 30)
      );
      console.log('[EditProfile] Avatar type:', typeof newAvatar);

      setProfileData(prev => ({ ...prev, avatar: newAvatar }));
      setIsDirty(true);
    } else if (newAvatar instanceof File) {
      // 如果是 File 对象，转换为 data URL
      const reader = new FileReader();
      reader.onload = e => {
        const dataUrl = e.target?.result as string;
        console.log(
          '[EditProfile] Converted File to data URL:',
          dataUrl?.substring(0, 30)
        );
        setProfileData(prev => ({ ...prev, avatar: dataUrl }));
        setIsDirty(true);
      };
      reader.readAsDataURL(newAvatar);
    }
  }, []);

  return (
    <div className={styles.container}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            onClick={handleBack}
            className={styles.backButton}
            aria-label='Go back'
          >
            <svg
              className={styles.backIcon}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Back
          </button>
          <h1 className={styles.pageTitle}>Edit Profile</h1>
        </div>

        <div className={styles.headerRight}>
          <button
            onClick={handleCancel}
            className={styles.cancelButton}
            disabled={!isDirty}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={styles.saveButton}
            disabled={!isDirty}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* 成功消息 */}
      {showSuccessMessage && (
        <div className={styles.successMessage}>
          <svg
            className={styles.successIcon}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
              clipRule='evenodd'
            />
          </svg>
          Saved successfully!
        </div>
      )}

      {/* 主内容区域 */}
      <div className={styles.grid}>
        {/* 左列 */}
        <div className={styles.leftCol}>
          <ProfilePhotoCard
            avatar={profileData.avatar}
            onAvatarChange={handleAvatarChange}
          />

          <BasicInfoCard
            data={profileData}
            onChange={handleProfileChange}
            onMajorsChange={handleMajorsChange}
            onMinorsChange={handleMinorsChange}
            errors={validationErrors}
          />

          <SocialLinksCard
            links={profileData.socialLinks}
            onChange={handleSocialLinkChange}
            onOtherLinksChange={handleOtherLinksChange}
          />
        </div>

        {/* 右列 */}
        <div className={styles.rightCol}>
          <SkillsCard
            skills={profileData.skills}
            onChange={handleSkillsChange}
          />

          <UploadWorkCard />

          <PortfolioGridCard
            items={portfolioItems}
            onChange={handlePortfolioChange}
            onDelete={handleDeleteArtwork}
            onToggleVisibility={handleToggleArtworkVisibility}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

// collaboration-service-utils v1: 數據轉換工具函數
// 用於將表單數據轉換為統一的 API 格式，確保數據一致性

import { getCurrentUserId, getCurrentUser } from '../../utils/currentUser';
import { MOCK_USERS } from '../../utils/mockUsers';

/**
 * 將 blob URL 轉換為 Data URL 並存儲到 IndexedDB
 * @param {string} blobUrl - blob URL
 * @param {string} collaborationId - 協作項目ID
 * @returns {Promise<string>} 存儲的 key 或 null
 */
const storeDataUrlToIndexedDB = async (blobUrl, collaborationId) => {
  if (!blobUrl) return null;

  try {
    // 如果已經是 Data URL，直接使用
    if (blobUrl.startsWith('data:')) {
      // 生成唯一的存儲 key
      const imageKey = `collaboration_${collaborationId}_${Date.now()}`;

      try {
        // 嘗試存儲到 IndexedDB
        const { imageStorage } = await import('../../utils/indexedDB.js');
        if (imageStorage && imageStorage.storeImage) {
          await imageStorage.storeImage(imageKey, blobUrl);
          console.log(
            `[Collaboration] Stored Data URL to IndexedDB with key: ${imageKey}`
          );
          return imageKey;
        } else {
          console.warn(
            '[Collaboration] imageStorage not available, using Data URL as fallback'
          );
          return blobUrl;
        }
      } catch (storageError) {
        console.warn(
          '[Collaboration] IndexedDB storage failed, using Data URL as fallback:',
          storageError
        );
        return blobUrl;
      }
    }

    // 如果是 blob URL，轉換為 Data URL
    if (blobUrl.startsWith('blob:')) {
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      // 將 Blob 轉換為 Data URL
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });

      // 生成唯一的存儲 key
      const imageKey = `collaboration_${collaborationId}_${Date.now()}`;

      try {
        // 嘗試存儲到 IndexedDB
        const { imageStorage } = await import('../../utils/indexedDB.js');
        if (imageStorage && imageStorage.storeImage) {
          await imageStorage.storeImage(imageKey, dataUrl);
          console.log(
            `[Collaboration] Stored Data URL to IndexedDB with key: ${imageKey}`
          );
          return imageKey;
        } else {
          console.warn(
            '[Collaboration] imageStorage not available, using Data URL as fallback'
          );
          return dataUrl;
        }
      } catch (storageError) {
        console.warn(
          '[Collaboration] IndexedDB storage failed, using Data URL as fallback:',
          storageError
        );
        return dataUrl;
      }
    }

    // 其他情況直接返回原值
    return blobUrl;
  } catch (error) {
    console.warn(
      '[Collaboration] Failed to process image, returning original URL as fallback:',
      error
    );
    return blobUrl; // 返回原始 URL 作为 fallback
  }
};

/**
 * 將表單數據轉換為創建協作項目的 API 格式
 * @param {Object} formData - 表單數據
 * @returns {Object} 格式化後的數據
 */
export const formatFormDataForAPI = async formData => {
  const currentUserId = getCurrentUserId();
  const currentUser = getCurrentUser(); // 使用 getCurrentUser() 而不是 MOCK_USERS

  // 生成臨時 ID 用於存儲圖片
  const tempId = `temp_${Date.now()}`;

  const result = {
    // 基礎信息
    title: formData.title?.trim() || '',
    description: formData.description?.trim() || '',
    projectVision: formData.projectVision?.trim() || '',
    whyThisMatters: formData.whyThisMatters?.trim() || '',

    // 項目配置
    teamSize: formData.teamSize || '',
    duration: formData.duration || '',
    meetingSchedule: formData.meetingSchedule || '',
    applicationDeadline: formData.applicationDeadline || '', // 直接保存用户输入的文本
    projectType: formData.projectType?.trim() || '',

    // 圖片信息 - 修復：將 blob URL 轉換為 Data URL 並存儲到 IndexedDB
    posterPreview: await storeDataUrlToIndexedDB(
      formData.posterPreview,
      tempId
    ),
    heroImage: await storeDataUrlToIndexedDB(formData.posterPreview, tempId),

    // 聯繫方式 - 修復：正確處理表單數據結構
    contactInfo: {
      email:
        formData.contactEmail?.trim() ||
        formData.contactInfo?.email?.trim() ||
        '',
      discord:
        formData.contactDiscord?.trim() ||
        formData.contactInfo?.discord?.trim() ||
        '',
      other:
        formData.contactOther?.trim() ||
        formData.contactInfo?.other?.trim() ||
        '',
    },

    // 團隊角色 - 修復：正確轉換表單角色結構
    roles: (() => {
      console.log(
        '[formatFormDataForAPI] Input formData.roles:',
        formData.roles
      );

      const processedRoles =
        formData.roles
          ?.map(role => ({
            id: role.id || Date.now().toString(),
            title: role.customRole?.trim() || role.title?.trim() || '',
            description:
              role.roleDescription?.trim() || role.description?.trim() || '',
            requiredSkills: role.requiredSkills?.trim() || '',
            status: 'available', // 默認為可用狀態
          }))
          .filter(role => role.title) || []; // 只要有 title 就保留，不强制要求 description

      console.log('[formatFormDataForAPI] Processed roles:', processedRoles);
      return processedRoles;
    })(),

    // 作者信息 - 修復：使用 getCurrentUser() 获取正确的头像数据
    author: {
      id: currentUserId,
      name: currentUser?.displayName || currentUser?.name || 'Unknown',
      avatar: currentUser?.avatar || null,
      role: currentUser?.role || 'Initiator',
    },

    // 狀態和統計
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    views: 0,

    // 申請相關
    applications: [],
  };

  // 调试信息：检查输出数据

  return result;
};

/**
 * 將 API 數據轉換為詳情頁顯示格式
 * @param {Object} apiData - API 數據
 * @returns {Object} 詳情頁格式數據
 */
export const formatAPIDataForDetail = apiData => {
  // 调试信息：检查输入数据
  console.log('[formatAPIDataForDetail] Input apiData:', apiData);
  console.log('[formatAPIDataForDetail] Input apiData.roles:', apiData?.roles);

  const result = {
    id: apiData.id,
    title: apiData.title,
    author: {
      id: apiData.author?.id,
      title: apiData.title,
      artist: apiData.author?.name || 'Unknown',
      artistAvatar: apiData.author?.avatar || null,
      description: apiData.description,
      image: apiData.heroImage || null,
      category: apiData.projectType || 'Project',
      likes: apiData.likes || 0,
      views: apiData.views || 0,
      timeAgo: formatTimeAgo(apiData.createdAt),
      role: apiData.author?.role || 'Initiator',
    },
    duration: apiData.duration,
    teamSize: apiData.teamSize,
    postedTime: formatTimeAgo(apiData.createdAt),
    tags: apiData.projectType ? [apiData.projectType] : [],
    heroImage: apiData.heroImage || apiData.posterPreview || null,
    description: apiData.description,
    meetingFrequency: apiData.meetingSchedule,
    deadline: apiData.applicationDeadline || apiData.deadline, // 直接使用 applicationDeadline
    contactInfo: apiData.contactInfo,
    status: apiData.status,
    // 保留原始字段，确保 processProjectData 能读取到
    projectVision: apiData.projectVision,
    whyThisMatters: apiData.whyThisMatters,
    vision: {
      tagline: apiData.projectVision,
      narrative: apiData.whyThisMatters,
      lookingFor: apiData.roles?.map(role => role.title) || [],
      hiringTargets: apiData.roles?.map(role => role.title) || [],
      contact: apiData.contactInfo,
    },
    milestones: [], // 暫時為空，後續可擴展
    // 添加roles数据，确保职位信息能正确传递
    roles: apiData.roles || [],
  };

  // 调试信息：检查输出数据
  console.log('[formatAPIDataForDetail] Output result.roles:', result.roles);

  return result;
};

/**
 * 將 API 數據轉換為列表頁顯示格式
 * @param {Array} apiDataList - API 數據列表
 * @returns {Array} 列表頁格式數據
 */
export const formatAPIDataForList = apiDataList => {
  return apiDataList.map(item => ({
    id: item.id,
    title: item.title,
    subtitle: item.description,
    description: item.description, // 添加 description 字段
    projectVision: item.projectVision, // 添加 projectVision 字段
    whyThisMatters: item.whyThisMatters, // 添加 whyThisMatters 字段
    image: item.heroImage || null,
    posterPreview: item.posterPreview || item.heroImage || null, // 添加 posterPreview 字段
    categories: item.projectType ? [item.projectType] : [],
    author: {
      id: item.author?.id || null,
      name: item.author?.name || 'Unknown',
      avatar: item.author?.avatar || null,
    },
    likes: item.likes || 0,
    views: item.views || 0,
    isLiked: false, // 默認未點讚
    isBookmarked: false, // 默認未收藏
    isInitiator: false, // 默認非發起人
    role: item.author?.role || 'Initiator',
    duration: item.duration || '',
    meetingSchedule: item.meetingSchedule || '',
    applicationDeadline: item.applicationDeadline || '', // 添加 applicationDeadline 字段
    status: item.status === 'active' ? 'Open for Collaboration' : 'Closed',
    skills: item.roles?.map(role => role.title) || [],
    teamSize: item.teamSize || '',
    currentMembers: 0, // 暫時為0，後續可擴展
  }));
};

/**
 * 格式化時間為相對時間
 * @param {string} timestamp - 時間戳
 * @returns {string} 相對時間字符串
 */
export const formatTimeAgo = timestamp => {
  if (!timestamp) return 'Unknown time';

  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
};

/**
 * 驗證協作項目數據
 * @param {Object} data - 要驗證的數據
 * @returns {Object} 驗證結果
 */
export const validateCollaborationData = data => {
  const errors = {};

  // 必填字段驗證
  if (!data.title?.trim()) {
    errors.title = 'Project title is required';
  }

  if (!data.description?.trim()) {
    errors.description = 'Project description is required';
  } else if (data.description.length > 1000) {
    errors.description = 'Project description must be 1000 characters or less';
  }

  if (!data.projectVision?.trim()) {
    errors.projectVision = 'Project vision is required';
  } else if (data.projectVision.length > 200) {
    errors.projectVision = 'Project vision must be 200 characters or less';
  }

  if (data.whyThisMatters && data.whyThisMatters.length > 1000) {
    errors.whyThisMatters = 'Why This Matters must be 1000 characters or less';
  }

  if (!data.teamSize) {
    errors.teamSize = 'Team size is required';
  }

  if (!data.duration) {
    errors.duration = 'Duration is required';
  }

  if (!data.meetingSchedule) {
    errors.meetingSchedule = 'Meeting schedule is required';
  }

  if (!data.applicationDeadline) {
    errors.applicationDeadline = 'Application deadline is required';
  }

  // 修復：支持兩種數據結構（表單格式和API格式）
  const email = data.contactInfo?.email?.trim() || data.contactEmail?.trim();
  if (!email) {
    errors.contactEmail = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.contactEmail = 'Please enter a valid email address';
  }

  // 角色驗證 - 修復：支持兩種角色數據結構
  if (!data.roles || data.roles.length === 0) {
    errors.roles = 'At least one role is required';
  } else {
    data.roles.forEach((role, index) => {
      // 支持表單格式 (customRole) 和 API 格式 (title)
      const roleTitle = role.title?.trim() || role.customRole?.trim();
      const roleDescription =
        role.description?.trim() || role.roleDescription?.trim();

      if (!roleTitle) {
        errors[`role${index}`] = 'Role name is required';
      }
      if (!roleDescription) {
        errors[`roleDescription${index}`] = 'Role description is required';
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * 生成唯一的協作項目ID
 * @returns {string} 唯一ID
 */
export const generateCollaborationId = () => {
  return `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 清理和標準化數據
 * @param {Object} data - 原始數據
 * @returns {Object} 清理後的數據
 */
export const sanitizeCollaborationData = data => {
  return {
    ...data,
    title: data.title?.trim() || '',
    description: data.description?.trim() || '',
    projectVision: data.projectVision?.trim() || '',
    whyThisMatters: data.whyThisMatters?.trim() || '',
    projectType: data.projectType?.trim() || '',
    contactInfo: {
      email: data.contactInfo?.email?.trim() || '',
      discord: data.contactInfo?.discord?.trim() || '',
      other: data.contactInfo?.other?.trim() || '',
    },
    roles:
      data.roles?.map(role => ({
        ...role,
        title: role.title?.trim() || '',
        description: role.description?.trim() || '',
        requiredSkills: role.requiredSkills?.trim() || '',
      })) || [],
  };
};

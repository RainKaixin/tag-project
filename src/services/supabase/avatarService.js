// Supabase头像服务
import { supabase } from './client.js';

// 生成唯一文件名（不带桶前缀）
const generateFileName = userId => {
  const timestamp = Date.now();
  return `${userId}/${timestamp}.webp`;
};

// 将Data URL转换为Blob
const dataURLToBlob = async dataURL => {
  try {
    const response = await fetch(dataURL);
    return await response.blob();
  } catch (error) {
    console.error('[avatarService] Failed to convert dataURL to blob:', error);
    throw new Error('Failed to convert image data');
  }
};

// 上传头像到Supabase Storage
export const uploadAvatar = async (dataURL, userId) => {
  try {
    console.log(
      '[avatarService] Supabase: Starting avatar upload for user:',
      userId
    );

    // 生成文件名
    const fileName = generateFileName(userId);
    console.log('[avatarService] Supabase: Generated filename:', fileName);

    // 将Data URL转换为Blob
    const blob = await dataURLToBlob(dataURL);
    console.log(
      '[avatarService] Supabase: Converted to blob, size:',
      blob.size
    );

    // 上传到Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('[avatarService] Supabase: Upload failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(
      '[avatarService] Supabase: Successfully uploaded avatar:',
      fileName
    );

    // 获取公开URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const avatarUrl = urlData.publicUrl;
    const avatarUpdatedAt = new Date().toISOString();

    // 更新profiles表中的avatar_url
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: avatarUrl,
      })
      .eq('id', userId);

    if (updateError) {
      console.warn(
        '[avatarService] Supabase: Failed to update profile avatar_key:',
        updateError
      );
      // 不返回错误，因为文件上传成功了
    }

    // 触发头像更新事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('avatar:updated', {
          detail: { userId, avatarUrl, avatarUpdatedAt, avatarKey: fileName },
        })
      );
    }

    return {
      success: true,
      data: {
        avatarUrl,
        avatarUpdatedAt,
        fileName,
        avatarKey: fileName,
      },
    };
  } catch (error) {
    console.error('[avatarService] Supabase: Error uploading avatar:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 获取用户头像信息
export const getAvatarInfo = async userId => {
  try {
    console.log(
      '[avatarService] Supabase: Getting avatar info for user:',
      userId
    );

    // 从profiles表获取avatar_url
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('[avatarService] Supabase: Failed to get profile:', error);
      return {
        success: true,
        data: {
          avatarUrl: null,
          avatarUpdatedAt: null,
          fileName: null,
        },
      };
    }

    if (!profile || !profile.avatar_url) {
      console.log(
        '[avatarService] Supabase: No avatar found for user:',
        userId
      );
      return {
        success: true,
        data: {
          avatarUrl: null,
          avatarUpdatedAt: null,
          fileName: null,
        },
      };
    }

    // 直接使用存储的URL
    const avatarUrl = profile.avatar_url;
    const fileName = profile.avatar_url.split('/').pop(); // 从URL提取文件名

    console.log('[avatarService] Supabase: Retrieved avatar info:', {
      fileName,
    });

    return {
      success: true,
      data: {
        avatarUrl,
        fileName,
      },
    };
  } catch (error) {
    console.error(
      '[avatarService] Supabase: Error getting avatar info:',
      error
    );
    return {
      success: false,
      error: error.message,
    };
  }
};

// 删除头像
export const deleteAvatar = async userId => {
  try {
    console.log('[avatarService] Supabase: Deleting avatar for user:', userId);

    // 从profiles表获取avatar_url
    const { data: profile, error: getError } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    if (getError) {
      console.warn(
        '[avatarService] Supabase: Failed to get profile for deletion:',
        getError
      );
      return {
        success: false,
        error: getError.message,
      };
    }

    if (!profile || !profile.avatar_url) {
      console.log(
        '[avatarService] Supabase: No avatar to delete for user:',
        userId
      );
      return {
        success: true,
        data: { message: 'No avatar to delete' },
      };
    }

    // 从Storage删除文件（从URL提取key）
    const avatarKey = profile.avatar_url.split('/').pop();
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([avatarKey]);

    if (deleteError) {
      console.error(
        '[avatarService] Supabase: Failed to delete avatar file:',
        deleteError
      );
      return {
        success: false,
        error: deleteError.message,
      };
    }

    // 更新profiles表
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: null,
      })
      .eq('id', userId);

    if (updateError) {
      console.warn(
        '[avatarService] Supabase: Failed to update profile after deletion:',
        updateError
      );
      // 不返回错误，因为文件删除成功了
    }

    // 触发头像删除事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('avatar:deleted', {
          detail: { userId },
        })
      );
    }

    console.log(
      '[avatarService] Supabase: Successfully deleted avatar for user:',
      userId
    );

    return {
      success: true,
      data: { message: 'Avatar deleted successfully' },
    };
  } catch (error) {
    console.error('[avatarService] Supabase: Error deleting avatar:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 获取头像URL（带缓存破坏）
export const getAvatarUrlWithCacheBust = async userId => {
  try {
    const avatarInfo = await getAvatarInfo(userId);

    if (!avatarInfo.success || !avatarInfo.data.avatarUrl) {
      return null;
    }

    // 添加时间戳作为缓存破坏参数
    const timestamp = Date.now();
    const separator = avatarInfo.data.avatarUrl.includes('?') ? '&' : '?';
    return `${avatarInfo.data.avatarUrl}${separator}t=${timestamp}`;
  } catch (error) {
    console.error(
      '[avatarService] Supabase: Error getting avatar URL with cache bust:',
      error
    );
    return null;
  }
};

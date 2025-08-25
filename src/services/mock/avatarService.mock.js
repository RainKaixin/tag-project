// avatar-service v1: Mock implementation
// IMPORTANT: Keep function signatures in sync with contracts/avatarService.d.ts
// Do NOT import this file from UI. Always import from './index'.

const KEY_PREFIX = 'tag.avatars.';
const storageKey = userId => `${KEY_PREFIX}${userId}`;

// 读取用户头像数据
function readAvatarData(userId) {
  try {
    if (typeof window === 'undefined') return null;
    const data = window.localStorage.getItem(storageKey(userId));
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// 写入用户头像数据
function writeAvatarData(userId, data) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey(userId), JSON.stringify(data));
    }
  } catch (error) {
    console.warn('Failed to write avatar data:', error);
  }
}

// 生成唯一文件名
const generateFileName = userId => {
  const timestamp = Date.now();
  return `avatars/${userId}/${timestamp}.webp`;
};

// 上传头像
export const uploadAvatar = async (dataURL, userId) => {
  try {
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 生成文件名和URL
    const fileName = generateFileName(userId);
    const avatarUrl = dataURL; // 直接使用 data URL
    const avatarUpdatedAt = new Date().toISOString();

    // 调试日志
    console.log('[avatarService] Received dataURL:', dataURL?.substring(0, 30));
    console.log(
      '[avatarService] Storing avatarUrl:',
      avatarUrl?.substring(0, 30)
    );

    // 保存到本地存储
    const avatarData = {
      avatarUrl,
      avatarUpdatedAt,
      fileName,
      userId,
    };
    writeAvatarData(userId, avatarData);

    // 触发头像更新事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('avatar:updated', {
          detail: { userId, avatarUrl, avatarUpdatedAt },
        })
      );
    }

    return {
      success: true,
      data: {
        avatarUrl,
        avatarUpdatedAt,
        fileName,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// 获取用户头像信息
export const getAvatarInfo = async userId => {
  try {
    const avatarData = readAvatarData(userId);

    if (!avatarData) {
      return {
        success: true,
        data: {
          avatarUrl: null,
          avatarUpdatedAt: null,
          fileName: null,
        },
      };
    }

    return {
      success: true,
      data: {
        avatarUrl: avatarData.avatarUrl,
        avatarUpdatedAt: avatarData.avatarUpdatedAt,
        fileName: avatarData.fileName,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// 删除头像
export const deleteAvatar = async userId => {
  try {
    const avatarData = readAvatarData(userId);

    // 清除本地存储
    writeAvatarData(userId, null);

    // 触发头像删除事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('avatar:deleted', {
          detail: { userId },
        })
      );
    }

    return {
      success: true,
      data: {
        avatarUrl: null,
        avatarUpdatedAt: null,
        fileName: null,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// 获取带缓存破坏的头像URL
export const getAvatarUrlWithCacheBust = (avatarUrl, avatarUpdatedAt) => {
  if (!avatarUrl) return null;

  // 调试日志 - 已注释以避免控制台刷屏
  // console.log(
  //   '[getAvatarUrlWithCacheBust] Input avatarUrl:',
  //   avatarUrl?.substring(0, 30)
  // );

  // 只对 http/https URL 添加缓存破坏参数
  // blob: 和 data: URL 不能添加查询参数
  if (avatarUrl.startsWith('blob:') || avatarUrl.startsWith('data:')) {
    // console.log('[getAvatarUrlWithCacheBust] Returning as-is (blob/data URL)');
    return avatarUrl;
  }

  // 对 http URL 添加缓存破坏参数
  const timestamp = avatarUpdatedAt
    ? new Date(avatarUpdatedAt).getTime()
    : Date.now();
  const separator = avatarUrl.includes('?') ? '&' : '?';
  const result = `${avatarUrl}${separator}v=${timestamp}`;
  // console.log(
  //   '[getAvatarUrlWithCacheBust] Added cache bust, result:',
  //   result?.substring(0, 30)
  // );
  return result;
};

// Development helpers
export const createTestAvatar = async (userId, testImageUrl) => {
  try {
    // 创建一个测试 data URL
    const response = await fetch(testImageUrl);
    const blob = await response.blob();

    // 转换为 data URL
    const dataURL = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

    return await uploadAvatar(dataURL, userId);
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

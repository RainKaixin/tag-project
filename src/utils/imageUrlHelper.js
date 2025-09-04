// 统一图片URL获取helper
import { supabase } from '../services/supabase/client.js';

/**
 * 从Supabase Storage获取图片URL
 * @param {string} key - 图片在Storage中的key
 * @param {string} bucket - 存储桶名称，默认为'portfolio'
 * @param {boolean} useSignedUrl - 是否使用签名URL，默认为false（使用公开URL）
 * @param {number} expiresIn - 签名URL有效期（秒），默认为3600
 * @returns {Promise<{success: boolean, data?: {url: string, key: string}, error?: string}>}
 */
export const getImageUrlFromKey = async (
  key,
  bucket = 'portfolio',
  useSignedUrl = false,
  expiresIn = 3600
) => {
  // 安全检查
  if (!key) {
    console.warn('[imageUrlHelper] Key is empty or undefined');
    return {
      success: false,
      error: 'Invalid key',
    };
  }

  // 过滤掉错误的请求（如portfolio/artist_<id>、portfolio/user_<id>）
  if (key.includes('artist_') || key.includes('user_')) {
    console.warn('[imageUrlHelper] Invalid key format, skipping:', key);
    return {
      success: false,
      error: 'Invalid key format',
    };
  }

  try {
    console.log(
      `[imageUrlHelper] Getting image URL for key: ${key} from bucket: ${bucket}`
    );

    let url;

    if (useSignedUrl) {
      // 使用签名URL（适用于私有桶）
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(key, expiresIn);

      if (error) {
        console.error(
          `[imageUrlHelper] Failed to create signed URL for ${key}:`,
          error
        );
        return {
          success: false,
          error: error.message,
        };
      }

      url = data.signedUrl;
    } else {
      // 使用公开URL（适用于公开桶）
      const { data } = supabase.storage.from(bucket).getPublicUrl(key);

      url = data.publicUrl;
    }

    if (!url) {
      console.warn(`[imageUrlHelper] No URL returned for key: ${key}`);
      return {
        success: false,
        error: 'No URL returned',
      };
    }

    console.log(`[imageUrlHelper] Successfully got URL for key: ${key}`);

    return {
      success: true,
      data: {
        url,
        key,
      },
    };
  } catch (error) {
    console.error(
      `[imageUrlHelper] Error getting image URL for ${key}:`,
      error
    );
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 批量获取图片URL
 * @param {Array<string>} keys - 图片key数组
 * @param {string} bucket - 存储桶名称，默认为'portfolio'
 * @param {boolean} useSignedUrl - 是否使用签名URL，默认为false
 * @param {number} expiresIn - 签名URL有效期（秒），默认为3600
 * @returns {Promise<{success: boolean, data?: Array<{url: string, key: string}>, error?: string}>}
 */
export const getImageUrlsFromKeys = async (
  keys,
  bucket = 'portfolio',
  useSignedUrl = false,
  expiresIn = 3600
) => {
  if (!keys || !Array.isArray(keys) || keys.length === 0) {
    return {
      success: true,
      data: [],
    };
  }

  try {
    console.log(
      `[imageUrlHelper] Batch getting URLs for ${keys.length} keys from bucket: ${bucket}`
    );

    const results = await Promise.all(
      keys.map(key => getImageUrlFromKey(key, bucket, useSignedUrl, expiresIn))
    );

    const successfulResults = results
      .filter(result => result.success)
      .map(result => result.data);

    console.log(
      `[imageUrlHelper] Successfully got ${successfulResults.length} URLs out of ${keys.length} keys`
    );

    return {
      success: true,
      data: successfulResults,
    };
  } catch (error) {
    console.error('[imageUrlHelper] Error in batch URL retrieval:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 获取头像URL
 * @param {string} avatarKey - 头像在avatars桶中的key
 * @param {boolean} useSignedUrl - 是否使用签名URL，默认为false
 * @returns {Promise<{success: boolean, data?: {url: string, key: string}, error?: string}>}
 */
export const getAvatarUrlFromKey = async (avatarKey, useSignedUrl = false) => {
  if (!avatarKey) {
    return {
      success: true,
      data: null, // 没有头像
    };
  }

  return getImageUrlFromKey(avatarKey, 'avatars', useSignedUrl);
};

/**
 * 检查图片是否存在
 * @param {string} key - 图片key
 * @param {string} bucket - 存储桶名称，默认为'portfolio'
 * @returns {Promise<boolean>}
 */
export const checkImageExists = async (key, bucket = 'portfolio') => {
  try {
    const { data, error } = await supabase.storage.from(bucket).list('', {
      limit: 1,
      search: key,
    });

    if (error) {
      console.warn(
        `[imageUrlHelper] Error checking image existence for ${key}:`,
        error
      );
      return false;
    }

    return data && data.length > 0 && data.some(item => item.name === key);
  } catch (error) {
    console.warn(
      `[imageUrlHelper] Error checking image existence for ${key}:`,
      error
    );
    return false;
  }
};

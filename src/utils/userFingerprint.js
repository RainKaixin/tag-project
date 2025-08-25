// user-fingerprint v1: 用户指纹生成工具

/**
 * 生成用户指纹
 * 基于浏览器信息生成唯一标识，用于未登录用户的浏览记录
 * @returns {string} 用户指纹
 */
export const generateUserFingerprint = () => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 基础信息
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || '',
      navigator.deviceMemory || '',
      navigator.platform,
      navigator.cookieEnabled,
      navigator.doNotTrack || '',
      window.devicePixelRatio || '',
      navigator.maxTouchPoints || '',
    ];

    // Canvas指纹
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('User fingerprint', 2, 2);
    const canvasFingerprint = canvas.toDataURL();
    components.push(canvasFingerprint);

    // 生成哈希
    const fingerprint = components.join('|');
    return hashString(fingerprint);
  } catch (error) {
    console.warn('Failed to generate user fingerprint:', error);
    // 降级方案：使用时间戳和随机数
    return hashString(Date.now().toString() + Math.random().toString());
  }
};

/**
 * 简单的字符串哈希函数
 * @param {string} str - 输入字符串
 * @returns {string} 哈希值
 */
const hashString = str => {
  let hash = 0;
  if (str.length === 0) return hash.toString();

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 转换为32位整数
  }

  return Math.abs(hash).toString(36);
};

/**
 * 获取或创建用户指纹
 * 优先从localStorage获取，如果没有则生成新的
 * @returns {string} 用户指纹
 */
export const getOrCreateUserFingerprint = () => {
  const storageKey = 'tag_user_fingerprint';

  try {
    // 尝试从localStorage获取
    let fingerprint = localStorage.getItem(storageKey);

    if (!fingerprint) {
      // 生成新的指纹
      fingerprint = generateUserFingerprint();
      localStorage.setItem(storageKey, fingerprint);
    }

    return fingerprint;
  } catch (error) {
    console.warn('Failed to access localStorage:', error);
    // 降级方案：生成临时指纹
    return generateUserFingerprint();
  }
};

/**
 * 清除用户指纹
 * 用于测试或用户重置
 */
export const clearUserFingerprint = () => {
  try {
    localStorage.removeItem('tag_user_fingerprint');
  } catch (error) {
    console.warn('Failed to clear user fingerprint:', error);
  }
};

/**
 * 检查是否支持指纹生成
 * @returns {boolean} 是否支持
 */
export const isFingerprintSupported = () => {
  try {
    // 检查基本API支持
    return !!(
      navigator &&
      navigator.userAgent &&
      screen &&
      document.createElement
    );
  } catch (error) {
    return false;
  }
};

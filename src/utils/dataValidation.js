// data-validation v1: 数据验证工具

/**
 * 验证作品数据是否完整
 * @param {Object} workData - 作品数据
 * @returns {Object} 验证结果
 */
export const validateWorkData = workData => {
  if (!workData) {
    return {
      isValid: false,
      error: 'Work data is null or undefined',
      fallbackData: getDefaultWorkData(),
    };
  }

  const requiredFields = ['id', 'title', 'author'];
  const missingFields = requiredFields.filter(field => !workData[field]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `Missing required fields: ${missingFields.join(', ')}`,
      fallbackData: getDefaultWorkData(),
    };
  }

  // 验证作者数据
  if (!workData.author || typeof workData.author !== 'object') {
    return {
      isValid: false,
      error: 'Author data is invalid',
      fallbackData: getDefaultWorkData(),
    };
  }

  return {
    isValid: true,
    error: null,
    fallbackData: null,
  };
};

/**
 * 验证艺术家数据是否完整
 * @param {Object} artistData - 艺术家数据
 * @returns {Object} 验证结果
 */
export const validateArtistData = artistData => {
  if (!artistData) {
    return {
      isValid: false,
      error: 'Artist data is null or undefined',
      fallbackData: getDefaultArtistData(),
    };
  }

  const requiredFields = ['id', 'name'];
  const missingFields = requiredFields.filter(field => !artistData[field]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `Missing required fields: ${missingFields.join(', ')}`,
      fallbackData: getDefaultArtistData(),
    };
  }

  return {
    isValid: true,
    error: null,
    fallbackData: null,
  };
};

/**
 * 安全地获取嵌套对象属性
 * @param {Object} obj - 对象
 * @param {string} path - 属性路径，如 'author.name'
 * @param {*} defaultValue - 默认值
 * @returns {*} 属性值或默认值
 */
export const safeGet = (obj, path, defaultValue = null) => {
  if (!obj || typeof obj !== 'object') {
    return defaultValue;
  }

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== 'object'
    ) {
      return defaultValue;
    }
    current = current[key];
  }

  return current !== undefined ? current : defaultValue;
};

/**
 * 安全地设置嵌套对象属性
 * @param {Object} obj - 对象
 * @param {string} path - 属性路径
 * @param {*} value - 要设置的值
 * @returns {Object} 新对象
 */
export const safeSet = (obj, path, value) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const keys = path.split('.');
  const newObj = { ...obj };
  let current = newObj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return newObj;
};

/**
 * 获取默认作品数据
 * @returns {Object} 默认作品数据
 */
export const getDefaultWorkData = () => ({
  id: 'default',
  title: 'Untitled Work',
  description: 'No description available',
  category: 'Design',
  date: new Date().toLocaleDateString(),
  likes: 0,
  views: 0,
  tags: [],
  mainImage: '',
  allImages: [],
  author: getDefaultArtistData(),
});

/**
 * 获取默认艺术家数据
 * @returns {Object} 默认艺术家数据
 */
export const getDefaultArtistData = () => ({
  id: 'unknown',
  name: 'Unknown Artist',
  role: 'Design',
  avatar: '',
  works: 0,
  followers: '0',
  following: 0,
});

/**
 * 验证数组数据
 * @param {Array} array - 数组
 * @param {Function} validator - 验证函数
 * @returns {Array} 过滤后的有效数组
 */
export const validateArray = (array, validator = item => !!item) => {
  if (!Array.isArray(array)) {
    return [];
  }
  return array.filter(validator);
};

/**
 * 验证字符串数据
 * @param {*} value - 值
 * @param {string} defaultValue - 默认值
 * @returns {string} 有效的字符串
 */
export const validateString = (value, defaultValue = '') => {
  if (typeof value === 'string') {
    return value.trim() || defaultValue;
  }
  return defaultValue;
};

/**
 * 验证数字数据
 * @param {*} value - 值
 * @param {number} defaultValue - 默认值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 有效的数字
 */
export const validateNumber = (
  value,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity
) => {
  const num = Number(value);
  if (isNaN(num)) {
    return defaultValue;
  }
  return Math.max(min, Math.min(max, num));
};

// tag-parser v1: 標籤解析與規範化工具

/**
 * 從文本中提取標籤
 * @param {string} text - 要解析的文本
 * @returns {Array<{name: string, slug: string}>} 標籤數組
 */
export const extractTags = text => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // 正則表達式：匹配 # 後面的英文、數字、下劃線、短橫線，長度 1-50
  const tagRegex = /#([a-zA-Z0-9_-]{1,50})/g;
  const matches = text.match(tagRegex);

  if (!matches) {
    return [];
  }

  // 提取標籤名稱並去重
  const uniqueTags = new Set();
  const tags = [];

  matches.forEach(match => {
    const name = match.slice(1); // 移除 # 符號
    const slug = name.toLowerCase().trim();

    // 過濾無意義的標籤
    if (isValidTag(slug) && !uniqueTags.has(slug)) {
      uniqueTags.add(slug);
      tags.push({ name, slug });
    }
  });

  return tags;
};

/**
 * 驗證標籤是否有效
 * @param {string} slug - 標籤的 slug
 * @returns {boolean} 是否有效
 */
const isValidTag = slug => {
  // 過濾常見的無意義標籤
  const blacklist = [
    'the',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'from',
    'up',
    'about',
    'into',
    'through',
    'during',
    'before',
    'after',
    'above',
    'below',
    'between',
    'among',
    'within',
    'without',
    'this',
    'that',
    'these',
    'those',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',
    'can',
    'must',
    'shall',
  ];

  return slug.length >= 2 && !blacklist.includes(slug);
};

/**
 * 限制標籤數量
 * @param {Array<{name: string, slug: string}>} tags - 標籤數組
 * @param {number} maxCount - 最大數量，默認 10
 * @returns {Array<{name: string, slug: string}>} 限制後的標籤數組
 */
export const limitTags = (tags, maxCount = 10) => {
  return tags.slice(0, maxCount);
};

/**
 * 從多個文本源提取並合併標籤
 * @param {...string} texts - 多個文本源
 * @returns {Array<{name: string, slug: string}>} 合併後的標籤數組
 */
export const extractTagsFromMultiple = (...texts) => {
  const allTags = [];

  texts.forEach(text => {
    const tags = extractTags(text);
    allTags.push(...tags);
  });

  // 去重並限制數量
  const uniqueTags = [];
  const seenSlugs = new Set();

  allTags.forEach(tag => {
    if (!seenSlugs.has(tag.slug)) {
      seenSlugs.add(tag.slug);
      uniqueTags.push(tag);
    }
  });

  return limitTags(uniqueTags);
};








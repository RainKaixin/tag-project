// guidelines-data v1: 上传指南数据常量
// 从 UploadGuidelines.js 中提取的静态数据

/**
 * Do's 列表数据
 */
export const DOS_DATA = [
  {
    id: 1,
    text: 'Upload finished works only; images must be clear and legible',
    icon: 'check',
  },
  {
    id: 2,
    text: 'Use descriptive titles that capture attention',
    icon: 'check',
  },
  {
    id: 3,
    text: 'Add relevant tags to improve discoverability',
    icon: 'check',
  },
  {
    id: 4,
    text: 'Images only for now (JPG / PNG)',
    icon: 'check',
  },
  {
    id: 5,
    text: 'Max 10 MB per work (total of all images)',
    icon: 'check',
  },
];

/**
 * Don'ts 列表数据
 */
export const DONTS_DATA = [
  {
    id: 1,
    text: "Avoid uploading work that isn't yours",
    icon: 'x',
  },
  {
    id: 2,
    text: 'No blurry or heavily compressed/watermarked content',
    icon: 'x',
  },
  {
    id: 3,
    text: "Video uploads aren't supported yet",
    icon: 'x',
  },
  {
    id: 4,
    text: 'Uploads to Jobs and ArtMarket are currently closed (in testing)',
    icon: 'x',
  },
];

/**
 * 视觉示例数据
 */
export const VISUAL_EXAMPLES = {
  good: {
    title: '✓ Good',
    description: 'High quality, well-composed',
    className: 'bg-green-500',
    content: {
      title: 'STUP AI',
      icon: 'w-16 h-16 bg-red-500 rounded-full mx-auto mb-2',
      bar: 'w-32 h-4 bg-black rounded',
    },
  },
  bad: {
    title: '× Bad',
    description: 'Low resolution, poor lighting',
    className: 'bg-red-500',
    content: {
      title: 'STUP AI',
      icon: 'w-16 h-16 bg-red-400 rounded-full mx-auto mb-2 blur-sm',
      bar: 'w-32 h-4 bg-gray-800 rounded blur-sm',
      containerClass: 'opacity-60',
      titleClass: 'blur-sm',
    },
  },
};

/**
 * Pro Tip 数据
 */
export const PRO_TIP_DATA = {
  title: 'Pro Tip',
  content:
    'Projects with visual examples receive 3x more collaboration requests than those without.',
};

/**
 * 社区指南链接
 */
export const COMMUNITY_LINK = {
  text: 'community guidelines',
  href: '#',
};

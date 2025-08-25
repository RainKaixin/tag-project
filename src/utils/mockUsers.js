// Mock 用户数据配置
// ⚠️ 重要警告：展示字段请不要再从 MOCK_USERS 里取，未来会废弃
// 这些数据仅作为 profiles 的初始化默认值
// 所有 UI 显示数据必须通过 getArtistById() 获取，它会优先使用 profiles 数据
export const MOCK_USERS = {
  alice: {
    id: 'alice',
    name: 'Alice',
    displayName: 'Alice',
    avatar: null, // 移除默认头像
    // ⚠️ 展示字段请不要再从 MOCK_USERS 里取，未来会废弃
    // 这些字段仅作为 profiles 的初始化默认值
    role: 'Photographer', // 同步为与 profiles 一致
    roleIcon: '📷',
    bio: 'Professional photographer specializing in portrait and street photography. Passionate about capturing authentic moments and telling stories through images.',
    school: 'MICA',
    pronouns: 'She/Her',
    majors: ['Photography', 'Fine Art'],
    skills: ['Photography', 'Digital Art', 'Creative Design'],
    socialLinks: {
      instagram: 'https://www.instagram.com/alice',
      portfolio: 'https://alice.com',
      discord: 'https://discord.gg/alice',
    },
    portfolio: [
      {
        id: 'pf_alice_01',
        title: 'Traditional Japanese Temple',
        thumb: null, // 移除默认图片
        tags: ['Architecture', 'Traditional'],
        category: 'Digital Art',
      },
    ],
  },
  bryan: {
    id: 'bryan',
    name: 'Bryan Rodriguez',
    displayName: 'Bryan',
    avatar: null, // 移除默认头像
    role: 'Illustrator',
    roleIcon: '🎨',
    bio: 'Digital illustrator and concept artist. Creating vibrant characters and imaginative worlds through digital art and traditional techniques.',
    school: 'Parsons School of Design',
    pronouns: 'he/him',
    majors: ['Illustration', 'Graphic Design'],
    skills: ['Illustration', 'Digital Art', 'Creative Design'],
    socialLinks: {
      instagram: 'https://www.instagram.com/bryanrodriguez',
      portfolio: 'https://bryanrodriguez.com',
      discord: 'https://discord.gg/bryanrodriguez',
    },
    portfolio: [
      {
        id: 'pf_bryan_01',
        title: 'Fantasy Character',
        thumb: null, // 移除默认图片
        tags: ['Character', 'Fantasy'],
        category: 'Illustration',
      },
      {
        id: 'pf_bryan_02',
        title: 'Sci-Fi Concept',
        thumb: null, // 移除默认图片
        tags: ['Concept', 'Sci-Fi'],
        category: 'Illustration',
      },
      {
        id: 'pf_bryan_03',
        title: 'Digital Painting',
        thumb: null, // 移除默认图片
        tags: ['Digital', 'Painting'],
        category: 'Illustration',
      },
    ],
  },
  alex: {
    id: 'alex',
    name: 'Alex Chen',
    displayName: 'Alex',
    avatar: null, // 移除默认头像
    role: 'Concept Artist',
    roleIcon: '🎭',
    bio: 'Experienced concept artist and 3D modeler. Specializing in environment design and character development for games and films.',
    school: 'California Institute of the Arts',
    pronouns: 'they/them',
    majors: ['Animation', 'Game Design'],
    skills: ['Concept Art', 'Digital Art', 'Creative Design'],
    socialLinks: {
      instagram: 'https://www.instagram.com/alexchen',
      portfolio: 'https://alexchen.com',
      discord: 'https://discord.gg/alexchen',
    },
    portfolio: [
      {
        id: 'pf_alex_01',
        title: 'Mountain Landscape',
        thumb: null, // 移除默认图片
        tags: ['Environment', 'Landscape'],
        category: 'Concept Art',
      },
      {
        id: 'pf_alex_02',
        title: 'Character Design',
        thumb: null, // 移除默认图片
        tags: ['Character', 'Design'],
        category: 'Concept Art',
      },
      {
        id: 'pf_alex_03',
        title: '3D Environment',
        thumb: null, // 移除默认图片
        tags: ['3D', 'Environment'],
        category: 'Concept Art',
      },
    ],
  },
};

// 获取用户信息
export const getUserInfo = userId => {
  const user = MOCK_USERS[userId];
  if (!user) {
    console.warn(
      `[getUserInfo] User not found: ${userId}, falling back to alice`
    );
    return MOCK_USERS.alice; // 默认返回 alice
  }
  return user;
};

// 获取所有用户列表
export const getAllUsers = () => {
  return Object.values(MOCK_USERS);
};

// 获取用户角色标签
export const getUserRoleLabel = userId => {
  const user = getUserInfo(userId);
  return `${user.roleIcon} ${user.role}`;
};

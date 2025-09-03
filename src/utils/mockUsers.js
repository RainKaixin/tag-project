import { isMock } from './envCheck.js';

// Mock 用户数据配置
// ⚠️ 重要警告：展示字段请不要再从 MOCK_USERS 里取，未来会废弃
// 这些数据仅作为 profiles 的初始化默认值
// 所有 UI 显示数据必须通过 getArtistById() 获取，它会优先使用 profiles 数据
export const MOCK_USERS = {
  alex: {
    id: 'alex',
    name: 'Alex Chen',
    displayName: 'Alex Chen',
    email: 'alex@example.com',
    avatar:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIzMiIgeT0iMjQiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOEM5Q0E2Ij4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+',
    role: 'Character Designer',
    roleIcon: '🎨',
    bio: 'Passionate character designer with 5+ years of experience in game development.',
    school: 'Art Institute of Chicago',
    pronouns: 'he/him',
    majors: ['Character Design', 'Game Art'],
    skills: [
      'Character Design',
      'Digital Painting',
      'Concept Art',
      '3D Modeling',
    ],
    socialLinks: {
      instagram: '@alexchen_art',
      portfolio: 'alexchen.design',
      discord: 'alexchen#1234',
      otherLinks: [],
    },
    portfolio: [
      {
        id: 1,
        title: 'Cyberpunk Warrior',
        thumb:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkY2QjNCQyIvPgo8dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q3liZXJwdW5rIFdhcnJpb3I8L3RleHQ+Cjwvc3ZnPgo=',
        category: 'Character Design',
      },
      {
        id: 2,
        title: 'Fantasy Mage',
        thumb:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjOEM5Q0E2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GYW50YXN5IE1hZ2U8L3RleHQ+Cjwvc3ZnPgo=',
        category: 'Concept Art',
      },
    ],
  },
  alice: {
    id: 'alice',
    name: 'Alice Rodriguez',
    displayName: 'Alice Rodriguez',
    email: 'alice@example.com',
    avatar:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIzMiIgeT0iMjQiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOEM5Q0E2Ij4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+',
    role: 'Art Director',
    roleIcon: '🎭',
    bio: 'Creative art director specializing in visual storytelling and brand identity.',
    school: 'Parsons School of Design',
    pronouns: 'she/her',
    majors: ['Graphic Design', 'Fine Arts'],
    skills: [
      'Art Direction',
      'Brand Identity',
      'Visual Design',
      'Creative Strategy',
    ],
    socialLinks: {
      instagram: '@alice_rodriguez_art',
      portfolio: 'alicerodriguez.com',
      discord: 'alice_rod#5678',
      otherLinks: [],
    },
    portfolio: [
      {
        id: 3,
        title: 'Brand Identity Package',
        thumb:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkY2QjNCQyIvPgo8dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QnJhbmQgSWRlbnRpdHkgUGFja2FnZTwvdGV4dD4KPC9zdmc+Cg==',
        category: 'Brand Design',
      },
      {
        id: 4,
        title: 'Digital Illustration',
        thumb:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjOEM5Q0E2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5EaWdpdGFsIElsbHVzdHJhdGlvbjwvdGV4dD4KPC9zdmc+Cg==',
        category: 'Digital Art',
      },
    ],
  },
  bryan: {
    id: 'bryan',
    name: 'Bryan Kim',
    displayName: 'Bryan Kim',
    email: 'bryan@example.com',
    avatar:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIzMiIgeT0iMjQiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOEM5Q0E2Ij4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+',
    role: '3D Modeler',
    roleIcon: '🎯',
    bio: 'Experienced 3D modeler with expertise in character and environment modeling.',
    school: 'Rhode Island School of Design',
    pronouns: 'he/him',
    majors: ['3D Design', 'Industrial Design'],
    skills: ['3D Modeling', 'Texturing', 'Rigging', 'Animation'],
    socialLinks: {
      instagram: '@bryan_kim_3d',
      portfolio: 'bryankim3d.com',
      discord: 'bryan_kim#9012',
      otherLinks: [],
    },
    portfolio: [
      {
        id: 5,
        title: 'Sci-Fi Character Model',
        thumb:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkY2QjNCQyIvPgo8dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2NpLUZpIENoYXJhY3RlciBNb2RlbDwvdGV4dD4KPC9zdmc+Cg==',
        category: '3D Modeling',
      },
      {
        id: 6,
        title: 'Environment Design',
        thumb:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjOEM5Q0E2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FbnZpcm9ubWVudCBEZXNpZ248L3RleHQ+Cjwvc3ZnPgo=',
        category: 'Concept Art',
      },
    ],
  },
};

// 获取用户信息
export const getUserInfo = userId => {
  // 如果 userId 為 null 或 undefined，且不在 Mock 模式下，返回 null
  if (!userId && !isMock()) {
    console.warn(
      `[getUserInfo] No userId provided and not in Mock mode, returning null`
    );
    return null;
  }

  // 如果 userId 為 null 或 undefined，返回 null（不再回退到 alice）
  if (!userId) {
    console.log(`[getUserInfo] No userId provided, returning null`);
    return null;
  }

  const user = MOCK_USERS[userId];
  if (!user) {
    // 用户不存在时返回 null（不再回退到 alice）
    console.log(`[getUserInfo] User not found: ${userId}, returning null`);
    return null;
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

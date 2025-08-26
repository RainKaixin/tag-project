// collaboration-service-mock-data v1: 測試用戶示例數據
// 為 Alex、Bryan、Alice 三個測試用戶創建示例協作項目

import { generateCollaborationId } from './utils';

/**
 * Alex Chen 的示例協作項目
 * Concept Artist - 專注於遊戲概念設計和環境設計
 */
export const alexCollaborations = [
  {
    id: generateCollaborationId(),
    title: 'Game Concept Design Collaboration',
    description:
      "Creating an innovative mobile game concept that combines puzzle mechanics with narrative storytelling. We're looking for talented artists and designers to help bring this vision to life.",
    projectVision:
      'Revolutionizing mobile gaming through innovative concept design and storytelling',
    whyThisMatters:
      "This project aims to push the boundaries of mobile game design by creating an experience that's both visually stunning and intellectually engaging. We believe in the power of games to tell meaningful stories and connect people.",
    teamSize: '4-5',
    duration: '3-4 months',
    meetingSchedule: '2-3 times/week',
    applicationDeadline: '2024-12-15',
    projectType: 'Game Design, Concept Art',
    contactInfo: {
      email: 'alex.chen@example.com',
      discord: 'alexchen#1234',
      other: '',
    },
    roles: [
      {
        id: 'role_1',
        title: 'Character Designer',
        description:
          "Create unique and memorable character designs that fit the game's aesthetic and narrative. Experience with character development and concept art required.",
        requiredSkills:
          'Character Design, Concept Art, Adobe Photoshop, Procreate',
        status: 'available',
      },
      {
        id: 'role_2',
        title: 'Environment Artist',
        description:
          'Design immersive game environments that enhance the storytelling experience. Strong understanding of lighting, composition, and atmospheric design.',
        requiredSkills:
          'Environment Design, Digital Painting, 3D Modeling, Unity',
        status: 'available',
      },
      {
        id: 'role_3',
        title: 'UI/UX Designer',
        description:
          'Design intuitive and visually appealing user interfaces that enhance the gaming experience. Focus on accessibility and user engagement.',
        requiredSkills: 'UI Design, UX Research, Figma, Adobe XD',
        status: 'filled',
      },
    ],
    author: {
      id: 'alex',
      name: 'Alex Chen',
      avatar: null,
      role: 'Concept Artist',
    },
    status: 'active',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z',
    likes: 24,
    views: 156,
    applications: [],
  },
];

/**
 * Bryan Rodriguez 的示例協作項目
 * Illustrator - 專注於數字插畫和概念藝術
 */
export const bryanCollaborations = [
  {
    id: generateCollaborationId(),
    title: 'Digital Illustration Project',
    description:
      "Collaborative digital art project focused on creating a series of illustrations for a children's book. We're seeking artists who can bring warmth and imagination to storytelling through art.",
    projectVision:
      'Creating magical illustrations that inspire and delight young readers',
    whyThisMatters:
      "Children's books have the power to shape imaginations and create lasting memories. This project aims to create illustrations that not only tell a story but also inspire creativity and wonder in young minds.",
    teamSize: '2-3',
    duration: '1-2 months',
    meetingSchedule: '1-2 times/week',
    applicationDeadline: '2024-11-30',
    projectType: "Illustration, Children's Book",
    contactInfo: {
      email: 'bryan.rodriguez@example.com',
      discord: 'bryanrodriguez#5678',
      other: '',
    },
    roles: [
      {
        id: 'role_1',
        title: 'Character Illustrator',
        description:
          'Create charming and expressive character illustrations that appeal to children. Ability to maintain consistent character designs across multiple scenes.',
        requiredSkills:
          'Character Illustration, Digital Art, Adobe Illustrator, Procreate',
        status: 'available',
      },
      {
        id: 'role_2',
        title: 'Background Artist',
        description:
          'Design whimsical and engaging backgrounds that complement the story and characters. Strong sense of color and composition.',
        requiredSkills:
          'Background Art, Digital Painting, Color Theory, Adobe Photoshop',
        status: 'available',
      },
    ],
    author: {
      id: 'bryan',
      name: 'Bryan Rodriguez',
      avatar: null,
      role: 'Illustrator',
    },
    status: 'active',
    createdAt: '2024-10-25T14:30:00Z',
    updatedAt: '2024-10-25T14:30:00Z',
    likes: 18,
    views: 89,
    applications: [],
  },
  {
    id: generateCollaborationId(),
    title: 'Sci-Fi Concept Art Collection',
    description:
      'Creating a collection of sci-fi concept art pieces for a digital art portfolio. Looking for artists who can bring futuristic visions to life with attention to detail and technical accuracy.',
    projectVision:
      'Pushing the boundaries of sci-fi concept art through innovative design and storytelling',
    whyThisMatters:
      'Sci-fi art has the power to inspire technological innovation and explore the possibilities of the future. This collection aims to showcase the intersection of art and technology.',
    teamSize: '3-4',
    duration: '2-3 months',
    meetingSchedule: '2-3 times/week',
    applicationDeadline: '2024-12-20',
    projectType: 'Concept Art, Sci-Fi',
    contactInfo: {
      email: 'bryan.rodriguez@example.com',
      discord: 'bryanrodriguez#5678',
      other: '',
    },
    roles: [
      {
        id: 'role_1',
        title: 'Vehicle Designer',
        description:
          'Design futuristic vehicles and spacecraft with realistic engineering principles. Strong understanding of form, function, and aerodynamics.',
        requiredSkills:
          'Vehicle Design, Industrial Design, 3D Modeling, Blender',
        status: 'available',
      },
      {
        id: 'role_2',
        title: 'Character Designer',
        description:
          'Create unique alien and humanoid character designs that fit the sci-fi aesthetic. Focus on diversity and creative anatomy.',
        requiredSkills: 'Character Design, Anatomy, Digital Painting, ZBrush',
        status: 'available',
      },
      {
        id: 'role_3',
        title: 'Environment Designer',
        description:
          'Design otherworldly environments and space stations with attention to scale and atmosphere. Strong lighting and composition skills.',
        requiredSkills:
          'Environment Design, Digital Painting, Lighting, Adobe Photoshop',
        status: 'filled',
      },
    ],
    author: {
      id: 'bryan',
      name: 'Bryan Rodriguez',
      avatar: null,
      role: 'Illustrator',
    },
    status: 'active',
    createdAt: '2024-10-20T09:15:00Z',
    updatedAt: '2024-10-20T09:15:00Z',
    likes: 31,
    views: 203,
    applications: [],
  },
];

/**
 * Alice 的示例協作項目
 * Photographer - 專注於肖像和街頭攝影
 */
export const aliceCollaborations = [
  {
    id: generateCollaborationId(),
    title: 'Photography Portfolio Collaboration',
    description:
      "Creating a stunning photography portfolio that showcases urban life and human stories. We're looking for photographers who can capture authentic moments and tell compelling visual narratives.",
    projectVision:
      'Documenting the beauty and complexity of urban life through authentic photography',
    whyThisMatters:
      'Photography has the power to preserve moments, tell stories, and connect people across cultures and time. This project aims to create a visual record of urban life that resonates with viewers and preserves important cultural moments.',
    teamSize: '3-4',
    duration: '2-3 months',
    meetingSchedule: '1-2 times/week',
    applicationDeadline: '2024-11-15',
    projectType: 'Photography, Street Photography',
    contactInfo: {
      email: 'alice@example.com',
      discord: 'alice_photo#9012',
      other: '',
    },
    roles: [
      {
        id: 'role_1',
        title: 'Street Photographer',
        description:
          'Capture candid moments of urban life and human interaction. Strong understanding of composition, lighting, and timing.',
        requiredSkills:
          'Street Photography, Composition, Lighting, Adobe Lightroom',
        status: 'available',
      },
      {
        id: 'role_2',
        title: 'Portrait Photographer',
        description:
          'Create compelling portraits that tell individual stories. Ability to work with diverse subjects and create comfortable shooting environments.',
        requiredSkills:
          'Portrait Photography, Lighting, Photoshop, Communication',
        status: 'available',
      },
      {
        id: 'role_3',
        title: 'Photo Editor',
        description:
          'Edit and enhance photographs while maintaining authenticity. Strong post-processing skills and attention to detail.',
        requiredSkills:
          'Photo Editing, Adobe Photoshop, Color Grading, Attention to Detail',
        status: 'filled',
      },
    ],
    author: {
      id: 'alice',
      name: 'Alice',
      avatar: null,
      role: 'Photographer',
    },
    status: 'active',
    createdAt: '2024-10-28T16:45:00Z',
    updatedAt: '2024-10-28T16:45:00Z',
    likes: 42,
    views: 267,
    applications: [],
  },
];

/**
 * 合併所有測試用戶的協作項目數據
 */
export const allMockCollaborations = [
  ...alexCollaborations,
  ...bryanCollaborations,
  ...aliceCollaborations,
];

/**
 * 按用戶ID獲取協作項目
 * @param {string} userId - 用戶ID
 * @returns {Array} 該用戶的協作項目列表
 */
export const getCollaborationsByUser = userId => {
  switch (userId) {
    case 'alex':
      return alexCollaborations;
    case 'bryan':
      return bryanCollaborations;
    case 'alice':
      return aliceCollaborations;
    default:
      return [];
  }
};

/**
 * 獲取所有協作項目的統計信息
 */
export const getCollaborationsStats = () => {
  return {
    total: allMockCollaborations.length,
    byUser: {
      alex: alexCollaborations.length,
      bryan: bryanCollaborations.length,
      alice: aliceCollaborations.length,
    },
    byStatus: {
      active: allMockCollaborations.filter(c => c.status === 'active').length,
      completed: allMockCollaborations.filter(c => c.status === 'completed')
        .length,
      paused: allMockCollaborations.filter(c => c.status === 'paused').length,
    },
  };
};

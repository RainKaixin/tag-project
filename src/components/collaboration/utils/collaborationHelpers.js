// 状态颜色映射
export const getStatusColor = status => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800';
    case 'filled':
      return 'bg-gray-100 text-gray-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// 状态文本映射
export const getStatusText = status => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'filled':
      return 'Position Filled';
    case 'in_progress':
      return 'In Progress';
    default:
      return 'Unknown';
  }
};

// 项目数据处理
export const processProjectData = (projectData, location, state) => {
  const project = projectData
    ? {
        id: projectData.id,
        title: projectData.title,
        author: {
          id: projectData.author?.id || null,
          title: projectData.title,
          artist: projectData.author?.name || 'Unknown',
          artistAvatar: projectData.author?.avatar || null,
          description: projectData.subtitle,
          image: projectData.posterPreview || projectData.image,
          category: projectData.categories?.[0] || 'Project',
          likes: projectData.likes,
          views: projectData.views,
          timeAgo: '2 hours ago',
          role: projectData.author?.role || 'Initiator',
        },
        duration: projectData.duration || 'Not specified',
        teamSize: projectData.teamSize || 'Not specified',
        postedTime: '2 hours ago',
        tags: projectData.categories || ['Project'],
        heroImage: projectData.posterPreview || projectData.image,
        description: projectData.subtitle || '',
        meetingFrequency: projectData.meetingSchedule || 'Not specified',
        deadline:
          projectData.applicationDeadline || projectData.deadline || null, // 直接使用用户输入的文本
        applicationDeadline:
          projectData.applicationDeadline || projectData.deadline || null, // 确保applicationDeadline字段也被设置
        contactInfo: {
          discord: projectData.contactDiscord || null,
          email: projectData.contactEmail || null,
        },
        status: 'in_progress',
        vision: {
          tagline:
            projectData.projectVision ||
            projectData.vision?.tagline ||
            projectData.vision?.narrative ||
            '',
          narrative:
            projectData.whyThisMatters ||
            projectData.vision?.narrative ||
            projectData.vision?.whyThisMatters ||
            '',
          lookingFor: projectData.projectType
            ? projectData.projectType
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0)
            : [],
          contact: {
            discord: projectData.contactDiscord || null,
            email: projectData.contactEmail || null,
          },
        },
        milestones: projectData.milestones || [],
      }
    : {
        id: 1,
        title: 'Modern E-commerce Mobile App',
        author: {
          id: 1,
          title: 'Modern E-commerce Mobile App',
          artist: 'Sarah Chen',
          artistAvatar:
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          description: 'A cutting-edge mobile shopping experience',
          image:
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
          category: 'Mobile App',
          likes: 128,
          views: 2048,
          timeAgo: '2 hours ago',
          role: 'Initiator',
        },
        duration: projectData.duration || 'Not specified',
        teamSize: projectData.teamSize || 'Not specified',
        postedTime: '2 hours ago',
        tags: ['Mobile App', 'E-commerce', 'React Native'],
        heroImage:
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
        description: '',
        meetingFrequency: projectData.meetingSchedule || 'Not specified',
        deadline:
          projectData.applicationDeadline || projectData.deadline || null, // 直接使用用户输入的文本
        applicationDeadline:
          projectData.applicationDeadline || projectData.deadline || null, // 确保applicationDeadline字段也被设置
        contactInfo: {
          discord: projectData.contactDiscord || null,
          email: projectData.contactEmail || null,
        },
        status: 'in_progress',
        vision: {
          tagline:
            projectData.projectVision ||
            projectData.vision?.tagline ||
            projectData.vision?.narrative ||
            '',
          narrative:
            projectData.whyThisMatters ||
            projectData.vision?.narrative ||
            projectData.vision?.whyThisMatters ||
            '',
          lookingFor: projectData.projectType
            ? projectData.projectType
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0)
            : [],
          contact: {
            discord: projectData.contactDiscord || null,
            email: projectData.contactEmail || null,
          },
        },
        milestones: projectData.milestones || [],
      };

  return project || null;
};

// 职位数据
export const getPositionsData = () => [
  {
    id: 1,
    title: 'UI/UX Designer',
    description:
      "We're looking for a talented UI/UX designer to create beautiful, intuitive user interfaces and engaging user experiences. You'll work closely with our development team to bring designs to life.",
    status: 'available',
    skills: [
      'Figma',
      'Adobe Creative Suite',
      'User Research',
      'Prototyping',
      'Design Systems',
    ],
    applications: [],
  },
  {
    id: 2,
    title: 'Frontend Developer',
    description:
      "Join our frontend team to build responsive, performant web applications using modern technologies. You'll collaborate with designers and backend developers to create seamless user experiences.",
    status: 'available',
    skills: [
      'React',
      'TypeScript',
      'CSS/SCSS',
      'JavaScript',
      'Responsive Design',
    ],
    applications: [],
  },
  {
    id: 3,
    title: 'Motion Designer',
    description:
      "Create stunning animations and motion graphics that enhance user engagement and bring our digital experiences to life. You'll work on micro-interactions, loading states, and brand animations.",
    status: 'filled',
    skills: [
      'After Effects',
      'Lottie',
      'Principle',
      'Animation',
      'Storyboarding',
    ],
    applications: [],
  },
];

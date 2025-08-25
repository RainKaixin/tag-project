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
          id: projectData.id,
          title: projectData.title,
          artist: projectData.author.name,
          artistAvatar: projectData.author.avatar,
          description: projectData.subtitle,
          image: projectData.image,
          category: projectData.categories?.[0] || 'Project',
          likes: projectData.likes,
          views: projectData.views,
          timeAgo: '2 hours ago',
          role: 'Project Lead',
        },
        duration: '3-4 months',
        teamSize: '5-6 people',
        postedTime: '2 hours ago',
        tags: projectData.categories || ['Project'],
        heroImage: projectData.image,
        description:
          projectData.subtitle +
          ". We're looking for passionate designers and developers to join our team and create something amazing together.",
        meetingFrequency: '2-3 times/week',
        deadline: 'Dec 15, 2024',
        contactInfo: {
          discord: 'project_lead#1234',
          email: 'project.lead@email.com',
        },
        status: 'in_progress',
        vision: {
          tagline: 'Building the future of creative collaboration',
          narrative:
            "We're creating a platform that connects talented designers and developers to build amazing digital experiences together. Our vision is to make collaboration seamless, inspiring, and productive.\n\nThis project will showcase the power of interdisciplinary teamwork and innovative design thinking. We're looking for passionate individuals who share our vision and want to make a real impact.",
          hiringTargets: [
            'UI/UX Designer',
            'Frontend Developer',
            'Motion Designer',
          ],
          contact: {
            discord: 'project_lead#1234',
            email: 'project.lead@email.com',
          },
        },
        milestones: [
          {
            id: 1,
            title: 'Project Planning',
            status: 'completed',
            dueDate: 'Week 1',
          },
          {
            id: 2,
            title: 'Design Phase',
            status: 'completed',
            dueDate: 'Week 3',
          },
          {
            id: 3,
            title: 'Development Phase',
            status: 'in-progress',
            dueDate: 'Week 6',
          },
          {
            id: 4,
            title: 'Testing & QA',
            status: 'pending',
            dueDate: 'Week 8',
          },
          {
            id: 5,
            title: 'Launch Preparation',
            status: 'pending',
            dueDate: 'Week 10',
          },
        ],
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
          role: 'Project Lead',
        },
        duration: '3-4 months',
        teamSize: '5-6 people',
        postedTime: '2 hours ago',
        tags: ['Mobile App', 'E-commerce', 'React Native'],
        heroImage:
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
        description:
          "We're building a modern e-commerce mobile app that will revolutionize the shopping experience. Our vision is to create a seamless, intuitive, and engaging platform that connects customers with amazing products.\n\nWe're looking for passionate designers and developers to join our team and create something amazing together.",
        meetingFrequency: '2-3 times/week',
        deadline: 'Dec 15, 2024',
        contactInfo: {
          discord: 'project_lead#1234',
          email: 'project.lead@email.com',
        },
        status: 'in_progress',
        vision: {
          tagline: 'Building the future of creative collaboration',
          narrative:
            "We're creating a platform that connects talented designers and developers to build amazing digital experiences together. Our vision is to make collaboration seamless, inspiring, and productive.\n\nThis project will showcase the power of interdisciplinary teamwork and innovative design thinking. We're looking for passionate individuals who share our vision and want to make a real impact.",
          hiringTargets: [
            'UI/UX Designer',
            'Frontend Developer',
            'Motion Designer',
          ],
          contact: {
            discord: 'project_lead#1234',
            email: 'project.lead@email.com',
          },
        },
        milestones: [
          {
            id: 1,
            title: 'Project Planning',
            status: 'completed',
            dueDate: 'Week 1',
          },
          {
            id: 2,
            title: 'Design Phase',
            status: 'completed',
            dueDate: 'Week 3',
          },
          {
            id: 3,
            title: 'Development Phase',
            status: 'in-progress',
            dueDate: 'Week 6',
          },
          {
            id: 4,
            title: 'Testing & QA',
            status: 'pending',
            dueDate: 'Week 8',
          },
          {
            id: 5,
            title: 'Launch Preparation',
            status: 'pending',
            dueDate: 'Week 10',
          },
        ],
      };

  return project;
};

// 职位数据
export const getPositionsData = () => [
  {
    id: 1,
    title: 'UI/UX Designer',
    description:
      "We're looking for a talented UI/UX designer to create beautiful, intuitive user interfaces and engaging user experiences. You'll work closely with our development team to bring designs to life.",
    status: 'available',
    applications: 12,
    skills: [
      'Figma',
      'Adobe Creative Suite',
      'User Research',
      'Prototyping',
      'Design Systems',
    ],
  },
  {
    id: 2,
    title: 'Frontend Developer',
    description:
      "Join our frontend team to build responsive, performant web applications using modern technologies. You'll collaborate with designers and backend developers to create seamless user experiences.",
    status: 'available',
    applications: 8,
    skills: [
      'React',
      'TypeScript',
      'CSS/SCSS',
      'JavaScript',
      'Responsive Design',
    ],
  },
  {
    id: 3,
    title: 'Motion Designer',
    description:
      "Create stunning animations and motion graphics that enhance user engagement and bring our digital experiences to life. You'll work on micro-interactions, loading states, and brand animations.",
    status: 'filled',
    applications: 15,
    skills: [
      'After Effects',
      'Lottie',
      'Principle',
      'Animation',
      'Storyboarding',
    ],
  },
];























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
          id: projectData.author?.id || projectData.id,
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
        duration: '3-4 months',
        teamSize: '5-6 people',
        postedTime: '2 hours ago',
        tags: projectData.categories || ['Project'],
        heroImage: projectData.posterPreview || projectData.image,
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
        milestones:
          projectData.id === 2
            ? []
            : [
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
          role: 'Initiator',
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
    skills: [
      'Figma',
      'Adobe Creative Suite',
      'User Research',
      'Prototyping',
      'Design Systems',
    ],
    applications: [
      {
        id: 1,
        name: 'Alex Chen',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '2 hours ago',
      },
      {
        id: 2,
        name: 'Maya Rodriguez',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        status: 'approved',
        appliedAt: '4 hours ago',
      },
      {
        id: 3,
        name: 'David Kim',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '6 hours ago',
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 day ago',
      },
      {
        id: 5,
        name: 'James Lee',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 day ago',
      },
      {
        id: 6,
        name: 'Emma Davis',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '2 days ago',
      },
      {
        id: 7,
        name: 'Michael Brown',
        avatar:
          'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '2 days ago',
      },
      {
        id: 8,
        name: 'Lisa Zhang',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '3 days ago',
      },
      {
        id: 9,
        name: 'Tom Anderson',
        avatar:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '3 days ago',
      },
      {
        id: 10,
        name: 'Rachel Green',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '4 days ago',
      },
      {
        id: 11,
        name: 'Chris Johnson',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '4 days ago',
      },
      {
        id: 12,
        name: 'Anna White',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '5 days ago',
      },
    ],
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
    applications: [
      {
        id: 1,
        name: 'Daniel Park',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        status: 'approved',
        appliedAt: '1 hour ago',
      },
      {
        id: 2,
        name: 'Sophie Turner',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '3 hours ago',
      },
      {
        id: 3,
        name: 'Kevin Chen',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '5 hours ago',
      },
      {
        id: 4,
        name: 'Maria Garcia',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 day ago',
      },
      {
        id: 5,
        name: 'Ryan Miller',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 day ago',
      },
      {
        id: 6,
        name: 'Jessica Wang',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '2 days ago',
      },
      {
        id: 7,
        name: 'Andrew Smith',
        avatar:
          'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '2 days ago',
      },
      {
        id: 8,
        name: 'Nina Patel',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '3 days ago',
      },
    ],
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
    applications: [
      {
        id: 1,
        name: 'Sophie Wilson',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        status: 'approved',
        appliedAt: '3 days ago',
      },
      {
        id: 2,
        name: 'Carlos Rodriguez',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '4 days ago',
      },
      {
        id: 3,
        name: 'Amanda Foster',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '5 days ago',
      },
      {
        id: 4,
        name: 'Marcus Johnson',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 week ago',
      },
      {
        id: 5,
        name: 'Elena Silva',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 week ago',
      },
      {
        id: 6,
        name: 'Brian Thompson',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 week ago',
      },
      {
        id: 7,
        name: 'Yuki Tanaka',
        avatar:
          'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 week ago',
      },
      {
        id: 8,
        name: 'Isabella Martinez',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 week ago',
      },
      {
        id: 9,
        name: 'Robert Davis',
        avatar:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 week ago',
      },
      {
        id: 10,
        name: 'Grace Lee',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 week ago',
      },
      {
        id: 11,
        name: 'Thomas Anderson',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 week ago',
      },
      {
        id: 12,
        name: 'Olivia White',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 week ago',
      },
      {
        id: 13,
        name: 'Lucas Brown',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 week ago',
      },
      {
        id: 14,
        name: 'Zoe Clark',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 week ago',
      },
      {
        id: 15,
        name: 'Nathan Taylor',
        avatar:
          'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face',
        status: 'pending',
        appliedAt: '1 week ago',
      },
    ],
  },
];

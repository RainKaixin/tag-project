// 项目数据模板
export const createProjectData = (milestoneData, milestoneId) => {
  return milestoneData
    ? {
        id: milestoneId,
        title: milestoneData.title,
        description: milestoneData.description,
        progress: milestoneData.progress || 75,
        dueDate: milestoneData.dueDate || 'March 15, 2024',
        projectType: milestoneData.projectType || 'Project',
        teamSize: milestoneData.teamSize || 2,
        duration: milestoneData.duration || '3-4 months',
        meetingSchedule: milestoneData.meetingSchedule || '2-3 times/week',
        tags: milestoneData.tags || ['Project'],
        teamLead: milestoneData.teamLead || {
          artist: 'Alex Chen',
          artistAvatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          role: 'Project Lead',
        },
        teamMembers: milestoneData.teamMembers || [
          {
            id: 1,
            title: 'Cyberpunk Street Scene',
            artist: 'Alex Chen',
            artistAvatar:
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            description:
              'A futuristic city street with vibrant neon signs and cyberpunk aesthetics',
            image:
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
            category: 'Visual Effects',
            likes: '1.2k',
            views: '8.4k',
            timeAgo: '2 days ago',
            role: 'Character Designer',
          },
          {
            id: 2,
            title: 'Dragon Knight Concept',
            artist: 'Maya Rodriguez',
            artistAvatar:
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            description:
              'Detailed illustration of a knight in dark, ornate armor',
            image:
              'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
            category: 'Game Design',
            likes: '2.1k',
            views: '12k',
            timeAgo: '5 days ago',
            role: 'Art Director',
          },
        ],
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
        ],
      }
    : {
        id: milestoneId,
        title: 'Fantasy Character Series',
        description:
          'Digital illustration project exploring mythical creatures and fantasy character design. This collaborative project focuses on creating a series of unique characters with distinct personalities and visual styles.',
        progress: 75,
        dueDate: 'March 15, 2024',
        projectType: 'Illustration Project',
        teamSize: 2,
        duration: '3-4 months',
        meetingSchedule: '2-3 times/week',
        tags: ['Illustration', 'Character Design', 'Digital Art'],
        teamLead: {
          artist: 'Alex Chen',
          artistAvatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          role: 'Project Lead',
        },
        teamMembers: [
          {
            id: 1,
            title: 'Cyberpunk Street Scene',
            artist: 'Alex Chen',
            artistAvatar:
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            description:
              'A futuristic city street with vibrant neon signs and cyberpunk aesthetics',
            image:
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
            category: 'Visual Effects',
            likes: '1.2k',
            views: '8.4k',
            timeAgo: '2 days ago',
            role: 'Character Designer',
          },
          {
            id: 2,
            title: 'Dragon Knight Concept',
            artist: 'Maya Rodriguez',
            artistAvatar:
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            description:
              'Detailed illustration of a knight in dark, ornate armor',
            image:
              'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
            category: 'Game Design',
            likes: '2.1k',
            views: '12k',
            timeAgo: '5 days ago',
            role: 'Art Director',
          },
        ],
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
        ],
      };
};

// 里程碑数据模板
export const createMilestonesData = projectType => {
  return projectType === 'Artist Collaborations'
    ? [
        // 艺术家协作的milestones
        {
          id: 1,
          title: 'Character Design Collaboration',
          description:
            'Collaborated with game studio on character design for fantasy RPG',
          introduction:
            'This stage focused on creating unique character designs that would resonate with players while maintaining the fantasy RPG aesthetic. We explored various visual styles and personality traits.',
          status: 'completed',
          progress: 100,
          dueDate: 'Feb 15, 2024',
          images: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
            'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=150&fit=crop',
          ],
        },
        {
          id: 2,
          title: 'UI/UX Design Project',
          description: 'Led design team for mobile app interface redesign',
          introduction:
            'Redesigned the mobile app interface to improve user experience and accessibility. Focused on intuitive navigation and modern design principles.',
          status: 'completed',
          progress: 100,
          dueDate: 'Feb 28, 2024',
          images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop',
          ],
        },
        {
          id: 3,
          title: 'Animation Short Film',
          description: 'Directed and animated short film for film festival',
          introduction:
            'Created a compelling short film that showcases storytelling through animation. This project pushed creative boundaries and technical skills.',
          status: 'in-progress',
          progress: 75,
          dueDate: 'March 15, 2024',
          images: [
            'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=150&fit=crop',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
          ],
        },
      ]
    : [
        // 默认项目milestones
        {
          id: 1,
          title: 'Character Concept Sketches',
          description:
            'Initial character design exploration and concept development',
          introduction:
            'Explored various character concepts through sketching and ideation. This stage established the foundation for all character designs in the series.',
          status: 'completed',
          progress: 100,
          dueDate: 'Feb 15, 2024',
          images: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
            'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=150&fit=crop',
          ],
        },
        {
          id: 2,
          title: 'Color Palette Development',
          description:
            'Establishing the visual color scheme and mood for the series',
          introduction:
            'Developed a cohesive color palette that sets the mood and atmosphere for the entire character series. Focused on harmony and visual appeal.',
          status: 'completed',
          progress: 100,
          dueDate: 'Feb 28, 2024',
          images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop',
          ],
        },
        {
          id: 3,
          title: 'Final Character Illustrations',
          description: 'Complete detailed illustrations of all main characters',
          introduction:
            'Creating the final detailed illustrations of all main characters. This stage brings together all previous work into polished, finished pieces.',
          status: 'in-progress',
          progress: 75,
          dueDate: 'March 15, 2024',
          images: [
            'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=150&fit=crop',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
          ],
        },
      ];
};

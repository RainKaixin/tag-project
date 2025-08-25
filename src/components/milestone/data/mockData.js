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
        tags: milestoneData.tags || ['Project'],
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
        tags: ['Illustration', 'Character Design', 'Digital Art'],
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
          status: 'in-progress',
          progress: 75,
          dueDate: 'March 15, 2024',
          images: [
            'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=150&fit=crop',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
          ],
        },
        {
          id: 4,
          title: 'Brand Identity Project',
          description: 'Created complete brand identity for startup company',
          status: 'upcoming',
          progress: 0,
          dueDate: 'March 30, 2024',
          images: [],
        },
        {
          id: 5,
          title: 'Illustration Series',
          description: "Commissioned illustration series for children's book",
          status: 'upcoming',
          progress: 0,
          dueDate: 'April 10, 2024',
          images: [],
        },
      ]
    : [
        // 默认项目milestones
        {
          id: 1,
          title: 'Character Concept Sketches',
          description:
            'Initial character design exploration and concept development',
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
          status: 'in-progress',
          progress: 75,
          dueDate: 'March 15, 2024',
          images: [
            'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=150&fit=crop',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
          ],
        },
        {
          id: 4,
          title: 'Character Expressions & Poses',
          description:
            'Creating various expressions and dynamic poses for each character',
          status: 'upcoming',
          progress: 0,
          dueDate: 'March 30, 2024',
          images: [],
        },
        {
          id: 5,
          title: 'Final Presentation & Portfolio',
          description:
            'Compiling all work into a professional portfolio presentation',
          status: 'upcoming',
          progress: 0,
          dueDate: 'April 10, 2024',
          images: [],
        },
      ];
};

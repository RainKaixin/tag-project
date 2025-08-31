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
  console.log('[processProjectData] Input projectData:', projectData);
  console.log(
    '[processProjectData] Input projectData.roles:',
    projectData?.roles
  );

  const project = projectData
    ? {
        id: projectData.id,
        title: projectData.title,
        author: {
          id: projectData.author?.id || projectData.authorId || null,
          title: projectData.title,
          artist:
            projectData.author?.name || projectData.authorName || 'Unknown',
          artistAvatar:
            projectData.author?.avatar || projectData.authorAvatar || null,
          description: projectData.subtitle,
          image: projectData.posterPreview || projectData.image,
          category: projectData.categories?.[0] || 'Project',
          likes: projectData.likes,
          views: projectData.views,
          timeAgo: projectData.createdAt
            ? new Date(projectData.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Unknown date',
          role: projectData.author?.role || 'Initiator',
        },
        duration: projectData.duration || 'Not specified',
        teamSize: projectData.teamSize || 'Not specified',
        postedTime: projectData.createdAt
          ? new Date(projectData.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Unknown date',
        tags: [], // 暂时不显示标签，避免显示无意义的 "Project" 标签
        heroImage: projectData.posterPreview || projectData.image,
        description: projectData.description || projectData.subtitle || '',
        meetingFrequency: projectData.meetingSchedule || 'Not specified',
        deadline:
          projectData.applicationDeadline || projectData.deadline || null, // 直接使用用户输入的文本
        applicationDeadline:
          projectData.applicationDeadline || projectData.deadline || null, // 确保applicationDeadline字段也被设置
        contactInfo: {
          discord:
            projectData.contactInfo?.discord ||
            projectData.contactDiscord ||
            null,
          email:
            projectData.contactInfo?.email || projectData.contactEmail || null,
          other:
            projectData.contactInfo?.other || projectData.contactOther || null,
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
          // 添加collaborators数据到vision中，确保ProjectVision组件能接收到数据
          collaborators: projectData.collaborators || [],
        },
        milestones: projectData.milestones || [],
        // 添加roles数据，确保职位信息能正确传递
        roles: projectData.roles || [],
        // 添加collaborators数据，确保Collaborators信息能正确传递
        collaborators: projectData.collaborators || [],
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
        description: 'A cutting-edge mobile shopping experience',
        meetingFrequency: projectData.meetingSchedule || 'Not specified',
        deadline:
          projectData.applicationDeadline || projectData.deadline || null, // 直接使用用户输入的文本
        applicationDeadline:
          projectData.applicationDeadline || projectData.deadline || null, // 确保applicationDeadline字段也被设置
        contactInfo: {
          discord:
            projectData.contactInfo?.discord ||
            projectData.contactDiscord ||
            null,
          email:
            projectData.contactInfo?.email || projectData.contactEmail || null,
          other:
            projectData.contactInfo?.other || projectData.contactOther || null,
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
          // 添加collaborators数据到vision中，确保ProjectVision组件能接收到数据
          collaborators: projectData.collaborators || [],
        },
        milestones: projectData.milestones || [],
        // 添加roles数据，确保职位信息能正确传递
        roles: projectData.roles || [],
        // 添加collaborators数据，确保Collaborators信息能正确传递
        collaborators: projectData.collaborators || [],
      };

  console.log('[processProjectData] Final project.roles:', project?.roles);
  console.log(
    '[processProjectData] Final project.collaborators:',
    project?.collaborators
  );
  console.log(
    '[processProjectData] Final project.vision?.collaborators:',
    project?.vision?.collaborators
  );
  return project || null;
};

// 职位数据 - 从协作项目数据中读取真实的roles
export const getPositionsData = (projectData = null) => {
  console.log('[getPositionsData] Input projectData:', projectData);
  console.log('[getPositionsData] ProjectData roles:', projectData?.roles);
  console.log(
    '[getPositionsData] ProjectData roles length:',
    projectData?.roles?.length
  );
  console.log(
    '[getPositionsData] ProjectData roles type:',
    typeof projectData?.roles
  );
  console.log(
    '[getPositionsData] ProjectData roles is array:',
    Array.isArray(projectData?.roles)
  );

  // 如果没有提供项目数据，返回默认数据（向后兼容）
  if (!projectData || !projectData.roles || projectData.roles.length === 0) {
    console.log(
      '[getPositionsData] Using default positions (no project data or empty roles)'
    );
    return [
      {
        id: 1,
        title: 'UI/UX Designer',
        description:
          "We're looking for a talented UI/UX designer to create beautiful, intuitive user interfaces and engaging user experiences. You'll work closely with our development team to bring designs to life.",
        status: 'available',
        requiredSkills: [
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
        requiredSkills: [
          'React',
          'TypeScript',
          'CSS/SCSS',
          'JavaScript',
          'Responsive Design',
        ],
        applications: [],
      },
    ];
  }

  // 从项目数据中转换roles为positions格式
  console.log('[getPositionsData] Converting roles to positions...');
  const positions = projectData.roles.map((role, index) => {
    console.log(`[getPositionsData] Processing role ${index}:`, role);

    // 安全地处理requiredSkills，支持多种格式
    const skills = (() => {
      if (!role.requiredSkills) return [];
      if (Array.isArray(role.requiredSkills)) return role.requiredSkills;
      if (typeof role.requiredSkills === 'string') {
        return role.requiredSkills
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill);
      }
      return [];
    })();

    const position = {
      id: role.id || index + 1,
      title: role.title || role.customRole || `Role ${index + 1}`,
      description: role.description || role.roleDescription || '',
      status: role.status || 'available',
      requiredSkills: skills, // 使用 requiredSkills 字段名保持一致性
      applications: role.applications || [],
    };

    console.log(`[getPositionsData] Created position ${index}:`, position);
    return position;
  });

  console.log('[getPositionsData] Final positions:', positions);
  return positions;
};

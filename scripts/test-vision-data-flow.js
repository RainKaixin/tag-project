// 测试 Project Vision 和 Why This Matters 的完整数据流
console.log('=== 测试 Project Vision 和 Why This Matters 数据流 ===');

// 1. 模拟用户输入的表单数据
const formData = {
  title: 'Test Collaboration Project',
  description: 'A comprehensive test project for vision and why this matters',
  projectVision: 'Building an innovative platform for creative collaboration',
  whyThisMatters:
    'This project will revolutionize how creative teams work together and make collaboration more accessible to students worldwide.',
  teamSize: '5 members',
  duration: '3 months',
  meetingSchedule: '2-3 times/week',
  applicationDeadline: 'Dec 31, 2024',
  projectType: 'Design, Development',
  contactEmail: 'test@example.com',
  contactDiscord: 'testuser#1234',
  poster: null,
  posterPreview: 'test-image-key',
  roles: [
    {
      id: 1,
      customRole: 'UI/UX Designer',
      roleDescription: 'Create beautiful user interfaces',
      requiredSkills: 'Figma, Adobe Creative Suite',
    },
  ],
};

console.log('1. 用户输入数据:', formData);

// 2. 模拟 formatFormDataForAPI 函数
const formatFormDataForAPI = formData => {
  return {
    title: formData.title?.trim() || '',
    description: formData.description?.trim() || '',
    projectVision: formData.projectVision?.trim() || '',
    whyThisMatters: formData.whyThisMatters?.trim() || '',
    teamSize: formData.teamSize || '',
    duration: formData.duration || '',
    meetingSchedule: formData.meetingSchedule || '',
    applicationDeadline: formData.applicationDeadline || '',
    projectType: formData.projectType?.trim() || '',
    contactInfo: {
      email: formData.contactEmail?.trim() || '',
      discord: formData.contactDiscord?.trim() || '',
      other: formData.contactOther?.trim() || '',
    },
    roles:
      formData.roles
        ?.map(role => ({
          id: role.id || Date.now().toString(),
          title: role.customRole?.trim() || role.title?.trim() || '',
          description:
            role.roleDescription?.trim() || role.description?.trim() || '',
          requiredSkills: role.requiredSkills?.trim() || '',
          status: 'available',
        }))
        .filter(role => role.title && role.description) || [],
    author: {
      id: 'alice',
      name: 'Alice Chen',
      avatar: null,
      role: 'Initiator',
    },
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    views: 0,
    applications: [],
  };
};

const apiData = formatFormDataForAPI(formData);
console.log('2. API 格式化后数据:', apiData);

// 3. 模拟 formatAPIDataForDetail 函数
const formatAPIDataForDetail = apiData => {
  return {
    id: apiData.id,
    title: apiData.title,
    author: {
      id: apiData.author?.id,
      title: apiData.title,
      artist: apiData.author?.name || 'Unknown',
      artistAvatar: apiData.author?.avatar || null,
      description: apiData.description,
      image: apiData.heroImage || null,
      category: apiData.projectType || 'Project',
      likes: apiData.likes || 0,
      views: apiData.views || 0,
      timeAgo: '2 hours ago',
      role: apiData.author?.role || 'Initiator',
    },
    duration: apiData.duration,
    teamSize: apiData.teamSize,
    postedTime: '2 hours ago',
    tags: apiData.projectType ? [apiData.projectType] : [],
    heroImage: apiData.heroImage || apiData.posterPreview || null,
    description: apiData.description,
    meetingFrequency: apiData.meetingSchedule,
    deadline: apiData.applicationDeadline || apiData.deadline,
    applicationDeadline: apiData.applicationDeadline || apiData.deadline,
    contactInfo: apiData.contactInfo,
    status: apiData.status,
    // 保留原始字段，确保 processProjectData 能读取到
    projectVision: apiData.projectVision,
    whyThisMatters: apiData.whyThisMatters,
    vision: {
      tagline: apiData.projectVision,
      narrative: apiData.whyThisMatters,
      lookingFor: apiData.roles?.map(role => role.title) || [],
      hiringTargets: apiData.roles?.map(role => role.title) || [],
      contact: apiData.contactInfo,
    },
    milestones: [],
  };
};

const detailData = formatAPIDataForDetail(apiData);
console.log('3. 详情页格式化后数据:', detailData);

// 4. 模拟 processProjectData 函数
const processProjectData = projectData => {
  return {
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
    deadline: projectData.applicationDeadline || projectData.deadline || null,
    applicationDeadline:
      projectData.applicationDeadline || projectData.deadline || null,
    contactInfo: {
      discord: projectData.contactDiscord || null,
      email: projectData.contactEmail || null,
    },
    status: 'in_progress',
    vision: {
      tagline: projectData.vision?.tagline || projectData.projectVision || '',
      narrative:
        projectData.vision?.narrative || projectData.whyThisMatters || '',
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
};

const processedData = processProjectData(detailData);
console.log('4. 最终处理后的数据:', processedData);

// 5. 验证显示逻辑
console.log('\n=== 显示逻辑验证 ===');
console.log(
  'Project Vision 应该显示:',
  !!processedData.vision?.tagline && processedData.vision.tagline.trim() !== ''
);
console.log(
  'Why This Matters 应该显示:',
  !!processedData.vision?.narrative &&
    processedData.vision.narrative.trim() !== ''
);

console.log('\n=== 预期结果 ===');
console.log('✅ Project Vision:', processedData.vision?.tagline);
console.log('✅ Why This Matters:', processedData.vision?.narrative);

console.log('\n=== 数据流验证完成 ===');

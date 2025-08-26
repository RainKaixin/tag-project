// 相关协作项目数据
export const getRelatedProject = () => ({
  name: 'Mobile App Design Collaboration',
  description: 'Fintech app needs UI/UX designer',
  teamSize: 4,
  deadline: 'Dec 15, 2024',
});

// 初始阶段数据
export const getInitialMilestoneStages = () => [
  {
    id: 1,
    title: 'Project Planning',
    description: 'Define project scope and requirements',
    dueDate: '',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Design Phase',
    description: 'Create wireframes and mockups',
    dueDate: '',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Development',
    description: 'Build the application',
    dueDate: '',
    status: 'pending',
  },
  {
    id: 4,
    title: 'Testing & Launch',
    description: 'Test and deploy the project',
    dueDate: '',
    status: 'pending',
  },
];

// 团队规模选项
export const teamSizeOptions = [
  { value: '2-3', label: 'Less than 3 people' },
  { value: '4-5', label: '4-5 people' },
  { value: '6-8', label: '6-8 people' },
  { value: '9+', label: '9+ people' },
];

// 项目持续时间选项
export const durationOptions = [
  { value: '1-2 weeks', label: '1-2 weeks' },
  { value: '3-4 weeks', label: '3-4 weeks' },
  { value: '1-2 months', label: '1-2 months' },
  { value: '3-4 months', label: '3-4 months' },
  { value: '5-6 months', label: '5-6 months' },
  { value: '6+ months', label: '6+ months' },
];

// 会议安排选项
export const meetingScheduleOptions = [
  { value: '1-2 times/week', label: '1-2 times/week' },
  { value: '2-3 times/week', label: '2-3 times/week' },
  { value: '3-4 times/week', label: '3-4 times/week' },
  { value: 'Daily', label: 'Daily' },
  { value: 'As needed', label: 'As needed' },
];

// 初始表单数据
export const getInitialFormData = () => ({
  title: '',
  projectType: '',
  description: '',
  projectVision: '', // 新增：项目愿景
  whyThisMatters: '', // 新增：项目意义
  teamSize: '',
  duration: '',
  meetingSchedule: '',
  contactEmail: '', // Email - 必填
  contactDiscord: '', // Discord - 可選
  contactOther: '', // Other - 可選
  applicationDeadline: '',
  poster: null, // 新增：招募海报图片
  posterPreview: '', // 新增：图片预览URL
  roles: [
    {
      id: 1,
      customRole: '',
      roleDescription: '',
      requiredSkills: '',
    },
  ],
});

// 创建新角色的模板
export const createNewRole = () => ({
  id: Date.now(),
  customRole: '',
  roleDescription: '',
  requiredSkills: '',
});

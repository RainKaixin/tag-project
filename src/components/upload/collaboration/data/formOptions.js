// 表单选项数据
export const teamSizeOptions = [
  { value: '1-3', label: '1-3 people' },
  { value: '4-6', label: '4-6 people' },
  { value: '7-10', label: '7-10 people' },
  { value: '10+', label: '10+ people' },
];

export const durationOptions = [
  { value: '1-2-weeks', label: '1-2 weeks' },
  { value: '1-month', label: '1 month' },
  { value: '2-3-months', label: '2-3 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: '6+months', label: '6+ months' },
];

export const meetingScheduleOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'as-needed', label: 'As needed' },
];

export const roleTypeOptions = [
  { value: 'designer', label: 'Designer' },
  { value: 'illustrator', label: 'Illustrator' },
  { value: 'developer', label: 'Developer' },
  { value: 'animator', label: 'Animator' },
  { value: 'writer', label: 'Writer' },
  { value: 'photographer', label: 'Photographer' },
];

// 初始表单数据
export const getInitialFormData = () => ({
  title: '',
  projectType: '',
  description: '',
  teamSize: '',
  duration: '',
  meetingSchedule: '',
  contactInfo: '',
  applicationDeadline: '',
  roles: [
    {
      id: 1,
      roleType: '',
      customRole: '',
      roleDescription: '',
      requiredSkills: '',
    },
  ],
});

// 创建新角色的模板
export const createNewRole = () => ({
  id: Date.now(),
  roleType: '',
  customRole: '',
  roleDescription: '',
  requiredSkills: '',
});























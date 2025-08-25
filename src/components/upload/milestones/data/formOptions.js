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
    stageName: '',
    progress: 20,
    posterFiles: [],
    dateAchieved: '',
    relatedSkills: '',
    whatsNext: '',
  },
];

// 创建新阶段的模板
export const createNewStage = () => ({
  id: Date.now(),
  stageName: '',
  progress: 20,
  posterFiles: [],
  dateAchieved: '',
  relatedSkills: '',
  whatsNext: '',
});























// 表单验证函数
export const validateMilestoneStages = milestoneStages => {
  const errors = {};

  if (milestoneStages.length === 0) {
    errors.stages = 'At least one milestone stage is required';
  } else {
    milestoneStages.forEach((stage, index) => {
      if (!stage.stageName.trim()) {
        errors[`stageName${index}`] = 'Stage name is required';
      }
      if (stage.progress < 0 || stage.progress > 100) {
        errors[`progress${index}`] = 'Progress must be between 0 and 100';
      }
      if (!stage.dateAchieved) {
        errors[`dateAchieved${index}`] = 'Date achieved is required';
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 格式化阶段数据用于提交
export const formatMilestoneStagesForSubmission = milestoneStages => {
  return milestoneStages.map(stage => ({
    ...stage,
    progress: parseInt(stage.progress),
    posterFiles: stage.posterFiles || [],
  }));
};

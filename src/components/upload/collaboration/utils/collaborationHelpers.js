// 表单验证函数
export const validateFormData = formData => {
  const errors = {};

  if (!formData.title.trim()) {
    errors.title = 'Project title is required';
  }

  if (!formData.description.trim()) {
    errors.description = 'Project description is required';
  } else if (formData.description.length > 1000) {
    errors.description = 'Project description must be 1000 characters or less';
  }

  // 验证 Project Vision（必填，200字以内）
  if (!formData.projectVision.trim()) {
    errors.projectVision = 'Project vision is required';
  } else if (formData.projectVision.length > 200) {
    errors.projectVision = 'Project vision must be 200 characters or less';
  }

  // 验证 Why This Matters（可选，但如果有内容则限制长度）
  if (formData.whyThisMatters && formData.whyThisMatters.length > 1000) {
    errors.whyThisMatters = 'Why This Matters must be 1000 characters or less';
  }

  if (!formData.teamSize) {
    errors.teamSize = 'Team size is required';
  }

  if (!formData.duration) {
    errors.duration = 'Duration is required';
  }

  if (!formData.contactEmail.trim()) {
    errors.contactEmail = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
    errors.contactEmail = 'Please enter a valid email address';
  }

  if (!formData.applicationDeadline) {
    errors.applicationDeadline = 'Application deadline is required';
  }

  // 验证角色
  if (formData.roles.length === 0) {
    errors.roles = 'At least one role is required';
  } else {
    formData.roles.forEach((role, index) => {
      if (!role.customRole.trim()) {
        errors[`role${index}`] = 'Role name is required';
      }
      if (!role.roleDescription.trim()) {
        errors[`roleDescription${index}`] = 'Role description is required';
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 格式化表单数据用于提交
export const formatFormDataForSubmission = formData => {
  return {
    ...formData,
    // 确保所有字段都有值
    title: formData.title.trim(),
    description: formData.description.trim(),
    projectVision: formData.projectVision.trim(),
    whyThisMatters: formData.whyThisMatters.trim(),
    contactEmail: formData.contactEmail.trim(),
    contactDiscord: formData.contactDiscord.trim(),
    contactOther: formData.contactOther.trim(),
    // 过滤掉空的角色
    roles: formData.roles.filter(
      role => role.customRole.trim() || role.roleDescription.trim()
    ),
  };
};

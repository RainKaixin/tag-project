// 表单验证函数
export const validateFormData = formData => {
  const errors = {};

  if (!formData.title.trim()) {
    errors.title = 'Project title is required';
  }

  if (!formData.description.trim()) {
    errors.description = 'Project description is required';
  }

  if (!formData.teamSize) {
    errors.teamSize = 'Team size is required';
  }

  if (!formData.duration) {
    errors.duration = 'Duration is required';
  }

  if (!formData.contactInfo.trim()) {
    errors.contactInfo = 'Contact information is required';
  }

  if (!formData.applicationDeadline) {
    errors.applicationDeadline = 'Application deadline is required';
  }

  // 验证角色
  if (formData.roles.length === 0) {
    errors.roles = 'At least one role is required';
  } else {
    formData.roles.forEach((role, index) => {
      if (!role.roleType && !role.customRole) {
        errors[`role${index}`] = 'Role type or custom role is required';
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
    roles: formData.roles.map(role => ({
      ...role,
      roleType: role.roleType || role.customRole,
    })),
  };
};























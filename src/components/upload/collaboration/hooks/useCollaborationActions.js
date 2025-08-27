import { useCallback } from 'react';

import { createCollaboration } from '../../../../services/collaborationService';
import { createNewRole } from '../data/formOptions';

const useCollaborationActions = ({ state, setters }) => {
  const { setFormData, setIsSubmitting, setIsSaving } = setters;

  // 清理 blob URL 的函數
  const cleanupBlobUrl = useCallback(url => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
      console.log('[CollaborationActions] Revoked blob URL:', url);
    }
  }, []);

  const handleFormChange = useCallback(
    e => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    },
    [setFormData]
  );

  const handleFileUpload = useCallback(
    e => {
      const files = e.target.files;
      console.log('Collaboration files selected:', files);

      if (files && files.length > 0) {
        const file = files[0];

        // 验证文件类型
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          alert('Please select a valid image file (JPG, PNG)');
          return;
        }

        // 验证文件大小 (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          alert('File size must be less than 5MB');
          return;
        }

        // 清理之前的 blob URL
        if (state.formData.posterPreview) {
          cleanupBlobUrl(state.formData.posterPreview);
        }

        // 创建预览URL（仅用于预览，不存储到数据中）
        const previewUrl = URL.createObjectURL(file);

        // 更新表单数据
        setFormData(prev => ({
          ...prev,
          poster: file,
          posterPreview: previewUrl, // 仅用于预览
        }));

        console.log('File uploaded successfully:', file.name);
      } else {
        // 清理之前的 blob URL
        if (state.formData.posterPreview) {
          cleanupBlobUrl(state.formData.posterPreview);
        }

        // 清除文件数据
        setFormData(prev => ({
          ...prev,
          poster: null,
          posterPreview: '',
        }));
      }
    },
    [setFormData, state.formData, cleanupBlobUrl]
  );

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();
      console.log('Collaboration form submitted:', state.formData);

      // 验证必填字段
      const requiredFields = {
        title: 'Project Title',
        description: 'Project Description',
        projectVision: 'Project Vision',
        contactEmail: 'Contact Email',
        teamSize: 'Team Size',
        duration: 'Duration',
        meetingSchedule: 'Meeting Schedule',
        applicationDeadline: 'Application Deadline',
      };

      const missingFields = [];
      for (const [field, label] of Object.entries(requiredFields)) {
        if (!state.formData[field] || state.formData[field].trim() === '') {
          missingFields.push(label);
        }
      }

      // 验证角色信息
      if (!state.formData.roles || state.formData.roles.length === 0) {
        missingFields.push('At least one Team Role');
      } else {
        const invalidRoles = state.formData.roles.filter(
          role =>
            !role.customRole || !role.roleDescription || !role.requiredSkills
        );
        if (invalidRoles.length > 0) {
          missingFields.push('Complete Team Role information');
        }
      }

      // 如果有缺失字段，显示错误
      if (missingFields.length > 0) {
        alert(
          `Please fill in the following required fields:\n\n${missingFields.join(
            '\n'
          )}`
        );
        return;
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(state.formData.contactEmail)) {
        alert('Please enter a valid email address');
        return;
      }

      try {
        // 设置提交状态
        setIsSubmitting(true);

        // 准备提交数据 - 移除 blob URL，只保留文件对象
        const submissionData = {
          ...state.formData,
          // 移除 blob URL，避免存储到数据库
          posterPreview: null, // 不存储 blob URL
          // 添加当前用户信息
          author: {
            id: 'current_user', // 这里应该从context获取真实用户ID
            name: 'Current User', // 这里应该从context获取真实用户名
            avatar:
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          },
          // 添加时间戳
          createdAt: new Date().toISOString(),
          status: 'active',
          likes: 0,
          views: 0,
        };

        console.log('Submitting collaboration data:', submissionData);

        // 调用真实的API服务
        const result = await createCollaboration(submissionData);

        if (result.success) {
          console.log('Collaboration posted successfully!', result.data);

          // 清理 blob URL
          if (state.formData.posterPreview) {
            cleanupBlobUrl(state.formData.posterPreview);
          }

          // 触发新协作发布事件，通知TAGMe页面更新
          window.dispatchEvent(
            new CustomEvent('collaboration:created', {
              detail: { collaboration: result.data },
            })
          );

          // 显示成功界面
          setters.setShowSuccess(true);
        } else {
          throw new Error(result.error || 'Failed to create collaboration');
        }
      } catch (error) {
        console.error('Error posting collaboration:', error);
        alert('Failed to post collaboration. Please try again.');
      } finally {
        // 重置提交状态
        setIsSubmitting(false);
      }
    },
    [state.formData, setters, cleanupBlobUrl]
  );

  const handleSaveDraft = useCallback(
    async e => {
      e.preventDefault();
      console.log('Saving collaboration draft:', state.formData);

      try {
        // 设置保存状态
        setIsSaving(true);

        // 准备草稿数据
        const draftData = {
          ...state.formData,
          status: 'draft',
          savedAt: new Date().toISOString(),
        };

        console.log('Saving draft data:', draftData);

        // 保存到 localStorage 作为草稿
        const drafts = JSON.parse(
          localStorage.getItem('collaboration_drafts') || '[]'
        );
        const newDraft = {
          id: Date.now().toString(),
          ...draftData,
        };

        // 添加到草稿列表
        drafts.unshift(newDraft);

        // 只保留最近的10个草稿
        const updatedDrafts = drafts.slice(0, 10);

        localStorage.setItem(
          'collaboration_drafts',
          JSON.stringify(updatedDrafts)
        );

        console.log('Draft saved successfully!');

        // 显示成功提示
        alert('Draft saved successfully! You can continue editing later.');
      } catch (error) {
        console.error('Error saving draft:', error);
        alert('Failed to save draft. Please try again.');
      } finally {
        // 重置保存状态
        setIsSaving(false);
      }
    },
    [state.formData, setIsSaving]
  );

  const handleAddRole = useCallback(() => {
    const newRole = createNewRole();
    setFormData(prev => ({
      ...prev,
      roles: [...prev.roles, newRole],
    }));
  }, [setFormData]);

  const handleRemoveRole = useCallback(
    roleId => {
      setFormData(prev => ({
        ...prev,
        roles: prev.roles.filter(r => r.id !== roleId),
      }));
    },
    [setFormData]
  );

  const handleRoleChange = useCallback(
    (roleId, field, value) => {
      setFormData(prev => ({
        ...prev,
        roles: prev.roles.map(role =>
          role.id === roleId ? { ...role, [field]: value } : role
        ),
      }));
    },
    [setFormData]
  );

  return {
    handleFormChange,
    handleFileUpload,
    handleSubmit,
    handleSaveDraft,
    handleAddRole,
    handleRemoveRole,
    handleRoleChange,
  };
};

export default useCollaborationActions;

import { useCallback } from 'react';

import { createNewRole } from '../data/formOptions';

const useCollaborationActions = ({ state, setters }) => {
  const { setFormData } = setters;

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

  const handleFileUpload = useCallback(e => {
    const files = e.target.files;
    console.log('Collaboration files selected:', files);
    // 这里可以添加文件处理逻辑
  }, []);

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      console.log('Collaboration form submitted:', state.formData);

      // 直接显示成功界面
      setters.setShowSuccess(true);
    },
    [state.formData, setters]
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
    handleAddRole,
    handleRemoveRole,
    handleRoleChange,
  };
};

export default useCollaborationActions;

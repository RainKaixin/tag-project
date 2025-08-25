import React from 'react';
import { useNavigate } from 'react-router-dom';

import UploadSuccess from '../UploadSuccess';

// Import hooks

// Import components
import CollaborationForm from './components/CollaborationForm';
import CollaborationHeader from './components/CollaborationHeader';
import CollaborationRoles from './components/CollaborationRoles';
import FileUploadSection from './components/FileUploadSection';
import useCollaborationActions from './hooks/useCollaborationActions';
import useCollaborationState from './hooks/useCollaborationState';

const UploadCollaboration = () => {
  const navigate = useNavigate();

  // Use custom hooks
  const { state, setters } = useCollaborationState();
  const actions = useCollaborationActions({ state, setters });

  // 如果显示成功界面，则渲染UploadSuccess组件
  if (state.showSuccess) {
    return <UploadSuccess module='Collaboration' />;
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <CollaborationHeader />

      {/* Collaboration 表单 */}
      <form onSubmit={actions.handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* 左侧字段 */}
          <div className='space-y-4'>
            <FileUploadSection onFileUpload={actions.handleFileUpload} />
            <CollaborationForm
              formData={state.formData}
              onFormChange={actions.handleFormChange}
            />
          </div>

          {/* 右侧字段 - Team Roles */}
          <CollaborationRoles
            roles={state.formData.roles}
            onAddRole={actions.handleAddRole}
            onRemoveRole={actions.handleRemoveRole}
            onRoleChange={actions.handleRoleChange}
          />
        </div>

        {/* 提交按钮 */}
        <button
          type='submit'
          className='w-full bg-tag-purple text-white font-semibold py-3 rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center'
        >
          <svg
            className='w-5 h-5 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            />
          </svg>
          Post Collaboration TAGMe!
        </button>
      </form>
    </div>
  );
};

export default UploadCollaboration;























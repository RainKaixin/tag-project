import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ValidationModal } from '../../ui';
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

  // 組件卸載時清理 blob URL
  useEffect(() => {
    return () => {
      if (
        state.formData.posterPreview &&
        state.formData.posterPreview.startsWith('blob:')
      ) {
        URL.revokeObjectURL(state.formData.posterPreview);
        console.log('[UploadCollaboration] Cleaned up blob URL on unmount');
      }
    };
  }, [state.formData.posterPreview]);

  // 如果显示成功界面，则渲染UploadSuccess组件
  if (state.showSuccess) {
    return <UploadSuccess module='Collaboration' />;
  }

  return (
    <>
      {/* 验证错误模态框 */}
      <ValidationModal
        isOpen={state.showValidationModal}
        onClose={() => setters.setShowValidationModal(false)}
        errors={state.validationErrors}
        title='Please Complete Required Fields'
      />

      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <CollaborationHeader />

        {/* Collaboration 表单 */}
        <form onSubmit={actions.handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* 左侧字段 */}
            <div className='space-y-4'>
              <FileUploadSection
                onFileUpload={actions.handleFileUpload}
                posterPreview={state.formData.posterPreview}
              />
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

          {/* 按钮组 */}
          <div className='flex gap-4'>
            {/* 保存草稿按钮 */}
            <button
              type='button'
              onClick={actions.handleSaveDraft}
              disabled={state.isSaving}
              className={`flex-1 font-semibold py-3 rounded-md transition-colors duration-200 flex items-center justify-center ${
                state.isSaving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-200 text-purple-700 hover:bg-purple-300'
              }`}
            >
              {state.isSaving ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-purple-700'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
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
                      d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4'
                    />
                  </svg>
                  Save Draft
                </>
              )}
            </button>

            {/* 提交按钮 */}
            <button
              type='submit'
              disabled={state.isSubmitting}
              className={`flex-1 font-semibold py-3 rounded-md transition-colors duration-200 flex items-center justify-center ${
                state.isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-tag-purple text-white hover:bg-purple-700'
              }`}
            >
              {state.isSubmitting ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Posting...
                </>
              ) : (
                <>
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
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UploadCollaboration;

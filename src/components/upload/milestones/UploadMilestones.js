import React from 'react';
import { useNavigate } from 'react-router-dom';

import UploadSuccess from '../UploadSuccess';

// Import hooks

// Import data

// Import components
import MilestonesHeader from './components/MilestonesHeader';
import MilestoneStage from './components/MilestoneStage';
import RelatedProject from './components/RelatedProject';
import { getRelatedProject } from './data/formOptions';
import useMilestonesActions from './hooks/useMilestonesActions';
import useMilestonesState from './hooks/useMilestonesState';

const UploadMilestones = () => {
  const navigate = useNavigate();

  // Use custom hooks
  const { state, setters } = useMilestonesState();
  const actions = useMilestonesActions({ state, setters });

  // 获取相关项目数据
  const relatedProject = getRelatedProject();

  // 如果显示成功界面，则渲染UploadSuccess组件
  if (state.showSuccess) {
    return <UploadSuccess module='Milestones' />;
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <MilestonesHeader />

      <RelatedProject relatedProject={relatedProject} />

      {/* Milestone Stages 表单 */}
      <form onSubmit={actions.handleSubmit} className='space-y-8'>
        {state.milestoneStages.map((stage, index) => (
          <MilestoneStage
            key={stage.id}
            stage={stage}
            index={index}
            isLast={index === state.milestoneStages.length - 1}
            onStageNameChange={actions.handleStageNameChange}
            onProgressChange={actions.handleProgressChange}
            onFileUpload={actions.handleFileUpload}
            onFieldChange={actions.handleFieldChange}
            onRemoveStage={actions.removeStage}
            onAddNewStage={actions.addNewStage}
            onKeyDown={actions.handleKeyDown}
          />
        ))}

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
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          Share All Milestone Stages TAGMe!
        </button>
      </form>
    </div>
  );
};

export default UploadMilestones;

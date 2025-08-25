import React from 'react';

import { ProgressBar, FileUploadArea } from '../../../ui';

const MilestoneStage = ({
  stage,
  index,
  isLast,
  onStageNameChange,
  onProgressChange,
  onFileUpload,
  onFieldChange,
  onRemoveStage,
  onAddNewStage,
  onKeyDown,
}) => {
  return (
    <div className='bg-gray-50 border border-gray-200 rounded-lg p-6'>
      {/* 阶段标题 */}
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-semibold text-gray-800'>
          Milestone Stage {index + 1}
        </h3>
        <button
          type='button'
          onClick={() => onRemoveStage(stage.id)}
          className='text-red-500 hover:text-red-700 text-sm transition-colors'
        >
          Delete Stage
        </button>
      </div>

      {/* Stage Name */}
      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Stage Name
        </label>
        <input
          type='text'
          value={stage.stageName}
          onChange={e => onStageNameChange(stage.id, e.target.value)}
          onKeyDown={onKeyDown}
          placeholder='e.g., Initial Design, Production, Final Review'
          className='w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
        />
      </div>

      {/* Progress Bar */}
      <div className='mb-6'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm text-gray-600'>Stage Progress</span>
          <div className='flex items-center space-x-2'>
            <input
              type='number'
              min='0'
              max='100'
              value={stage.progress}
              onChange={e => onProgressChange(stage.id, e.target.value)}
              onKeyDown={onKeyDown}
              className='w-16 bg-white border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
            />
            <span className='text-sm text-gray-600'>%</span>
          </div>
        </div>
        <ProgressBar progress={stage.progress} />
      </div>

      {/* Milestone Poster */}
      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-3'>
          Milestone Poster
        </label>
        <FileUploadArea
          onFileUpload={e => onFileUpload(stage.id, e)}
          id={`milestone-poster-upload-${stage.id}`}
        >
          <p className='text-gray-600 mb-2'>
            Upload WIP that visually summarizes this stage
          </p>
          <p className='text-xs text-gray-400 mb-4'>Only JPG or PNG, max 5MB</p>
        </FileUploadArea>
        {stage.posterFiles.length > 0 && (
          <div className='mt-3'>
            <p className='text-sm text-gray-600'>
              {stage.posterFiles.length} files selected
            </p>
          </div>
        )}
      </div>

      {/* Date Achieved */}
      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Date Achieved
        </label>
        <input
          type='date'
          value={stage.dateAchieved}
          onChange={e =>
            onFieldChange(stage.id, 'dateAchieved', e.target.value)
          }
          onKeyDown={onKeyDown}
          className='w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
        />
      </div>

      {/* Related Skills */}
      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Related Skills
        </label>
        <input
          type='text'
          value={stage.relatedSkills}
          onChange={e =>
            onFieldChange(stage.id, 'relatedSkills', e.target.value)
          }
          onKeyDown={onKeyDown}
          placeholder='Skills you developed or used in this stage'
          className='w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
        />
      </div>

      {/* What's Next? */}
      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          What's Next?
        </label>
        <textarea
          value={stage.whatsNext}
          onChange={e => onFieldChange(stage.id, 'whatsNext', e.target.value)}
          onKeyDown={onKeyDown}
          placeholder='Share your goals for the next stage...'
          rows={4}
          className='w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
        />
      </div>

      {/* 添加下一个阶段按钮 */}
      {isLast && (
        <div className='text-center'>
          <button
            type='button'
            onClick={onAddNewStage}
            className='bg-tag-purple text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center mx-auto'
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
                d='M12 6v6m0 0v6m0-6h6m-6 0H6'
              />
            </svg>
            Add Next Stage
          </button>
        </div>
      )}
    </div>
  );
};

export default MilestoneStage;

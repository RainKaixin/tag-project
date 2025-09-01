import React from 'react';

import { getCurrentUser } from '../../../utils/currentUser';
import imageStorage from '../../../utils/indexedDB.js';
import ProjectProgressBar from '../../ProjectProgressBar';
import { BackButton, SaveButton, PrimaryButton } from '../../ui';

import CollaborationHeaderImage from './CollaborationHeaderImage';

const CollaborationHeader = ({
  project,
  isSaved,
  onBack,
  onSaveToggle,
  onApplyNow,
  onViewMilestones,
  enableProjectProgressBar = true,
  hasSubmittedApplication = false,
}) => {
  // 获取当前用户信息
  const currentUser = getCurrentUser();

  // 调试信息：检查deadline数据
  console.log('[CollaborationHeader] project:', project);
  console.log(
    '[CollaborationHeader] project.deadline (raw):',
    project?.deadline
  );

  // 改进显示逻辑：检查多个可能的deadline字段
  const deadlineValue = project?.deadline || project?.applicationDeadline || '';
  const shouldShowDeadline = !!deadlineValue && deadlineValue.trim() !== '';
  const deadlineDisplayText = deadlineValue || '';

  console.log('[CollaborationHeader] deadline显示条件:', {
    rawDeadline: project?.deadline,
    applicationDeadline: project?.applicationDeadline,
    deadlineValue,
    deadlineDisplayText,
    shouldShowDeadline,
    hasDeadline: !!deadlineValue,
    notEmpty: deadlineValue?.trim() !== '',
    deadlineType: typeof deadlineValue,
    deadlineLength: deadlineValue?.length,
  });

  // 判断当前用户是否为项目发起人
  const isInitiator = currentUser?.id === project.author?.id;
  return (
    <div className='bg-white border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        {/* Back Button */}
        <BackButton onClick={onBack} text='Back to TAGMe' className='mb-6' />

        {/* Breadcrumb */}
        <div className='flex items-center text-sm text-gray-500 mb-4'>
          <button
            onClick={onBack}
            className='hover:text-tag-blue transition-colors duration-200'
          >
            Collaborations
          </button>
          <span className='mx-2'>/</span>
          <span className='text-gray-900 font-medium'>{project.title}</span>
        </div>

        {/* Hero Image Banner */}
        <div className='relative mb-6'>
          <div className='w-full h-48 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg overflow-hidden relative'>
            {project.heroImage ? (
              <>
                {/* 用户上传的图片作为背景 */}
                <CollaborationHeaderImage
                  imageKey={project.heroImage}
                  alt={project.title}
                />
                {/* 淡紫色覆盖层 */}
                <div className='absolute inset-0 bg-gradient-to-r from-purple-600/30 to-purple-700/30'></div>
              </>
            ) : (
              <div className='w-full h-full bg-gradient-to-r from-purple-600 to-purple-700'></div>
            )}
          </div>
        </div>

        {/* Project Info */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            {project.title}
          </h1>

          {/* Meta Info */}
          <div className='flex flex-wrap items-center gap-6 mb-4 text-sm text-gray-600'>
            <div className='flex items-center gap-2'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span>{project.postedTime}</span>
            </div>

            {/* Deadline - 强制显示测试 */}
            <div className='flex items-center gap-2'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
              <span>
                Deadline:{' '}
                {project?.applicationDeadline ||
                  project?.deadline ||
                  'Flexible'}
              </span>
            </div>

            {/* Contact Info */}
            {/* Email - Always show if available */}
            {project.contactInfo?.email && (
              <div className='flex items-center gap-2'>
                <svg
                  className='w-4 h-4 text-gray-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
                <span className='text-gray-600'>
                  {project.contactInfo.email}
                </span>
              </div>
            )}

            {/* Discord - Only show if filled */}
            {project.contactInfo?.discord && (
              <div className='flex items-center gap-2'>
                <svg
                  className='w-4 h-4 text-gray-500'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z' />
                </svg>
                <span className='text-gray-600'>
                  {project.contactInfo.discord}
                </span>
              </div>
            )}
          </div>

          {/* Tags and CTA Buttons Row */}
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            {/* Tags */}
            <div className='flex flex-wrap gap-2'>
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className='px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full'
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA and Save Buttons */}
            <div className='flex flex-col sm:flex-row gap-3'>
              <SaveButton
                isFavorited={isSaved}
                itemType='collaboration'
                itemId={project.id}
                onToggle={onSaveToggle}
                size='md'
              />
              {!isInitiator && (
                <PrimaryButton
                  onClick={hasSubmittedApplication ? undefined : onApplyNow}
                  size='lg'
                  disabled={hasSubmittedApplication}
                  className={`w-full sm:w-auto transition-all duration-300 ${
                    hasSubmittedApplication
                      ? 'bg-green-600 border-green-600 cursor-not-allowed opacity-75'
                      : 'bg-purple-600 hover:bg-purple-700 border-purple-600'
                  }`}
                >
                  {hasSubmittedApplication ? (
                    <div className='flex items-center gap-2'>
                      <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Application Submitted
                    </div>
                  ) : (
                    'Apply Now'
                  )}
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>

        {/* Project Progress Bar */}
        {enableProjectProgressBar && (
          <div className='w-full'>
            <ProjectProgressBar
              projectId={project.id}
              milestones={project.milestones || []}
              dueDate={project.deadline || project.applicationDeadline}
              onViewMilestones={onViewMilestones}
              isInitiator={isInitiator}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationHeader;

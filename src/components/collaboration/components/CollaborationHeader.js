import React from 'react';

import ProjectProgressBar from '../../ProjectProgressBar';
import { BackButton, SaveButton, PrimaryButton } from '../../ui';

const CollaborationHeader = ({
  project,
  isSaved,
  onBack,
  onSaveToggle,
  onApplyNow,
  onViewMilestones,
  enableProjectProgressBar = true,
}) => {
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
          <div className='w-full h-48 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg overflow-hidden'>
            <img
              src={project.heroImage}
              alt={project.title}
              className='w-full h-full object-cover opacity-20'
            />
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='text-center text-white'>
                <h1 className='text-3xl font-bold mb-2'>Learn</h1>
                <p className='text-lg opacity-90'>
                  Collaborate • Create • Grow
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Info and CTA */}
        <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6'>
          {/* Left - Project Info */}
          <div className='flex-1'>
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
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
                <span>{project.teamSize}</span>
              </div>
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
                <span>Posted {project.postedTime}</span>
              </div>
            </div>

            {/* Tags */}
            <div className='flex flex-wrap gap-2 mb-6'>
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className='px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right - CTA and Save Buttons */}
          <div className='lg:flex-shrink-0 flex flex-col sm:flex-row gap-3'>
            <SaveButton
              isFavorited={isSaved}
              itemType='collaboration'
              itemId={project.id}
              onToggle={onSaveToggle}
              size='md'
            />
            <PrimaryButton
              onClick={onApplyNow}
              size='lg'
              className='w-full sm:w-auto'
            >
              Apply Now
            </PrimaryButton>
          </div>
        </div>

        {/* Project Progress Bar */}
        {enableProjectProgressBar && (
          <div className='w-full'>
            <ProjectProgressBar
              projectId={project.id}
              milestones={project.milestones || []}
              dueDate={project.deadline}
              onViewMilestones={onViewMilestones}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationHeader;

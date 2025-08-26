import React from 'react';

import AfterFinishedReview from '../../collab/AfterFinishedReview_refactored';
import { InfoCard } from '../../ui';

const ProjectDescription = ({
  project,
  enableAfterFinishedReview = true,
  currentUser,
  projectData,
}) => {
  return (
    <div className='lg:col-span-2'>
      <InfoCard className='mb-8'>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>
          Project Description
        </h2>
        <p className='text-gray-700 leading-relaxed mb-6'>
          {project.description}
        </p>

        {/* Project Basic Information */}
        <div className='flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-200'>
          {/* Expected Team Size */}
          <div className='flex items-center gap-2'>
            <svg
              className='w-5 h-5 text-gray-500'
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
            <span className='text-sm text-gray-600'>
              <span className='font-medium'>Expected Team Size:</span>{' '}
              {project.teamSize || 'Not specified'}
            </span>
          </div>

          {/* Duration */}
          <div className='flex items-center gap-2'>
            <svg
              className='w-5 h-5 text-gray-500'
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
            <span className='text-sm text-gray-600'>
              <span className='font-medium'>Duration:</span>{' '}
              {project.duration || 'Not specified'}
            </span>
          </div>

          {/* Meeting Schedule */}
          <div className='flex items-center gap-2'>
            <svg
              className='w-5 h-5 text-gray-500'
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
            <span className='text-sm text-gray-600'>
              <span className='font-medium'>Meeting Schedule:</span>{' '}
              {project.meetingSchedule || 'Not specified'}
            </span>
          </div>
        </div>

        {/* After-Finished Review Section */}
        {enableAfterFinishedReview && (
          <div className='mt-24'>
            <AfterFinishedReview
              isLoggedIn={true}
              isProjectMember={true}
              hasCompletedTasks={true}
              requestStatus='none'
              hasSubmittedFinalComment={false}
              finalComments={[]}
              projectId={projectData?.id || 'proj_01'}
              userId={currentUser?.id || 'bryan'}
              userName={currentUser?.name || 'Bryan'}
              userRole={currentUser?.role || 'Collaborator'}
              projectName={projectData?.title || 'Interactive Web Experience'}
              onSendRequest={() => {}}
              onSubmitComment={text => {}}
            />
          </div>
        )}
      </InfoCard>
    </div>
  );
};

export default ProjectDescription;

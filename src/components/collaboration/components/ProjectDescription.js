import React from 'react';

import AfterFinishedReview from '../../collab/AfterFinishedReview_refactored';
import { InfoCard, MetricCard } from '../../ui';

const ProjectDescription = ({
  project,
  enableAfterFinishedReview = true,
  currentUser,
  projectData,
}) => {
  // 关键指标数据
  const metrics = [
    {
      icon: (
        <svg
          className='w-6 h-6 text-gray-600'
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
      ),
      value: project.duration,
      label: 'Duration',
    },
    {
      icon: (
        <svg
          className='w-6 h-6 text-gray-600'
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
      ),
      value: project.meetingFrequency,
      label: 'Meeting Frequency',
    },
    {
      icon: (
        <svg
          className='w-6 h-6 text-gray-600'
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
      ),
      value: project.deadline,
      label: 'Deadline',
    },
  ];

  return (
    <div className='lg:col-span-2'>
      <InfoCard className='mb-8'>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>
          Project Description
        </h2>
        <p className='text-gray-700 leading-relaxed mb-6'>
          {project.description}
        </p>

        {/* Key Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              icon={metric.icon}
              value={metric.value}
              label={metric.label}
            />
          ))}
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

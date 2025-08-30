import React from 'react';

import { InfoCard } from '../../ui';

import CommentsSection from './CommentsSection';

// 申請者頭像牆組件
const ApplicationsWall = ({ applications = [] }) => {
  if (applications.length === 0) {
    return (
      <div className='text-center py-8'>
        <div className='text-gray-400 mb-2'>
          <svg
            className='w-12 h-12 mx-auto'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1}
              d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
            />
          </svg>
        </div>
        <p className='text-gray-500 text-sm'>No applications yet</p>
        <p className='text-gray-400 text-xs mt-1'>Be the first to apply!</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h4 className='font-semibold text-gray-900'>
          Applications ({applications.length})
        </h4>
        <span className='text-sm text-gray-500'>
          {applications.length}{' '}
          {applications.length === 1 ? 'person' : 'people'} applied
        </span>
      </div>

      <div className='grid grid-cols-8 gap-3'>
        {applications.map((application, index) => (
          <div key={index} className='text-center'>
            <div className='relative group'>
              <img
                src={
                  application.avatar ||
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
                }
                alt={application.name}
                className='w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-purple-300 transition-colors duration-200'
              />
              {application.status === 'approved' && (
                <div className='absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center'>
                  <svg
                    className='w-2 h-2 text-white'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {applications.length > 6 && (
        <div className='text-center'>
          <button className='text-sm text-purple-600 hover:text-purple-700 font-medium'>
            View all {applications.length} applications
          </button>
        </div>
      )}
    </div>
  );
};

const ProjectDescription = ({
  project,
  positions,
  hasSubmittedApplication,
  showWarning,
  appliedPositions,
  onApply,
  onCancelApplication,
  onFillPosition,
  getStatusColor,
  getStatusText,
  currentUser,
}) => {
  // 判断当前用户是否为项目发起人
  const isInitiator = currentUser?.id === project?.author?.id;
  return (
    <div className='lg:col-span-2'>
      <InfoCard className='mb-8'>
        {project.description && (
          <>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>
              Project Description
            </h2>
            <p className='text-gray-700 leading-relaxed mb-6'>
              {project.description}
            </p>
          </>
        )}

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
              {project.meetingFrequency || 'Not specified'}
            </span>
          </div>
        </div>

        {/* Open Positions Section */}
        <div className='mt-24'>
          <h2 className='text-xl font-bold text-gray-900 mb-6'>
            Open Positions
          </h2>
          {!hasSubmittedApplication && !isInitiator && (
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
              <div className='flex items-center gap-2'>
                <svg
                  className='w-5 h-5 text-yellow-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
                <span className='text-yellow-800 text-sm font-medium'>
                  Please 'Apply now' above to activate position applications
                </span>
              </div>
            </div>
          )}

          {hasSubmittedApplication && (
            <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
              <div className='flex items-center gap-2'>
                <svg
                  className='w-5 h-5 text-green-600'
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
                <span className='text-green-800 text-sm font-medium'>
                  Application submitted! You can now apply for specific
                  positions.
                </span>
              </div>
            </div>
          )}

          {/* Positions List */}
          <div className='space-y-4'>
            {positions?.map((position, index) => (
              <div
                key={index}
                className='bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200'
              >
                <div className='flex items-start justify-between mb-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      {position.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        position.status
                      )}`}
                    >
                      {getStatusText(position.status)}
                    </span>
                  </div>
                  <div className='flex gap-2'>
                    {isInitiator ? (
                      // 发起人视角：显示 Fill Position 按钮
                      <button
                        onClick={() => onFillPosition(position.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          position.status === 'filled'
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {position.status === 'filled'
                          ? 'Reopen Position'
                          : 'Fill Position'}
                      </button>
                    ) : (
                      // 合作者/访客视角：显示 Apply 按钮或 Position Filled
                      <>
                        {position.status === 'filled' ? (
                          // 职位已满，显示灰色禁用按钮
                          <button
                            disabled
                            className='px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed'
                          >
                            Position Filled
                          </button>
                        ) : (
                          // 职位可用，显示 Apply 按钮
                          <>
                            <button
                              onClick={() => onApply(position.id)}
                              disabled={
                                !hasSubmittedApplication ||
                                appliedPositions.has(position.id)
                              }
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                appliedPositions.has(position.id)
                                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                  : !hasSubmittedApplication
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-purple-600 text-white hover:bg-purple-700'
                              }`}
                            >
                              {appliedPositions.has(position.id)
                                ? 'Applied'
                                : 'Apply'}
                            </button>

                            {appliedPositions.has(position.id) && (
                              <button
                                onClick={() => onCancelApplication(position.id)}
                                className='px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200'
                              >
                                Cancel
                              </button>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <p className='text-gray-700 text-sm mb-4'>
                  {position.description}
                </p>

                {/* Required Skills */}
                <div className='mb-4'>
                  <h4 className='text-sm font-medium text-gray-900 mb-2'>
                    Required Skills:
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {position.requiredSkills?.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Applications Section */}
                <div className='p-6'>
                  <ApplicationsWall
                    applications={position.applications || []}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </InfoCard>
    </div>
  );
};

export default ProjectDescription;

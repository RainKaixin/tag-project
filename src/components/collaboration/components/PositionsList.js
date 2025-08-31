import React from 'react';

import { InfoCard, PrimaryButton } from '../../ui';

import CommentsSection from './CommentsSection';

// 申請者頭像牆組件
const ApplicationsWall = ({
  applications = [],
  onApplicationClick,
  isInitiator = false,
  positionId, // 添加positionId参数
}) => {
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
                className={`w-12 h-12 rounded-full object-cover border-2 border-gray-200 transition-colors duration-200 ${
                  isInitiator
                    ? 'hover:border-purple-300 cursor-pointer'
                    : 'hover:border-gray-300'
                }`}
                onClick={event => {
                  console.log(
                    '[ApplicationsWall] Clicking application:',
                    application.name
                  );
                  console.log('[ApplicationsWall] Position ID:', positionId);
                  console.log('[ApplicationsWall] Is initiator:', isInitiator);

                  if (isInitiator && onApplicationClick) {
                    onApplicationClick(application, event, positionId);
                  }
                }}
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

const PositionsList = ({
  positions,
  hasSubmittedApplication,
  showWarning,
  appliedPositions,
  selectedPosition,
  activePositionTab,
  comment,
  positionComments,
  onApply,
  onFillPosition,
  onPositionTabClick,
  onCommentChange,
  onSubmitComment,
  navigateToArtist,
  getStatusColor,
  getStatusText,
  currentUser,
  project,
  onApplicationClick,
  isInitiator = false,
}) => {
  return (
    <div className='mt-8'>
      <InfoCard>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold text-gray-900'>Open Positions</h2>
          {!hasSubmittedApplication && (
            <div
              className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
                showWarning ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <svg
                className={`w-4 h-4 transition-colors duration-300 ${
                  showWarning ? 'text-red-500' : 'text-yellow-500'
                }`}
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              <span>
                Please 'Apply now' above to activate position applications
              </span>
            </div>
          )}
        </div>

        <div className='space-y-6'>
          {positions.map(position => (
            <div
              key={position.id}
              className='border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200'
            >
              {/* Position Header */}
              <div className='p-6 border-b border-gray-200'>
                <div className='flex items-start justify-between mb-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                      {position.title}
                    </h3>
                    <div className='flex items-center gap-3'>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          position.status
                        )}`}
                      >
                        {getStatusText(position.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className='text-gray-700 mb-4 leading-relaxed'>
                  {position.description}
                </p>

                {/* Required Skills */}
                <div className='mb-4'>
                  <h4 className='text-sm font-medium text-gray-900 mb-2'>
                    Required Skills:
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {position.skills.map((skill, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Apply/Fill Position Button */}
                {(() => {
                  // 检查当前用户是否为Initiator
                  const isInitiator = currentUser?.id === project?.author?.id;

                  if (position.status === 'available') {
                    if (isInitiator) {
                      // Initiator看到"Fill Position"按钮
                      return (
                        <PrimaryButton
                          onClick={() => onFillPosition(position.id)}
                          size='sm'
                          className='bg-purple-600 hover:bg-purple-700'
                        >
                          Fill Position
                        </PrimaryButton>
                      );
                    } else {
                      // 普通用户看到"Apply"按钮
                      return (
                        <PrimaryButton
                          onClick={() => onApply(position.id)}
                          disabled={
                            !hasSubmittedApplication ||
                            appliedPositions.has(position.id)
                          }
                          size='sm'
                          className={
                            appliedPositions.has(position.id)
                              ? 'bg-green-100 text-green-800 cursor-not-allowed'
                              : !hasSubmittedApplication
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : ''
                          }
                        >
                          {appliedPositions.has(position.id)
                            ? 'Applied'
                            : 'Apply'}
                        </PrimaryButton>
                      );
                    }
                  } else {
                    // 职位已满，显示灰色按钮
                    return (
                      <button
                        disabled
                        className='px-6 py-2 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed'
                      >
                        Position Filled
                      </button>
                    );
                  }
                })()}
              </div>

              {/* Tab Navigation */}
              <div className='flex border-b border-gray-200'>
                <button
                  onClick={() =>
                    onPositionTabClick(position.id, 'applications')
                  }
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors duration-200 ${
                    selectedPosition === position.id &&
                    activePositionTab === 'applications'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Applications
                </button>
                <button
                  onClick={() => onPositionTabClick(position.id, 'comments')}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors duration-200 ${
                    selectedPosition === position.id &&
                    activePositionTab === 'comments'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Discussion Board
                </button>
              </div>

              {/* Tab Content */}
              <div className='p-6'>
                {/* Applications Tab */}
                {selectedPosition === position.id &&
                  activePositionTab === 'applications' && (
                    <ApplicationsWall
                      applications={position.applications || []}
                      onApplicationClick={onApplicationClick}
                      isInitiator={isInitiator}
                      positionId={position.id}
                    />
                  )}

                {/* Comments Tab */}
                {selectedPosition === position.id &&
                  activePositionTab === 'comments' && (
                    <CommentsSection
                      comment={comment}
                      onCommentChange={onCommentChange}
                      onSubmitComment={onSubmitComment}
                      positionComments={positionComments}
                      positionId={position.id}
                      navigateToArtist={navigateToArtist}
                    />
                  )}
              </div>
            </div>
          ))}
        </div>
      </InfoCard>
    </div>
  );
};

export default PositionsList;

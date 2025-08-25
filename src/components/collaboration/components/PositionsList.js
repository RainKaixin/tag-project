import React from 'react';

import { InfoCard, PrimaryButton } from '../../ui';

import CommentsSection from './CommentsSection';

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
  onPositionTabClick,
  onCommentChange,
  onSubmitComment,
  navigateToArtist,
  getStatusColor,
  getStatusText,
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
                      {position.applications > 0 && (
                        <span className='px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800'>
                          {position.applications} applications
                        </span>
                      )}
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

                {/* Apply Button */}
                {position.status === 'available' ? (
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
                    {appliedPositions.has(position.id) ? 'Applied' : 'Apply'}
                  </PrimaryButton>
                ) : (
                  <button
                    disabled
                    className='px-6 py-2 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed'
                  >
                    Position Filled
                  </button>
                )}
              </div>

              {/* Tab Navigation */}
              <div className='flex border-b border-gray-200'>
                <button
                  onClick={() => onPositionTabClick(position.id, 'details')}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors duration-200 ${
                    selectedPosition === position.id &&
                    activePositionTab === 'details'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Position Details
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
                {/* Details Tab */}
                {selectedPosition === position.id &&
                  activePositionTab === 'details' && (
                    <div className='space-y-4'>
                      <div className='bg-gray-50 rounded-lg p-4'>
                        <h4 className='font-semibold text-gray-900 mb-3'>
                          Additional Information
                        </h4>
                        <div className='space-y-2 text-sm'>
                          <div className='flex justify-between'>
                            <span className='text-gray-600'>Work Type:</span>
                            <span className='font-medium'>Remote</span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-gray-600'>
                              Experience Level:
                            </span>
                            <span className='font-medium'>Mid-level</span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-gray-600'>
                              Time Commitment:
                            </span>
                            <span className='font-medium'>
                              15-20 hours/week
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
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

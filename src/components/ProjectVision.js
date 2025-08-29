import React from 'react';

import { useNavigation } from '../utils/navigation';

const ProjectVision = ({ vision, owner, currentUser, onFinalReviewClick }) => {
  // 判断当前用户是否为项目发起人
  const isInitiator = currentUser?.id === owner?.id;

  // 模拟团队成员数据（只包含 Collaborators，不包含 Initiator）
  const teamMembers = [
    {
      id: 'alex',
      name: 'Alex Chen',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-48f60103fc96?w=100&h=100&fit=crop&crop=face',
      role: 'Collaborator',
    },
    {
      id: 'maya',
      name: 'Maya Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      role: 'Collaborator',
    },
    {
      id: 'david',
      name: 'David Lee',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      role: 'Collaborator',
    },
  ];
  const { navigateToArtist } = useNavigation();

  const handleOwnerClick = () => {
    console.log('[ProjectVision] Owner data:', owner);
    console.log('[ProjectVision] Owner ID:', owner.id);
    console.log('[ProjectVision] Owner artist:', owner.artist);

    if (owner.id) {
      console.log('[ProjectVision] Navigating to artist:', owner.id);
      navigateToArtist(owner.id, 'collaboration', 'Profile');
    } else {
      console.warn('[ProjectVision] No artist ID found for owner:', owner);
      console.warn(
        '[ProjectVision] This means the collaboration data was created without proper author ID'
      );
      // 可以在这里添加用户提示，比如显示一个toast消息
    }
  };
  if (!vision) {
    return (
      <div className='text-center py-8'>
        <p className='text-gray-500'>No project vision available</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Owner Info */}
      <div
        className='flex items-center gap-4 pb-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200'
        onClick={handleOwnerClick}
        title={`View ${owner.artist}'s profile`}
      >
        {owner.artistAvatar ? (
          <img
            src={owner.artistAvatar}
            alt={owner.artist}
            className='w-12 h-12 rounded-full object-cover'
            onError={e => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className='w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center'>
            <span className='text-lg text-gray-600 font-medium'>
              {owner.artist?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        )}
        <div>
          <div className='font-medium text-gray-900'>{owner.artist}</div>
          <div className='text-sm text-gray-500'>
            {owner.role === 'Initiator' ? (
              <span className='inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full'>
                Initiator
              </span>
            ) : (
              owner.role
            )}
          </div>
        </div>
      </div>

      {/* Tagline */}
      {vision.tagline && (
        <div>
          <h4 className='text-lg font-semibold text-gray-900 mb-2'>
            Project Vision
          </h4>
          <p className='text-gray-700 italic'>"{vision.tagline}"</p>
        </div>
      )}

      {/* Narrative */}
      {vision.narrative && (
        <div>
          <h4 className='text-lg font-semibold text-gray-900 mb-2'>
            Why This Matters
          </h4>
          <div className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
            {vision.narrative}
          </div>
        </div>
      )}

      {/* Looking For Tags */}
      {vision.lookingFor && vision.lookingFor.length > 0 && (
        <div>
          <h4 className='text-lg font-semibold text-gray-900 mb-2'>
            Looking For
          </h4>
          <div className='flex flex-wrap gap-2'>
            {vision.lookingFor.map((tag, index) => (
              <span
                key={index}
                className='px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full'
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Team Members */}
      <div>
        <h4 className='text-lg font-semibold text-gray-900 mb-3'>
          Collaborators
        </h4>
        <div className='space-y-3'>
          {teamMembers.map(member => (
            <div
              key={member.id}
              className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200'
            >
              {/* Avatar */}
              <div className='flex-shrink-0'>
                <img
                  src={member.avatar}
                  alt={member.name}
                  className='w-10 h-10 rounded-full object-cover'
                  onError={e => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              {/* Name and Role */}
              <div className='flex-1 min-w-0'>
                <div className='font-medium text-gray-900 truncate'>
                  {member.name}
                </div>
                <div className='flex items-center gap-2 mt-1'>
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      member.role === 'Initiator'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Final Review Button - 只有 Initiator 可以看到 */}
              {isInitiator && (
                <button
                  onClick={() =>
                    onFinalReviewClick && onFinalReviewClick(member)
                  }
                  className='px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200 flex-shrink-0'
                >
                  Final Review
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectVision;

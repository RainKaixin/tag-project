import React from 'react';

const ProjectVision = ({ vision, owner }) => {
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
      <div className='flex items-center gap-4 pb-4 border-b border-gray-200'>
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
          <div className='text-sm text-gray-500'>{owner.role}</div>
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

      {/* Hiring Targets */}
      {vision.hiringTargets && vision.hiringTargets.length > 0 && (
        <div>
          <h4 className='text-lg font-semibold text-gray-900 mb-2'>
            Looking For
          </h4>
          <div className='flex flex-wrap gap-2'>
            {vision.hiringTargets.map((target, index) => (
              <span
                key={index}
                className='px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full'
              >
                {target}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectVision;

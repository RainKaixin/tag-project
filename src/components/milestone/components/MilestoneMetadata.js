import React from 'react';
import { Link } from 'react-router-dom';

const MilestoneMetadata = ({ project, onNavigateToArtist }) => {
  return (
    <div className='space-y-6'>
      {/* Project Basic Information */}
      <div className='bg-gray-50 rounded-lg p-4'>
        <h3 className='font-semibold text-gray-900 mb-3'>Project Details</h3>
        <div className='space-y-3'>
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
      </div>

      {/* Team Lead */}
      <div className='bg-gray-50 rounded-lg p-4'>
        <h3 className='font-semibold text-gray-900 mb-3'>Team Lead</h3>
        <div className='flex items-center gap-3'>
          <img
            src={
              project.teamLead?.artistAvatar ||
              project.teamMembers[0]?.artistAvatar ||
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
            }
            alt={
              project.teamLead?.artist ||
              project.teamMembers[0]?.artist ||
              'Team Lead'
            }
            className='w-12 h-12 rounded-full'
          />
          <div>
            <div className='font-medium text-gray-900'>
              {project.teamLead?.artist ||
                project.teamMembers[0]?.artist ||
                'Project Lead'}
            </div>
            <div className='text-sm text-gray-500'>
              {project.teamLead?.role ||
                project.teamMembers[0]?.role ||
                'Project Lead'}
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className='bg-gray-50 rounded-lg p-4'>
        <h3 className='font-semibold text-gray-900 mb-3'>Team Members</h3>
        <div className='space-y-3'>
          {project.teamMembers.map((member, index) => (
            <Link
              key={index}
              to={`/artist/${member.id}`}
              className='flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200'
            >
              <img
                src={member.artistAvatar}
                alt={member.artist}
                className='w-8 h-8 rounded-full'
              />
              <div>
                <div className='text-sm font-medium text-gray-900 hover:text-tag-blue transition-colors duration-200'>
                  {member.artist}
                </div>
                <div className='text-xs text-gray-500'>{member.role}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MilestoneMetadata;

import React from 'react';
import { Link } from 'react-router-dom';

const MilestoneMetadata = ({ project, onNavigateToArtist }) => {
  return (
    <div className='space-y-6'>
      {/* Project Info */}
      <div className='bg-gray-50 rounded-lg p-4'>
        <h3 className='font-semibold text-gray-900 mb-3'>Project Details</h3>
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Due Date:</span>
            <span className='font-medium'>{project.dueDate}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Project Type:</span>
            <span className='font-medium'>{project.projectType}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Team Size:</span>
            <span className='font-medium'>{project.teamSize} Members</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className='bg-gray-50 rounded-lg p-4'>
        <h3 className='font-semibold text-gray-900 mb-3'>Tags</h3>
        <div className='flex flex-wrap gap-2'>
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className='px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full'
            >
              {tag}
            </span>
          ))}
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

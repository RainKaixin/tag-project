import React from 'react';
import { Link } from 'react-router-dom';

import { milestones } from '../data/mockData';
import { getTagColor, getProgressColor } from '../utils/tagmeHelpers';

const MilestoneGrid = ({ onMilestoneClick }) => {
  return (
    <div className='flex-1'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {milestones.map(milestone => (
          <div
            key={milestone.id}
            className='bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md hover:scale-105 transition-all duration-300'
          >
            {/* Milestone Image */}
            <div className='relative'>
              <Link to={`/tagme/milestone/${milestone.id}`} className='block'>
                <img
                  src={milestone.image}
                  alt={milestone.title}
                  className='w-full h-48 object-cover'
                />
              </Link>
            </div>

            {/* Milestone Content */}
            <div className='p-4'>
              <Link to={`/tagme/milestone/${milestone.id}`} className='block'>
                <h3 className='font-bold text-gray-900 mb-1 text-lg hover:text-purple-600 transition-colors duration-200'>
                  {milestone.title}
                </h3>
                <p className='text-sm text-gray-600 mb-4'>
                  {milestone.description}
                </p>
              </Link>

              {/* Progress Bar */}
              <div className='mb-4'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-medium text-gray-700'>
                    Progress
                  </span>
                  <span className='text-sm font-medium text-gray-900'>
                    {milestone.progress}%
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                      milestone.tags[0]
                    )}`}
                    style={{ width: `${milestone.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Tags */}
              <div className='flex flex-wrap gap-2 mb-4'>
                {milestone.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-xs rounded-full font-medium ${getTagColor(
                      tag
                    )}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Team Members and Timestamp */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='flex -space-x-2 mr-3'>
                    {milestone.teamMembers.slice(0, 4).map((member, index) => (
                      <img
                        key={index}
                        src={member.avatar}
                        alt={member.name}
                        className='w-8 h-8 rounded-full border-2 border-white'
                      />
                    ))}
                  </div>
                  <span className='text-sm text-gray-600'>
                    {milestone.teamMembers.length} members
                  </span>
                </div>
                <span className='text-xs text-gray-500'>
                  {milestone.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneGrid;

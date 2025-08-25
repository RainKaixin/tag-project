import React from 'react';
import { Link } from 'react-router-dom';

import { jobs } from '../data/mockData';

const JobGrid = ({ onApplyJob }) => {
  return (
    <div className='flex-1'>
      <div className='text-center py-8 mb-8'>
        <h3 className='text-lg font-medium text-red-500 mb-2'>
          Jobs Coming Soon
        </h3>
        <p className='text-red-400'>
          Job opportunities and internships will be available here.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {jobs.map(job => (
          <div
            key={job.id}
            className='bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300'
          >
            {/* Job Header */}
            <div className='p-4 border-b border-gray-100'>
              <div className='flex items-center justify-between mb-3'>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    job.status === 'Urgent'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {job.status}
                </span>
                <span className='text-xs text-gray-500'>{job.timePosted}</span>
              </div>

              <h3 className='font-bold text-gray-900 text-lg mb-2'>
                {job.title}
              </h3>
              <p className='text-sm text-gray-600 leading-relaxed'>
                {job.description}
              </p>
            </div>

            {/* Job Content */}
            <div className='p-4'>
              {/* Skill Tags */}
              <div className='mb-3'>
                <div className='flex flex-wrap gap-2'>
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className='px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tool Tags */}
              <div className='mb-4'>
                <div className='flex flex-wrap gap-2'>
                  {job.tools.map((tool, index) => (
                    <span
                      key={index}
                      className='px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full font-medium'
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recruiter Info */}
              <div className='flex items-center mb-3'>
                <img
                  src={job.recruiter.avatar}
                  alt={job.recruiter.name}
                  className='w-8 h-8 rounded-full mr-3'
                />
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    {job.recruiter.name}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {job.applicants} applicants
                  </p>
                </div>
              </div>

              {/* Due Date and Apply Button */}
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>
                  Due: {job.dueDate}
                </span>
                <button
                  onClick={() => onApplyJob && onApplyJob(job.id)}
                  className='bg-purple-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-600 transition-colors duration-200'
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobGrid;

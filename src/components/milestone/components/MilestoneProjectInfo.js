import React from 'react';

import ProjectProgressBar from '../../ProjectProgressBar';

const MilestoneProjectInfo = ({ project, onViewProject, milestones = [] }) => {
  return (
    <div className='lg:col-span-2'>
      <h1 className='text-3xl font-bold text-gray-900 mb-3'>{project.title}</h1>

      {/* Project Progress Bar - 與 Collaboration 詳情頁相同 */}
      <ProjectProgressBar
        projectId={project.id}
        milestones={milestones}
        dueDate={project.dueDate}
        isMilestonePage={true}
        onViewMilestones={() => {
          // 這裡可以導航到里程碑詳情或保持當前頁面
          console.log('View milestones for project:', project.id);
        }}
      />

      {/* Looking For Section */}
      <div className='mt-12 mb-4'>
        <h4 className='text-md font-semibold text-gray-900 mb-3'>
          Looking For
        </h4>
        <div className='flex flex-wrap gap-2'>
          <span className='px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full'>
            UI/UX Designer
          </span>
          <span className='px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full'>
            Frontend Developer
          </span>
          <span className='px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full'>
            Motion Designer
          </span>
          <span className='px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full'>
            Product Manager
          </span>
        </div>
      </div>

      {/* View Project Button */}
      <div className='flex justify-end'>
        <button
          onClick={onViewProject}
          className='bg-purple-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl'
        >
          View & Apply
        </button>
      </div>

      {/* Project Vision Content */}
      <div className='mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Project Vision
        </h3>

        {/* Tagline */}
        <div className='mb-4'>
          <p className='text-gray-700 italic text-lg'>
            "Building the future of creative collaboration"
          </p>
        </div>

        {/* Narrative */}
        <div className='mb-4'>
          <h4 className='text-md font-semibold text-gray-900 mb-2'>
            Why This Matters
          </h4>
          <div className='text-gray-700 leading-relaxed whitespace-pre-wrap text-sm'>
            We&apos;re creating a platform that connects talented designers and
            developers to build amazing digital experiences together. Our vision
            is to make collaboration seamless, inspiring, and productive. This
            project will showcase the power of interdisciplinary teamwork and
            innovative design thinking. We&apos;re looking for passionate
            individuals who share our vision and want to make a real impact.
            Join us in building something extraordinary that will revolutionize
            how creative teams work together.
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className='text-md font-semibold text-gray-900 mb-2'>Contact</h4>
          <div className='space-y-2 text-sm text-gray-600'>
            <div className='flex items-center gap-2'>
              <svg
                className='w-4 h-4 text-gray-500'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z' />
              </svg>
              <span>project_lead#1234</span>
            </div>
            <div className='flex items-center gap-2'>
              <svg
                className='w-4 h-4 text-gray-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
              <span>project.lead@email.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneProjectInfo;

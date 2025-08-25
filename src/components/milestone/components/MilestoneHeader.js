const MilestoneHeader = ({ goBack, project }) => {
  return (
    <div className='bg-white border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        {/* Back Button */}
        <button
          onClick={goBack}
          className='flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200'
        >
          <svg
            className='w-5 h-5 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          Back to TAGMe
        </button>

        {/* Breadcrumb */}
        <div className='flex items-center text-sm text-gray-500 mb-4'>
          <button
            onClick={goBack}
            className='hover:text-tag-blue transition-colors duration-200'
          >
            TAGMe
          </button>
          <span className='mx-2'>/</span>
          <span>Milestones</span>
          <span className='mx-2'>/</span>
          <span className='text-gray-900 font-medium'>{project.title}</span>
        </div>
      </div>
    </div>
  );
};

export default MilestoneHeader;

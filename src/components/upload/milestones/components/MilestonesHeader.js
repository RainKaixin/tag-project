
const MilestonesHeader = () => {
  return (
    <div className='text-center mb-8'>
      <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
        <svg
          className='w-8 h-8 text-tag-purple'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 3v18m0-16h12l-2 4 2 4H6'
          />
        </svg>
      </div>
      <h2 className='text-xl font-semibold text-gray-800 mb-2'>
        Share Your Milestone Stages
      </h2>
      <p className='text-gray-600'>
        Track your creative journey through multiple stages
      </p>
    </div>
  );
};

export default MilestonesHeader;























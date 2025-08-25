
const CollaborationHeader = () => {
  return (
    <div className='text-center mb-6'>
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
            d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
          />
        </svg>
      </div>
      <h2 className='text-xl font-semibold text-gray-800 mb-2'>
        Create Collaboration Post
      </h2>
      <p className='text-gray-600'>
        Post a collaboration request to find teammates and partners for your
        projects
      </p>
    </div>
  );
};

export default CollaborationHeader;























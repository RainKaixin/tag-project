
const RelatedProject = ({ relatedProject }) => {
  return (
    <div className='mb-8'>
      <label className='block text-sm font-medium text-gray-700 mb-3'>
        Related Collaboration Project
      </label>
      <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
        <div className='flex justify-between items-start mb-3'>
          <div>
            <h4 className='font-medium text-gray-800'>{relatedProject.name}</h4>
            <p className='text-sm text-gray-600'>
              {relatedProject.description}
            </p>
          </div>
          <button
            type='button'
            className='text-tag-purple text-sm hover:text-purple-700 transition-colors'
          >
            View Project
          </button>
        </div>

        {/* 项目信息 */}
        <div className='flex justify-between text-sm text-gray-600 mb-3'>
          <span>Team: {relatedProject.teamSize} members</span>
          <span>Deadline: {relatedProject.deadline}</span>
        </div>

        <button
          type='button'
          className='text-tag-purple text-sm hover:text-purple-700 transition-colors'
        >
          Link Different Project
        </button>
      </div>
    </div>
  );
};

export default RelatedProject;























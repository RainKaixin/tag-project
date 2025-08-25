// work-description v1: 作品描述组件


/**
 * 作品描述组件
 * @param {Object} workData - 作品数据
 * @param {string} className - 额外的CSS类名
 */
const WorkDescription = ({ workData, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg p-6 mb-6 ${className}`}>
      <h2 className='text-xl font-bold text-gray-900 mb-2'>{workData.title}</h2>
      <p className='text-gray-600 mb-4'>{workData.description}</p>
      <div className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <span className='text-gray-500'>Category:</span>
          <span className='text-gray-900'>{workData.category}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-500'>Date:</span>
          <span className='text-gray-900'>{workData.date}</span>
        </div>
      </div>
    </div>
  );
};

export default WorkDescription;

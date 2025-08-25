import { getStatusColor, getStatusText } from '../utils/milestoneHelpers';

const MilestoneTimeline = ({ milestones }) => {
  return (
    <div className='space-y-6'>
      {milestones.map((milestone, index) => (
        <div
          key={milestone.id}
          className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'
        >
          <div className='flex items-start justify-between mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                {milestone.title}
              </h3>
              <p className='text-sm text-gray-600 mb-2'>
                {milestone.description}
              </p>
              <div className='flex items-center gap-4 text-xs text-gray-500'>
                <span>Due: {milestone.dueDate}</span>
                {milestone.progress > 0 && (
                  <span>{milestone.progress}% complete</span>
                )}
              </div>
            </div>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                milestone.status
              )}`}
            >
              {getStatusText(milestone.status)}
            </span>
          </div>

          {/* Progress Bar */}
          {milestone.progress > 0 && (
            <div className='mb-4'>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-purple-600 h-2 rounded-full transition-all duration-500'
                  style={{ width: `${milestone.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {milestone.images.length > 0 && (
            <div className='flex gap-3 overflow-x-auto pb-2'>
              {milestone.images.map((image, imgIndex) => (
                <div key={imgIndex} className='flex-shrink-0'>
                  <img
                    src={image}
                    alt={`${milestone.title} preview ${imgIndex + 1}`}
                    className='w-24 h-16 object-cover rounded-lg'
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MilestoneTimeline;

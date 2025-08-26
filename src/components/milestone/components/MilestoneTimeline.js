import { getStatusColor, getStatusText } from '../utils/milestoneHelpers';

const MilestoneTimeline = ({ milestones }) => {
  return (
    <div className='space-y-6'>
      {milestones.map((milestone, index) => (
        <div
          key={milestone.id}
          className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative overflow-hidden'
        >
          {/* Milestone Poster as Background */}
          {milestone.images.length > 0 && (
            <div className='absolute inset-0 opacity-10 pointer-events-none'>
              <img
                src={milestone.images[0]}
                alt={`${milestone.title} background`}
                className='w-full h-full object-cover'
              />
            </div>
          )}

          {/* Content with relative positioning */}
          <div className='relative z-10'>
            <div className='flex items-start justify-between mb-4'>
              <div>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full'>
                    Stage {milestone.id}
                  </span>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    {milestone.title}
                  </h3>
                </div>
                <p className='text-sm text-gray-600 mb-2'>
                  {milestone.description}
                </p>
                <div className='flex items-center gap-4 text-xs text-gray-500'>
                  <span>Stage Due Date: {milestone.dueDate}</span>
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default MilestoneTimeline;


const ProjectProgressBar = ({
  projectId,
  milestones = [],
  dueDate,
  onViewMilestones,
}) => {
  // 進度計算邏輯
  const total = milestones.length;
  const completed = milestones.filter(milestone =>
    ['done', 'completed'].includes(milestone.status)
  ).length;
  const percent = Math.round((completed / Math.max(total, 1)) * 100);

  // 處理空數據狀態
  const hasMilestones = total > 0;
  const progressText = hasMilestones
    ? `Completed ${completed} / ${total} milestones`
    : 'No milestones created yet';

  const buttonText = hasMilestones ? 'View Milestones' : 'Create Milestones';
  const isButtonDisabled = !hasMilestones;

  // 點擊處理
  const handleClick = () => {
    if (hasMilestones && onViewMilestones) {
      onViewMilestones(projectId);
    }
  };

  return (
    // widen progress: 移除宽度限制，占满容器宽度
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 w-full'>
      {/* 原样式: w-full lg:w-5/6 */}
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-bold text-gray-900'>Project Progress</h3>
        {dueDate && (
          <span className='text-sm text-gray-600 mr-4'>
            Deadline: {dueDate}
          </span>
        )}
      </div>

      <div
        className='flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200'
        onClick={handleClick}
        role='button'
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label={`${progressText} · Click to view milestone details`}
      >
        {/* 進度條區域 */}
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-gray-700'>
              {progressText}
            </span>
            <span className='text-sm text-gray-600'>{percent}%</span>
          </div>

          {/* 進度條 */}
          <div
            className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'
            role='progressbar'
            aria-valuemin='0'
            aria-valuemax='100'
            aria-valuenow={percent}
            aria-label={`Project progress: ${percent}%`}
          >
            <div
              className={`h-full transition-all duration-300 ease-in-out ${
                hasMilestones ? 'bg-purple-600' : 'bg-gray-400'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* 右側按鈕 */}
        <button
          onClick={e => {
            e.stopPropagation();
            handleClick();
          }}
          disabled={isButtonDisabled}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isButtonDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
          }`}
          aria-label={
            isButtonDisabled
              ? 'No milestones available'
              : 'View milestone details'
          }
        >
          {buttonText}
        </button>
      </div>

      {/* 空態提示 */}
      {!hasMilestones && (
        <div className='mt-3 text-sm text-gray-500 text-center'>
          Start by creating your first milestone to track project progress
        </div>
      )}
    </div>
  );
};

export default ProjectProgressBar;

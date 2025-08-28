const ProjectProgressBar = ({
  projectId,
  milestones = [],
  dueDate,
  onViewMilestones,
  isMilestonePage = false,
  isInitiator = false,
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
    if (hasMilestones && onViewMilestones && !isMilestonePage) {
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

      {hasMilestones ? (
        // 有 Milestones 時的正常顯示
        <div
          className={`flex items-center gap-4 ${
            !isMilestonePage
              ? 'cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200'
              : ''
          }`}
          onClick={!isMilestonePage ? handleClick : undefined}
          role={!isMilestonePage ? 'button' : undefined}
          tabIndex={!isMilestonePage ? 0 : undefined}
          onKeyDown={
            !isMilestonePage
              ? e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                  }
                }
              : undefined
          }
          aria-label={
            !isMilestonePage
              ? `${progressText} · Click to view milestone details`
              : undefined
          }
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
                className='h-full bg-purple-600 transition-all duration-300 ease-in-out'
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* 右側按鈕 - 只在非 Milestone 頁面顯示 */}
          {!isMilestonePage && (
            <button
              onClick={e => {
                e.stopPropagation();
                handleClick();
              }}
              className='px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              aria-label='View milestone details'
            >
              {buttonText}
            </button>
          )}
        </div>
      ) : (
        // 沒有 Milestones 時的禁用狀態
        <div className='flex items-center gap-4 opacity-60'>
          {/* 進度條區域 - 禁用狀態 */}
          <div className='flex-1'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium text-gray-400'>
                {progressText}
              </span>
              <span className='text-sm text-gray-400'>0%</span>
            </div>

            {/* 進度條 - 灰色禁用狀態 */}
            <div
              className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'
              role='progressbar'
              aria-valuemin='0'
              aria-valuemax='100'
              aria-valuenow='0'
              aria-label='Project progress: 0% (disabled - no milestones)'
            >
              <div
                className='h-full bg-gray-400 transition-all duration-300 ease-in-out'
                style={{ width: '0%' }}
              />
            </div>
          </div>

          {/* 右側按鈕 - 禁用狀態 */}
          {!isMilestonePage && (
            <button
              disabled={true}
              className='px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              aria-label='No milestones available'
            >
              {buttonText}
            </button>
          )}
        </div>
      )}

      {/* 空態提示 - 更新為更明確的提示 */}
      {!hasMilestones && (
        <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
          <div className='flex items-start gap-3'>
            <svg
              className='w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
            <div>
              <p className='text-yellow-800 text-sm font-medium mb-1'>
                Set up Milestones now to unlock Project Progress and open the
                Discussion Board!
              </p>
              <p className='text-yellow-700 text-xs'>
                Milestones are the core switch for your project. Without
                milestones, project progress tracking and team discussions are
                disabled.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectProgressBar;

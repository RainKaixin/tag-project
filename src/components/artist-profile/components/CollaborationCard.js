// collaboration-card v1: 合作项目卡片组件


import { getRoleBadgeStyle } from '../utils/artistHelpers';

/**
 * 合作项目卡片组件
 * @param {Object} collaboration - 合作项目数据
 * @param {boolean} isExpanded - 是否展开
 * @param {Function} onToggle - 展开/收起事件
 * @param {string} className - 额外的CSS类名
 */
const CollaborationCard = ({
  collaboration,
  isExpanded,
  onToggle,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-lg overflow-hidden shadow-sm ${className}`}
    >
      {/* 卡片内容 */}
      <div
        onClick={() => onToggle(collaboration.id)}
        className='p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200'
      >
        <div className='flex items-center gap-4'>
          {/* 项目缩略图 */}
          <div className='flex-shrink-0'>
            <img
              src={collaboration.image}
              alt={collaboration.title}
              className='w-16 h-16 object-cover rounded-lg'
            />
          </div>

          {/* 项目信息 */}
          <div className='flex-1 min-w-0'>
            <h4 className='font-medium text-gray-900 mb-1'>
              {collaboration.title}
            </h4>
            <p className='text-sm text-gray-600 mb-2'>
              {collaboration.dateRange}
            </p>

            {/* 角色标签 */}
            <div className='flex items-center gap-2'>
              <span className={getRoleBadgeStyle(collaboration.isInitiator)}>
                {collaboration.role}
                {collaboration.isInitiator && (
                  <span className='ml-1 text-purple-600'>• Initiator</span>
                )}
              </span>
            </div>
          </div>

          {/* 展开指示器 */}
          <div className='flex-shrink-0'>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 展开面板 */}
      {isExpanded && (
        <div className='border-t border-gray-200 bg-gray-50'>
          <div className='p-4 space-y-4'>
            {/* 职责介绍 */}
            <div>
              <h5 className='text-sm font-medium text-gray-900 mb-2'>
                Responsibilities
              </h5>
              <p className='text-sm text-gray-700 leading-relaxed'>
                {collaboration.responsibility}
              </p>
            </div>

            {/* 团队评价 */}
            <div>
              <h5 className='text-sm font-medium text-gray-900 mb-2'>
                Team Feedback
              </h5>
              <div className='bg-white rounded-lg p-3 border border-gray-200'>
                <div className='flex items-start gap-3'>
                  <div className='flex-shrink-0'>
                    <img
                      src={collaboration.partnerAvatar}
                      alt={collaboration.teamFeedback.feedbacker}
                      className='w-8 h-8 rounded-full'
                    />
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='text-sm font-medium text-gray-900'>
                        {collaboration.teamFeedback.feedbacker}
                      </span>
                      <span className='text-xs text-gray-500'>
                        {collaboration.teamFeedback.feedbackerRole}
                      </span>
                    </div>
                    <p className='text-sm text-gray-700 leading-relaxed'>
                      {collaboration.teamFeedback.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationCard;

// collaborations-section v1: 合作项目组件
// 从 MyArtistProfile.js 中提取的合作项目区域

import React from 'react';

/**
 * CollaborationsSection 组件 - 艺术家合作项目展示
 * @param {Object} props - 组件属性
 * @param {Array} props.collaborations - 合作项目数组
 * @param {number|null} props.expandedCardId - 当前展开的卡片ID
 * @param {Function} props.onCollaborationToggle - 合作项目展开/收起处理
 * @returns {JSX.Element} 合作项目组件
 */
const CollaborationsSection = ({
  collaborations,
  expandedCardId,
  onCollaborationToggle,
}) => {
  if (!collaborations || collaborations.length === 0) {
    return (
      <div className='pt-8 mt-8 bg-purple-50 rounded-lg p-6'>
        <h3 className='text-lg font-bold text-gray-900 mb-6'>Collaborations</h3>
        <p className='text-gray-600'>No collaborations available.</p>
      </div>
    );
  }

  return (
    <div className='pt-8 mt-8 bg-purple-50 rounded-lg p-6'>
      <h3 className='text-lg font-bold text-gray-900 mb-6'>Collaborations</h3>
      <div className='space-y-4'>
        {collaborations.map(collab => (
          <div
            key={collab.id}
            className='bg-white rounded-lg overflow-hidden shadow-sm'
          >
            {/* 卡片內容 */}
            <div
              onClick={() => onCollaborationToggle(collab.id)}
              className='p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200'
            >
              <div className='flex items-center gap-4'>
                {/* 項目縮略圖 */}
                <div className='flex-shrink-0'>
                  <img
                    src={collab.image}
                    alt={collab.title}
                    className='w-16 h-16 object-cover rounded-lg'
                  />
                </div>

                {/* 項目信息 */}
                <div className='flex-1 min-w-0'>
                  <h4 className='font-medium text-gray-900 mb-1'>
                    {collab.title}
                  </h4>
                  <p className='text-sm text-gray-600 mb-2'>
                    {collab.dateRange}
                  </p>

                  {/* 角色標籤 */}
                  <div className='flex items-center gap-2'>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        collab.isInitiator
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {collab.role}
                      {collab.isInitiator && (
                        <span className='ml-1 text-purple-600'>
                          • Initiator
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* 展開指示器 */}
                <div className='flex-shrink-0'>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      expandedCardId === collab.id ? 'rotate-180' : ''
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

            {/* 展開面板 */}
            {expandedCardId === collab.id && (
              <div className='border-t border-gray-200 bg-gray-50'>
                <div className='p-4 space-y-4'>
                  {/* 職責介紹 */}
                  <div>
                    <h5 className='text-sm font-medium text-gray-900 mb-2'>
                      Responsibilities
                    </h5>
                    <p className='text-sm text-gray-700 leading-relaxed'>
                      {collab.responsibility}
                    </p>
                  </div>

                  {/* 團隊評價 */}
                  <div>
                    <h5 className='text-sm font-medium text-gray-900 mb-2'>
                      Team Feedback
                    </h5>
                    <div className='bg-white rounded-lg p-3 border border-gray-200'>
                      <div className='flex items-start gap-3'>
                        <div className='flex-shrink-0'>
                          <img
                            src={collab.partnerAvatar}
                            alt={collab.teamFeedback.feedbacker}
                            className='w-8 h-8 rounded-full'
                          />
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='text-sm font-medium text-gray-900'>
                              {collab.teamFeedback.feedbacker}
                            </span>
                            <span className='text-xs text-gray-500'>
                              {collab.teamFeedback.feedbackerRole}
                            </span>
                          </div>
                          <p className='text-sm text-gray-700 leading-relaxed'>
                            {collab.teamFeedback.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborationsSection;

// collaboration-card v1: 合作项目卡片组件

import React, { useState } from 'react';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedResponsibility, setEditedResponsibility] = useState(
    collaboration.responsibility
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: 這裡應該調用 API 來保存更新
    console.log('Saving responsibility:', editedResponsibility);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedResponsibility(collaboration.responsibility);
    setIsEditing(false);
  };
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
          <div className='p-6 space-y-6'>
            {/* 职责介绍 */}
            <div className='bg-gray-100 rounded-lg p-4 relative'>
              <div className='flex items-center justify-between mb-3'>
                <h5 className='text-lg font-semibold text-gray-900'>
                  Responsibilities
                </h5>
                <button
                  onClick={handleEdit}
                  className='p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200'
                  title='Edit responsibilities'
                >
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                    />
                  </svg>
                </button>
              </div>

              {isEditing ? (
                <div className='space-y-3'>
                  <textarea
                    value={editedResponsibility}
                    onChange={e => setEditedResponsibility(e.target.value)}
                    className='w-full p-3 border border-gray-300 rounded-lg text-base text-gray-800 leading-relaxed resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    rows={4}
                    placeholder='Describe your responsibilities in this project...'
                  />
                  <div className='flex gap-2'>
                    <button
                      onClick={handleSave}
                      className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium'
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 text-sm font-medium'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className='text-base text-gray-800 leading-relaxed font-normal'>
                  {editedResponsibility}
                </p>
              )}
            </div>

            {/* 团队评价 */}
            <div>
              <h5 className='text-base font-semibold text-gray-900 mb-3'>
                Team Feedback
              </h5>
              <div className='bg-white rounded-lg p-4 border border-gray-200 shadow-sm'>
                <div className='flex items-start gap-4'>
                  <div className='flex-shrink-0'>
                    <img
                      src={collaboration.partnerAvatar}
                      alt={collaboration.teamFeedback.feedbacker}
                      className='w-10 h-10 rounded-full'
                    />
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='text-sm font-semibold text-gray-900'>
                        {collaboration.teamFeedback.feedbacker}
                      </span>
                      <span className='text-xs text-gray-500 font-normal'>
                        {collaboration.teamFeedback.feedbackerRole}
                      </span>
                    </div>
                    <p className='text-sm text-gray-700 leading-relaxed font-medium'>
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

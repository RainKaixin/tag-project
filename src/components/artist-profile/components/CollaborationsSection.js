// collaborations-section v1: 合作项目区域组件

import React from 'react';

import CollaborationCard from './CollaborationCard';

/**
 * 合作项目区域组件
 * @param {Array} collaborations - 合作项目数据数组
 * @param {number|null} expandedCardId - 展开的卡片ID
 * @param {Function} onCollaborationToggle - 合作项目展开/收起事件
 * @param {string} className - 额外的CSS类名
 */
const CollaborationsSection = ({
  collaborations,
  expandedCardId,
  onCollaborationToggle,
  className = '',
}) => {
  return (
    <div className={`pt-8 mt-8 bg-purple-50 rounded-lg p-6 ${className}`}>
      <h3 className='text-lg font-bold text-gray-900 mb-6'>Collaborations</h3>
      <div className='space-y-4'>
        {collaborations.map(collab => (
          <CollaborationCard
            key={collab.id}
            collaboration={collab}
            isExpanded={expandedCardId === collab.id}
            onToggle={onCollaborationToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default CollaborationsSection;

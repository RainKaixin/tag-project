// community-notice v1: 社区通知组件
// 从 UploadGuidelines.js 中提取的社区审查通知

import React from 'react';

import { COMMUNITY_LINK } from '../utils/guidelinesData';

/**
 * CommunityNotice 组件 - 社区审查通知
 * @returns {JSX.Element} 社区通知组件
 */
const CommunityNotice = () => {
  return (
    <div className='border-t border-gray-200 pt-6'>
      <p className='text-gray-600 text-center'>
        All uploads are subject to review by our{' '}
        <a
          href={COMMUNITY_LINK.href}
          className='text-tag-blue hover:text-tag-dark-blue font-medium'
        >
          {COMMUNITY_LINK.text}
        </a>
        . Content that violates our community guidelines may be removed.
      </p>
    </div>
  );
};

export default CommunityNotice;

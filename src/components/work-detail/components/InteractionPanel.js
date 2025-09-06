// interaction-panel v1: 交互面板组件

import React from 'react';
import { useNavigate } from 'react-router-dom';

import { extractTags } from '../../../utils/tagParser';
import { renderTagList } from '../../../utils/tagRenderer';
import { SaveButton } from '../../ui';
import {
  getLikeButtonStyle,
  getSaveButtonStyle,
  formatViewCount,
} from '../utils/workDetailHelpers';

/**
 * 交互面板组件
 * @param {Object} workData - 作品数据
 * @param {boolean} isLiked - 是否已点赞
 * @param {boolean} isSaved - 是否已收藏
 * @param {Function} onLikeClick - 点赞按钮点击事件
 * @param {Function} onSaveClick - 收藏按钮点击事件
 * @param {string} className - 额外的CSS类名
 */
const InteractionPanel = ({
  workData,
  isLiked,
  isSaved,
  onLikeClick,
  onSaveClick,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg p-6 mb-6 ${className}`}>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-3'>
          {/* Like Button */}
          <button onClick={onLikeClick} className={getLikeButtonStyle(isLiked)}>
            <svg
              className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
              />
            </svg>
            {workData.likes}
          </button>

          {/* Save Button */}
          <SaveButton
            isFavorited={isSaved}
            itemType='work'
            itemId={workData.id}
            onToggle={onSaveClick}
            size='md'
          />
        </div>

        {/* View Count */}
        <div className='flex items-center text-gray-500'>
          <svg
            className='w-5 h-5 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
            />
          </svg>
          {formatViewCount(workData.views)}
        </div>
      </div>

      {/* Tags and Software */}
      <div className='flex flex-wrap gap-2'>
        {/* 自定義標籤 (Tags) - 綠色，可點擊 */}
        {workData.tags &&
          workData.tags.length > 0 &&
          workData.tags.map((tag, index) => {
            // 判斷標籤類型：
            // 1. 如果標籤以#開頭 → 原本格式的可點擊標籤
            // 2. 如果標籤不以#開頭 → 數據遷移後的乾淨格式，需要重新包裝為可點擊標籤

            if (tag.startsWith('#')) {
              // 原本格式：直接使用標籤解析器處理
              const parsedTags = extractTags(tag);
              if (parsedTags.length > 0) {
                return (
                  <div key={`tag-${index}`} className='inline-block'>
                    {renderTagList(
                      parsedTags,
                      null,
                      'px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 cursor-pointer'
                    )}
                  </div>
                );
              }
            } else {
              // 乾淨格式：重新包裝為可點擊標籤
              const cleanTag = tag.trim();
              if (cleanTag) {
                // 創建臨時標籤對象，模擬原本的格式
                const tempTag = {
                  name: cleanTag,
                  slug: cleanTag.toLowerCase().replace(/\s+/g, '-'),
                };

                return (
                  <div key={`tag-${index}`} className='inline-block'>
                    {renderTagList(
                      [tempTag],
                      null,
                      'px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 cursor-pointer'
                    )}
                  </div>
                );
              }
            }

            // 如果無法處理，顯示為普通文本
            return (
              <span
                key={`tag-${index}`}
                className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium'
              >
                {tag}
              </span>
            );
          })}

        {/* 軟件標籤 (Software) - 藍色，不可點擊 */}
        {workData.software &&
          workData.software.length > 0 &&
          workData.software.map((software, index) => {
            return (
              <span
                key={`software-${index}`}
                className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'
              >
                {software}
              </span>
            );
          })}

        {/* 如果沒有任何標籤 */}
        {(!workData.tags || workData.tags.length === 0) &&
          (!workData.software || workData.software.length === 0) && (
            <span className='text-gray-500 text-sm'>No tags</span>
          )}
      </div>
    </div>
  );
};

export default InteractionPanel;

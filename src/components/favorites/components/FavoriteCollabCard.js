import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
  getCollaborationImageUrl,
  getCollaborationDataById,
} from '../utils/favoritesHelpers';

/**
 * 收藏的Collaboration卡片组件 - 简化版
 * @param {Object} props - 组件属性
 * @param {Object} props.favorite - 收藏数据
 * @param {boolean} props.isOwnProfile - 是否为当前用户查看自己的档案
 * @param {Function} props.onRemove - 移除收藏回调
 */
const FavoriteCollabCard = ({ favorite, isOwnProfile = false, onRemove }) => {
  const navigate = useNavigate();

  // 根据itemId获取正确的协作图片
  const getCollabImage = itemId => {
    console.log(
      '[FavoriteCollabCard] Getting image for itemId:',
      itemId,
      'type:',
      typeof itemId
    );

    const collaboration = getCollaborationDataById(itemId);
    const imageUrl = getCollaborationImageUrl(itemId);

    console.log('[FavoriteCollabCard] Selected collaboration:', collaboration);
    console.log('[FavoriteCollabCard] Selected image URL:', imageUrl);

    return imageUrl;
  };

  const handleRemoveClick = e => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <div className='relative aspect-[4/3] bg-tag-purple rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden'>
      {/* 协作图片链接 */}
      <Link to={`/collab/${favorite.itemId}`} className='block w-full h-full'>
        <img
          src={getCollabImage(favorite.itemId)}
          alt='Collaboration'
          className='w-full h-full object-cover'
        />
      </Link>

      {/* 紫色识别条 */}
      <div className='absolute bottom-0 left-0 right-0 h-2 bg-tag-purple'></div>

      {/* 移除按钮 - 只有档案所有者才能看到 */}
      {isOwnProfile && (
        <button
          onClick={handleRemoveClick}
          className='absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-200'
          title='Remove from favorites'
        >
          <svg
            className='w-4 h-4 text-gray-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default FavoriteCollabCard;

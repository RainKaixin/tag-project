import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useWorkData } from '../hooks/useWorkData';

/**
 * 收藏的Work卡片组件 - 简化版
 * @param {Object} props - 组件属性
 * @param {Object} props.favorite - 收藏数据
 * @param {boolean} props.isOwnProfile - 是否为当前用户查看自己的档案
 * @param {Function} props.onRemove - 移除收藏回调
 */
const FavoriteWorkCard = ({ favorite, isOwnProfile = false, onRemove }) => {
  const navigate = useNavigate();
  const { getWorkById, loading: worksLoading } = useWorkData();

  // 获取作品数据
  const workData = getWorkById(favorite.item_id);

  // 处理图片加载错误
  const handleImageError = e => {
    console.error('[FavoriteWorkCard] Image failed to load:', e.target.src);
    // 如果图片加载失败，使用默认占位图片
    e.target.src = '/assets/placeholder.svg';
  };

  const handleRemoveClick = e => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <div className='relative aspect-[4/3] bg-tag-blue rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden'>
      {/* 作品图片链接 */}
      <Link to={`/work/${favorite.item_id}`} className='block w-full h-full'>
        <img
          src={
            workData?.image?.url || workData?.image || '/assets/placeholder.svg'
          }
          alt={workData?.title || 'Work'}
          className='w-full h-full object-cover'
          onError={handleImageError}
          onLoad={() =>
            console.log(
              '[FavoriteWorkCard] Image loaded successfully:',
              workData?.image
            )
          }
        />
      </Link>

      {/* 蓝色识别条 */}
      <div className='absolute bottom-0 left-0 right-0 h-2 bg-tag-blue'></div>

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

export default FavoriteWorkCard;

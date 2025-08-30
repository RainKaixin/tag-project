import React, { useState, useEffect } from 'react';
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
  const [imageUrl, setImageUrl] = useState(null);
  const [collaboration, setCollaboration] = useState(null);
  const [loading, setLoading] = useState(true);

  // 加载协作数据和图片
  useEffect(() => {
    const loadCollaborationData = async () => {
      try {
        console.log(
          '[FavoriteCollabCard] Loading data for itemId:',
          favorite.itemId
        );

        // 获取协作数据
        const collabData = getCollaborationDataById(favorite.itemId);
        setCollaboration(collabData);

        if (collabData) {
          // 获取图片URL
          const imgUrl = await getCollaborationImageUrl(favorite.itemId);
          setImageUrl(imgUrl);
          console.log('[FavoriteCollabCard] Loaded image URL:', imgUrl);
        } else {
          console.warn(
            '[FavoriteCollabCard] No collaboration data found for itemId:',
            favorite.itemId
          );
        }
      } catch (error) {
        console.error(
          '[FavoriteCollabCard] Error loading collaboration data:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadCollaborationData();
  }, [favorite.itemId]);

  const handleRemoveClick = e => {
    e.stopPropagation();
    onRemove();
  };

  const handleCardClick = () => {
    // 跳转到协作详情页
    navigate(`/collab/${favorite.itemId}`);
  };

  if (loading) {
    return (
      <div className='relative aspect-[4/3] bg-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='w-full h-full flex items-center justify-center'>
          <div className='text-gray-500'>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className='relative aspect-[4/3] bg-tag-purple rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer'
      onClick={handleCardClick}
    >
      {/* 协作图片 */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={collaboration?.title || 'Collaboration'}
          className='w-full h-full object-cover'
        />
      ) : (
        <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
          <div className='text-gray-500 text-sm'>No Image</div>
        </div>
      )}

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

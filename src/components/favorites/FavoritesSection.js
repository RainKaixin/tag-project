import React from 'react';

import FavoriteCollabCard from './components/FavoriteCollabCard';
import FavoritesEmpty from './components/FavoritesEmpty';
import FavoritesSkeleton from './components/FavoritesSkeleton';
import FavoriteWorkCard from './components/FavoriteWorkCard';
import { useFavoriteActions } from './hooks/useFavoriteActions';
import { useFavorites } from './hooks/useFavorites';
import { useWorkData } from './hooks/useWorkData';

/**
 * Favorites板块主组件
 * 展示用户收藏的Works和Collaborations
 * @param {boolean} isOwnProfile - 是否为当前用户查看自己的档案
 */
const FavoritesSection = ({ isOwnProfile = false }) => {
  const {
    favorites,
    loading,
    error,
    pagination,
    handleLoadMore,
    handleRemoveFavorite: removeFavoriteFromState,
  } = useFavorites();

  const { handleRemoveFavorite } = useFavoriteActions();

  // 预加载作品数据，确保收藏卡片能显示正确的图片
  const { loading: worksLoading } = useWorkData();

  // 渲染收藏项
  const renderFavoriteItem = item => {
    if (item.itemType === 'work') {
      return (
        <FavoriteWorkCard
          key={item.id}
          favorite={item}
          isOwnProfile={isOwnProfile}
          onRemove={async () => {
            const success = await handleRemoveFavorite(item.id);
            if (success) {
              removeFavoriteFromState(item.id);
            }
          }}
        />
      );
    } else if (item.itemType === 'collaboration') {
      return (
        <FavoriteCollabCard
          key={item.id}
          favorite={item}
          isOwnProfile={isOwnProfile}
          onRemove={async () => {
            const success = await handleRemoveFavorite(item.id);
            if (success) {
              removeFavoriteFromState(item.id);
            }
          }}
        />
      );
    }
    return null;
  };

  // 渲染内容
  const renderContent = () => {
    // 优先显示加载状态
    if (loading || worksLoading) {
      return <FavoritesSkeleton />;
    }

    if (error) {
      return (
        <div className='text-center py-8'>
          <p className='text-red-600'>Failed to load favorites: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 px-4 py-2 bg-tag-blue text-white rounded-lg hover:bg-blue-700'
          >
            Retry
          </button>
        </div>
      );
    }

    if (favorites.length === 0) {
      return <FavoritesEmpty />;
    }

    return (
      <>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {favorites.map(renderFavoriteItem)}
        </div>

        {/* 加载更多按钮 */}
        {pagination.hasMore && (
          <div className='text-center mt-8'>
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className='px-6 py-3 bg-tag-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      {/* 标题 */}
      <div className='mb-6'>
        <h2 className='text-xl font-semibold text-gray-800'>Favorites</h2>
      </div>

      {/* 收藏列表 */}
      {renderContent()}
    </div>
  );
};

export default FavoritesSection;

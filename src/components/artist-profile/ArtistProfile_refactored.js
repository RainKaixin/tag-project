// artist-profile-refactored v1: 重构后的艺术家档案主组件

import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useAppContext } from '../../context/AppContext';
import FavoritesSection from '../favorites/FavoritesSection';
import { LoadingSpinner } from '../ui';

import {
  ArtistHeader,
  ArtistSidebar,
  PortfolioGrid,
  CollaborationsSection,
  ErrorPage,
  FollowersModal,
  FollowingModal,
} from './components';
import { useArtistState, useArtistActions, useFollowCount } from './hooks';
import useFollowingCount from './hooks/useFollowingCount';
import { isArtistExists } from './utils/artistHelpers';

/**
 * 重构后的艺术家档案组件
 * 使用自定义hooks和组件化的UI元素
 */
const ArtistProfile = () => {
  const { id } = useParams();

  // 使用自定义hooks管理状态
  const artistState = useArtistState();

  // 使用 useMemo 稳定 setters 对象，避免重复创建
  const setters = useMemo(
    () => ({
      toggleFollow: artistState.toggleFollow,
      toggleExpandedCard: artistState.toggleExpandedCard,
    }),
    [artistState.toggleFollow, artistState.toggleExpandedCard]
  );

  // 使用自定义hooks管理操作
  const actions = useArtistActions({
    state: artistState,
    setters,
  });

  // 使用关注管理Hook
  const followCountState = useFollowCount(
    artistState.artist?.id,
    artistState.followersCount
  );

  // 使用 Following 计数 Hook
  const followingCountState = useFollowingCount(
    artistState.isOwnProfile
      ? artistState.currentUser?.id
      : artistState.artist?.id
  );

  // 弹窗状态管理
  const [followersModalOpen, setFollowersModalOpen] = React.useState(false);
  const [followingModalOpen, setFollowingModalOpen] = React.useState(false);

  // 优先用 artistState.loading，防止错误闪烁
  if (artistState.loading) {
    return <LoadingSpinner />;
  }

  // 弹窗事件处理函数
  const handleFollowersClick = () => {
    setFollowersModalOpen(true);
  };

  const handleFollowingClick = () => {
    setFollowingModalOpen(true);
  };

  const handleCloseFollowersModal = () => {
    setFollowersModalOpen(false);
  };

  const handleCloseFollowingModal = () => {
    setFollowingModalOpen(false);
  };

  // 如果艺术家不存在，显示错误页面
  if (!isArtistExists(artistState.artist)) {
    return <ErrorPage id={id} onBackClick={actions.handleBackClick} />;
  }

  return (
    <div
      className='bg-white min-h-screen'
      key={
        artistState.isOwnProfile
          ? artistState.currentUser?.id
          : artistState.artist?.id
      }
    >
      {/* Header Section */}
      <ArtistHeader
        artist={artistState.artist}
        artworks={artistState.artworks}
        isFollowing={followCountState.isFollowing}
        followersCount={followCountState.followersCount}
        followingCount={followingCountState.followingCount}
        isOwnProfile={artistState.isOwnProfile}
        onBackClick={actions.handleBackClick}
        onEditProfileClick={actions.handleEditProfileClick}
        onPreviewAsVisitorClick={actions.handlePreviewAsVisitorClick}
        onBackToOwnerViewClick={null}
        toggleFollow={followCountState.toggleFollow}
        onFollowersClick={handleFollowersClick}
        onFollowingClick={handleFollowingClick}
        from={artistState.sourceInfo?.from || 'gallery'}
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Main Content */}
        <div className='flex flex-col lg:flex-row gap-8 pt-8'>
          {/* Left Sidebar */}
          <ArtistSidebar
            artist={artistState.artist}
            onSocialLinkClick={actions.handleSocialLinkClick}
          />

          {/* Right Content */}
          <div className='flex-1'>
            {/* Portfolio Grid */}
            <PortfolioGrid
              artworks={artistState.artworks}
              onArtworkClick={actions.handleArtworkClick}
              isOwnProfile={artistState.isOwnProfile}
            />

            {/* Collaborations Section */}
            <CollaborationsSection
              collaborations={artistState.collaborations}
              expandedCardId={artistState.expandedCardId}
              onCollaborationToggle={actions.handleCollaborationToggle}
            />

            {/* Favorites Section */}
            <div className='mt-8'>
              <FavoritesSection isOwnProfile={artistState.isOwnProfile} />
            </div>
          </div>
        </div>
      </div>

      {/* Followers Modal */}
      <FollowersModal
        isOpen={followersModalOpen}
        onClose={handleCloseFollowersModal}
        artistId={artistState.artist?.id}
        isOwnProfile={artistState.isOwnProfile}
        currentUserId={artistState.currentUser?.id}
      />

      {/* Following Modal */}
      <FollowingModal
        isOpen={followingModalOpen}
        onClose={handleCloseFollowingModal}
        userId={
          artistState.isOwnProfile
            ? artistState.currentUser?.id
            : artistState.artist?.id
        }
        isOwnProfile={artistState.isOwnProfile}
        currentUserId={artistState.currentUser?.id}
      />
    </div>
  );
};

export default ArtistProfile;

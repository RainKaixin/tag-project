// artist-profile-refactored v1: 重构后的艺术家档案主组件

import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
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
  const { user, loading: authLoading, status } = useAuth();

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

  // 監聽關注狀態變更事件，實時更新計數
  React.useEffect(() => {
    const handleFollowChanged = event => {
      const { followerId, followingId, isFollowing, operation, type } =
        event.detail;

      console.log('[ArtistProfile] Received follow:changed event:', {
        followerId,
        followingId,
        isFollowing,
        operation,
        type,
      });

      // 如果當前用戶是操作者，需要更新 Following 計數
      if (followerId === user?.id) {
        console.log(
          '[ArtistProfile] Current user performed follow operation, refreshing following count'
        );
        // 觸發 Following 計數刷新
        if (followingCountState.refresh) {
          followingCountState.refresh();
        }
      }

      // 如果當前用戶是被關注者，需要更新 Followers 計數
      if (followingId === artistState.artist?.id) {
        console.log(
          '[ArtistProfile] Current artist was followed/unfollowed, refreshing followers count'
        );
        // 觸發 Followers 計數刷新
        if (followCountState.refresh) {
          followCountState.refresh();
        }
      }
    };

    // 添加事件監聽器
    window.addEventListener('follow:changed', handleFollowChanged);

    // 清理事件監聽器
    return () => {
      window.removeEventListener('follow:changed', handleFollowChanged);
    };
  }, [user?.id, artistState.artist?.id, followingCountState, followCountState]);

  // 等待认证状态就绪
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // 处理路由参数为 "me" 的情况
  if (id === 'me') {
    if (status === 'SIGNED_OUT') {
      // 未登录，跳转到登录页面
      window.location.href = '/login';
      return <LoadingSpinner />;
    }
    if (status === 'LOADING') {
      // 认证状态加载中
      return <LoadingSpinner />;
    }
    if (status === 'SIGNED_IN' && !user?.id) {
      // 已认证但没有用户ID，显示加载状态
      return <LoadingSpinner />;
    }
  }

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
      key={`${id}-${user?.id ?? 'anonymous'}`}
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
        onBackToOwnerViewClick={
          artistState.shouldShowBackToOwnerView
            ? actions.handleBackToOwnerViewClick
            : null
        }
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
              currentUserId={artistState.currentUser?.id}
              viewedUserId={artistState.artist?.id}
            />

            {/* Favorites Section */}
            <div className='mt-8'>
              <FavoritesSection
                isOwnProfile={artistState.isOwnProfile}
                viewedUserId={artistState.artist?.id}
              />
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

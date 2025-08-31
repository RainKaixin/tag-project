// MyArtistProfile_refactored v1: 重构后的艺术家档案主组件
// 从 MyArtistProfile.js 重构而来，使用模块化组件和自定义Hook

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAppContext } from '../../context/AppContext';
import { ArtistHeader } from '../artist-profile/components';

import {
  ArtistSidebar,
  PortfolioSection,
  CollaborationsSection,
} from './components';
import { useArtistData, useArtistActions } from './hooks';

/**
 * MyArtistProfile_refactored 组件 - 重构后的艺术家档案页面
 * @returns {JSX.Element} 艺术家档案页面
 */
const MyArtistProfile_refactored = () => {
  const { id } = useParams();
  const { state } = useAppContext();
  const [expandedCardId, setExpandedCardId] = useState(null);

  // 使用自定义Hook管理数据
  const { currentUser, artist, artworks, collaborations, isLoading } =
    useArtistData();

  // 使用自定义Hook管理操作
  const actions = useArtistActions({ state });

  // 页面初始化时仅执行一次滚动
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // 如果艺术家不存在，显示错误页面
  if (!artist) {
    return (
      <div className='bg-white min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Artist not found
          </h1>
          <p className='text-gray-600 mb-6'>
            Sorry, artist with ID {id} not found.
          </p>
          <button
            onClick={actions.handleBackClick}
            className='bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200'
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  // 如果全局正在加载，显示加载状态
  if (state.isLoading || isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-tag-blue mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading artist profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white min-h-screen'>
      {/* Header Section */}
      <ArtistHeader
        artist={artist}
        artworks={artworks}
        isFollowing={false}
        followersCount={0}
        followingCount={0}
        isOwnProfile={true}
        onBackClick={actions.handleBackClick}
        onEditProfileClick={actions.handleEditProfileClick}
        onPreviewAsVisitorClick={() => {}}
        onBackToOwnerViewClick={null}
        toggleFollow={() => {}}
        onFollowersClick={() => {}}
        onFollowingClick={() => {}}
        from='gallery'
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Main Content */}
        <div className='flex flex-col lg:flex-row gap-8 pt-8'>
          {/* Left Sidebar */}
          <ArtistSidebar artist={artist} />

          {/* Right Content */}
          <div className='flex-1'>
            {/* Portfolio Section */}
            <PortfolioSection
              artworks={artworks}
              onArtworkClick={actions.handleArtworkClick}
            />

            {/* Collaborations Section */}
            <CollaborationsSection
              collaborations={collaborations}
              expandedCardId={expandedCardId}
              onCollaborationToggle={collaborationId =>
                actions.handleCollaborationToggle(
                  collaborationId,
                  setExpandedCardId
                )
              }
              currentUserId={currentUser?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyArtistProfile_refactored;

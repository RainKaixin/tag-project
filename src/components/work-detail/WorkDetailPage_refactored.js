// work-detail-refactored v1: 重构后的作品详情页主组件

import React from 'react';

import { useAppContext } from '../../context/AppContext';
import { validateWorkData, safeGet } from '../../utils/dataValidation';
import { useFollowCount } from '../artist-profile/hooks';
import useFollowingCount from '../artist-profile/hooks/useFollowingCount';
import { LoadingSpinner } from '../ui';

import {
  WorkHeader,
  InteractionPanel,
  CommentsSection,
  AuthorInfo,
  WorkDescription,
  RelatedWorks,
} from './components';
import {
  useWorkDetailState,
  useWorkDetailActions,
  useViewCount,
  useLikeCount,
  useWorkNavigation,
  useRelatedWorks,
} from './hooks';

/**
 * 重构后的作品详情页组件
 * 使用自定义hooks和组件化的UI元素
 */
const WorkDetailPage = () => {
  const { state } = useAppContext();

  // 使用自定义hooks管理状态
  const workDetailState = useWorkDetailState();

  // 使用自定义hooks管理操作
  const actions = useWorkDetailActions({
    state: workDetailState,
    setters: {
      toggleLike: workDetailState.toggleLike,
      toggleSave: workDetailState.toggleSave,
      setComment: workDetailState.setComment,
      setReplyTo: workDetailState.setReplyTo,
      loadComments: workDetailState.loadComments,
      // 添加回复相关的setters
      startReply: workDetailState.startReply,
      cancelReply: workDetailState.cancelReply,
      setReplyDraft: workDetailState.setReplyDraft,
      addCommentOptimistic: workDetailState.addCommentOptimistic,
      replaceTempComment: workDetailState.replaceTempComment,
      removeTempComment: workDetailState.removeTempComment,
    },
  });

  // 使用浏览量管理Hook - 使用可选链避免空值错误
  const viewCountState = useViewCount(
    workDetailState.workData?.id || null,
    workDetailState.workData?.views || 0
  );

  // 使用喜欢管理Hook - 使用可选链避免空值错误
  const likeCountState = useLikeCount(
    workDetailState.workData?.id || null,
    workDetailState.workData?.likes || 0,
    workDetailState.workData || {}
  );

  // 使用关注管理Hook - 使用可选链避免空值错误
  const followCountState = useFollowCount(
    workDetailState.workData?.author?.id || null,
    workDetailState.workData?.author?.followers || 0
  );

  // 使用 Following 计数 Hook - 确保与艺术家档案页面数据一致
  const followingCountState = useFollowingCount(
    workDetailState.workData?.author?.id || null
  );

  // 使用作品导航管理Hook - 使用可选链避免空值错误
  const navigationState = useWorkNavigation(
    workDetailState.workData?.id || null
  );

  // 使用相关作品管理Hook - 使用可选链避免空值错误
  const relatedWorksState = useRelatedWorks(
    workDetailState.workData?.author?.id || null,
    workDetailState.workData?.id || null,
    4
  );

  // 验证作品数据
  const workDataValidation = validateWorkData(workDetailState.workData);
  const safeWorkData = workDataValidation.isValid
    ? workDetailState.workData
    : workDataValidation.fallbackData;

  // 如果正在加载作品数据，显示加载状态
  if (workDetailState.loading) {
    return <LoadingSpinner />;
  }

  // 如果加载出错，显示错误信息
  if (workDetailState.error) {
    return (
      <main className='max-w-7xl mx-auto pt-4 px-4 bg-gray-50 min-h-screen'>
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Error</h2>
            <p className='text-gray-600 mb-4'>{workDetailState.error}</p>
            <button
              onClick={() => window.history.back()}
              className='px-4 py-2 bg-tag-blue text-white rounded-lg hover:bg-blue-600'
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  // 如果没有作品数据，显示未找到信息
  if (!workDetailState.workData) {
    return (
      <main className='max-w-7xl mx-auto pt-4 px-4 bg-gray-50 min-h-screen'>
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Work Not Found
            </h2>
            <p className='text-gray-600 mb-4'>
              The requested work could not be found.
            </p>
            <button
              onClick={() => window.history.back()}
              className='px-4 py-2 bg-tag-blue text-white rounded-lg hover:bg-blue-600'
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  // 如果全局正在加载或图片未加载完成，显示加载状态
  if (state.isLoading || !workDetailState.imagesLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <main className='max-w-7xl mx-auto pt-4 px-4 bg-gray-50 min-h-screen'>
      <div className='flex flex-col lg:flex-row gap-8 py-0'>
        {/* Left Column - Main Content */}
        <div className='flex-1'>
          {/* Work Header */}
          <WorkHeader
            workData={safeWorkData}
            onBackClick={actions.handleBackClick}
            onImageNavigation={actions.handleImageNavigation}
            navigationState={navigationState}
          />

          {/* Interaction Panel */}
          <InteractionPanel
            workData={{
              ...safeWorkData,
              views: viewCountState.viewCount, // 使用实时浏览量
              likes: likeCountState.likeCount, // 使用实时喜欢数
            }}
            isLiked={likeCountState.isLiked} // 使用实时喜欢状态
            isSaved={workDetailState.saved}
            onLikeClick={likeCountState.toggleLike} // 使用新的喜欢切换函数
            onSaveClick={actions.handleSaveClick}
          />

          {/* Comments Section */}
          <CommentsSection
            comments={workDetailState.comments}
            comment={workDetailState.comment}
            onCommentChange={actions.handleCommentChange}
            onCommentSubmit={actions.handleCommentSubmit}
            onCommentUserClick={actions.handleCommentUserClick}
            onCommentLike={actions.handleCommentLike}
            onCommentReply={actions.handleCommentReply}
            onCommentDelete={actions.handleCommentDelete}
            replyingTo={workDetailState.replyingTo}
            replyDrafts={workDetailState.replyDrafts}
            onStartReply={actions.handleStartReply}
            onCancelReply={actions.handleCancelReply}
            onSetReplyDraft={actions.handleSetReplyDraft}
            onSubmitReply={actions.handleSubmitReply}
            replyTo={workDetailState.replyTo}
            onCancelReplyOld={actions.handleCancelReply}
          />
        </div>

        {/* Right Column - Author & Recommendations */}
        <div className='lg:w-80 flex-shrink-0'>
          {/* Author Information */}
          <AuthorInfo
            author={{
              ...safeWorkData.author,
              following: followingCountState.followingCount, // 使用实时数据覆盖静态数据
            }}
            isFollowing={followCountState.isFollowing}
            followersCount={followCountState.followersCount}
            onAuthorClick={actions.handleAuthorClick}
            onFollowClick={followCountState.toggleFollow}
          />

          {/* Work Description */}
          <WorkDescription workData={safeWorkData} />

          {/* Related Works */}
          <RelatedWorks
            relatedWorks={relatedWorksState.relatedWorks}
            authorName={safeWorkData.author.name}
            onAuthorClick={actions.handleAuthorClick}
            onWorkClick={actions.handleRelatedWorkClick}
            loading={relatedWorksState.loading}
          />
        </div>
      </div>
    </main>
  );
};

export default WorkDetailPage;

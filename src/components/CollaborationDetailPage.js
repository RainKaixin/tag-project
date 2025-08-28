import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '../context/AppContext';

import AfterFinishedReview from './collab/AfterFinishedReview_refactored';
import ReviewApprovalPanel from './collab/ReviewApprovalPanel';
import ApplyModal from './collaboration/components/ApplyModal';
import CollaborationHeader from './collaboration/components/CollaborationHeader';
import CommentsSection from './collaboration/components/CommentsSection';
import ProjectDescription from './collaboration/components/ProjectDescription';
import { useCollaborationActions } from './collaboration/hooks/useCollaborationActions';
import { useCollaborationData } from './collaboration/hooks/useCollaborationData';
import ProjectProgressBar from './ProjectProgressBar';
import RightOwnerPanel from './RightOwnerPanel';
import CancelApplicationModal from './ui/CancelApplicationModal';
import SuccessToast from './ui/SuccessToast';

const CollaborationDetailPage = () => {
  const { state } = useAppContext();
  const location = useLocation();

  // 使用自定义hooks管理数据和事件
  const data = useCollaborationData();
  const actions = useCollaborationActions(data, {
    setAppliedPositions: data.setAppliedPositions,
    setSelectedPosition: data.setSelectedPosition,
    setComment: data.setComment,
    setPositionComments: data.setPositionComments,
    setHasSubmittedApplication: data.setHasSubmittedApplication,
    setShowWarning: data.setShowWarning,
    setShowSuccessToast: data.setShowSuccessToast,
    setShowCancelModal: data.setShowCancelModal,
    setCancelPositionId: data.setCancelPositionId,
    setShowApplyModal: data.setShowApplyModal,
    setApplyForm: data.setApplyForm,
    setIsSaved: data.setIsSaved,
    setActivePositionTab: data.setActivePositionTab,
  });

  // 页面初始化时判断是否需要滚动到顶部
  useEffect(() => {
    const isReturningFromBack =
      location.state?.from === 'tagme' ||
      (state.navigationHistory.length > 0 &&
        state.navigationHistory[state.navigationHistory.length - 1].path ===
          '/tagme');

    // 只在非返回情況下滾動到頂部，避免每次渲染都觸發
    if (!isReturningFromBack && location.pathname !== '/tagme') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname]); // 只依賴 pathname，不依賴 location.state 和 state.navigationHistory

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header Section - 使用新的CollaborationHeader组件 */}
      <CollaborationHeader
        project={data.project}
        isSaved={data.isSaved}
        onBack={actions.goBack}
        onSaveToggle={actions.handleSaveToggle}
        onApplyNow={actions.handleApplyNowClick}
        onViewMilestones={actions.handleViewMilestones}
        enableProjectProgressBar={data.enableProjectProgressBar}
      />

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Project Description */}
          <ProjectDescription
            project={data.project}
            positions={data.positions}
            hasSubmittedApplication={data.hasSubmittedApplication}
            showWarning={data.showWarning}
            appliedPositions={data.appliedPositions}
            selectedPosition={data.selectedPosition}
            activePositionTab={data.activePositionTab}
            comment={data.comment}
            positionComments={data.positionComments}
            onApply={actions.handleApply}
            onCancelApplication={actions.handleCancelApplication}
            onPositionTabClick={actions.handlePositionTabClick}
            onCommentChange={e => data.setComment(e.target.value)}
            onSubmitComment={actions.handleCommentSubmit}
            navigateToArtist={actions.navigateToArtist}
            getStatusColor={actions.getStatusColor}
            getStatusText={actions.getStatusText}
          />

          {/* Right Column - Project Owner Panel (Upgraded) */}
          <div className='lg:col-span-1'>
            {/* V2: 新的状态化内容面板 */}
            <RightOwnerPanel
              project={data.project}
              owner={data.project.author}
              currentUser={null} // 暂时为null，实际项目中会传入真实用户
              eligibility={{ isMemberCompleted: true }} // Mock eligibility
            />

            {/* after-finished-review v1 (dev panel) - 开发审批面板 */}
            {data.enableReviewApprovalPanel && (
              <div className='mt-6'>
                <ReviewApprovalPanel
                  projectId={data.project.id}
                  isOwner={true} // 开发模式：总是显示为Owner
                />
              </div>
            )}
          </div>
        </div>

        {/* After-Finished Review - Full Width */}
        <div className='mt-8'>
          <AfterFinishedReview
            isLoggedIn={true}
            isProjectMember={true}
            hasCompletedTasks={true}
            requestStatus='none'
            hasSubmittedFinalComment={false}
            finalComments={[]}
            projectId={data.projectData?.id || 'proj_01'}
            userId={data.currentUser?.id || 'bryan'}
            userName={data.currentUser?.name || 'Bryan'}
            userRole={data.currentUser?.role || 'Collaborator'}
            projectName={
              data.projectData?.title || 'Interactive Web Experience'
            }
            onSendRequest={() => {}}
            onSubmitComment={text => {}}
          />
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={data.showApplyModal}
        onClose={() => data.setShowApplyModal(false)}
        applyForm={data.applyForm}
        onFormChange={actions.handleApplyFormChange}
        onSubmit={actions.handleApplySubmit}
      />

      {/* Success Toast */}
      <SuccessToast
        isVisible={data.showSuccessToast}
        message='Application submitted successfully! You can now apply for specific positions.'
        onClose={() => data.setShowSuccessToast(false)}
        duration={5000}
      />

      {/* Cancel Application Modal */}
      <CancelApplicationModal
        isOpen={data.showCancelModal}
        onClose={actions.handleCloseCancelModal}
        onConfirm={actions.handleConfirmCancelApplication}
        positionTitle={
          data.positions?.find(p => p.id === data.cancelPositionId)?.title ||
          'this position'
        }
      />
    </div>
  );
};

export default CollaborationDetailPage;

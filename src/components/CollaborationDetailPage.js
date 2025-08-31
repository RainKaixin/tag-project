import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '../context/AppContext';
import applicationService from '../services/applicationService';
import { saveApplicationStatus } from '../utils/applicationStorage';

import AfterFinishedReview from './collab/AfterFinishedReview_refactored';
import ReviewApprovalPanel from './collab/ReviewApprovalPanel';
import ApplicationInfoPopover from './collaboration/components/ApplicationInfoPopover';
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
    setPositions: data.setPositions,
    updateProjectData: data.updateProjectData,
    updatePositions: data.updatePositions,
    saveCollaborationData: data.saveCollaborationData,
  });

  // 添加 Final Review 状态管理
  const [selectedCollaboratorForReview, setSelectedCollaboratorForReview] =
    useState(null);

  // 申请人信息Popover状态管理
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationPopover, setShowApplicationPopover] = useState(false);
  const [anchorElement, setAnchorElement] = useState(null);

  // 处理 Final Review 点击
  const handleFinalReviewClick = collaborator => {
    setSelectedCollaboratorForReview(collaborator);
  };

  // 处理针对合作者的评价提交
  const handleCollaboratorReviewSubmit = async commentText => {
    if (!selectedCollaboratorForReview) return;

    const newReview = {
      collaboratorId: selectedCollaboratorForReview.id,
      collaboratorName: selectedCollaboratorForReview.name,
      reviewerId: data.currentUser?.id || 'bryan',
      reviewerName: data.currentUser?.name || 'Bryan',
      text: commentText,
      timestamp: new Date().toISOString(),
    };

    console.log('Submitted review for collaborator:', newReview);

    // 清空选中状态
    setSelectedCollaboratorForReview(null);
  };

  // 处理申请人头像点击
  const handleApplicationClick = (application, event, positionId) => {
    console.log('[handleApplicationClick] Application:', application);
    console.log('[handleApplicationClick] Position ID:', positionId);

    // 关闭当前Popover（如果存在）
    if (showApplicationPopover) {
      setShowApplicationPopover(false);
      setSelectedApplication(null);
      setAnchorElement(null);
    }

    // 从最新的positions数据中获取申请人的真实状态
    const position = data.positions.find(p => p.id === positionId);
    const appInPosition = position?.applications?.find(
      app => app.id === application.id || app.userId === application.userId
    );

    // 打开新的Popover，并保存职位ID信息和最新状态
    const applicationWithPosition = {
      ...application,
      positionId: positionId,
      status: appInPosition?.status || application.status || 'pending', // 使用最新的状态，确保有默认值
    };

    console.log(
      '[handleApplicationClick] Application with position:',
      applicationWithPosition
    );
    console.log(
      '[handleApplicationClick] App in position status:',
      appInPosition?.status
    );
    console.log(
      '[handleApplicationClick] Final application status:',
      applicationWithPosition.status
    );

    console.log(
      '[handleApplicationClick] Application with position:',
      applicationWithPosition
    );
    console.log(
      '[handleApplicationClick] App in position status:',
      appInPosition?.status
    );

    setSelectedApplication(applicationWithPosition);
    setAnchorElement(event.currentTarget);
    setShowApplicationPopover(true);
  };

  // 处理申请人信息Popover关闭
  const handleApplicationPopoverClose = () => {
    setShowApplicationPopover(false);
    setSelectedApplication(null);
    setAnchorElement(null);
  };

  // 处理批准申请
  const handleApproveApplication = async (application, positionId) => {
    console.log(
      'Approving application:',
      application,
      'for position:',
      positionId
    );
    console.log('Current project data:', data.project);
    console.log('Current project collaborators:', data.project?.collaborators);

    // 检查该申请人在该职位中是否已经被Approve
    const position = data.positions.find(p => p.id === positionId);
    if (position && position.applications) {
      const existingApp = position.applications.find(
        app =>
          (app.id === application.id || app.userId === application.userId) &&
          app.status === 'approved'
      );

      if (existingApp) {
        console.log(
          'Application already approved for this position:',
          application.name,
          positionId
        );
        return; // 如果已经Approve，直接返回
      }
    }

    // 额外检查：检查该申请人是否已经在collaborators列表中（作为双重保险）
    const existingCollaboratorsForCheck =
      data.project?.collaborators || data.project?.vision?.collaborators || [];
    const isAlreadyInCollaborators = existingCollaboratorsForCheck.some(
      collab =>
        (collab.id === application.id ||
          collab.userId === application.userId) &&
        collab.positionId === positionId
    );

    if (isAlreadyInCollaborators) {
      console.log(
        'Application already in collaborators for this position:',
        application.name,
        positionId
      );
      return; // 如果已经在collaborators中，直接返回
    }

    console.log(
      'Application not yet approved for this position, proceeding with approval:',
      application.name,
      positionId
    );

    const positionTitle = position?.title || 'Unknown Position';

    // 将申请人添加到Collaborators列表（允许同一申请人担任多个职位）
    const newCollaborator = {
      id: `${application.id || application.userId}_${positionId}_${Date.now()}`, // 唯一ID
      name: application.name,
      avatar: application.avatar || '/assets/placeholder.svg',
      role: 'Collaborator',
      positionId: positionId, // 添加职位ID
      positionTitle: positionTitle, // 添加职位标题
      email: application.email,
      portfolio: application.portfolio,
      approvedAt: new Date().toISOString(),
    };

    // 获取现有的collaborators
    const existingCollaborators =
      data.project?.collaborators || data.project?.vision?.collaborators || [];

    console.log('Existing collaborators:', existingCollaborators);

    // 更新项目数据中的collaborators
    const updatedProject = {
      ...data.project,
      collaborators: [...existingCollaborators, newCollaborator],
    };

    // 同时更新vision中的collaborators，确保ProjectVision组件能接收到数据
    const updatedVision = {
      ...data.project.vision,
      collaborators: [...existingCollaborators, newCollaborator],
    };

    const finalUpdatedProject = {
      ...updatedProject,
      vision: updatedVision,
    };

    // 更新申请状态为已批准 - 只更新特定职位中的特定申请人
    const updatedPositions = data.positions.map(position => {
      if (position.id === positionId && position.applications) {
        const updatedApplications = position.applications.map(app => {
          if (app.id === application.id || app.userId === application.userId) {
            return { ...app, status: 'approved' };
          }
          return app;
        });
        return { ...position, applications: updatedApplications };
      }
      return position;
    });

    // 保存申请状态到localStorage和applicationStorage
    const userId = application.id || application.userId;

    // 保存到applicationService
    const updateResult = await applicationService.updateApplicationStatus(
      data.project.id,
      positionId,
      userId,
      'approved'
    );

    if (updateResult.success) {
      console.log(
        '[handleApproveApplication] Successfully saved application status to applicationService'
      );
    } else {
      console.error(
        '[handleApproveApplication] Failed to save application status to applicationService:',
        updateResult.error
      );
    }

    // 同时保存到applicationStorage
    // 统一使用application.id作为键，如果没有则回退到userId
    const applicantId = application.id || application.userId;
    const storageResult = saveApplicationStatus(
      positionId,
      applicantId,
      'approved'
    );
    if (storageResult.success) {
      console.log(
        '[handleApproveApplication] Successfully saved application status to applicationStorage'
      );
    } else {
      console.error(
        '[handleApproveApplication] Failed to save application status to applicationStorage:',
        storageResult.error
      );
    }

    // 更新状态
    actions.updateProjectData(finalUpdatedProject);
    actions.updatePositions(updatedPositions);

    // 保存到localStorage
    actions.saveCollaborationData(finalUpdatedProject);

    // 同步更新selectedApplication状态，确保Popover显示正确的按钮状态
    if (
      selectedApplication &&
      (selectedApplication.id === application.id ||
        selectedApplication.userId === application.userId) &&
      selectedApplication.positionId === positionId
    ) {
      console.log(
        '[handleApproveApplication] Updating selectedApplication status to approved'
      );
      setSelectedApplication({
        ...selectedApplication,
        status: 'approved',
      });
    }

    console.log(
      'Application approved for position:',
      positionTitle,
      'New collaborator added:',
      newCollaborator
    );
    console.log('Updated project with collaborators:', finalUpdatedProject);

    // 延迟关闭Popover，让用户看到按钮状态变化
    setTimeout(() => {
      handleApplicationPopoverClose();
    }, 2000); // 增加到2秒，让用户有更多时间看到状态变化
  };

  // 处理联系申请人
  const handleContactApplication = () => {
    console.log('Contacting applicant');
    // Contact功能已经在ApplicationInfoModal中实现
  };

  // 检查当前用户是否为项目发起者
  const isInitiator = data.currentUser?.id === data.project?.author?.id;

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

  // 调试：检查项目数据

  // 添加调试组件显示
  const showDebugInfo = process.env.NODE_ENV === 'development';

  // 如果没有项目数据，显示加载状态
  if (!data.project) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading collaboration details...</p>
        </div>
      </div>
    );
  }

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
        hasSubmittedApplication={data.hasSubmittedApplication}
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
            onApply={actions.handleApply}
            onCancelApplication={actions.handleCancelApplication}
            onFillPosition={actions.handleFillPosition}
            getStatusColor={actions.getStatusColor}
            getStatusText={actions.getStatusText}
            currentUser={data.currentUser}
            onApplicationClick={handleApplicationClick}
            isInitiator={isInitiator}
          />

          {/* Right Column - Project Owner Panel (Upgraded) */}
          <div className='lg:col-span-1'>
            {/* V2: 新的状态化内容面板 */}
            <RightOwnerPanel
              project={data.project}
              owner={data.project.author}
              currentUser={data.currentUser} // 传递当前用户信息
              eligibility={{ isMemberCompleted: true }} // Mock eligibility
              onFinalReviewClick={handleFinalReviewClick}
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
            selectedCollaborator={selectedCollaboratorForReview}
            onCollaboratorReviewSubmit={handleCollaboratorReviewSubmit}
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

      {/* Application Info Modal */}
      <ApplicationInfoPopover
        isOpen={showApplicationPopover}
        onClose={handleApplicationPopoverClose}
        application={selectedApplication}
        onApprove={handleApproveApplication}
        onContact={handleContactApplication}
        isInitiator={isInitiator}
        anchorElement={anchorElement}
        positionId={selectedApplication?.positionId}
        positions={data.positions}
      />
    </div>
  );
};

export default CollaborationDetailPage;

import { favoritesService } from '../../../services';
import { getProfile } from '../../../services';
import { notificationService } from '../../../services';
import applicationService from '../../../services/applicationService';
import { saveApplyFormData } from '../../../services/applyFormService';
import { getUnifiedAvatar } from '../../../services/avatarService';
import { updatePositionStatus } from '../../../services/positionService';
import { getCurrentUser } from '../../../utils/currentUser';
import { useNavigation } from '../../../utils/navigation';
import { getStatusColor, getStatusText } from '../utils/collaborationHelpers';

export const useCollaborationActions = (data, setters) => {
  const { goBack, navigateToMilestone, navigateToArtist } = useNavigation();

  const {
    appliedPositions,
    selectedPosition,
    comment,
    positionComments,
    hasSubmittedApplication,
    showWarning,
    showSuccessToast,
    showCancelModal,
    cancelPositionId,
  } = data;

  const {
    setAppliedPositions,
    setSelectedPosition,
    setComment,
    setPositionComments,
    setHasSubmittedApplication,
    setShowWarning,
    setShowSuccessToast,
    setShowCancelModal,
    setCancelPositionId,
    setShowApplyModal,
    setApplyForm,
    setIsSaved,
    setActivePositionTab,
    setPositions,
    updateProjectData,
    updatePositions,
    saveCollaborationData,
  } = setters;

  // 处理申请职位
  const handleApply = async positionId => {
    if (!hasSubmittedApplication) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    // 更新申请状态
    setAppliedPositions(prev => {
      const newSet = new Set(prev);
      newSet.add(positionId);
      return newSet;
    });

    try {
      // 获取当前用户信息
      const currentUser = getCurrentUser();
      const userId = currentUser?.id || data.currentUser?.id;

      // 获取用户头像
      const avatarUrl = await getUnifiedAvatar(userId);

      // 获取用户个人资料中的真实姓名
      let userName = currentUser?.name || data.currentUser?.name || 'Anonymous';
      try {
        const profileResult = await getProfile(userId);
        if (profileResult.success && profileResult.data?.fullName) {
          userName = profileResult.data.fullName;
        }
      } catch (error) {
        console.warn(
          '[useCollaborationActions] Failed to get user profile:',
          error
        );
      }

      // 创建申请记录
      const application = {
        userId: userId,
        name: userName, // 使用用户个人资料中的真实姓名
        avatar:
          avatarUrl ||
          currentUser?.avatar ||
          data.currentUser?.avatar ||
          '/assets/placeholder.svg',
        email: data.applyForm?.email || '',
        portfolio: data.applyForm?.portfolio || '',
        message: data.applyForm?.message || '',
      };

      // 调试信息：打印申请表单数据
      console.log('[useCollaborationActions] Apply form data:', data.applyForm);
      console.log(
        '[useCollaborationActions] Created application:',
        application
      );

      // 保存申请记录到持久化存储
      const result = await applicationService.addApplication(
        data.project?.id,
        positionId,
        application
      );

      if (result.success) {
        // 更新本地状态
        setPositions(prev =>
          prev.map(position => {
            if (position.id === positionId) {
              return {
                ...position,
                applications: [...(position.applications || []), result.data],
              };
            }
            return position;
          })
        );

        console.log(
          `[useCollaborationActions] User ${application.name} applied for position ${positionId}`
        );

        // 设置申请已提交状态，禁用Application Saved按钮
        setHasSubmittedApplication(true);

        // 创建申请通知给项目发起者
        try {
          // 🔍 尝试多种方式获取initiatorId
          let initiatorId = null;

          // 方法1：从project.author.id获取
          if (data.project?.author?.id) {
            initiatorId = data.project.author.id;
          }
          // 方法2：从project.initiatorId获取
          else if (data.project?.initiatorId) {
            initiatorId = data.project.initiatorId;
          }
          // 方法3：从project.authorId获取
          else if (data.project?.authorId) {
            initiatorId = data.project.authorId;
          }
          // 方法4：从project.creator?.id获取
          else if (data.project?.creator?.id) {
            initiatorId = data.project.creator.id;
          }
          // 方法5：使用默认值（用于测试）
          else {
            // 如果都找不到，使用默认的alice作为initiator（仅用于测试）
            initiatorId = 'alice';
            console.warn(
              '[useCollaborationActions] Using default initiatorId: alice'
            );
          }

          // 🔍 调试信息：检查ID匹配
          console.log('[useCollaborationActions] Debug notification creation:');
          console.log('  - Current user ID:', userId);
          console.log('  - Project author ID:', data.project?.author?.id);
          console.log('  - Project initiatorId:', data.project?.initiatorId);
          console.log('  - Project authorId:', data.project?.authorId);
          console.log('  - Project creator ID:', data.project?.creator?.id);
          console.log('  - Final initiatorId:', initiatorId);
          console.log('  - Project data:', data.project);

          if (initiatorId && initiatorId !== userId) {
            console.log('[useCollaborationActions] Creating notification...');
            const notificationResult =
              await notificationService.createCollaborationApplicationNotification(
                userId,
                application.name,
                application.avatar,
                data.project?.id,
                data.project?.title,
                initiatorId,
                {
                  positionId,
                  email: application.email,
                  portfolio: application.portfolio,
                  message: application.message,
                }
              );

            if (notificationResult.success) {
              console.log(
                `[useCollaborationActions] Created notification for initiator ${initiatorId}`
              );
              console.log(
                '[useCollaborationActions] Notification result:',
                notificationResult
              );
            } else {
              console.warn(
                `[useCollaborationActions] Failed to create notification:`,
                notificationResult.error
              );
            }
          } else {
            console.warn(
              '[useCollaborationActions] Skipping notification creation:'
            );
            console.warn('  - initiatorId is missing or same as current user');
            console.warn('  - initiatorId:', initiatorId);
            console.warn('  - userId:', userId);
          }
        } catch (notificationError) {
          console.warn(
            '[useCollaborationActions] Error creating notification:',
            notificationError
          );
        }
      } else {
        console.error(
          '[useCollaborationActions] Failed to save application:',
          result.error
        );
      }
    } catch (error) {
      console.error(
        '[useCollaborationActions] Error applying for position:',
        error
      );
    }
  };

  // 处理填充职位（Initiator功能）
  const handleFillPosition = async positionId => {
    try {
      console.log('[useCollaborationActions] Filling position:', positionId);

      // 获取当前职位状态
      const currentPosition = data.positions.find(p => p.id === positionId);
      const newStatus =
        currentPosition?.status === 'filled' ? 'available' : 'filled';

      // 更新职位状态
      const result = await updatePositionStatus(
        data.project.id,
        positionId,
        newStatus
      );

      if (result.success) {
        // 更新本地状态
        setPositions(prev =>
          prev.map(position =>
            position.id === positionId
              ? { ...position, status: newStatus }
              : position
          )
        );

        console.log(
          `[useCollaborationActions] Position ${
            newStatus === 'filled' ? 'filled' : 'reopened'
          } successfully`
        );
      } else {
        console.error(
          '[useCollaborationActions] Failed to update position status:',
          result.error
        );
      }
    } catch (error) {
      console.error(
        '[useCollaborationActions] Error updating position status:',
        error
      );
    }
  };

  // 处理立即申请点击
  const handleApplyNowClick = () => {
    setShowApplyModal(true);
  };

  // 处理申请表单提交
  const handleApplySubmit = e => {
    e.preventDefault();

    // 設置申請已提交狀態
    setHasSubmittedApplication(true);

    // 關閉模態框
    setShowApplyModal(false);

    // 保存Apply Now表单数据到持久化存储
    try {
      const currentUser = getCurrentUser();
      const userId = currentUser?.id || data.currentUser?.id;
      saveApplyFormData(data.project?.id, userId, data.applyForm);
      console.log(
        `[useCollaborationActions] Saved apply form data for project ${data.project?.id}, user ${userId}:`,
        data.applyForm
      );
    } catch (error) {
      console.error(
        '[useCollaborationActions] Failed to save apply form data:',
        error
      );
    }

    // 顯示成功提示
    setShowSuccessToast(true);
  };

  // 处理申请表单变化
  const handleApplyFormChange = e => {
    const { name, value } = e.target;
    setApplyForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 处理取消申请点击
  const handleCancelApplication = positionId => {
    setCancelPositionId(positionId);
    setShowCancelModal(true);
  };

  // 处理确认取消申请
  const handleConfirmCancelApplication = async () => {
    if (cancelPositionId) {
      // 更新申请状态
      setAppliedPositions(prev => {
        const newSet = new Set(prev);
        newSet.delete(cancelPositionId);
        return newSet;
      });

      // 从职位的申请者列表中移除当前用户
      setPositions(prev =>
        prev.map(position => {
          if (position.id === cancelPositionId) {
            // 确保使用当前用户的真实档案信息进行匹配
            const currentUser = getCurrentUser();
            const userIdToRemove = currentUser?.id || data.currentUser?.id;

            return {
              ...position,
              applications: (position.applications || []).filter(
                app => app.userId !== userIdToRemove
              ),
            };
          }
          return position;
        })
      );

      // 从持久化存储中移除申请记录
      try {
        const currentUser = getCurrentUser();
        const userId = currentUser?.id || data.currentUser?.id;
        await applicationService.removeApplication(
          data.project?.id,
          cancelPositionId,
          userId
        );
      } catch (error) {
        console.error(
          '[useCollaborationActions] Failed to remove application from storage:',
          error
        );
      }

      console.log(
        `[useCollaborationActions] User ${data.currentUser?.name} cancelled application for position ${cancelPositionId}`
      );
    }
    setShowCancelModal(false);
    setCancelPositionId(null);
  };

  // 处理关闭取消申请弹窗
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelPositionId(null);
  };

  // 处理查看里程碑
  const handleViewMilestones = () => {
    navigateToMilestone(data.project);
  };

  // 处理保存切换
  const handleSaveToggle = async (itemType, itemId, shouldFavorite) => {
    try {
      await favoritesService.toggleFavorite(itemType, itemId, shouldFavorite);
      // 更新本地状态
      setIsSaved(shouldFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // 可以在这里添加Toast错误提示
    }
  };

  return {
    // 导航函数
    goBack,
    navigateToMilestone,
    navigateToArtist,

    // 事件处理函数
    handleApply,
    handleApplyNowClick,
    handleApplySubmit,
    handleApplyFormChange,
    handleCancelApplication,
    handleConfirmCancelApplication,
    handleCloseCancelModal,
    handleViewMilestones,
    handleSaveToggle,
    handleFillPosition,

    // 数据更新函数
    updateProjectData,
    updatePositions,
    saveCollaborationData,

    // 工具函数
    getStatusColor,
    getStatusText,
  };
};

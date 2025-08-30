import { favoritesService } from '../../../services';
import { getProfile } from '../../../services';
import {
  addApplication,
  removeApplication,
} from '../../../services/applicationService';
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
      const result = addApplication(data.project?.id, positionId, application);

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
      saveApplyFormData(data.project?.id, data.applyForm);
      console.log(
        `[useCollaborationActions] Saved apply form data for project ${data.project?.id}:`,
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
  const handleConfirmCancelApplication = () => {
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
        removeApplication(data.project?.id, cancelPositionId, userId);
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

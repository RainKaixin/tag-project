import { favoritesService } from '../../../services';
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
  } = data;

  const {
    setAppliedPositions,
    setSelectedPosition,
    setComment,
    setPositionComments,
    setHasSubmittedApplication,
    setShowWarning,
    setShowApplyModal,
    setApplyForm,
    setIsSaved,
    setActivePositionTab,
  } = setters;

  // 处理申请职位
  const handleApply = positionId => {
    if (!hasSubmittedApplication) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    setAppliedPositions(prev => {
      const newSet = new Set(prev);
      newSet.add(positionId);
      return newSet;
    });
  };

  // 处理立即申请点击
  const handleApplyNowClick = () => {
    setHasSubmittedApplication(true);
    setShowApplyModal(true);
  };

  // 处理申请表单提交
  const handleApplySubmit = e => {
    e.preventDefault();

    setShowApplyModal(false);
    setApplyForm({
      name: '',
      email: '',
      portfolio: '',
      message: '',
    });
  };

  // 处理申请表单变化
  const handleApplyFormChange = e => {
    const { name, value } = e.target;
    setApplyForm(prev => ({
      ...prev,
      [name]: value,
    }));
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

  // 处理评论提交
  const handleCommentSubmit = e => {
    e.preventDefault();
    if (!comment.trim() || !selectedPosition) return;

    const newComment = {
      id: Date.now(),
      user: data.currentUser?.name || 'Anonymous',
      avatar:
        data.currentUser?.avatar ||
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      role: data.currentUser?.role || 'User',
      comment: comment,
      timestamp: 'Just now',
      likes: 0,
    };

    setPositionComments(prev => ({
      ...prev,
      [selectedPosition]: [newComment, ...prev[selectedPosition]],
    }));
    setComment('');
  };

  // 处理职位标签点击
  const handlePositionTabClick = (positionId, tab) => {
    setSelectedPosition(positionId);
    setActivePositionTab(tab);
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
    handleViewMilestones,
    handleSaveToggle,
    handleCommentSubmit,
    handlePositionTabClick,

    // 工具函数
    getStatusColor,
    getStatusText,
  };
};

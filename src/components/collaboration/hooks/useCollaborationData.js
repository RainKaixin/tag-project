import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '../../../context/AppContext';
import { favoritesService } from '../../../services';
import { getCurrentUser } from '../../../utils/currentUser';
import {
  processProjectData,
  getPositionsData,
} from '../utils/collaborationHelpers';

export const useCollaborationData = () => {
  const { state } = useAppContext();
  const location = useLocation();

  // 从Context、路由状态或URL参数获取项目数据
  const projectData = state.selectedCollaboration || location.state?.project;

  // 状态管理
  const [appliedPositions, setAppliedPositions] = useState(new Set());
  const [isSaved, setIsSaved] = useState(false);
  const [activePositionTab, setActivePositionTab] = useState('applications');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [comment, setComment] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    name: '',
    email: '',
    portfolio: '',
    message: '',
  });
  const [hasSubmittedApplication, setHasSubmittedApplication] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  // 评论数据
  const [positionComments, setPositionComments] = useState({
    1: [
      {
        id: 1,
        user: 'Alex Chen',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        role: 'UI/UX Designer',
        comment:
          'This position looks perfect for my skill set! I have 3 years of experience with Figma and user research. Would love to discuss the project details.',
        timestamp: '2 hours ago',
        likes: 2,
      },
      {
        id: 2,
        user: 'Maya Rodriguez',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        role: 'Product Designer',
        comment:
          "Great opportunity! I'm particularly interested in the AR try-on feature. Have you considered accessibility considerations for the interface?",
        timestamp: '4 hours ago',
        likes: 1,
      },
    ],
    2: [
      {
        id: 1,
        user: 'David Lee',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        role: 'Graphic Designer',
        comment:
          'I specialize in branding and have worked on several fashion projects. Would love to contribute to the visual identity!',
        timestamp: '1 day ago',
        likes: 3,
      },
    ],
    3: [
      {
        id: 1,
        user: 'Sophie Wilson',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        role: 'Motion Designer',
        comment:
          'Position filled! Looking forward to working with the team on the animations.',
        timestamp: '3 days ago',
        likes: 5,
      },
    ],
  });

  // 处理项目数据
  const project = processProjectData(projectData, location, state);

  // 获取职位数据
  const positions = getPositionsData();

  // 功能开关
  const enableProjectProgressBar = true;
  const enableAfterFinishedReview = true;
  const enableReviewApprovalPanel = false;

  // 监听用户切换事件
  useEffect(() => {
    const handleUserChange = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener('user:changed', handleUserChange);
    return () => {
      window.removeEventListener('user:changed', handleUserChange);
    };
  }, []);

  // 检查收藏状态
  useEffect(() => {
    if (!project?.id) return;

    const checkFavoriteStatus = async () => {
      try {
        const result = await favoritesService.checkFavoriteStatus(
          'collaboration',
          project.id
        );
        if (result.success) {
          setIsSaved(result.data.isFavorited);
        }
      } catch (error) {
        console.error('Failed to check favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [project?.id]);

  return {
    // 数据
    project,
    projectData,
    positions,
    appliedPositions,
    isSaved,
    activePositionTab,
    selectedPosition,
    comment,
    showApplyModal,
    applyForm,
    hasSubmittedApplication,
    showWarning,
    currentUser,
    positionComments,

    // 功能开关
    enableProjectProgressBar,
    enableAfterFinishedReview,
    enableReviewApprovalPanel,

    // 状态更新函数
    setAppliedPositions,
    setIsSaved,
    setActivePositionTab,
    setSelectedPosition,
    setComment,
    setShowApplyModal,
    setApplyForm,
    setHasSubmittedApplication,
    setShowWarning,
    setCurrentUser,
    setPositionComments,
  };
};

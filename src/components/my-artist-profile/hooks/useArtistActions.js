// use-artist-actions v1: 艺术家操作逻辑Hook
// 从 MyArtistProfile.js 中提取的操作逻辑

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useNavigation } from '../../../utils/navigation';

/**
 * useArtistActions Hook - 处理艺术家档案页面的操作逻辑
 * @param {Object} params - 参数对象
 * @param {Object} params.state - 状态对象
 * @returns {Object} 操作函数
 */
const useArtistActions = ({ state }) => {
  const navigate = useNavigate();
  const { goBack, navigateToWork } = useNavigation();

  // 处理编辑个人资料按钮点击
  const handleEditProfileClick = useCallback(() => {
    navigate('/settings/edit-profile');
  }, [navigate]);

  // 处理作品点击
  const handleArtworkClick = useCallback(
    artwork => {
      navigateToWork(artwork.id);
    },
    [navigateToWork]
  );

  // 处理合作项目卡片展开/收起
  const handleCollaborationToggle = useCallback(
    (collaborationId, setExpandedCardId) => {
      setExpandedCardId(prevId =>
        prevId === collaborationId ? null : collaborationId
      );
    },
    []
  );

  // 处理返回按钮点击
  const handleBackClick = useCallback(() => {
    goBack();
  }, [goBack]);

  return {
    handleEditProfileClick,
    handleArtworkClick,
    handleCollaborationToggle,
    handleBackClick,
  };
};

export default useArtistActions;

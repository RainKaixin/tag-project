// use-artist-actions v1: 艺术家档案操作管理Hook

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useNavigation } from '../../../utils/navigation';

/**
 * 艺术家档案操作管理Hook
 * @param {Object} state - 状态对象
 * @param {Object} setters - 设置函数对象
 * @returns {Object} 操作函数
 */
const useArtistActions = ({ state, setters }) => {
  const navigate = useNavigate();
  const { goBack, navigateToWork } = useNavigation();

  // 处理返回按钮点击
  const handleBackClick = useCallback(() => {
    goBack();
  }, [goBack]);

  // 处理编辑个人资料按钮点击
  const handleEditProfileClick = useCallback(() => {
    navigate('/settings/edit-profile');
  }, [navigate]);

  // 处理预览访客视角按钮点击
  const handlePreviewAsVisitorClick = useCallback(() => {
    // 跳转到公共视角页面
    const currentUserId = state.currentUser?.id;
    if (currentUserId) {
      navigate(`/artist/${currentUserId}`);
    }
  }, [navigate, state.currentUser?.id]);

  // 处理返回所有者视角按钮点击
  const handleBackToOwnerViewClick = useCallback(() => {
    navigate('/artist/me');
  }, [navigate]);

  // 处理作品点击
  const handleArtworkClick = useCallback(
    artwork => {
      if (artwork && artwork.id) {
        navigateToWork(artwork.id);
      }
    },
    [navigateToWork]
  );

  // 处理合作项目卡片展开/收起
  const handleCollaborationToggle = useCallback(
    cardId => {
      setters.toggleExpandedCard(cardId);
    },
    [setters]
  );

  // 处理社交链接点击
  const handleSocialLinkClick = useCallback(() => {
    // 这里可以添加社交链接的处理逻辑
    // 可以添加外部链接打开逻辑
    // window.open(url, '_blank');
  }, []);

  return {
    // 导航操作
    handleBackClick,
    handleEditProfileClick,
    handlePreviewAsVisitorClick,
    handleBackToOwnerViewClick,
    handleArtworkClick,

    // 交互操作
    handleCollaborationToggle,
    handleSocialLinkClick,
  };
};

export default useArtistActions;

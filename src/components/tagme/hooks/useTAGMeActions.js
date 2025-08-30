import { useCallback } from 'react';

import { favoritesService } from '../../../services';

const useTAGMeActions = ({ state, setters }) => {
  const { setSelectedCategories, setSelectedMajors, setSelectedTags } = setters;

  const handleCategoryToggle = useCallback(
    categoryId => {
      setSelectedCategories(prev =>
        prev.includes(categoryId)
          ? prev.filter(id => id !== categoryId)
          : [...prev, categoryId]
      );
    },
    [setSelectedCategories]
  );

  const handleMajorToggle = useCallback(
    majorId => {
      setSelectedMajors(prev =>
        prev.includes(majorId)
          ? prev.filter(id => id !== majorId)
          : [...prev, majorId]
      );
    },
    [setSelectedMajors]
  );

  const handleTagToggle = useCallback(
    tagId => {
      setSelectedTags(prev =>
        prev.includes(tagId)
          ? prev.filter(id => id !== tagId)
          : [...prev, tagId]
      );
    },
    [setSelectedTags]
  );

  const handleLikeToggle = useCallback(projectId => {
    // 这里可以添加点赞逻辑
  }, []);

  const handleApplyJob = useCallback(jobId => {
    // 这里可以添加申请职位的逻辑
  }, []);

  const handleBookmarkToggle = useCallback(async collaborationId => {
    // 这个函数现在只用于通知父组件收藏状态发生了变化
    // 实际的收藏操作已经在CollaborationGrid中完成
    console.log('[useTAGMeActions] 收藏状态变化通知:', collaborationId);

    // 可以在这里添加其他需要的逻辑，比如更新全局状态、显示通知等
    // 但不应该再次执行收藏操作
  }, []);

  return {
    handleCategoryToggle,
    handleMajorToggle,
    handleTagToggle,
    handleLikeToggle,
    handleApplyJob,
    handleBookmarkToggle,
  };
};

export default useTAGMeActions;

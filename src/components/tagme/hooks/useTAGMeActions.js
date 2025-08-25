import { useCallback } from 'react';

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

  const handleBookmarkToggle = useCallback(collaborationId => {
    // 这里可以添加收藏/取消收藏的逻辑
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

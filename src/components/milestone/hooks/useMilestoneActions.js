import { useCallback } from 'react';

const useMilestoneActions = ({
  state,
  setters,
  actions,
  navigateToCollaboration,
  project,
  comments,
}) => {
  const { setComment } = setters;

  const handleCommentSubmit = useCallback(
    e => {
      e.preventDefault();
      if (state.comment.trim()) {
        const newComment = {
          id: (comments?.length || 0) + 1,
          user: 'You',
          avatar: '/assets/placeholder.svg',
          role: 'Team Member',
          comment: state.comment,
          timestamp: 'Just now',
          likes: 0,
        };
        actions.addComment(newComment);
        setComment('');
      }
    },
    [state.comment, comments, actions, setComment]
  );

  const handleApplyToCollaboration = useCallback(() => {
    // 🔍 调试信息：检查project数据
    console.log('🔍 [DEBUG] handleApplyToCollaboration - project:', project);
    console.log(
      '🔍 [DEBUG] handleApplyToCollaboration - project.id:',
      project.id
    );

    // 创建对应的collaboration项目数据
    const collaborationProject = {
      id: project.id,
      title: project.title,
      subtitle: project.description,
      image: project.images[0] || '/assets/placeholder.svg',
      categories: project.tags,
      author: {
        id:
          project.teamMembers[0]?.id ||
          project.teamMembers[0]?.artist?.toLowerCase() ||
          'bryan',
        name: project.teamMembers[0]?.artist || 'Initiator',
        avatar:
          project.teamMembers[0]?.artistAvatar || '/assets/placeholder.svg',
      },
      likes: '1.2k',
      views: '8.4k',
    };

    // 🔍 调试信息：检查collaborationProject数据
    console.log(
      '🔍 [DEBUG] handleApplyToCollaboration - collaborationProject:',
      collaborationProject
    );
    console.log(
      '🔍 [DEBUG] handleApplyToCollaboration - collaborationProject.id:',
      collaborationProject.id
    );

    navigateToCollaboration(collaborationProject);
  }, [project, navigateToCollaboration]);

  return {
    handleCommentSubmit,
    handleApplyToCollaboration,
  };
};

export default useMilestoneActions;

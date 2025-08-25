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
          avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
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
      image:
        project.images[0] ||
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      categories: project.tags,
      author: {
        name: project.teamMembers[0]?.artist || 'Project Lead',
        avatar:
          project.teamMembers[0]?.artistAvatar ||
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
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

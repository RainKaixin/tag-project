import React, { useState, useEffect } from 'react';

import ProjectVision from './ProjectVision';

const RightOwnerPanel = ({ project, owner, currentUser, eligibility }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [buttonState, setButtonState] = useState('ADD_EXPERIENCE');

  // 获取当前用户的数字ID
  const getCurrentUserNumericId = () => {
    if (currentUser?.id) {
      // 如果 currentUser.id 是字符串，尝试映射到数字ID
      const idMapping = {
        alex: 1,
        alice: 2,
        bryan: 3,
      };
      return idMapping[currentUser.id] || currentUser.id;
    }
    return null; // 不再使用默认值
  };

  const mockCurrentUser = currentUser || {
    id: getCurrentUserNumericId(),
    name: 'Current User',
  };

  useEffect(() => {
    console.log('[RightOwnerPanel] Component mounted with props:', {
      project,
      owner,
      currentUser,
      eligibility,
    });
    checkUserEligibility();
  }, [project.id]);

  const checkUserEligibility = () => {
    console.log(
      '[RightOwnerPanel] Checking eligibility for user:',
      mockCurrentUser
    );
    console.log(
      '[RightOwnerPanel] Current user ID type:',
      typeof mockCurrentUser.id
    );
    console.log('[RightOwnerPanel] Current user ID value:', mockCurrentUser.id);
    console.log('[RightOwnerPanel] Project data:', project);
    console.log('[RightOwnerPanel] Project positions:', project.positions);

    // 检查用户是否被批准为 Collaborator
    // 遍历所有职位，检查是否有被批准的申请
    let isApprovedCollaborator = false;

    if (project.positions && Array.isArray(project.positions)) {
      project.positions.forEach(position => {
        if (position.applications && Array.isArray(position.applications)) {
          console.log('[RightOwnerPanel] Checking position:', position.id);
          console.log(
            '[RightOwnerPanel] Applications in position:',
            position.applications
          );
          console.log('[RightOwnerPanel] Current user ID:', mockCurrentUser.id);

          const approvedApplication = position.applications.find(app => {
            // 优先使用数字ID进行匹配
            const idMatch = app.id === mockCurrentUser.id;
            // 如果数字ID不匹配，再检查字符串ID（但需要验证）
            const userIdMatch = app.userId === mockCurrentUser.id;

            console.log('[RightOwnerPanel] Application check:', {
              appUserId: app.userId,
              appId: app.id,
              currentUserId: mockCurrentUser.id,
              currentUserIdType: typeof mockCurrentUser.id,
              userIdMatch,
              idMatch,
              status: app.status,
            });

            // 优先使用数字ID匹配，确保安全性
            return idMatch && app.status === 'approved';
          });

          if (approvedApplication) {
            console.log(
              '[RightOwnerPanel] Found approved application:',
              approvedApplication
            );
            isApprovedCollaborator = true;
          }
        }
      });
    }

    console.log(
      '[RightOwnerPanel] Is approved collaborator:',
      isApprovedCollaborator
    );

    if (isApprovedCollaborator) {
      setButtonState('ADD_EXPERIENCE');
    } else {
      setButtonState('NOT_ELIGIBLE');
    }
  };

  const handleAddExperience = async () => {
    setIsLoading(true);
    try {
      // 将协作项目添加到用户的个人经历
      const experienceData = {
        id: `exp_${Date.now()}`,
        projectId: project.id,
        title: project.name,
        description: project.description,
        image: project.heroImage || project.image,
        dateRange: `Completed ${new Date().toLocaleDateString()}`,
        role: 'Collaborator',
        isInitiator: false,
        responsibility: '', // 用户可以稍后编辑
        teamFeedback: {
          feedbacker: 'Team',
          feedbackerRole: 'Collaborators',
          content: 'This project has been completed successfully.',
        },
        addedAt: new Date().toISOString(),
      };

      // 保存到用户的协作经历中
      const userCollaborations = JSON.parse(
        localStorage.getItem(`user_collaborations_${mockCurrentUser.id}`) ||
          '[]'
      );

      // 检查是否已经添加过
      const existingExperience = userCollaborations.find(
        exp => exp.projectId === project.id
      );

      if (!existingExperience) {
        userCollaborations.push(experienceData);
        localStorage.setItem(
          `user_collaborations_${mockCurrentUser.id}`,
          JSON.stringify(userCollaborations)
        );
        console.log(
          '[RightOwnerPanel] Experience added successfully:',
          experienceData
        );
        setButtonState('EXPERIENCE_ADDED');
      } else {
        console.log('[RightOwnerPanel] Experience already exists');
        setButtonState('EXPERIENCE_ADDED');
      }
    } catch (error) {
      console.error('Error adding experience:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderButton = () => {
    const baseClasses =
      'w-full py-2 px-4 rounded-lg font-medium transition-all duration-200';

    switch (buttonState) {
      case 'ADD_EXPERIENCE':
        return (
          <button
            className={`${baseClasses} bg-purple-600 text-white hover:bg-purple-700`}
            onClick={handleAddExperience}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Experience'}
          </button>
        );

      case 'EXPERIENCE_ADDED':
        return (
          <button
            className={`${baseClasses} bg-green-100 text-green-800 cursor-not-allowed`}
            disabled
          >
            Experience Added ✓
          </button>
        );

      case 'NOT_ELIGIBLE':
        return (
          <button
            className={`${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed`}
            disabled
            title='Only approved collaborators can add this to their experience.'
          >
            Not Eligible
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full overflow-auto'>
      <ProjectVision
        vision={project.vision}
        owner={owner}
        currentUser={currentUser}
      />

      {/* Action Button - 始终显示 */}
      <div className='mt-6 pt-4 border-t border-gray-200'>{renderButton()}</div>
    </div>
  );
};

export default RightOwnerPanel;

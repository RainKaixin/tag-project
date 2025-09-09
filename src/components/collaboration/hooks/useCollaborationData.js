import { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useAppContext } from '../../../context/AppContext';
import { favoritesService } from '../../../services';
import { getProfile } from '../../../services';
import applicationService from '../../../services/applicationService';
import {
  getApplyFormData,
  hasCompleteApplyFormData,
} from '../../../services/applyFormService';
import { getAllPositionStatus } from '../../../services/positionService';
import { getApplicationStatus } from '../../../utils/applicationStorage';
import { getCurrentUser } from '../../../utils/currentUser';
import { getCollaborationDataById } from '../../favorites/utils/favoritesHelpers';
import {
  processProjectData,
  getPositionsData,
} from '../utils/collaborationHelpers';

export const useCollaborationData = () => {
  const { state } = useAppContext();
  const location = useLocation();
  const { id } = useParams();

  // 从Context、路由状态、URL参数获取项目数据
  const [projectData, setProjectData] = useState(() => {
    // 优先从 Context 或 location.state 获取
    const initialData = state.selectedCollaboration || location.state?.project;

    // 如果没有初始数据但有 ID，尝试从 localStorage 获取
    if (!initialData && id) {
      console.log(
        '[useCollaborationData] No initial data, trying localStorage for id:',
        id
      );
      const localStorageData = getCollaborationDataById(id);
      if (localStorageData) {
        console.log(
          '[useCollaborationData] Found data in localStorage:',
          localStorageData
        );
        return localStorageData;
      }
    }

    return initialData;
  });

  // 调试信息
  console.log('[useCollaborationData] Final projectData:', projectData);
  console.log(
    '[useCollaborationData] Final projectData.roles:',
    projectData?.roles
  );
  console.log(
    '[useCollaborationData] Final projectData.collaborators:',
    projectData?.collaborators
  );
  console.log(
    '[useCollaborationData] Final projectData.vision?.collaborators:',
    projectData?.vision?.collaborators
  );
  console.log('[useCollaborationData] ID from URL:', id);
  console.log(
    '[useCollaborationData] Context data:',
    state.selectedCollaboration
  );
  console.log(
    '[useCollaborationData] Location state:',
    location.state?.project
  );
  console.log(
    '[useCollaborationData] Location state roles:',
    location.state?.project?.roles
  );

  // 状态管理
  const [appliedPositions, setAppliedPositions] = useState(new Set());
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    email: '',
    portfolio: '',
    message: '',
  });
  const [hasSubmittedApplication, setHasSubmittedApplication] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelPositionId, setCancelPositionId] = useState(null);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [positions, setPositions] = useState([]);
  const [project, setProject] = useState(null);

  // 处理项目数据并设置初始project状态
  useEffect(() => {
    const processedProject = processProjectData(projectData, location, state);
    console.log('[useCollaborationData] Processed project:', processedProject);
    console.log(
      '[useCollaborationData] Processed project.roles:',
      processedProject?.roles
    );

    // 如果处理后的项目没有角色数据，尝试从 localStorage 恢复
    if (!processedProject?.roles || processedProject.roles.length === 0) {
      console.log(
        '[useCollaborationData] Processed project has no roles, trying localStorage recovery...'
      );

      if (id) {
        const localStorageData = getCollaborationDataById(id);
        if (
          localStorageData &&
          localStorageData.roles &&
          localStorageData.roles.length > 0
        ) {
          console.log(
            '[useCollaborationData] Found roles in localStorage:',
            localStorageData.roles
          );

          // 更新 processedProject，添加角色数据
          const updatedProject = {
            ...processedProject,
            roles: localStorageData.roles,
          };
          console.log(
            '[useCollaborationData] Updated project with roles:',
            updatedProject
          );
          setProject(updatedProject);
          return;
        }
      }
    }

    setProject(processedProject);
  }, [projectData, location, state, id]);

  // 处理数据加载和补充
  useEffect(() => {
    if (!id) return;

    // 检查当前数据是否完整
    const hasIncompleteData =
      projectData &&
      (!projectData.roles ||
        !projectData.collaborators ||
        !projectData.vision?.collaborators);

    // 调试：检查数据完整性
    console.log('[useCollaborationData] Data completeness check:');
    console.log('  projectData exists:', !!projectData);
    console.log('  projectData.roles exists:', !!projectData?.roles);
    console.log(
      '  projectData.collaborators exists:',
      !!projectData?.collaborators
    );
    console.log(
      '  projectData.vision?.collaborators exists:',
      !!projectData?.vision?.collaborators
    );
    console.log('  hasIncompleteData:', hasIncompleteData);

    // 强制检查：如果 projectData 存在但没有 roles，或者 roles 为空数组，也需要恢复
    const needsDataRecovery =
      !projectData ||
      hasIncompleteData ||
      (projectData && (!projectData.roles || projectData.roles.length === 0));

    console.log('  needsDataRecovery:', needsDataRecovery);

    // 如果没有数据或数据不完整，尝试从localStorage获取
    if (needsDataRecovery) {
      console.log(
        '[useCollaborationData] No data or incomplete data, trying localStorage for id:',
        id
      );

      // 尝试多种 ID 格式
      const possibleIds = [id, parseInt(id), id.toString()];
      let localStorageData = null;

      for (const testId of possibleIds) {
        console.log(
          `[useCollaborationData] Trying ID format: ${testId} (type: ${typeof testId})`
        );
        localStorageData = getCollaborationDataById(testId);
        console.log(
          `[useCollaborationData] getCollaborationDataById result:`,
          localStorageData
        );
        if (localStorageData) {
          console.log(`[useCollaborationData] Found data with ID: ${testId}`);
          break;
        }
      }

      if (localStorageData) {
        console.log(
          '[useCollaborationData] Found localStorage data:',
          localStorageData
        );
        console.log(
          '[useCollaborationData] localStorage roles:',
          localStorageData.roles
        );
        // 更新projectData状态，这会触发上面的useEffect重新处理数据
        setProjectData(localStorageData);
      } else {
        console.warn(
          '[useCollaborationData] No data found in localStorage for any ID format'
        );
      }
    }
  }, [id]); // 移除 projectData?.id 依赖，确保每次 id 变化都会检查

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

  // 加载职位数据并应用持久化状态
  useEffect(() => {
    console.log(
      '[useCollaborationData] useEffect triggered, project?.id:',
      project?.id
    );
    console.log('[useCollaborationData] project?.roles:', project?.roles);

    if (!project?.id) {
      console.log('[useCollaborationData] No project ID, returning early');
      return;
    }

    // 额外检查：如果 project 没有角色数据，尝试从 localStorage 恢复
    if (!project.roles || project.roles.length === 0) {
      console.log(
        '[useCollaborationData] Project has no roles, trying to recover from localStorage...'
      );

      // 尝试多种 ID 格式
      const possibleIds = [
        project.id,
        parseInt(project.id),
        project.id.toString(),
      ];
      let localStorageData = null;

      for (const testId of possibleIds) {
        console.log(
          `[useCollaborationData] Trying ID format: ${testId} (type: ${typeof testId})`
        );
        localStorageData = getCollaborationDataById(testId);
        if (
          localStorageData &&
          localStorageData.roles &&
          localStorageData.roles.length > 0
        ) {
          console.log(
            `[useCollaborationData] Found roles data with ID: ${testId}`
          );
          console.log(
            '[useCollaborationData] Found roles:',
            localStorageData.roles
          );

          // 更新 project 对象，添加角色数据
          const updatedProject = {
            ...project,
            roles: localStorageData.roles,
          };
          console.log(
            '[useCollaborationData] Updated project with roles:',
            updatedProject
          );
          setProject(updatedProject);
          // 不要 return，继续执行 loadPositionsWithStatus
        }
      }

      console.log('[useCollaborationData] No roles data found in localStorage');
    }

    const loadPositionsWithStatus = async () => {
      try {
        // 获取项目数据中的真实职位信息
        const defaultPositions = getPositionsData(project);

        // 获取持久化的职位状态
        const savedStatus = getAllPositionStatus(project.id);

        // 加载申请记录
        const savedApplications = await applicationService.getApplicationsData(
          project.id
        );

        // 更新申请记录中的用户姓名（如果需要）
        const updateUserNamesInApplications = async () => {
          if (savedApplications) {
            const currentUser = getCurrentUser();
            if (currentUser?.id) {
              try {
                const profileResult = await getProfile(currentUser.id);
                if (profileResult.success && profileResult.data?.fullName) {
                  const newName = profileResult.data.fullName;
                  // 检查是否需要更新
                  let needsUpdate = false;
                  Object.values(savedApplications).forEach(
                    positionApplications => {
                      positionApplications.forEach(application => {
                        if (
                          application.userId === currentUser.id &&
                          application.name !== newName
                        ) {
                          needsUpdate = true;
                        }
                      });
                    }
                  );

                  if (needsUpdate) {
                    await applicationService.updateApplicationUserName(
                      currentUser.id,
                      newName
                    );
                    // 重新获取更新后的数据
                    const updatedApplications =
                      await applicationService.getApplicationsData(project.id);
                    if (updatedApplications) {
                      Object.keys(updatedApplications).forEach(positionId => {
                        updatedApplications[positionId].forEach(application => {
                          if (application.userId === currentUser.id) {
                            application.name = newName;
                          }
                        });
                      });
                    }
                  }
                }
              } catch (error) {
                console.warn(
                  '[useCollaborationData] Failed to update application user names:',
                  error
                );
              }
            }
          }
        };

        // 执行异步更新
        updateUserNamesInApplications();

        // 恢复申请状态：从applicationStorage恢复已批准的申请状态
        const restoreApplicationStatus = () => {
          if (savedApplications) {
            Object.entries(savedApplications).forEach(
              ([positionId, applications]) => {
                applications.forEach(application => {
                  // 从applicationStorage检查是否已被批准
                  // 统一使用application.id作为键，如果没有则回退到userId
                  const applicantId = application.id || application.userId;
                  const storedStatus = getApplicationStatus(
                    positionId,
                    applicantId
                  );
                  if (storedStatus === 'approved') {
                    console.log(
                      `[useCollaborationData] Restoring approved status from storage for user ${application.userId} in position ${positionId}`
                    );
                    application.status = 'approved';
                  } else if (application.status === 'approved') {
                    // 如果applicationService中有approved状态，同步到applicationStorage
                    console.log(
                      `[useCollaborationData] Syncing approved status to storage for user ${application.userId} in position ${positionId}`
                    );
                    // 这里可以调用saveApplicationStatus，但为了避免循环依赖，我们先记录日志
                  }
                });
              }
            );
          }
        };

        restoreApplicationStatus();

        // 应用保存的状态和申请记录到职位数据
        const positionsWithStatus = defaultPositions.map(position => {
          const savedPositionApplications =
            savedApplications?.[position.id] || [];

          console.log(
            `[useCollaborationData] Position ${position.id} saved applications:`,
            savedPositionApplications
          );

          // 确保申请状态正确恢复
          const applicationsWithStatus = savedPositionApplications.map(app => {
            console.log(
              `[useCollaborationData] Application ${app.userId} status: ${app.status}`
            );
            return {
              ...app,
              status: app.status || 'pending', // 确保状态字段存在
            };
          });

          const result = {
            ...position,
            status: savedStatus[position.id] || position.status,
            // 合并保存的申请记录，确保状态正确
            applications: applicationsWithStatus,
          };

          console.log(
            `[useCollaborationData] Final position ${position.id} applications:`,
            result.applications
          );

          return result;
        });

        setPositions(positionsWithStatus);
      } catch (error) {
        console.error('Failed to load positions with status:', error);
        setPositions(getPositionsData(project));
      }
    };

    console.log('[useCollaborationData] About to call loadPositionsWithStatus');
    loadPositionsWithStatus();
    console.log('[useCollaborationData] loadPositionsWithStatus called!');
  }, [project?.id, project?.roles]);

  // 初始化已申请职位状态
  useEffect(() => {
    if (!project?.id || !currentUser?.id) return;

    const initializeAppliedPositions = async () => {
      try {
        // 获取已保存的申请记录
        const savedApplications = await applicationService.getApplicationsData(
          project.id
        );

        if (savedApplications) {
          // 检查当前用户已经申请过的职位
          const userAppliedPositions = new Set();

          Object.entries(savedApplications).forEach(
            ([positionId, applications]) => {
              // 检查该职位的申请记录中是否有当前用户
              const hasApplied = applications.some(
                app => app.userId === currentUser.id
              );
              if (hasApplied) {
                userAppliedPositions.add(parseInt(positionId));
              }
            }
          );

          // 更新已申请职位状态
          setAppliedPositions(userAppliedPositions);

          console.log(
            `[useCollaborationData] Initialized applied positions for user ${currentUser.id}:`,
            Array.from(userAppliedPositions)
          );
        }
      } catch (error) {
        console.error('Failed to initialize applied positions:', error);
      }
    };

    initializeAppliedPositions();
  }, [project?.id, currentUser?.id]);

  // 加载Apply Now表单数据
  useEffect(() => {
    if (!project?.id || !currentUser?.id) return;

    const loadApplyFormData = () => {
      try {
        const savedFormData = getApplyFormData(project.id, currentUser.id);
        if (savedFormData) {
          setApplyForm(savedFormData);
          setHasSubmittedApplication(
            hasCompleteApplyFormData(project.id, currentUser.id)
          );
          console.log(
            '[useCollaborationData] Loaded saved apply form data for user:',
            savedFormData
          );
        }
      } catch (error) {
        console.error('Failed to load apply form data:', error);
      }
    };

    loadApplyFormData();
  }, [project?.id, currentUser?.id]);

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

  // 更新项目数据
  const updateProjectData = useCallback(newProjectData => {
    // 更新project状态，这会触发重新渲染
    setProject(newProjectData);
    console.log('[useCollaborationData] Updated project data:', newProjectData);
  }, []);

  // 更新职位数据
  const updatePositions = useCallback(newPositions => {
    setPositions(newPositions);
    console.log('[useCollaborationData] Updated positions:', newPositions);
  }, []);

  // 保存协作数据到localStorage
  const saveCollaborationData = useCallback(async projectData => {
    try {
      console.log('[saveCollaborationData] Saving project data:', projectData);

      // 创建精简版projectData，只移除base64图片数据，保留所有其他重要信息
      const strippedProjectData = {
        ...projectData,
        // 只移除base64图片数据以避免localStorage配额问题
        heroImage: undefined,
        posterPreview: undefined,
        image: undefined,
        // 保留所有其他重要信息，包括initiator信息
        author: projectData.author, // 确保initiator信息不被丢失
        authorId: projectData.authorId,
        authorName: projectData.authorName,
        // 保留所有项目元数据
        id: projectData.id,
        title: projectData.title,
        description: projectData.description,
        collaborators: projectData.collaborators,
        roles: projectData.roles,
        vision: projectData.vision,
        duration: projectData.duration,
        teamSize: projectData.teamSize,
        tags: projectData.tags,
        status: projectData.status,
        postedTime: projectData.postedTime,
        applicationDeadline: projectData.applicationDeadline,
        meetingFrequency: projectData.meetingFrequency,
        // 保留其他可能的重要字段
        contactInfo: projectData.contactInfo,
        categories: projectData.categories,
        milestones: projectData.milestones,
      };

      console.log(
        '[saveCollaborationData] Stripped project data for storage:',
        strippedProjectData
      );
      console.log(
        '[saveCollaborationData] Project collaborators:',
        projectData?.collaborators
      );
      console.log(
        '[saveCollaborationData] Project vision collaborators:',
        projectData?.vision?.collaborators
      );
      console.log(
        '[saveCollaborationData] Project positions:',
        projectData?.roles
      );

      // 获取现有的协作数据
      const stored = localStorage.getItem('mock_collaborations');
      const collaborations = stored ? JSON.parse(stored) : [];
      console.log(
        '[saveCollaborationData] Existing collaborations:',
        collaborations
      );

      // 更新指定的协作项目
      const updatedCollaborations = collaborations.map(collab => {
        if (collab.id === strippedProjectData.id) {
          console.log(
            '[saveCollaborationData] Updating collaboration:',
            collab.id
          );
          console.log(
            '[saveCollaborationData] Old collaborators:',
            collab.collaborators
          );
          console.log(
            '[saveCollaborationData] New collaborators:',
            projectData.collaborators
          );

          // 安全的合并策略：只更新需要变化的字段，保留原有数据
          const updatedCollab = {
            ...collab, // 保留原有完整数据
            // 只更新collaborators和roles，不覆盖其他字段
            collaborators:
              strippedProjectData.collaborators || collab.collaborators || [],
            roles: strippedProjectData.roles || collab.roles || [],
            // 安全地更新vision中的collaborators
            vision: {
              ...collab.vision,
              collaborators:
                strippedProjectData.vision?.collaborators ||
                strippedProjectData.collaborators ||
                collab.vision?.collaborators ||
                [],
            },
            // 保留所有原有的元数据，不覆盖
            author: collab.author, // 确保initiator信息不被覆盖
            authorId: collab.authorId,
            authorName: collab.authorName,
            authorAvatar: collab.authorAvatar,
            title: collab.title,
            description: collab.description,
            duration: collab.duration,
            teamSize: collab.teamSize,
            tags: collab.tags,
            status: collab.status,
            postedTime: collab.postedTime,
            applicationDeadline: collab.applicationDeadline,
            meetingFrequency: collab.meetingFrequency,
            contactInfo: collab.contactInfo,
            categories: collab.categories,
            milestones: collab.milestones,
          };

          console.log(
            '[saveCollaborationData] Updated collaboration:',
            updatedCollab
          );
          return updatedCollab;
        }
        return collab;
      });

      // 保存回localStorage，添加配额检查
      const dataToSave = JSON.stringify(updatedCollaborations);
      const dataSize = dataToSave.length;

      console.log(
        `[saveCollaborationData] Data size: ${(dataSize / 1024 / 1024).toFixed(
          2
        )} MB`
      );

      // 检查localStorage配额
      try {
        localStorage.setItem('mock_collaborations', dataToSave);
        console.log(
          '[saveCollaborationData] Successfully saved to localStorage'
        );
      } catch (quotaError) {
        if (quotaError.name === 'QuotaExceededError') {
          console.error(
            '[saveCollaborationData] localStorage quota exceeded, attempting smart cleanup...'
          );

          // 使用智能清理器清理空间
          try {
            const { default: smartDataCleaner } = await import(
              '../../../utils/smartDataCleaner.js'
            );

            // 执行智能清理
            const cleanupResult = await smartDataCleaner.manualCleanup([
              'avatarCache',
              'tempImages',
              'oldCollaborations',
              'draftData',
            ]);

            if (cleanupResult.success) {
              console.log(
                `[saveCollaborationData] Smart cleanup freed ${(
                  cleanupResult.freedSpace / 1024
                ).toFixed(1)}KB`
              );

              // 再次尝试保存
              localStorage.setItem('mock_collaborations', dataToSave);
              console.log(
                '[saveCollaborationData] Successfully saved after smart cleanup'
              );
            } else {
              throw new Error('Smart cleanup failed: ' + cleanupResult.error);
            }
          } catch (cleanupError) {
            console.error(
              '[saveCollaborationData] Smart cleanup failed, falling back to manual cleanup:',
              cleanupError
            );

            // 回退到手动清理
            const keysToRemove = [
              'tag.avatars',
              'tag.images',
              'portfolio_alice',
              'portfolio_bryan',
            ];
            keysToRemove.forEach(key => {
              if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                console.log(
                  `[saveCollaborationData] Removed ${key} to free space`
                );
              }
            });

            // 再次尝试保存
            localStorage.setItem('mock_collaborations', dataToSave);
            console.log(
              '[saveCollaborationData] Successfully saved after manual cleanup'
            );
          }
        } else {
          throw quotaError;
        }
      }

      // 验证保存的数据
      const verifyStored = localStorage.getItem('mock_collaborations');
      const verifyCollaborations = verifyStored ? JSON.parse(verifyStored) : [];
      const savedCollab = verifyCollaborations.find(
        c => c.id === strippedProjectData.id
      );
      console.log(
        '[saveCollaborationData] Verified saved collaborators:',
        savedCollab?.collaborators
      );
      console.log(
        '[saveCollaborationData] Verified saved vision collaborators:',
        savedCollab?.vision?.collaborators
      );
      console.log(
        '[saveCollaborationData] Verified saved positions:',
        savedCollab?.roles
      );
    } catch (error) {
      console.error(
        '[saveCollaborationData] Failed to save collaboration data:',
        error
      );
    }
  }, []);

  return {
    // 数据
    project,
    projectData,
    positions,
    appliedPositions,
    isSaved,
    showApplyModal,
    applyForm,
    hasSubmittedApplication,
    showWarning,
    showSuccessToast,
    showCancelModal,
    cancelPositionId,
    currentUser,

    // 功能开关
    enableProjectProgressBar,
    enableAfterFinishedReview,
    enableReviewApprovalPanel,

    // 状态更新函数
    setAppliedPositions,
    setIsSaved,
    setShowApplyModal,
    setApplyForm,
    setHasSubmittedApplication,
    setShowWarning,
    setShowSuccessToast,
    setShowCancelModal,
    setCancelPositionId,
    setCurrentUser,
    setPositions,

    // 新增的更新函数
    updateProjectData,
    updatePositions,
    saveCollaborationData,
  };
};

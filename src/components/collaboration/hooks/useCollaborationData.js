import { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useAppContext } from '../../../context/AppContext';
import { favoritesService } from '../../../services';
import { getProfile } from '../../../services';
import {
  getApplicationsData,
  updateApplicationUserName,
} from '../../../services/applicationService';
import {
  getApplyFormData,
  hasCompleteApplyFormData,
} from '../../../services/applyFormService';
import { getAllPositionStatus } from '../../../services/positionService';
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
  const [projectData, setProjectData] = useState(
    state.selectedCollaboration || location.state?.project
  );

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
    setProject(processedProject);
  }, [projectData, location, state]);

  // 处理数据加载和补充
  useEffect(() => {
    if (!id) return;

    // 检查当前数据是否完整
    const hasIncompleteData =
      projectData &&
      (!projectData.roles ||
        !projectData.collaborators ||
        !projectData.vision?.collaborators);

    // 如果没有数据或数据不完整，尝试从localStorage获取
    if (!projectData || hasIncompleteData) {
      console.log(
        '[useCollaborationData] No data or incomplete data, trying localStorage for id:',
        id
      );
      const localStorageData = getCollaborationDataById(id);
      if (localStorageData) {
        console.log(
          '[useCollaborationData] Found localStorage data:',
          localStorageData
        );
        console.log(
          '[useCollaborationData] localStorage collaborators:',
          localStorageData.collaborators
        );
        // 更新projectData状态，这会触发上面的useEffect重新处理数据
        setProjectData(localStorageData);
      }
    }
  }, [id, projectData?.id]); // 只在id或projectData.id变化时执行

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
    if (!project?.id) return;

    const loadPositionsWithStatus = () => {
      try {
        // 获取项目数据中的真实职位信息
        console.log('[useCollaborationData] Project data:', project);
        console.log('[useCollaborationData] Project roles:', project?.roles);
        const defaultPositions = getPositionsData(project);
        console.log(
          '[useCollaborationData] Generated positions:',
          defaultPositions
        );

        // 获取持久化的职位状态
        const savedStatus = getAllPositionStatus(project.id);

        // 加载申请记录
        const savedApplications = getApplicationsData(project.id);

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
                    updateApplicationUserName(currentUser.id, newName);
                    // 重新获取更新后的数据
                    const updatedApplications = getApplicationsData(project.id);
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

        // 应用保存的状态和申请记录到职位数据
        const positionsWithStatus = defaultPositions.map(position => ({
          ...position,
          status: savedStatus[position.id] || position.status,
          // 合并保存的申请记录
          applications:
            savedApplications?.[position.id] || position.applications || [],
        }));

        setPositions(positionsWithStatus);
        console.log(
          '[useCollaborationData] Loaded positions with saved status and applications:',
          positionsWithStatus
        );
      } catch (error) {
        console.error('Failed to load positions with status:', error);
        setPositions(getPositionsData());
      }
    };

    loadPositionsWithStatus();
  }, [project?.id]);

  // 初始化已申请职位状态
  useEffect(() => {
    if (!project?.id || !currentUser?.id) return;

    const initializeAppliedPositions = () => {
      try {
        // 获取已保存的申请记录
        const savedApplications = getApplicationsData(project.id);

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
    if (!project?.id) return;

    const loadApplyFormData = () => {
      try {
        const savedFormData = getApplyFormData(project.id);
        if (savedFormData) {
          setApplyForm(savedFormData);
          setHasSubmittedApplication(hasCompleteApplyFormData(project.id));
          console.log(
            '[useCollaborationData] Loaded saved apply form data:',
            savedFormData
          );
        }
      } catch (error) {
        console.error('Failed to load apply form data:', error);
      }
    };

    loadApplyFormData();
  }, [project?.id]);

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
  const saveCollaborationData = useCallback(projectData => {
    try {
      console.log('[saveCollaborationData] Saving project data:', projectData);
      console.log(
        '[saveCollaborationData] Project collaborators:',
        projectData?.collaborators
      );
      console.log(
        '[saveCollaborationData] Project vision collaborators:',
        projectData?.vision?.collaborators
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
        if (collab.id === projectData.id) {
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

          // 确保collaborators数据被正确保存
          const updatedCollab = {
            ...collab,
            ...projectData,
            collaborators:
              projectData.collaborators || collab.collaborators || [],
            vision: {
              ...collab.vision,
              ...projectData.vision,
              collaborators:
                projectData.vision?.collaborators ||
                projectData.collaborators ||
                collab.vision?.collaborators ||
                [],
            },
          };

          console.log(
            '[saveCollaborationData] Updated collaboration:',
            updatedCollab
          );
          return updatedCollab;
        }
        return collab;
      });

      // 保存回localStorage
      localStorage.setItem(
        'mock_collaborations',
        JSON.stringify(updatedCollaborations)
      );
      console.log('[saveCollaborationData] Successfully saved to localStorage');

      // 验证保存的数据
      const verifyStored = localStorage.getItem('mock_collaborations');
      const verifyCollaborations = verifyStored ? JSON.parse(verifyStored) : [];
      const savedCollab = verifyCollaborations.find(
        c => c.id === projectData.id
      );
      console.log(
        '[saveCollaborationData] Verified saved collaborators:',
        savedCollab?.collaborators
      );
      console.log(
        '[saveCollaborationData] Verified saved vision collaborators:',
        savedCollab?.vision?.collaborators
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

import { useState, useEffect } from 'react';
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

  // 从Context、路由状态、URL参数或localStorage获取项目数据
  let projectData = state.selectedCollaboration || location.state?.project;

  // 如果前两种方式都没有数据，尝试从localStorage获取
  if (!projectData && id) {
    console.log(
      '[useCollaborationData] No data from context/state, trying localStorage for id:',
      id
    );
    projectData = getCollaborationDataById(id);
    console.log('[useCollaborationData] Data from localStorage:', projectData);
  }

  // 调试信息
  console.log('[useCollaborationData] Final projectData:', projectData);
  console.log('[useCollaborationData] ID from URL:', id);
  console.log(
    '[useCollaborationData] Context data:',
    state.selectedCollaboration
  );
  console.log(
    '[useCollaborationData] Location state:',
    location.state?.project
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

  // 处理项目数据
  const project = processProjectData(projectData, location, state);

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
        // 获取默认职位数据
        const defaultPositions = getPositionsData();

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
  };
};

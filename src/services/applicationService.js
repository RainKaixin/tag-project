// applicationService.js - 申请服务

const STORAGE_KEY = 'applications';

/**
 * 获取申请记录
 * @param {string} collaborationId - 协作项目ID
 * @returns {Promise<Object|null>} 申请记录数据
 */
export const getApplicationsData = async collaborationId => {
  try {
    const key = `${STORAGE_KEY}_${collaborationId}`;
    const data = localStorage.getItem(key);

    if (!data) {
      console.log(
        `[applicationService] No applications data found for collaboration ${collaborationId}`
      );
      return null;
    }

    const parsedData = JSON.parse(data);
    console.log(
      `[applicationService] Retrieved applications data for collaboration ${collaborationId}:`,
      parsedData
    );

    return parsedData.applications || null;
  } catch (error) {
    console.error(
      '[applicationService] Failed to get applications data:',
      error
    );
    return null;
  }
};

/**
 * 保存申请记录
 * @param {string} collaborationId - 协作项目ID
 * @param {Object} applicationsData - 申请记录数据
 * @returns {Promise<Object>} 保存结果
 */
export const saveApplicationsData = async (
  collaborationId,
  applicationsData
) => {
  try {
    const key = `${STORAGE_KEY}_${collaborationId}`;
    const dataToSave = {
      applications: applicationsData,
      timestamp: Date.now(),
    };

    localStorage.setItem(key, JSON.stringify(dataToSave));

    console.log(
      `[applicationService] Saved applications data for collaboration ${collaborationId}:`,
      applicationsData
    );

    return { success: true, data: dataToSave };
  } catch (error) {
    console.error(
      '[applicationService] Failed to save applications data:',
      error
    );
    return { success: false, error: error.message };
  }
};

/**
 * 添加申请记录
 * @param {string} collaborationId - 协作项目ID
 * @param {number} positionId - 职位ID
 * @param {Object} application - 申请记录
 * @returns {Promise<Object>} 添加结果
 */
export const addApplication = async (
  collaborationId,
  positionId,
  application
) => {
  try {
    const currentData = (await getApplicationsData(collaborationId)) || {};
    const positionApplications = currentData[positionId] || [];

    // 检查是否已经申请过
    const existingIndex = positionApplications.findIndex(
      app => app.userId === application.userId
    );

    if (existingIndex >= 0) {
      console.log(
        `[applicationService] User ${application.userId} already applied for position ${positionId}`
      );
      return { success: false, error: 'Already applied' };
    }

    // 添加新申请
    const newApplication = {
      ...application,
      id: Date.now(),
      appliedAt: 'Just now',
      status: 'pending',
      positionId: positionId,
    };

    positionApplications.push(newApplication);
    currentData[positionId] = positionApplications;

    const saveResult = await saveApplicationsData(collaborationId, currentData);
    if (saveResult.success) {
      console.log(
        `[applicationService] Added application for user ${application.userId} to position ${positionId}`
      );
      return { success: true, data: newApplication };
    } else {
      return { success: false, error: 'Failed to save application' };
    }
  } catch (error) {
    console.error('[applicationService] Failed to add application:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 更新申请状态
 * @param {string} collaborationId - 协作项目ID
 * @param {number} positionId - 职位ID
 * @param {string} userId - 用户ID
 * @param {string} status - 新状态 ('pending', 'approved', 'rejected')
 * @returns {Promise<Object>} 更新结果
 */
export const updateApplicationStatus = async (
  collaborationId,
  positionId,
  userId,
  status
) => {
  try {
    const currentData = (await getApplicationsData(collaborationId)) || {};
    const positionApplications = currentData[positionId] || [];

    const applicationIndex = positionApplications.findIndex(
      app => app.userId === userId || app.id === userId
    );

    if (applicationIndex === -1) {
      console.log(
        `[applicationService] Application not found for user ${userId} in position ${positionId}`
      );
      return { success: false, error: 'Application not found' };
    }

    positionApplications[applicationIndex].status = status;
    currentData[positionId] = positionApplications;

    const saveResult = await saveApplicationsData(collaborationId, currentData);
    if (saveResult.success) {
      console.log(
        `[applicationService] Updated application status to ${status} for user ${userId} in position ${positionId}`
      );
      return { success: true, data: positionApplications[applicationIndex] };
    } else {
      return { success: false, error: 'Failed to save status update' };
    }
  } catch (error) {
    console.error(
      '[applicationService] Failed to update application status:',
      error
    );
    return { success: false, error: error.message };
  }
};

/**
 * 移除申请记录
 * @param {string} collaborationId - 协作项目ID
 * @param {number} positionId - 职位ID
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 移除结果
 */
export const removeApplication = async (
  collaborationId,
  positionId,
  userId
) => {
  try {
    const currentData = (await getApplicationsData(collaborationId)) || {};
    const positionApplications = currentData[positionId] || [];

    const applicationIndex = positionApplications.findIndex(
      app => app.userId === userId || app.id === userId
    );

    if (applicationIndex === -1) {
      console.log(
        `[applicationService] Application not found for user ${userId} in position ${positionId}`
      );
      return { success: false, error: 'Application not found' };
    }

    const removedApplication = positionApplications.splice(
      applicationIndex,
      1
    )[0];
    currentData[positionId] = positionApplications;

    const saveResult = await saveApplicationsData(collaborationId, currentData);
    if (saveResult.success) {
      console.log(
        `[applicationService] Removed application for user ${userId} from position ${positionId}`
      );
      return { success: true, data: removedApplication };
    } else {
      return { success: false, error: 'Failed to save removal' };
    }
  } catch (error) {
    console.error('[applicationService] Failed to remove application:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 更新申请记录中的用户姓名
 * @param {string} userId - 用户ID
 * @param {string} newName - 新的用户姓名
 * @returns {Promise<Object>} 更新结果
 */
export const updateApplicationUserName = async (userId, newName) => {
  try {
    // 遍历所有collaboration的申请记录
    const keys = Object.keys(localStorage);
    const applicationKeys = keys.filter(key => key.startsWith(STORAGE_KEY));

    let updatedCount = 0;
    for (const key of applicationKeys) {
      try {
        const data = localStorage.getItem(key);
        if (!data) continue;

        const parsedData = JSON.parse(data);
        const applications = parsedData.applications;

        if (!applications) continue;

        let hasChanges = false;
        Object.keys(applications).forEach(positionId => {
          const positionApplications = applications[positionId];
          positionApplications.forEach(application => {
            if (application.userId === userId && application.name !== newName) {
              application.name = newName;
              hasChanges = true;
            }
          });
        });

        if (hasChanges) {
          parsedData.applications = applications;
          localStorage.setItem(key, JSON.stringify(parsedData));
          updatedCount++;
        }
      } catch (error) {
        console.warn(
          `[applicationService] Failed to update key ${key}:`,
          error
        );
      }
    }

    console.log(
      `[applicationService] Updated application user name to ${newName} for user ${userId} in ${updatedCount} collaborations`
    );
    return { success: true, updatedCount };
  } catch (error) {
    console.error(
      '[applicationService] Failed to update application user name:',
      error
    );
    return { success: false, error: error.message };
  }
};

/**
 * 清除所有申请数据
 * @returns {Promise<Object>} 清除结果
 */
export const clearApplicationsData = async () => {
  try {
    const keys = Object.keys(localStorage);
    const applicationKeys = keys.filter(key => key.startsWith(STORAGE_KEY));

    applicationKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log(
      `[applicationService] Cleared ${applicationKeys.length} application data entries`
    );
    return { success: true, clearedCount: applicationKeys.length };
  } catch (error) {
    console.error(
      '[applicationService] Failed to clear applications data:',
      error
    );
    return { success: false, error: error.message };
  }
};

// 默认导出
const applicationService = {
  getApplicationsData,
  saveApplicationsData,
  addApplication,
  updateApplicationStatus,
  removeApplication,
  updateApplicationUserName,
  clearApplicationsData,
};

export default applicationService;

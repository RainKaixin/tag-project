// applicationService.js - 申请记录持久化服务

const STORAGE_KEY = 'tag_applications_data';

/**
 * 保存申请记录
 * @param {string} collaborationId - 协作项目ID
 * @param {Object} applicationsData - 申请记录数据
 * @returns {Object} 保存结果
 */
export const saveApplicationsData = (collaborationId, applicationsData) => {
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
 * 获取申请记录
 * @param {string} collaborationId - 协作项目ID
 * @returns {Object|null} 申请记录数据或null
 */
export const getApplicationsData = collaborationId => {
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
 * 添加申请记录
 * @param {string} collaborationId - 协作项目ID
 * @param {number} positionId - 职位ID
 * @param {Object} application - 申请记录
 * @returns {Object} 添加结果
 */
export const addApplication = (collaborationId, positionId, application) => {
  try {
    const currentData = getApplicationsData(collaborationId) || {};
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
    };

    const updatedData = {
      ...currentData,
      [positionId]: [...positionApplications, newApplication],
    };

    const result = saveApplicationsData(collaborationId, updatedData);

    console.log(
      `[applicationService] Added application for position ${positionId}:`,
      newApplication
    );

    return { success: true, data: newApplication };
  } catch (error) {
    console.error('[applicationService] Failed to add application:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 移除申请记录
 * @param {string} collaborationId - 协作项目ID
 * @param {number} positionId - 职位ID
 * @param {string} userId - 用户ID
 * @returns {Object} 移除结果
 */
export const removeApplication = (collaborationId, positionId, userId) => {
  try {
    const currentData = getApplicationsData(collaborationId) || {};
    const positionApplications = currentData[positionId] || [];

    const updatedApplications = positionApplications.filter(
      app => app.userId !== userId
    );

    const updatedData = {
      ...currentData,
      [positionId]: updatedApplications,
    };

    const result = saveApplicationsData(collaborationId, updatedData);

    console.log(
      `[applicationService] Removed application for user ${userId} from position ${positionId}`
    );

    return { success: true };
  } catch (error) {
    console.error('[applicationService] Failed to remove application:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 清除所有申请记录
 * @param {string} collaborationId - 协作项目ID
 * @returns {Object} 清除结果
 */
export const clearApplicationsData = collaborationId => {
  try {
    const key = `${STORAGE_KEY}_${collaborationId}`;
    localStorage.removeItem(key);

    console.log(
      `[applicationService] Cleared all applications data for collaboration ${collaborationId}`
    );

    return { success: true };
  } catch (error) {
    console.error(
      '[applicationService] Failed to clear applications data:',
      error
    );
    return { success: false, error: error.message };
  }
};

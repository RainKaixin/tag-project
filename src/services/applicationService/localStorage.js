// applicationService/localStorage.js - LocalStorage 适配器

const STORAGE_KEY = 'applications';

/**
 * LocalStorage 申请数据适配器
 * 提供申请数据的本地存储实现
 */
export const localStorageAdapter = {
  /**
   * 获取申请记录
   * @param {string} collaborationId - 协作项目ID
   * @returns {Promise<Object|null>} 申请记录数据
   */
  getApplicationsData: async collaborationId => {
    try {
      const key = `${STORAGE_KEY}_${collaborationId}`;
      const data = localStorage.getItem(key);

      if (!data) {
        console.log(
          `[localStorageAdapter] No applications data found for collaboration ${collaborationId}`
        );
        return null;
      }

      const parsedData = JSON.parse(data);
      console.log(
        `[localStorageAdapter] Retrieved applications data for collaboration ${collaborationId}:`,
        parsedData
      );

      return parsedData.applications || null;
    } catch (error) {
      console.error(
        '[localStorageAdapter] Failed to get applications data:',
        error
      );
      return null;
    }
  },

  /**
   * 保存申请记录
   * @param {string} collaborationId - 协作项目ID
   * @param {Object} applicationsData - 申请记录数据
   * @returns {Promise<Object>} 保存结果
   */
  saveApplicationsData: async (collaborationId, applicationsData) => {
    try {
      const key = `${STORAGE_KEY}_${collaborationId}`;
      const dataToSave = {
        applications: applicationsData,
        timestamp: Date.now(),
      };

      localStorage.setItem(key, JSON.stringify(dataToSave));

      console.log(
        `[localStorageAdapter] Saved applications data for collaboration ${collaborationId}:`,
        applicationsData
      );

      return { success: true, data: dataToSave };
    } catch (error) {
      console.error(
        '[localStorageAdapter] Failed to save applications data:',
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 添加申请记录
   * @param {string} collaborationId - 协作项目ID
   * @param {number} positionId - 职位ID
   * @param {Object} application - 申请记录
   * @returns {Promise<Object>} 添加结果
   */
  addApplication: async (collaborationId, positionId, application) => {
    try {
      const currentData =
        (await localStorageAdapter.getApplicationsData(collaborationId)) || {};
      const positionApplications = currentData[positionId] || [];

      // 检查是否已经申请过
      const existingIndex = positionApplications.findIndex(
        app => app.userId === application.userId
      );

      if (existingIndex >= 0) {
        console.log(
          `[localStorageAdapter] User ${application.userId} already applied for position ${positionId}`
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

      const result = await localStorageAdapter.saveApplicationsData(
        collaborationId,
        updatedData
      );

      console.log(
        `[localStorageAdapter] Added application for position ${positionId}:`,
        newApplication
      );

      return { success: true, data: newApplication };
    } catch (error) {
      console.error('[localStorageAdapter] Failed to add application:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 更新申请状态
   * @param {string} collaborationId - 协作项目ID
   * @param {number} positionId - 职位ID
   * @param {string} userId - 用户ID
   * @param {string} status - 新状态 ('pending', 'approved', 'rejected')
   * @returns {Promise<Object>} 更新结果
   */
  updateApplicationStatus: async (
    collaborationId,
    positionId,
    userId,
    status
  ) => {
    try {
      const currentData =
        (await localStorageAdapter.getApplicationsData(collaborationId)) || {};
      const positionApplications = currentData[positionId] || [];

      // 找到并更新申请状态
      const updatedApplications = positionApplications.map(app => {
        if (app.userId === userId) {
          return { ...app, status: status };
        }
        return app;
      });

      const updatedData = {
        ...currentData,
        [positionId]: updatedApplications,
      };

      const result = await localStorageAdapter.saveApplicationsData(
        collaborationId,
        updatedData
      );

      console.log(
        `[localStorageAdapter] Updated application status for user ${userId} in position ${positionId} to ${status}`
      );

      return { success: true, data: updatedApplications };
    } catch (error) {
      console.error(
        '[localStorageAdapter] Failed to update application status:',
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 移除申请记录
   * @param {string} collaborationId - 协作项目ID
   * @param {number} positionId - 职位ID
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 移除结果
   */
  removeApplication: async (collaborationId, positionId, userId) => {
    try {
      const currentData =
        (await localStorageAdapter.getApplicationsData(collaborationId)) || {};
      const positionApplications = currentData[positionId] || [];

      const updatedApplications = positionApplications.filter(
        app => app.userId !== userId
      );

      const updatedData = {
        ...currentData,
        [positionId]: updatedApplications,
      };

      const result = await localStorageAdapter.saveApplicationsData(
        collaborationId,
        updatedData
      );

      console.log(
        `[localStorageAdapter] Removed application for user ${userId} from position ${positionId}`
      );

      return { success: true };
    } catch (error) {
      console.error(
        '[localStorageAdapter] Failed to remove application:',
        error
      );
      return { success: false, error: error.message };
    }
  },

  /**
   * 更新申请记录中的用户姓名
   * @param {string} userId - 用户ID
   * @param {string} newName - 新的用户姓名
   * @returns {Promise<Object>} 更新结果
   */
  updateApplicationUserName: async (userId, newName) => {
    try {
      // 获取所有申请记录
      const allKeys = Object.keys(localStorage);
      const applicationKeys = allKeys.filter(key =>
        key.startsWith(STORAGE_KEY)
      );

      let updatedCount = 0;

      for (const key of applicationKeys) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const parsedData = JSON.parse(data);
            let needsUpdate = false;

            // 更新所有申请记录中的用户姓名
            Object.keys(parsedData.applications || {}).forEach(positionId => {
              parsedData.applications[positionId].forEach(application => {
                if (
                  application.userId === userId &&
                  application.name !== newName
                ) {
                  application.name = newName;
                  needsUpdate = true;
                }
              });
            });

            if (needsUpdate) {
              localStorage.setItem(key, JSON.stringify(parsedData));
              updatedCount++;
            }
          }
        } catch (error) {
          console.warn(
            `[localStorageAdapter] Failed to update application user name in key ${key}:`,
            error
          );
        }
      }

      console.log(
        `[localStorageAdapter] Updated application user name for user ${userId} in ${updatedCount} collaboration(s)`
      );

      return { success: true, updatedCount };
    } catch (error) {
      console.error(
        '[localStorageAdapter] Failed to update application user name:',
        error
      );
      return { success: false, error: error.message };
    }
  },
};

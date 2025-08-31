// applicationService/index.js - 申请服务主接口

import { localStorageAdapter } from './localStorage.js';
import { supabaseAdapter } from './supabase.js';

/**
 * 申请服务接口
 * 提供统一的申请数据访问，支持多数据源适配
 */
export const applicationService = {
  /**
   * 获取申请记录
   * @param {string} collaborationId - 协作项目ID
   * @returns {Promise<Object|null>} 申请记录数据
   */
  getApplicationsData: async collaborationId => {
    try {
      // 优先级1: LocalStorage (MockAPI)
      const localStorageData = await localStorageAdapter.getApplicationsData(
        collaborationId
      );
      if (localStorageData) {
        console.log(
          `[applicationService] Using LocalStorage applications data for collaboration ${collaborationId}`
        );
        return localStorageData;
      }

      // 优先级2: Supabase (预留)
      const supabaseData = await supabaseAdapter.getApplicationsData(
        collaborationId
      );
      if (supabaseData) {
        console.log(
          `[applicationService] Using Supabase applications data for collaboration ${collaborationId}`
        );
        return supabaseData;
      }

      console.log(
        `[applicationService] No applications data found for collaboration ${collaborationId}`
      );
      return null;
    } catch (error) {
      console.error(
        `[applicationService] Error getting applications data for collaboration ${collaborationId}:`,
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
      // 优先保存到 LocalStorage
      const result = await localStorageAdapter.saveApplicationsData(
        collaborationId,
        applicationsData
      );
      if (result.success) {
        console.log(
          `[applicationService] Saved applications data to LocalStorage for collaboration ${collaborationId}`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.saveApplicationsData(
        collaborationId,
        applicationsData
      );
      if (supabaseResult.success) {
        console.log(
          `[applicationService] Saved applications data to Supabase for collaboration ${collaborationId}`
        );
        return supabaseResult;
      }

      console.warn(
        `[applicationService] Failed to save applications data for collaboration ${collaborationId}`
      );
      return { success: false, error: 'Failed to save applications data' };
    } catch (error) {
      console.error(
        `[applicationService] Error saving applications data for collaboration ${collaborationId}:`,
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
      // 优先使用 LocalStorage
      const result = await localStorageAdapter.addApplication(
        collaborationId,
        positionId,
        application
      );
      if (result.success) {
        console.log(
          `[applicationService] Added application to LocalStorage for position ${positionId}`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.addApplication(
        collaborationId,
        positionId,
        application
      );
      if (supabaseResult.success) {
        console.log(
          `[applicationService] Added application to Supabase for position ${positionId}`
        );
        return supabaseResult;
      }

      console.warn(
        `[applicationService] Failed to add application for position ${positionId}`
      );
      return { success: false, error: 'Failed to add application' };
    } catch (error) {
      console.error(
        `[applicationService] Error adding application for position ${positionId}:`,
        error
      );
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
      // 优先使用 LocalStorage
      const result = await localStorageAdapter.updateApplicationStatus(
        collaborationId,
        positionId,
        userId,
        status
      );
      if (result.success) {
        console.log(
          `[applicationService] Updated application status to ${status} in LocalStorage for user ${userId} in position ${positionId}`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.updateApplicationStatus(
        collaborationId,
        positionId,
        userId,
        status
      );
      if (supabaseResult.success) {
        console.log(
          `[applicationService] Updated application status to ${status} in Supabase for user ${userId} in position ${positionId}`
        );
        return supabaseResult;
      }

      console.warn(
        `[applicationService] Failed to update application status for user ${userId} in position ${positionId}`
      );
      return { success: false, error: 'Failed to update application status' };
    } catch (error) {
      console.error(
        `[applicationService] Error updating application status for user ${userId} in position ${positionId}:`,
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
      // 优先使用 LocalStorage
      const result = await localStorageAdapter.removeApplication(
        collaborationId,
        positionId,
        userId
      );
      if (result.success) {
        console.log(
          `[applicationService] Removed application from LocalStorage for user ${userId} in position ${positionId}`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.removeApplication(
        collaborationId,
        positionId,
        userId
      );
      if (supabaseResult.success) {
        console.log(
          `[applicationService] Removed application from Supabase for user ${userId} in position ${positionId}`
        );
        return supabaseResult;
      }

      console.warn(
        `[applicationService] Failed to remove application for user ${userId} in position ${positionId}`
      );
      return { success: false, error: 'Failed to remove application' };
    } catch (error) {
      console.error(
        `[applicationService] Error removing application for user ${userId} in position ${positionId}:`,
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
      // 优先使用 LocalStorage
      const result = await localStorageAdapter.updateApplicationUserName(
        userId,
        newName
      );
      if (result.success) {
        console.log(
          `[applicationService] Updated application user name to ${newName} in LocalStorage for user ${userId}`
        );
        return result;
      }

      // 如果 LocalStorage 失败，尝试 Supabase
      const supabaseResult = await supabaseAdapter.updateApplicationUserName(
        userId,
        newName
      );
      if (supabaseResult.success) {
        console.log(
          `[applicationService] Updated application user name to ${newName} in Supabase for user ${userId}`
        );
        return supabaseResult;
      }

      console.warn(
        `[applicationService] Failed to update application user name for user ${userId}`
      );
      return {
        success: false,
        error: 'Failed to update application user name',
      };
    } catch (error) {
      console.error(
        `[applicationService] Error updating application user name for user ${userId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  },
};

export default applicationService;

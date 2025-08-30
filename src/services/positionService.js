// positionService.js - 职位状态管理服务

const STORAGE_KEY = 'tag_positions_status';

/**
 * 获取存储的职位状态
 * @param {string} collaborationId - 协作项目ID
 * @returns {Object} 职位状态映射
 */
const getStoredPositionStatus = collaborationId => {
  try {
    const key = `${STORAGE_KEY}_${collaborationId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.warn('Failed to get stored position status:', error);
    return {};
  }
};

/**
 * 保存职位状态
 * @param {string} collaborationId - 协作项目ID
 * @param {Object} positionStatus - 职位状态映射
 */
const savePositionStatus = (collaborationId, positionStatus) => {
  try {
    const key = `${STORAGE_KEY}_${collaborationId}`;
    localStorage.setItem(key, JSON.stringify(positionStatus));
    console.log(
      `[positionService] Saved position status for collaboration ${collaborationId}:`,
      positionStatus
    );
  } catch (error) {
    console.warn('Failed to save position status:', error);
  }
};

/**
 * 更新职位状态
 * @param {string} collaborationId - 协作项目ID
 * @param {number} positionId - 职位ID
 * @param {string} status - 新状态 ('available' | 'filled')
 * @returns {Object} 更新结果
 */
export const updatePositionStatus = (collaborationId, positionId, status) => {
  try {
    const currentStatus = getStoredPositionStatus(collaborationId);
    currentStatus[positionId] = status;
    savePositionStatus(collaborationId, currentStatus);

    return { success: true, data: currentStatus };
  } catch (error) {
    console.error('Failed to update position status:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 获取职位状态
 * @param {string} collaborationId - 协作项目ID
 * @param {number} positionId - 职位ID
 * @returns {string} 职位状态
 */
export const getPositionStatus = (collaborationId, positionId) => {
  try {
    const status = getStoredPositionStatus(collaborationId);
    return status[positionId] || 'available'; // 默认为 available
  } catch (error) {
    console.warn('Failed to get position status:', error);
    return 'available';
  }
};

/**
 * 获取所有职位状态
 * @param {string} collaborationId - 协作项目ID
 * @returns {Object} 所有职位状态
 */
export const getAllPositionStatus = collaborationId => {
  return getStoredPositionStatus(collaborationId);
};

/**
 * 重置职位状态
 * @param {string} collaborationId - 协作项目ID
 * @returns {Object} 重置结果
 */
export const resetPositionStatus = collaborationId => {
  try {
    const key = `${STORAGE_KEY}_${collaborationId}`;
    localStorage.removeItem(key);
    console.log(
      `[positionService] Reset position status for collaboration ${collaborationId}`
    );
    return { success: true };
  } catch (error) {
    console.error('Failed to reset position status:', error);
    return { success: false, error: error.message };
  }
};

// applicationStorage.js - 申请状态存储工具

const STORAGE_PREFIX = 'applicationStatus';

/**
 * 保存申请状态
 * @param {string} positionId - 职位ID
 * @param {string} applicantId - 申请人ID
 * @param {string} status - 状态 ('approved', 'rejected')
 */
export const saveApplicationStatus = (positionId, applicantId, status) => {
  try {
    const key = `${STORAGE_PREFIX}:${positionId}:${applicantId}`;
    const data = {
      status,
      timestamp: Date.now(),
      positionId,
      applicantId,
    };

    localStorage.setItem(key, JSON.stringify(data));

    console.log(
      `[applicationStorage] Saved status: ${status} for position ${positionId}, applicant ${applicantId}`
    );
    return { success: true };
  } catch (error) {
    console.error(
      '[applicationStorage] Failed to save application status:',
      error
    );
    return { success: false, error: error.message };
  }
};

/**
 * 获取申请状态
 * @param {string} positionId - 职位ID
 * @param {string} applicantId - 申请人ID
 * @returns {string|null} 状态或null
 */
export const getApplicationStatus = (positionId, applicantId) => {
  try {
    const key = `${STORAGE_PREFIX}:${positionId}:${applicantId}`;
    const data = localStorage.getItem(key);

    if (!data) {
      console.log(
        `[applicationStorage] No status found for position ${positionId}, applicant ${applicantId}`
      );
      return null;
    }

    const parsed = JSON.parse(data);
    console.log(
      `[applicationStorage] Retrieved status: ${parsed.status} for position ${positionId}, applicant ${applicantId}`
    );
    return parsed.status;
  } catch (error) {
    console.error(
      '[applicationStorage] Failed to get application status:',
      error
    );
    return null;
  }
};

/**
 * 检查申请是否已被批准
 * @param {string} positionId - 职位ID
 * @param {string} applicantId - 申请人ID
 * @returns {boolean}
 */
export const isApplicationApproved = (positionId, applicantId) => {
  const status = getApplicationStatus(positionId, applicantId);
  return status === 'approved';
};

/**
 * 获取所有申请状态（调试用）
 * @returns {Object} 所有申请状态
 */
export const getAllApplicationStatuses = () => {
  try {
    const result = {};
    const keys = Object.keys(localStorage);

    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          result[key] = data;
        } catch (e) {
          console.warn(`[applicationStorage] Failed to parse key ${key}:`, e);
        }
      }
    });

    console.log('[applicationStorage] All application statuses:', result);
    return result;
  } catch (error) {
    console.error(
      '[applicationStorage] Failed to get all application statuses:',
      error
    );
    return {};
  }
};

/**
 * 清除所有申请状态（调试用）
 */
export const clearAllApplicationStatuses = () => {
  try {
    const keys = Object.keys(localStorage);
    let clearedCount = 0;

    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    });

    console.log(
      `[applicationStorage] Cleared ${clearedCount} application statuses`
    );
    return { success: true, clearedCount };
  } catch (error) {
    console.error(
      '[applicationStorage] Failed to clear application statuses:',
      error
    );
    return { success: false, error: error.message };
  }
};

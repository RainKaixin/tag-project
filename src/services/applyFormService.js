// applyFormService.js - Apply Now表单数据持久化服务

const STORAGE_KEY = 'tag_apply_form_data';

/**
 * 保存Apply Now表单数据
 * @param {string} collaborationId - 协作项目ID
 * @param {string} userId - 用户ID
 * @param {Object} formData - 表单数据
 * @returns {Object} 保存结果
 */
export const saveApplyFormData = (collaborationId, userId, formData) => {
  try {
    const key = `${STORAGE_KEY}_${collaborationId}_${userId}`;
    const dataToSave = {
      ...formData,
      userId: userId,
      timestamp: Date.now(),
    };

    localStorage.setItem(key, JSON.stringify(dataToSave));

    console.log(
      `[applyFormService] Saved apply form data for collaboration ${collaborationId}, user ${userId}:`,
      formData
    );

    return { success: true, data: dataToSave };
  } catch (error) {
    console.error('[applyFormService] Failed to save apply form data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 获取Apply Now表单数据
 * @param {string} collaborationId - 协作项目ID
 * @param {string} userId - 用户ID
 * @returns {Object|null} 表单数据或null
 */
export const getApplyFormData = (collaborationId, userId) => {
  try {
    const key = `${STORAGE_KEY}_${collaborationId}_${userId}`;
    const data = localStorage.getItem(key);

    if (!data) {
      console.log(
        `[applyFormService] No apply form data found for collaboration ${collaborationId}, user ${userId}`
      );
      return null;
    }

    const parsedData = JSON.parse(data);
    console.log(
      `[applyFormService] Retrieved apply form data for collaboration ${collaborationId}, user ${userId}:`,
      parsedData
    );

    return parsedData;
  } catch (error) {
    console.error('[applyFormService] Failed to get apply form data:', error);
    return null;
  }
};

/**
 * 检查是否有完整的Apply Now表单数据
 * @param {string} collaborationId - 协作项目ID
 * @param {string} userId - 用户ID
 * @returns {boolean} 是否有完整数据
 */
export const hasCompleteApplyFormData = (collaborationId, userId) => {
  try {
    const formData = getApplyFormData(collaborationId, userId);

    if (!formData) {
      return false;
    }

    // 检查必填字段是否完整（移除name字段验证，因为使用用户个人资料中的姓名）
    const hasEmail = formData.email && formData.email.trim() !== '';

    const isComplete = hasEmail;

    console.log(
      `[applyFormService] Form data completeness check for collaboration ${collaborationId}, user ${userId}:`,
      { hasEmail, isComplete }
    );

    return isComplete;
  } catch (error) {
    console.error(
      '[applyFormService] Failed to check form data completeness:',
      error
    );
    return false;
  }
};

/**
 * 清除Apply Now表单数据
 * @param {string} collaborationId - 协作项目ID
 * @param {string} userId - 用户ID
 * @returns {Object} 清除结果
 */
export const clearApplyFormData = (collaborationId, userId) => {
  try {
    const key = `${STORAGE_KEY}_${collaborationId}_${userId}`;
    localStorage.removeItem(key);

    console.log(
      `[applyFormService] Cleared apply form data for collaboration ${collaborationId}, user ${userId}`
    );

    return { success: true };
  } catch (error) {
    console.error('[applyFormService] Failed to clear apply form data:', error);
    return { success: false, error: error.message };
  }
};

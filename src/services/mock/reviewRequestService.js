// after-finished-review v1 (mock service) - 使用localStorage模拟后端服务

// localStorage键名规范
const STORAGE_KEYS = {
  REVIEW_REQUESTS: 'tag_review_requests',
  FINAL_COMMENTS: 'tag_final_comments',
  NOTIFICATIONS: 'tag_notifications',
};

// 生成唯一ID
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

// 获取当前时间戳
const getCurrentTimestamp = () => new Date().toISOString();

// 初始化localStorage数据
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.REVIEW_REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEW_REQUESTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FINAL_COMMENTS)) {
    localStorage.setItem(STORAGE_KEYS.FINAL_COMMENTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
};

// 获取存储数据
const getStorageData = key => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return [];
  }
};

// 保存数据到localStorage
const saveStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// 创建通知
const createNotification = notification => {
  const notifications = getStorageData(STORAGE_KEYS.NOTIFICATIONS);
  const newNotification = {
    id: generateId(),
    ...notification,
    createdAt: getCurrentTimestamp(),
    isRead: false,
  };
  notifications.unshift(newNotification);
  saveStorageData(STORAGE_KEYS.NOTIFICATIONS, notifications);
  return newNotification;
};

// 发送评论请求
export const sendReviewRequest = async (
  projectId,
  userId,
  projectName,
  userName
) => {
  initializeStorage();

  const requests = getStorageData(STORAGE_KEYS.REVIEW_REQUESTS);

  // 检查是否已有请求
  const existingRequest = requests.find(
    req => req.projectId === projectId && req.userId === userId
  );

  if (existingRequest) {
    throw new Error('Review request already exists');
  }

  // 创建新请求
  const newRequest = {
    id: generateId(),
    projectId,
    userId,
    userName,
    projectName,
    status: 'pending', // 'pending' | 'approved' | 'denied'
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  };

  requests.push(newRequest);
  saveStorageData(STORAGE_KEYS.REVIEW_REQUESTS, requests);

  // 为项目Owner创建通知
  createNotification({
    type: 'review_request',
    recipientId: 'project_owner', // 这里应该传入真实的Owner ID
    title: 'New Review Request',
    message: `${userName} 请求为项目 "${projectName}" 写最终评论`,
    projectId,
    meta: {
      requestId: newRequest.id,
      requesterId: userId,
      requesterName: userName,
    },
  });

  return newRequest;
};

// 获取评论状态
export const getReviewState = async (projectId, userId) => {
  initializeStorage();

  const requests = getStorageData(STORAGE_KEYS.REVIEW_REQUESTS);
  const userRequest = requests.find(
    req => req.projectId === projectId && req.userId === userId
  );

  if (!userRequest) {
    return 'none';
  }

  return userRequest.status;
};

// 获取项目评论请求列表
export const getProjectReviewRequests = async projectId => {
  initializeStorage();

  const requests = getStorageData(STORAGE_KEYS.REVIEW_REQUESTS);
  return requests.filter(req => req.projectId === projectId);
};

// 更新评论请求状态
export const updateReviewRequest = async (requestId, status, ownerId) => {
  initializeStorage();

  const requests = getStorageData(STORAGE_KEYS.REVIEW_REQUESTS);
  const requestIndex = requests.findIndex(req => req.id === requestId);

  if (requestIndex === -1) {
    throw new Error('Review request not found');
  }

  const request = requests[requestIndex];
  request.status = status;
  request.updatedAt = getCurrentTimestamp();

  requests[requestIndex] = request;
  saveStorageData(STORAGE_KEYS.REVIEW_REQUESTS, requests);

  // 为请求者创建通知
  createNotification({
    type: 'review_response',
    recipientId: request.userId,
    title: 'Review Request Response',
    message: `Your review request for "${request.projectName}" has been ${status}`,
    projectId: request.projectId,
    meta: {
      requestId: request.id,
      status,
      projectName: request.projectName,
    },
  });

  return request;
};

// 创建最终评论
export const createFinalComment = async (
  projectId,
  commentData,
  ownerId = null,
  projectName = null
) => {
  initializeStorage();

  const comments = getStorageData(STORAGE_KEYS.FINAL_COMMENTS);

  // 检查是否已有评论
  const existingComment = comments.find(
    comment =>
      comment.projectId === projectId &&
      comment.authorId === commentData.authorId
  );

  if (existingComment) {
    throw new Error('Final comment already exists for this project');
  }

  // 验证请求状态 - 先检查协作请求，再检查review请求
  let isApproved = false;

  // 检查协作请求状态
  try {
    const { getCollaborationRequestStatus } = await import(
      './collaborationRequestService'
    );
    const collaborationStatus = await getCollaborationRequestStatus(
      projectId,
      commentData.authorId
    );
    if (collaborationStatus === 'approved') {
      isApproved = true;
    }
  } catch (error) {
    // No collaboration request found, checking review request
  }

  // 如果没有协作请求或协作请求未批准，检查review请求
  if (!isApproved) {
    const requests = getStorageData(STORAGE_KEYS.REVIEW_REQUESTS);
    const userRequest = requests.find(
      req => req.projectId === projectId && req.userId === commentData.authorId
    );

    if (userRequest && userRequest.status === 'approved') {
      isApproved = true;
    }
  }

  if (!isApproved) {
    throw new Error('Review request not approved');
  }

  // 创建新评论
  const newComment = {
    id: generateId(),
    projectId,
    authorId: commentData.authorId,
    authorName: commentData.authorName,
    authorRole: commentData.authorRole,
    text: commentData.text,
    sentiment: commentData.sentiment || 'neutral',
    createdAt: getCurrentTimestamp(),
  };

  comments.push(newComment);
  saveStorageData(STORAGE_KEYS.FINAL_COMMENTS, comments);

  // 为项目Owner创建通知
  if (ownerId) {
    try {
      const { createGeneralNotification } = await import(
        './notificationService.mock.js'
      );
      await createGeneralNotification({
        userId: ownerId,
        type: 'final_comment',
        title: 'New Final Comment',
        message: `${commentData.authorName} has submitted a final comment for project "${projectId}"`,
        projectId,
        meta: {
          commentId: newComment.id,
          authorId: commentData.authorId,
          authorName: commentData.authorName,
          authorRole: commentData.authorRole,
          commentText: commentData.text,
          sentiment: commentData.sentiment || 'neutral',
          projectName: projectName || projectId,
        },
      });
    } catch (error) {
      console.error('Error creating final comment notification:', error);
    }
  }

  return newComment;
};

// 获取项目最终评论列表
export const getProjectFinalComments = async projectId => {
  initializeStorage();

  const comments = getStorageData(STORAGE_KEYS.FINAL_COMMENTS);
  return comments.filter(comment => comment.projectId === projectId);
};

// 清除测试数据
export const clearTestData = () => {
  localStorage.removeItem(STORAGE_KEYS.REVIEW_REQUESTS);
  localStorage.removeItem(STORAGE_KEYS.FINAL_COMMENTS);
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
};

// 兼容性函數 - 為新的API提供支持
export const sendStandardRequest = async (
  projectId,
  userId,
  projectTitle,
  userName
) => {
  return sendReviewRequest(projectId, userId, projectTitle, userName);
};

export const canSubmitComment = async (projectId, userId) => {
  // 先检查协作请求状态
  try {
    const { getCollaborationRequestStatus } = await import(
      './collaborationRequestService'
    );
    const collaborationStatus = await getCollaborationRequestStatus(
      projectId,
      userId
    );
    if (collaborationStatus === 'approved') {
      return true;
    }
  } catch (error) {
    // No collaboration request found, checking review request
  }

  // 如果没有协作请求或协作请求未批准，检查review请求
  const state = await getReviewState(projectId, userId);
  return state === 'approved';
};

export const submitFinalComment = async (
  projectId,
  userId,
  comment,
  emotion,
  ownerId = null,
  projectName = null,
  userName = null,
  userRole = null
) => {
  return createFinalComment(
    projectId,
    {
      authorId: userId,
      authorName: userName || 'User', // 使用传入的用户名
      authorRole: userRole || 'Member', // 使用传入的用户角色
      text: comment,
      sentiment: emotion,
    },
    ownerId,
    projectName
  );
};

export const resetReviewRequests = async () => {
  clearTestData();
};

export const getAllReviewRequests = async () => {
  initializeStorage();
  return getStorageData(STORAGE_KEYS.REVIEW_REQUESTS);
};

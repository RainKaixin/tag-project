// 协作请求服务
const STORAGE_KEY = 'tag.collaboration_requests';

// 生成唯一ID
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

// 获取当前时间
const nowISO = () => new Date().toISOString();

// 读取协作请求数据
const readCollaborationRequests = () => {
  try {
    if (typeof window === 'undefined') return [];
    const data = window.localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading collaboration requests:', error);
    return [];
  }
};

// 写入协作请求数据
const writeCollaborationRequests = data => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing collaboration requests:', error);
  }
};

// 创建协作请求
export const createCollaborationRequest = async params => {
  const {
    projectId,
    projectName,
    requesterId,
    requesterName,
    requesterAvatar,
    ownerId,
    ownerName,
    message = '',
  } = params;

  const request = {
    id: generateId(),
    projectId,
    projectName,
    requesterId,
    requesterName,
    requesterAvatar,
    ownerId,
    ownerName,
    message,
    status: 'pending', // 'pending' | 'approved' | 'denied'
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };

  const requests = readCollaborationRequests();
  requests.unshift(request);
  writeCollaborationRequests(requests);

  // 触发事件通知
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('collaboration:requestCreated', {
        detail: { request },
      })
    );
  }

  return request;
};

// 获取用户收到的协作请求
export const getCollaborationRequestsByOwner = async ownerId => {
  const requests = readCollaborationRequests();
  return requests.filter(request => request.ownerId === ownerId);
};

// 获取用户发送的协作请求
export const getCollaborationRequestsByRequester = async requesterId => {
  const requests = readCollaborationRequests();
  return requests.filter(request => request.requesterId === requesterId);
};

// 审批协作请求
export const approveCollaborationRequest = async (requestId, ownerId) => {
  const requests = readCollaborationRequests();
  const requestIndex = requests.findIndex(
    req => req.id === requestId && req.ownerId === ownerId
  );

  if (requestIndex === -1) {
    throw new Error('Request not found');
  }

  const request = requests[requestIndex];
  request.status = 'approved';
  request.updatedAt = nowISO();

  writeCollaborationRequests(requests);

  // 为请求者创建审批通过通知
  try {
    const { createGeneralNotification } = await import(
      './notificationService.mock.js'
    );
    await createGeneralNotification({
      userId: request.requesterId,
      type: 'collaboration',
      title: 'Collaboration Request Approved',
      message: `Your collaboration request for project "${request.projectName}" has been approved by ${request.ownerName}. You can now submit your final review.`,
      projectId: request.projectId,
      meta: {
        requestId: request.id,
        status: 'approved',
        projectName: request.projectName,
        ownerName: request.ownerName,
      },
    });
  } catch (error) {
    console.error('Error creating approval notification:', error);
  }

  // 触发事件通知
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('collaboration:requestStatusChanged', {
        detail: {
          requestId,
          status: 'approved',
          request: request,
        },
      })
    );
  }

  return request;
};

// 拒绝协作请求
export const denyCollaborationRequest = async (requestId, ownerId) => {
  const requests = readCollaborationRequests();
  const requestIndex = requests.findIndex(
    req => req.id === requestId && req.ownerId === ownerId
  );

  if (requestIndex === -1) {
    throw new Error('Request not found');
  }

  const request = requests[requestIndex];
  request.status = 'denied';
  request.updatedAt = nowISO();

  writeCollaborationRequests(requests);

  // 为请求者创建拒绝通知
  try {
    const { createGeneralNotification } = await import(
      './notificationService.mock.js'
    );
    await createGeneralNotification({
      userId: request.requesterId,
      type: 'collaboration',
      title: 'Collaboration Request Denied',
      message: `Your collaboration request for project "${request.projectName}" has been denied by ${request.ownerName}.`,
      projectId: request.projectId,
      meta: {
        requestId: request.id,
        status: 'denied',
        projectName: request.projectName,
        ownerName: request.ownerName,
      },
    });
  } catch (error) {
    console.error('Error creating denial notification:', error);
  }

  // 触发事件通知
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('collaboration:requestStatusChanged', {
        detail: {
          requestId,
          status: 'denied',
          request: request,
        },
      })
    );
  }

  return request;
};

// 获取请求状态
export const getCollaborationRequestStatus = async (projectId, requesterId) => {
  const requests = readCollaborationRequests();
  const request = requests.find(
    req => req.projectId === projectId && req.requesterId === requesterId
  );
  return request ? request.status : 'none';
};

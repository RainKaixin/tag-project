// notification-service v1: Mock implementation
// IMPORTANT: Keep function signatures in sync with contracts/notificationService.d.ts
// Do NOT import this file from UI. Always import from './index'.

const KEY_PREFIX = 'tag.notifications.';
const EVT_UNREAD_CHANGED = 'notif:unreadChanged';
const storageKey = userId => `${KEY_PREFIX}${userId}`;

function readNotifications(userId) {
  try {
    if (typeof window === 'undefined') return [];
    const data = window.localStorage.getItem(storageKey(userId));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function writeNotifications(userId, list) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey(userId), JSON.stringify(list));
    }
  } catch (error) {
    console.warn('Failed to write notifications:', error);
  }
}

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);
const nowISO = () => new Date().toISOString();

export const getUserNotifications = async userId =>
  readNotifications(userId).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );

export const getUnreadCount = async userId =>
  readNotifications(userId).filter(n => !n.isRead).length;

export const markNotificationAsRead = async (notifId, userId) => {
  const list = readNotifications(userId);
  const idx = list.findIndex(n => n.id === notifId);
  if (idx === -1 || list[idx].isRead) return;
  list[idx].isRead = true;
  writeNotifications(userId, list);
  if (typeof window !== 'undefined')
    window.dispatchEvent(
      new CustomEvent(EVT_UNREAD_CHANGED, { detail: { userId } })
    );
};

export const markAllAsRead = async userId => {
  const list = readNotifications(userId);
  let changed = false;
  for (const n of list)
    if (!n.isRead) {
      n.isRead = true;
      changed = true;
    }
  if (!changed) return;
  writeNotifications(userId, list);
  if (typeof window !== 'undefined')
    window.dispatchEvent(
      new CustomEvent(EVT_UNREAD_CHANGED, { detail: { userId } })
    );
};

// Development helpers
export const createTestNotification = async params => {
  const n = {
    id: generateId(),
    userId: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    projectId: params.projectId,
    isRead: false,
    createdAt: nowISO(),
  };
  const list = readNotifications(params.userId);
  list.unshift(n);
  writeNotifications(params.userId, list);
  if (typeof window !== 'undefined')
    window.dispatchEvent(
      new CustomEvent(EVT_UNREAD_CHANGED, { detail: { userId: params.userId } })
    );
  return n;
};

// 创建 Collaboration 通知
export const createCollaborationNotification = async params => {
  const n = {
    id: generateId(),
    userId: params.userId,
    type: 'collaboration',
    title: params.title,
    message: params.message,
    projectId: params.projectId,
    meta: params.meta || {},
    isRead: false,
    createdAt: nowISO(),
  };
  const list = readNotifications(params.userId);
  list.unshift(n);
  writeNotifications(params.userId, list);
  if (typeof window !== 'undefined')
    window.dispatchEvent(
      new CustomEvent(EVT_UNREAD_CHANGED, { detail: { userId: params.userId } })
    );
  return n;
};

// 创建协作请求通知
export const createCollaborationRequestNotification = async params => {
  const n = {
    id: generateId(),
    userId: params.userId,
    type: 'collaboration',
    title: 'Collaboration Request',
    message: `New collaboration request for project "${params.projectName}" from ${params.requesterName}`,
    projectId: params.projectId,
    meta: {
      requestId: params.requestId,
      requesterId: params.requesterId,
      requesterName: params.requesterName,
      requesterAvatar: params.requesterAvatar,
      projectName: params.projectName,
      status: 'pending', // 添加状态信息
    },
    isRead: false,
    createdAt: nowISO(),
  };
  const list = readNotifications(params.userId);
  list.unshift(n);
  writeNotifications(params.userId, list);
  if (typeof window !== 'undefined')
    window.dispatchEvent(
      new CustomEvent(EVT_UNREAD_CHANGED, { detail: { userId: params.userId } })
    );
  return n;
};

// 创建其他类型通知
export const createGeneralNotification = async params => {
  const n = {
    id: generateId(),
    userId: params.userId,
    type: params.type || 'general',
    title: params.title,
    message: params.message,
    projectId: params.projectId,
    meta: params.meta || {},
    isRead: false,
    createdAt: nowISO(),
  };
  const list = readNotifications(params.userId);
  list.unshift(n);
  writeNotifications(params.userId, list);
  if (typeof window !== 'undefined')
    window.dispatchEvent(
      new CustomEvent(EVT_UNREAD_CHANGED, { detail: { userId: params.userId } })
    );
  return n;
};

export const clearUserNotifications = async userId => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(storageKey(userId));
    window.dispatchEvent(
      new CustomEvent(EVT_UNREAD_CHANGED, { detail: { userId } })
    );
  } catch (error) {
    console.warn('Failed to clear notifications:', error);
  }
};

// services-index v1: 服務統一導出

// 导出新的统一服务接口
export { userService } from './userService/index.js';
export { workService } from './workService/index.js';
export { artistService } from './artistService/index.js';

// 导出现有的 portfolio 服务（保持向后兼容）
export * from './supabase/portfolio.js';

// 导出现有的其他服务
export * from './supabase/auth.js';
export * from './supabase/artworks.js';
export * from './supabase/client.js';
export * from './supabase/users.js';
export * from './supabase/comments.js';
export * from './supabase/notifications.js';

// 导出 collaborations 服务（避免冲突）
export {
  createCollaboration,
  getCollaboration,
  getCollaborations,
  updateCollaboration,
  deleteCollaboration,
  searchCollaborations,
  applyToCollaboration,
  approveApplication,
  getUserApplicationStatus,
} from './supabase/collaborations.js';

// 导出收藏服务
export { default as favoritesService } from './favoritesService/index.js';
export { default as draftService } from './draftService/index.js';

// 导出通知服务
export { notificationService } from './notificationService/index.js';

// 导出评论服务
export { commentService } from './commentService/index.js';

// 导出 mock 服务中的特定函数（保持向后兼容）
export { getProfile, saveProfile } from './mock/userProfileService.js';
export { createCollaborationRequestNotification } from './mock/notificationService.mock.js';
export {
  submitFinalComment,
  getReviewState,
} from './mock/reviewRequestService.js';
export {
  createCollaborationRequest,
  getCollaborationRequestStatus,
} from './mock/collaborationRequestService.js';
export {
  uploadAvatar,
  getAvatarUrlWithCacheBust,
} from './mock/avatarService.mock.js';

// 导出 mock 服务（重命名避免冲突）
export * as mockArtworkService from './mock/artworkService.js';
export * as mockAvatarService from './mock/avatarService.mock.js';
export * as mockCollaborationRequestService from './mock/collaborationRequestService.js';
export * as mockNotificationService from './mock/notificationService.mock.js';
export * as mockReviewRequestService from './mock/reviewRequestService.js';
export * as mockUserProfileService from './mock/userProfileService.js';

// 导出 Supabase 客户端
export { supabase, checkSupabaseConnection } from './supabase/client.js';

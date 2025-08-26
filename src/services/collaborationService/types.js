// collaboration-service-types v1: 協作項目數據模型定義
// 設計與 Supabase 兼容的數據結構，確保 Mock API 與未來後端完美對接

/**
 * 協作項目數據模型
 * 與 Supabase 數據庫表結構保持一致
 */
export const collaborationPostSchema = {
  // 基礎信息
  id: 'string', // 唯一標識符 (UUID)
  title: 'string', // 項目標題 (必填)
  description: 'string', // 項目描述 (必填)
  projectVision: 'string', // 項目願景 (必填，200字符限制)
  whyThisMatters: 'string', // 項目意義 (可選，1000字符限制)

  // 項目配置
  teamSize: 'string', // 團隊規模 (必填)
  duration: 'string', // 持續時間 (必填)
  meetingSchedule: 'string', // 會議安排 (必填)
  applicationDeadline: 'string', // 申請截止日期 (必填)
  projectType: 'string', // 項目類型/標籤 (可選)

  // 聯繫方式
  contactInfo: {
    email: 'string', // 郵箱 (必填)
    discord: 'string', // Discord (可選)
    other: 'string', // 其他聯繫方式 (可選)
  },

  // 團隊角色
  roles: [
    {
      id: 'string', // 角色ID
      title: 'string', // 角色名稱 (必填)
      description: 'string', // 角色描述 (必填)
      requiredSkills: 'string', // 所需技能 (可選)
      status: 'available|filled|in_progress', // 職位狀態
    },
  ],

  // 作者信息
  author: {
    id: 'string', // 作者ID
    name: 'string', // 作者姓名
    avatar: 'string', // 作者頭像
    role: 'string', // 作者角色
  },

  // 狀態和統計
  status: 'active|completed|paused', // 項目狀態
  createdAt: 'timestamp', // 創建時間
  updatedAt: 'timestamp', // 更新時間
  likes: 'number', // 點讚數
  views: 'number', // 瀏覽量

  // 申請相關
  applications: [], // 申請列表
};

/**
 * 創建協作項目的請求數據結構
 */
export const createCollaborationRequest = {
  title: '',
  description: '',
  projectVision: '',
  whyThisMatters: '',
  teamSize: '',
  duration: '',
  meetingSchedule: '',
  applicationDeadline: '',
  projectType: '',
  contactInfo: {
    email: '',
    discord: '',
    other: '',
  },
  roles: [],
};

/**
 * 更新協作項目的請求數據結構
 */
export const updateCollaborationRequest = {
  ...createCollaborationRequest,
  status: 'active',
};

/**
 * 協作項目列表查詢選項
 */
export const collaborationQueryOptions = {
  page: 1, // 頁碼
  limit: 12, // 每頁數量
  status: 'active', // 狀態篩選
  authorId: null, // 作者篩選
  searchTerm: '', // 搜索關鍵詞
  sortBy: 'createdAt', // 排序字段
  sortOrder: 'desc', // 排序方向
};

/**
 * API 響應格式
 */
export const apiResponseFormat = {
  success: true, // 操作是否成功
  data: null, // 響應數據
  error: null, // 錯誤信息
  message: '', // 提示信息
  pagination: {
    // 分頁信息
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
};

/**
 * Mock 存儲鍵名定義
 */
export const MOCK_STORAGE_KEYS = {
  COLLABORATIONS: 'mock_collaborations',
  COLLABORATION_APPLICATIONS: 'mock_collaboration_applications',
  COLLABORATION_LIKES: 'mock_collaboration_likes',
  COLLABORATION_VIEWS: 'mock_collaboration_views',
  COLLABORATION_FAVORITES: 'mock_collaboration_favorites',
};

/**
 * 職位狀態枚舉
 */
export const POSITION_STATUS = {
  AVAILABLE: 'available',
  FILLED: 'filled',
  IN_PROGRESS: 'in_progress',
};

/**
 * 項目狀態枚舉
 */
export const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
};

/**
 * 申請狀態枚舉
 */
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

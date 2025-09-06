// tag-service v1: 標籤服務接口

// 根據環境變量決定使用哪個實現
const API_IMPL = process.env.REACT_APP_API_IMPL || 'supabase';

// 導入所有可能的實現
import * as mockTagService from './mock';
import * as supabaseTagService from './supabase';

// 根據環境變量選擇實現
const tagService =
  API_IMPL === 'supabase' ? supabaseTagService : mockTagService;

// 重新導出所有函數
export const getTagStats = tagService.getTagStats;
export const getWorksByTag = tagService.getWorksByTag;
export const getPopularTags = tagService.getPopularTags;
export const searchTags = tagService.searchTags;
export const attachTagsToWork = tagService.attachTagsToWork;
export const attachTagsToUser = tagService.attachTagsToUser;
export const attachTagsToProject = tagService.attachTagsToProject;

// 新增的多維度聚合函數
export const getMajorStats = tagService.getMajorStats;
export const getSoftwareStats = tagService.getSoftwareStats;
export const getWorksByMajor = tagService.getWorksByMajor;
export const getWorksBySoftware = tagService.getWorksBySoftware;
export const getWorksByCombination = tagService.getWorksByCombination;

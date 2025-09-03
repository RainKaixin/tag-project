import { isMock } from '../../utils/envCheck.js';

import { supabase } from './client.js';

/**
 * Supabase用户档案服务
 * 提供与Mock API相同的接口，确保前端组件无需修改
 */

// 从Supabase profiles表读取用户档案
export const getProfile = async userId => {
  try {
    console.log(`[Supabase Profile] Getting profile for user: ${userId}`);

    // 不再为特定用户ID提供Mock数据回退
    // 所有用户都应该从Supabase获取真实数据

    // 非Mock模式下，所有用户ID都应该尝试从Supabase获取

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 用户档案不存在，返回 null（不再返回默认档案）
        console.log(
          `[Supabase Profile] Profile not found for user: ${userId}, returning null`
        );
        return {
          success: false,
          error: 'Profile not found',
        };
      }
      throw error;
    }

    // 转换数据格式以匹配Mock API
    const adaptedProfile = adaptSupabaseProfile(data);

    console.log(
      `[Supabase Profile] Successfully retrieved profile for user: ${userId}`
    );

    return {
      success: true,
      data: adaptedProfile,
    };
  } catch (error) {
    console.error(
      `[Supabase Profile] Error getting profile for user ${userId}:`,
      error
    );
    return {
      success: false,
      error: error.message,
    };
  }
};

// 保存用户档案到Supabase
export const saveProfile = async (userId, profileData) => {
  try {
    console.log(`[Supabase Profile] Saving profile for user: ${userId}`);

    // 不再为特定用户ID提供Mock模式限制
    // 所有用户都应该能够保存到Supabase

    // 非Mock模式下，所有用户ID都应该尝试保存到Supabase

    // 转换数据格式以匹配Supabase表结构
    const supabaseData = adaptToSupabaseFormat(profileData);

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          ...supabaseData,
        },
        {
          onConflict: 'id',
        }
      )
      .select()
      .single();

    if (error) throw error;

    console.log(
      `[Supabase Profile] Successfully saved profile for user: ${userId}`
    );

    return {
      success: true,
      data: adaptSupabaseProfile(data),
    };
  } catch (error) {
    console.error(
      `[Supabase Profile] Error saving profile for user ${userId}:`,
      error
    );
    return {
      success: false,
      error: error.message,
    };
  }
};

// 数据格式转换：Supabase → Mock API格式
const adaptSupabaseProfile = supabaseData => {
  if (!supabaseData) return null;

  return {
    id: supabaseData.id,
    fullName: supabaseData.full_name || '',
    title: supabaseData.title || 'Artist',
    school: supabaseData.school || '',
    pronouns: supabaseData.pronouns || '',
    majors: Array.isArray(supabaseData.majors) ? supabaseData.majors : [],
    minors: Array.isArray(supabaseData.minors) ? supabaseData.minors : [],
    skills: Array.isArray(supabaseData.skills) ? supabaseData.skills : [],
    bio: supabaseData.bio || '',
    socialLinks: {
      instagram: supabaseData.social_links?.instagram || '',
      portfolio: supabaseData.social_links?.portfolio || '',
      discord: supabaseData.social_links?.discord || '',
      otherLinks: Array.isArray(supabaseData.social_links?.otherLinks)
        ? supabaseData.social_links.otherLinks
        : [],
    },
    avatar: supabaseData.avatar_url || '',
    createdAt: supabaseData.created_at,
    updatedAt: supabaseData.updated_at,
  };
};

// 数据格式转换：Mock API格式 → Supabase格式
const adaptToSupabaseFormat = mockData => {
  return {
    full_name: mockData.fullName || '',
    title: mockData.title || 'Artist',
    school: mockData.school || '',
    pronouns: mockData.pronouns || '',
    majors: Array.isArray(mockData.majors) ? mockData.majors : [],
    minors: Array.isArray(mockData.minors) ? mockData.minors : [],
    skills: Array.isArray(mockData.skills) ? mockData.skills : [],
    bio: mockData.bio || '',
    social_links: {
      instagram: mockData.socialLinks?.instagram || '',
      portfolio: mockData.socialLinks?.portfolio || '',
      discord: mockData.socialLinks?.discord || '',
      otherLinks: Array.isArray(mockData.socialLinks?.otherLinks)
        ? mockData.socialLinks.otherLinks
        : [],
    },
    avatar_url: mockData.avatar || '',
  };
};

// 获取默认档案（当用户档案不存在时）
const getDefaultProfile = userId => {
  return {
    id: userId,
    fullName: '',
    title: 'Artist',
    school: '',
    pronouns: '',
    majors: [],
    minors: [],
    skills: [],
    bio: '',
    socialLinks: {
      instagram: '',
      portfolio: '',
      discord: '',
      otherLinks: [],
    },
    avatar: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// 检查Supabase连接状态
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) throw error;

    return true;
  } catch (error) {
    console.warn('[Supabase Profile] Connection check failed:', error.message);
    return false;
  }
};

// UUID格式验证函数
const isValidUUID = str => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

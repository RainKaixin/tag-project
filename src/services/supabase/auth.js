import { supabase } from './client.js';

/**
 * 用户认证服务
 * 提供登录、注册、登出等认证功能
 */

// 用户登录
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 用户注册
export const signUp = async (email, password, userData = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData, // 额外的用户数据
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 用户登出
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 获取当前用户
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 获取用户会话
export const getSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, session };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 监听认证状态变化
export const onAuthStateChange = callback => {
  return supabase.auth.onAuthStateChange(callback);
};

// 重置密码
export const resetPassword = async email => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 更新用户密码
export const updatePassword = async newPassword => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

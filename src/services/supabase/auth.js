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

// 发送 OTP 验证码
export const sendOTP = async email => {
  try {
    // 使用 supabase.functions.invoke 调用 Edge Function
    const { data, error } = await supabase.functions.invoke(
      'send-verification-code',
      {
        body: { email },
      }
    );

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to send verification code',
      };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 验证 OTP
export const verifyOTP = async (email, token) => {
  try {
    // 使用 supabase.functions.invoke 调用 Edge Function
    const { data, error } = await supabase.functions.invoke(
      'verify-code-only',
      {
        body: {
          email,
          code: token,
        },
      }
    );

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to verify code',
      };
    }

    // OTP 驗證成功，返回成功狀態
    return {
      success: true,
      user: { email: data.email }, // 暫時返回基本信息
      session: null, // 還沒有會話
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 设置用户密码
export const setUserPassword = async password => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 創建用戶並設置密碼（使用我們的 Edge Function）
export const createUserWithPassword = async (email, code, password) => {
  try {
    // 使用 supabase.functions.invoke 调用 Edge Function
    const { data, error } = await supabase.functions.invoke('verify-code', {
      body: {
        email,
        code,
        password,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to create user',
      };
    }

    // 用戶創建成功，返回用戶信息和會話
    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

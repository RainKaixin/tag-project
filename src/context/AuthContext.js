import React, { createContext, useContext, useState, useEffect } from 'react';

import {
  signIn,
  signUp,
  signOut,
  getCurrentUser as getSupabaseUser,
  getSession,
  onAuthStateChange,
} from '../services/supabase/auth.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('LOADING'); // 添加状态管理

  // 加载用户状态
  useEffect(() => {
    const loadUser = async () => {
      try {
        // 只从 Supabase 获取用户，不再回退到 Mock 用户系统
        const { success, user: supabaseUser } = await getSupabaseUser();

        if (success && supabaseUser) {
          // 使用 Supabase 用户数据
          const userData = {
            id: supabaseUser.id,
            email: supabaseUser.email,
            name:
              supabaseUser.user_metadata?.name ||
              supabaseUser.email?.split('@')[0],
            avatar: supabaseUser.user_metadata?.avatar_url,
            role: 'artist',
            isVerified: supabaseUser.email_confirmed_at ? true : false,
          };
          setUser(userData);
          // 設置全局用戶狀態供 getCurrentUser 使用
          if (typeof window !== 'undefined') {
            window.__authContextUser = userData;
          }
          setStatus('SIGNED_IN');
        } else {
          // 没有用户，设置为 null
          setUser(null);
          setStatus('SIGNED_OUT');
        }
      } catch (error) {
        console.error('[AuthContext] Error loading user:', error);
        // 出错时设置为 null
        setUser(null);
        setStatus('SIGNED_OUT');
      } finally {
        setLoading(false);
      }
    };

    // 立即加载用户
    loadUser();

    // 添加超时保护，确保loading状态不会无限期保持
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  // 监听 Supabase 认证状态变化
  useEffect(() => {
    const {
      data: { subscription },
    } = onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state changed:', event, session);

      if (event === 'SIGNED_IN' && session?.user) {
        // 用户登录
        const supabaseUser = session.user;
        const userData = {
          id: supabaseUser.id,
          email: supabaseUser.email,
          name:
            supabaseUser.user_metadata?.name ||
            supabaseUser.email?.split('@')[0],
          avatar: supabaseUser.user_metadata?.avatar_url,
          role: 'artist',
          isVerified: supabaseUser.email_confirmed_at ? true : false,
        };
        setUser(userData);
        // 設置全局用戶狀態供 getCurrentUser 使用
        if (typeof window !== 'undefined') {
          window.__authContextUser = userData;
        }
        setStatus('SIGNED_IN');
      } else if (event === 'SIGNED_OUT') {
        // 用户登出
        setUser(null);
        // 清除全局用戶狀態
        if (typeof window !== 'undefined') {
          window.__authContextUser = null;
        }
        setStatus('SIGNED_OUT');
        // 清除本地存储
        localStorage.removeItem('tag_user');
        sessionStorage.removeItem('tag_user');
        localStorage.removeItem('tag.currentUserId');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 登录函数 - 使用 Supabase Auth
  const login = async (email, password) => {
    try {
      const result = await signIn(email, password);

      if (result.success) {
        // 登录成功，用户状态会通过 onAuthStateChange 自动更新
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // 注册函数 - 使用 Supabase Auth
  const register = async (email, password, userData = {}) => {
    try {
      const result = await signUp(email, password, userData);

      if (result.success) {
        // 注册成功，用户状态会通过 onAuthStateChange 自动更新
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  };

  // 登出函数 - 使用 Supabase Auth
  const logout = async () => {
    try {
      const result = await signOut();

      if (result.success) {
        // 登出成功，用户状态会通过 onAuthStateChange 自动更新
        setUser(null);
        // 清除全局用戶狀態
        if (typeof window !== 'undefined') {
          window.__authContextUser = null;
        }
        // 清除本地存储
        localStorage.removeItem('tag_user');
        sessionStorage.removeItem('tag_user');
        localStorage.removeItem('tag.currentUserId');
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // 检查是否已登录
  const isAuthenticated = () => {
    return user !== null;
  };

  // 获取当前会话
  const getSession = async () => {
    try {
      const result = await getSession();
      return result;
    } catch (error) {
      console.error('Get session error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    status, // 添加状态到 context value
    login,
    register,
    logout,
    isAuthenticated,
    getSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

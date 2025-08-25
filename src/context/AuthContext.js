import React, { createContext, useContext, useState, useEffect } from 'react';

import { getCurrentUser } from '../utils/currentUser';

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

  // 檢查本地存儲的用戶狀態
  useEffect(() => {
    const loadUser = async () => {
      try {
        // 使用 currentUser.js 中的用戶狀態
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('[AuthContext] Error loading user:', error);
        setUser(null);
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

  // 監聽用戶切換事件
  useEffect(() => {
    const handleUserChange = () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error handling user change:', error);
        setUser(null);
      }
    };

    window.addEventListener('user:changed', handleUserChange);
    return () => window.removeEventListener('user:changed', handleUserChange);
  }, []);

  // 登錄函數
  const login = async (email, password) => {
    try {
      // 實現實際的認證邏輯
      // 例如：const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password
      // });

      // 使用 currentUser.js 中的用戶狀態
      const currentUser = getCurrentUser();
      setUser(currentUser);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // 登出函數
  const logout = () => {
    setUser(null);
    localStorage.removeItem('tag_user');
    sessionStorage.removeItem('tag_user');
    // 清除 currentUser 狀態
    localStorage.removeItem('tag.currentUserId');
  };

  // 檢查是否已登錄
  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

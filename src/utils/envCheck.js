// Mock API 状态检查（兼容 CRA 和 Vite）
export const isMock = () => {
  // 优先检查 CRA 环境变量
  const useMock = process.env.REACT_APP_USE_MOCK_API;
  return useMock === 'true';
};

// 检查 Mock API 是否可用
export const isSupabaseAvailable = () => {
  return !isMock();
};

// 显示配置状态
export const showConfigurationStatus = () => {
  if (isMock()) {
    console.log('🔧 当前使用 Mock API 模式');
    console.log('💡 使用 localStorage 模拟后端功能');
    console.log('📝 上传和展示流程已完全跑通');
  } else {
    console.log('🔧 当前使用 Supabase 后端');
    console.log('💡 使用真实数据库和存储');
  }
  return true;
};

// 兼容性函数，保持向后兼容
export const checkEnvironmentVariables = () => {
  return isMock();
};

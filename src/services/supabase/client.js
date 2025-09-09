import { createClient } from '@supabase/supabase-js';

// 从环境变量获取Supabase配置
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// 检查环境变量是否配置
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase环境变量未配置，将使用mock数据');
  console.warn(
    '请设置 REACT_APP_SUPABASE_URL 和 REACT_APP_SUPABASE_ANON_KEY (CRA) 或 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY (Vite)'
  );
}

// 创建Supabase客户端
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

// 检查连接状态
export const checkSupabaseConnection = async () => {
  // 首先检查环境变量是否配置
  if (!supabaseUrl || !supabaseKey) {
    console.log('ℹ️ Supabase环境变量未配置，使用mock数据');
    return false;
  }

  try {
    // 使用更通用的连接测试方法
    // 尝试获取当前用户会话，这不需要特定的表
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.warn('⚠️ Supabase连接失败，将使用mock数据:', error.message);
      return false;
    }

    console.log('✅ Supabase连接成功');
    console.log('ℹ️ 当前会话状态:', session ? '已认证' : '未认证');
    return true;
  } catch (error) {
    console.warn('⚠️ Supabase连接检查失败，将使用mock数据:', error.message);
    return false;
  }
};

// 导出客户端实例
export default supabase;

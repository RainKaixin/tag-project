import { createClient } from '@supabase/supabase-js';

// 从环境变量获取Supabase配置
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// 检查环境变量是否配置
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase环境变量未配置，将使用mock数据');
  console.warn('请设置 REACT_APP_SUPABASE_URL 和 REACT_APP_SUPABASE_ANON_KEY');
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
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    if (error) {
      console.warn('⚠️ Supabase连接失败，将使用mock数据:', error.message);
      return false;
    }
    console.log('✅ Supabase连接成功');
    return true;
  } catch (error) {
    console.warn('⚠️ Supabase连接检查失败，将使用mock数据:', error.message);
    return false;
  }
};

// 导出客户端实例
export default supabase;

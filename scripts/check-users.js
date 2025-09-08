// 檢查用戶表的腳本
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 Supabase 環境變量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  console.log('🔍 檢查用戶表...\n');

  try {
    // 檢查 users 表
    console.log('📊 檢查 users 表:');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);

    if (usersError) {
      console.log('❌ 查詢 users 表錯誤:', usersError);
    } else {
      console.log('✅ users 表存在');
      console.log('📋 用戶列表:');
      usersData.forEach((user, index) => {
        console.log(
          `  ${index + 1}. ID: ${user.id}, Email: ${user.email || 'N/A'}`
        );
      });
    }

    // 檢查 profiles 表
    console.log('\n📊 檢查 profiles 表:');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (profilesError) {
      console.log('❌ 查詢 profiles 表錯誤:', profilesError);
    } else {
      console.log('✅ profiles 表存在');
      console.log('📋 檔案列表:');
      profilesData.forEach((profile, index) => {
        console.log(
          `  ${index + 1}. ID: ${profile.id}, Name: ${
            profile.full_name || 'N/A'
          }`
        );
      });
    }

    // 檢查特定用戶是否存在
    const testUserId = '512411b2-adac-4dec-8fe5-63fb405f756b';
    console.log(`\n🔍 檢查特定用戶: ${testUserId}`);

    const { data: specificUser, error: specificError } = await supabase
      .from('users')
      .select('*')
      .eq('id', testUserId)
      .single();

    if (specificError) {
      console.log('❌ 用戶不存在於 users 表:', specificError.message);
    } else {
      console.log('✅ 用戶存在於 users 表:', specificUser);
    }

    // 檢查 profiles 表中的用戶
    const { data: specificProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', testUserId)
      .single();

    if (profileError) {
      console.log('❌ 用戶不存在於 profiles 表:', profileError.message);
    } else {
      console.log('✅ 用戶存在於 profiles 表:', specificProfile);
    }
  } catch (error) {
    console.error('❌ 檢查過程中發生錯誤:', error);
  }
}

checkUsers();

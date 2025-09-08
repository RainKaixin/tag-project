// 测试最终修复
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

console.log('🔍 測試最終修復...');

async function testFinalFix() {
  try {
    // 1. 檢查認證狀態
    console.log('\n📊 檢查認證狀態...');

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) {
      console.log('❌ 認證錯誤:', authError.message);
      console.log('💡 這可能是因為腳本運行時沒有認證會話');
      console.log('💡 請在瀏覽器中測試，那裡有認證會話');
      return;
    }

    if (!user) {
      console.log('❌ 沒有認證用戶');
      return;
    }

    console.log('✅ 認證用戶:', user.id);

    // 2. 獲取目標用戶
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .neq('id', user.id)
      .limit(1);

    if (profilesError || !profiles || profiles.length === 0) {
      console.log('❌ 沒有其他用戶可以測試');
      return;
    }

    const targetUserId = profiles[0].id;
    console.log('✅ 目標用戶 ID:', targetUserId);

    // 3. 測試 follow 插入
    console.log('\n🧪 測試 follow 插入...');

    const { data: followData, error: followError } = await supabase
      .from('follows')
      .insert({
        follower_id: user.id,
        following_id: targetUserId,
      })
      .select();

    if (followError) {
      console.log('❌ Follow 插入失敗:', followError.message);
      console.log('錯誤代碼:', followError.code);
    } else {
      console.log('✅ Follow 插入成功:', followData);
    }

    // 4. 檢查通知是否創建
    console.log('\n🧪 檢查通知創建...');

    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .eq('receiver_id', targetUserId)
      .eq('type', 'follow')
      .order('created_at', { ascending: false })
      .limit(1);

    if (notificationsError) {
      console.log('❌ 無法檢查通知:', notificationsError.message);
    } else if (notifications && notifications.length > 0) {
      console.log('✅ 通知創建成功:', notifications[0]);
    } else {
      console.log('⚠️ 沒有找到 follow 通知');
    }

    // 5. 檢查 follows 表狀態
    console.log('\n📊 檢查 follows 表狀態...');

    const { data: allFollows, error: allFollowsError } = await supabase
      .from('follows')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (allFollowsError) {
      console.log('❌ 無法檢查 follows 表:', allFollowsError.message);
    } else {
      console.log('✅ Follows 表記錄:', allFollows);
    }

    console.log('\n🎉 測試完成！');
    console.log('\n💡 如果腳本顯示認證錯誤，請在瀏覽器中測試 Follow 功能');
  } catch (error) {
    console.error('❌ 測試過程中發生錯誤:', error);
  }
}

testFinalFix();

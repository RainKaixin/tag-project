// 测试 Follow 问题
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

console.log('🔍 測試 Follow 問題...');

async function testFollowIssue() {
  try {
    // 1. 檢查認證狀態
    console.log('\n📊 檢查認證狀態...');

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) {
      console.log('❌ 認證錯誤:', authError.message);
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

    // 3. 檢查當前 follow 狀態
    console.log('\n📊 檢查當前 follow 狀態...');

    const { data: existingFollows, error: existingError } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId);

    if (existingError) {
      console.log('❌ 無法檢查 follow 狀態:', existingError.message);
    } else {
      console.log('✅ 當前 follow 狀態:', existingFollows);
    }

    // 4. 嘗試插入 follow
    console.log('\n🧪 嘗試插入 follow...');

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
      console.log('錯誤詳情:', followError.details);

      if (followError.code === '23505') {
        console.log('💡 這是重複鍵錯誤，說明已經關注過了');
      }
    } else {
      console.log('✅ Follow 插入成功:', followData);
    }

    // 5. 檢查插入後的狀態
    console.log('\n📊 檢查插入後的狀態...');

    const { data: newFollows, error: newError } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId);

    if (newError) {
      console.log('❌ 無法檢查新 follow 狀態:', newError.message);
    } else {
      console.log('✅ 新 follow 狀態:', newFollows);
    }

    // 6. 檢查通知
    console.log('\n📊 檢查通知...');

    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .eq('receiver_id', targetUserId)
      .eq('type', 'follow')
      .order('created_at', { ascending: false })
      .limit(1);

    if (notificationsError) {
      console.log('❌ 無法檢查通知:', notificationsError.message);
    } else {
      console.log('✅ 通知狀態:', notifications);
    }

    console.log('\n🎉 測試完成！');
  } catch (error) {
    console.error('❌ 測試過程中發生錯誤:', error);
  }
}

testFollowIssue();

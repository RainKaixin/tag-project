// 测试 RLS 修复后的功能
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

console.log('🔍 測試 RLS 修復後的功能...');

async function testRLSFix() {
  try {
    // 1. 檢查認證狀態
    console.log('\n📊 檢查認證狀態...');

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) {
      console.log('❌ 認證錯誤:', authError.message);
      console.log('💡 需要重新登錄或檢查認證狀態');
      return;
    }

    if (!user) {
      console.log('❌ 沒有認證用戶');
      console.log('💡 需要重新登錄');
      return;
    }

    console.log('✅ 認證用戶:', user.id);
    console.log('✅ 用戶郵箱:', user.email);

    // 2. 獲取測試數據
    console.log('\n📊 獲取測試數據...');

    // 獲取 portfolio 記錄
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolio')
      .select('id, user_id')
      .limit(1);

    if (portfolioError) {
      console.log('❌ 無法獲取 portfolio 數據:', portfolioError.message);
      return;
    }

    if (!portfolio || portfolio.length === 0) {
      console.log('❌ portfolio 表為空');
      return;
    }

    const artworkId = portfolio[0].id;
    console.log('✅ Portfolio ID:', artworkId);

    // 獲取其他用戶 ID（用於 follow 測試）
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .neq('id', user.id)
      .limit(1);

    if (profilesError) {
      console.log('❌ 無法獲取 profiles 數據:', profilesError.message);
      return;
    }

    if (!profiles || profiles.length === 0) {
      console.log('❌ 沒有其他用戶可以測試 follow');
      return;
    }

    const targetUserId = profiles[0].id;
    console.log('✅ 目標用戶 ID:', targetUserId);

    // 3. 測試 artwork_likes 插入
    console.log('\n🧪 測試 artwork_likes 插入...');

    const { data: likeData, error: likeError } = await supabase
      .from('artwork_likes')
      .insert({
        artwork_id: artworkId,
        user_id: user.id,
      })
      .select();

    if (likeError) {
      console.log('❌ artwork_likes 插入失敗:', likeError.message);
      console.log('錯誤代碼:', likeError.code);
    } else {
      console.log('✅ artwork_likes 插入成功:', likeData);
    }

    // 4. 測試 follows 插入
    console.log('\n🧪 測試 follows 插入...');

    const { data: followData, error: followError } = await supabase
      .from('follows')
      .insert({
        follower_id: user.id,
        following_id: targetUserId,
      })
      .select();

    if (followError) {
      console.log('❌ follows 插入失敗:', followError.message);
      console.log('錯誤代碼:', followError.code);
    } else {
      console.log('✅ follows 插入成功:', followData);
    }

    // 5. 檢查通知是否創建
    console.log('\n🧪 檢查通知創建...');

    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .eq('receiver_id', targetUserId)
      .eq('type', 'follow')
      .order('created_at', { ascending: false })
      .limit(1);

    if (notificationsError) {
      console.log('❌ 無法獲取通知:', notificationsError.message);
    } else if (notifications && notifications.length > 0) {
      console.log('✅ 通知創建成功:', notifications[0]);
    } else {
      console.log('⚠️ 沒有找到 follow 通知');
    }

    console.log('\n🎉 測試完成！');
  } catch (error) {
    console.error('❌ 測試過程中發生錯誤:', error);
  }
}

testRLSFix();

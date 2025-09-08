// 测试修复后的外键约束
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

console.log('🔍 測試修復後的外鍵約束...');

async function testConstraints() {
  try {
    // 1. 獲取測試數據
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
    const artworkUserId = portfolio[0].user_id;

    console.log('✅ Portfolio ID:', artworkId);
    console.log('✅ Portfolio User ID:', artworkUserId);

    // 獲取 profiles 記錄
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(2);

    if (profilesError) {
      console.log('❌ 無法獲取 profiles 數據:', profilesError.message);
      return;
    }

    if (!profiles || profiles.length < 2) {
      console.log('❌ profiles 表記錄不足');
      return;
    }

    const userId1 = profiles[0].id;
    const userId2 = profiles[1].id;

    console.log('✅ User ID 1:', userId1);
    console.log('✅ User ID 2:', userId2);

    // 2. 測試 artwork_likes 插入
    console.log('\n🧪 測試 artwork_likes 插入...');

    const { data: likeData, error: likeError } = await supabase
      .from('artwork_likes')
      .insert({
        artwork_id: artworkId,
        user_id: userId1,
      })
      .select();

    if (likeError) {
      console.log('❌ artwork_likes 插入失敗:', likeError.message);
      console.log('錯誤代碼:', likeError.code);
    } else {
      console.log('✅ artwork_likes 插入成功:', likeData);
    }

    // 3. 測試 follows 插入
    console.log('\n🧪 測試 follows 插入...');

    const { data: followData, error: followError } = await supabase
      .from('follows')
      .insert({
        follower_id: userId1,
        following_id: userId2,
      })
      .select();

    if (followError) {
      console.log('❌ follows 插入失敗:', followError.message);
      console.log('錯誤代碼:', followError.code);
    } else {
      console.log('✅ follows 插入成功:', followData);
    }

    // 4. 測試重複插入（應該失敗）
    console.log('\n🧪 測試重複插入...');

    const { error: duplicateLikeError } = await supabase
      .from('artwork_likes')
      .insert({
        artwork_id: artworkId,
        user_id: userId1,
      });

    if (duplicateLikeError) {
      console.log('✅ 重複 like 插入正確失敗:', duplicateLikeError.message);
    } else {
      console.log('❌ 重複 like 插入應該失敗但成功了');
    }

    const { error: duplicateFollowError } = await supabase
      .from('follows')
      .insert({
        follower_id: userId1,
        following_id: userId2,
      });

    if (duplicateFollowError) {
      console.log('✅ 重複 follow 插入正確失敗:', duplicateFollowError.message);
    } else {
      console.log('❌ 重複 follow 插入應該失敗但成功了');
    }

    console.log('\n🎉 測試完成！');
  } catch (error) {
    console.error('❌ 測試過程中發生錯誤:', error);
  }
}

testConstraints();

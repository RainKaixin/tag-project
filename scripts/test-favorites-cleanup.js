/**
 * 測試收藏清理功能
 * 驗證作品刪除時是否正確清理相關收藏記錄
 */

import { supabase } from '../src/services/supabase/client.js';
import { deletePortfolioItem } from '../src/services/supabase/portfolio.js';

// 測試數據
const testUserId = 'test-user-123';
const testWorkId = 'test-work-456';

async function testFavoritesCleanup() {
  console.log('🧪 開始測試收藏清理功能...\n');

  try {
    // 1. 創建測試作品
    console.log('1️⃣ 創建測試作品...');
    const { data: workData, error: workError } = await supabase
      .from('portfolio')
      .insert({
        id: testWorkId,
        user_id: testUserId,
        title: 'Test Work for Cleanup',
        description: 'This is a test work',
        is_public: true,
      })
      .select()
      .single();

    if (workError) {
      console.error('❌ 創建測試作品失敗:', workError);
      return;
    }
    console.log('✅ 測試作品創建成功:', workData.id);

    // 2. 創建測試收藏記錄
    console.log('\n2️⃣ 創建測試收藏記錄...');
    const { data: favoriteData, error: favoriteError } = await supabase
      .from('favorites')
      .insert({
        user_id: testUserId,
        item_type: 'work',
        item_id: testWorkId,
      })
      .select()
      .single();

    if (favoriteError) {
      console.error('❌ 創建測試收藏失敗:', favoriteError);
      return;
    }
    console.log('✅ 測試收藏創建成功:', favoriteData.id);

    // 3. 驗證收藏記錄存在
    console.log('\n3️⃣ 驗證收藏記錄存在...');
    const { data: existingFavorites, error: checkError } = await supabase
      .from('favorites')
      .select('*')
      .eq('item_id', testWorkId)
      .eq('item_type', 'work');

    if (checkError) {
      console.error('❌ 檢查收藏記錄失敗:', checkError);
      return;
    }

    if (existingFavorites.length === 0) {
      console.error('❌ 收藏記錄不存在');
      return;
    }
    console.log('✅ 收藏記錄存在，數量:', existingFavorites.length);

    // 4. 刪除作品（應該觸發收藏清理）
    console.log('\n4️⃣ 刪除作品（應該觸發收藏清理）...');
    const deleteResult = await deletePortfolioItem(testWorkId, testUserId);

    if (!deleteResult.success) {
      console.error('❌ 刪除作品失敗:', deleteResult.error);
      return;
    }
    console.log('✅ 作品刪除成功');

    // 5. 驗證收藏記錄是否被清理
    console.log('\n5️⃣ 驗證收藏記錄是否被清理...');
    const { data: remainingFavorites, error: finalCheckError } = await supabase
      .from('favorites')
      .select('*')
      .eq('item_id', testWorkId)
      .eq('item_type', 'work');

    if (finalCheckError) {
      console.error('❌ 最終檢查失敗:', finalCheckError);
      return;
    }

    if (remainingFavorites.length === 0) {
      console.log('✅ 收藏記錄已成功清理！');
    } else {
      console.error(
        '❌ 收藏記錄未被清理，剩餘數量:',
        remainingFavorites.length
      );
    }

    // 6. 清理測試數據
    console.log('\n6️⃣ 清理測試數據...');
    await supabase.from('favorites').delete().eq('item_id', testWorkId);

    await supabase.from('portfolio').delete().eq('id', testWorkId);

    console.log('✅ 測試數據清理完成');
  } catch (error) {
    console.error('❌ 測試過程中發生錯誤:', error);
  }

  console.log('\n🎉 測試完成！');
}

// 運行測試
testFavoritesCleanup();

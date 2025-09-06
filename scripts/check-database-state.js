// check-database-state.js: 檢查數據庫當前狀態

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase環境變量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 檢查數據庫狀態
 */
const checkDatabaseState = async () => {
  console.log('🔍 檢查數據庫當前狀態...\n');

  try {
    // 1. 檢查profiles表是否存在
    console.log('1️⃣ 檢查profiles表...');
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .limit(1);

      if (profilesError) {
        console.log(`❌ profiles表不存在或無法訪問: ${profilesError.message}`);
      } else {
        console.log(
          `✅ profiles表存在，有 ${profilesData?.length || 0} 條記錄`
        );
      }
    } catch (error) {
      console.log(`❌ 檢查profiles表失敗: ${error.message}`);
    }

    // 2. 檢查portfolio表的外鍵約束
    console.log('\n2️⃣ 檢查portfolio表外鍵約束...');
    try {
      const { data: constraintsData, error: constraintsError } =
        await supabase.rpc('get_table_constraints', {
          table_name: 'portfolio',
        });

      if (constraintsError) {
        console.log(`❌ 無法獲取外鍵約束: ${constraintsError.message}`);
        console.log('   需要手動檢查外鍵約束是否存在');
      } else {
        console.log(`✅ 外鍵約束信息:`, constraintsData);
      }
    } catch (error) {
      console.log(`❌ 檢查外鍵約束失敗: ${error.message}`);
    }

    // 3. 檢查portfolio表數據
    console.log('\n3️⃣ 檢查portfolio表數據...');
    try {
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio')
        .select('id, user_id, title')
        .limit(3);

      if (portfolioError) {
        console.log(`❌ portfolio表訪問失敗: ${portfolioError.message}`);
      } else {
        console.log(`✅ portfolio表存在，有數據`);
        portfolioData?.forEach((item, index) => {
          console.log(
            `   ${index + 1}. ID: ${item.id}, User: ${item.user_id}, Title: ${
              item.title
            }`
          );
        });
      }
    } catch (error) {
      console.log(`❌ 檢查portfolio表失敗: ${error.message}`);
    }

    // 4. 測試嵌入式聯表查詢
    console.log('\n4️⃣ 測試嵌入式聯表查詢...');
    try {
      const { data: joinData, error: joinError } = await supabase
        .from('portfolio')
        .select(
          `
          id,
          title,
          user_id,
          profiles!fk_portfolio_profiles (
            id,
            full_name
          )
        `
        )
        .limit(1);

      if (joinError) {
        console.log(`❌ 嵌入式聯表查詢失敗: ${joinError.message}`);
        console.log(`   錯誤代碼: ${joinError.code}`);
        console.log(`   錯誤詳情: ${joinError.details}`);
      } else {
        console.log(`✅ 嵌入式聯表查詢成功`);
        console.log(`   查詢結果:`, joinData);
      }
    } catch (error) {
      console.log(`❌ 嵌入式聯表查詢異常: ${error.message}`);
    }

    console.log('\n🎯 建議操作：');
    console.log('1. 如果profiles表不存在，需要執行完整的數據庫遷移');
    console.log(
      '2. 如果外鍵約束不存在，需要執行011_fix_portfolio_profiles_foreign_key.sql'
    );
    console.log('3. 如果嵌入式聯表查詢失敗，說明外鍵關係未正確建立');
  } catch (error) {
    console.error('💥 檢查過程中發生錯誤:', error);
  }
};

// 執行檢查
checkDatabaseState().catch(console.error);

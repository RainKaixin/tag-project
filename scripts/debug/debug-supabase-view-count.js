// 調試Supabase瀏覽量數據

console.log('🔍 開始調試Supabase瀏覽量數據...');

// 動態導入Supabase客戶端
import('../../src/services/supabase/client.js')
  .then(async ({ supabase }) => {
    try {
      const artworkId = 'dd46722f-c936-4c7f-b073-da52d59f2530';

      console.log(`\n📊 檢查作品 ${artworkId} 的瀏覽量數據:`);

      // 1. 直接查詢artwork_views表
      console.log('\n1️⃣ 直接查詢artwork_views表:');
      const { data: viewRecords, error: viewError } = await supabase
        .from('artwork_views')
        .select('*')
        .eq('artwork_id', artworkId);

      if (viewError) {
        console.error('❌ 查詢artwork_views失敗:', viewError);
      } else {
        console.log(`✅ 找到 ${viewRecords.length} 條瀏覽記錄:`);
        viewRecords.forEach((record, index) => {
          console.log(`  ${index + 1}. ID: ${record.id}`);
          console.log(`     用戶ID: ${record.user_id || '未登錄'}`);
          console.log(`     訪客指紋: ${record.visitor_fingerprint || '無'}`);
          console.log(`     瀏覽時間: ${record.viewed_at}`);
          console.log(`     IP: ${record.ip_address || '無'}`);
          console.log('');
        });
      }

      // 2. 使用數據庫函數獲取瀏覽量
      console.log('\n2️⃣ 使用get_artwork_view_count函數:');
      const { data: functionResult, error: functionError } = await supabase.rpc(
        'get_artwork_view_count',
        {
          p_artwork_id: artworkId,
        }
      );

      if (functionError) {
        console.error('❌ 調用get_artwork_view_count失敗:', functionError);
      } else {
        console.log('✅ 函數返回結果:', functionResult);
      }

      // 3. 檢查portfolio表中的作品信息
      console.log('\n3️⃣ 檢查portfolio表中的作品信息:');
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio')
        .select('*')
        .eq('id', artworkId);

      if (portfolioError) {
        console.error('❌ 查詢portfolio失敗:', portfolioError);
      } else {
        console.log('✅ Portfolio數據:', portfolioData);
      }

      // 4. 統計分析
      console.log('\n4️⃣ 統計分析:');
      if (viewRecords && viewRecords.length > 0) {
        const userViews = viewRecords.filter(r => r.user_id).length;
        const visitorViews = viewRecords.filter(
          r => r.visitor_fingerprint
        ).length;

        console.log(`📈 總瀏覽記錄: ${viewRecords.length}`);
        console.log(`👤 已登錄用戶瀏覽: ${userViews}`);
        console.log(`👥 訪客瀏覽: ${visitorViews}`);
        console.log(`🔢 函數返回瀏覽量: ${functionResult}`);

        if (viewRecords.length === functionResult) {
          console.log('✅ 數據一致性檢查通過');
        } else {
          console.log('❌ 數據不一致！');
        }
      }
    } catch (error) {
      console.error('❌ 調試過程中發生錯誤:', error);
    }
  })
  .catch(error => {
    console.error('❌ 無法導入Supabase客戶端:', error);
  });

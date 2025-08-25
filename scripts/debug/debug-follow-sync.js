// debug-follow-sync.js: 調試關注數據同步問題

console.log('🔍 調試關注數據同步問題');

// 檢查localStorage中的關注數據
const checkFollowData = () => {
  try {
    const followData = localStorage.getItem('tag_artist_follows');
    console.log(
      '📊 當前關注數據:',
      followData ? JSON.parse(followData) : '無數據'
    );

    if (followData) {
      const parsed = JSON.parse(followData);
      Object.keys(parsed).forEach(artistId => {
        const artistFollows = parsed[artistId];
        console.log(`👤 ${artistId}: ${artistFollows.followersCount} 個關注者`);
        console.log(`  關注者列表: ${artistFollows.followers.join(', ')}`);
      });
    }
  } catch (error) {
    console.error('❌ 檢查關注數據失敗:', error);
  }
};

// 檢查作品詳情頁的作者數據
const checkAuthorData = () => {
  try {
    // 模擬作品詳情頁的作者數據結構
    const mockAuthorData = {
      alice: {
        id: 'alice',
        name: 'Alice Chen',
        followers: '156', // 靜態數據
        following: '28', // 靜態數據
      },
      bryan: {
        id: 'bryan',
        name: 'Bryan Rodriguez',
        followers: '156', // 靜態數據
        following: '28', // 靜態數據
      },
      alex: {
        id: 'alex',
        name: 'Alex Johnson',
        followers: '156', // 靜態數據
        following: '28', // 靜態數據
      },
    };

    console.log('📝 作品詳情頁作者數據:', mockAuthorData);
    console.log('⚠️  問題: 這些是靜態數據，不會隨關注狀態更新');
  } catch (error) {
    console.error('❌ 檢查作者數據失敗:', error);
  }
};

// 模擬關注操作
const simulateFollow = async (followerId, artistId) => {
  try {
    console.log(`\n🧪 模擬關注操作: ${followerId} -> ${artistId}`);

    // 導入關注服務
    const { toggleFollow, getFollowersCount } = await import(
      './src/services/mock/followService.js'
    );

    // 執行關注
    const result = await toggleFollow(followerId, artistId);
    console.log('✅ 關注結果:', result);

    // 獲取最新關注者數量
    const countResult = await getFollowersCount(artistId);
    console.log('📊 最新關注者數量:', countResult);

    return result;
  } catch (error) {
    console.error('❌ 模擬關注失敗:', error);
  }
};

// 運行調試
const runDebug = async () => {
  console.log('🚀 開始調試關注數據同步問題...\n');

  // 1. 檢查當前關注數據
  console.log('1️⃣ 檢查當前關注數據:');
  checkFollowData();

  // 2. 檢查作者數據
  console.log('\n2️⃣ 檢查作者數據:');
  checkAuthorData();

  // 3. 模擬關注操作
  console.log('\n3️⃣ 模擬關注操作:');
  await simulateFollow('alice', 'bryan');

  // 4. 再次檢查關注數據
  console.log('\n4️⃣ 關注後的數據:');
  checkFollowData();

  console.log('\n🎯 調試完成！');
  console.log('\n💡 解決方案:');
  console.log('1. 作品詳情頁應該使用 useFollowCount Hook 的實時數據');
  console.log('2. AuthorInfo 組件應該接收 followersCount 參數');
  console.log('3. 不要使用靜態的 author.followers 數據');
};

// 暴露給全局
window.debugFollowSync = runDebug;
window.checkFollowData = checkFollowData;
window.simulateFollow = simulateFollow;

console.log('📋 可用命令:');
console.log('- debugFollowSync() - 運行完整調試');
console.log('- checkFollowData() - 檢查關注數據');
console.log('- simulateFollow(followerId, artistId) - 模擬關注操作');

// 自動運行調試
runDebug();

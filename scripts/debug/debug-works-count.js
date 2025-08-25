// debug-works-count.js: 調試作品數量問題

console.log('🔍 調試作品數量問題');

// 檢查MOCK_USERS中的作品數量
const checkMockUsersWorks = () => {
  try {
    const { MOCK_USERS } = require('./src/utils/mockUsers.js');

    console.log('📊 MOCK_USERS 作品數量:');
    Object.keys(MOCK_USERS).forEach(userId => {
      const user = MOCK_USERS[userId];
      const worksCount = user.portfolio ? user.portfolio.length : 0;
      console.log(`👤 ${userId}: ${worksCount} 個作品`);

      if (user.portfolio) {
        user.portfolio.forEach((work, index) => {
          console.log(`   ${index + 1}. ${work.title} (${work.id})`);
        });
      }
    });
  } catch (error) {
    console.error('❌ 檢查MOCK_USERS失敗:', error);
  }
};

// 模擬getArtistById函數
const simulateGetArtistById = async userId => {
  try {
    console.log(`\n🧪 模擬 getArtistById(${userId}):`);

    // 導入相關模塊
    const { getArtistById } = await import(
      './src/components/artist-profile/utils/artistHelpers.js'
    );

    const artistData = await getArtistById(userId);

    if (artistData) {
      console.log('✅ 獲取藝術家數據成功:');
      console.log(`   ID: ${artistData.id}`);
      console.log(`   Name: ${artistData.name}`);
      console.log(
        `   Works Count: ${artistData.works ? artistData.works.length : 0}`
      );

      if (artistData.works) {
        console.log('   Works List:');
        artistData.works.forEach((work, index) => {
          console.log(`     ${index + 1}. ${work.title} (${work.id})`);
        });
      }
    } else {
      console.log('❌ 未找到藝術家數據');
    }

    return artistData;
  } catch (error) {
    console.error('❌ 模擬getArtistById失敗:', error);
  }
};

// 模擬workDetailHelpers
const simulateWorkDetailHelpers = async (workId, authorId) => {
  try {
    console.log(
      `\n🧪 模擬 workDetailHelpers (workId: ${workId}, authorId: ${authorId}):`
    );

    // 導入相關模塊
    const { getWorkDataById } = await import(
      './src/components/work-detail/utils/workDetailHelpers.js'
    );

    const workData = await getWorkDataById(workId);

    if (workData) {
      console.log('✅ 獲取作品數據成功:');
      console.log(`   Title: ${workData.title}`);
      console.log(`   Author: ${workData.author.name}`);
      console.log(`   Author Works Count: ${workData.author.works}`);
      console.log(`   Author Followers: ${workData.author.followers}`);
      console.log(`   Author Following: ${workData.author.following}`);
    } else {
      console.log('❌ 未找到作品數據');
    }

    return workData;
  } catch (error) {
    console.error('❌ 模擬workDetailHelpers失敗:', error);
  }
};

// 運行調試
const runDebug = async () => {
  console.log('🚀 開始調試作品數量問題...\n');

  // 1. 檢查MOCK_USERS數據
  console.log('1️⃣ 檢查MOCK_USERS數據:');
  checkMockUsersWorks();

  // 2. 模擬getArtistById
  console.log('\n2️⃣ 模擬getArtistById:');
  await simulateGetArtistById('bryan');

  // 3. 模擬workDetailHelpers
  console.log('\n3️⃣ 模擬workDetailHelpers:');
  await simulateWorkDetailHelpers('mock_work_id', 'bryan');

  console.log('\n🎯 調試完成！');
  console.log('\n💡 問題分析:');
  console.log('1. Bryan在MOCK_USERS中有3個作品');
  console.log('2. getArtistById應該返回正確的作品數量');
  console.log('3. workDetailHelpers應該使用authorInfo.works.length');
  console.log('4. 如果顯示錯誤，可能是數據流問題');
};

// 暴露給全局
window.debugWorksCount = runDebug;
window.checkMockUsersWorks = checkMockUsersWorks;
window.simulateGetArtistById = simulateGetArtistById;
window.simulateWorkDetailHelpers = simulateWorkDetailHelpers;

console.log('📋 可用命令:');
console.log('- debugWorksCount() - 運行完整調試');
console.log('- checkMockUsersWorks() - 檢查MOCK_USERS作品數量');
console.log('- simulateGetArtistById(userId) - 模擬獲取藝術家數據');
console.log('- simulateWorkDetailHelpers(workId, authorId) - 模擬獲取作品數據');

// 自動運行調試
runDebug();

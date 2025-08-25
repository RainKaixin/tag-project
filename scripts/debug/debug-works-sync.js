// debug-works-sync.js: 調試作品數量同步問題

console.log('🔍 調試作品數量同步問題');

// 檢查profile數據中的作品數量
const checkProfileWorks = async userId => {
  try {
    console.log(`\n🧪 檢查 ${userId} 的profile數據:`);

    const { getProfile } = await import(
      './src/services/mock/userProfileService.js'
    );
    const profileResult = await getProfile(userId);

    if (profileResult.success) {
      const profile = profileResult.data;
      console.log('✅ Profile數據:');
      console.log(`   ID: ${profile.id}`);
      console.log(`   Name: ${profile.fullName}`);
      console.log(
        `   Portfolio Count: ${
          profile.portfolio ? profile.portfolio.length : 0
        }`
      );

      if (profile.portfolio) {
        console.log('   Portfolio List:');
        profile.portfolio.forEach((work, index) => {
          console.log(`     ${index + 1}. ${work.title} (${work.id})`);
        });
      }
    } else {
      console.log('❌ 獲取profile失敗:', profileResult.error);
    }

    return profileResult;
  } catch (error) {
    console.error('❌ 檢查profile失敗:', error);
  }
};

// 檢查藝術家檔案頁面的數據
const checkArtistProfile = async userId => {
  try {
    console.log(`\n🧪 檢查 ${userId} 的藝術家檔案數據:`);

    const { getArtistById } = await import(
      './src/components/artist-profile/utils/artistHelpers.js'
    );
    const artistData = await getArtistById(userId);

    if (artistData) {
      console.log('✅ 藝術家檔案數據:');
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
    console.error('❌ 檢查藝術家檔案失敗:', error);
  }
};

// 檢查作品詳情頁的數據
const checkWorkDetail = async (workId, authorId) => {
  try {
    console.log(
      `\n🧪 檢查作品詳情頁數據 (workId: ${workId}, authorId: ${authorId}):`
    );

    const { getWorkDataById } = await import(
      './src/components/work-detail/utils/workDetailHelpers.js'
    );
    const workData = await getWorkDataById(workId);

    if (workData) {
      console.log('✅ 作品詳情頁數據:');
      console.log(`   Title: ${workData.title}`);
      console.log(`   Author Name: ${workData.author.name}`);
      console.log(`   Author Works Count: ${workData.author.works}`);
      console.log(
        `   Author Works Source: ${
          workData.author.works === 1 ? 'Profile Data' : 'MOCK_USERS'
        }`
      );
    } else {
      console.log('❌ 未找到作品數據');
    }

    return workData;
  } catch (error) {
    console.error('❌ 檢查作品詳情頁失敗:', error);
  }
};

// 運行完整調試
const runFullDebug = async () => {
  console.log('🚀 開始調試作品數量同步問題...\n');

  const users = ['alice', 'bryan', 'alex'];

  for (const userId of users) {
    console.log(`\n👤 調試用戶: ${userId}`);
    console.log('='.repeat(50));

    // 1. 檢查profile數據
    await checkProfileWorks(userId);

    // 2. 檢查藝術家檔案數據
    await checkArtistProfile(userId);

    // 3. 檢查作品詳情頁數據
    await checkWorkDetail(`mock_${userId}_work`, userId);
  }

  console.log('\n🎯 調試完成！');
  console.log('\n💡 預期結果:');
  console.log('1. Profile數據中的portfolio數量應該與藝術家檔案頁面一致');
  console.log('2. 作品詳情頁的Works數量應該與藝術家檔案頁面一致');
  console.log('3. 如果數量不一致，說明數據源不同步');
};

// 暴露給全局
window.checkProfileWorks = checkProfileWorks;
window.checkArtistProfile = checkArtistProfile;
window.checkWorkDetail = checkWorkDetail;
window.runFullDebug = runFullDebug;

console.log('📋 可用命令:');
console.log('- runFullDebug() - 運行完整調試');
console.log('- checkProfileWorks(userId) - 檢查profile數據');
console.log('- checkArtistProfile(userId) - 檢查藝術家檔案數據');
console.log('- checkWorkDetail(workId, authorId) - 檢查作品詳情頁數據');

// 自動運行調試
runFullDebug();

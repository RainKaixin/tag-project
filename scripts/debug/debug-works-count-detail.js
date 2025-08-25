// debug-works-count-detail.js: 詳細調試作品數量問題

console.log('🔍 詳細調試作品數量問題');

// 檢查實際的數據流
const debugDataFlow = async () => {
  try {
    console.log('🚀 開始調試數據流...\n');

    // 1. 檢查MOCK_USERS中的Bryan數據
    console.log('1️⃣ 檢查MOCK_USERS中的Bryan數據:');
    const { MOCK_USERS } = require('./src/utils/mockUsers.js');
    const bryanMock = MOCK_USERS.bryan;
    console.log(`   Bryan ID: ${bryanMock.id}`);
    console.log(`   Bryan Name: ${bryanMock.name}`);
    console.log(
      `   Bryan Portfolio Count: ${
        bryanMock.portfolio ? bryanMock.portfolio.length : 0
      }`
    );

    if (bryanMock.portfolio) {
      bryanMock.portfolio.forEach((work, index) => {
        console.log(`   Work ${index + 1}: ${work.title} (${work.id})`);
      });
    }

    // 2. 模擬getArtistById
    console.log('\n2️⃣ 模擬getArtistById:');
    const { getArtistById } = await import(
      './src/components/artist-profile/utils/artistHelpers.js'
    );
    const artistData = await getArtistById('bryan');

    if (artistData) {
      console.log('   Artist Data:');
      console.log(`     ID: ${artistData.id}`);
      console.log(`     Name: ${artistData.name}`);
      console.log(
        `     Works Array Length: ${
          artistData.works ? artistData.works.length : 0
        }`
      );
      console.log(`     Works Array:`, artistData.works);
    }

    // 3. 模擬getWorkDataById
    console.log('\n3️⃣ 模擬getWorkDataById:');
    const { getWorkDataById } = await import(
      './src/components/work-detail/utils/workDetailHelpers.js'
    );
    const workData = await getWorkDataById('mock_work_id');

    if (workData) {
      console.log('   Work Data:');
      console.log(`     Title: ${workData.title}`);
      console.log(`     Author Name: ${workData.author.name}`);
      console.log(`     Author Works Count: ${workData.author.works}`);
      console.log(`     Author Works Type: ${typeof workData.author.works}`);
      console.log(`     Author Object:`, workData.author);
    }

    // 4. 檢查數據轉換邏輯
    console.log('\n4️⃣ 檢查數據轉換邏輯:');
    console.log('   在workDetailHelpers.js中:');
    console.log('   works: authorInfo?.works?.length || 0');
    console.log(
      '   這裡的authorInfo.works是一個數組，所以works.length是正確的'
    );

    // 5. 檢查AuthorInfo組件
    console.log('\n5️⃣ 檢查AuthorInfo組件:');
    console.log('   在AuthorInfo.js中:');
    console.log(
      '   <div className="font-semibold text-gray-900">{author.works}</div>'
    );
    console.log('   這裡直接顯示author.works，應該是數字');

    console.log('\n🎯 調試完成！');
    console.log('\n💡 問題分析:');
    console.log('1. Bryan在MOCK_USERS中有3個作品');
    console.log('2. getArtistById返回works數組，長度為3');
    console.log('3. workDetailHelpers使用works.length，應該是3');
    console.log('4. 如果顯示錯誤，可能是數據沒有正確傳遞');
  } catch (error) {
    console.error('❌ 調試失敗:', error);
  }
};

// 檢查特定作品的數據
const debugSpecificWork = async workId => {
  try {
    console.log(`\n🧪 調試特定作品: ${workId}`);

    const { getWorkDataById } = await import(
      './src/components/work-detail/utils/workDetailHelpers.js'
    );
    const workData = await getWorkDataById(workId);

    if (workData) {
      console.log('✅ 作品數據:');
      console.log(JSON.stringify(workData, null, 2));
    } else {
      console.log('❌ 未找到作品數據');
    }
  } catch (error) {
    console.error('❌ 調試特定作品失敗:', error);
  }
};

// 暴露給全局
window.debugDataFlow = debugDataFlow;
window.debugSpecificWork = debugSpecificWork;

console.log('📋 可用命令:');
console.log('- debugDataFlow() - 運行詳細數據流調試');
console.log('- debugSpecificWork(workId) - 調試特定作品');

// 自動運行調試
debugDataFlow();

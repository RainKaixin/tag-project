// collaboration-test-script v1: 瀏覽器控制台測試腳本
// 在瀏覽器控制台中運行: copy(await testCollaborationService())

import {
  testCollaborationService,
  validateDataIntegrity,
} from '../services/collaborationService/testUtils';

/**
 * 在瀏覽器控制台中運行協作項目測試
 * 使用方法:
 * 1. 打開瀏覽器控制台 (F12)
 * 2. 複製並運行: copy(await testCollaborationService())
 * 3. 或者直接運行: await testCollaborationService()
 */
window.testCollaborationService = async () => {
  console.log('🧪 Starting Collaboration Service Test...');

  try {
    const results = await testCollaborationService();

    console.log('📊 Test Results:', results);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(
      `📈 Success Rate: ${(
        (results.passed / (results.passed + results.failed)) *
        100
      ).toFixed(1)}%`
    );

    return results;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return { error: error.message };
  }
};

/**
 * 驗證數據完整性
 * 使用方法: validateCollaborationData()
 */
window.validateCollaborationData = () => {
  console.log('🔍 Checking data integrity...');

  try {
    const results = validateDataIntegrity();

    console.log('📊 Integrity Results:', results);

    if (results.valid) {
      console.log('✅ Data integrity check passed!');
    } else {
      console.log('❌ Data integrity check failed!');
      console.log('Issues:', results.issues);
    }

    return results;
  } catch (error) {
    console.error('❌ Integrity check failed:', error);
    return { error: error.message };
  }
};

/**
 * 快速測試協作項目創建
 * 使用方法: await quickTest()
 */
window.quickTest = async () => {
  console.log('⚡ Running quick test...');

  try {
    // 導入必要的函數
    const { createCollaboration, getCollaborations } = await import(
      '../services/collaborationService/index.js'
    );

    // 測試數據
    const testData = {
      title: 'Quick Test Collaboration',
      description: 'This is a quick test collaboration.',
      projectVision: 'Testing collaboration creation',
      teamSize: '2-3',
      duration: '1 month',
      meetingSchedule: '1 time/week',
      applicationDeadline: '2024-12-31',
      contactEmail: 'quicktest@example.com',
      contactDiscord: 'quicktest#1234',
      contactOther: '',
      roles: [
        {
          id: 1,
          customRole: 'Quick Test Role',
          roleDescription: 'A quick test role.',
          requiredSkills: 'Testing',
        },
      ],
    };

    // 創建協作項目
    console.log('📝 Creating collaboration...');
    const createResult = await createCollaboration(testData);

    if (createResult.success) {
      console.log('✅ Collaboration created successfully!');
      console.log('ID:', createResult.data.id);

      // 獲取協作項目列表
      console.log('📋 Fetching collaborations...');
      const listResult = await getCollaborations();

      if (listResult.success) {
        console.log('✅ Collaborations fetched successfully!');
        console.log('Count:', listResult.data.length);
        console.log('Latest:', listResult.data[0]);
      } else {
        console.log('❌ Failed to fetch collaborations:', listResult.error);
      }
    } else {
      console.log('❌ Failed to create collaboration:', createResult.error);
    }

    return { createResult };
  } catch (error) {
    console.error('❌ Quick test failed:', error);
    return { error: error.message };
  }
};

/**
 * 清理測試數據
 * 使用方法: await cleanupTestData()
 */
window.cleanupTestData = async () => {
  console.log('🧹 Cleaning up test data...');

  try {
    const { resetMockData } = await import(
      '../services/collaborationService/index.js'
    );
    const result = await resetMockData();

    if (result.success) {
      console.log('✅ Test data cleaned up successfully!');
    } else {
      console.log('❌ Failed to cleanup test data:', result.error);
    }

    return result;
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    return { error: error.message };
  }
};

// 自動加載測試函數到全局作用域
console.log('🧪 Collaboration Test Script Loaded!');
console.log('Available functions:');
console.log('- testCollaborationService() - Run full test suite');
console.log('- validateCollaborationData() - Check data integrity');
console.log('- quickTest() - Quick creation test');
console.log('- cleanupTestData() - Reset to original data');
console.log('');
console.log('Example usage:');
console.log('await testCollaborationService()');
console.log('validateCollaborationData()');
console.log('await quickTest()');

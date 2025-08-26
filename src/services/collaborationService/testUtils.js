// collaboration-service-test-utils v1: 測試工具函數
// 用於驗證 Mock API 的功能和數據完整性

import { MOCK_STORAGE_KEYS } from './types';

import {
  createCollaboration,
  getCollaborations,
  getCollaborationById,
  updateCollaboration,
  deleteCollaboration,
  likeCollaboration,
  getCollaborationStats,
  resetMockData,
} from './index';

/**
 * 測試協作項目服務的完整功能
 * @returns {Object} 測試結果
 */
export const testCollaborationService = async () => {
  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  console.log('🧪 Starting Collaboration Service Tests...');

  try {
    // 測試 1: 重置數據
    console.log('📋 Test 1: Reset Mock Data');
    const resetResult = await resetMockData();
    if (resetResult.success) {
      results.passed++;
      results.tests.push({ name: 'Reset Mock Data', status: 'PASSED' });
      console.log('✅ Reset Mock Data: PASSED');
    } else {
      results.failed++;
      results.tests.push({
        name: 'Reset Mock Data',
        status: 'FAILED',
        error: resetResult.error,
      });
      console.log('❌ Reset Mock Data: FAILED', resetResult.error);
    }

    // 測試 2: 獲取協作項目列表
    console.log('📋 Test 2: Get Collaborations List');
    const listResult = await getCollaborations();
    if (listResult.success && listResult.data.length > 0) {
      results.passed++;
      results.tests.push({
        name: 'Get Collaborations List',
        status: 'PASSED',
        count: listResult.data.length,
      });
      console.log(
        '✅ Get Collaborations List: PASSED',
        `(${listResult.data.length} items)`
      );
    } else {
      results.failed++;
      results.tests.push({
        name: 'Get Collaborations List',
        status: 'FAILED',
        error: listResult.error,
      });
      console.log('❌ Get Collaborations List: FAILED', listResult.error);
    }

    // 測試 3: 獲取統計信息
    console.log('📋 Test 3: Get Collaboration Stats');
    const statsResult = await getCollaborationStats();
    if (statsResult.success && statsResult.data) {
      results.passed++;
      results.tests.push({
        name: 'Get Collaboration Stats',
        status: 'PASSED',
        stats: statsResult.data,
      });
      console.log('✅ Get Collaboration Stats: PASSED', statsResult.data);
    } else {
      results.failed++;
      results.tests.push({
        name: 'Get Collaboration Stats',
        status: 'FAILED',
        error: statsResult.error,
      });
      console.log('❌ Get Collaboration Stats: FAILED', statsResult.error);
    }

    // 測試 4: 創建新協作項目
    console.log('📋 Test 4: Create New Collaboration');
    const testFormData = {
      title: 'Test Collaboration Project',
      description: 'This is a test collaboration project for testing purposes.',
      projectVision: 'Testing the collaboration service functionality',
      whyThisMatters: 'This test helps ensure the service works correctly.',
      teamSize: '2-3',
      duration: '1-2 months',
      meetingSchedule: '1-2 times/week',
      applicationDeadline: '2024-12-31',
      projectType: 'Test Project',
      contactEmail: 'test@example.com',
      contactDiscord: 'testuser#1234',
      contactOther: '',
      roles: [
        {
          id: 1,
          customRole: 'Test Role',
          roleDescription: 'This is a test role for testing purposes.',
          requiredSkills: 'Testing, JavaScript, React',
        },
      ],
    };

    const createResult = await createCollaboration(testFormData);
    if (createResult.success && createResult.data.id) {
      results.passed++;
      results.tests.push({
        name: 'Create New Collaboration',
        status: 'PASSED',
        id: createResult.data.id,
      });
      console.log('✅ Create New Collaboration: PASSED', createResult.data.id);

      // 測試 5: 獲取新創建的協作項目詳情
      console.log('📋 Test 5: Get Collaboration Details');
      const detailResult = await getCollaborationById(createResult.data.id);
      if (detailResult.success && detailResult.data) {
        results.passed++;
        results.tests.push({
          name: 'Get Collaboration Details',
          status: 'PASSED',
          id: createResult.data.id,
        });
        console.log('✅ Get Collaboration Details: PASSED');

        // 測試 6: 點讚協作項目
        console.log('📋 Test 6: Like Collaboration');
        const likeResult = await likeCollaboration(createResult.data.id);
        if (likeResult.success && likeResult.data.likes > 0) {
          results.passed++;
          results.tests.push({
            name: 'Like Collaboration',
            status: 'PASSED',
            likes: likeResult.data.likes,
          });
          console.log('✅ Like Collaboration: PASSED', likeResult.data.likes);

          // 測試 7: 更新協作項目
          console.log('📋 Test 7: Update Collaboration');
          const updateData = {
            title: 'Updated Test Collaboration Project',
            description: 'This is an updated test collaboration project.',
            projectVision: 'Updated testing vision',
            teamSize: '3-4',
            duration: '2-3 months',
            meetingSchedule: '2-3 times/week',
            applicationDeadline: '2024-12-31',
            contactEmail: 'updated@example.com',
            contactDiscord: 'updateduser#5678',
            contactOther: '',
            roles: [
              {
                id: 1,
                customRole: 'Updated Test Role',
                roleDescription: 'This is an updated test role.',
                requiredSkills: 'Updated Testing, JavaScript, React',
              },
            ],
          };

          const updateResult = await updateCollaboration(
            createResult.data.id,
            updateData
          );
          if (
            updateResult.success &&
            updateResult.data.title === updateData.title
          ) {
            results.passed++;
            results.tests.push({
              name: 'Update Collaboration',
              status: 'PASSED',
            });
            console.log('✅ Update Collaboration: PASSED');

            // 測試 8: 刪除協作項目
            console.log('📋 Test 8: Delete Collaboration');
            const deleteResult = await deleteCollaboration(
              createResult.data.id
            );
            if (deleteResult.success) {
              results.passed++;
              results.tests.push({
                name: 'Delete Collaboration',
                status: 'PASSED',
              });
              console.log('✅ Delete Collaboration: PASSED');
            } else {
              results.failed++;
              results.tests.push({
                name: 'Delete Collaboration',
                status: 'FAILED',
                error: deleteResult.error,
              });
              console.log(
                '❌ Delete Collaboration: FAILED',
                deleteResult.error
              );
            }
          } else {
            results.failed++;
            results.tests.push({
              name: 'Update Collaboration',
              status: 'FAILED',
              error: updateResult.error,
            });
            console.log('❌ Update Collaboration: FAILED', updateResult.error);
          }
        } else {
          results.failed++;
          results.tests.push({
            name: 'Like Collaboration',
            status: 'FAILED',
            error: likeResult.error,
          });
          console.log('❌ Like Collaboration: FAILED', likeResult.error);
        }
      } else {
        results.failed++;
        results.tests.push({
          name: 'Get Collaboration Details',
          status: 'FAILED',
          error: detailResult.error,
        });
        console.log('❌ Get Collaboration Details: FAILED', detailResult.error);
      }
    } else {
      results.failed++;
      results.tests.push({
        name: 'Create New Collaboration',
        status: 'FAILED',
        error: createResult.error,
      });
      console.log('❌ Create New Collaboration: FAILED', createResult.error);
    }

    // 測試 9: 搜索功能
    console.log('📋 Test 9: Search Collaborations');
    const searchResult = await getCollaborations({ searchTerm: 'Game' });
    if (searchResult.success) {
      results.passed++;
      results.tests.push({
        name: 'Search Collaborations',
        status: 'PASSED',
        count: searchResult.data.length,
      });
      console.log(
        '✅ Search Collaborations: PASSED',
        `(${searchResult.data.length} results)`
      );
    } else {
      results.failed++;
      results.tests.push({
        name: 'Search Collaborations',
        status: 'FAILED',
        error: searchResult.error,
      });
      console.log('❌ Search Collaborations: FAILED', searchResult.error);
    }

    // 測試 10: 分頁功能
    console.log('📋 Test 10: Pagination');
    const paginationResult = await getCollaborations({ page: 1, limit: 2 });
    if (paginationResult.success && paginationResult.pagination) {
      results.passed++;
      results.tests.push({
        name: 'Pagination',
        status: 'PASSED',
        pagination: paginationResult.pagination,
      });
      console.log('✅ Pagination: PASSED', paginationResult.pagination);
    } else {
      results.failed++;
      results.tests.push({
        name: 'Pagination',
        status: 'FAILED',
        error: paginationResult.error,
      });
      console.log('❌ Pagination: FAILED', paginationResult.error);
    }
  } catch (error) {
    console.error('❌ Test Suite Error:', error);
    results.failed++;
    results.tests.push({
      name: 'Test Suite',
      status: 'ERROR',
      error: error.message,
    });
  }

  // 輸出測試總結
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(
    `📈 Success Rate: ${(
      (results.passed / (results.passed + results.failed)) *
      100
    ).toFixed(1)}%`
  );

  return results;
};

/**
 * 驗證數據完整性
 * @returns {Object} 驗證結果
 */
export const validateDataIntegrity = () => {
  const results = {
    valid: true,
    issues: [],
  };

  try {
    // 檢查 localStorage 中的數據
    const storedData = localStorage.getItem(MOCK_STORAGE_KEYS.COLLABORATIONS);
    if (!storedData) {
      results.issues.push('No collaboration data found in localStorage');
      results.valid = false;
      return results;
    }

    const collaborations = JSON.parse(storedData);

    // 驗證每個協作項目的必要字段
    collaborations.forEach((collab, index) => {
      const requiredFields = [
        'id',
        'title',
        'description',
        'projectVision',
        'author',
        'status',
      ];
      const missingFields = requiredFields.filter(field => !collab[field]);

      if (missingFields.length > 0) {
        results.issues.push(
          `Collaboration ${index}: Missing required fields: ${missingFields.join(
            ', '
          )}`
        );
        results.valid = false;
      }

      // 驗證作者信息
      if (collab.author && (!collab.author.id || !collab.author.name)) {
        results.issues.push(
          `Collaboration ${index}: Invalid author information`
        );
        results.valid = false;
      }

      // 驗證角色信息
      if (collab.roles && Array.isArray(collab.roles)) {
        collab.roles.forEach((role, roleIndex) => {
          if (!role.title || !role.description) {
            results.issues.push(
              `Collaboration ${index}, Role ${roleIndex}: Missing title or description`
            );
            results.valid = false;
          }
        });
      }
    });

    console.log(
      '🔍 Data Integrity Check:',
      results.valid ? 'PASSED' : 'FAILED'
    );
    if (results.issues.length > 0) {
      console.log('⚠️ Issues found:', results.issues);
    }
  } catch (error) {
    results.valid = false;
    results.issues.push(`Data integrity check error: ${error.message}`);
    console.error('❌ Data Integrity Check Error:', error);
  }

  return results;
};

/**
 * 清理測試數據
 */
export const cleanupTestData = () => {
  try {
    // 重置為初始 Mock 數據
    resetMockData();
    console.log('🧹 Test data cleaned up successfully');
  } catch (error) {
    console.error('❌ Failed to cleanup test data:', error);
  }
};

/**
 * 生成測試報告
 * @param {Object} testResults - 測試結果
 * @returns {string} 測試報告
 */
export const generateTestReport = testResults => {
  const report = [
    '# Collaboration Service Test Report',
    '',
    `## Summary`,
    `- **Total Tests**: ${testResults.passed + testResults.failed}`,
    `- **Passed**: ${testResults.passed}`,
    `- **Failed**: ${testResults.failed}`,
    `- **Success Rate**: ${(
      (testResults.passed / (testResults.passed + testResults.failed)) *
      100
    ).toFixed(1)}%`,
    '',
    '## Test Details',
    '',
  ];

  testResults.tests.forEach(test => {
    const status = test.status === 'PASSED' ? '✅' : '❌';
    report.push(`### ${status} ${test.name}`);

    if (test.error) {
      report.push(`**Error**: ${test.error}`);
    }

    if (test.count) {
      report.push(`**Count**: ${test.count}`);
    }

    if (test.id) {
      report.push(`**ID**: ${test.id}`);
    }

    if (test.likes) {
      report.push(`**Likes**: ${test.likes}`);
    }

    if (test.stats) {
      report.push(`**Stats**: ${JSON.stringify(test.stats, null, 2)}`);
    }

    if (test.pagination) {
      report.push(
        `**Pagination**: ${JSON.stringify(test.pagination, null, 2)}`
      );
    }

    report.push('');
  });

  return report.join('\n');
};

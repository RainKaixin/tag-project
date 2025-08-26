// collaboration-test-page v1: 協作項目測試頁面
// 提供完整的測試功能和手動測試界面

import React, { useState, useEffect } from 'react';

import { useCollaborationService } from '../../services/collaborationService/hooks/useCollaborationService';
import {
  testCollaborationService,
  validateDataIntegrity,
  generateTestReport,
} from '../../services/collaborationService/testUtils';

const CollaborationTestPage = () => {
  const [testResults, setTestResults] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testReport, setTestReport] = useState('');
  const [showManualTest, setShowManualTest] = useState(false);

  // 使用協作項目服務
  const {
    collaborations,
    loading,
    error,
    createNewCollaboration,
    fetchCollaborations,
    resetData,
    stats,
  } = useCollaborationService();

  // 手動測試表單狀態
  const [manualFormData, setManualFormData] = useState({
    title: 'Manual Test Collaboration',
    description: 'This is a manual test collaboration project.',
    projectVision: 'Testing collaboration functionality manually',
    whyThisMatters:
      'This helps verify the collaboration system works correctly.',
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
        roleDescription: 'This is a test role for manual testing.',
        requiredSkills: 'Testing, JavaScript, React',
      },
    ],
  });

  // 運行自動化測試
  const runAutomatedTests = async () => {
    setIsRunningTests(true);
    setTestResults(null);
    setTestReport('');

    try {
      console.log('🧪 Starting automated tests...');
      const results = await testCollaborationService();
      setTestResults(results);

      // 生成測試報告
      const report = generateTestReport(results);
      setTestReport(report);

      console.log('✅ Automated tests completed!');
    } catch (error) {
      console.error('❌ Test execution failed:', error);
      setTestResults({
        passed: 0,
        failed: 1,
        tests: [
          { name: 'Test Execution', status: 'ERROR', error: error.message },
        ],
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  // 驗證數據完整性
  const runDataIntegrityCheck = () => {
    const integrityResults = validateDataIntegrity();
    console.log('🔍 Data Integrity Check Results:', integrityResults);

    if (integrityResults.valid) {
      alert('✅ Data integrity check passed!');
    } else {
      alert(
        `❌ Data integrity check failed!\nIssues:\n${integrityResults.issues.join(
          '\n'
        )}`
      );
    }
  };

  // 重置數據
  const handleResetData = async () => {
    if (
      window.confirm(
        'Are you sure you want to reset all collaboration data? This will restore the original mock data.'
      )
    ) {
      await resetData();
      alert('✅ Data reset successfully!');
    }
  };

  // 手動創建協作項目
  const handleManualCreate = async () => {
    try {
      const result = await createNewCollaboration(manualFormData);

      if (result.success) {
        alert(`✅ Collaboration created successfully!\nID: ${result.data.id}`);
        // 重新獲取列表
        await fetchCollaborations();
      } else {
        alert(
          `❌ Failed to create collaboration:\n${
            result.error || JSON.stringify(result.errors)
          }`
        );
      }
    } catch (error) {
      alert(`❌ Error creating collaboration: ${error.message}`);
    }
  };

  // 更新手動測試表單
  const updateManualForm = (field, value) => {
    setManualFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 更新角色
  const updateRole = (index, field, value) => {
    setManualFormData(prev => ({
      ...prev,
      roles: prev.roles.map((role, i) =>
        i === index ? { ...role, [field]: value } : role
      ),
    }));
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-6xl mx-auto px-4'>
        {/* 頁面標題 */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            🧪 Collaboration Service Test Page
          </h1>
          <p className='text-gray-600'>
            Test the collaboration functionality and verify all features work
            correctly
          </p>
        </div>

        {/* 統計信息 */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>📊 Current Status</h2>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='bg-blue-50 p-4 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600'>
                {collaborations.length}
              </div>
              <div className='text-sm text-blue-800'>Total Collaborations</div>
            </div>
            <div className='bg-green-50 p-4 rounded-lg'>
              <div className='text-2xl font-bold text-green-600'>
                {stats?.total || 0}
              </div>
              <div className='text-sm text-green-800'>Active Projects</div>
            </div>
            <div className='bg-purple-50 p-4 rounded-lg'>
              <div className='text-2xl font-bold text-purple-600'>
                {loading ? '...' : 'Ready'}
              </div>
              <div className='text-sm text-purple-800'>Service Status</div>
            </div>
            <div className='bg-orange-50 p-4 rounded-lg'>
              <div className='text-2xl font-bold text-orange-600'>
                {error ? 'Error' : 'OK'}
              </div>
              <div className='text-sm text-orange-800'>Error Status</div>
            </div>
          </div>
        </div>

        {/* 測試控制面板 */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>🔧 Test Controls</h2>
          <div className='flex flex-wrap gap-4'>
            <button
              onClick={runAutomatedTests}
              disabled={isRunningTests}
              className='bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium'
            >
              {isRunningTests
                ? '🔄 Running Tests...'
                : '🧪 Run Automated Tests'}
            </button>

            <button
              onClick={runDataIntegrityCheck}
              className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium'
            >
              🔍 Check Data Integrity
            </button>

            <button
              onClick={handleResetData}
              className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium'
            >
              🔄 Reset Data
            </button>

            <button
              onClick={() => setShowManualTest(!showManualTest)}
              className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium'
            >
              {showManualTest ? '❌ Hide Manual Test' : '✏️ Show Manual Test'}
            </button>
          </div>
        </div>

        {/* 手動測試表單 */}
        {showManualTest && (
          <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
            <h2 className='text-xl font-semibold mb-4'>
              ✏️ Manual Test - Create Collaboration
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Title
                </label>
                <input
                  type='text'
                  value={manualFormData.title}
                  onChange={e => updateManualForm('title', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Project Type
                </label>
                <input
                  type='text'
                  value={manualFormData.projectType}
                  onChange={e =>
                    updateManualForm('projectType', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Description
                </label>
                <textarea
                  value={manualFormData.description}
                  onChange={e =>
                    updateManualForm('description', e.target.value)
                  }
                  rows={3}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Project Vision
                </label>
                <textarea
                  value={manualFormData.projectVision}
                  onChange={e =>
                    updateManualForm('projectVision', e.target.value)
                  }
                  rows={2}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Team Size
                </label>
                <input
                  type='text'
                  value={manualFormData.teamSize}
                  onChange={e => updateManualForm('teamSize', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Duration
                </label>
                <input
                  type='text'
                  value={manualFormData.duration}
                  onChange={e => updateManualForm('duration', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Contact Email
                </label>
                <input
                  type='email'
                  value={manualFormData.contactEmail}
                  onChange={e =>
                    updateManualForm('contactEmail', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Discord
                </label>
                <input
                  type='text'
                  value={manualFormData.contactDiscord}
                  onChange={e =>
                    updateManualForm('contactDiscord', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>

            {/* 角色編輯 */}
            <div className='mt-6'>
              <h3 className='text-lg font-medium mb-3'>Roles</h3>
              {manualFormData.roles.map((role, index) => (
                <div
                  key={index}
                  className='border border-gray-200 rounded-lg p-4 mb-4'
                >
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Role Title
                      </label>
                      <input
                        type='text'
                        value={role.customRole}
                        onChange={e =>
                          updateRole(index, 'customRole', e.target.value)
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Required Skills
                      </label>
                      <input
                        type='text'
                        value={role.requiredSkills}
                        onChange={e =>
                          updateRole(index, 'requiredSkills', e.target.value)
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Role Description
                      </label>
                      <textarea
                        value={role.roleDescription}
                        onChange={e =>
                          updateRole(index, 'roleDescription', e.target.value)
                        }
                        rows={2}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleManualCreate}
              className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium'
            >
              🚀 Create Collaboration
            </button>
          </div>
        )}

        {/* 測試結果 */}
        {testResults && (
          <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
            <h2 className='text-xl font-semibold mb-4'>📊 Test Results</h2>
            <div className='mb-4'>
              <div className='flex items-center gap-4'>
                <div className='text-2xl font-bold text-green-600'>
                  {testResults.passed}
                </div>
                <div className='text-sm text-green-800'>Passed</div>
                <div className='text-2xl font-bold text-red-600'>
                  {testResults.failed}
                </div>
                <div className='text-sm text-red-800'>Failed</div>
                <div className='text-2xl font-bold text-blue-600'>
                  {(
                    (testResults.passed /
                      (testResults.passed + testResults.failed)) *
                    100
                  ).toFixed(1)}
                  %
                </div>
                <div className='text-sm text-blue-800'>Success Rate</div>
              </div>
            </div>

            <div className='space-y-2'>
              {testResults.tests.map((test, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    test.status === 'PASSED'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className='flex items-center gap-2'>
                    <span
                      className={
                        test.status === 'PASSED'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {test.status === 'PASSED' ? '✅' : '❌'}
                    </span>
                    <span className='font-medium'>{test.name}</span>
                  </div>
                  {test.error && (
                    <div className='text-sm text-red-600 mt-1'>
                      Error: {test.error}
                    </div>
                  )}
                  {test.count && (
                    <div className='text-sm text-gray-600 mt-1'>
                      Count: {test.count}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 測試報告 */}
        {testReport && (
          <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
            <h2 className='text-xl font-semibold mb-4'>📋 Test Report</h2>
            <pre className='bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm'>
              {testReport}
            </pre>
          </div>
        )}

        {/* 當前協作項目列表 */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold mb-4'>
            📋 Current Collaborations ({collaborations.length})
          </h2>
          {loading ? (
            <div className='text-center py-8'>
              <div className='text-gray-600'>Loading collaborations...</div>
            </div>
          ) : collaborations.length === 0 ? (
            <div className='text-center py-8'>
              <div className='text-gray-600'>No collaborations found.</div>
            </div>
          ) : (
            <div className='space-y-4'>
              {collaborations.slice(0, 5).map(collab => (
                <div
                  key={collab.id}
                  className='border border-gray-200 rounded-lg p-4'
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <h3 className='font-medium text-lg'>{collab.title}</h3>
                      <p className='text-gray-600 text-sm mt-1'>
                        {collab.subtitle}
                      </p>
                      <div className='flex items-center gap-4 mt-2 text-sm text-gray-500'>
                        <span>👤 {collab.author?.name}</span>
                        <span>❤️ {collab.likes}</span>
                        <span>👁️ {collab.views}</span>
                        <span>📅 {collab.dateRange}</span>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-sm text-gray-500'>
                        ID: {collab.id}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {collab.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {collaborations.length > 5 && (
                <div className='text-center text-gray-600'>
                  ... and {collaborations.length - 5} more collaborations
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationTestPage;

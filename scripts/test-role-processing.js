// 测试角色数据处理逻辑
// 在协作项目上传页面的控制台中运行

console.log('🧪 Testing role processing logic...');

// 模拟表单数据中的角色
const mockFormData = {
  roles: [
    {
      id: 1,
      customRole: 'winter',
      roleDescription: 'winter',
      requiredSkills: 'winter',
    },
  ],
};

console.log('📋 Mock form data:', mockFormData);

// 模拟 formatFormDataForAPI 的处理逻辑
const processedRoles =
  mockFormData.roles
    ?.map(role => {
      console.log('[Test] Processing role:', role);

      const processedRole = {
        id: role.id || Date.now().toString(),
        title: role.customRole?.trim() || role.title?.trim() || '',
        description:
          role.roleDescription?.trim() || role.description?.trim() || '',
        requiredSkills: role.requiredSkills?.trim() || '',
        status: 'available',
      };

      console.log('[Test] Processed role:', processedRole);
      return processedRole;
    })
    .filter(role => {
      const hasTitle = role.title && role.title.length > 0;
      console.log(`[Test] Role "${role.title}" has title: ${hasTitle}`);
      return hasTitle;
    }) || [];

console.log('[Test] Final processed roles:', processedRoles);
console.log('[Test] Roles count:', processedRoles.length);

// 验证结果
if (processedRoles.length > 0) {
  console.log('✅ Role processing test PASSED');
  processedRoles.forEach((role, index) => {
    console.log(`  Role ${index + 1}: ${role.title} - ${role.description}`);
  });
} else {
  console.log('❌ Role processing test FAILED - No roles processed');
}

console.log('✅ Test completed!');

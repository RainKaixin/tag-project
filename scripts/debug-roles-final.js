// 最终调试脚本 - 不依赖页面变量
// 在任何页面的控制台中运行

console.log('🔍 Final debugging script - checking localStorage data...');

// 1. 检查 localStorage 中的所有协作项目
console.log('📦 Checking all collaborations in localStorage...');
const stored = localStorage.getItem('mock_collaborations');

if (stored) {
  const collaborations = JSON.parse(stored);
  console.log('  Total collaborations:', collaborations.length);

  if (collaborations.length > 0) {
    console.log('\n📋 Latest collaboration details:');
    const latestCollaboration = collaborations[0];

    console.log('  Title:', latestCollaboration.title);
    console.log('  Description:', latestCollaboration.description);
    console.log('  Team Size:', latestCollaboration.teamSize);
    console.log('  Duration:', latestCollaboration.duration);
    console.log('  Meeting Schedule:', latestCollaboration.meetingSchedule);

    // 检查角色数据
    console.log('\n🎭 Roles analysis:');
    console.log('  Roles exists:', !!latestCollaboration.roles);
    console.log('  Roles type:', typeof latestCollaboration.roles);
    console.log('  Roles:', latestCollaboration.roles);
    console.log('  Roles length:', latestCollaboration.roles?.length);

    if (latestCollaboration.roles && latestCollaboration.roles.length > 0) {
      console.log('\n📝 Individual roles:');
      latestCollaboration.roles.forEach((role, index) => {
        console.log(`  Role ${index + 1}:`);
        console.log('    Raw object:', role);
        console.log('    Object keys:', Object.keys(role));
        console.log('    role.id:', role.id);
        console.log('    role.title:', role.title);
        console.log('    role.customRole:', role.customRole);
        console.log('    role.description:', role.description);
        console.log('    role.roleDescription:', role.roleDescription);
        console.log('    role.requiredSkills:', role.requiredSkills);
        console.log('    role.status:', role.status);
        console.log('    Is empty object:', Object.keys(role).length === 0);
      });
    } else {
      console.log('  ❌ No roles found or roles array is empty');
    }

    // 检查联系信息
    console.log('\n📞 Contact info:');
    console.log('  Contact info exists:', !!latestCollaboration.contactInfo);
    if (latestCollaboration.contactInfo) {
      console.log('  Email:', latestCollaboration.contactInfo.email);
      console.log('  Discord:', latestCollaboration.contactInfo.discord);
      console.log('  Other:', latestCollaboration.contactInfo.other);
    }
  } else {
    console.log('  ❌ No collaborations found');
  }
} else {
  console.log('  ❌ No collaborations data in localStorage');
}

// 2. 模拟 formatFormDataForAPI 处理逻辑
console.log('\n🧪 Testing formatFormDataForAPI logic...');

if (stored) {
  const collaborations = JSON.parse(stored);
  if (collaborations.length > 0) {
    const latestCollaboration = collaborations[0];

    // 模拟表单数据结构
    const mockFormData = {
      roles: latestCollaboration.roles || [],
    };

    console.log('  Mock formData.roles:', mockFormData.roles);

    if (mockFormData.roles && mockFormData.roles.length > 0) {
      const processedRoles = mockFormData.roles
        .map(role => {
          console.log('    Processing role:', role);

          const processedRole = {
            id: role.id || Date.now().toString(),
            title: role.customRole?.trim() || role.title?.trim() || '',
            description:
              role.roleDescription?.trim() || role.description?.trim() || '',
            requiredSkills: role.requiredSkills?.trim() || '',
            status: 'available',
          };

          console.log('    Processed role:', processedRole);
          return processedRole;
        })
        .filter(role => {
          const hasTitle = role.title && role.title.length > 0;
          console.log(`    Role "${role.title}" has title: ${hasTitle}`);
          return hasTitle;
        });

      console.log('  Final processed roles:', processedRoles);
      console.log('  Processed roles count:', processedRoles.length);

      if (processedRoles.length > 0) {
        console.log('  ✅ formatFormDataForAPI would work correctly');
      } else {
        console.log('  ❌ formatFormDataForAPI would filter out all roles');
      }
    } else {
      console.log('  ❌ No roles to process');
    }
  }
}

// 3. 模拟 getPositionsData 处理逻辑
console.log('\n🧪 Testing getPositionsData logic...');

if (stored) {
  const collaborations = JSON.parse(stored);
  if (collaborations.length > 0) {
    const latestCollaboration = collaborations[0];

    console.log('  Project data roles:', latestCollaboration.roles);

    if (latestCollaboration.roles && latestCollaboration.roles.length > 0) {
      const positions = latestCollaboration.roles.map((role, index) => {
        console.log(`    Processing role ${index}:`, role);

        // 将技能字符串转换为数组
        const skills = role.requiredSkills
          ? role.requiredSkills
              .split(',')
              .map(skill => skill.trim())
              .filter(skill => skill)
          : [];

        const position = {
          id: role.id || index + 1,
          title: role.title || role.customRole || `Role ${index + 1}`,
          description: role.description || role.roleDescription || '',
          status: role.status || 'available',
          skills: skills,
          applications: role.applications || [],
        };

        console.log(`    Created position ${index}:`, position);
        return position;
      });

      console.log('  Final positions:', positions);
      console.log('  Positions count:', positions.length);

      if (positions.length > 0) {
        console.log('  ✅ getPositionsData would work correctly');
        positions.forEach((position, index) => {
          console.log(
            `    Position ${index + 1}: ${position.title} - ${
              position.description
            }`
          );
        });
      } else {
        console.log('  ❌ getPositionsData would return no positions');
      }
    } else {
      console.log('  ❌ No roles to convert to positions');
    }
  }
}

// 4. 检查是否有其他相关数据
console.log('\n🔍 Checking for other related data...');

// 检查是否有其他 localStorage 键包含角色信息
const allKeys = Object.keys(localStorage);
const roleRelatedKeys = allKeys.filter(
  key =>
    key.toLowerCase().includes('role') ||
    key.toLowerCase().includes('position') ||
    key.toLowerCase().includes('collaboration')
);

console.log('  All localStorage keys:', allKeys);
console.log('  Role-related keys:', roleRelatedKeys);

// 检查每个相关键
roleRelatedKeys.forEach(key => {
  try {
    const value = localStorage.getItem(key);
    console.log(`  ${key}:`, value);
  } catch (error) {
    console.log(`  ${key}: Error reading - ${error.message}`);
  }
});

console.log('\n✅ Final debug completed!');
console.log('📋 Summary:');
console.log('  - Check if roles exist in localStorage');
console.log('  - Check if roles have the correct structure');
console.log('  - Check if roles are being processed correctly');
console.log('  - Check if there are any data persistence issues');

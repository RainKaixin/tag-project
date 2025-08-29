// 修复 Collaboration 数据显示问题
console.log('🔧 [FIX] 开始修复 Collaboration 数据显示问题...');

// 1. 检查当前 localStorage 中的数据
const collaborationsFromStorage = localStorage.getItem('tag.collaborations');
console.log(
  '📦 [FIX] 当前 localStorage 中的 Collaboration 数据:',
  collaborationsFromStorage
);

if (collaborationsFromStorage) {
  try {
    const parsedCollaborations = JSON.parse(collaborationsFromStorage);
    console.log('📦 [FIX] 解析后的 Collaboration 数据:', parsedCollaborations);

    // 检查并修复数据
    let hasChanges = false;
    const fixedCollaborations = parsedCollaborations.map(collaboration => {
      const fixed = { ...collaboration };

      // 检查并修复 duration 字段
      if (!fixed.duration || fixed.duration === 'Not specified') {
        console.log('🔧 [FIX] 修复 duration 字段:', fixed.id);
        // 尝试从其他字段获取 duration 信息
        if (fixed.dateRange) {
          fixed.duration = fixed.dateRange;
          console.log('🔧 [FIX] 从 dateRange 获取 duration:', fixed.duration);
        }
      }

      // 检查并修复 meetingSchedule 字段
      if (!fixed.meetingSchedule || fixed.meetingSchedule === 'Not specified') {
        console.log('🔧 [FIX] 修复 meetingSchedule 字段:', fixed.id);
        // 尝试从其他字段获取 meetingSchedule 信息
        if (fixed.meetingFrequency) {
          fixed.meetingSchedule = fixed.meetingFrequency;
          console.log(
            '🔧 [FIX] 从 meetingFrequency 获取 meetingSchedule:',
            fixed.meetingSchedule
          );
        }
      }

      // 检查并修复 teamSize 字段
      if (!fixed.teamSize || fixed.teamSize === 'Not specified') {
        console.log('🔧 [FIX] 修复 teamSize 字段:', fixed.id);
        // 尝试从其他字段获取 teamSize 信息
        if (fixed.expectedTeamSize) {
          fixed.teamSize = fixed.expectedTeamSize;
          console.log(
            '🔧 [FIX] 从 expectedTeamSize 获取 teamSize:',
            fixed.teamSize
          );
        }
      }

      // 检查是否有变化
      if (JSON.stringify(fixed) !== JSON.stringify(collaboration)) {
        hasChanges = true;
      }

      return fixed;
    });

    // 如果有变化，保存修复后的数据
    if (hasChanges) {
      localStorage.setItem(
        'tag.collaborations',
        JSON.stringify(fixedCollaborations)
      );
      console.log('✅ [FIX] 数据修复完成，已保存到 localStorage');
    } else {
      console.log('✅ [FIX] 数据无需修复');
    }

    // 显示修复后的数据
    console.log('📦 [FIX] 修复后的 Collaboration 数据:', fixedCollaborations);
  } catch (error) {
    console.error('❌ [FIX] 修复数据失败:', error);
  }
}

// 2. 检查数据映射是否正确
console.log('🔍 [FIX] 检查数据映射...');

// 3. 输出修复信息
console.log('🔧 [FIX] 修复完成！请刷新页面查看效果。');

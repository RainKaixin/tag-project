// clear-localStorage.js - 清理localStorage空间

console.log('=== Clearing localStorage ===');

// 获取所有localStorage键
const allKeys = Object.keys(localStorage);
console.log(`Total localStorage keys: ${allKeys.length}`);

// 按前缀分组
const keyGroups = {};
allKeys.forEach(key => {
  const prefix = key.split(':')[0];
  if (!keyGroups[prefix]) {
    keyGroups[prefix] = [];
  }
  keyGroups[prefix].push(key);
});

console.log('localStorage key groups:');
Object.entries(keyGroups).forEach(([prefix, keys]) => {
  console.log(`  ${prefix}: ${keys.length} keys`);
});

// 计算总大小
let totalSize = 0;
allKeys.forEach(key => {
  try {
    const value = localStorage.getItem(key);
    totalSize += key.length + (value ? value.length : 0);
  } catch (e) {
    console.warn(`Failed to get size for key ${key}:`, e);
  }
});

console.log(
  `Total localStorage size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`
);

// 清理策略：保留applicationStorage，清理其他大文件
const keysToKeep = allKeys.filter(key => key.startsWith('applicationStatus'));
const keysToRemove = allKeys.filter(
  key => !key.startsWith('applicationStatus')
);

console.log(`Keys to keep: ${keysToKeep.length}`);
console.log(`Keys to remove: ${keysToRemove.length}`);

// 显示要删除的键
console.log('Keys to be removed:');
keysToRemove.forEach(key => {
  try {
    const value = localStorage.getItem(key);
    const size = key.length + (value ? value.length : 0);
    console.log(`  ${key}: ${(size / 1024).toFixed(2)} KB`);
  } catch (e) {
    console.warn(`Failed to get info for key ${key}:`, e);
  }
});

// 执行清理
let removedCount = 0;
let removedSize = 0;

keysToRemove.forEach(key => {
  try {
    const value = localStorage.getItem(key);
    const size = key.length + (value ? value.length : 0);
    localStorage.removeItem(key);
    removedCount++;
    removedSize += size;
    console.log(`Removed: ${key}`);
  } catch (e) {
    console.warn(`Failed to remove key ${key}:`, e);
  }
});

console.log(`=== Cleanup Complete ===`);
console.log(`Removed ${removedCount} keys`);
console.log(`Freed ${(removedSize / 1024 / 1024).toFixed(2)} MB`);

// 验证清理结果
const remainingKeys = Object.keys(localStorage);
console.log(`Remaining keys: ${remainingKeys.length}`);
console.log('Remaining keys:', remainingKeys);

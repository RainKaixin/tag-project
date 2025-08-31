// clear-collaboration-data.js - 清理collaboration相关数据

console.log('=== Clearing Collaboration Data ===');

// 清理collaboration相关的localStorage数据
const keysToRemove = [
  'mock_collaborations',
  'tag.avatars',
  'tag.images',
  'portfolio_alice',
  'portfolio_bryan',
];

let removedCount = 0;
let removedSize = 0;

keysToRemove.forEach(key => {
  try {
    if (localStorage.getItem(key)) {
      const value = localStorage.getItem(key);
      const size = key.length + (value ? value.length : 0);
      localStorage.removeItem(key);
      removedCount++;
      removedSize += size;
      console.log(`Removed: ${key} (${(size / 1024).toFixed(2)} KB)`);
    }
  } catch (e) {
    console.warn(`Failed to remove key ${key}:`, e);
  }
});

console.log(`=== Cleanup Complete ===`);
console.log(`Removed ${removedCount} collaboration-related keys`);
console.log(`Freed ${(removedSize / 1024 / 1024).toFixed(2)} MB`);

// 保留applicationStorage数据
const remainingKeys = Object.keys(localStorage);
const applicationStatusKeys = remainingKeys.filter(key =>
  key.startsWith('applicationStatus')
);
console.log(
  `Application status keys preserved: ${applicationStatusKeys.length}`
);
console.log('Application status keys:', applicationStatusKeys);

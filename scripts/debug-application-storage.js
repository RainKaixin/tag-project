// debug-application-storage.js - 调试applicationStorage状态

console.log('=== Application Storage Debug Script ===');

// 检查所有applicationStorage条目
const getAllApplicationStatuses = () => {
  try {
    const result = {};
    const keys = Object.keys(localStorage);

    keys.forEach(key => {
      if (key.startsWith('applicationStatus')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          result[key] = data;
        } catch (e) {
          console.warn(`Failed to parse key ${key}:`, e);
        }
      }
    });

    return result;
  } catch (error) {
    console.error('Failed to get all application statuses:', error);
    return {};
  }
};

// 显示所有申请状态
const allStatuses = getAllApplicationStatuses();
console.log('All application statuses:', allStatuses);

// 统计信息
const totalEntries = Object.keys(allStatuses).length;
console.log(`Total application status entries: ${totalEntries}`);

// 按状态分组
const statusCounts = {};
Object.values(allStatuses).forEach(data => {
  const status = data.status;
  statusCounts[status] = (statusCounts[status] || 0) + 1;
});

console.log('Status counts:', statusCounts);

// 显示最近的条目
const recentEntries = Object.entries(allStatuses)
  .sort((a, b) => b[1].timestamp - a[1].timestamp)
  .slice(0, 5);

console.log('Most recent entries:');
recentEntries.forEach(([key, data]) => {
  const date = new Date(data.timestamp);
  console.log(`  ${key}: ${data.status} (${date.toLocaleString()})`);
});

console.log('=== Debug Script Complete ===');

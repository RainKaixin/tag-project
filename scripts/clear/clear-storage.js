// 全面清理浏览器存储脚本
// 在浏览器控制台中运行此脚本

console.log('开始全面清理浏览器存储...');

// 1. 清理 localStorage
const localStorageKeys = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key) {
    localStorageKeys.push(key);
    console.log(`删除 localStorage: ${key}`);
    localStorage.removeItem(key);
  }
}

// 2. 清理 sessionStorage
const sessionStorageKeys = [];
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  if (key) {
    sessionStorageKeys.push(key);
    console.log(`删除 sessionStorage: ${key}`);
    sessionStorage.removeItem(key);
  }
}

// 3. 清理 IndexedDB
if ('indexedDB' in window) {
  console.log('清理 IndexedDB...');
  const request = indexedDB.deleteDatabase('TAGPortfolioDB');
  request.onsuccess = () => console.log('IndexedDB 清理完成');
  request.onerror = () => console.log('IndexedDB 清理失败');
}

// 4. 清理缓存
if ('caches' in window) {
  console.log('清理缓存...');
  caches
    .keys()
    .then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log(`删除缓存: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
    })
    .then(() => console.log('缓存清理完成'));
}

console.log(`清理完成！`);
console.log(`- localStorage: 删除了 ${localStorageKeys.length} 项`);
console.log(`- sessionStorage: 删除了 ${sessionStorageKeys.length} 项`);
console.log('请刷新页面，然后重新测试上传功能');

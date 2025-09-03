// clear-test-form-data.js
// 清理浏览器中可能存在的测试表单数据

console.log('🧹 开始清理测试表单数据...');

// 清理 localStorage 中可能存在的测试数据
const testKeys = [
  'test@example.com',
  'testpassword123',
  'formData',
  'loginForm',
  'registerForm',
];

testKeys.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ 已清理 localStorage: ${key}`);
  }
});

// 清理 sessionStorage 中可能存在的测试数据
testKeys.forEach(key => {
  if (sessionStorage.getItem(key)) {
    sessionStorage.removeItem(key);
    console.log(`✅ 已清理 sessionStorage: ${key}`);
  }
});

// 清理 IndexedDB 中可能存在的测试数据（如果存在）
if ('indexedDB' in window) {
  const request = indexedDB.open('testDB', 1);
  request.onsuccess = function (event) {
    const db = event.target.result;
    if (db.objectStoreNames.contains('formData')) {
      const transaction = db.transaction(['formData'], 'readwrite');
      const store = transaction.objectStore('formData');
      const clearRequest = store.clear();
      clearRequest.onsuccess = function () {
        console.log('✅ 已清理 IndexedDB 中的表单数据');
      };
    }
  };
}

// 清理 cookies 中可能存在的测试数据
document.cookie.split(';').forEach(cookie => {
  const [name] = cookie.split('=');
  if (name.trim().includes('test') || name.trim().includes('form')) {
    document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    console.log(`✅ 已清理 cookie: ${name.trim()}`);
  }
});

console.log('🎉 测试表单数据清理完成！');
console.log('💡 提示：请刷新页面，表单应该显示为空状态');

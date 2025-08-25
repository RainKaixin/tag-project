// 快速清除瀏覽量數據腳本

console.log('🧹 開始清除瀏覽量數據...');

// 清除瀏覽量數據
localStorage.removeItem('tag_artwork_views');

// 清除所有記錄狀態
let clearedCount = 0;
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('hasRecorded_')) {
    localStorage.removeItem(key);
    clearedCount++;
  }
});

console.log(`✅ 清除完成！`);
console.log(`   - 瀏覽量數據: 已清除`);
console.log(`   - 記錄狀態: 清除了 ${clearedCount} 個記錄`);

// 驗證清除結果
const remainingData = localStorage.getItem('tag_artwork_views');
if (!remainingData) {
  console.log('✅ 驗證成功：瀏覽量數據已完全清除');
} else {
  console.log('❌ 驗證失敗：仍有殘留數據');
}

console.log('\n🎯 現在您可以重新測試：');
console.log('1. 切換到 Alice 用戶');
console.log('2. 訪問作品詳情頁');
console.log('3. 切換到 Bryan 用戶');
console.log('4. 訪問作品詳情頁');
console.log('5. 切換到 Alex 用戶');
console.log('6. 訪問作品詳情頁');
console.log('7. 檢查瀏覽量是否為 3');

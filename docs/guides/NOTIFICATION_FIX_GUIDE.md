# 通知系統修復指南

## 🚨 問題概述

目前 TAG 網站的通知系統存在以下問題：

1. **點讚功能失效** - 406 (Not Acceptable) 錯誤
2. **通知約束衝突** - `notifications_unique_follow` 約束錯誤
3. **RLS 策略問題** - `artwork_likes` 表查詢被阻止

## 🔧 修復步驟

### 步驟 1: 執行數據庫修復腳本

在 Supabase SQL Editor 中執行以下兩個遷移文件：

#### 1.1 修復 RLS 策略

```sql
-- 執行文件: database/migrations/018_fix_artwork_likes_rls.sql
-- 修復 artwork_likes 表的 RLS 策略，解決 406 錯誤
```

#### 1.2 修復通知約束

```sql
-- 執行文件: database/migrations/019_fix_notifications_constraints.sql
-- 修復 notifications_unique_follow 約束衝突問題
```

### 步驟 2: 清除舊數據

在瀏覽器控制台執行以下命令清除舊格式的通知：

```javascript
// 清除所有舊格式的通知
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('u.')) {
    localStorage.removeItem(key);
  }
});

// 重新加載頁面
window.location.reload();
```

### 步驟 3: 重新啟用通知功能

修復數據庫問題後，需要重新啟用通知創建功能：

#### 3.1 啟用點讚通知

在 `src/components/work-detail/hooks/useLikeCount.js` 中：

- 取消註釋第 63-93 行的通知創建代碼

#### 3.2 啟用關注通知

在 `src/services/supabase/users.js` 中：

- 取消註釋第 155-181 行的通知創建代碼

## ✅ 修復完成檢查

修復完成後，請測試以下功能：

1. **點讚功能**

   - 點擊其他用戶作品的點讚按鈕
   - 確認點讚狀態正確切換
   - 確認點讚數正確更新

2. **關注功能**

   - 點擊其他用戶的關注按鈕
   - 確認關注狀態正確切換
   - 確認關注者數正確更新

3. **通知功能**
   - 點讚其他用戶的作品
   - 關注其他用戶
   - 檢查通知中心是否顯示新通知
   - 檢查右上角通知圖標是否顯示未讀數量

## 🐛 故障排除

### 如果點讚功能仍然失效

1. 檢查 Supabase 控制台中的 RLS 策略
2. 確認 `artwork_likes` 表的策略已正確應用
3. 檢查用戶認證狀態

### 如果通知仍然不顯示

1. 檢查 Supabase 控制台中的 `notifications` 表約束
2. 確認約束修復腳本已正確執行
3. 檢查通知服務的適配器配置

### 如果出現新的錯誤

1. 檢查瀏覽器控制台的錯誤信息
2. 檢查 Supabase 控制台的日誌
3. 確認所有遷移腳本都已正確執行

## 📝 技術細節

### 修復的問題

1. **RLS 策略問題**

   - 重新創建 `artwork_likes` 表的 RLS 策略
   - 確保認證用戶可以正常查詢和操作點讚數據

2. **約束衝突問題**

   - 刪除錯誤的 `notifications_unique_follow` 約束
   - 創建正確的唯一約束防止重複通知
   - 清理重複的通知記錄

3. **通知 ID 格式問題**
   - 將通知 ID 從自定義格式改為標準 UUID 格式
   - 確保與 Supabase 數據庫兼容

### 臨時解決方案

在數據庫修復完成前，已暫時禁用前端通知創建功能，確保點讚和關注功能能正常工作。

## 🎯 下一步

1. 執行數據庫修復腳本
2. 測試基本功能（點讚、關注）
3. 重新啟用通知功能
4. 測試完整的通知流程
5. 監控系統穩定性

---

**注意：** 請按照順序執行修復步驟，確保每個步驟都成功完成後再進行下一步。

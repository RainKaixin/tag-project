-- 緊急修復 notifications 表約束問題
-- 解決點讚功能無法正常工作的問題

-- 1. 立即刪除所有可能導致問題的約束
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_unique_follow;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_unique_like;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_unique_sender_receiver_type;

-- 2. 清理可能的重複通知記錄
DELETE FROM notifications 
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY sender_id, receiver_id, type 
             ORDER BY created_at DESC
           ) as rn
    FROM notifications
    WHERE is_read = FALSE
  ) ranked
  WHERE rn > 1
);

-- 3. 創建一個更寬鬆的唯一約束
-- 只防止完全相同的通知（包括時間戳）
ALTER TABLE notifications 
ADD CONSTRAINT notifications_unique_complete 
UNIQUE (sender_id, receiver_id, type, created_at);

-- 4. 顯示修復結果
DO $$
DECLARE
  constraint_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO constraint_count
  FROM information_schema.table_constraints 
  WHERE table_name = 'notifications'
  AND table_schema = 'public'
  AND constraint_type = 'UNIQUE';
  
  RAISE NOTICE '🎯 緊急修復完成！';
  RAISE NOTICE '📊 notifications 表當前有 % 個唯一約束', constraint_count;
  RAISE NOTICE '✅ 點讚功能現在應該可以正常工作了';
  RAISE NOTICE '⚠️  注意：這是一個臨時修復，後續需要優化約束邏輯';
END $$;


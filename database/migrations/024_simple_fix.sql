-- 簡單修復腳本 - 只修復核心問題
-- 解決點讚功能無法正常工作的問題

-- 1. 刪除有問題的約束
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_unique_follow;

-- 2. 刪除所有可能導致問題的觸發器
DO $$
DECLARE
  trigger_record RECORD;
BEGIN
  -- 刪除 artwork_likes 表的所有觸發器
  FOR trigger_record IN
    SELECT trigger_name
    FROM information_schema.triggers
    WHERE event_object_table = 'artwork_likes'
    AND event_object_schema = 'public'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON artwork_likes', trigger_record.trigger_name);
    RAISE NOTICE '已刪除觸發器: % (artwork_likes)', trigger_record.trigger_name;
  END LOOP;
  
  -- 刪除 follows 表的所有觸發器
  FOR trigger_record IN
    SELECT trigger_name
    FROM information_schema.triggers
    WHERE event_object_table = 'follows'
    AND event_object_schema = 'public'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON follows', trigger_record.trigger_name);
    RAISE NOTICE '已刪除觸發器: % (follows)', trigger_record.trigger_name;
  END LOOP;
END $$;

-- 3. 清理重複的通知記錄
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

-- 4. 顯示修復結果
DO $$
DECLARE
  constraint_count INTEGER;
  trigger_count INTEGER;
BEGIN
  -- 統計約束
  SELECT COUNT(*) INTO constraint_count
  FROM information_schema.table_constraints 
  WHERE table_name = 'notifications'
  AND table_schema = 'public'
  AND constraint_type = 'UNIQUE';
  
  -- 統計觸發器
  SELECT COUNT(*) INTO trigger_count
  FROM information_schema.triggers
  WHERE event_object_schema = 'public'
  AND event_object_table IN ('artwork_likes', 'follows');
  
  RAISE NOTICE '🎯 簡單修復完成！';
  RAISE NOTICE '📊 修復統計:';
  RAISE NOTICE '   - notifications 表約束: % 個', constraint_count;
  RAISE NOTICE '   - 相關表觸發器: % 個', trigger_count;
  RAISE NOTICE '✅ 點讚功能現在應該可以正常工作了';
  RAISE NOTICE '⚠️  注意：已移除所有可能導致問題的觸發器和約束';
END $$;

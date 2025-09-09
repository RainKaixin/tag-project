-- 完整修復腳本 - 解決點讚功能問題
-- 一次性修復所有相關問題

-- ========================================
-- 第一部分：清理約束
-- ========================================

-- 1. 刪除所有可能有問題的約束
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_unique_follow;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_unique_like;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_unique_sender_receiver_type;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_unique_complete;

-- ========================================
-- 第二部分：清理觸發器
-- ========================================

-- 2. 刪除所有可能有問題的觸發器
DO $$
DECLARE
  trigger_record RECORD;
BEGIN
  -- 刪除 artwork_likes 表的觸發器
  FOR trigger_record IN
    SELECT trigger_name
    FROM information_schema.triggers
    WHERE event_object_table = 'artwork_likes'
    AND event_object_schema = 'public'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON artwork_likes', trigger_record.trigger_name);
    RAISE NOTICE '已刪除觸發器: % (artwork_likes)', trigger_record.trigger_name;
  END LOOP;
  
  -- 刪除 follows 表的觸發器
  FOR trigger_record IN
    SELECT trigger_name
    FROM information_schema.triggers
    WHERE event_object_table = 'follows'
    AND event_object_schema = 'public'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON follows', trigger_record.trigger_name);
    RAISE NOTICE '已刪除觸發器: % (follows)', trigger_record.trigger_name;
  END LOOP;
  
  -- 刪除 notifications 表的非 updated_at 觸發器
  FOR trigger_record IN
    SELECT trigger_name
    FROM information_schema.triggers
    WHERE event_object_table = 'notifications'
    AND event_object_schema = 'public'
    AND trigger_name NOT LIKE '%updated_at%'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON notifications', trigger_record.trigger_name);
    RAISE NOTICE '已刪除觸發器: % (notifications)', trigger_record.trigger_name;
  END LOOP;
END $$;

-- ========================================
-- 第三部分：清理重複數據
-- ========================================

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

-- ========================================
-- 第四部分：修復 RLS 策略
-- ========================================

-- 4. 重新創建 artwork_likes 表的 RLS 策略
DROP POLICY IF EXISTS "Users can insert their own likes" ON artwork_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON artwork_likes;
DROP POLICY IF EXISTS "Anyone can view likes" ON artwork_likes;

CREATE POLICY "Users can insert their own likes" ON artwork_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON artwork_likes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view likes" ON artwork_likes
  FOR SELECT USING (true);

-- 確保 RLS 已啟用
ALTER TABLE artwork_likes ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 第五部分：創建安全的約束
-- ========================================

-- 5. 創建一個安全的唯一約束（只防止完全重複）
ALTER TABLE notifications 
ADD CONSTRAINT notifications_unique_safe 
UNIQUE (sender_id, receiver_id, type, created_at);

-- ========================================
-- 第六部分：顯示修復結果
-- ========================================

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
  AND event_object_table IN ('artwork_likes', 'follows', 'notifications');
  
  RAISE NOTICE '🎯 完整修復完成！';
  RAISE NOTICE '📊 修復統計:';
  RAISE NOTICE '   - notifications 表約束: % 個', constraint_count;
  RAISE NOTICE '   - 相關表觸發器: % 個', trigger_count;
  RAISE NOTICE '✅ 點讚功能現在應該可以正常工作了';
  RAISE NOTICE '✅ 關注功能現在應該可以正常工作了';
  RAISE NOTICE '⚠️  注意：已移除所有可能導致問題的觸發器和約束';
  RAISE NOTICE '📝 後續可以重新實現通知功能，但需要更仔細的設計';
END $$;



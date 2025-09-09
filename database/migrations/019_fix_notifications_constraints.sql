-- 修復 notifications 表的約束問題
-- 解決 notifications_unique_follow 約束衝突

-- 1. 檢查並刪除錯誤的約束（如果存在）
DO $$
DECLARE
  constraint_exists BOOLEAN;
BEGIN
  -- 檢查 notifications_unique_follow 約束是否存在
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'notifications_unique_follow' 
    AND table_name = 'notifications'
    AND table_schema = 'public'
  ) INTO constraint_exists;
  
  IF constraint_exists THEN
    -- 刪除錯誤的約束
    ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_unique_follow;
    RAISE NOTICE '❌ 已刪除錯誤的約束: notifications_unique_follow';
  ELSE
    RAISE NOTICE '✅ 約束 notifications_unique_follow 不存在';
  END IF;
END $$;

-- 2. 檢查並刪除其他可能錯誤的約束
DO $$
DECLARE
  constraint_exists BOOLEAN;
BEGIN
  -- 檢查 notifications_unique_like 約束是否存在
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'notifications_unique_like' 
    AND table_name = 'notifications'
    AND table_schema = 'public'
  ) INTO constraint_exists;
  
  IF constraint_exists THEN
    -- 刪除錯誤的約束
    ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_unique_like;
    RAISE NOTICE '❌ 已刪除錯誤的約束: notifications_unique_like';
  ELSE
    RAISE NOTICE '✅ 約束 notifications_unique_like 不存在';
  END IF;
END $$;

-- 3. 創建正確的唯一約束（如果需要）
-- 防止重複的通知：同一發送者對同一接收者的同一類型通知只能有一條未讀記錄
DO $$
DECLARE
  constraint_exists BOOLEAN;
BEGIN
  -- 檢查正確的約束是否存在
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'notifications_unique_sender_receiver_type' 
    AND table_name = 'notifications'
    AND table_schema = 'public'
  ) INTO constraint_exists;
  
  IF NOT constraint_exists THEN
    -- 創建正確的唯一約束
    ALTER TABLE notifications 
    ADD CONSTRAINT notifications_unique_sender_receiver_type 
    UNIQUE (sender_id, receiver_id, type) 
    WHERE is_read = FALSE;
    
    RAISE NOTICE '✅ 已創建正確的約束: notifications_unique_sender_receiver_type';
  ELSE
    RAISE NOTICE '✅ 約束 notifications_unique_sender_receiver_type 已存在';
  END IF;
END $$;

-- 4. 清理可能的重複通知記錄
DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- 刪除重複的通知記錄（保留最新的）
  WITH ranked_notifications AS (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY sender_id, receiver_id, type 
             ORDER BY created_at DESC
           ) as rn
    FROM notifications
    WHERE is_read = FALSE
  )
  DELETE FROM notifications 
  WHERE id IN (
    SELECT id 
    FROM ranked_notifications 
    WHERE rn > 1
  );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  IF deleted_count > 0 THEN
    RAISE NOTICE '🧹 已清理 % 條重複的通知記錄', deleted_count;
  ELSE
    RAISE NOTICE '✅ 沒有發現重複的通知記錄';
  END IF;
END $$;

-- 5. 顯示當前約束狀態
DO $$
DECLARE
  constraint_record RECORD;
BEGIN
  RAISE NOTICE '📋 notifications 表的當前約束:';
  
  FOR constraint_record IN
    SELECT constraint_name, constraint_type
    FROM information_schema.table_constraints 
    WHERE table_name = 'notifications'
    AND table_schema = 'public'
    ORDER BY constraint_name
  LOOP
    RAISE NOTICE '   - %: %', constraint_record.constraint_name, constraint_record.constraint_type;
  END LOOP;
END $$;

-- 顯示完成信息
DO $$
BEGIN
  RAISE NOTICE '🎯 notifications 表約束修復完成！';
  RAISE NOTICE '📝 修復內容:';
  RAISE NOTICE '   1. 刪除錯誤的 notifications_unique_follow 約束';
  RAISE NOTICE '   2. 刪除錯誤的 notifications_unique_like 約束';
  RAISE NOTICE '   3. 創建正確的唯一約束（防止重複未讀通知）';
  RAISE NOTICE '   4. 清理重複的通知記錄';
  RAISE NOTICE '✅ 現在點讚和關注功能應該可以正常工作了';
END $$;




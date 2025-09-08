-- 診斷通知系統問題
-- 檢查約束、觸發器和數據

-- 1. 檢查 notifications 表的所有約束
DO $$
DECLARE
  constraint_record RECORD;
BEGIN
  RAISE NOTICE '🔍 檢查 notifications 表的約束...';
  
  FOR constraint_record IN
    SELECT 
      tc.constraint_name,
      tc.constraint_type,
      string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) as columns
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'notifications'
    AND tc.table_schema = 'public'
    ORDER BY tc.constraint_name
  LOOP
    RAISE NOTICE '約束: % (%) - 字段: %', 
      constraint_record.constraint_name, 
      constraint_record.constraint_type,
      constraint_record.columns;
  END LOOP;
END $$;

-- 2. 檢查所有相關表的觸發器
DO $$
DECLARE
  trigger_record RECORD;
BEGIN
  RAISE NOTICE '🔍 檢查相關表的觸發器...';
  
  FOR trigger_record IN
    SELECT 
      trigger_name,
      event_object_table,
      event_manipulation,
      action_statement
    FROM information_schema.triggers
    WHERE event_object_schema = 'public'
    AND event_object_table IN ('artwork_likes', 'follows', 'notifications')
    ORDER BY event_object_table, trigger_name
  LOOP
    RAISE NOTICE '觸發器: % (% 表, % 事件) - %', 
      trigger_record.trigger_name,
      trigger_record.event_object_table,
      trigger_record.event_manipulation,
      trigger_record.action_statement;
  END LOOP;
END $$;

-- 3. 檢查 notifications 表中的數據
DO $$
DECLARE
  notification_count INTEGER;
  like_count INTEGER;
  follow_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO notification_count FROM notifications;
  SELECT COUNT(*) INTO like_count FROM notifications WHERE type = 'like';
  SELECT COUNT(*) INTO follow_count FROM notifications WHERE type = 'follow';
  
  RAISE NOTICE '📊 notifications 表數據統計:';
  RAISE NOTICE '   總通知數: %', notification_count;
  RAISE NOTICE '   點讚通知: %', like_count;
  RAISE NOTICE '   關注通知: %', follow_count;
END $$;

-- 4. 檢查是否有重複的通知記錄
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT sender_id, receiver_id, type, COUNT(*) as cnt
    FROM notifications
    WHERE is_read = FALSE
    GROUP BY sender_id, receiver_id, type
    HAVING COUNT(*) > 1
  ) duplicates;
  
  IF duplicate_count > 0 THEN
    RAISE NOTICE '⚠️  發現 % 組重複的通知記錄', duplicate_count;
  ELSE
    RAISE NOTICE '✅ 沒有發現重複的通知記錄';
  END IF;
END $$;

-- 5. 顯示問題分析
DO $$
BEGIN
  RAISE NOTICE '🎯 問題分析:';
  RAISE NOTICE '   1. 點讚操作觸發了數據庫觸發器';
  RAISE NOTICE '   2. 觸發器試圖創建 like 類型的通知';
  RAISE NOTICE '   3. 但違反了 notifications_unique_follow 約束';
  RAISE NOTICE '   4. 這個約束可能設計有問題';
  RAISE NOTICE '';
  RAISE NOTICE '💡 建議修復方案:';
  RAISE NOTICE '   1. 刪除錯誤的約束';
  RAISE NOTICE '   2. 刪除有問題的觸發器';
  RAISE NOTICE '   3. 重新設計通知系統';
END $$;

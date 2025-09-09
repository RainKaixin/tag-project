-- 移除可能有問題的觸發器
-- 解決點讚時觸發通知創建導致的約束衝突

-- 1. 檢查並刪除 artwork_likes 表上的觸發器
DO $$
DECLARE
  trigger_record RECORD;
BEGIN
  RAISE NOTICE '🔍 檢查 artwork_likes 表的觸發器...';
  
  FOR trigger_record IN
    SELECT trigger_name, event_manipulation
    FROM information_schema.triggers
    WHERE event_object_table = 'artwork_likes'
    AND event_object_schema = 'public'
  LOOP
    RAISE NOTICE '發現觸發器: % (% 事件)', trigger_record.trigger_name, trigger_record.event_manipulation;
    
    -- 刪除觸發器
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON artwork_likes', trigger_record.trigger_name);
    RAISE NOTICE '已刪除觸發器: %', trigger_record.trigger_name;
  END LOOP;
  
  -- 如果沒有找到觸發器
  IF NOT FOUND THEN
    RAISE NOTICE '✅ artwork_likes 表沒有觸發器';
  END IF;
END $$;

-- 2. 檢查並刪除 follows 表上的觸發器
DO $$
DECLARE
  trigger_record RECORD;
BEGIN
  RAISE NOTICE '🔍 檢查 follows 表的觸發器...';
  
  FOR trigger_record IN
    SELECT trigger_name, event_manipulation
    FROM information_schema.triggers
    WHERE event_object_table = 'follows'
    AND event_object_schema = 'public'
  LOOP
    RAISE NOTICE '發現觸發器: % (% 事件)', trigger_record.trigger_name, trigger_record.event_manipulation;
    
    -- 刪除觸發器
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON follows', trigger_record.trigger_name);
    RAISE NOTICE '已刪除觸發器: %', trigger_record.trigger_name;
  END LOOP;
  
  -- 如果沒有找到觸發器
  IF NOT FOUND THEN
    RAISE NOTICE '✅ follows 表沒有觸發器';
  END IF;
END $$;

-- 3. 檢查並刪除 notifications 表上的觸發器
DO $$
DECLARE
  trigger_record RECORD;
BEGIN
  RAISE NOTICE '🔍 檢查 notifications 表的觸發器...';
  
  FOR trigger_record IN
    SELECT trigger_name, event_manipulation
    FROM information_schema.triggers
    WHERE event_object_table = 'notifications'
    AND event_object_schema = 'public'
  LOOP
    RAISE NOTICE '發現觸發器: % (% 事件)', trigger_record.trigger_name, trigger_record.event_manipulation;
    
    -- 只刪除可能導致問題的觸發器，保留 updated_at 觸發器
    IF trigger_record.trigger_name NOT LIKE '%updated_at%' THEN
      EXECUTE format('DROP TRIGGER IF EXISTS %I ON notifications', trigger_record.trigger_name);
      RAISE NOTICE '已刪除觸發器: %', trigger_record.trigger_name;
    ELSE
      RAISE NOTICE '保留觸發器: % (updated_at 觸發器)', trigger_record.trigger_name;
    END IF;
  END LOOP;
  
  -- 如果沒有找到觸發器
  IF NOT FOUND THEN
    RAISE NOTICE '✅ notifications 表沒有觸發器';
  END IF;
END $$;

-- 4. 顯示修復結果
DO $$
DECLARE
  total_triggers INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_triggers
  FROM information_schema.triggers
  WHERE event_object_schema = 'public'
  AND event_object_table IN ('artwork_likes', 'follows', 'notifications');
  
  RAISE NOTICE '🎯 觸發器清理完成！';
  RAISE NOTICE '📊 相關表當前有 % 個觸發器', total_triggers;
  RAISE NOTICE '✅ 點讚功能現在應該可以正常工作了';
  RAISE NOTICE '⚠️  注意：已移除所有可能導致約束衝突的觸發器';
END $$;




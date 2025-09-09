-- 033_enable_all_notification_triggers.sql
-- 启用所有通知相关的触发器

-- 1. 启用follow通知触发器
ALTER TABLE follows ENABLE TRIGGER ALL;

-- 2. 启用like通知触发器  
ALTER TABLE artwork_likes ENABLE TRIGGER ALL;

-- 3. 启用notifications表的触发器
ALTER TABLE notifications ENABLE TRIGGER ALL;

-- 4. 验证所有触发器状态
DO $$
DECLARE
  rec RECORD;
  disabled_count INT := 0;
BEGIN
  RAISE NOTICE '=== 触发器状态检查 ===';
  
  FOR rec IN 
    SELECT 
      tgname as trigger_name,
      tgrelid::regclass as table_name,
      CASE tgenabled 
        WHEN 'O' THEN 'ENABLED'
        WHEN 'D' THEN 'DISABLED'
        WHEN 'R' THEN 'REPLICA'
        WHEN 'A' THEN 'ALWAYS'
      END as status
    FROM pg_trigger 
    WHERE tgname LIKE '%notif%' 
       OR tgname LIKE '%follow%' 
       OR tgname LIKE '%like%'
  LOOP
    RAISE NOTICE '✓ % on % - Status: %', 
      rec.trigger_name, rec.table_name, rec.status;
    
    IF rec.status = 'DISABLED' THEN
      disabled_count := disabled_count + 1;
    END IF;
  END LOOP;
  
  IF disabled_count > 0 THEN
    RAISE EXCEPTION '❌ 还有 % 个触发器处于禁用状态', disabled_count;
  ELSE
    RAISE NOTICE '✅ 所有通知触发器已成功启用！';
  END IF;
END $$;

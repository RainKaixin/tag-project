-- 修復 RLS 策略以支持 Mock 用戶系統
-- 解決 Like 和 Follow 功能的 42501 錯誤

-- 刪除現有的 artwork_likes 表策略
DROP POLICY IF EXISTS "Users can insert their own likes" ON artwork_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON artwork_likes;
DROP POLICY IF EXISTS "Anyone can view likes" ON artwork_likes;

-- 重新創建 artwork_likes 表的 RLS 策略
-- 允許任何人插入點讚（支持 Mock 用戶）
CREATE POLICY "Anyone can insert likes" ON artwork_likes
  FOR INSERT WITH CHECK (true);

-- 允許任何人刪除點讚（支持 Mock 用戶）
CREATE POLICY "Anyone can delete likes" ON artwork_likes
  FOR DELETE USING (true);

-- 允許任何人查詢點讚數據
CREATE POLICY "Anyone can view likes" ON artwork_likes
  FOR SELECT USING (true);

-- 刪除現有的 follows 表策略
DROP POLICY IF EXISTS "Users can insert their own follows" ON follows;
DROP POLICY IF EXISTS "Users can delete their own follows" ON follows;
DROP POLICY IF EXISTS "Anyone can view follows" ON follows;

-- 重新創建 follows 表的 RLS 策略
-- 允許任何人插入關注（支持 Mock 用戶）
CREATE POLICY "Anyone can insert follows" ON follows
  FOR INSERT WITH CHECK (true);

-- 允許任何人刪除關注（支持 Mock 用戶）
CREATE POLICY "Anyone can delete follows" ON follows
  FOR DELETE USING (true);

-- 允許任何人查詢關注數據
CREATE POLICY "Anyone can view follows" ON follows
  FOR SELECT USING (true);

-- 確保 RLS 已啟用
ALTER TABLE artwork_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- 添加註釋
COMMENT ON POLICY "Anyone can insert likes" ON artwork_likes IS '允許任何人插入點讚記錄，支持 Mock 用戶系統';
COMMENT ON POLICY "Anyone can delete likes" ON artwork_likes IS '允許任何人刪除點讚記錄，支持 Mock 用戶系統';
COMMENT ON POLICY "Anyone can view likes" ON artwork_likes IS '允許任何人查看點讚數據';

COMMENT ON POLICY "Anyone can insert follows" ON follows IS '允許任何人插入關注記錄，支持 Mock 用戶系統';
COMMENT ON POLICY "Anyone can delete follows" ON follows IS '允許任何人刪除關注記錄，支持 Mock 用戶系統';
COMMENT ON POLICY "Anyone can view follows" ON follows IS '允許任何人查看關注數據';

-- 顯示完成信息
DO $$
BEGIN
  RAISE NOTICE '✅ RLS 策略已修復以支持 Mock 用戶系統';
  RAISE NOTICE '📋 artwork_likes 表策略:';
  RAISE NOTICE '   1. Anyone can insert likes - 插入點讚';
  RAISE NOTICE '   2. Anyone can delete likes - 刪除點讚';
  RAISE NOTICE '   3. Anyone can view likes - 查看點讚';
  RAISE NOTICE '📋 follows 表策略:';
  RAISE NOTICE '   1. Anyone can insert follows - 插入關注';
  RAISE NOTICE '   2. Anyone can delete follows - 刪除關注';
  RAISE NOTICE '   3. Anyone can view follows - 查看關注';
  RAISE NOTICE '🎯 現在 Mock 用戶應該可以正常使用 Like 和 Follow 功能了';
END $$;

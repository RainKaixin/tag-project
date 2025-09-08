-- 修復 artwork_likes 表的 RLS 策略
-- 解決 406 (Not Acceptable) 錯誤

-- 刪除現有的策略（如果存在）
DROP POLICY IF EXISTS "Users can insert their own likes" ON artwork_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON artwork_likes;
DROP POLICY IF EXISTS "Anyone can view likes" ON artwork_likes;

-- 重新創建 RLS 策略

-- 允許認證用戶插入自己的點讚
CREATE POLICY "Users can insert their own likes" ON artwork_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 允許認證用戶刪除自己的點讚
CREATE POLICY "Users can delete their own likes" ON artwork_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 允許任何人查詢點讚數據（用於顯示點讚數）
CREATE POLICY "Anyone can view likes" ON artwork_likes
  FOR SELECT USING (true);

-- 確保 RLS 已啟用
ALTER TABLE artwork_likes ENABLE ROW LEVEL SECURITY;

-- 添加註釋
COMMENT ON POLICY "Users can insert their own likes" ON artwork_likes IS '允許認證用戶插入自己的點讚記錄';
COMMENT ON POLICY "Users can delete their own likes" ON artwork_likes IS '允許認證用戶刪除自己的點讚記錄';
COMMENT ON POLICY "Anyone can view likes" ON artwork_likes IS '允許任何人查看點讚數據，用於顯示點讚數';

-- 顯示完成信息
DO $$
BEGIN
  RAISE NOTICE '✅ artwork_likes 表的 RLS 策略已修復';
  RAISE NOTICE '📋 策略列表:';
  RAISE NOTICE '   1. Users can insert their own likes - 插入點讚';
  RAISE NOTICE '   2. Users can delete their own likes - 刪除點讚';
  RAISE NOTICE '   3. Anyone can view likes - 查看點讚';
  RAISE NOTICE '🎯 現在應該可以正常查詢和操作點讚數據了';
END $$;

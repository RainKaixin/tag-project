-- 修復 follows 表的 RLS 策略問題
-- 解決 getFollowers 查詢返回 0 的問題

-- 刪除現有的限制性策略
DROP POLICY IF EXISTS "Users can view their own follows" ON follows;

-- 創建新的策略，允許查看關注者數量
-- 策略1: 允許認證用戶查看自己的關注記錄
CREATE POLICY "Users can view their own follows" ON follows
  FOR SELECT USING (auth.uid() = follower_id);

-- 策略2: 允許任何人查看關注者數量（用於顯示關注者統計）
CREATE POLICY "Anyone can view follower counts" ON follows
  FOR SELECT USING (true);

-- 確保 RLS 已啟用
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- 添加註釋
COMMENT ON POLICY "Users can view their own follows" ON follows IS '允許認證用戶查看自己的關注記錄';
COMMENT ON POLICY "Anyone can view follower counts" ON follows IS '允許任何人查看關注者數量，用於顯示統計信息';

-- 顯示完成信息
DO $$
BEGIN
  RAISE NOTICE '✅ follows 表的 RLS 策略已修復';
  RAISE NOTICE '📋 新策略列表:';
  RAISE NOTICE '   1. Users can view their own follows - 查看自己的關注記錄';
  RAISE NOTICE '   2. Anyone can view follower counts - 查看關注者數量';
  RAISE NOTICE '🎯 現在應該可以正常查詢關注者數量了';
END $$;

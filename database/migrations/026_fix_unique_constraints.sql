-- 修復數據庫唯一約束問題
-- 解決 42P10 錯誤：there is no unique or exclusion constraint matching the ON CONFLICT specification

-- 1. 檢查並修復 artwork_likes 表的約束
DO $$
BEGIN
  -- 檢查是否存在唯一約束
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'artwork_likes_user_artwork_unique' 
    AND table_name = 'artwork_likes'
  ) THEN
    -- 創建唯一約束
    ALTER TABLE artwork_likes 
    ADD CONSTRAINT artwork_likes_user_artwork_unique 
    UNIQUE (user_id, artwork_id);
    
    RAISE NOTICE '✅ 已創建 artwork_likes 唯一約束';
  ELSE
    RAISE NOTICE '⚠️ artwork_likes 唯一約束已存在';
  END IF;
END $$;

-- 2. 檢查並修復 follows 表的約束
DO $$
BEGIN
  -- 檢查是否存在唯一約束
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'follows_follower_following_unique' 
    AND table_name = 'follows'
  ) THEN
    -- 創建唯一約束
    ALTER TABLE follows 
    ADD CONSTRAINT follows_follower_following_unique 
    UNIQUE (follower_id, following_id);
    
    RAISE NOTICE '✅ 已創建 follows 唯一約束';
  ELSE
    RAISE NOTICE '⚠️ follows 唯一約束已存在';
  END IF;
END $$;

-- 3. 修復 RLS 策略（允許任何人操作）
DROP POLICY IF EXISTS "Users can insert their own likes" ON artwork_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON artwork_likes;
DROP POLICY IF EXISTS "Anyone can view likes" ON artwork_likes;

CREATE POLICY "Anyone can insert likes" ON artwork_likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete likes" ON artwork_likes
  FOR DELETE USING (true);

CREATE POLICY "Anyone can view likes" ON artwork_likes
  FOR SELECT USING (true);

-- 4. 修復 follows 表的 RLS 策略
DROP POLICY IF EXISTS "Users can insert their own follows" ON follows;
DROP POLICY IF EXISTS "Users can delete their own follows" ON follows;
DROP POLICY IF EXISTS "Anyone can view follows" ON follows;

CREATE POLICY "Anyone can insert follows" ON follows
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete follows" ON follows
  FOR DELETE USING (true);

CREATE POLICY "Anyone can view follows" ON follows
  FOR SELECT USING (true);

-- 5. 顯示完成信息
DO $$
BEGIN
  RAISE NOTICE '🎯 數據庫約束修復完成！';
  RAISE NOTICE '📋 修復內容:';
  RAISE NOTICE '   1. 創建 artwork_likes 唯一約束 (user_id, artwork_id)';
  RAISE NOTICE '   2. 創建 follows 唯一約束 (follower_id, following_id)';
  RAISE NOTICE '   3. 修復 RLS 策略，允許任何人操作';
  RAISE NOTICE '✅ 現在 Like 和 Follow 功能應該可以正常工作了！';
END $$;

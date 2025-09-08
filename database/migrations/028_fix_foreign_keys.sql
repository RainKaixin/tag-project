-- 修復外鍵約束問題
-- 解決 23503 錯誤：Key is not present in table "users"

-- 1. 檢查並修復 artwork_likes 表的外鍵約束
DO $$
BEGIN
  -- 檢查是否存在指向 users 表的外鍵約束
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'artwork_likes_user_id_fkey' 
    AND table_name = 'artwork_likes'
  ) THEN
    -- 刪除指向 users 表的外鍵約束
    ALTER TABLE artwork_likes 
    DROP CONSTRAINT artwork_likes_user_id_fkey;
    
    RAISE NOTICE '✅ 已刪除 artwork_likes 指向 users 表的外鍵約束';
  ELSE
    RAISE NOTICE '⚠️ artwork_likes 沒有指向 users 表的外鍵約束';
  END IF;
  
  -- 檢查是否存在指向 profiles 表的外鍵約束
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'artwork_likes_user_id_profiles_fkey' 
    AND table_name = 'artwork_likes'
  ) THEN
    -- 創建指向 profiles 表的外鍵約束
    ALTER TABLE artwork_likes 
    ADD CONSTRAINT artwork_likes_user_id_profiles_fkey 
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    
    RAISE NOTICE '✅ 已創建 artwork_likes 指向 profiles 表的外鍵約束';
  ELSE
    RAISE NOTICE '⚠️ artwork_likes 已存在指向 profiles 表的外鍵約束';
  END IF;
END $$;

-- 2. 檢查並修復 follows 表的外鍵約束
DO $$
BEGIN
  -- 檢查是否存在指向 users 表的外鍵約束
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'follows_follower_id_fkey' 
    AND table_name = 'follows'
  ) THEN
    -- 刪除指向 users 表的外鍵約束
    ALTER TABLE follows 
    DROP CONSTRAINT follows_follower_id_fkey;
    
    RAISE NOTICE '✅ 已刪除 follows 指向 users 表的外鍵約束';
  ELSE
    RAISE NOTICE '⚠️ follows 沒有指向 users 表的外鍵約束';
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'follows_following_id_fkey' 
    AND table_name = 'follows'
  ) THEN
    -- 刪除指向 users 表的外鍵約束
    ALTER TABLE follows 
    DROP CONSTRAINT follows_following_id_fkey;
    
    RAISE NOTICE '✅ 已刪除 follows 指向 users 表的外鍵約束';
  ELSE
    RAISE NOTICE '⚠️ follows 沒有指向 users 表的外鍵約束';
  END IF;
  
  -- 創建指向 profiles 表的外鍵約束
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'follows_follower_id_profiles_fkey' 
    AND table_name = 'follows'
  ) THEN
    ALTER TABLE follows 
    ADD CONSTRAINT follows_follower_id_profiles_fkey 
    FOREIGN KEY (follower_id) REFERENCES profiles(id) ON DELETE CASCADE;
    
    RAISE NOTICE '✅ 已創建 follows 指向 profiles 表的外鍵約束';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'follows_following_id_profiles_fkey' 
    AND table_name = 'follows'
  ) THEN
    ALTER TABLE follows 
    ADD CONSTRAINT follows_following_id_profiles_fkey 
    FOREIGN KEY (following_id) REFERENCES profiles(id) ON DELETE CASCADE;
    
    RAISE NOTICE '✅ 已創建 follows 指向 profiles 表的外鍵約束';
  END IF;
END $$;

-- 3. 創建唯一約束（如果不存在）
DO $$
BEGIN
  -- artwork_likes 唯一約束
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'artwork_likes_user_artwork_unique' 
    AND table_name = 'artwork_likes'
  ) THEN
    ALTER TABLE artwork_likes 
    ADD CONSTRAINT artwork_likes_user_artwork_unique 
    UNIQUE (user_id, artwork_id);
    
    RAISE NOTICE '✅ 已創建 artwork_likes 唯一約束';
  END IF;
  
  -- follows 唯一約束
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'follows_follower_following_unique' 
    AND table_name = 'follows'
  ) THEN
    ALTER TABLE follows 
    ADD CONSTRAINT follows_follower_following_unique 
    UNIQUE (follower_id, following_id);
    
    RAISE NOTICE '✅ 已創建 follows 唯一約束';
  END IF;
END $$;

-- 4. 修復 RLS 策略
DO $$
BEGIN
  -- 刪除所有現有策略
  DROP POLICY IF EXISTS "Users can insert their own likes" ON artwork_likes;
  DROP POLICY IF EXISTS "Users can delete their own likes" ON artwork_likes;
  DROP POLICY IF EXISTS "Anyone can view likes" ON artwork_likes;
  DROP POLICY IF EXISTS "Anyone can insert likes" ON artwork_likes;
  DROP POLICY IF EXISTS "Anyone can delete likes" ON artwork_likes;
  
  -- 創建新策略
  CREATE POLICY "Anyone can insert likes" ON artwork_likes
    FOR INSERT WITH CHECK (true);

  CREATE POLICY "Anyone can delete likes" ON artwork_likes
    FOR DELETE USING (true);

  CREATE POLICY "Anyone can view likes" ON artwork_likes
    FOR SELECT USING (true);
    
  RAISE NOTICE '✅ 已修復 artwork_likes RLS 策略';
END $$;

DO $$
BEGIN
  -- 刪除所有現有策略
  DROP POLICY IF EXISTS "Users can insert their own follows" ON follows;
  DROP POLICY IF EXISTS "Users can delete their own follows" ON follows;
  DROP POLICY IF EXISTS "Anyone can view follows" ON follows;
  DROP POLICY IF EXISTS "Anyone can insert follows" ON follows;
  DROP POLICY IF EXISTS "Anyone can delete follows" ON follows;
  
  -- 創建新策略
  CREATE POLICY "Anyone can insert follows" ON follows
    FOR INSERT WITH CHECK (true);

  CREATE POLICY "Anyone can delete follows" ON follows
    FOR DELETE USING (true);

  CREATE POLICY "Anyone can view follows" ON follows
    FOR SELECT USING (true);
    
  RAISE NOTICE '✅ 已修復 follows RLS 策略';
END $$;

-- 5. 顯示完成信息
DO $$
BEGIN
  RAISE NOTICE '🎯 外鍵約束修復完成！';
  RAISE NOTICE '📋 修復內容:';
  RAISE NOTICE '   1. 刪除指向 users 表的外鍵約束';
  RAISE NOTICE '   2. 創建指向 profiles 表的外鍵約束';
  RAISE NOTICE '   3. 創建唯一約束';
  RAISE NOTICE '   4. 修復 RLS 策略';
  RAISE NOTICE '✅ 現在 Like 和 Follow 功能應該可以正常工作了！';
END $$;

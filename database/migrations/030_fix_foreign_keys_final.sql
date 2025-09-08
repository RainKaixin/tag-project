-- 修复外键约束 - 最终版本
-- 确保 artwork_likes 和 follows 表的外键指向正确的表

-- 1. 删除现有的错误外键约束
DO $$ 
BEGIN
    -- 删除 artwork_likes 表的外键约束
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'artwork_likes_artwork_fk' 
        AND table_name = 'artwork_likes'
    ) THEN
        ALTER TABLE artwork_likes DROP CONSTRAINT artwork_likes_artwork_fk;
        RAISE NOTICE 'Deleted artwork_likes_artwork_fk constraint';
    END IF;

    -- 删除 artwork_likes 表的用户外键约束
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'artwork_likes_user_id_fkey' 
        AND table_name = 'artwork_likes'
    ) THEN
        ALTER TABLE artwork_likes DROP CONSTRAINT artwork_likes_user_id_fkey;
        RAISE NOTICE 'Deleted artwork_likes_user_id_fkey constraint';
    END IF;

    -- 删除 follows 表的外键约束
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'follows_follower_id_fkey' 
        AND table_name = 'follows'
    ) THEN
        ALTER TABLE follows DROP CONSTRAINT follows_follower_id_fkey;
        RAISE NOTICE 'Deleted follows_follower_id_fkey constraint';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'follows_following_id_fkey' 
        AND table_name = 'follows'
    ) THEN
        ALTER TABLE follows DROP CONSTRAINT follows_following_id_fkey;
        RAISE NOTICE 'Deleted follows_following_id_fkey constraint';
    END IF;
END $$;

-- 2. 创建正确的外键约束
-- artwork_likes 表外键指向 portfolio 表
ALTER TABLE artwork_likes 
ADD CONSTRAINT artwork_likes_artwork_fk 
FOREIGN KEY (artwork_id) REFERENCES portfolio(id) ON DELETE CASCADE;

-- artwork_likes 表用户外键指向 profiles 表
ALTER TABLE artwork_likes 
ADD CONSTRAINT artwork_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- follows 表外键指向 profiles 表
ALTER TABLE follows 
ADD CONSTRAINT follows_follower_id_fkey 
FOREIGN KEY (follower_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE follows 
ADD CONSTRAINT follows_following_id_fkey 
FOREIGN KEY (following_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 3. 创建唯一约束（如果不存在）
DO $$ 
BEGIN
    -- artwork_likes 唯一约束
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'artwork_likes_unique' 
        AND table_name = 'artwork_likes'
    ) THEN
        ALTER TABLE artwork_likes 
        ADD CONSTRAINT artwork_likes_unique 
        UNIQUE (artwork_id, user_id);
        RAISE NOTICE 'Created artwork_likes_unique constraint';
    END IF;

    -- follows 唯一约束
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'follows_unique' 
        AND table_name = 'follows'
    ) THEN
        ALTER TABLE follows 
        ADD CONSTRAINT follows_unique 
        UNIQUE (follower_id, following_id);
        RAISE NOTICE 'Created follows_unique constraint';
    END IF;
END $$;

-- 4. 更新 RLS 策略
-- 删除现有的 RLS 策略
DROP POLICY IF EXISTS "Anyone can insert likes" ON artwork_likes;
DROP POLICY IF EXISTS "Anyone can insert follows" ON follows;
DROP POLICY IF EXISTS "Users can view their own likes" ON artwork_likes;
DROP POLICY IF EXISTS "Users can view their own follows" ON follows;

-- 创建新的 RLS 策略
-- artwork_likes 表策略
CREATE POLICY "Users can insert their own likes" ON artwork_likes
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own likes" ON artwork_likes
    FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view all likes" ON artwork_likes
    FOR SELECT USING (true);

-- follows 表策略
CREATE POLICY "Users can insert their own follows" ON follows
    FOR INSERT WITH CHECK (auth.uid()::text = follower_id);

CREATE POLICY "Users can delete their own follows" ON follows
    FOR DELETE USING (auth.uid()::text = follower_id);

CREATE POLICY "Users can view all follows" ON follows
    FOR SELECT USING (true);

-- 5. 确保 RLS 已启用
ALTER TABLE artwork_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- 6. 验证修复结果
DO $$ 
BEGIN
    RAISE NOTICE 'Foreign key constraints have been fixed:';
    RAISE NOTICE '- artwork_likes.artwork_id -> portfolio.id';
    RAISE NOTICE '- artwork_likes.user_id -> profiles.id';
    RAISE NOTICE '- follows.follower_id -> profiles.id';
    RAISE NOTICE '- follows.following_id -> profiles.id';
    RAISE NOTICE 'RLS policies have been updated';
END $$;

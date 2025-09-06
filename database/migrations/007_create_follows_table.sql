-- 创建 follows 表用于关注功能
CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 确保每个用户只能关注另一个用户一次
  UNIQUE(follower_id, following_id),
  
  -- 不能关注自己
  CONSTRAINT check_no_self_follow CHECK (follower_id != following_id)
);

-- 启用 RLS
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略

-- 允许认证用户插入自己的关注记录
CREATE POLICY "Users can insert their own follows" ON follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

-- 允许认证用户删除自己的关注记录
CREATE POLICY "Users can delete their own follows" ON follows
  FOR DELETE USING (auth.uid() = follower_id);

-- 允许认证用户查看自己的关注记录
CREATE POLICY "Users can view their own follows" ON follows
  FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = following_id);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_follows_created_at ON follows(created_at);

-- 创建复合索引用于快速查询
CREATE INDEX IF NOT EXISTS idx_follows_follower_following ON follows(follower_id, following_id);



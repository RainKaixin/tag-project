-- 创建 artwork_likes 表
CREATE TABLE IF NOT EXISTS artwork_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artwork_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 确保每个用户只能对每个作品点赞一次
  UNIQUE(artwork_id, user_id)
);

-- 启用 RLS
ALTER TABLE artwork_likes ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略

-- 允许认证用户插入自己的点赞
CREATE POLICY "Users can insert their own likes" ON artwork_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 允许认证用户删除自己的点赞
CREATE POLICY "Users can delete their own likes" ON artwork_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 允许任何人查询点赞数据（用于显示点赞数）
CREATE POLICY "Anyone can view likes" ON artwork_likes
  FOR SELECT USING (true);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_artwork_likes_artwork_id ON artwork_likes(artwork_id);
CREATE INDEX IF NOT EXISTS idx_artwork_likes_user_id ON artwork_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_artwork_likes_created_at ON artwork_likes(created_at);

-- 创建复合索引用于快速查询特定用户对特定作品的点赞状态
CREATE INDEX IF NOT EXISTS idx_artwork_likes_artwork_user ON artwork_likes(artwork_id, user_id);






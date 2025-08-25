-- 创建 portfolio 表
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[],
  image_paths TEXT[],
  thumbnail_path TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略

-- 允许认证用户插入自己的作品
CREATE POLICY "Users can insert their own portfolio items" ON portfolio
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 允许认证用户更新自己的作品
CREATE POLICY "Users can update their own portfolio items" ON portfolio
  FOR UPDATE USING (auth.uid() = user_id);

-- 允许认证用户删除自己的作品
CREATE POLICY "Users can delete their own portfolio items" ON portfolio
  FOR DELETE USING (auth.uid() = user_id);

-- 允许任何人查询公开的作品
CREATE POLICY "Anyone can view public portfolio items" ON portfolio
  FOR SELECT USING (is_public = true);

-- 允许认证用户查看自己的所有作品（包括私有的）
CREATE POLICY "Users can view their own portfolio items" ON portfolio
  FOR SELECT USING (auth.uid() = user_id);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_portfolio_user_id ON portfolio(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_is_public ON portfolio(is_public);
CREATE INDEX IF NOT EXISTS idx_portfolio_created_at ON portfolio(created_at);

-- 创建 updated_at 触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolio_updated_at 
    BEFORE UPDATE ON portfolio 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

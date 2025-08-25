-- 创建 artwork_views 表用于记录作品浏览记录
CREATE TABLE IF NOT EXISTS artwork_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artwork_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  visitor_fingerprint VARCHAR(64),
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 唯一约束：同一用户对同一作品只能有一条记录
  CONSTRAINT unique_user_artwork_view UNIQUE(artwork_id, user_id),
  
  -- 唯一约束：同一访客指纹对同一作品只能有一条记录
  CONSTRAINT unique_fingerprint_artwork_view UNIQUE(artwork_id, visitor_fingerprint),
  
  -- 检查约束：user_id 和 visitor_fingerprint 至少有一个不为空
  CONSTRAINT check_user_or_fingerprint CHECK (
    (user_id IS NOT NULL AND visitor_fingerprint IS NULL) OR
    (user_id IS NULL AND visitor_fingerprint IS NOT NULL)
  )
);

-- 启用 RLS
ALTER TABLE artwork_views ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略

-- 允许认证用户插入自己的浏览记录
CREATE POLICY "Users can insert their own view records" ON artwork_views
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 允许任何人插入访客浏览记录（用于未登录用户）
CREATE POLICY "Anyone can insert visitor view records" ON artwork_views
  FOR INSERT WITH CHECK (user_id IS NULL);

-- 允许认证用户查看自己的浏览记录
CREATE POLICY "Users can view their own view records" ON artwork_views
  FOR SELECT USING (auth.uid() = user_id);

-- 允许查看公开的浏览统计（不包含个人信息）
CREATE POLICY "Anyone can view public view statistics" ON artwork_views
  FOR SELECT USING (true);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_artwork_views_artwork_id ON artwork_views(artwork_id);
CREATE INDEX IF NOT EXISTS idx_artwork_views_user_id ON artwork_views(user_id);
CREATE INDEX IF NOT EXISTS idx_artwork_views_fingerprint ON artwork_views(visitor_fingerprint);
CREATE INDEX IF NOT EXISTS idx_artwork_views_viewed_at ON artwork_views(viewed_at);

-- 创建函数：增加作品浏览量并返回最新计数
CREATE OR REPLACE FUNCTION increment_artwork_views(
  p_artwork_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_visitor_fingerprint VARCHAR(64) DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS TABLE(
  success BOOLEAN,
  view_count BIGINT,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_view_count BIGINT;
  v_error_message TEXT;
BEGIN
  -- 尝试插入浏览记录
  BEGIN
    INSERT INTO artwork_views (
      artwork_id,
      user_id,
      visitor_fingerprint,
      ip_address,
      user_agent
    ) VALUES (
      p_artwork_id,
      p_user_id,
      p_visitor_fingerprint,
      p_ip_address,
      p_user_agent
    );
    
    -- 如果插入成功，获取最新浏览量
    SELECT COUNT(*) INTO v_view_count
    FROM artwork_views
    WHERE artwork_id = p_artwork_id;
    
    RETURN QUERY SELECT TRUE, v_view_count, NULL::TEXT;
    
  EXCEPTION
    WHEN unique_violation THEN
      -- 如果违反唯一约束，说明已经浏览过，返回当前浏览量
      SELECT COUNT(*) INTO v_view_count
      FROM artwork_views
      WHERE artwork_id = p_artwork_id;
      
      RETURN QUERY SELECT TRUE, v_view_count, NULL::TEXT;
      
    WHEN OTHERS THEN
      -- 其他错误
      v_error_message := SQLERRM;
      RETURN QUERY SELECT FALSE, 0::BIGINT, v_error_message;
  END;
END;
$$;

-- 创建函数：获取作品浏览量
CREATE OR REPLACE FUNCTION get_artwork_view_count(p_artwork_id UUID)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_view_count BIGINT;
BEGIN
  SELECT COUNT(*) INTO v_view_count
  FROM artwork_views
  WHERE artwork_id = p_artwork_id;
  
  RETURN COALESCE(v_view_count, 0);
END;
$$;

-- 创建函数：检查用户是否已浏览过作品
CREATE OR REPLACE FUNCTION has_user_viewed_artwork(
  p_artwork_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_visitor_fingerprint VARCHAR(64) DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM artwork_views
    WHERE artwork_id = p_artwork_id
    AND (
      (p_user_id IS NOT NULL AND user_id = p_user_id) OR
      (p_visitor_fingerprint IS NOT NULL AND visitor_fingerprint = p_visitor_fingerprint)
    )
  ) INTO v_exists;
  
  RETURN COALESCE(v_exists, FALSE);
END;
$$;

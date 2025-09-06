-- 添加標籤相關的數據庫索引優化
-- 用於提升標籤聚合查詢的性能

-- 為portfolio表的tags數組字段添加GIN索引
-- GIN索引特別適合數組查詢，包括contains操作
CREATE INDEX IF NOT EXISTS idx_portfolio_tags_gin ON portfolio USING GIN (tags);

-- 為portfolio表的tags數組字段添加B-tree索引（用於精確匹配）
CREATE INDEX IF NOT EXISTS idx_portfolio_tags_btree ON portfolio USING BTREE (tags);

-- 為portfolio表的is_public和created_at組合添加複合索引
-- 用於標籤聚合查詢時的公開作品排序
CREATE INDEX IF NOT EXISTS idx_portfolio_public_created ON portfolio (is_public, created_at DESC) WHERE is_public = true;

-- 為portfolio表的is_public和tags組合添加複合索引
-- 用於公開作品的標籤查詢
CREATE INDEX IF NOT EXISTS idx_portfolio_public_tags ON portfolio (is_public, tags) WHERE is_public = true;

-- 添加註釋說明索引用途
COMMENT ON INDEX idx_portfolio_tags_gin IS 'GIN索引用於portfolio表的tags數組查詢，支持contains操作';
COMMENT ON INDEX idx_portfolio_tags_btree IS 'B-tree索引用於portfolio表的tags數組精確匹配查詢';
COMMENT ON INDEX idx_portfolio_public_created IS '複合索引用於公開作品按創建時間排序查詢';
COMMENT ON INDEX idx_portfolio_public_tags IS '複合索引用於公開作品的標籤查詢優化';

-- 創建函數：獲取標籤統計信息
CREATE OR REPLACE FUNCTION get_tag_stats(p_tag_slug TEXT)
RETURNS TABLE(
  works_count BIGINT,
  users_count BIGINT,
  projects_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as works_count,
    COUNT(DISTINCT user_id) as users_count,
    0::BIGINT as projects_count
  FROM portfolio 
  WHERE is_public = true 
    AND tags @> ARRAY[p_tag_slug];
END;
$$;

-- 創建函數：根據標籤獲取作品列表（支持分頁）
CREATE OR REPLACE FUNCTION get_works_by_tag(
  p_tag_slug TEXT,
  p_limit INTEGER DEFAULT 12,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  title TEXT,
  description TEXT,
  tags TEXT[],
  thumbnail_path TEXT,
  image_paths TEXT[],
  created_at TIMESTAMP WITH TIME ZONE,
  user_id UUID,
  author_name TEXT,
  author_avatar TEXT,
  author_role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.tags,
    p.thumbnail_path,
    p.image_paths,
    p.created_at,
    p.user_id,
    COALESCE(prof.full_name, 'Unknown Artist') as author_name,
    prof.avatar_url as author_avatar,
    prof.role as author_role
  FROM portfolio p
  LEFT JOIN profiles prof ON p.user_id = prof.id
  WHERE p.is_public = true 
    AND p.tags @> ARRAY[p_tag_slug]
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- 創建函數：獲取熱門標籤
CREATE OR REPLACE FUNCTION get_popular_tags(p_limit INTEGER DEFAULT 20)
RETURNS TABLE(
  tag_name TEXT,
  tag_slug TEXT,
  usage_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tag_element as tag_name,
    lower(replace(tag_element, ' ', '-')) as tag_slug,
    COUNT(*) as usage_count
  FROM portfolio,
       unnest(tags) as tag_element
  WHERE is_public = true
    AND tag_element IS NOT NULL
    AND tag_element != ''
  GROUP BY tag_element
  ORDER BY usage_count DESC
  LIMIT p_limit;
END;
$$;

-- 添加函數註釋
COMMENT ON FUNCTION get_tag_stats(TEXT) IS '獲取指定標籤的統計信息，包括作品數量、用戶數量等';
COMMENT ON FUNCTION get_works_by_tag(TEXT, INTEGER, INTEGER) IS '根據標籤獲取作品列表，支持分頁查詢';
COMMENT ON FUNCTION get_popular_tags(INTEGER) IS '獲取熱門標籤列表，按使用頻率排序';

-- 創建RLS策略確保函數安全
-- 這些函數只查詢公開數據，不需要額外的RLS策略

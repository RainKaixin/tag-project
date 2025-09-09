-- 创建包含艺术家信息的作品视图
-- 用于 Gallery 页面显示，解决 "Unknown Artist" 问题

CREATE OR REPLACE VIEW portfolio_with_artist AS
SELECT 
    p.id,
    p.user_id,
    p.title,
    p.description,
    p.category,
    p.tags,
    p.image_paths,
    p.thumbnail_path,
    p.is_public,
    p.created_at,
    p.updated_at,
    -- 艺术家信息
    pr.full_name as artist_name,
    pr.avatar_url as artist_avatar,
    pr.title as artist_role
FROM portfolio p
LEFT JOIN profiles pr ON p.user_id = pr.id
WHERE p.is_public = true;

-- 添加注释
COMMENT ON VIEW portfolio_with_artist IS '包含艺术家信息的公开作品视图，用于 Gallery 页面显示';

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_portfolio_with_artist_created_at ON portfolio(created_at);
CREATE INDEX IF NOT EXISTS idx_portfolio_with_artist_user_id ON portfolio(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_with_artist_is_public ON portfolio(is_public);





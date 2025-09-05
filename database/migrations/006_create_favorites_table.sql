-- 创建 favorites 表用于收藏功能
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('work', 'collaboration')),
  item_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 确保每个用户只能收藏每个项目一次
  UNIQUE(user_id, item_type, item_id)
);

-- 启用 RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略

-- 允许认证用户插入自己的收藏
CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 允许认证用户删除自己的收藏
CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- 允许认证用户查看自己的收藏
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

-- 刪除通配 SELECT 策略，改為使用聚合視圖對外提供收藏統計
-- 創建聚合視圖用於公開的收藏統計（不包含個人信息）
CREATE OR REPLACE VIEW public.favorite_counts AS
SELECT 
  item_type,
  item_id,
  COUNT(*) as favorite_count
FROM favorites
GROUP BY item_type, item_id;

-- 為聚合視圖啟用 RLS
ALTER VIEW public.favorite_counts SET (security_invoker = true);

-- 創建 RLS 策略允許任何人查看聚合統計
CREATE POLICY "Anyone can view favorite counts" ON public.favorite_counts
  FOR SELECT USING (true);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_item_type ON favorites(item_type);
CREATE INDEX IF NOT EXISTS idx_favorites_item_id ON favorites(item_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at);

-- 创建复合索引用于快速查询特定用户对特定项目的收藏状态
CREATE INDEX IF NOT EXISTS idx_favorites_user_item ON favorites(user_id, item_type, item_id);

-- 创建复合索引用于快速查询特定项目的收藏统计
CREATE INDEX IF NOT EXISTS idx_favorites_item_stats ON favorites(item_type, item_id);

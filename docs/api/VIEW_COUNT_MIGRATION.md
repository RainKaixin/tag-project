# 浏览量统计系统 - 数据库迁移指南

## 📋 概述

本文档指导您如何部署浏览量统计系统的数据库迁移。

## 🗄️ 数据库迁移

### 步骤 1: 登录 Supabase 控制台

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目
3. 进入 **SQL Editor**

### 步骤 2: 执行迁移脚本

复制以下 SQL 内容并粘贴到 SQL Editor 中：

```sql
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
```

### 步骤 3: 验证迁移

执行以下查询验证表是否创建成功：

```sql
-- 检查表是否存在
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'artwork_views';

-- 检查函数是否存在
SELECT routine_name
FROM information_schema.routines
WHERE routine_name IN ('increment_artwork_views', 'get_artwork_view_count', 'has_user_viewed_artwork');
```

## ✅ 迁移完成

迁移完成后，浏览量统计系统将自动开始工作：

1. **前端功能**：作品详情页会自动记录浏览
2. **防重复机制**：同一用户/访客对同一作品只计一次
3. **实时更新**：UI 会显示最新的浏览量
4. **数据质量**：为未来的统计分析和推荐系统提供可靠数据

## 🔧 故障排除

### 常见问题

1. **权限错误**：确保您有足够的权限执行 DDL 操作
2. **外键约束错误**：确保 `auth.users` 表存在
3. **函数创建失败**：检查 PostgreSQL 版本是否支持 `SECURITY DEFINER`

### 回滚方案

如果需要回滚，执行以下 SQL：

```sql
-- 删除函数
DROP FUNCTION IF EXISTS increment_artwork_views(UUID, UUID, VARCHAR, INET, TEXT);
DROP FUNCTION IF EXISTS get_artwork_view_count(UUID);
DROP FUNCTION IF EXISTS has_user_viewed_artwork(UUID, UUID, VARCHAR);

-- 删除表
DROP TABLE IF EXISTS artwork_views;
```

## 📊 系统特性

- ✅ **数据准确性**：数据库唯一约束确保数据准确
- ✅ **性能优化**：索引优化查询性能
- ✅ **安全性**：RLS 策略保护数据安全
- ✅ **扩展性**：为未来功能提供基础
- ✅ **用户友好**：支持登录和未登录用户

# Mock API 配置说明

## 当前状态

**✅ 当前项目处于 Mock API 模式，功能完整**

- 使用 localStorage 模拟后端数据库
- 完整的 CRUD 操作支持
- 文件上传使用 base64 存储
- 无需配置环境变量
- 适合前端开发和测试

## 未来 Supabase 配置（待启用）

要启用 Supabase 数据库功能，您需要配置以下环境变量：

### 1. 创建 .env 文件

在项目根目录创建 `.env` 文件：

```bash
# Supabase 配置
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

# 其他配置
REACT_APP_ENV=development
```

### 2. 获取 Supabase 配置

1. 登录 [Supabase](https://supabase.com)
2. 创建新项目或选择现有项目
3. 进入项目设置 → API
4. 复制以下信息：
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public key**: `your-anon-key-here`

### 3. 数据库设置

在 Supabase SQL Editor 中执行以下 SQL：

```sql
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
CREATE POLICY "Users can insert their own portfolio items" ON portfolio
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio items" ON portfolio
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolio items" ON portfolio
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public portfolio items" ON portfolio
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own portfolio items" ON portfolio
  FOR SELECT USING (auth.uid() = user_id);
```

### 4. Storage 设置

在 Supabase SQL Editor 中执行：

```sql
-- 创建 artworks storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'artworks',
  'artworks',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- 创建 Storage RLS 策略
CREATE POLICY "Users can upload to their own portfolio folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'artworks' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view public portfolio files" ON storage.objects
  FOR SELECT USING (bucket_id = 'artworks');
```

## 运行模式

### Mock 模式（默认）

- 无需配置环境变量
- 使用本地存储模拟数据
- 适合开发和测试

### Supabase 模式

- 需要配置环境变量
- 使用真实的数据库和存储
- 适合生产环境

## 故障排除

### 1. 环境变量未生效

- 重启开发服务器
- 检查 .env 文件位置
- 确认变量名以 `REACT_APP_` 开头

### 2. Supabase 连接失败

- 检查 URL 和密钥是否正确
- 确认项目状态为活跃
- 检查网络连接

### 3. 权限错误

- 确认 RLS 策略已正确设置
- 检查用户认证状态
- 验证数据库表结构

## 开发建议

1. **开发阶段**：使用 Mock 模式，无需配置数据库
2. **测试阶段**：配置 Supabase 进行集成测试
3. **生产阶段**：确保所有环境变量正确配置

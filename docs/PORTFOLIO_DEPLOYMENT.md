# Portfolio 功能部署指南

## 概述

本指南说明如何部署 TAG 平台的 Portfolio 功能，包括数据库表创建、Storage 配置和 RLS 策略设置。

## 数据库部署

### 1. 创建 Portfolio 表

在 Supabase SQL Editor 中执行：

```sql
-- 执行 database/migrations/create_portfolio_table.sql
```

### 2. 创建 Storage Bucket

在 Supabase SQL Editor 中执行：

```sql
-- 执行 database/storage/create_artworks_bucket.sql
```

## 功能说明

### 数据流程

1. **上传作品**：

   - 用户选择文件 → 上传到 Supabase Storage (`artworks` bucket)
   - 文件路径保存到 `portfolio` 表的 `image_paths` 字段
   - 缩略图路径保存到 `thumbnail_path` 字段

2. **保存作品**：

   - 作品信息保存到 `portfolio` 表
   - `user_id` 自动设置为当前认证用户
   - `is_public` 默认为 `true`

3. **查看作品**：
   - **编辑页面**：显示用户的所有作品（包括私有）
   - **个人页面**：显示用户的公开作品
   - **公共画廊**：显示所有用户的公开作品

### RLS 策略

- **插入**：认证用户只能插入自己的作品
- **更新**：认证用户只能更新自己的作品
- **删除**：认证用户只能删除自己的作品
- **查询**：
  - 任何人可以查询 `is_public = true` 的作品
  - 认证用户可以查询自己的所有作品

### Storage 策略

- **上传**：认证用户只能上传到自己的文件夹 (`portfolio/{userId}/`)
- **查看**：所有文件都是公开的
- **删除**：认证用户只能删除自己的文件

## 测试步骤

### 1. 测试上传功能

1. 登录用户账户
2. 访问 "Upload Portfolio" 页面
3. 填写表单并选择文件
4. 点击 "Submit"
5. 验证文件上传到 Storage
6. 验证数据保存到数据库

### 2. 测试编辑页面

1. 访问 "Edit Profile" 页面
2. 验证 Portfolio 部分显示上传的作品
3. 测试删除作品功能
4. 测试切换公开/私有功能

### 3. 测试个人页面

1. 访问用户个人页面 (`/artist/me`)
2. 验证 Portfolio 部分显示公开的作品
3. 验证私有作品不显示

### 4. 测试公共画廊

1. 访问公共画廊页面
2. 验证显示所有用户的公开作品
3. 验证作品信息正确（标题、艺术家、图片等）

## 故障排除

### 常见问题

1. **上传失败**：检查 Storage bucket 是否正确创建
2. **权限错误**：检查 RLS 策略是否正确设置
3. **图片不显示**：检查 Storage 文件路径和公开访问设置
4. **数据不同步**：检查数据库连接和认证状态

### 调试命令

```sql
-- 检查 portfolio 表
SELECT * FROM portfolio ORDER BY created_at DESC;

-- 检查 Storage 文件
SELECT * FROM storage.objects WHERE bucket_id = 'artworks';

-- 检查 RLS 策略
SELECT * FROM pg_policies WHERE tablename = 'portfolio';
```

## 注意事项

- 确保 Supabase 项目已正确配置
- 确保用户认证功能正常工作
- 定期备份数据库和 Storage 数据
- 监控 Storage 使用量和数据库性能

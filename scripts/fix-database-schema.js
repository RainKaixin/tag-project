#!/usr/bin/env node

/**
 * 数据库表结构检查和修复脚本
 * 用于解决 profiles 表字段缺失的问题
 */

console.log('🔍 数据库表结构检查和修复脚本');
console.log('=====================================\n');

// 检查 profiles 表结构的 SQL
const checkProfilesTableSQL = `
-- 检查 profiles 表结构
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
`;

// 创建或修复 profiles 表的 SQL
const createProfilesTableSQL = `
-- 创建 profiles 表（如果不存在）
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  title TEXT DEFAULT 'Artist',
  school TEXT,
  pronouns TEXT,
  majors TEXT[],
  minors TEXT[],
  skills TEXT[],
  bio TEXT,
  social_links JSONB DEFAULT '{}',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_avatar_url ON profiles(avatar_url);

-- 添加注释
COMMENT ON TABLE profiles IS '用户档案信息表';
COMMENT ON COLUMN profiles.avatar_url IS '用户头像URL';
`;

// 检查 avatar_url 字段的 SQL
const checkAvatarUrlFieldSQL = `
-- 检查 avatar_url 字段是否存在
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name = 'avatar_url';
`;

// 添加 avatar_url 字段的 SQL（如果不存在）
const addAvatarUrlFieldSQL = `
-- 添加 avatar_url 字段（如果不存在）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
      AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    RAISE NOTICE 'Added avatar_url column to profiles table';
  ELSE
    RAISE NOTICE 'avatar_url column already exists in profiles table';
  END IF;
END $$;
`;

// 检查现有数据的 SQL
const checkExistingDataSQL = `
-- 检查现有数据
SELECT 
  id,
  full_name,
  avatar_url,
  created_at
FROM profiles 
LIMIT 5;
`;

console.log('📋 需要执行的 SQL 语句：\n');

console.log('1️⃣ 检查 profiles 表结构：');
console.log(checkProfilesTableSQL);
console.log('\n');

console.log('2️⃣ 创建或修复 profiles 表：');
console.log(createProfilesTableSQL);
console.log('\n');

console.log('3️⃣ 检查 avatar_url 字段：');
console.log(checkAvatarUrlFieldSQL);
console.log('\n');

console.log('4️⃣ 添加 avatar_url 字段（如果需要）：');
console.log(addAvatarUrlFieldSQL);
console.log('\n');

console.log('5️⃣ 检查现有数据：');
console.log(checkExistingDataSQL);
console.log('\n');

console.log('🚀 执行步骤：');
console.log('1. 复制上述 SQL 到 Supabase SQL Editor');
console.log('2. 按顺序执行每个 SQL 语句');
console.log('3. 检查执行结果，确保没有错误');
console.log('4. 重新测试头像上传功能');
console.log('\n');

console.log('⚠️  注意事项：');
console.log('- 执行前请备份重要数据');
console.log('- 确保有足够的数据库权限');
console.log('- 如果表已存在，某些语句可能会报错，这是正常的');
console.log('\n');

console.log('✅ 完成！请按照上述步骤执行 SQL 语句。');

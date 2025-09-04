// 修复Supabase Storage权限的脚本
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 环境变量未设置');
  console.error('请设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorageBuckets() {
  console.log('🔍 检查Storage桶...');

  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error('❌ 获取桶列表失败:', error);
      return;
    }

    console.log('📦 当前Storage桶:');
    buckets.forEach(bucket => {
      console.log(`  - ${bucket.name} (public: ${bucket.public})`);
    });

    // 检查必要的桶是否存在
    const requiredBuckets = ['portfolio', 'avatars'];
    const existingBuckets = buckets.map(b => b.name);

    for (const bucketName of requiredBuckets) {
      if (!existingBuckets.includes(bucketName)) {
        console.log(`⚠️  缺少必要的桶: ${bucketName}`);
      } else {
        const bucket = buckets.find(b => b.name === bucketName);
        console.log(`✅ ${bucketName}: ${bucket.public ? '公开' : '私有'}`);
      }
    }
  } catch (error) {
    console.error('❌ 检查Storage桶失败:', error);
  }
}

async function checkStoragePolicies() {
  console.log('\n🔍 检查Storage RLS策略...');

  try {
    // 检查portfolio桶的策略
    console.log('📋 portfolio桶的RLS策略:');
    const { data: portfolioPolicies, error: portfolioError } = await supabase
      .from('storage.policies')
      .select('*')
      .eq('bucket_id', 'portfolio');

    if (portfolioError) {
      console.error('❌ 获取portfolio策略失败:', portfolioError);
    } else {
      console.log('  - 策略数量:', portfolioPolicies?.length || 0);
      portfolioPolicies?.forEach(policy => {
        console.log(
          `    * ${policy.name}: ${policy.action} ${policy.operation}`
        );
      });
    }

    // 检查avatars桶的策略
    console.log('\n📋 avatars桶的RLS策略:');
    const { data: avatarsPolicies, error: avatarsError } = await supabase
      .from('storage.policies')
      .select('*')
      .eq('bucket_id', 'avatars');

    if (avatarsError) {
      console.error('❌ 获取avatars策略失败:', avatarsError);
    } else {
      console.log('  - 策略数量:', avatarsPolicies?.length || 0);
      avatarsPolicies?.forEach(policy => {
        console.log(
          `    * ${policy.name}: ${policy.action} ${policy.operation}`
        );
      });
    }
  } catch (error) {
    console.error('❌ 检查Storage策略失败:', error);
  }
}

async function testStorageAccess() {
  console.log('\n🧪 测试Storage访问权限...');

  try {
    // 测试portfolio桶
    console.log('📁 测试portfolio桶访问...');
    const { data: portfolioFiles, error: portfolioError } =
      await supabase.storage.from('portfolio').list('', { limit: 1 });

    if (portfolioError) {
      console.error('❌ portfolio桶访问失败:', portfolioError.message);
    } else {
      console.log('✅ portfolio桶访问成功');
    }

    // 测试avatars桶
    console.log('📁 测试avatars桶访问...');
    const { data: avatarsFiles, error: avatarsError } = await supabase.storage
      .from('avatars')
      .list('', { limit: 1 });

    if (avatarsError) {
      console.error('❌ avatars桶访问失败:', avatarsError.message);
    } else {
      console.log('✅ avatars桶访问成功');
    }
  } catch (error) {
    console.error('❌ 测试Storage访问失败:', error);
  }
}

async function main() {
  console.log('🚀 开始检查和修复Supabase Storage权限...\n');

  await checkStorageBuckets();
  await checkStoragePolicies();
  await testStorageAccess();

  console.log('\n📝 建议的修复步骤:');
  console.log('1. 确保portfolio和avatars桶存在');
  console.log('2. 设置正确的RLS策略');
  console.log('3. 配置适当的权限');

  console.log('\n🔧 在Supabase Dashboard中执行以下SQL:');
  console.log(`
-- 创建portfolio桶（如果不存在）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 创建avatars桶（如果不存在）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 设置portfolio桶的RLS策略
CREATE POLICY "Anyone can view public portfolio files" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio');

CREATE POLICY "Authenticated users can upload to portfolio" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own portfolio files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'portfolio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own portfolio files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portfolio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 设置avatars桶的RLS策略
CREATE POLICY "Anyone can view public avatar files" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
  `);
}

main().catch(console.error);

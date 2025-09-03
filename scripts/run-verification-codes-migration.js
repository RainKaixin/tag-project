// run-verification-codes-migration.js
// 运行验证码表迁移脚本

console.log('🚀 开始运行验证码表迁移...');

// 检查是否在浏览器环境中
if (typeof window === 'undefined') {
  console.log('❌ 此脚本需要在浏览器环境中运行');
  process.exit(1);
}

// 检查Supabase连接
async function runMigration() {
  try {
    console.log('📋 检查Supabase连接...');

    // 这里需要您手动在Supabase SQL Editor中运行迁移
    console.log('📝 请按照以下步骤操作：');
    console.log('');
    console.log('1. 登录您的Supabase项目');
    console.log('2. 进入 SQL Editor');
    console.log('3. 复制以下SQL代码并执行：');
    console.log('');
    console.log('--- 开始复制 ---');
    console.log(`
-- 创建验证码表
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_code_hash ON verification_codes(code_hash);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_codes_used ON verification_codes(used);
CREATE INDEX IF NOT EXISTS idx_verification_codes_email_code_hash ON verification_codes(email, code_hash);

-- 启用RLS
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "Service role can manage verification codes" ON verification_codes
  FOR ALL USING (auth.role() = 'service_role');
    `);
    console.log('--- 复制结束 ---');
    console.log('');
    console.log('4. 执行完成后，验证码功能应该就能正常工作了');
    console.log('');
    console.log('💡 提示：如果遇到权限问题，请确保您有足够的数据库权限');
  } catch (error) {
    console.error('❌ 迁移过程中出现错误:', error);
  }
}

// 运行迁移
runMigration();

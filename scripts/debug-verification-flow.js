// debug-verification-flow.js
// 调试验证码流程的脚本

console.log('🔍 开始调试验证码流程...');

// 检查验证码表是否存在数据
async function checkVerificationCodesTable() {
  try {
    console.log('📋 检查验证码表...');

    // 这里需要您在Supabase SQL Editor中运行以下查询
    console.log('请在Supabase SQL Editor中运行以下查询：');
    console.log('');
    console.log('--- 查询1：检查表结构 ---');
    console.log(`
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'verification_codes'
ORDER BY ordinal_position;
    `);

    console.log('--- 查询2：检查表中是否有数据 ---');
    console.log(`
SELECT 
  id,
  email,
  LEFT(code_hash, 10) || '...' as code_hash_preview,
  expires_at,
  used,
  created_at
FROM verification_codes
ORDER BY created_at DESC
LIMIT 10;
    `);

    console.log('--- 查询3：检查最近的验证码 ---');
    console.log(`
SELECT 
  email,
  created_at,
  expires_at,
  used,
  CASE 
    WHEN expires_at < NOW() THEN 'EXPIRED'
    WHEN used = true THEN 'USED'
    ELSE 'VALID'
  END as status
FROM verification_codes
WHERE email = 'shuwang602@gmail.com'  -- 替换为您的邮箱
ORDER BY created_at DESC
LIMIT 5;
    `);
  } catch (error) {
    console.error('❌ 检查过程中出现错误:', error);
  }
}

// 检查发送验证码的Edge Function
function checkSendVerificationCodeFunction() {
  console.log('📧 检查发送验证码的Edge Function...');
  console.log('');
  console.log('请检查以下文件：');
  console.log('1. supabase/functions/send-verification-code/index.ts');
  console.log('2. 确保它正确存储验证码到 verification_codes 表');
  console.log('');
  console.log('关键检查点：');
  console.log('- 验证码是否正确存储到数据库');
  console.log('- 过期时间是否正确设置');
  console.log('- code_hash 是否正确计算');
}

// 检查验证码验证的Edge Function
function checkVerifyCodeFunction() {
  console.log('✅ 检查验证码验证的Edge Function...');
  console.log('');
  console.log('请检查以下文件：');
  console.log('1. supabase/functions/verify-code/index.ts');
  console.log('2. 确保它正确查询 verification_codes 表');
  console.log('');
  console.log('关键检查点：');
  console.log('- 参数验证是否正确');
  console.log('- 数据库查询是否正确');
  console.log('- 错误处理是否完善');
}

// 运行调试
console.log('🚀 开始调试...');
console.log('');

checkVerificationCodesTable();
console.log('');
checkSendVerificationCodeFunction();
console.log('');
checkVerifyCodeFunction();

console.log('');
console.log('💡 调试建议：');
console.log('1. 先运行查询1和2，确认表结构和数据');
console.log('2. 检查发送验证码的Edge Function是否正确存储数据');
console.log('3. 检查验证码验证的Edge Function是否正确查询数据');
console.log('4. 查看Edge Function的调用日志获取详细错误信息');

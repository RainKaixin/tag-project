-- 创建验证码表
-- 用于存储邮箱验证码信息

CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,  -- 存储验证码的SHA256哈希值
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_code_hash ON verification_codes(code_hash);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_codes_used ON verification_codes(used);

-- 创建复合索引
CREATE INDEX IF NOT EXISTS idx_verification_codes_email_code_hash ON verification_codes(email, code_hash);

-- 启用行级安全策略 (RLS)
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- 创建策略：只允许服务角色访问（Edge Function使用）
CREATE POLICY "Service role can manage verification codes" ON verification_codes
  FOR ALL USING (auth.role() = 'service_role');

-- 添加注释
COMMENT ON TABLE verification_codes IS '存储邮箱验证码信息，用于用户注册和密码重置';
COMMENT ON COLUMN verification_codes.email IS '邮箱地址';
COMMENT ON COLUMN verification_codes.code_hash IS '验证码的SHA256哈希值';
COMMENT ON COLUMN verification_codes.expires_at IS '验证码过期时间';
COMMENT ON COLUMN verification_codes.used IS '验证码是否已使用';
COMMENT ON COLUMN verification_codes.used_at IS '验证码使用时间';




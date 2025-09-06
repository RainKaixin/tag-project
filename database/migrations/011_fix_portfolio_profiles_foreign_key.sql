-- 修復portfolio到profiles的外鍵關係
-- 解決PostgREST嵌入式聯表查詢問題

-- 首先檢查profiles表是否存在，如果不存在則創建
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  title TEXT,
  bio TEXT,
  website TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 啟用RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 創建RLS策略
-- 允許認證用戶查看所有公開的profiles
CREATE POLICY "Anyone can view public profiles" ON profiles
  FOR SELECT USING (true);

-- 允許認證用戶插入自己的profile
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 允許認證用戶更新自己的profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 允許認證用戶刪除自己的profile
CREATE POLICY "Users can delete their own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- 為profiles表創建索引
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- 創建updated_at觸發器
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 現在修復portfolio表的外鍵關係
-- 添加從portfolio.user_id到profiles.id的外鍵約束
ALTER TABLE portfolio 
ADD CONSTRAINT fk_portfolio_profiles 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 創建函數：自動創建用戶profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 創建觸發器：當新用戶註冊時自動創建profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 為現有用戶創建profiles記錄（如果不存在）
INSERT INTO profiles (id, full_name, avatar_url)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
  au.raw_user_meta_data->>'avatar_url' as avatar_url
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 添加註釋
COMMENT ON TABLE profiles IS '用戶資料表，與auth.users一對一關係';
COMMENT ON COLUMN profiles.id IS '用戶ID，與auth.users.id一致';
COMMENT ON COLUMN profiles.full_name IS '用戶全名';
COMMENT ON COLUMN profiles.avatar_url IS '用戶頭像URL';
COMMENT ON COLUMN profiles.title IS '用戶職稱/角色';

COMMENT ON CONSTRAINT fk_portfolio_profiles ON portfolio IS 'portfolio表到profiles表的外鍵關係，支持PostgREST嵌入式聯表查詢';

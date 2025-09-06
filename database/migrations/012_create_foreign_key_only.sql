-- 專門用於建立portfolio到profiles的外鍵關係
-- 解決PostgREST嵌入式聯表查詢問題

-- 檢查並創建profiles表（如果不存在）
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

-- 確保profiles表啟用RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 檢查並添加外鍵約束
DO $$
BEGIN
  -- 檢查外鍵約束是否已存在
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_portfolio_profiles'
    AND table_name = 'portfolio'
    AND table_schema = 'public'
  ) THEN
    -- 添加外鍵約束
    ALTER TABLE portfolio 
    ADD CONSTRAINT fk_portfolio_profiles 
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    
    RAISE NOTICE '外鍵約束 fk_portfolio_profiles 已創建';
  ELSE
    RAISE NOTICE '外鍵約束 fk_portfolio_profiles 已存在';
  END IF;
END $$;

-- 為現有用戶創建profiles記錄（如果不存在）
INSERT INTO profiles (id, full_name, avatar_url)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
  au.raw_user_meta_data->>'avatar_url' as avatar_url
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 創建updated_at觸發器函數（如果不存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 創建觸發器（如果不存在）
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 創建自動用戶profile創建觸發器
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 創建觸發器（如果不存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 添加註釋
COMMENT ON CONSTRAINT fk_portfolio_profiles ON portfolio IS 'portfolio表到profiles表的外鍵關係，支持PostgREST嵌入式聯表查詢';

-- 顯示完成信息
DO $$
BEGIN
  RAISE NOTICE '✅ 外鍵關係修復完成！';
  RAISE NOTICE '📋 完成的操作：';
  RAISE NOTICE '   1. 確保profiles表存在';
  RAISE NOTICE '   2. 創建外鍵約束 fk_portfolio_profiles';
  RAISE NOTICE '   3. 為現有用戶創建profiles記錄';
  RAISE NOTICE '   4. 創建自動用戶profile創建觸發器';
  RAISE NOTICE '🎯 現在可以使用 profiles!fk_portfolio_profiles(...) 進行嵌入式聯表查詢';
END $$;

-- 创建 artworks storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'artworks',
  'artworks',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- 创建 RLS 策略允许认证用户上传到自己的文件夹
CREATE POLICY "Users can upload to their own portfolio folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'artworks' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 创建 RLS 策略允许认证用户更新自己的文件
CREATE POLICY "Users can update their own portfolio files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'artworks' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 创建 RLS 策略允许认证用户删除自己的文件
CREATE POLICY "Users can delete their own portfolio files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'artworks' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 创建 RLS 策略允许任何人查看公开的文件
CREATE POLICY "Anyone can view public portfolio files" ON storage.objects
  FOR SELECT USING (bucket_id = 'artworks');

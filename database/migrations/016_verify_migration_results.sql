-- 驗證數據遷移結果
-- 確認第一階段完成情況

-- 1. 檢查software字段是否存在
SELECT 
  'Schema Check' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'portfolio' 
  AND column_name IN ('software', 'tags')
ORDER BY column_name;

-- 2. 檢查數據遷移統計
SELECT 
  'Migration Statistics' as check_type,
  COUNT(*) as total_items,
  COUNT(CASE WHEN tags IS NOT NULL AND array_length(tags, 1) > 0 THEN 1 END) as items_with_tags,
  COUNT(CASE WHEN software IS NOT NULL AND array_length(software, 1) > 0 THEN 1 END) as items_with_software,
  COUNT(CASE WHEN tags IS NULL OR array_length(tags, 1) = 0 THEN 1 END) as items_without_tags,
  COUNT(CASE WHEN software IS NULL OR array_length(software, 1) = 0 THEN 1 END) as items_without_software
FROM portfolio;

-- 3. 檢查標籤格式標準化結果
SELECT 
  'Tag Format Check' as check_type,
  COUNT(*) as total_tags,
  COUNT(CASE WHEN tag LIKE '#%' THEN 1 END) as tags_with_hash,
  COUNT(CASE WHEN tag != lower(tag) THEN 1 END) as mixed_case_tags,
  COUNT(CASE WHEN tag = lower(tag) THEN 1 END) as lowercase_tags
FROM (
  SELECT unnest(tags) as tag FROM portfolio WHERE tags IS NOT NULL
  UNION ALL
  SELECT unnest(software) as tag FROM portfolio WHERE software IS NOT NULL
) as all_tags;

-- 4. 檢查軟件標籤分離結果
WITH software_whitelist AS (
  SELECT unnest(ARRAY[
    '3d-coat', '3ds-max', 'after-effects', 'blender', 'cinema-4d', 
    'davinci-resolve', 'figma', 'gaea', 'houdini', 'illustrator', 
    'indesign', 'javascript', 'maya', 'nuke', 'photoshop', 'python',
    'substance-designer', 'substance-painter', 'unity', 'unreal-engine', 'zbrush'
  ]) as software_name
)
SELECT 
  'Software Separation Check' as check_type,
  COUNT(*) as total_software_tags,
  COUNT(DISTINCT tag) as unique_software_tags,
  string_agg(DISTINCT tag, ', ' ORDER BY tag) as software_tags_list
FROM (
  SELECT unnest(software) as tag FROM portfolio WHERE software IS NOT NULL
) as software_tags
WHERE tag IN (SELECT software_name FROM software_whitelist);

-- 5. 檢查自由標籤結果
WITH software_whitelist AS (
  SELECT unnest(ARRAY[
    '3d-coat', '3ds-max', 'after-effects', 'blender', 'cinema-4d', 
    'davinci-resolve', 'figma', 'gaea', 'houdini', 'illustrator', 
    'indesign', 'javascript', 'maya', 'nuke', 'photoshop', 'python',
    'substance-designer', 'substance-painter', 'unity', 'unreal-engine', 'zbrush'
  ]) as software_name
)
SELECT 
  'Free Tags Check' as check_type,
  COUNT(*) as total_free_tags,
  COUNT(DISTINCT tag) as unique_free_tags,
  string_agg(DISTINCT tag, ', ' ORDER BY tag) as free_tags_list
FROM (
  SELECT unnest(tags) as tag FROM portfolio WHERE tags IS NOT NULL
) as free_tags
WHERE tag NOT IN (SELECT software_name FROM software_whitelist);

-- 6. 檢查profiles表專業字段
SELECT 
  'Profiles Schema Check' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('majors', 'minors')
ORDER BY column_name;

-- 7. 檢查索引創建結果
SELECT 
  'Index Check' as check_type,
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE tablename IN ('portfolio', 'profiles')
  AND indexname LIKE '%software%' OR indexname LIKE '%majors%' OR indexname LIKE '%minors%'
ORDER BY tablename, indexname;

-- 8. 測試查詢性能
SELECT 
  'Performance Test' as check_type,
  'Software Query' as test_name,
  COUNT(*) as result_count,
  EXTRACT(EPOCH FROM (clock_timestamp() - statement_timestamp())) * 1000 as execution_time_ms
FROM portfolio 
WHERE is_public = true AND software @> ARRAY['photoshop'];

-- 9. 顯示遷移完成摘要
DO $$
DECLARE
  total_items INTEGER;
  items_with_tags INTEGER;
  items_with_software INTEGER;
  software_tags_count INTEGER;
  free_tags_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_items FROM portfolio;
  SELECT COUNT(*) INTO items_with_tags FROM portfolio WHERE tags IS NOT NULL AND array_length(tags, 1) > 0;
  SELECT COUNT(*) INTO items_with_software FROM portfolio WHERE software IS NOT NULL AND array_length(software, 1) > 0;
  
  SELECT COUNT(*) INTO software_tags_count FROM (
    SELECT unnest(software) FROM portfolio WHERE software IS NOT NULL
  ) as software_tags;
  
  SELECT COUNT(*) INTO free_tags_count FROM (
    SELECT unnest(tags) FROM portfolio WHERE tags IS NOT NULL
  ) as free_tags;
  
  RAISE NOTICE '🎉 第一階段數據遷移驗證完成！';
  RAISE NOTICE '📊 遷移統計摘要：';
  RAISE NOTICE '   總作品數: %', total_items;
  RAISE NOTICE '   有標籤作品: %', items_with_tags;
  RAISE NOTICE '   有軟件作品: %', items_with_software;
  RAISE NOTICE '   軟件標籤總數: %', software_tags_count;
  RAISE NOTICE '   自由標籤總數: %', free_tags_count;
  RAISE NOTICE '🎯 準備進入第二階段：服務層擴展';
END $$;

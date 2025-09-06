-- 添加software字段並遷移數據
-- 第一階段：數據結構統一

-- 1. 添加software字段到portfolio表
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS software TEXT[];

-- 2. 創建軟件白名單函數
CREATE OR REPLACE FUNCTION get_software_whitelist()
RETURNS TEXT[]
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT ARRAY[
    '3d-coat', '3ds-max', 'after-effects', 'blender', 'cinema-4d', 
    'davinci-resolve', 'figma', 'gaea', 'houdini', 'illustrator', 
    'indesign', 'javascript', 'maya', 'nuke', 'photoshop', 'python',
    'substance-designer', 'substance-painter', 'unity', 'unreal-engine', 'zbrush'
  ];
$$;

-- 3. 創建標籤標準化函數
CREATE OR REPLACE FUNCTION normalize_tag(tag TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT lower(replace(tag, '#', ''));
$$;

-- 4. 創建數據遷移函數
CREATE OR REPLACE FUNCTION migrate_tags_to_software()
RETURNS TABLE(
  portfolio_id UUID,
  old_tags TEXT[],
  new_tags TEXT[],
  new_software TEXT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
  software_list TEXT[];
BEGIN
  -- 獲取軟件白名單
  SELECT get_software_whitelist() INTO software_list;
  
  -- 返回遷移結果（不實際執行更新）
  RETURN QUERY
  SELECT 
    p.id,
    p.tags as old_tags,
    ARRAY(
      SELECT normalize_tag(tag)
      FROM unnest(p.tags) as tag
      WHERE normalize_tag(tag) NOT IN (SELECT unnest(software_list))
    ) as new_tags,
    ARRAY(
      SELECT normalize_tag(tag)
      FROM unnest(p.tags) as tag
      WHERE normalize_tag(tag) IN (SELECT unnest(software_list))
    ) as new_software
  FROM portfolio p
  WHERE p.tags IS NOT NULL AND array_length(p.tags, 1) > 0;
END;
$$;

-- 5. 預覽遷移結果（不實際執行更新）
SELECT 
  'Migration Preview' as status,
  COUNT(*) as total_items,
  COUNT(CASE WHEN array_length(new_software, 1) > 0 THEN 1 END) as items_with_software,
  COUNT(CASE WHEN array_length(new_tags, 1) > 0 THEN 1 END) as items_with_free_tags
FROM migrate_tags_to_software();

-- 6. 顯示遷移預覽詳情
SELECT 
  'Migration Details' as status,
  portfolio_id,
  old_tags,
  new_tags,
  new_software,
  array_length(new_tags, 1) as free_tags_count,
  array_length(new_software, 1) as software_tags_count
FROM migrate_tags_to_software()
ORDER BY portfolio_id
LIMIT 10;

-- 7. 執行實際數據遷移
UPDATE portfolio 
SET 
  software = ARRAY(
    SELECT normalize_tag(tag)
    FROM unnest(tags) as tag
    WHERE normalize_tag(tag) IN (SELECT unnest(get_software_whitelist()))
  ),
  tags = ARRAY(
    SELECT normalize_tag(tag)
    FROM unnest(tags) as tag
    WHERE normalize_tag(tag) NOT IN (SELECT unnest(get_software_whitelist()))
  )
WHERE tags IS NOT NULL AND array_length(tags, 1) > 0;

-- 8. 清理空數組
UPDATE portfolio 
SET software = NULL 
WHERE software IS NOT NULL AND array_length(software, 1) = 0;

UPDATE portfolio 
SET tags = NULL 
WHERE tags IS NOT NULL AND array_length(tags, 1) = 0;

-- 9. 添加註釋
COMMENT ON COLUMN portfolio.software IS '軟件標籤數組，用於軟件聚合查詢';
COMMENT ON FUNCTION get_software_whitelist() IS '返回軟件標籤白名單';
COMMENT ON FUNCTION normalize_tag(TEXT) IS '標準化標籤格式（去除#前綴，轉小寫）';

-- 10. 顯示遷移完成信息
DO $$
DECLARE
  total_items INTEGER;
  items_with_software INTEGER;
  items_with_tags INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_items FROM portfolio;
  SELECT COUNT(*) INTO items_with_software FROM portfolio WHERE software IS NOT NULL AND array_length(software, 1) > 0;
  SELECT COUNT(*) INTO items_with_tags FROM portfolio WHERE tags IS NOT NULL AND array_length(tags, 1) > 0;
  
  RAISE NOTICE '✅ 數據遷移完成！';
  RAISE NOTICE '📊 遷移統計：';
  RAISE NOTICE '   總作品數: %', total_items;
  RAISE NOTICE '   有軟件標籤: %', items_with_software;
  RAISE NOTICE '   有自由標籤: %', items_with_tags;
  RAISE NOTICE '🎯 下一步：創建索引優化查詢性能';
END $$;

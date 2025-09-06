-- 分析現有標籤數據格式
-- 用於確定數據遷移策略

-- 1. 檢查portfolio表中的標籤格式
SELECT 
  'Portfolio Tags Analysis' as analysis_type,
  COUNT(*) as total_items,
  COUNT(CASE WHEN tags IS NOT NULL THEN 1 END) as items_with_tags,
  COUNT(CASE WHEN tags IS NULL OR array_length(tags, 1) = 0 THEN 1 END) as items_without_tags
FROM portfolio;

-- 2. 分析標籤格式（帶#前綴 vs 不帶#前綴）
WITH tag_analysis AS (
  SELECT 
    unnest(tags) as tag,
    CASE 
      WHEN unnest(tags) LIKE '#%' THEN 'with_hash'
      ELSE 'without_hash'
    END as format_type,
    CASE 
      WHEN unnest(tags) != lower(unnest(tags)) THEN 'mixed_case'
      ELSE 'lowercase'
    END as case_type
  FROM portfolio 
  WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
)
SELECT 
  'Tag Format Analysis' as analysis_type,
  format_type,
  case_type,
  COUNT(*) as count
FROM tag_analysis
GROUP BY format_type, case_type
ORDER BY format_type, case_type;

-- 3. 檢查軟件標籤（基於白名單）
WITH software_whitelist AS (
  SELECT unnest(ARRAY[
    '3d-coat', '3ds-max', 'after-effects', 'blender', 'cinema-4d', 
    'davinci-resolve', 'figma', 'gaea', 'houdini', 'illustrator', 
    'indesign', 'javascript', 'maya', 'nuke', 'photoshop', 'python',
    'substance-designer', 'substance-painter', 'unity', 'unreal-engine', 'zbrush'
  ]) as software_name
),
tag_software_analysis AS (
  SELECT 
    unnest(tags) as tag,
    CASE 
      WHEN lower(replace(unnest(tags), '#', '')) IN (SELECT software_name FROM software_whitelist) 
      THEN 'software'
      ELSE 'free_tag'
    END as tag_type
  FROM portfolio 
  WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
)
SELECT 
  'Tag Type Analysis' as analysis_type,
  tag_type,
  COUNT(*) as count
FROM tag_software_analysis
GROUP BY tag_type;

-- 4. 顯示具體的軟件標籤
WITH software_whitelist AS (
  SELECT unnest(ARRAY[
    '3d-coat', '3ds-max', 'after-effects', 'blender', 'cinema-4d', 
    'davinci-resolve', 'figma', 'gaea', 'houdini', 'illustrator', 
    'indesign', 'javascript', 'maya', 'nuke', 'photoshop', 'python',
    'substance-designer', 'substance-painter', 'unity', 'unreal-engine', 'zbrush'
  ]) as software_name
),
software_tags AS (
  SELECT DISTINCT unnest(tags) as tag
  FROM portfolio 
  WHERE tags IS NOT NULL 
    AND array_length(tags, 1) > 0
    AND lower(replace(unnest(tags), '#', '')) IN (SELECT software_name FROM software_whitelist)
)
SELECT 
  'Software Tags Found' as analysis_type,
  tag,
  lower(replace(tag, '#', '')) as normalized_tag
FROM software_tags
ORDER BY normalized_tag;

-- 5. 顯示具體的自由標籤（前20個）
WITH software_whitelist AS (
  SELECT unnest(ARRAY[
    '3d-coat', '3ds-max', 'after-effects', 'blender', 'cinema-4d', 
    'davinci-resolve', 'figma', 'gaea', 'houdini', 'illustrator', 
    'indesign', 'javascript', 'maya', 'nuke', 'photoshop', 'python',
    'substance-designer', 'substance-painter', 'unity', 'unreal-engine', 'zbrush'
  ]) as software_name
),
free_tags AS (
  SELECT DISTINCT unnest(tags) as tag
  FROM portfolio 
  WHERE tags IS NOT NULL 
    AND array_length(tags, 1) > 0
    AND lower(replace(unnest(tags), '#', '')) NOT IN (SELECT software_name FROM software_whitelist)
)
SELECT 
  'Free Tags Sample' as analysis_type,
  tag
FROM free_tags
ORDER BY tag
LIMIT 20;

-- 6. 檢查profiles表的專業數據結構
SELECT 
  'Profiles Analysis' as analysis_type,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN title IS NOT NULL AND title != '' THEN 1 END) as profiles_with_title,
  COUNT(CASE WHEN bio IS NOT NULL AND bio != '' THEN 1 END) as profiles_with_bio
FROM profiles;

-- 7. 顯示profiles表中的title數據樣本
SELECT 
  'Profile Titles Sample' as analysis_type,
  id,
  full_name,
  title,
  bio
FROM profiles
WHERE title IS NOT NULL AND title != ''
LIMIT 10;

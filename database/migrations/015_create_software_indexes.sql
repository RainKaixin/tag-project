-- 創建software字段的索引優化
-- 提升軟件聚合查詢性能

-- 1. 為software字段創建GIN索引（支持數組查詢）
CREATE INDEX IF NOT EXISTS idx_portfolio_software_gin ON portfolio USING GIN (software);

-- 2. 為software字段創建B-tree索引（支持精確匹配）
CREATE INDEX IF NOT EXISTS idx_portfolio_software_btree ON portfolio USING BTREE (software);

-- 3. 為公開作品的software創建複合索引
CREATE INDEX IF NOT EXISTS idx_portfolio_public_software ON portfolio (is_public, software) WHERE is_public = true;

-- 4. 為公開作品的tags創建複合索引（如果不存在）
CREATE INDEX IF NOT EXISTS idx_portfolio_public_tags ON portfolio (is_public, tags) WHERE is_public = true;

-- 5. 為公開作品的創建時間創建複合索引（如果不存在）
CREATE INDEX IF NOT EXISTS idx_portfolio_public_created ON portfolio (is_public, created_at DESC) WHERE is_public = true;

-- 6. 為profiles表添加專業字段（如果不存在）
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS majors TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS minors TEXT[];

-- 7. 為profiles表的專業字段創建索引
CREATE INDEX IF NOT EXISTS idx_profiles_majors_gin ON profiles USING GIN (majors);
CREATE INDEX IF NOT EXISTS idx_profiles_minors_gin ON profiles USING GIN (minors);

-- 8. 創建組合查詢優化索引
-- 用於專業+軟件的組合查詢
CREATE INDEX IF NOT EXISTS idx_portfolio_software_created ON portfolio (software, created_at DESC) WHERE is_public = true;

-- 9. 添加索引註釋
COMMENT ON INDEX idx_portfolio_software_gin IS 'GIN索引用於portfolio表的software數組查詢，支持contains操作';
COMMENT ON INDEX idx_portfolio_software_btree IS 'B-tree索引用於portfolio表的software數組精確匹配查詢';
COMMENT ON INDEX idx_portfolio_public_software IS '複合索引用於公開作品的軟件查詢優化';
COMMENT ON INDEX idx_profiles_majors_gin IS 'GIN索引用於profiles表的majors數組查詢';
COMMENT ON INDEX idx_profiles_minors_gin IS 'GIN索引用於profiles表的minors數組查詢';

-- 10. 創建查詢性能測試函數
CREATE OR REPLACE FUNCTION test_software_query_performance()
RETURNS TABLE(
  test_name TEXT,
  execution_time_ms NUMERIC,
  result_count BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
  start_time TIMESTAMP;
  end_time TIMESTAMP;
  test_count BIGINT;
BEGIN
  -- 測試1: 軟件查詢
  start_time := clock_timestamp();
  SELECT COUNT(*) INTO test_count
  FROM portfolio 
  WHERE is_public = true AND software @> ARRAY['photoshop'];
  end_time := clock_timestamp();
  
  RETURN QUERY SELECT 
    'Software Query (Photoshop)'::TEXT,
    EXTRACT(EPOCH FROM (end_time - start_time)) * 1000,
    test_count;
  
  -- 測試2: 組合查詢（軟件+標籤）
  start_time := clock_timestamp();
  SELECT COUNT(*) INTO test_count
  FROM portfolio 
  WHERE is_public = true 
    AND software @> ARRAY['photoshop'] 
    AND tags @> ARRAY['castle'];
  end_time := clock_timestamp();
  
  RETURN QUERY SELECT 
    'Combined Query (Photoshop + Castle)'::TEXT,
    EXTRACT(EPOCH FROM (end_time - start_time)) * 1000,
    test_count;
  
  -- 測試3: 專業查詢（需要JOIN profiles）
  start_time := clock_timestamp();
  SELECT COUNT(*) INTO test_count
  FROM portfolio p
  LEFT JOIN profiles pr ON p.user_id = pr.id
  WHERE p.is_public = true 
    AND (pr.majors @> ARRAY['animation'] OR pr.minors @> ARRAY['animation']);
  end_time := clock_timestamp();
  
  RETURN QUERY SELECT 
    'Major Query (Animation)'::TEXT,
    EXTRACT(EPOCH FROM (end_time - start_time)) * 1000,
    test_count;
END;
$$;

-- 11. 顯示索引創建完成信息
DO $$
BEGIN
  RAISE NOTICE '✅ 索引創建完成！';
  RAISE NOTICE '📋 創建的索引：';
  RAISE NOTICE '   1. idx_portfolio_software_gin - 軟件數組GIN索引';
  RAISE NOTICE '   2. idx_portfolio_software_btree - 軟件數組B-tree索引';
  RAISE NOTICE '   3. idx_portfolio_public_software - 公開作品軟件複合索引';
  RAISE NOTICE '   4. idx_profiles_majors_gin - 專業GIN索引';
  RAISE NOTICE '   5. idx_profiles_minors_gin - 副專業GIN索引';
  RAISE NOTICE '🎯 下一步：測試查詢性能並擴展tagService';
END $$;

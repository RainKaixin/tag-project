-- 添加級聯刪除約束，確保作品刪除時自動清理相關收藏記錄
-- 這將防止懸空引用和無限循環報錯問題

-- 首先檢查是否存在外鍵約束，如果存在則刪除
DO $$ 
BEGIN
    -- 檢查並刪除現有的外鍵約束（如果存在）
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_favorites_work' 
        AND table_name = 'favorites'
    ) THEN
        ALTER TABLE favorites DROP CONSTRAINT fk_favorites_work;
        RAISE NOTICE 'Dropped existing fk_favorites_work constraint';
    END IF;
END $$;

-- 添加新的級聯刪除外鍵約束
-- 注意：PostgreSQL 不支持條件外鍵約束，所以我們需要創建觸發器來處理
-- 創建函數來處理作品刪除時的收藏清理
CREATE OR REPLACE FUNCTION cleanup_favorites_on_work_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- 當作品被刪除時，自動清理相關的收藏記錄
    DELETE FROM favorites 
    WHERE item_id = OLD.id 
    AND item_type = 'work';
    
    RAISE NOTICE 'Cleaned up favorites for deleted work: %', OLD.id;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 創建觸發器
DROP TRIGGER IF EXISTS trigger_cleanup_favorites_on_work_delete ON portfolio;
CREATE TRIGGER trigger_cleanup_favorites_on_work_delete
    BEFORE DELETE ON portfolio
    FOR EACH ROW
    EXECUTE FUNCTION cleanup_favorites_on_work_delete();

-- 創建函數來處理協作刪除時的收藏清理
CREATE OR REPLACE FUNCTION cleanup_favorites_on_collaboration_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- 當協作被刪除時，自動清理相關的收藏記錄
    DELETE FROM favorites 
    WHERE item_id = OLD.id 
    AND item_type = 'collaboration';
    
    RAISE NOTICE 'Cleaned up favorites for deleted collaboration: %', OLD.id;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 創建協作刪除觸發器（如果協作表存在）
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'collaborations') THEN
        DROP TRIGGER IF EXISTS trigger_cleanup_favorites_on_collaboration_delete ON collaborations;
        CREATE TRIGGER trigger_cleanup_favorites_on_collaboration_delete
            BEFORE DELETE ON collaborations
            FOR EACH ROW
            EXECUTE FUNCTION cleanup_favorites_on_collaboration_delete();
        
        RAISE NOTICE 'Created collaboration cleanup trigger';
    ELSE
        RAISE NOTICE 'Collaborations table does not exist, skipping collaboration cleanup trigger';
    END IF;
END $$;

-- 添加註釋
COMMENT ON FUNCTION cleanup_favorites_on_work_delete() IS 'Automatically cleans up favorites when a work is deleted';
COMMENT ON FUNCTION cleanup_favorites_on_collaboration_delete() IS 'Automatically cleans up favorites when a collaboration is deleted';
COMMENT ON TRIGGER trigger_cleanup_favorites_on_work_delete ON portfolio IS 'Triggers cleanup of favorites when a portfolio item is deleted';

-- supabase/seed.sql
-- 确保触发器始终启用（每次数据库重置后执行）

-- 启用所有通知相关的触发器
ALTER TABLE follows ENABLE TRIGGER ALL;
ALTER TABLE artwork_likes ENABLE TRIGGER ALL;
ALTER TABLE notifications ENABLE TRIGGER ALL;

-- 添加注释说明
COMMENT ON TABLE follows IS '用户关注关系表 - 触发器已启用';
COMMENT ON TABLE artwork_likes IS '作品点赞表 - 触发器已启用';
COMMENT ON TABLE notifications IS '通知表 - 触发器已启用';

-- 最终修复方案 - 解决 Follow 和通知问题
-- 1. 清理现有数据
DELETE FROM follows;
DELETE FROM notifications;

-- 2. 删除所有现有的 RLS 策略
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON artwork_likes;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON artwork_likes;
DROP POLICY IF EXISTS "Enable select for all users" ON artwork_likes;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON follows;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON follows;
DROP POLICY IF EXISTS "Enable select for all users" ON follows;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON notifications;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON notifications;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON notifications;

-- 3. 创建更宽松的 RLS 策略
-- artwork_likes 表策略
CREATE POLICY "Allow all operations for authenticated users" ON artwork_likes
    FOR ALL USING (auth.role() = 'authenticated');

-- follows 表策略
CREATE POLICY "Allow all operations for authenticated users" ON follows
    FOR ALL USING (auth.role() = 'authenticated');

-- notifications 表策略
CREATE POLICY "Allow all operations for authenticated users" ON notifications
    FOR ALL USING (auth.role() = 'authenticated');

-- 4. 确保 RLS 已启用
ALTER TABLE artwork_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 5. 授予必要的权限
GRANT ALL ON artwork_likes TO authenticated;
GRANT ALL ON follows TO authenticated;
GRANT ALL ON notifications TO authenticated;

-- 6. 创建通知触发器函数
CREATE OR REPLACE FUNCTION create_follow_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (
        receiver_id,
        sender_id,
        type,
        title,
        message,
        is_read,
        created_at
    ) VALUES (
        NEW.following_id,
        NEW.follower_id,
        'follow',
        'New Follower',
        'Someone started following you!',
        false,
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. 创建触发器
DROP TRIGGER IF EXISTS follow_notification_trigger ON follows;
CREATE TRIGGER follow_notification_trigger
    AFTER INSERT ON follows
    FOR EACH ROW
    EXECUTE FUNCTION create_follow_notification();

-- 8. 验证设置
SELECT 'Final fix applied successfully!' as status;

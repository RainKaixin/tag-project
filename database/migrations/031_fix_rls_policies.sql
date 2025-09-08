-- 修复 RLS 策略和权限问题
-- 确保 follows 和 notifications 表可以正常工作

-- 1. 删除所有现有的 RLS 策略
DROP POLICY IF EXISTS "Users can insert their own likes" ON artwork_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON artwork_likes;
DROP POLICY IF EXISTS "Users can view all likes" ON artwork_likes;
DROP POLICY IF EXISTS "Users can insert their own follows" ON follows;
DROP POLICY IF EXISTS "Users can delete their own follows" ON follows;
DROP POLICY IF EXISTS "Users can view all follows" ON follows;
DROP POLICY IF EXISTS "Users can view notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert notifications" ON notifications;

-- 2. 创建更宽松的 RLS 策略（临时解决方案）
-- artwork_likes 表策略
CREATE POLICY "Enable insert for authenticated users" ON artwork_likes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON artwork_likes
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable select for all users" ON artwork_likes
    FOR SELECT USING (true);

-- follows 表策略
CREATE POLICY "Enable insert for authenticated users" ON follows
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON follows
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable select for all users" ON follows
    FOR SELECT USING (true);

-- notifications 表策略
CREATE POLICY "Enable select for authenticated users" ON notifications
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON notifications
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON notifications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. 确保 RLS 已启用
ALTER TABLE artwork_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 4. 授予必要的权限
GRANT ALL ON artwork_likes TO authenticated;
GRANT ALL ON follows TO authenticated;
GRANT ALL ON notifications TO authenticated;

-- 5. 创建通知触发器函数（如果不存在）
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

-- 6. 创建触发器（如果不存在）
DROP TRIGGER IF EXISTS follow_notification_trigger ON follows;
CREATE TRIGGER follow_notification_trigger
    AFTER INSERT ON follows
    FOR EACH ROW
    EXECUTE FUNCTION create_follow_notification();

-- 7. 验证设置
SELECT 'RLS policies and permissions updated!' as status;

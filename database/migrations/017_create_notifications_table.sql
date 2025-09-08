-- 创建 notifications 表
-- 用于存储用户通知信息，包括点赞、评论、关注等通知

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 通知类型：like, comment, follow, collaboration 等
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- 发送者ID（可为空，如系统通知）
  sender_name VARCHAR(255), -- 发送者姓名（冗余字段，避免频繁JOIN）
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- 接收者ID
  title VARCHAR(255) NOT NULL, -- 通知标题
  content TEXT NOT NULL, -- 通知内容
  message TEXT NOT NULL, -- 通知消息（完整消息）
  is_read BOOLEAN DEFAULT FALSE, -- 是否已读
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- 创建时间
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- 更新时间
  
  -- 元数据字段（JSON格式存储额外信息）
  meta JSONB DEFAULT '{}', -- 存储 workId, workTitle, commentContent 等额外信息
  
  -- 约束：发送者不能是接收者（除非是系统通知）
  CONSTRAINT check_sender_not_receiver CHECK (
    sender_id IS NULL OR sender_id != receiver_id
  )
);

-- 启用 RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略

-- 允许认证用户查看自己的通知
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = receiver_id);

-- 允许认证用户创建通知（发送给其他用户）
CREATE POLICY "Users can create notifications for others" ON notifications
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND 
    sender_id != receiver_id
  );

-- 允许认证用户更新自己的通知（标记为已读等）
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = receiver_id);

-- 允许认证用户删除自己的通知
CREATE POLICY "Users can delete their own notifications" ON notifications
  FOR DELETE USING (auth.uid() = receiver_id);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_notifications_receiver_id ON notifications(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_sender_id ON notifications(sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- 创建复合索引
CREATE INDEX IF NOT EXISTS idx_notifications_receiver_unread ON notifications(receiver_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_receiver_type ON notifications(receiver_id, type);
CREATE INDEX IF NOT EXISTS idx_notifications_receiver_created ON notifications(receiver_id, created_at DESC);

-- 创建 updated_at 触发器
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 创建函数：获取用户未读通知数量
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM notifications
  WHERE receiver_id = p_user_id AND is_read = FALSE;
  
  RETURN COALESCE(v_count, 0);
END;
$$;

-- 创建函数：标记用户所有通知为已读
CREATE OR REPLACE FUNCTION mark_all_notifications_as_read(p_user_id UUID)
RETURNS TABLE(
  success BOOLEAN,
  updated_count INTEGER,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_updated_count INTEGER;
BEGIN
  UPDATE notifications 
  SET is_read = TRUE, updated_at = NOW()
  WHERE receiver_id = p_user_id AND is_read = FALSE;
  
  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  
  RETURN QUERY SELECT TRUE, v_updated_count, NULL::TEXT;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT FALSE, 0, SQLERRM;
END;
$$;

-- 添加注释
COMMENT ON TABLE notifications IS '用户通知表，存储点赞、评论、关注等通知信息';
COMMENT ON COLUMN notifications.type IS '通知类型：like(点赞), comment(评论), follow(关注), collaboration(协作)';
COMMENT ON COLUMN notifications.sender_id IS '发送者用户ID，可为空（系统通知）';
COMMENT ON COLUMN notifications.sender_name IS '发送者姓名，冗余字段避免频繁JOIN';
COMMENT ON COLUMN notifications.receiver_id IS '接收者用户ID';
COMMENT ON COLUMN notifications.title IS '通知标题';
COMMENT ON COLUMN notifications.content IS '通知内容摘要';
COMMENT ON COLUMN notifications.message IS '完整通知消息';
COMMENT ON COLUMN notifications.is_read IS '是否已读';
COMMENT ON COLUMN notifications.meta IS '元数据，JSON格式存储额外信息如workId、workTitle等';

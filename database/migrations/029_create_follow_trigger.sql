-- 创建 Follow 通知触发器
-- 当用户关注时自动创建通知

-- 1. 创建通知创建函数
CREATE OR REPLACE FUNCTION create_follow_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- 插入关注通知
  INSERT INTO notifications (
    type,
    sender_id,
    sender_name,
    receiver_id,
    title,
    content,
    message,
    is_read,
    created_at,
    meta
  ) VALUES (
    'follow',
    NEW.follower_id,
    (SELECT full_name FROM profiles WHERE id = NEW.follower_id),
    NEW.following_id,
    'New Follower',
    (SELECT full_name FROM profiles WHERE id = NEW.follower_id) || ' followed you',
    (SELECT full_name FROM profiles WHERE id = NEW.follower_id) || ' followed you',
    false,
    NOW(),
    jsonb_build_object(
      'action', 'follow',
      'followerId', NEW.follower_id,
      'followerName', (SELECT full_name FROM profiles WHERE id = NEW.follower_id)
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. 创建触发器
DROP TRIGGER IF EXISTS follow_notification_trigger ON follows;

CREATE TRIGGER follow_notification_trigger
  AFTER INSERT ON follows
  FOR EACH ROW
  EXECUTE FUNCTION create_follow_notification();

-- 3. 显示完成信息
DO $$
BEGIN
  RAISE NOTICE '🎯 Follow 通知触发器创建完成！';
  RAISE NOTICE '📋 功能说明:';
  RAISE NOTICE '   1. 当用户关注时自动创建通知';
  RAISE NOTICE '   2. 通知包含关注者姓名和相关信息';
  RAISE NOTICE '   3. 通知自动标记为未读';
  RAISE NOTICE '✅ 现在 Follow 功能应该能正常创建通知了！';
END $$;

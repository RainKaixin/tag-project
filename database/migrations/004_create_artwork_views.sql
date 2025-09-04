-- 创建artwork_views表
CREATE TABLE IF NOT EXISTS public.artwork_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    artwork_id UUID NOT NULL REFERENCES public.portfolio(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    visitor_fingerprint TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_artwork_views_artwork_id ON public.artwork_views(artwork_id);
CREATE INDEX IF NOT EXISTS idx_artwork_views_user_id ON public.artwork_views(user_id);
CREATE INDEX IF NOT EXISTS idx_artwork_views_viewed_at ON public.artwork_views(viewed_at);

-- 启用RLS
ALTER TABLE public.artwork_views ENABLE ROW LEVEL SECURITY;

-- RLS策略：允许任何人插入浏览记录
CREATE POLICY "Anyone can insert artwork views" ON public.artwork_views
    FOR INSERT WITH CHECK (true);

-- RLS策略：允许认证用户查看自己的浏览记录
CREATE POLICY "Users can view their own artwork views" ON public.artwork_views
    FOR SELECT USING (auth.uid() = user_id);

-- 创建increment_artwork_views函数
CREATE OR REPLACE FUNCTION public.increment_artwork_views(
    p_artwork_id UUID,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_visitor_fingerprint TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_view_id UUID;
    v_result JSON;
BEGIN
    -- 插入新的浏览记录
    INSERT INTO public.artwork_views (
        artwork_id,
        ip_address,
        user_agent,
        user_id,
        visitor_fingerprint
    ) VALUES (
        p_artwork_id,
        p_ip_address,
        p_user_agent,
        p_user_id,
        p_visitor_fingerprint
    ) RETURNING id INTO v_view_id;

    -- 返回成功结果
    v_result := json_build_object(
        'success', true,
        'view_id', v_view_id,
        'message', 'Artwork view recorded successfully'
    );

    RETURN v_result;

EXCEPTION
    WHEN OTHERS THEN
        -- 返回错误结果
        v_result := json_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Failed to record artwork view'
        );
        RETURN v_result;
END;
$$;

-- 创建get_artwork_view_count函数
CREATE OR REPLACE FUNCTION public.get_artwork_view_count(
    p_artwork_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count BIGINT;
    v_result JSON;
BEGIN
    -- 获取作品的总浏览量
    SELECT COUNT(*) INTO v_count
    FROM public.artwork_views
    WHERE artwork_id = p_artwork_id;

    -- 返回结果
    v_result := json_build_object(
        'success', true,
        'count', v_count,
        'artwork_id', p_artwork_id
    );

    RETURN v_result;

EXCEPTION
    WHEN OTHERS THEN
        -- 返回错误结果
        v_result := json_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Failed to get artwork view count'
        );
        RETURN v_result;
END;
$$;

-- 授予执行权限
GRANT EXECUTE ON FUNCTION public.increment_artwork_views(UUID, INET, TEXT, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_artwork_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_artwork_views(UUID, INET, TEXT, UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_artwork_view_count(UUID) TO anon;

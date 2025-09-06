-- =========================================================
-- TAG Gallery Phase 1: 修正版（幂等，可反复执行）
-- 关键修复：handle_new_user() 改为 SECURITY DEFINER +
--          为 supabase_auth_admin 增加插入 profiles 的策略
-- =========================================================

-- 0) 扩展
create extension if not exists pgcrypto;
create extension if not exists citext;

-- =========================================================
-- 1) 核心表结构
-- =========================================================

-- 1.1 用户档案：profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name   text default '',
  title       text default 'Artist',
  school      text default '',
  pronouns    text default '',
  majors      text[] default array[]::text[],
  minors      text[] default array[]::text[],
  skills      text[] default array[]::text[],
  bio         text default '',
  social_links jsonb default '{}'::jsonb,
  avatar_url  text default '',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 1.2 作品集：portfolio
create table if not exists public.portfolio (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description  text default '',
  category     text default '',
  tags         text[] default array[]::text[],
  image_paths  text[] default array[]::text[],
  thumbnail_path text default '',
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 加固：user_id 必填（如已是 NOT NULL 会静默通过）
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='portfolio'
      and column_name='user_id' and is_nullable='YES'
  ) then
    execute 'alter table public.portfolio alter column user_id set not null';
  end if;
end $$;

-- 1.3 关注关系：follows
create table if not exists public.follows (
  follower_id  uuid references auth.users(id) on delete cascade,
  following_id uuid references auth.users(id) on delete cascade,
  created_at   timestamptz default now(),
  primary key (follower_id, following_id)
);

-- 禁止自关注（幂等）
do $$
begin
  begin
    alter table public.follows
      add constraint follows_no_self_follow check (follower_id <> following_id);
  exception when duplicate_object then
    -- already exists
  end;
end $$;

-- 1.4 点赞：likes
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  portfolio_id uuid references public.portfolio(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(user_id, portfolio_id)
);

-- =========================================================
-- 2) 启用 RLS
-- =========================================================
alter table public.profiles  enable row level security;
alter table public.portfolio enable row level security;
alter table public.follows   enable row level security;
alter table public.likes     enable row level security;

-- =========================================================
-- 3) RLS 策略（先删后建，保证幂等）
-- =========================================================

-- 3.1 profiles
drop policy if exists "Anyone can view profiles"     on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Auth can create profile"      on public.profiles;

create policy "Anyone can view profiles" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- 保险：允许 GoTrue 内部角色插入（触发器为 invoker 时也不至于失败）
create policy "Auth can create profile" on public.profiles
  for insert to supabase_auth_admin
  with check (true);

-- 3.2 portfolio
drop policy if exists "Anyone can view public portfolios" on public.portfolio;
drop policy if exists "Users can view own portfolios"      on public.portfolio;
drop policy if exists "Users can insert own portfolios"    on public.portfolio;
drop policy if exists "Users can update own portfolios"    on public.portfolio;
drop policy if exists "Users can delete own portfolios"    on public.portfolio;

create policy "Anyone can view public portfolios" on public.portfolio
  for select using (is_public = true);

create policy "Users can view own portfolios" on public.portfolio
  for select using (auth.uid() = user_id);

create policy "Users can insert own portfolios" on public.portfolio
  for insert with check (auth.uid() = user_id);

create policy "Users can update own portfolios" on public.portfolio
  for update using (auth.uid() = user_id);

create policy "Users can delete own portfolios" on public.portfolio
  for delete using (auth.uid() = user_id);

-- 3.3 follows
drop policy if exists "Anyone can view follows"      on public.follows;
drop policy if exists "Users can manage own follows" on public.follows;
drop policy if exists "Users can insert own follows" on public.follows;

create policy "Anyone can view follows" on public.follows
  for select using (true);

create policy "Users can manage own follows" on public.follows
  for all using (auth.uid() = follower_id);

create policy "Users can insert own follows" on public.follows
  for insert with check (auth.uid() = follower_id and follower_id <> following_id);

-- 3.4 likes
drop policy if exists "Anyone can view likes"       on public.likes;
drop policy if exists "Users can manage own likes"  on public.likes;
drop policy if exists "Users can insert own likes"  on public.likes;

create policy "Anyone can view likes" on public.likes
  for select using (true);

create policy "Users can manage own likes" on public.likes
  for all using (auth.uid() = user_id);

create policy "Users can insert own likes" on public.likes
  for insert with check (auth.uid() = user_id);

-- =========================================================
-- 4) 索引
-- =========================================================
create index if not exists idx_profiles_created_at   on public.profiles(created_at);
create index if not exists idx_portfolio_user_id     on public.portfolio(user_id);
create index if not exists idx_portfolio_is_public   on public.portfolio(is_public);
create index if not exists idx_portfolio_created_at  on public.portfolio(created_at);
create index if not exists idx_follows_follower_id   on public.follows(follower_id);
create index if not exists idx_follows_following_id  on public.follows(following_id);
create index if not exists idx_likes_user_id         on public.likes(user_id);
create index if not exists idx_likes_portfolio_id    on public.likes(portfolio_id);

-- =========================================================
-- 5) updated_at 自动维护
-- =========================================================
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_profiles_updated_at  on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_portfolio_updated_at on public.portfolio;
create trigger update_portfolio_updated_at
  before update on public.portfolio
  for each row execute function public.update_updated_at_column();

-- =========================================================
-- 6) 新用户自动创建空白档案（修复点）
-- =========================================================
-- 关键：security definer + 显式 schema 限定，绕过 RLS
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, full_name, title, school, pronouns,
    majors, minors, skills, bio, social_links, avatar_url
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'title', 'Artist'),
    coalesce(new.raw_user_meta_data->>'school', ''),
    coalesce(new.raw_user_meta_data->>'pronouns', ''),
    array[]::text[], array[]::text[], array[]::text[],
    '',
    '{"instagram":"","portfolio":"","discord":"","otherLinks":[]}'::jsonb,
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 触发器幂等重建
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 避免 PUBLIC 滥用函数（保留所有者执行即可）
revoke all on function public.handle_new_user() from public;

-- =========================================================
-- 7) Storage Buckets 与策略（头像/作品）
-- =========================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars',   'avatars',   true,  2097152,  array['image/jpeg','image/png','image/gif','image/webp']),
  ('portfolio', 'portfolio', true, 10485760,  array['image/jpeg','image/png','image/gif','image/webp','application/pdf'])
on conflict (id) do nothing;

-- 统一清理旧策略（幂等）
drop policy if exists "Users can upload own avatar"            on storage.objects;
drop policy if exists "Anyone can view avatars"                on storage.objects;
drop policy if exists "Users can update own avatar"            on storage.objects;
drop policy if exists "Users can delete own avatar"            on storage.objects;
drop policy if exists "Users can upload own portfolio"         on storage.objects;
drop policy if exists "Anyone can view portfolio files"        on storage.objects;
drop policy if exists "Users can update own portfolio files"   on storage.objects;
drop policy if exists "Users can delete own portfolio files"   on storage.objects;

-- avatars
create policy "Users can upload own avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Anyone can view avatars" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Users can update own avatar" on storage.objects
  for update using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own avatar" on storage.objects
  for delete using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- portfolio
create policy "Users can upload own portfolio" on storage.objects
  for insert with check (
    bucket_id = 'portfolio' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Anyone can view portfolio files" on storage.objects
  for select using (bucket_id = 'portfolio');

create policy "Users can update own portfolio files" on storage.objects
  for update using (
    bucket_id = 'portfolio' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own portfolio files" on storage.objects
  for delete using (
    bucket_id = 'portfolio' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- =========================================================
-- 8) 注释
-- =========================================================
comment on table public.profiles  is '用户档案表：基本信息与社交链接';
comment on table public.portfolio is '作品集表：上传的作品与元数据';
comment on table public.follows   is '关注关系表';
comment on table public.likes     is '点赞表';

-- =========================================================
-- 9) 新增：包含艺术家信息的作品视图（解决 "Unknown Artist" 问题）
-- =========================================================

-- 创建包含艺术家信息的作品视图
create or replace view public.portfolio_with_artist as
select 
    p.id,
    p.user_id,
    p.title,
    p.description,
    p.category,
    p.tags,
    p.image_paths,
    p.thumbnail_path,
    p.is_public,
    p.created_at,
    p.updated_at,
    -- 艺术家信息
    coalesce(pr.full_name, 'Unknown Artist') as artist_name,
    coalesce(pr.avatar_url, '') as artist_avatar,
    coalesce(pr.title, 'Artist') as artist_role
from public.portfolio p
left join public.profiles pr on p.user_id = pr.id
where p.is_public = true;

-- 为视图添加注释
comment on view public.portfolio_with_artist is '包含艺术家信息的公开作品视图，用于 Gallery 页面显示，解决 "Unknown Artist" 问题';

-- 为视图创建索引（通过底层表）
create index if not exists idx_portfolio_with_artist_created_at on public.portfolio(created_at);
create index if not exists idx_portfolio_with_artist_user_id on public.portfolio(user_id);
create index if not exists idx_portfolio_with_artist_is_public on public.portfolio(is_public);


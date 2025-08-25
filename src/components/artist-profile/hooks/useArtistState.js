// use-artist-state v2: 艺术家档案状态管理Hook

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { getPublicPortfolio } from '../../../services/supabase/portfolio';
import { getCurrentUser } from '../../../utils/currentUser.js';
import {
  getArtistById,
  getCollaborationsData,
  invalidate,
} from '../utils/artistHelpers';

/**
 * 艺术家档案状态管理Hook
 * @returns {Object} 状态和设置函数
 */
const useArtistState = () => {
  const { id: routeArtistId } = useParams();
  const location = useLocation();
  // 修复路由判断：同时支持 /me 和 /artist/me 路由
  const isMeRoute =
    location.pathname === '/me' || location.pathname === '/artist/me';

  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const currentUserId = currentUser?.id?.toString?.() ?? null;

  // ！！！用独立状态存"被查看者"
  const [viewedUser, setViewedUser] = useState(null);
  const [viewedArtworks, setViewedArtworks] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(156);
  const [expandedCardId, setExpandedCardId] = useState(null);

  // 监听用户切换事件
  useEffect(() => {
    const handleUserChange = () => setCurrentUser(getCurrentUser());
    window.addEventListener('user:changed', handleUserChange);
    return () => window.removeEventListener('user:changed', handleUserChange);
  }, []);

  // 监听头像更新事件，清除相关缓存并更新头像
  useEffect(() => {
    const handleAvatarUpdate = async event => {
      const { userId, avatarUrl } = event.detail;
      if (userId) {
        console.log(
          '[ArtistProfile] Avatar updated, clearing cache for user:',
          userId
        );
        invalidate(['artist', userId]);

        // 如果是当前用户，直接更新头像并重新获取艺术家数据
        if (userId === currentUserId && isMeRoute) {
          setViewedUser(prev => ({
            ...prev,
            avatar: avatarUrl,
          }));
          console.log(
            '[ArtistProfile] Updated avatar for current user:',
            avatarUrl?.substring(0, 30)
          );

          // 重新获取艺术家数据以确保所有数据都是最新的
          const artist = await getArtistById(currentUserId);
          if (artist) {
            setViewedUser(artist);
            console.log(
              '[ArtistProfile] Refreshed artist data after avatar update'
            );
          }
        }
      }
    };

    window.addEventListener('avatar:updated', handleAvatarUpdate);
    return () =>
      window.removeEventListener('avatar:updated', handleAvatarUpdate);
  }, [currentUserId, isMeRoute]);

  // 监听档案更新事件，清除相关缓存
  useEffect(() => {
    const handleProfileUpdate = event => {
      const profile = event.detail;
      if (profile && profile.id) {
        console.log(
          '[ArtistProfile] Profile updated, clearing cache for user:',
          profile.id
        );
        invalidate(['artist', profile.id]);
      }
    };

    window.addEventListener('profile:updated', handleProfileUpdate);
    return () =>
      window.removeEventListener('profile:updated', handleProfileUpdate);
  }, []);

  // 监听档案更新事件
  useEffect(() => {
    const handleProfileUpdate = async event => {
      const profile = event.detail;

      // 如果是当前用户的档案更新，且当前在 /me 页面
      if (profile?.id === currentUserId && isMeRoute) {
        // 更新艺术家数据
        setViewedUser(prev => ({
          ...prev,
          title: profile.title || prev?.title,
          school: profile.school || prev?.school,
          pronouns: profile.pronouns || prev?.pronouns,
          majors: profile.majors || prev?.majors,
          minors: profile.minors || prev?.minors,
          skills: profile.skills || prev?.skills,
          bio: profile.bio || prev?.bio,
        }));
      }
    };

    window.addEventListener('profile:updated', handleProfileUpdate);
    return () =>
      window.removeEventListener('profile:updated', handleProfileUpdate);
  }, [currentUserId, isMeRoute]);

  // 监听作品更新事件 - 暂时移除，因为 Supabase 有实时订阅功能
  // 如果需要实时更新，可以使用 Supabase 的 realtime 功能

  // 页面初始化时滚动到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // ！！！按路由 id 拉取被查看者数据
  useEffect(() => {
    let alive = true;
    const fetch = async () => {
      setLoading(true);
      // 重置状态，避免显示上一个用户的数据
      setIsFollowing(false);
      setFollowersCount(0);
      setExpandedCardId(null);

      // /me 路由使用统一的 getArtistById 获取数据
      if (isMeRoute) {
        if (currentUser) {
          // 使用统一的 getArtistById 获取艺术家数据
          const artist = await getArtistById(currentUser.id);
          if (artist) {
            setViewedUser(artist);
          } else {
            console.error(
              '[ArtistProfile] Failed to get artist data for current user'
            );
            setViewedUser(null);
          }

          // 获取用户的作品数据
          console.log(
            '[ArtistProfile] Loading portfolio for user:',
            currentUser.id
          );
          const portfolioResult = await getPublicPortfolio(currentUser.id);
          console.log(
            '[ArtistProfile] Portfolio load result:',
            portfolioResult
          );

          if (portfolioResult.success) {
            // 转换作品数据格式以匹配现有的 portfolio 格式
            const portfolioArtworks = portfolioResult.data.map(item => ({
              id: item.id,
              title: item.title,
              image:
                item.thumbnailPath ||
                (item.imagePaths && item.imagePaths[0]) ||
                '',
              category: item.category,
              tags: item.tags,
              description: item.description,
            }));
            console.log(
              '[ArtistProfile] Setting portfolio artworks:',
              portfolioArtworks
            );
            setViewedArtworks(portfolioArtworks);
          } else {
            console.log(
              '[ArtistProfile] Failed to load portfolio, using default portfolio'
            );
            setViewedArtworks(currentUser.portfolio || []);
          }

          // 获取协作数据
          const cols = await getCollaborationsData(currentUser.id);
          setCollaborations(cols);

          // 使用统一的艺术家数据设置粉丝数
          if (artist) {
            setFollowersCount(artist.stats.followers);
          }
        }
        setLoading(false);
        return;
      }

      // 他人视角按 routeParam 拉取
      try {
        let id = routeArtistId?.toString?.();

        // 如果 ID 是 "me"，使用当前用户 ID
        if (id === 'me') {
          id = currentUserId;
          console.log('[ArtistProfile] ID is "me", using current user ID:', id);
        }

        const artist = await getArtistById(id);

        // 获取用户的作品数据
        const visitorPortfolioResult = await getPublicPortfolio(id);
        let artworks = [];
        if (visitorPortfolioResult.success) {
          // 转换作品数据格式以匹配现有的 portfolio 格式
          artworks = visitorPortfolioResult.data.map(item => ({
            id: item.id,
            title: item.title,
            image:
              item.thumbnailPath ||
              (item.imagePaths && item.imagePaths[0]) ||
              '',
            category: item.category,
            tags: item.tags,
            description: item.description,
          }));
        }

        const cols = await getCollaborationsData(id);
        if (!alive) return;

        if (artist) {
          setViewedUser(artist);
          setViewedArtworks(artworks);
          setCollaborations(cols);

          // 确保粉丝数初始值与数据一致
          if (artist?.stats?.followers !== undefined) {
            setFollowersCount(artist.stats.followers);
          }
        } else {
          setViewedUser(null);
          setViewedArtworks([]);
          setCollaborations([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    if (isMeRoute || routeArtistId) {
      fetch();
    }
    return () => {
      alive = false;
    };
  }, [routeArtistId, isMeRoute, currentUserId, currentUser]);

  // ！！！身份判定：/me 路由或用户ID匹配
  const isOwnProfile = useMemo(() => {
    // /me 路由或 /artist/me 路由一定是自己的页面
    if (isMeRoute) return true;

    // 如果路由参数是 "me"，也是自己的页面
    if (routeArtistId === 'me') return true;

    // 其他路由（如 /artist/alice）都是访客视角，即使是自己的页面
    return false;
  }, [isMeRoute, routeArtistId]);

  // 判断是否显示"Back to Owner View"按钮
  const shouldShowBackToOwnerView = useMemo(() => {
    // 只有在预览模式下才显示 Back to Owner View 按钮
    // 访客视角（如 /artist/alice）始终显示 Follow 按钮
    return false; // 暂时禁用，因为预览模式逻辑需要进一步实现
  }, []);

  const toggleFollow = useCallback(() => {
    // 先更新关注状态，再更新粉丝数
    setIsFollowing(prev => {
      const next = !prev;
      return next;
    });

    // 单独更新粉丝数
    setFollowersCount(prev => {
      const newCount = isFollowing ? prev - 1 : prev + 1;
      return newCount;
    });
  }, [isFollowing]);

  const toggleExpandedCard = cardId => {
    setExpandedCardId(prev => (prev === cardId ? null : cardId));
  };

  return {
    loading,
    currentUser, // 登录者
    artist: viewedUser, // 被查看者（页面主体请用这个）
    artworks: viewedArtworks,
    collaborations,
    isFollowing,
    followersCount,
    expandedCardId,
    isOwnProfile,
    shouldShowBackToOwnerView,
    setCurrentUser,
    setIsFollowing,
    setFollowersCount,
    setExpandedCardId,
    toggleFollow,
    toggleExpandedCard,
  };
};

export default useArtistState;

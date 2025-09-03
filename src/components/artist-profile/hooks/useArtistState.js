// use-artist-state v2: 艺术家档案状态管理Hook

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { useAppContext } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { getPublicPortfolio } from '../../../services/supabase/portfolio';
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
  const { state: appState } = useAppContext();
  const { user: authUser } = useAuth();

  // 修复路由判断：同时支持 /me 和 /artist/me 路由
  const isMeRoute =
    location.pathname === '/me' || location.pathname === '/artist/me';

  const currentUserId = authUser?.id?.toString?.() ?? null;

  // ！！！用独立状态存"被查看者"
  const [viewedUser, setViewedUser] = useState(null);
  const [viewedArtworks, setViewedArtworks] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(156);
  const [expandedCardId, setExpandedCardId] = useState(null);

  // 获取来源信息
  const getSourceInfo = useMemo(() => {
    if (appState.navigationHistory.length > 0) {
      const lastHistory =
        appState.navigationHistory[appState.navigationHistory.length - 1];
      return {
        from: lastHistory.from || 'gallery',
        activeTab: lastHistory.activeTab || 'Works',
      };
    }
    return {
      from: 'gallery',
      activeTab: 'Works',
    };
  }, [appState.navigationHistory]);

  // 监听认证用户变化，清理艺术家缓存
  useEffect(() => {
    if (routeArtistId) {
      invalidate(['artist', routeArtistId.toString()]);
    }
  }, [routeArtistId, authUser?.id]);

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

        // 如果是当前查看的用户，更新头像
        const targetUserId = isMeRoute
          ? currentUserId
          : routeArtistId?.toString();
        if (userId === targetUserId) {
          setViewedUser(prev => ({
            ...prev,
            avatar: avatarUrl,
          }));

          // 重新获取艺术家数据以确保所有数据都是最新的
          const artist = await getArtistById(targetUserId);
          if (artist) {
            setViewedUser(artist);
          }
        }
      }
    };

    window.addEventListener('avatar:updated', handleAvatarUpdate);
    return () =>
      window.removeEventListener('avatar:updated', handleAvatarUpdate);
  }, [currentUserId, routeArtistId, isMeRoute]);

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

        // 如果是当前查看的用户，立即重新获取数据
        const targetUserId = isMeRoute
          ? currentUserId
          : routeArtistId?.toString();
        if (profile.id === targetUserId) {
          // 触发重新获取数据的逻辑
          setViewedUser(prev => ({ ...prev })); // 触发重新渲染
        }
      }
    };

    window.addEventListener('profile:updated', handleProfileUpdate);
    return () =>
      window.removeEventListener('profile:updated', handleProfileUpdate);
  }, [currentUserId, routeArtistId, isMeRoute]);

  // 监听档案更新事件
  useEffect(() => {
    const handleProfileUpdate = async event => {
      const profile = event.detail;

      // 如果是当前查看用户的档案更新
      const targetUserId = isMeRoute
        ? currentUserId
        : routeArtistId?.toString();
      if (profile?.id === targetUserId) {
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
  }, [currentUserId, routeArtistId, isMeRoute]);

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

      // 确定要查看的用户ID
      let targetUserId = null;

      if (isMeRoute) {
        // /me 路由：查看当前用户
        targetUserId = currentUserId;
      } else if (routeArtistId) {
        // /artist/:id 路由：查看指定用户
        targetUserId = routeArtistId.toString();

        // 如果 ID 是 "me"，使用当前用户 ID
        if (targetUserId === 'me') {
          targetUserId = currentUserId;
        }
      }

      if (!targetUserId) {
        setLoading(false);
        return;
      }

      try {
        // 统一使用 getArtistById 获取艺术家数据
        const artist = await getArtistById(targetUserId);
        if (!alive) return;

        if (artist) {
          setViewedUser(artist);

          // 获取用户的作品数据
          const portfolioResult = await getPublicPortfolio(targetUserId);

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
            setViewedArtworks(portfolioArtworks);
          } else {
            setViewedArtworks([]);
          }

          // 获取协作数据
          const cols = await getCollaborationsData(targetUserId);
          setCollaborations(cols);

          // 使用统一的艺术家数据设置粉丝数
          if (artist?.stats?.followers !== undefined) {
            setFollowersCount(artist.stats.followers);
          }
        } else {
          setViewedUser(null);
          setViewedArtworks([]);
          setCollaborations([]);
        }
      } catch (error) {
        setViewedUser(null);
        setViewedArtworks([]);
        setCollaborations([]);
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
  }, [routeArtistId, isMeRoute, currentUserId]);

  // ！！！身份判定：只有 /me 路由才是所有者视角
  const isOwnProfile = useMemo(() => {
    // 只有 /me 路由或 /artist/me 路由才是自己的页面
    if (isMeRoute) {
      return true;
    }

    // 如果路由参数是 "me"，也是自己的页面
    if (routeArtistId === 'me') {
      return true;
    }

    // 所有 /artist/:id 路由（除了 /artist/me）都是访客视角
    // 即使是查看自己的页面，也应该是访客视角
    return false;
  }, [isMeRoute, routeArtistId]);

  // 判断是否显示"Back to Owner View"按钮
  const shouldShowBackToOwnerView = useMemo(() => {
    // 只有在 /artist/:id 路由且 ID 是当前用户ID时才显示
    if (
      !isMeRoute &&
      routeArtistId &&
      currentUserId &&
      routeArtistId.toString() === currentUserId.toString()
    ) {
      return true;
    }
    return false;
  }, [isMeRoute, routeArtistId, currentUserId]);

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
    currentUser: authUser, // 登录者（从 AuthContext 获取）
    artist: viewedUser, // 被查看者（页面主体请用这个）
    artworks: viewedArtworks,
    collaborations,
    isFollowing,
    setIsFollowing,
    followersCount,
    expandedCardId,
    isOwnProfile,
    shouldShowBackToOwnerView,
    sourceInfo: getSourceInfo, // 添加来源信息
    setFollowersCount,
    setExpandedCardId,
    toggleFollow,
    toggleExpandedCard,
  };
};

export default useArtistState;

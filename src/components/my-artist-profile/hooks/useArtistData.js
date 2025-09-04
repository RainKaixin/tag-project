// use-artist-data v1: 艺术家数据管理Hook
// 从 MyArtistProfile.js 中提取的状态管理逻辑

import { useState, useEffect } from 'react';

import { getProfile } from '../../../services';
import { getCurrentUser } from '../../../utils/currentUser.js';
import {
  getArtistData,
  getArtworksByUser,
  getArtworksByUserAsync,
  getCollaborationsData,
} from '../utils/artistDataHelpers';

/**
 * useArtistData Hook - 管理艺术家数据状态
 * @returns {Object} 状态和设置函数
 */
const useArtistData = () => {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 监听用户切换事件
  useEffect(() => {
    const handleUserChange = () => {
      const newUser = getCurrentUser();
      setCurrentUser(newUser);
    };

    window.addEventListener('user:changed', handleUserChange);
    return () => {
      window.removeEventListener('user:changed', handleUserChange);
    };
  }, []);

  // 监听档案更新事件
  useEffect(() => {
    const handleProfileUpdate = async event => {
      const profile = event.detail;

      // 如果是当前用户的档案更新
      if (profile?.id === currentUser?.id) {
        // 更新艺术家数据
        setArtist(prev => ({
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
  }, [currentUser?.id]);

  // 当用户变化时更新数据
  useEffect(() => {
    const loadArtistData = async () => {
      if (currentUser) {
        // 获取用户档案数据
        const profileResult = await getProfile(currentUser.id);
        const profile = profileResult.success ? profileResult.data : null;

        // 合并用户数据和档案数据
        const userWithProfile = {
          ...currentUser,
          title: profile?.title || currentUser.role,
          school: profile?.school || currentUser.school || '',
          pronouns: profile?.pronouns || currentUser.pronouns || '',
          majors: profile?.majors || currentUser.majors || [],
          minors: profile?.minors || [],
          skills: profile?.skills || currentUser.skills || [],
          bio: profile?.bio || currentUser.bio || '',
          socialLinks: {
            instagram: currentUser.socialLinks?.instagram || '',
            portfolio: currentUser.socialLinks?.portfolio || '',
            discord: currentUser.socialLinks?.discord || '',
            otherLinks: currentUser.socialLinks?.otherLinks || [],
          },
        };

        // 获取艺术家数据
        const artistData = getArtistData(userWithProfile);
        setArtist(artistData);

        // 获取作品数据（异步版本，支持图片URL转换）
        const artworksData = await getArtworksByUserAsync(currentUser);
        setArtworks(artworksData);

        // 获取合作项目数据
        const collaborationsData = getCollaborationsData();
        setCollaborations(collaborationsData);

        setIsLoading(false);
      }
    };

    loadArtistData();
  }, [currentUser]);

  return {
    currentUser,
    artist,
    artworks,
    collaborations,
    isLoading,
    setCurrentUser,
  };
};

export default useArtistData;

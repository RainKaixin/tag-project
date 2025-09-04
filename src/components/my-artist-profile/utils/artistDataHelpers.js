// artist-data-helpers v1: 艺术家数据工具函数
// 从 MyArtistProfile.js 中提取的数据处理逻辑

import { getPortfolioImageUrl } from '../../../services/supabase/portfolio';

/**
 * 根据当前用户获取艺术家数据
 * @param {Object} currentUser - 当前用户对象
 * @returns {Object} 艺术家数据
 */
export const getArtistData = currentUser => {
  return {
    id: 1,
    name: currentUser.name,
    title: currentUser.title || currentUser.role,
    discipline: currentUser.title || currentUser.role,
    avatar: currentUser.avatar,
    bio: currentUser.bio,
    school: currentUser.school || '',
    pronouns: currentUser.pronouns || '',
    majors: currentUser.majors || [],
    minors: currentUser.minors || [],
    skills: currentUser.skills || [
      currentUser.role,
      'Digital Art',
      'Creative Design',
    ],
    stats: {
      following: 28,
      followers: 156,
      collaborations: 12,
    },
    socialLinks: {
      instagram: currentUser.socialLinks?.instagram || '',
      portfolio: currentUser.socialLinks?.portfolio || '',
      discord: currentUser.socialLinks?.discord || '',
      otherLinks: currentUser.socialLinks?.otherLinks || [],
    },
  };
};

/**
 * 根据当前用户获取作品数据
 * @param {Object} currentUser - 当前用户对象
 * @returns {Array} 作品数组
 */
export const getArtworksByUser = currentUser => {
  if (!currentUser) {
    return getDefaultArtworks();
  }

  // 将用户的 portfolio 数据转换为作品格式
  return currentUser.portfolio.map((item, index) => ({
    id: item.id,
    title: item.title,
    image: item.thumb,
    category: item.category,
  }));
};

/**
 * 根据当前用户获取作品数据（异步版本，支持图片URL转换）
 * @param {Object} currentUser - 当前用户对象
 * @returns {Promise<Array>} 作品数组
 */
export const getArtworksByUserAsync = async currentUser => {
  if (!currentUser) {
    return getDefaultArtworks();
  }

  // 将用户的 portfolio 数据转换为作品格式，并转换图片URL
  const artworks = await Promise.all(
    currentUser.portfolio.map(async (item, index) => {
      const imagePath =
        item.thumb ||
        item.thumbnailPath ||
        (item.imagePaths && item.imagePaths[0]) ||
        null;

      // 转换图片路径为公开URL
      let image = '/assets/placeholder.svg';
      if (imagePath) {
        try {
          console.log(
            `[getArtworksByUserAsync] Converting image path: ${imagePath}`
          );
          const imageResult = await getPortfolioImageUrl(imagePath);
          console.log(
            `[getArtworksByUserAsync] Image conversion result:`,
            imageResult
          );
          if (
            imageResult &&
            imageResult.success &&
            imageResult.data &&
            imageResult.data.url
          ) {
            image = imageResult.data.url;
            console.log(
              `[getArtworksByUserAsync] Successfully converted to: ${image}`
            );
          } else {
            console.warn(
              `[getArtworksByUserAsync] Invalid image result:`,
              imageResult
            );
          }
        } catch (error) {
          console.warn(
            `[getArtworksByUserAsync] Failed to convert image path ${imagePath}:`,
            error
          );
        }
      }

      return {
        id: item.id,
        title: item.title,
        image: image,
        category: item.category,
      };
    })
  );

  return artworks;
};

/**
 * 获取默认作品数据（Alex 的作品）
 * @returns {Array} 默认作品数组
 */
export const getDefaultArtworks = () => {
  return [
    {
      id: 1,
      title: 'Abstract Geometric Design',
      image:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      category: 'Abstract',
    },
    {
      id: 2,
      title: 'Mountain Landscape',
      image:
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
      category: 'Landscape',
    },
    {
      id: 3,
      title: 'Urban Street Scene',
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      category: 'Photography',
    },
    {
      id: 4,
      title: 'Color Burst',
      image:
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop',
      category: 'Abstract',
    },
    {
      id: 5,
      title: 'Sunset Mountains',
      image:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      category: 'Landscape',
    },
    {
      id: 6,
      title: 'Teal Design',
      image:
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
      category: 'Design',
    },
    {
      id: 7,
      title: 'Cute Character',
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      category: 'Illustration',
    },
    {
      id: 8,
      title: 'Modern Building',
      image:
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop',
      category: 'Architecture',
    },
    {
      id: 9,
      title: 'Watercolor Flowers',
      image:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      category: 'Fine Art',
    },
  ];
};

/**
 * 获取合作项目数据
 * @returns {Array} 合作项目数组
 */
export const getCollaborationsData = () => {
  return [
    {
      id: 1,
      title: 'Animation Project with Jason K.',
      description:
        'Collaborated on character design and background illustrations for a short animated film project.',
      image:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      partner: 'Jason K.',
      partnerAvatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      completionDate: 'Completed May 2023',
      category: 'Animation',
      isInitiator: false,
      role: 'Character Designer',
      dateRange: 'March 2023 - May 2023',
      responsibility:
        'Responsible for visual design and facial animation of main characters, created complete design schemes for 5 core characters, and participated in unifying the background art style.',
      teamFeedback: {
        feedbacker: 'Jason K.',
        feedbackerRole: 'Project Director',
        content:
          'Alex demonstrated excellent creativity and technical skills in character design. His designs are not only beautiful but also serve the narrative well. He has a positive team collaboration attitude and is an important contributor to the project.',
      },
    },
    {
      id: 2,
      title: 'Brand Identity with Studio X',
      description:
        'Worked together on a complete brand identity system for a tech startup.',
      image:
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      partner: 'Studio X',
      partnerAvatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      completionDate: 'Completed March 2023',
      category: 'Branding',
      isInitiator: true,
      role: 'Project Owner',
      dateRange: 'January 2023 - March 2023',
      responsibility:
        'As project initiator, responsible for overall brand strategy development, leading the design team to complete the full visual identity system from logo design to brand guidelines.',
      teamFeedback: {
        feedbacker: 'Studio X Team',
        feedbackerRole: 'Creative Director',
        content:
          'Alex demonstrated excellent project leadership and design professionalism, accurately understanding client needs and transforming them into outstanding design solutions. The entire brand system received high recognition from clients.',
      },
    },
    {
      id: 3,
      title: 'UI Design with Mobile Team',
      description:
        'Collaborated on user interface design for a mobile application.',
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      partner: 'Mobile Team',
      partnerAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      completionDate: 'Completed January 2023',
      category: 'UI/UX',
      isInitiator: false,
      role: 'UI Designer',
      dateRange: 'November 2022 - January 2023',
      responsibility:
        'Responsible for main interface design of mobile applications, including user flow optimization, component library establishment, and interactive prototype creation, ensuring excellent user experience.',
      teamFeedback: {
        feedbacker: 'Sarah Chen',
        feedbackerRole: 'Product Manager',
        content:
          "Alex's UI design is both beautiful and practical, balancing visual effects and functional requirements well. His design thinking and technical implementation capabilities left a deep impression on the team.",
      },
    },
  ];
};

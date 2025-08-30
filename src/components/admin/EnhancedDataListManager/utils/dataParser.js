// 数据解析工具函数
// 用于解析不同类型的数据项信息

/**
 * 解析数据项信息
 * @param {Object} item - 数据项
 * @param {string} dataType - 数据类型
 * @param {number} index - 索引
 * @returns {Object} 解析后的信息
 */
export const parseItemInfo = (item, dataType, index) => {
  const defaultInfo = {
    title: `项目 ${index + 1}`,
    creator: '未知',
    createdAt: '未知',
    size: 0,
  };

  if (!item || typeof item !== 'object') {
    return defaultInfo;
  }

  // 根据数据类型解析不同字段
  switch (dataType) {
    case 'collaborations':
      return {
        title:
          item.title ||
          item.name ||
          item.collaborationTitle ||
          `协作项目 ${index + 1}`,
        creator:
          item.author?.name ||
          item.author?.id ||
          item.creator ||
          item.owner ||
          item.userId ||
          item.createdBy ||
          '未知',
        createdAt: item.createdAt || item.createdDate || item.date || '未知',
        size: JSON.stringify(item).length,
      };

    case 'portfolios':
      return {
        title: item.title || item.name || item.workTitle || `作品 ${index + 1}`,
        creator:
          item.author?.name ||
          item.artist ||
          item.creator ||
          item.userId ||
          '未知',
        createdAt: item.createdAt || item.uploadDate || item.date || '未知',
        size: JSON.stringify(item).length,
      };

    case 'comments':
      return {
        title:
          item.text || item.content
            ? (item.text || item.content).substring(0, 30) + '...'
            : `评论 ${index + 1}`,
        creator:
          item.authorName ||
          item.author?.name ||
          item.author ||
          item.userId ||
          item.commenter ||
          '未知',
        createdAt: item.createdAt || item.commentDate || item.date || '未知',
        size: JSON.stringify(item).length,
      };

    case 'notifications':
      return {
        title:
          item.title || item.message || item.content || `通知 ${index + 1}`,
        creator:
          item.senderName ||
          item.sender?.name ||
          item.senderId ||
          item.userId ||
          '未知',
        createdAt: item.createdAt || item.date || '未知',
        size: JSON.stringify(item).length,
      };

    case 'likes':
      return {
        title:
          item.workTitle ||
          item.title ||
          item.artworkTitle ||
          `点赞记录 ${index + 1}`,
        creator:
          item.userName ||
          item.user?.name ||
          item.userId ||
          item.likerId ||
          '未知',
        createdAt: item.createdAt || item.likedAt || item.date || '未知',
        size: JSON.stringify(item).length,
      };

    case 'views':
      // 浏览记录数据是统计格式，简化显示
      if (typeof item === 'object' && item.totalViews !== undefined) {
        return {
          title: `作品浏览统计 (ID: ${index + 1})`,
          creator: `总浏览量: ${item.totalViews}`,
          createdAt: `登录用户: ${item.userViews?.length || 0}, 访客: ${
            item.visitorViews?.length || 0
          }`,
          size: JSON.stringify(item).length,
        };
      } else {
        return {
          title: `浏览记录 ${index + 1}`,
          creator: '统计数据',
          createdAt: 'N/A',
          size: JSON.stringify(item).length,
        };
      }

    case 'drafts': {
      // 草稿数据解析 - 更全面的字段解析
      const draftTitle =
        item.title ||
        item.draftTitle ||
        item.name ||
        item.projectTitle ||
        item.collaborationTitle ||
        `草稿 ${index + 1}`;

      const draftCreator =
        item.userId ||
        item.author?.name ||
        item.author ||
        item.creator ||
        item.owner ||
        '未知';

      const draftTime = item.createdAt || item.updatedAt || item.date || '未知';

      return {
        title: draftTitle,
        creator: draftCreator,
        createdAt: draftTime,
        size: JSON.stringify(item).length,
      };
    }

    default:
      return {
        title: item.title || item.name || `项目 ${index + 1}`,
        creator: item.creator || item.author || '未知',
        createdAt: item.createdAt || item.date || '未知',
        size: JSON.stringify(item).length,
      };
  }
};

/**
 * 根据数据类型过滤localStorage键
 * @param {string} dataType - 数据类型
 * @returns {Array} 过滤后的键数组
 */
export const filterKeysByDataType = dataType => {
  const allKeys = Object.keys(localStorage);
  let filteredKeys = [];

  switch (dataType) {
    case 'collaborations':
      // 只包含正式的协作项目，排除草稿
      filteredKeys = allKeys.filter(
        key =>
          key.toLowerCase().includes('collaboration') && !key.includes('draft')
      );
      break;
    case 'portfolios':
      filteredKeys = allKeys.filter(key => key.startsWith('portfolio_'));
      break;
    case 'comments':
      filteredKeys = allKeys.filter(key => key.includes('comment'));
      break;
    case 'notifications':
      filteredKeys = allKeys.filter(key => key.includes('notification'));
      break;
    case 'likes':
      filteredKeys = allKeys.filter(key => key.includes('like'));
      break;
    case 'views':
      filteredKeys = allKeys.filter(key => key.includes('view'));
      break;
    case 'drafts':
      // 专门管理草稿数据
      filteredKeys = allKeys.filter(key => key.includes('draft'));
      break;
    default:
      filteredKeys = allKeys;
  }

  return filteredKeys;
};

/**
 * 构建数据列表
 * @param {Array} filteredKeys - 过滤后的键数组
 * @param {string} dataType - 数据类型
 * @returns {Array} 构建的数据列表
 */
export const buildDataList = (filteredKeys, dataType) => {
  return filteredKeys.map(key => {
    const value = localStorage.getItem(key);
    let parsedValue = null;
    let itemCount = 0;
    let preview = '';
    let items = [];

    try {
      parsedValue = JSON.parse(value);
      if (Array.isArray(parsedValue)) {
        itemCount = parsedValue.length;
        preview = `数组，包含 ${itemCount} 项`;
        items = parsedValue.map((item, index) => {
          // 解析每个项目的具体信息
          const itemInfo = parseItemInfo(item, dataType, index);
          return {
            id: item.id || item.collaborationId || `item_${index}`,
            groupKey: key, // 添加groupKey用于删除操作
            ...itemInfo,
            rawData: item,
          };
        });
      } else if (typeof parsedValue === 'object') {
        itemCount = Object.keys(parsedValue).length;
        preview = `对象，包含 ${itemCount} 个属性`;

        // 特殊处理草稿数据（按用户ID分组的对象）
        if (dataType === 'drafts' && key.includes('draft')) {
          const allDrafts = [];
          Object.entries(parsedValue).forEach(([userId, userDrafts]) => {
            if (Array.isArray(userDrafts)) {
              userDrafts.forEach((draft, index) => {
                const itemInfo = parseItemInfo(draft, dataType, index);
                allDrafts.push({
                  id: draft.id || `draft_${userId}_${index}`,
                  groupKey: key, // 添加groupKey用于删除操作
                  ...itemInfo,
                  rawData: draft,
                  userId: userId, // 保存用户ID信息
                  // 在标题中显示用户ID
                  title: `${itemInfo.title} (用户: ${userId})`,
                });
              });
            }
          });
          items = allDrafts;
        } else {
          // 处理普通对象数据
          items = Object.entries(parsedValue).map(([subKey, item], index) => {
            const itemInfo = parseItemInfo(item, dataType, index);
            return {
              id: subKey || `item_${index}`,
              groupKey: key, // 添加groupKey用于删除操作
              ...itemInfo,
              rawData: item,
            };
          });
        }
      } else {
        // 处理简单数据类型
        preview = `简单数据: ${typeof parsedValue}`;
        items = [
          {
            id: key,
            groupKey: key, // 添加groupKey用于删除操作
            title: key,
            creator: '系统',
            createdAt: '未知',
            size: JSON.stringify(parsedValue).length,
            rawData: parsedValue,
          },
        ];
      }
    } catch (error) {
      console.error('解析数据失败:', key, error);
      preview = '解析失败';
      items = [
        {
          id: key,
          groupKey: key, // 添加groupKey用于删除操作
          title: key,
          creator: '解析失败',
          createdAt: '未知',
          size: 0,
          rawData: null,
        },
      ];
    }

    return {
      key,
      preview,
      itemCount,
      items,
    };
  });
};

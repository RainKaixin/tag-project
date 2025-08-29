// EnhancedDataListManager.js - 增强版数据列表管理组件
// 能够显示每个项目的具体信息，支持跳转和精确删除

import React, { useState, useEffect } from 'react';

import ConfirmDialog from '../common/ConfirmDialog';

const EnhancedDataListManager = ({ dataType, onDeleteSelected }) => {
  const [dataList, setDataList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'table'

  // 获取数据列表
  useEffect(() => {
    loadDataList();
  }, [dataType]);

  const loadDataList = () => {
    try {
      const allKeys = Object.keys(localStorage);
      let filteredKeys = [];

      // 根据数据类型过滤
      switch (dataType) {
        case 'collaborations':
          // 只包含正式的协作项目，排除草稿
          filteredKeys = allKeys.filter(
            key =>
              key.toLowerCase().includes('collaboration') &&
              !key.includes('draft')
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

      // 构建增强数据列表
      const list = filteredKeys.map(key => {
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
              // 处理其他对象格式数据
              items = Object.entries(parsedValue).map(
                ([subKey, item], index) => {
                  const itemInfo = parseItemInfo(item, dataType, index);
                  return {
                    id: subKey,
                    ...itemInfo,
                    rawData: item,
                  };
                }
              );
            }
          } else {
            preview = String(parsedValue).substring(0, 50);
            items = [
              {
                id: 'single_item',
                title: '单个数据项',
                creator: 'N/A',
                createdAt: 'N/A',
                size: String(parsedValue).length,
                rawData: parsedValue,
              },
            ];
          }
        } catch {
          preview = String(value).substring(0, 50);
          items = [
            {
              id: 'raw_data',
              title: '原始数据',
              creator: 'N/A',
              createdAt: 'N/A',
              size: String(value).length,
              rawData: value,
            },
          ];
        }

        return {
          key,
          value: parsedValue,
          rawValue: value,
          itemCount,
          preview,
          size: value ? value.length : 0,
          items,
        };
      });

      setDataList(list);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data list:', error);
      setLoading(false);
    }
  };

  // 解析项目信息
  const parseItemInfo = (item, dataType, index) => {
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
          title:
            item.title || item.name || item.workTitle || `作品 ${index + 1}`,
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

        const draftTime =
          item.createdAt || item.updatedAt || item.date || '未知';

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
          creator:
            item.creator ||
            item.author?.name ||
            item.author ||
            item.userId ||
            '未知',
          createdAt: item.createdAt || item.date || '未知',
          size: JSON.stringify(item).length,
        };
    }
  };

  // 获取所有项目（扁平化）
  const getAllItems = () => {
    const allItems = [];
    dataList.forEach(dataGroup => {
      dataGroup.items.forEach(item => {
        allItems.push({
          ...item,
          groupKey: dataGroup.key,
          groupTitle: getGroupTitle(dataGroup.key),
        });
      });
    });
    return allItems;
  };

  // 获取组标题
  const getGroupTitle = key => {
    if (key.includes('mock_collaborations')) return '协作项目数据';
    if (key.includes('tag_collaboration_drafts')) return '协作草稿数据';
    if (key.startsWith('portfolio_'))
      return `作品集 (${key.replace('portfolio_', '')})`;
    if (key.includes('comment')) return '评论数据';
    if (key.includes('notification')) return '通知数据';
    if (key.includes('like')) return '点赞数据';
    if (key.includes('view')) return '浏览统计';
    return key;
  };

  // 搜索过滤
  const allItems = getAllItems();
  const filteredItems = allItems.filter(
    item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.groupTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 排序
  const sortedItems = [...filteredItems].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'size') {
      aValue = a.size;
      bValue = b.size;
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // 选择/取消选择单个项目
  const toggleItemSelection = itemId => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedItems.length === sortedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedItems.map(item => item.id));
    }
  };

  // 删除选中的项目
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    setShowConfirmDialog(true);
  };

  // 确认删除
  const confirmDelete = () => {
    // 按组删除选中的项目
    const itemsToDelete = selectedItems.map(itemId => {
      const item = allItems.find(i => i.id === itemId);
      return { groupKey: item.groupKey, itemId: itemId };
    });

    // 从localStorage中删除
    itemsToDelete.forEach(({ groupKey, itemId }) => {
      try {
        const currentData = JSON.parse(localStorage.getItem(groupKey));

        // 处理草稿数据（对象格式）
        if (groupKey.includes('draft') && typeof currentData === 'object') {
          // 草稿数据是按用户ID分组的对象
          let foundAndDeleted = false;
          Object.keys(currentData).forEach(userId => {
            const userDrafts = currentData[userId];
            if (Array.isArray(userDrafts)) {
              const originalLength = userDrafts.length;
              const filteredDrafts = userDrafts.filter(
                draft => draft.id !== itemId
              );
              if (filteredDrafts.length < originalLength) {
                currentData[userId] = filteredDrafts;
                foundAndDeleted = true;
                console.log(`删除了用户 ${userId} 的草稿 ${itemId}`);
              }
            }
          });
          if (foundAndDeleted) {
            localStorage.setItem(groupKey, JSON.stringify(currentData));
          }
        }
        // 处理数组格式的数据
        else if (Array.isArray(currentData)) {
          const filteredData = currentData.filter(
            item => (item.id || item.collaborationId) !== itemId
          );
          localStorage.setItem(groupKey, JSON.stringify(filteredData));
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    });

    // 重新加载数据
    loadDataList();
    setSelectedItems([]);

    // 调用父组件的回调
    if (onDeleteSelected) {
      onDeleteSelected(selectedItems.length);
    }
  };

  // 跳转到项目详情
  const navigateToItem = item => {
    // 根据数据类型构建跳转URL
    let url = '';
    switch (dataType) {
      case 'collaborations':
        url = `/tagme/collaboration/${item.id}`;
        break;
      case 'portfolios':
        url = `/work/${item.id}`;
        break;
      default:
        url = '/';
    }

    // 在新窗口打开
    window.open(url, '_blank');
  };

  // 格式化文件大小
  const formatSize = bytes => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 格式化时间
  const formatDate = dateStr => {
    if (dateStr === '未知') return dateStr;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        <span className='ml-2 text-gray-600'>加载数据中...</span>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow'>
      {/* 头部工具栏 */}
      <div className='p-4 border-b border-gray-200'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='flex items-center space-x-4'>
            <h3 className='text-lg font-semibold text-gray-800'>
              {dataType === 'collaborations' && '协作项目数据管理'}
              {dataType === 'portfolios' && '作品数据管理'}
              {dataType === 'comments' && '评论数据管理'}
              {dataType === 'notifications' && '通知数据管理'}
              {dataType === 'likes' && '点赞数据管理'}
              {dataType === 'views' && '浏览统计数据管理'}
              {dataType === 'drafts' && '协作草稿数据管理'}
            </h3>
            <span className='text-sm text-gray-500'>
              共 {allItems.length} 个项目
            </span>
          </div>

          <div className='flex items-center space-x-2'>
            <input
              type='text'
              placeholder='搜索项目...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='px-3 py-1 border border-gray-300 rounded text-sm'
            />

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className='px-3 py-1 border border-gray-300 rounded text-sm'
            >
              <option value='title'>按标题</option>
              <option value='creator'>按创建者</option>
              <option value='createdAt'>按时间</option>
              <option value='size'>按大小</option>
            </select>

            <button
              onClick={() =>
                setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
              }
              className='px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50'
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>

            <button
              onClick={() =>
                setViewMode(prev => (prev === 'list' ? 'table' : 'list'))
              }
              className='px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50'
            >
              {viewMode === 'list' ? '📋 表格' : '📝 列表'}
            </button>
          </div>
        </div>
      </div>

      {/* 操作栏 */}
      <div className='p-4 border-b border-gray-200 bg-gray-50'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={
                  selectedItems.length === sortedItems.length &&
                  sortedItems.length > 0
                }
                onChange={toggleSelectAll}
                className='mr-2'
              />
              全选
            </label>
            <span className='text-sm text-gray-600'>
              已选择 {selectedItems.length} 项
            </span>
          </div>

          <button
            onClick={handleDeleteSelected}
            disabled={selectedItems.length === 0}
            className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            🗑️ 删除选中 ({selectedItems.length})
          </button>
        </div>
      </div>

      {/* 数据列表 */}
      <div className='max-h-96 overflow-y-auto'>
        {sortedItems.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>
            没有找到匹配的项目
          </div>
        ) : viewMode === 'list' ? (
          // 列表视图
          <div className='p-4 space-y-3'>
            {sortedItems.map(item => (
              <div
                key={item.id}
                className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <input
                      type='checkbox'
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className='mr-2'
                    />
                    <div className='flex-1'>
                      <div className='flex items-center space-x-2'>
                        <h4 className='font-medium text-gray-900'>
                          {item.title}
                        </h4>
                        <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                          {item.groupTitle}
                        </span>
                      </div>
                      <div className='text-sm text-gray-600 mt-1'>
                        <span>创建者: {item.creator}</span>
                        <span className='mx-2'>•</span>
                        <span>时间: {formatDate(item.createdAt)}</span>
                        <span className='mx-2'>•</span>
                        <span>大小: {formatSize(item.size)}</span>
                        {dataType === 'drafts' && item.userId && (
                          <>
                            <span className='mx-2'>•</span>
                            <span>用户ID: {item.userId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    {/* 移除查看按钮，因为所有信息都已显示 */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 表格视图
          <table className='w-full'>
            <thead className='bg-gray-50 sticky top-0'>
              <tr>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  选择
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  项目标题
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  创建者
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  创建时间
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  大小
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {/* 移除操作列标题 */}
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {sortedItems.map(item => (
                <tr key={item.id} className='hover:bg-gray-50'>
                  <td className='px-4 py-2'>
                    <input
                      type='checkbox'
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className='mr-2'
                    />
                  </td>
                  <td className='px-4 py-2'>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        {item.title}
                      </div>
                      <div className='text-xs text-blue-600'>
                        {item.groupTitle}
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-600'>
                    {item.creator}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-600'>
                    {formatDate(item.createdAt)}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-600'>
                    {formatSize(item.size)}
                  </td>
                  <td className='px-4 py-2'>
                    {/* 移除查看按钮，因为所有信息都已显示 */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 确认删除弹窗 */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmDelete}
        title='确认删除'
        message={`确定要删除选中的 ${selectedItems.length} 个项目吗？\n\n此操作不可撤销！`}
        confirmText='删除'
        cancelText='取消'
        type='danger'
      />
    </div>
  );
};

export default EnhancedDataListManager;

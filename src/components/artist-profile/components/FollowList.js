// follow-list v1: 关注列表共用组件

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { getFollowButtonStyle } from '../utils/artistHelpers';

/**
 * 关注列表组件
 * @param {string} type - 列表类型：'followers' | 'following'
 * @param {string} targetId - 目标用户/艺术家ID
 * @param {Function} onClose - 关闭回调
 * @param {boolean} isOwnProfile - 是否为查看自己的档案
 * @param {string} currentUserId - 当前用户ID
 */
const FollowList = ({ type, targetId, onClose, currentUserId = 'alice' }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [followLoading, setFollowLoading] = useState({});

  const observerRef = useRef();

  // 获取列表数据
  const fetchList = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        setError(null);

        const { getFollowersList, getFollowingListPaginated } = await import(
          '../../../services/mock/followService'
        );

        const options = {
          limit: 20,
          cursor: reset ? null : cursor,
          q: searchQuery,
          currentUserId: currentUserId,
        };

        let result;
        if (type === 'followers') {
          result = await getFollowersList(targetId, options);
        } else {
          result = await getFollowingListPaginated(targetId, options);
        }

        if (result.success) {
          const newItems = result.data.items;
          setItems(prev => (reset ? newItems : [...prev, ...newItems]));
          setHasMore(result.data.hasMore);
          setCursor(result.data.cursor);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [type, targetId, cursor, searchQuery]
  );

  // 搜索防抖
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      fetchList(true);
    }, 250);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchQuery]);

  // 初始加载
  useEffect(() => {
    fetchList(true);
  }, [type, targetId]);

  // 无限滚动
  const lastItemCallback = useCallback(
    node => {
      if (loading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchList();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [loading, hasMore, fetchList]
  );

  // 关注/取关操作
  const handleFollowToggle = async (targetUserId, currentFollowState) => {
    try {
      setFollowLoading(prev => ({ ...prev, [targetUserId]: true }));

      const { follow, unfollow } = await import(
        '../../../services/mock/followService'
      );

      // 使用传入的当前用户ID
      const actualCurrentUserId = currentUserId;

      let result;
      if (currentFollowState) {
        // 当前已关注，执行取消关注
        result = await unfollow(targetUserId, actualCurrentUserId);
      } else {
        // 当前未关注，执行关注
        result = await follow(targetUserId, actualCurrentUserId);
      }

      if (result.success) {
        if (type === 'following' && currentFollowState) {
          // 在 Following 列表中取消关注，从列表中移除该用户
          setItems(prev => prev.filter(item => item.id !== targetUserId));
        } else {
          // 乐观更新按钮状态
          setItems(prev =>
            prev.map(item =>
              item.id === targetUserId
                ? { ...item, isFollowedByMe: !currentFollowState }
                : item
            )
          );
        }
      } else {
        // 失败回滚
        console.error('Follow toggle failed:', result.error);
        // 这里可以添加 toast 提示
      }
    } catch (err) {
      console.error('Follow toggle error:', err);
    } finally {
      setFollowLoading(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  // 跳转到用户档案
  const handleUserClick = userId => {
    navigate(`/artist/${userId}`);
    onClose();
  };

  // 渲染用户卡片
  const renderUserCard = (user, index) => {
    const isLast = index === items.length - 1;
    const ref = isLast ? lastItemCallback : null;

    return (
      <div
        key={user.id}
        ref={ref}
        className='bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer'
        onClick={() => handleUserClick(user.id)}
      >
        <div className='flex items-center space-x-3'>
          {/* 头像 */}
          <img
            src={user.avatar}
            alt={user.displayName}
            className='w-12 h-12 rounded-full object-cover'
          />

          {/* 用户信息 */}
          <div className='flex-1 min-w-0'>
            <h3 className='text-sm font-medium text-gray-900 truncate'>
              {user.displayName}
            </h3>
          </div>

          {/* 关注按钮 */}
          <button
            onClick={e => {
              e.stopPropagation();
              handleFollowToggle(user.id, user.isFollowedByMe);
            }}
            disabled={followLoading[user.id]}
            className={getFollowButtonStyle(user.isFollowedByMe)}
          >
            {followLoading[user.id] ? (
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
            ) : user.isFollowedByMe ? (
              'Following'
            ) : (
              'Follow'
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className='h-full flex flex-col'>
      {/* 搜索框 */}
      <div className='mb-4'>
        <input
          type='text'
          placeholder={`Search ${type}...`}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
      </div>

      {/* 列表内容 */}
      <div className='flex-1 overflow-y-auto'>
        {error ? (
          <div className='text-center py-8'>
            <p className='text-red-500'>Error: {error}</p>
            <button
              onClick={() => fetchList(true)}
              className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 && !loading ? (
          <div className='text-center py-8'>
            <p className='text-gray-500'>No {type} found</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {items.map((user, index) => renderUserCard(user, index))}
          </div>
        )}

        {/* 加载状态 */}
        {loading && (
          <div className='text-center py-4'>
            <div className='inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowList;

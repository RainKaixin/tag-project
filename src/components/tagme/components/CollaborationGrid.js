import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { favoritesService } from '../../../services';
import { getCollaborations } from '../../../services/collaborationService';
import { getCurrentUser } from '../../../utils/currentUser';
import imageStorage from '../../../utils/indexedDB.js';

import CollaborationImage from './CollaborationImage';

const CollaborationGrid = ({ onCollaborationClick, onBookmarkToggle }) => {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkStates, setBookmarkStates] = useState({});

  // 获取协作数据
  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        setLoading(true);
        const result = await getCollaborations();

        if (result.success) {
          setCollaborations(result.data);

          // 检查每个协作的收藏状态
          await checkBookmarkStatuses(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // 检查收藏状态的函数
    const checkBookmarkStatuses = async collaborationsData => {
      try {
        const currentUser = getCurrentUser();
        console.log('[CollaborationGrid] 当前用户:', currentUser);

        if (!currentUser?.id) {
          console.warn('[CollaborationGrid] 用户未登录，跳过收藏状态检查');
          return;
        }

        const bookmarkStatuses = {};

        for (const collaboration of collaborationsData) {
          try {
            console.log(
              `[CollaborationGrid] 检查协作 ${collaboration.id} 的收藏状态...`
            );

            const statusResult = await favoritesService.checkFavoriteStatus(
              'collaboration',
              collaboration.id
            );

            if (statusResult.success) {
              bookmarkStatuses[collaboration.id] =
                statusResult.data.isFavorited;
              console.log(
                `[CollaborationGrid] 协作 ${collaboration.id} 收藏状态:`,
                statusResult.data.isFavorited
              );
            } else {
              console.error(
                `[CollaborationGrid] 检查协作 ${collaboration.id} 收藏状态失败:`,
                statusResult.error
              );
              bookmarkStatuses[collaboration.id] = false;
            }
          } catch (error) {
            console.error(
              `[CollaborationGrid] 检查协作 ${collaboration.id} 收藏状态时出错:`,
              error
            );
            bookmarkStatuses[collaboration.id] = false;
          }
        }

        setBookmarkStates(bookmarkStatuses);
        console.log('[CollaborationGrid] 所有收藏状态:', bookmarkStatuses);
      } catch (error) {
        console.error('[CollaborationGrid] 检查收藏状态时出错:', error);
      }
    };

    fetchCollaborations();

    // 监听新协作发布事件
    const handleNewCollaboration = () => {
      fetchCollaborations();
    };

    window.addEventListener('collaboration:created', handleNewCollaboration);

    return () => {
      window.removeEventListener(
        'collaboration:created',
        handleNewCollaboration
      );
    };
  }, []);

  // 处理收藏按钮点击
  const handleBookmarkClick = async (e, collaborationId) => {
    e.stopPropagation();

    try {
      const currentUser = getCurrentUser();
      if (!currentUser?.id) {
        console.error('[CollaborationGrid] 用户未登录，无法收藏');
        return;
      }

      const currentState = bookmarkStates[collaborationId] || false;
      console.log(
        `[CollaborationGrid] 切换协作 ${collaborationId} 收藏状态，当前状态:`,
        currentState
      );

      // 调用收藏服务切换状态
      const result = await favoritesService.toggleFavorite(
        'collaboration',
        collaborationId,
        !currentState
      );

      if (result.success) {
        // 更新本地状态
        const newState = !currentState;
        setBookmarkStates(prev => ({
          ...prev,
          [collaborationId]: newState,
        }));

        // 调用父组件的回调（如果存在）
        if (onBookmarkToggle) {
          onBookmarkToggle(collaborationId);
        }

        console.log(
          `[CollaborationGrid] 协作 ${collaborationId} ${
            newState ? '收藏' : '取消收藏'
          }成功`
        );

        // 验证收藏状态是否正确保存
        setTimeout(async () => {
          try {
            const verifyResult = await favoritesService.checkFavoriteStatus(
              'collaboration',
              collaborationId
            );
            console.log(
              `[CollaborationGrid] 验证协作 ${collaborationId} 收藏状态:`,
              verifyResult.data.isFavorited
            );
          } catch (error) {
            console.error(`[CollaborationGrid] 验证收藏状态失败:`, error);
          }
        }, 100);
      } else {
        console.error('[CollaborationGrid] 收藏操作失败:', result.error);
      }
    } catch (error) {
      console.error('[CollaborationGrid] 收藏操作出错:', error);
    }
  };

  if (loading) {
    return (
      <div className='flex-1 flex items-center justify-center py-12'>
        <div className='text-gray-500'>Loading collaborations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-1 flex items-center justify-center py-12'>
        <div className='text-red-500'>
          Error loading collaborations: {error}
        </div>
      </div>
    );
  }

  if (collaborations.length === 0) {
    return (
      <div className='flex-1 flex items-center justify-center py-12'>
        <div className='text-gray-500'>No collaborations found.</div>
      </div>
    );
  }

  return (
    <div className='flex-1'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {collaborations.map(collaboration => (
          <div
            key={collaboration.id}
            className='bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md hover:scale-105 transition-all duration-300'
          >
            {/* Project Image */}
            <div className='relative'>
              <div
                onClick={() =>
                  onCollaborationClick && onCollaborationClick(collaboration)
                }
                className='block cursor-pointer'
              >
                <CollaborationImage
                  imageKey={collaboration.posterPreview}
                  alt={collaboration.title}
                />
              </div>
              {/* Bookmark Button */}
              <button
                onClick={e => handleBookmarkClick(e, collaboration.id)}
                className='absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200'
                title={bookmarkStates[collaboration.id] ? '取消收藏' : '收藏'}
              >
                <svg
                  className={`w-5 h-5 ${
                    bookmarkStates[collaboration.id]
                      ? 'text-purple-500 fill-current'
                      : 'text-gray-400'
                  }`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                  />
                </svg>
              </button>
            </div>

            {/* Collaboration Content */}
            <div className='p-3'>
              <div
                onClick={() =>
                  onCollaborationClick && onCollaborationClick(collaboration)
                }
                className='block cursor-pointer'
              >
                <h3 className='font-bold text-gray-900 mb-2 text-sm hover:text-purple-600 transition-colors duration-200'>
                  {collaboration.title}
                </h3>
                {/* Description removed from TAG Me list view to save space */}
              </div>

              {/* Author */}
              <div className='flex items-center'>
                {collaboration.author.avatar ? (
                  <img
                    src={collaboration.author.avatar}
                    alt={collaboration.author.name}
                    className='w-6 h-6 rounded-full mr-2 object-cover'
                    onError={e => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className='w-6 h-6 rounded-full mr-2 bg-gray-300 flex items-center justify-center'>
                    <span className='text-xs text-gray-600 font-medium'>
                      {collaboration.author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className='text-xs font-medium text-gray-900'>
                  {collaboration.author.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborationGrid;

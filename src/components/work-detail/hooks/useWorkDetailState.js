// use-work-detail-state v1: 作品详情页状态管理Hook

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { favoritesService, commentService } from '../../../services';
import {
  getWorkDataById,
  getDefaultComments,
  getImageUrlsToPreload,
  preloadImages,
} from '../utils/workDetailHelpers';

/**
 * 作品详情页状态管理Hook
 * @returns {Object} 状态和设置函数
 */
const useWorkDetailState = () => {
  // 交互状态
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState('');

  // 图片加载状态
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // 评论状态
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);

  // 回复状态管理
  const [replyingTo, setReplyingTo] = useState(null); // 正在回复谁（哪条评论）
  const [replyDrafts, setReplyDrafts] = useState({}); // 每条父评论的草稿

  // 从 URL 参数获取作品 ID
  const { id: workId } = useParams();

  // 作品数据状态
  const [workData, setWorkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 加载作品数据
  useEffect(() => {
    const loadWorkData = async () => {
      if (!workId) {
        setError('No work ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getWorkDataById(workId);
        if (data) {
          setWorkData(data);
        } else {
          setError('Work not found');
        }
      } catch (err) {
        console.error('Error loading work data:', err);
        setError('Failed to load work data');
      } finally {
        setLoading(false);
      }
    };

    loadWorkData();
  }, [workId]);

  // 页面初始化时滚动到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // 预加载图片资源
  useEffect(() => {
    if (!workData) return;

    const loadImages = async () => {
      const imageUrls = getImageUrlsToPreload(workData, comments);
      const success = await preloadImages(imageUrls);
      setImagesLoaded(true);
    };

    loadImages();
  }, [comments, workData]);

  // 加载评论数据
  useEffect(() => {
    if (!workId) return;

    const loadComments = async () => {
      try {
        const result = await commentService.getWorkComments(workId);
        if (result.success) {
          setComments(result.data);
        } else {
          console.error('[WorkDetail] Failed to load comments:', result.error);
        }
      } catch (error) {
        console.error('[WorkDetail] Error loading comments:', error);
      }
    };

    loadComments();
  }, [workId]);

  // 检查收藏状态
  useEffect(() => {
    if (!workData?.id) return;

    const checkFavoriteStatus = async () => {
      try {
        const result = await favoritesService.checkFavoriteStatus(
          'work',
          workData.id
        );
        if (result.success) {
          setSaved(result.data.isFavorited);
        }
      } catch (error) {
        console.error('Failed to check favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [workData?.id]);

  return {
    // 状态
    liked,
    saved,
    comment,
    imagesLoaded,
    comments,
    workData,
    loading,
    error,

    // 设置函数
    setLiked,
    setSaved,
    setComment,
    setImagesLoaded,
    setComments,
    setReplyTo,

    // 回复相关操作
    replyingTo,
    replyDrafts,
    setReplyingTo,
    setReplyDrafts,

    // 操作函数
    toggleLike: () => {
      setLiked(!liked);
    },

    toggleSave: () => {
      setSaved(!saved);
    },

    // 回复操作函数
    startReply: parent => {
      if (!parent) return;
      setReplyingTo({
        parentId: parent.id,
        parentAuthorId: parent.authorId,
        parentAuthorName: parent.authorName,
      });
    },

    cancelReply: () => {
      setReplyingTo(null);
    },

    setReplyDraft: (parentId, text) => {
      setReplyDrafts(prev => ({ ...prev, [parentId]: text }));
    },

    // 乐观更新函数
    addCommentOptimistic: optimisticComment => {
      setComments(prev => [...prev, optimisticComment]);
    },

    replaceTempComment: ({ tempId, saved }) => {
      setComments(prev => prev.map(c => (c.id === tempId ? saved : c)));
    },

    removeTempComment: tempId => {
      setComments(prev => prev.filter(c => c.id !== tempId));
    },

    loadComments: async () => {
      if (!workId) return;

      try {
        const result = await commentService.getWorkComments(workId);
        if (result.success) {
          setComments(result.data);
        } else {
          console.error(
            '[WorkDetail] Failed to reload comments:',
            result.error
          );
        }
      } catch (error) {
        console.error('[WorkDetail] Error reloading comments:', error);
      }
    },

    clearComment: () => {
      setComment('');
    },
  };
};

export default useWorkDetailState;

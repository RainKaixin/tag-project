// collaborations-section v3: 合作项目区域组件 - 集成草稿功能

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import draftService from '../../../services/draftService';

import CollaborationCard from './CollaborationCard';
import CollaborationPostCard from './CollaborationPostCard';
import CollaborationTabs from './CollaborationTabs';

/**
 * 合作项目区域组件
 * @param {Array} collaborations - 合作项目数据数组（简历版本）
 * @param {number|null} expandedCardId - 展开的卡片ID
 * @param {Function} onCollaborationToggle - 合作项目展开/收起事件
 * @param {string} className - 额外的CSS类名
 * @param {string} currentUserId - 当前用户ID
 * @param {string} viewedUserId - 被查看用户的ID，用于获取该用户的协作项目
 */
const CollaborationsSection = ({
  collaborations,
  expandedCardId,
  onCollaborationToggle,
  className = '',
  currentUserId = 'alice', // 默认值，实际应该从props传入
  viewedUserId = null, // 被查看用户的ID
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('published');
  const [draftPosts, setDraftPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // 从 localStorage 获取真实的协作数据
  const [publishedPosts, setPublishedPosts] = useState([]);

  // 加载已发布的协作项目
  const loadPublishedCollaborations = useCallback(async () => {
    try {
      // 从 localStorage 获取协作数据
      const stored = localStorage.getItem('mock_collaborations');
      if (!stored) {
        console.log(
          '[CollaborationsSection] No collaborations found in storage'
        );
        setPublishedPosts([]);
        return;
      }

      const collaborations = JSON.parse(stored);
      console.log(
        '[CollaborationsSection] Found collaborations:',
        collaborations.length
      );

      // 确定要获取协作项目的用户ID
      let targetUserId = viewedUserId;

      if (!targetUserId) {
        // 如果没有提供viewedUserId，则使用当前用户ID
        if (!currentUserId) {
          console.warn('[CollaborationsSection] No currentUserId provided');
          setPublishedPosts([]);
          return;
        }
        targetUserId = currentUserId;
      }

      console.log(
        '[CollaborationsSection] 获取协作项目的用户ID:',
        targetUserId
      );

      // 筛选出被查看用户创建的协作项目（已发布的项目）
      const userCollaborations = collaborations.filter(
        collab => collab.author && collab.author.id === targetUserId
      );

      console.log(
        '[CollaborationsSection] User collaborations:',
        userCollaborations.length
      );

      // 转换为卡片格式
      const formattedCollaborations = userCollaborations.map(collab => {
        // 计算日期
        const createdAt = new Date(collab.createdAt);
        const date = createdAt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        // 获取图片
        let image = '';
        if (collab.heroImage) {
          if (collab.heroImage.startsWith('collaboration_')) {
            // 使用占位图片，实际项目中应该从 IndexedDB 获取
            image =
              'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop';
          } else {
            image = collab.heroImage;
          }
        } else {
          image =
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop';
        }

        // 提取标签（从项目类型或描述中提取）
        const tags = collab.projectType
          ? [collab.projectType]
          : ['Collaboration'];

        return {
          id: collab.id,
          title: collab.title,
          date: date,
          image: image,
          tags: tags,
        };
      });

      setPublishedPosts(formattedCollaborations);
    } catch (error) {
      console.error(
        '[CollaborationsSection] Error loading published collaborations:',
        error
      );
      setPublishedPosts([]);
    }
  }, [currentUserId, viewedUserId]);

  // 初始加载已发布的协作项目
  useEffect(() => {
    loadPublishedCollaborations();
  }, [loadPublishedCollaborations]);

  // 监听协作创建事件，自动刷新列表
  useEffect(() => {
    const handleCollaborationCreated = () => {
      console.log(
        '[CollaborationsSection] Collaboration created event received, refreshing published list'
      );
      loadPublishedCollaborations();
    };

    window.addEventListener(
      'collaboration:created',
      handleCollaborationCreated
    );
    return () => {
      window.removeEventListener(
        'collaboration:created',
        handleCollaborationCreated
      );
    };
  }, [loadPublishedCollaborations]);

  // 載入草稿數據
  const loadDrafts = async () => {
    try {
      setLoading(true);

      // 檢查是否為本人主頁，只有本人才能查看草稿
      if (!currentUserId || !viewedUserId || currentUserId !== viewedUserId) {
        console.log(
          '[CollaborationsSection] Not owner page, skipping drafts load'
        );
        setDraftPosts([]);
        return;
      }

      const result = await draftService.getDrafts({ type: 'collaboration' });
      if (result.success) {
        // 轉換草稿數據格式以匹配卡片組件
        const formattedDrafts = result.data.items.map(draft => ({
          id: draft.id,
          title: draft.title || 'Untitled Draft',
          // 移除作者信息，避免显示错误的用户
          date: new Date(draft.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          image:
            draft.image ||
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          tags: draft.tags || [],
          isDraft: true,
          draftData: draft, // 保存原始草稿數據用於編輯
        }));
        setDraftPosts(formattedDrafts);
      }
    } catch (error) {
      console.error('Failed to load drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始載入草稿
  useEffect(() => {
    loadDrafts();
  }, [currentUserId, viewedUserId]);

  // 監聽草稿保存事件，自動刷新列表
  useEffect(() => {
    const handleDraftSaved = () => {
      console.log('Draft saved event received, refreshing drafts list');
      loadDrafts();
    };

    window.addEventListener('draft:saved', handleDraftSaved);
    return () => {
      window.removeEventListener('draft:saved', handleDraftSaved);
    };
  }, []);

  // 處理草稿點擊事件
  const handleDraftClick = draft => {
    // 跳轉到編輯頁面並載入草稿數據
    console.log('Opening draft for editing:', draft);

    // 跳轉到 Upload 頁面，並傳遞草稿數據
    navigate('/upload/form', {
      state: {
        activeUploadType: 'collaboration',
        draftId: draft.id,
        draftData: draft.draftData,
        from: 'draft-edit',
      },
    });
  };

  // 處理草稿刪除事件
  const handleDraftDelete = async draftId => {
    try {
      console.log('Deleting draft:', draftId);

      const result = await draftService.deleteDraft(draftId);

      if (result.success) {
        console.log('Draft deleted successfully');

        // 重新載入草稿列表
        const loadDrafts = async () => {
          try {
            setLoading(true);
            const result = await draftService.getDrafts({
              type: 'collaboration',
            });
            if (result.success) {
              const formattedDrafts = result.data.items.map(draft => ({
                id: draft.id,
                title: draft.title || 'Untitled Draft',
                // 移除作者信息，避免显示错误的用户
                date: new Date(draft.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }),
                image:
                  draft.image ||
                  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
                tags: draft.tags || [],
                isDraft: true,
                draftData: draft,
              }));
              setDraftPosts(formattedDrafts);
            }
          } catch (error) {
            console.error('Failed to reload drafts:', error);
          } finally {
            setLoading(false);
          }
        };

        loadDrafts();
      } else {
        console.error('Failed to delete draft:', result.error);
        alert('Failed to delete draft. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      alert('Failed to delete draft. Please try again.');
    }
  };

  const handleTabChange = tab => {
    setActiveTab(tab);
  };

  // 处理已发布的协作项目点击
  const handlePublishedCollaborationClick = post => {
    console.log('Opening published collaboration:', post);

    // 从 localStorage 获取完整的协作数据
    const stored = localStorage.getItem('mock_collaborations');
    if (stored) {
      const collaborations = JSON.parse(stored);
      const fullCollaboration = collaborations.find(
        collab => collab.id === post.id
      );

      if (fullCollaboration) {
        // 跳转到协作详情页面
        navigate(`/tagme/collaboration/${post.id}`, {
          state: { project: fullCollaboration },
        });
      } else {
        console.warn('Collaboration not found in storage:', post.id);
      }
    }
  };

  return (
    <div className={`pt-8 mt-8 bg-purple-50 rounded-lg p-6 ${className}`}>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-bold text-gray-900'>Collaborations</h3>
        <button
          onClick={() => setShowHelpModal(true)}
          className='p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-full transition-colors duration-200'
          title='Learn about Collaborations'
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </button>
      </div>

      {/* History & Experiences 区域 - 暂时为空，等待 Final Review 功能 */}
      <div className='mb-8'>
        <h4 className='text-md font-semibold text-gray-800 mb-4'>
          History & Experiences
        </h4>
        <div className='text-center py-8'>
          <p className='text-gray-500'>
            No Final Reviews yet — complete a collaboration to build your
            Experiences here.
          </p>
        </div>
      </div>

      {/* Tab 切換區域 */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <CollaborationTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          {activeTab === 'drafts' && (
            <div className='text-sm text-gray-500'>
              {draftPosts.length}/3 drafts
            </div>
          )}
        </div>
      </div>

      {/* 卡片展示區域 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {activeTab === 'published' &&
          publishedPosts.map(post => (
            <div
              key={post.id}
              onClick={() => handlePublishedCollaborationClick(post)}
              className='cursor-pointer'
            >
              <CollaborationPostCard post={post} />
            </div>
          ))}
        {activeTab === 'drafts' &&
          (loading ? (
            <div className='col-span-full text-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-tag-purple mx-auto mb-4'></div>
              <p className='text-gray-500'>Loading drafts...</p>
            </div>
          ) : (
            draftPosts.map(post => (
              <div
                key={post.id}
                onClick={() => handleDraftClick(post)}
                className='cursor-pointer'
              >
                <CollaborationPostCard
                  post={post}
                  onDelete={handleDraftDelete}
                />
              </div>
            ))
          ))}
      </div>

      {/* 空狀態 */}
      {activeTab === 'published' && publishedPosts.length === 0 && (
        <div className='text-center py-8'>
          <p className='text-gray-500'>No published collaborations yet.</p>
        </div>
      )}
      {activeTab === 'drafts' && draftPosts.length === 0 && (
        <div className='text-center py-8'>
          <p className='text-gray-500'>No draft collaborations yet.</p>
        </div>
      )}
      {activeTab === 'drafts' && draftPosts.length >= 3 && (
        <div className='col-span-full text-center py-4'>
          <div className='bg-orange-50 border border-orange-200 rounded-lg p-4'>
            <div className='text-orange-600 mb-2'>
              <svg
                className='w-6 h-6 mx-auto'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <p className='text-orange-700 text-sm font-medium'>
              Draft limit reached (3/3)
            </p>
            <p className='text-orange-600 text-xs mt-1'>
              Delete an existing draft to save a new one
            </p>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-8 max-w-4xl mx-4 shadow-xl'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-semibold text-gray-900'>
                What is Collaboration?
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className='text-gray-400 hover:text-gray-600 transition-colors duration-200'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <div className='space-y-8 text-base text-gray-700'>
              <div className='flex items-start gap-5'>
                <div className='flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mt-0.5'>
                  <span className='text-purple-600 text-base font-bold'>1</span>
                </div>
                <div className='flex-1'>
                  <h4 className='font-bold text-gray-900 mb-3 text-lg'>
                    Project Records
                  </h4>
                  <p className='text-gray-700 leading-relaxed'>
                    Collaborations are shared project records that belong to all
                    participants. Once published, they stay visible to ensure
                    everyone's contributions are preserved.
                  </p>
                  <p className='text-gray-600 leading-relaxed mt-2 text-sm'>
                    (You can always edit and update details, but the project
                    itself remains as part of the team's history.)
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-5'>
                <div className='flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mt-0.5'>
                  <span className='text-purple-600 text-base font-bold'>2</span>
                </div>
                <div className='flex-1'>
                  <h4 className='font-bold text-gray-900 mb-3 text-lg'>
                    Responsibilities
                  </h4>
                  <p className='text-gray-700 leading-relaxed'>
                    Each member can describe their own responsibilities within a
                    project. These should be written based on the team's
                    discussion, so that everyone's role is represented fairly
                    and clearly.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-5'>
                <div className='flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mt-0.5'>
                  <span className='text-purple-600 text-base font-bold'>3</span>
                </div>
                <div className='flex-1'>
                  <h4 className='font-bold text-gray-900 mb-3 text-lg'>
                    Reviews
                  </h4>
                  <p className='text-gray-700 leading-relaxed'>
                    After a project is completed, each Initiator or Collaborator
                    will receive a review under their Responsibilities. Reviews
                    from your teammates or project lead highlight your
                    strengths, teamwork, and impact on the project.
                  </p>
                </div>
              </div>

              {/* Additional Note Section */}
              <div className='bg-purple-50 border border-purple-200 rounded-lg p-6'>
                <h4 className='font-bold text-gray-900 mb-3 text-lg'>
                  Additional Note on Collaborations Published & History:
                </h4>
                <p className='text-gray-700 leading-relaxed'>
                  Any Collaboration you publish will first appear under the
                  Published section. Only when the project is completed—meaning
                  you've received at least one Final Review from either an
                  Initiator or a Collaborator—will it be stored in your
                  Collaboration History. At that point, it becomes part of your
                  personal Experiences and represents a completed project
                  record.
                </p>
              </div>
            </div>

            <div className='mt-8 border-t border-gray-200 pt-6'>
              <div className='flex justify-between items-end'>
                <div className='text-sm text-gray-600'>
                  <p className='mb-2'>
                    If you have other questions, feel free to reach out:
                  </p>
                  <div className='space-y-1'>
                    <div className='font-medium'>Email: tag@rainwang.art</div>
                    <div className='text-gray-500'>
                      Founder of TAG:{' '}
                      <span className='font-bold'>Rain Wang</span>
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className='px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-base font-medium'
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationsSection;

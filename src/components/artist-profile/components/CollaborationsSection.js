// collaborations-section v3: 合作项目区域组件 - 集成草稿功能

import React, { useState, useEffect } from 'react';
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
 */
const CollaborationsSection = ({
  collaborations,
  expandedCardId,
  onCollaborationToggle,
  className = '',
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('published');
  const [draftPosts, setDraftPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // 模擬數據 - 實際應該從 props 或 API 獲取
  const publishedPosts = [
    {
      id: 1,
      title: 'Mobile App Design Collaboration',
      // 移除作者信息，避免显示错误的用户
      date: 'Dec 15, 2024',
      image:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      tags: ['UI/UX', 'Mobile', 'Design'],
    },
    {
      id: 2,
      title: 'Brand Identity Project',
      // 移除作者信息，避免显示错误的用户
      date: 'Dec 10, 2024',
      image:
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      tags: ['Branding', 'Logo', 'Identity'],
    },
  ];

  // 載入草稿數據
  const loadDrafts = async () => {
    try {
      setLoading(true);
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
  }, []);

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

      {/* 現有的 Collaboration 列表（簡歷版本） */}
      <div className='mb-8'>
        <h4 className='text-md font-semibold text-gray-800 mb-4'>
          History & Experiences
        </h4>
        <div className='space-y-4'>
          {collaborations.map(collab => (
            <CollaborationCard
              key={collab.id}
              collaboration={collab}
              isExpanded={expandedCardId === collab.id}
              onToggle={onCollaborationToggle}
            />
          ))}
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
            <CollaborationPostCard key={post.id} post={post} />
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

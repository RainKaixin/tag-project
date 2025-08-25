import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '../../context/AppContext';
import { useNavigation } from '../../utils/navigation';

// Import hooks

// Import components
import CollaborationGrid from './components/CollaborationGrid';
import JobGrid from './components/JobGrid';
import MilestoneGrid from './components/MilestoneGrid';
import TAGMeContent from './components/TAGMeContent';
import TAGMeFilters from './components/TAGMeFilters';
import TAGMeHeader from './components/TAGMeHeader';
import useTAGMeActions from './hooks/useTAGMeActions';
import useTAGMeState from './hooks/useTAGMeState';

const TAGMePage = ({ onBackClick, onMilestoneClick, onCollaborationClick }) => {
  const location = useLocation();
  const { restoreScrollPosition } = useNavigation();
  const { state, actions } = useAppContext();

  // Use custom hooks
  const { state: tagMeState, setters } = useTAGMeState();
  const tagMeActions = useTAGMeActions({ state: tagMeState, setters });

  // Handle upload success navigation - 只在location.state变化时执行
  useEffect(() => {
    if (
      location.state?.activeTab &&
      location.state?.from === 'upload-success'
    ) {
      setters.setActiveTab(location.state.activeTab);

      // 清除状态，避免重复设置
      window.history.replaceState({}, document.title);

      // 延迟滚动，确保DOM已更新
      setTimeout(() => {
        const tagMeSection = document.querySelector('[data-tagme-section]');
        if (tagMeSection) {
          const rect = tagMeSection.getBoundingClientRect();
          const scrollTop = window.pageYOffset + rect.top - 80;
          window.scrollTo({
            top: scrollTop,
            behavior: 'auto',
          });
        }
      }, 100);
    }
  }, [location.state?.activeTab, location.state?.from, setters.setActiveTab]);

  // Restore scroll position - 优化依赖项
  useEffect(() => {
    const savedPosition =
      state.scrollPositions[`/tagme-${tagMeState.activeTab}`];

    if (state.navigationHistory.length > 0 && savedPosition) {
      const lastHistory =
        state.navigationHistory[state.navigationHistory.length - 1];
      if (lastHistory.from === 'tagme') {
        window.scrollTo({ top: savedPosition, behavior: 'auto' });
      }
    }
  }, [tagMeState.activeTab, state.scrollPositions, state.navigationHistory]);

  // Restore active tab - 只在真正从详情页返回时执行
  useEffect(() => {
    if (state.navigationHistory.length > 0) {
      const lastHistory =
        state.navigationHistory[state.navigationHistory.length - 1];
      const isReturningFromDetail =
        lastHistory.from === 'tagme' && lastHistory.activeTab;

      if (isReturningFromDetail) {
        setters.setActiveTab(lastHistory.activeTab);
      }
    }
  }, [state.navigationHistory, setters.setActiveTab]);

  // Save scroll position on unmount - 简化逻辑
  useEffect(() => {
    const saveScrollPosition = () => {
      const currentPosition = window.pageYOffset;
      actions.saveScrollPosition(
        `/tagme-${tagMeState.activeTab}`,
        currentPosition
      );
    };

    const saveScrollInterval = setInterval(saveScrollPosition, 1000);

    // 页面卸载时保存
    const handleBeforeUnload = saveScrollPosition;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveScrollPosition();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      saveScrollPosition();
      clearInterval(saveScrollInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [tagMeState.activeTab, actions.saveScrollPosition]);

  return (
    <div
      className='min-h-screen bg-gray-50'
      style={{ opacity: 1, transition: 'opacity 0.2s ease-in' }}
    >
      <TAGMeHeader />

      <TAGMeContent
        activeTab={tagMeState.activeTab}
        onTabChange={setters.setActiveTab}
        onCollaborationClick={onCollaborationClick}
        onMilestoneClick={onMilestoneClick}
      >
        <TAGMeFilters
          selectedCategories={tagMeState.selectedCategories}
          selectedMajors={tagMeState.selectedMajors}
          selectedTags={tagMeState.selectedTags}
          onCategoryToggle={tagMeActions.handleCategoryToggle}
          onMajorToggle={tagMeActions.handleMajorToggle}
          onTagToggle={tagMeActions.handleTagToggle}
        />

        {tagMeState.activeTab === 'Collaborations' && (
          <CollaborationGrid
            onCollaborationClick={onCollaborationClick}
            onBookmarkToggle={tagMeActions.handleBookmarkToggle}
          />
        )}

        {tagMeState.activeTab === 'Milestones' && (
          <MilestoneGrid onMilestoneClick={onMilestoneClick} />
        )}

        {tagMeState.activeTab === 'Jobs' && (
          <JobGrid onApplyJob={tagMeActions.handleApplyJob} />
        )}
      </TAGMeContent>
    </div>
  );
};

export default TAGMePage;

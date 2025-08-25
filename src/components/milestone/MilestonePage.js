import React, { useLayoutEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useAppContext } from '../../context/AppContext';
import { useNavigation } from '../../utils/navigation';

// Import hooks
import MilestoneComments from './components/MilestoneComments';
import MilestoneHeader from './components/MilestoneHeader';
import MilestoneMetadata from './components/MilestoneMetadata';
import MilestoneProjectInfo from './components/MilestoneProjectInfo';
import MilestoneTimeline from './components/MilestoneTimeline';
import { createProjectData, createMilestonesData } from './data/mockData';
import useMilestoneActions from './hooks/useMilestoneActions';
import useMilestoneState from './hooks/useMilestoneState';

// Import data

// Import components

const MilestonePage = () => {
  const { goBack, navigateToArtist, navigateToCollaboration } = useNavigation();
  const { state, actions } = useAppContext();
  const location = useLocation();
  const { id } = useParams(); // 获取URL参数中的id

  // 获取milestone数据：优先从Context获取，其次从route state获取，最后使用默认数据
  const milestoneData = state.selectedMilestone || location.state?.milestone;

  // 确保milestoneId的稳定性：优先使用URL参数，其次使用数据中的ID
  const milestoneId = id || milestoneData?.id || 1;

  // 创建项目数据
  const project = createProjectData(milestoneData, milestoneId);

  // 创建里程碑数据
  const milestones = createMilestonesData(project.projectType);

  // 使用统一的评论数据，从Context获取
  const { comments } = state;

  // Use custom hooks
  const { state: milestoneState, setters } = useMilestoneState();
  const milestoneActions = useMilestoneActions({
    state: milestoneState,
    setters,
    actions,
    navigateToCollaboration,
    project,
    comments,
  });

  // 确保每次进入页面都从顶部开始
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [milestoneId]); // 依赖项确保每次milestone ID变化时都执行

  return (
    <div className='min-h-screen bg-gray-50'>
      <MilestoneHeader goBack={goBack} project={project} />

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Project Info */}
          <MilestoneProjectInfo
            project={project}
            onViewProject={milestoneActions.handleApplyToCollaboration}
          />

          {/* Right Column - Metadata */}
          <MilestoneMetadata
            project={project}
            onNavigateToArtist={navigateToArtist}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Project Images */}
          <div className='lg:col-span-1'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>
              Project Preview
            </h2>
            <div className='grid grid-cols-2 gap-3'>
              {project.images.map((image, index) => (
                <div
                  key={index}
                  className='aspect-square overflow-hidden rounded-lg'
                >
                  <img
                    src={image}
                    alt={`Project preview ${index + 1}`}
                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Timeline & Comments */}
          <div className='lg:col-span-2'>
            {/* Tab Navigation */}
            <div className='flex border-b border-gray-200 mb-6'>
              <button
                onClick={() => setters.setActiveTab('timeline')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
                  milestoneState.activeTab === 'timeline'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setters.setActiveTab('comments')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
                  milestoneState.activeTab === 'comments'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Discussion Board
              </button>
            </div>

            {/* Timeline Tab */}
            {milestoneState.activeTab === 'timeline' && (
              <MilestoneTimeline milestones={milestones} />
            )}

            {/* Comments Tab */}
            {milestoneState.activeTab === 'comments' && (
              <MilestoneComments
                comment={milestoneState.comment}
                onCommentChange={e => setters.setComment(e.target.value)}
                onCommentSubmit={milestoneActions.handleCommentSubmit}
                comments={comments}
                onNavigateToArtist={navigateToArtist}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestonePage;

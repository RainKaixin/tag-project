import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ArtistProfile from '../components/artist-profile/ArtistProfile_refactored';
import BannerSection from '../components/BannerSection';
import CollaborationDetailPage from '../components/CollaborationDetailPage';
import CompetitionBanner from '../components/CompetitionBanner';
import GallerySection from '../components/GallerySection';
import HeroSection from '../components/HeroSection';
import LoginPage from '../components/LoginPage';
import MilestonePage from '../components/MilestonePage';
import NotificationCenter from '../components/NotificationCenter';
import ProtectedRoute from '../components/ProtectedRoute';
import RegisterPage from '../components/register-page/RegisterPage_refactored';
import SupabaseConnectionTest from '../components/SupabaseConnectionTest';
import TAGMePage from '../components/TAGMePage';
import CollaborationTestPage from '../components/testing/CollaborationTestPage';
import NotificationTest from '../components/testing/NotificationTest';
import TestMockAPI from '../components/testing/TestMockAPI';
import UploadGuidelines from '../components/upload-guidelines/UploadGuidelines_refactored';
import UploadFormGuard from '../components/UploadFormGuard';
import UploadPage from '../components/UploadPage';
import WorkDetailPage from '../components/work-detail/WorkDetailPage_refactored';
import AdminPanel from '../pages/AdminPanel';
import CoFuture2025 from '../pages/competitions/CoFuture2025';
import MajorAggregationPage from '../pages/MajorAggregationPage';
import EditProfile from '../pages/settings/EditProfile.tsx';
import TagAggregationPage from '../pages/TagAggregationPage';
import { useNavigation } from '../utils/navigation';

// 主页组件
const HomePage = () => (
  <>
    <HeroSection />
    <BannerSection />
    <CompetitionBanner />
    <GallerySection />
  </>
);

// 路由配置
const AppRoutes = () => {
  const { navigateToCollaboration, navigateToMilestone } = useNavigation();

  // 处理collaboration点击事件
  const handleCollaborationClick = project => {
    navigateToCollaboration(project);
  };

  // 处理milestone点击事件
  const handleMilestoneClick = milestone => {
    navigateToMilestone(milestone);
  };

  return (
    <Routes>
      {/* 登录页面 - 不需要保护 */}
      <Route path='/login' element={<LoginPage />} />

      {/* 注册页面 - 不需要保护 */}
      <Route path='/register' element={<RegisterPage />} />

      {/* 主页 - 需要保护 */}
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* 个人页面 - 需要保护 */}
      <Route
        path='/me'
        element={
          <ProtectedRoute>
            <ArtistProfile />
          </ProtectedRoute>
        }
      />

      {/* 作品详情页 - 需要保护 */}
      <Route
        path='/work/:id'
        element={
          <ProtectedRoute>
            <WorkDetailPage />
          </ProtectedRoute>
        }
      />

      {/* 艺术家档案页 - 需要保护 */}
      <Route
        path='/artist/:id'
        element={
          <ProtectedRoute>
            <ArtistProfile />
          </ProtectedRoute>
        }
      />

      {/* TAGMe页面 - 需要保护 */}
      <Route
        path='/tagme'
        element={
          <ProtectedRoute>
            <TAGMePage
              onCollaborationClick={handleCollaborationClick}
              onMilestoneClick={handleMilestoneClick}
            />
          </ProtectedRoute>
        }
      />

      {/* 里程碑页面 - 需要保护 */}
      <Route
        path='/tagme/milestone/:id'
        element={
          <ProtectedRoute>
            <MilestonePage />
          </ProtectedRoute>
        }
      />

      {/* 合作详情页面 - 需要保护 */}
      <Route
        path='/tagme/collaboration/:id'
        element={
          <ProtectedRoute>
            <CollaborationDetailPage />
          </ProtectedRoute>
        }
      />

      {/* CoFuture2025竞赛页面 - 不需要保护 */}
      <Route path='/tagme/co-future-2025' element={<CoFuture2025 />} />

      {/* 上传指南页面 - 不需要保护 */}
      <Route path='/upload/guidelines' element={<UploadGuidelines />} />

      {/* 上传表单页面 - 需要保护且必须确认指南 */}
      <Route
        path='/upload/form'
        element={
          <ProtectedRoute>
            <UploadFormGuard>
              <UploadPage />
            </UploadFormGuard>
          </ProtectedRoute>
        }
      />

      {/* 兼容旧的上传路由 */}
      <Route path='/upload' element={<UploadGuidelines />} />

      {/* 通知中心页面 - 需要保护 */}
      <Route
        path='/notifications'
        element={
          <ProtectedRoute>
            <NotificationCenter />
          </ProtectedRoute>
        }
      />

      {/* 通知测试页面 - 需要保护 */}
      <Route
        path='/notification-test'
        element={
          <ProtectedRoute>
            <NotificationTest />
          </ProtectedRoute>
        }
      />

      {/* 设置页面 - 需要保护 */}
      <Route
        path='/settings/edit-profile'
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      {/* Mock API 测试页面 - 临时添加 */}
      <Route
        path='/test-mock-api'
        element={
          <ProtectedRoute>
            <TestMockAPI />
          </ProtectedRoute>
        }
      />

      {/* Collaboration 测试页面 - 临时添加 */}
      <Route
        path='/test-collaboration'
        element={
          <ProtectedRoute>
            <CollaborationTestPage />
          </ProtectedRoute>
        }
      />

      {/* Supabase 连接测试页面 - 临时添加 */}
      <Route path='/test-supabase' element={<SupabaseConnectionTest />} />

      {/* 标签聚合页面 - 需要保护 */}
      <Route
        path='/t/:slug'
        element={
          <ProtectedRoute>
            <TagAggregationPage />
          </ProtectedRoute>
        }
      />

      {/* 专业聚合页面 - 需要保护 */}
      <Route
        path='/major-aggregation'
        element={
          <ProtectedRoute>
            <MajorAggregationPage />
          </ProtectedRoute>
        }
      />

      {/* 超级管理员面板 - 特殊权限 */}
      <Route path='/admin-panel' element={<AdminPanel />} />

      {/* 默认重定向到主页 */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

export default AppRoutes;

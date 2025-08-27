import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import NavBar from './components/navbar/NavBar_refactored';
import { LoadingOverlay, ScrollToTop } from './components/ui';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { Splash } from './components/ui/Splash';
import { AppProvider, useAppContext } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

// 应用内容组件
function AppContent() {
  const { state } = useAppContext();

  // 确保页面可以滚动
  useEffect(() => {
    // 恢复页面滚动
    document.body.style.overflow = 'unset';
    document.documentElement.style.overflow = 'unset';
  }, []);

  // 如果应用未初始化，显示Splash
  if (!state.isInitialized) {
    return <Splash />;
  }

  // 应用已初始化，显示正常内容
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className='min-h-screen bg-white'>
          <NavBar />
          <main className='pt-16'>
            <LoadingOverlay />
            <AppRoutes />
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

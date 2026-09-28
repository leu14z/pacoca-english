import React, { useState, Suspense, lazy } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import type { TabType } from './components/Navigation';
import { LearnPath } from './components/LearnPath';
import { LoginScreen } from './components/LoginScreen';
import type { Lesson } from './data/courses';

// Code-split heavy modals and tabs for high FPS and instant load
const LessonModal = lazy(() => import('./components/LessonModal').then((m) => ({ default: m.LessonModal })));
const PlacementTestModal = lazy(() => import('./components/PlacementTestModal').then((m) => ({ default: m.PlacementTestModal })));
const CoupleDashboard = lazy(() => import('./components/CoupleDashboard').then((m) => ({ default: m.CoupleDashboard })));
const Leaderboard = lazy(() => import('./components/Leaderboard').then((m) => ({ default: m.Leaderboard })));
const Quests = lazy(() => import('./components/Quests').then((m) => ({ default: m.Quests })));
const ProfileView = lazy(() => import('./components/ProfileView').then((m) => ({ default: m.ProfileView })));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-12">
    <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const MainApp: React.FC = () => {
  const { isAuthenticated, currentUser } = useUser();
  const [currentTab, setCurrentTab] = useState<TabType>('learn');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showPlacementModal, setShowPlacementModal] = useState<boolean>(false);

  // If user is not logged in on this device, show Login Screen
  if (!isAuthenticated || !currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Navigation (Sidebar on Desktop, Bottom Bar on Mobile) */}
      <Navigation currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 pt-3 sm:pt-6 pb-28 md:pb-8">
          <Suspense fallback={<LoadingSpinner />}>
            {currentTab === 'learn' && (
              <LearnPath
                onStartLesson={(lesson) => setActiveLesson(lesson)}
                onOpenPlacementTest={() => setShowPlacementModal(true)}
              />
            )}

            {currentTab === 'couple' && <CoupleDashboard />}

            {currentTab === 'leaderboard' && <Leaderboard />}

            {currentTab === 'quests' && <Quests />}

            {currentTab === 'profile' && <ProfileView />}
          </Suspense>
        </main>
      </div>

      {/* Interactive Lesson Modal (Lazy loaded) */}
      {activeLesson && (
        <Suspense fallback={null}>
          <LessonModal
            lesson={activeLesson}
            onClose={() => setActiveLesson(null)}
          />
        </Suspense>
      )}

      {/* Placement Test (Nivelamento) Modal (Lazy loaded) */}
      {showPlacementModal && (
        <Suspense fallback={null}>
          <PlacementTestModal onClose={() => setShowPlacementModal(false)} />
        </Suspense>
      )}
    </div>
  );
};

export function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}

export default App;

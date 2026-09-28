import React, { useState } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import type { TabType } from './components/Navigation';
import { LearnPath } from './components/LearnPath';
import { CoupleDashboard } from './components/CoupleDashboard';
import { Leaderboard } from './components/Leaderboard';
import { Quests } from './components/Quests';
import { ProfileView } from './components/ProfileView';
import { LessonModal } from './components/LessonModal';
import { LoginScreen } from './components/LoginScreen';
import { PlacementTestModal } from './components/PlacementTestModal';
import type { Lesson } from './data/courses';

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

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6">
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
        </main>
      </div>

      {/* Interactive Lesson Modal */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
        />
      )}

      {/* Placement Test (Nivelamento) Modal */}
      {showPlacementModal && (
        <PlacementTestModal onClose={() => setShowPlacementModal(false)} />
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

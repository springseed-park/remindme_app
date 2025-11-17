
import React, { useState, useCallback, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import HistoryScreen from './screens/HistoryScreen';
import AnalysisScreen from './screens/AnalysisScreen';
import HealingHomeScreen from './screens/HealingHomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import MailboxScreen from './screens/MailboxScreen';
import MusicStudioScreen from './screens/MusicStudioScreen';
import PsychTestScreen from './screens/PsychTestScreen';
import BottomNav from './components/BottomNav';
import SideMenu from './components/SideMenu';
import { DiaryProvider } from './context/DiaryContext';
import { UserProvider, useUser } from './context/UserContext';
import { QuestProvider } from './context/QuestContext';
import type { Screen, UserProfile } from './types';
import Header from './components/Header';
import SplashScreen from './screens/SplashScreen';
import { NotificationProvider } from './context/NotificationContext';
import NotificationPopup from './components/NotificationPopup';

const AppContent: React.FC = () => {
  const { isOnboardingComplete, setUserProfile } = useUser();
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const renderScreen = useCallback(() => {
    switch (currentScreen) {
      case 'home':
        return (
          <HealingHomeScreen
            onOpenChat={() => setCurrentScreen('chat')}
            onOpenMenu={() => setSideMenuOpen(true)}
          />
        );
      case 'chat':
        return <ChatScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'analysis':
        return <AnalysisScreen />;
      case 'mailbox':
        return <MailboxScreen />;
      case 'music-studio':
        return <MusicStudioScreen />;
      case 'psych-test':
        return <PsychTestScreen />;
      default:
        return (
          <HealingHomeScreen
            onOpenChat={() => setCurrentScreen('chat')}
            onOpenMenu={() => setSideMenuOpen(true)}
          />
        );
    }
  }, [currentScreen]);

  // 온보딩이 완료되지 않았으면 온보딩 화면 표시
  if (!showSplash && !isOnboardingComplete()) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <div className="bg-slate-50 min-h-screen h-screen w-full flex flex-col font-sans">
          {currentScreen !== 'home' && (
            <Header onToggleNotifications={() => setNotificationsOpen(prev => !prev)} />
          )}
          <NotificationPopup isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
          <SideMenu
            isOpen={isSideMenuOpen}
            onClose={() => setSideMenuOpen(false)}
            onNavigate={setCurrentScreen}
          />
          <div className={`flex-grow overflow-y-auto ${currentScreen !== 'home' ? 'pt-14 pb-20' : ''}`}>
            {renderScreen()}
          </div>
          {currentScreen !== 'home' && (
            <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
          )}
        </div>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <DiaryProvider>
        <QuestProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </QuestProvider>
      </DiaryProvider>
    </UserProvider>
  );
};

export default App;
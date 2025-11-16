
import React, { useState, useCallback, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import HistoryScreen from './screens/HistoryScreen';
import AnalysisScreen from './screens/AnalysisScreen';
import BottomNav from './components/BottomNav';
import { DiaryProvider } from './context/DiaryContext';
import type { Screen } from './types';
import Header from './components/Header';
import SplashScreen from './screens/SplashScreen';
import { NotificationProvider } from './context/NotificationContext';
import NotificationPopup from './components/NotificationPopup';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Show splash for 3 seconds
    return () => clearTimeout(timer);
  }, []);


  const renderScreen = useCallback(() => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen setCurrentScreen={setCurrentScreen} />;
      case 'chat':
        return <ChatScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'analysis':
        return <AnalysisScreen />;
      default:
        return <HomeScreen setCurrentScreen={setCurrentScreen} />;
    }
  }, [currentScreen]);

  return (
    <DiaryProvider>
      <NotificationProvider>
        {showSplash ? (
          <SplashScreen />
        ) : (
          <div className="bg-slate-50 min-h-screen h-screen w-full flex flex-col font-sans">
            <Header onToggleNotifications={() => setNotificationsOpen(prev => !prev)} />
            <NotificationPopup isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
            <div className="flex-grow overflow-y-auto pt-14 pb-20">
              {renderScreen()}
            </div>
            <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
          </div>
        )}
      </NotificationProvider>
    </DiaryProvider>
  );
};

export default App;
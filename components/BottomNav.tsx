
import React from 'react';
import type { Screen } from '../types';
import { HomeIcon, ChatIcon, HistoryIcon, AnalysisIcon } from './icons/NavIcons';

interface BottomNavProps {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-indigo-500' : 'text-gray-400 hover:text-indigo-400'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, setCurrentScreen }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-md flex justify-around items-center z-50">
      <NavItem
        label="일기쓰기"
        icon={<HomeIcon />}
        isActive={currentScreen === 'home'}
        onClick={() => setCurrentScreen('home')}
      />
      <NavItem
        label="대화하기"
        icon={<ChatIcon />}
        isActive={currentScreen === 'chat'}
        onClick={() => setCurrentScreen('chat')}
      />
      <NavItem
        label="기록보기"
        icon={<HistoryIcon />}
        isActive={currentScreen === 'history'}
        onClick={() => setCurrentScreen('history')}
      />
       <NavItem
        label="분석"
        icon={<AnalysisIcon />}
        isActive={currentScreen === 'analysis'}
        onClick={() => setCurrentScreen('analysis')}
      />
    </div>
  );
};

export default BottomNav;

import React from 'react';
import type { Screen } from '../types';
import { useUser } from '../context/UserContext';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onNavigate }) => {
  const { userProfile, heartPoints } = useUser();

  const handleNavigate = (screen: Screen) => {
    onNavigate(screen);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* 사이드 메뉴 */}
      <div className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 shadow-2xl transform transition-transform">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mt-4">
            <div className="text-4xl mb-2">
              {userProfile?.gender === 'male' ? '🧑' : userProfile?.gender === 'female' ? '👧' : '😊'}
            </div>
            <h2 className="text-xl font-bold">
              {userProfile?.gender === 'male' ? '형' : userProfile?.gender === 'female' ? '언니' : '친구'}
            </h2>
            <div className="mt-3 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full inline-flex">
              <span className="text-xl">💧</span>
              <span className="font-bold">{heartPoints.total} 마음</span>
            </div>
          </div>
        </div>

        {/* 메뉴 아이템 */}
        <div className="py-4">
          <MenuItem
            icon="💌"
            title="편지함"
            description="감정 기록 및 메시지 보관소"
            onClick={() => handleNavigate('mailbox')}
          />
          <MenuItem
            icon="🎼"
            title="나만의 힐링 음악 스튜디오"
            description="배경음악 커스터마이징"
            onClick={() => handleNavigate('music-studio')}
          />
          <MenuItem
            icon="📊"
            title="분석"
            description="월간 리포트 및 감정 요약"
            onClick={() => handleNavigate('analysis')}
          />
          <MenuItem
            icon="🧪"
            title="심리 검사"
            description="간단한 자가 평가 체크"
            onClick={() => handleNavigate('psych-test')}
          />

          <div className="border-t border-gray-200 my-4" />

          <MenuItem
            icon="📝"
            title="일기 기록"
            description="과거 일기 조회"
            onClick={() => handleNavigate('history')}
          />
          <MenuItem
            icon="💬"
            title="채팅"
            description="AI와 대화하기"
            onClick={() => handleNavigate('chat')}
          />
        </div>

        {/* 하단 정보 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            마음의 정원 v1.0
          </div>
        </div>
      </div>
    </>
  );
};

interface MenuItemProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full px-6 py-4 hover:bg-purple-50 transition-colors flex items-start gap-4 text-left"
    >
      <div className="text-3xl">{icon}</div>
      <div className="flex-1">
        <div className="font-medium text-gray-800">{title}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
      <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};

export default SideMenu;

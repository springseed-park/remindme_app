import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import type { CharacterMessage } from '../types';

interface HealingHomeScreenProps {
  onOpenChat: () => void;
  onOpenMenu: () => void;
}

// 캐릭터 메시지 데이터
const CHARACTER_MESSAGES: CharacterMessage[] = [
  { id: '1', category: 'greeting', message: '오늘도 당신의 노력이 빛났어요 ✨' },
  { id: '2', category: 'encouragement', message: '잠깐 심호흡 해봐요. 괜찮아질 거예요 🌸' },
  { id: '3', category: 'comfort', message: '힘든 일이 있었나요? 제게 말해주세요 💙' },
  { id: '4', category: 'motivation', message: '당신은 충분히 잘하고 있어요 🌟' },
  { id: '5', category: 'greeting', message: '오늘 하루도 수고했어요 🌙' },
  { id: '6', category: 'encouragement', message: '천천히 가도 괜찮아요. 당신의 속도로요 🌿' },
  { id: '7', category: 'comfort', message: '함께 있어 줄게요. 언제든 이야기해요 🤗' },
  { id: '8', category: 'motivation', message: '작은 발걸음도 분명 앞으로 나아가는 거예요 🦋' },
];

const HealingHomeScreen: React.FC<HealingHomeScreenProps> = ({ onOpenChat, onOpenMenu }) => {
  const { userProfile, heartPoints, hasAttendedToday, checkAttendance } = useUser();
  const [currentMessage, setCurrentMessage] = useState<CharacterMessage>(CHARACTER_MESSAGES[0]);
  const [showAttendanceReward, setShowAttendanceReward] = useState(false);

  // 컴포넌트 마운트 시 출석체크
  useEffect(() => {
    if (!hasAttendedToday()) {
      checkAttendance();
      setShowAttendanceReward(true);
      setTimeout(() => setShowAttendanceReward(false), 3000);
    }
  }, []);

  // 랜덤 메시지 변경 (10초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * CHARACTER_MESSAGES.length);
      setCurrentMessage(CHARACTER_MESSAGES[randomIndex]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // 시간대별 인사말
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침이에요';
    if (hour < 18) return '좋은 오후에요';
    return '좋은 저녁이에요';
  };

  // 캐릭터 이모지 (성별에 따라)
  const getCharacterEmoji = () => {
    if (!userProfile) return '😊';
    switch (userProfile.gender) {
      case 'male':
        return '🧑';
      case 'female':
        return '👧';
      default:
        return '😊';
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200 rounded-full opacity-20 blur-3xl" />
      <div className="absolute top-1/3 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-3xl" />

      {/* 상단 영역 */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <button
          onClick={onOpenMenu}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* 마음 포인트 표시 */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <span className="text-2xl">💧</span>
          <span className="font-bold text-purple-600">{heartPoints.total}</span>
        </div>
      </div>

      {/* 출석 보상 애니메이션 */}
      {showAttendanceReward && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-white rounded-2xl px-6 py-4 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <div className="font-bold text-purple-600">출석체크 완료!</div>
              <div className="text-sm text-gray-600">마음 +5</div>
            </div>
          </div>
        </div>
      )}

      {/* 중앙 캐릭터 영역 */}
      <div className="h-full flex flex-col items-center justify-center px-6">
        {/* 인사말 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {getGreeting()}, {userProfile?.gender === 'male' ? '형' : userProfile?.gender === 'female' ? '언니' : '친구'}!
          </h1>
          <p className="text-gray-600">오늘 하루는 어떠셨나요?</p>
        </div>

        {/* 캐릭터 */}
        <div className="relative mb-8">
          <div className="text-9xl animate-pulse">{getCharacterEmoji()}</div>

          {/* 말풍선 */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 -translate-y-full w-64">
            <div className="bg-white rounded-2xl px-6 py-4 shadow-xl relative">
              <p className="text-sm text-gray-700 text-center">{currentMessage.message}</p>
              {/* 말풍선 꼬리 */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white" />
              </div>
            </div>
          </div>
        </div>

        {/* 작은 장식 요소들 */}
        <div className="flex gap-4 mb-8">
          <div className="text-3xl animate-bounce" style={{ animationDelay: '0s' }}>🌸</div>
          <div className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</div>
          <div className="text-3xl animate-bounce" style={{ animationDelay: '0.4s' }}>🌿</div>
        </div>
      </div>

      {/* 하단 채팅 입력란 위젯 */}
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={onOpenChat}
          className="w-full bg-white/90 backdrop-blur-sm rounded-full px-6 py-4 shadow-2xl flex items-center gap-4 hover:bg-white transition-all group"
        >
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            💬
          </div>
          <span className="text-gray-500 flex-1 text-left">마음이에게 이야기해보세요...</span>
          <svg
            className="w-6 h-6 text-purple-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>

      {/* 배경 음악 컨트롤 (향후 구현) */}
      <div className="absolute bottom-24 right-6">
        <button className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all">
          <span className="text-xl">🎵</span>
        </button>
      </div>
    </div>
  );
};

export default HealingHomeScreen;

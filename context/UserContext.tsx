import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile, AttendanceRecord, HeartPoints } from '../types';

interface UserContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  heartPoints: HeartPoints;
  addHeartPoints: (amount: number, reason: string) => void;
  attendanceRecords: AttendanceRecord[];
  checkAttendance: () => void;
  hasAttendedToday: () => boolean;
  isOnboardingComplete: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [heartPoints, setHeartPoints] = useState<HeartPoints>({
    total: 0,
    history: [],
  });
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // LocalStorage에서 데이터 로드
  useEffect(() => {
    const loadData = () => {
      try {
        const savedProfile = localStorage.getItem('userProfile');
        const savedHeartPoints = localStorage.getItem('heartPoints');
        const savedAttendance = localStorage.getItem('attendanceRecords');

        if (savedProfile) {
          setUserProfileState(JSON.parse(savedProfile));
        }
        if (savedHeartPoints) {
          setHeartPoints(JSON.parse(savedHeartPoints));
        }
        if (savedAttendance) {
          setAttendanceRecords(JSON.parse(savedAttendance));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    loadData();
  }, []);

  // 사용자 프로필 저장
  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  // 마음 포인트 추가
  const addHeartPoints = (amount: number, reason: string) => {
    const newHistory = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount,
      reason,
      timestamp: new Date().toISOString(),
    };

    const updatedPoints: HeartPoints = {
      total: heartPoints.total + amount,
      history: [...heartPoints.history, newHistory],
    };

    setHeartPoints(updatedPoints);
    localStorage.setItem('heartPoints', JSON.stringify(updatedPoints));
  };

  // 출석체크
  const checkAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    const alreadyChecked = attendanceRecords.some((record) => record.date === today);

    if (!alreadyChecked) {
      const pointsEarned = 5; // 출석체크 기본 포인트
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        date: today,
        timestamp: new Date().toISOString(),
        heartPointsEarned: pointsEarned,
      };

      const updatedRecords = [...attendanceRecords, newRecord];
      setAttendanceRecords(updatedRecords);
      localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));

      // 포인트 추가
      addHeartPoints(pointsEarned, '출석체크');
    }
  };

  // 오늘 출석했는지 확인
  const hasAttendedToday = (): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceRecords.some((record) => record.date === today);
  };

  // 온보딩 완료 여부 확인
  const isOnboardingComplete = (): boolean => {
    return userProfile?.onboardingCompleted === true;
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        setUserProfile,
        heartPoints,
        addHeartPoints,
        attendanceRecords,
        checkAttendance,
        hasAttendedToday,
        isOnboardingComplete,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

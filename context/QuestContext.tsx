import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Quest } from '../types';
import { useUser } from './UserContext';

interface QuestContextType {
  quests: Quest[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  assignQuest: (quest: Quest) => void;
  startQuest: (questId: string) => void;
  completeQuest: (questId: string, beforeRating: number, afterRating: number) => void;
  getQuestsByDiaryEntry: (diaryEntryId: string) => Quest[];
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const useQuest = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuest must be used within a QuestProvider');
  }
  return context;
};

interface QuestProviderProps {
  children: ReactNode;
}

export const QuestProvider: React.FC<QuestProviderProps> = ({ children }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const { addHeartPoints } = useUser();

  // LocalStorage에서 퀘스트 로드
  useEffect(() => {
    const loadQuests = () => {
      try {
        const savedQuests = localStorage.getItem('quests');
        if (savedQuests) {
          setQuests(JSON.parse(savedQuests));
        }
      } catch (error) {
        console.error('Failed to load quests:', error);
      }
    };
    loadQuests();
  }, []);

  // 퀘스트 저장
  const saveQuests = (updatedQuests: Quest[]) => {
    setQuests(updatedQuests);
    localStorage.setItem('quests', JSON.stringify(updatedQuests));
  };

  // 퀘스트 할당
  const assignQuest = (quest: Quest) => {
    const updatedQuests = [...quests, quest];
    saveQuests(updatedQuests);
  };

  // 퀘스트 시작
  const startQuest = (questId: string) => {
    const updatedQuests = quests.map((q) =>
      q.id === questId ? { ...q, status: 'in-progress' as const } : q
    );
    saveQuests(updatedQuests);
  };

  // 퀘스트 완료
  const completeQuest = (questId: string, beforeRating: number, afterRating: number) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    const updatedQuests = quests.map((q) =>
      q.id === questId
        ? {
            ...q,
            status: 'completed' as const,
            completedAt: new Date().toISOString(),
            beforeRating,
            afterRating,
          }
        : q
    );
    saveQuests(updatedQuests);

    // 퀘스트 완료 보상 지급
    addHeartPoints(quest.heartPointsReward, '퀘스트 완료');

    // 개선도에 따른 추가 보상
    const improvement = afterRating - beforeRating;
    if (improvement > 0) {
      const bonusPoints = improvement * 2;
      addHeartPoints(bonusPoints, '마음 개선 보너스');
    }
  };

  // 일기별 퀘스트 조회
  const getQuestsByDiaryEntry = (diaryEntryId: string): Quest[] => {
    return quests.filter((q) => q.diaryEntryId === diaryEntryId);
  };

  // 활성 퀘스트 (할당됨 + 진행 중)
  const activeQuests = quests.filter(
    (q) => q.status === 'assigned' || q.status === 'in-progress'
  );

  // 완료된 퀘스트
  const completedQuests = quests.filter((q) => q.status === 'completed');

  return (
    <QuestContext.Provider
      value={{
        quests,
        activeQuests,
        completedQuests,
        assignQuest,
        startQuest,
        completeQuest,
        getQuestsByDiaryEntry,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};

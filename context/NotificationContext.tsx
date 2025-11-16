
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Notification, DiaryEntry } from '../types';
import { useDiary } from './DiaryContext';
import { generateProactiveSuggestion } from '../services/openaiService';

// Helper to create a date string for `daysAgo` from today at the start of the day (local time)
const createPastDateISO = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
};

const sampleNotifications: Notification[] = [
    {
        id: 'sample-notif-1',
        date: createPastDateISO(1),
        message: "어제는 정말 힘든 하루였군요. 당신의 마음이 조금은 괜찮아졌기를 바라요.",
        suggestionTitle: "지금 바로 도움 요청하기",
        suggestionContent: "혼자 모든 것을 감당하지 않아도 괜찮아요. 당신의 이야기를 들어주고 도움을 줄 수 있는 사람들이 있어요.\n\n자살예방 상담전화: 1393 (24시간)\n정신건강 위기상담전화: 1577-0199",
        isRead: false,
        basedOnEntryId: 'sample-13',
    },
    {
        id: 'sample-notif-2',
        date: createPastDateISO(2),
        message: "SNS를 보고 마음이 가라앉았던 어제, 오늘은 잠시 디지털 세상에서 벗어나보는 건 어때요?",
        suggestionTitle: "디지털 디톡스 산책",
        suggestionContent: "1. 핸드폰은 잠시 집에 두고 가벼운 옷차림으로 밖으로 나가보세요.\n2. 주변의 소리, 바람, 햇살을 온전히 느껴보세요.\n3. 10분이라도 괜찮아요. 걷는 동안은 오직 당신의 감각에만 집중해보세요.",
        isRead: false,
        basedOnEntryId: 'sample-20',
    },
    {
        id: 'sample-notif-3',
        date: createPastDateISO(3),
        message: "어제는 스스로에게 조금 화가 났던 날이었군요. 오늘은 자신에게 조금 더 너그러워져도 괜찮아요.",
        suggestionTitle: "셀프 칭찬 한 가지 하기",
        suggestionContent: "오늘 하루 동안 당신이 해낸 아주 사소한 일 한 가지를 찾아보세요. '물을 마셨다', '제시간에 일어났다' 등 무엇이든 좋아요. 그리고 그 일에 대해 스스로를 칭찬해주세요.",
        isRead: true,
        basedOnEntryId: 'sample-17',
    },
    {
        id: 'sample-notif-4',
        date: createPastDateISO(4),
        message: "일 때문에 많이 지쳤던 어제, 오늘은 당신의 에너지를 채울 시간이 필요해요.",
        suggestionTitle: "5분 숨 돌리기",
        suggestionContent: "잠시 하던 일을 멈추고 편안한 자세를 취하세요. 좋아하는 음악 한 곡을 듣거나, 따뜻한 차 한 잔을 마시거나, 창밖을 멍하니 바라보는 것만으로도 충분해요. 온전히 5분 동안만 휴식에 집중해보세요.",
        isRead: true,
        basedOnEntryId: 'sample-7',
    },
    {
        id: 'sample-notif-5',
        date: createPastDateISO(5),
        message: "어제는 무기력감에 조금 힘드셨군요. 오늘은 아주 작은 움직임으로 시작해보는 건 어때요?",
        suggestionTitle: "침대 위 스트레칭",
        suggestionContent: "자리에서 일어나기 전, 침대에 누운 채로 기지개를 켜보세요. 팔과 다리를 쭉 뻗고, 몸이 시원하게 늘어나는 느낌에 집중해보세요. 이 작은 움직임이 하루를 시작할 에너지를 줄 거예요.",
        isRead: true,
        basedOnEntryId: 'sample-4',
    }
];

const isRecentAndNotToday = (dateString: string): boolean => {
  const entryDate = new Date(dateString);
  const today = new Date();
  
  // Ignore entries from today
  if (entryDate.toDateString() === today.toDateString()) {
    return false;
  }
  
  // Check if the entry is within the last 48 hours
  const fortyEightHoursAgo = new Date();
  fortyEightHoursAgo.setHours(today.getHours() - 48);
  
  return entryDate > fortyEightHoursAgo;
};


interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const diary = useDiary();

  useEffect(() => {
    try {
      const storedNotifications = localStorage.getItem('notifications');
      if (storedNotifications && JSON.parse(storedNotifications).length > 0) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        setNotifications(sampleNotifications);
      }
    } catch (error) {
      console.error('Failed to load notifications from localStorage', error);
      setNotifications(sampleNotifications);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications, isLoading]);
  
  const addNotification = useCallback((newNotificationData: Omit<Notification, 'id' | 'date' | 'isRead'>, basedOnEntryId: string) => {
    const newNotification: Notification = {
        ...newNotificationData,
        id: new Date().toISOString(),
        date: new Date().toISOString(),
        isRead: false,
        basedOnEntryId,
    };
    setNotifications(prev => [newNotification, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const checkForNewSuggestion = useCallback(async (entry: DiaryEntry) => {
    const hasExistingNotification = notifications.some(n => n.basedOnEntryId === entry.id);
    if (hasExistingNotification) {
      return;
    }
    
    const suggestion = await generateProactiveSuggestion(entry);
    if (suggestion) {
        addNotification(suggestion, entry.id);
    }

  }, [notifications, addNotification]);

  useEffect(() => {
    // Only run this check once per day after diary is loaded.
    if (diary.isLoading) {
      return; // Wait for diary to load
    }
    
    const lastCheckedStr = localStorage.getItem('lastSuggestionCheckDate');
    const todayStr = new Date().toISOString().split('T')[0];

    if (lastCheckedStr === todayStr) {
      return; // Already checked today
    }
    
    if (diary.entries.length > 0) {
      const latestEntry = diary.entries[0];
      if (latestEntry && isRecentAndNotToday(latestEntry.date)) {
        checkForNewSuggestion(latestEntry).finally(() => {
          localStorage.setItem('lastSuggestionCheckDate', todayStr);
        });
      } else {
        // Even if no suggestion is generated for old entries, mark as checked for today
        localStorage.setItem('lastSuggestionCheckDate', todayStr);
      }
    }
  }, [diary.isLoading, diary.entries, checkForNewSuggestion]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
        prev.map(n => n.isRead ? n : { ...n, isRead: true })
    );
  }, []);


  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};


export interface EmotionAnalysis {
  mainEmotion: string;
  emotionAnalysis: string;
  suggestion: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  response: string;
  analysis: EmotionAnalysis;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export type Screen = 'home' | 'chat' | 'history' | 'analysis' | 'music-studio' | 'psych-test' | 'mailbox';

export interface WeeklyAnalysis {
  weeklySummary: string;
  identifiedPattern: string;
  patternExplanation: string;
  suggestionForNextWeek: string;
}

export interface Notification {
  id: string;
  date: string;
  message: string;
  suggestionTitle: string;
  suggestionContent: string;
  isRead: boolean;
  basedOnEntryId: string;
}

// 새로운 기획서 기반 타입 정의

// 온보딩: 사용자 프로필
export interface UserProfile {
  id: string;
  birthDate: string; // YYYY-MM-DD
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  concerns: string[]; // 관심사/고민 분야 (다중 선택)
  curiosityMoments: string[]; // 궁금증을 느끼는 순간
  dislikedPeople: string; // 가장 싫어하는 사람/상황
  characterStyle: 'default' | 'custom'; // 캐릭터 스타일
  onboardingCompleted: boolean;
  createdAt: string;
}

// 출석체크 및 포인트 시스템
export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO 8601
  heartPointsEarned: number;
}

export interface HeartPoints {
  total: number;
  history: {
    id: string;
    date: string;
    amount: number;
    reason: string; // '출석체크', '퀘스트 완료', '감정일기 작성' etc.
    timestamp: string;
  }[];
}

// 퀘스트 시스템
export interface Quest {
  id: string;
  diaryEntryId: string; // 연결된 일기 ID
  detectedEmotion: string; // 감지된 감정 (우울, 무기력, 분노 등)
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'assigned' | 'in-progress' | 'completed';
  assignedAt: string;
  completedAt?: string;
  beforeRating?: number; // 퀘스트 전 마음 상태 (1-5)
  afterRating?: number; // 퀘스트 후 마음 상태 (1-5)
  heartPointsReward: number;
}

// 힐링 음악 스튜디오
export interface MusicMix {
  id: string;
  name: string;
  backgroundMelody: string; // 선택한 멜로디 ID
  natureSound: string; // 선택한 자연 소리 ID
  melodyVolume: number; // 0-100
  natureSoundVolume: number; // 0-100
  isActive: boolean; // 현재 메인 화면에서 재생 중인지
  createdAt: string;
  updatedAt: string;
}

export interface MusicTrack {
  id: string;
  name: string;
  type: 'melody' | 'nature';
  url: string;
  duration?: number;
}

// 심리 검사
export interface PsychTest {
  id: string;
  title: string;
  description: string;
  category: 'depression' | 'anxiety' | 'stress' | 'burnout' | 'self-esteem';
  questions: PsychTestQuestion[];
  scoringGuide: {
    ranges: {
      min: number;
      max: number;
      level: string;
      description: string;
    }[];
  };
}

export interface PsychTestQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    score: number;
  }[];
}

export interface PsychTestResult {
  id: string;
  testId: string;
  testTitle: string;
  date: string;
  answers: { questionId: string; score: number }[];
  totalScore: number;
  level: string;
  interpretation: string;
  recommendations: string[];
}

// 캐릭터 메시지
export interface CharacterMessage {
  id: string;
  category: 'greeting' | 'encouragement' | 'comfort' | 'motivation';
  message: string;
  condition?: {
    userEmotion?: string[];
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  };
}

// 월간 리포트 (확장)
export interface MonthlyReport {
  id: string;
  month: string; // YYYY-MM
  generatedAt: string;
  topEmotions: {
    emotion: string;
    count: number;
    percentage: number;
    dates: string[];
  }[];
  emotionTrend: {
    positive: number; // 긍정 감정 비율
    negative: number; // 부정 감정 비율
    neutral: number; // 중립 감정 비율
  };
  concernAnalysis: {
    concern: string; // 관심사 (커리어, 돈 등)
    emotionDistribution: {
      emotion: string;
      percentage: number;
    }[];
  }[];
  questStats: {
    totalAssigned: number;
    totalCompleted: number;
    completionRate: number;
    averageImprovement: number; // 평균 개선도 (afterRating - beforeRating)
  };
  weeklyAnalysis: WeeklyAnalysis[];
  summary: string; // AI 생성 종합 요약
}
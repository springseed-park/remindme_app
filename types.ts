
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

export type Screen = 'home' | 'chat' | 'history' | 'analysis';

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
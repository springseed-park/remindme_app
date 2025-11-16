import React, { useMemo, useState, useEffect } from 'react';
import { useDiary } from '../context/DiaryContext';
import { getWeeklyAnalysis } from '../services/openaiService';
import type { WeeklyAnalysis } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmotionDonutChart from '../components/EmotionDonutChart';
import EmotionTrendChart from '../components/EmotionTrendChart';

type TimeRange = '7d' | '15d' | '30d';

const TimeRangeButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none ${
        isActive
          ? 'border-b-2 border-indigo-500 text-indigo-600'
          : 'text-gray-500 hover:text-gray-700'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </button>
  );
};

const emotionToScore: { [key: string]: number } = {
  '기쁨': 5,
  '놀람': 4,
  '외로움': 2,
  '죄책감': 2,
  '수치심': 2,
  '슬픔': 2,
  '불안': 2,
  '분노': 1,
};


const AnalysisScreen: React.FC = () => {
  const { entries, isLoading } = useDiary();
  const [report, setReport] = useState<WeeklyAnalysis | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const timeRangeMap = {
    '7d': { days: 7, label: '7일' },
    '15d': { days: 15, label: '15일' },
    '30d': { days: 30, label: '한 달' },
  };

  const recentEntries = useMemo(() => {
    const { days } = timeRangeMap[timeRange];
    const targetDate = new Date();
    // Inclusive of today, so we go back `days - 1`
    targetDate.setDate(targetDate.getDate() - (days - 1));
    targetDate.setHours(0, 0, 0, 0); 
    return entries.filter(entry => new Date(entry.date) >= targetDate);
  }, [entries, timeRange]);

  useEffect(() => {
    if (recentEntries.length > 0) {
      const fetchReport = async () => {
        setIsReportLoading(true);
        const cacheKey = `analysisReport-${timeRange}-${recentEntries[0].id}`;

        try {
          const cachedItem = localStorage.getItem(cacheKey);
          if (cachedItem) {
            setReport(JSON.parse(cachedItem));
            setIsReportLoading(false);
            return; // Use cached data
          }
        } catch (e) {
          console.error("Failed to read analysis report from cache", e);
        }

        // If no valid cache, fetch from API
        const fetchedReport = await getWeeklyAnalysis(recentEntries, timeRangeMap[timeRange].days);
        setReport(fetchedReport);
        
        try {
          localStorage.setItem(cacheKey, JSON.stringify(fetchedReport));
        } catch(e) {
            console.error("Failed to write analysis report to cache", e);
        }
        
        setIsReportLoading(false);
      };
      fetchReport();
    } else {
        setReport(null);
    }
  }, [recentEntries, timeRange]);


  const analysisData = useMemo(() => {
    if (recentEntries.length === 0) {
      return null;
    }

    const emotionCounts: { [key: string]: number } = {};
    recentEntries.forEach(entry => {
      const emotion = entry.analysis.mainEmotion;
      if (emotion !== "분석 불가") {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      }
    });

    const mostFrequentEmotion = Object.entries(emotionCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0];

    return {
      entryCount: recentEntries.length,
      mostFrequentEmotion: mostFrequentEmotion ? mostFrequentEmotion[0] : '없음',
      emotionCounts,
    };
  }, [recentEntries]);
  
  const trendData = useMemo(() => {
    return recentEntries
        .map(entry => ({
            date: entry.date,
            value: emotionToScore[entry.analysis.mainEmotion] || 3, // Default to neutral
            label: entry.analysis.mainEmotion,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [recentEntries]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><LoadingSpinner message="기록을 불러오는 중..." /></div>;
  }
  
  const { label: timeLabel } = timeRangeMap[timeRange];

  return (
    <div className="p-4">
      <header className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">마음 분석</h2>
        <p className="text-gray-500 mt-2">지난 {timeLabel}간의 내 마음 돌아보기</p>
      </header>

      <div className="flex justify-center border-b border-gray-200 mb-6">
        <TimeRangeButton label="최근 7일" isActive={timeRange === '7d'} onClick={() => setTimeRange('7d')} />
        <TimeRangeButton label="최근 15일" isActive={timeRange === '15d'} onClick={() => setTimeRange('15d')} />
        <TimeRangeButton label="최근 한 달" isActive={timeRange === '30d'} onClick={() => setTimeRange('30d')} />
      </div>

      {!analysisData ? (
        <div className="text-center text-gray-500 mt-20 p-6 bg-white">
          <p>분석할 기록이 아직 충분하지 않아요.</p>
          <p className="mt-2">선택한 기간 동안의 일기를 작성하고 다시 확인해주세요.</p>
        </div>
      ) : (
        <div className="space-y-6 -mx-4">
          <div className="bg-white p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">기간 내 요약</h2>
            <div className="space-y-3 text-gray-700">
              <p>지난 {timeLabel} 동안 <span className="font-bold text-indigo-500">{analysisData.entryCount}번</span>의 마음을 남겼어요.</p>
              <p>가장 자주 느낀 감정은 <span className="font-bold text-indigo-500">{analysisData.mostFrequentEmotion}</span> 이었어요.</p>
            </div>
          </div>

           <div className="bg-white p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">감정 분포</h2>
             <EmotionDonutChart data={analysisData.emotionCounts} />
          </div>
          
          <div className="bg-white p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">감정 변화 추이</h2>
            <EmotionTrendChart data={trendData} />
          </div>

          <div className="bg-white p-6">
             <h2 className="text-xl font-bold text-gray-800 mb-4">AI 마음 리포트</h2>
             {isReportLoading && <LoadingSpinner message="일기를 분석해 리포트를 만들고 있어요..." />}
             {!isReportLoading && report && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-indigo-700 mb-1">기간 돌아보기</h3>
                    <p className="text-gray-600 leading-relaxed bg-indigo-50 p-3">{report.weeklySummary}</p>
                  </div>
                   <div>
                    <h3 className="font-semibold text-indigo-700 mb-1">발견된 마음 습관</h3>
                    <div className="bg-indigo-50 p-3">
                      <p className="font-bold text-gray-800">{report.identifiedPattern}</p>
                      <p className="text-gray-600 leading-relaxed mt-1">{report.patternExplanation}</p>
                    </div>
                  </div>
                   <div>
                    <h3 className="font-semibold text-indigo-700 mb-1">다음 기간을 위한 마음챙김 제안</h3>
                     <p className="text-gray-600 leading-relaxed bg-indigo-50 p-3">{report.suggestionForNextWeek}</p>
                  </div>
                </div>
             )}
             {!isReportLoading && !report && recentEntries.length > 0 && (
                 <div className="text-center text-gray-500 p-4">
                  <p>리포트를 생성하는데 실패했어요. 잠시 후 다시 시도해주세요.</p>
                </div>
             )}
          </div>


           <div className="text-center text-gray-500 mt-2 text-sm p-4 bg-slate-100">
              <p>이 분석은 AI가 제공하는 정보이며, 전문적인 심리 진단을 대체할 수 없습니다.</p>
              <p className="mt-1">자신의 마음을 이해하는 참고 자료로 활용해주세요.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisScreen;
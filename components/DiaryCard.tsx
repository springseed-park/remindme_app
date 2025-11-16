import React from 'react';
import type { DiaryEntry } from '../types';

const DiaryCard: React.FC<{ entry: DiaryEntry }> = ({ entry }) => {
  const formattedDate = new Date(entry.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="bg-white p-6">
      <p className="text-sm text-gray-500 mb-4">{formattedDate}</p>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">나의 하루</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
      </div>

      <div className="bg-indigo-50 p-4 mb-6">
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">마음이의 답장</h3>
        <p className="text-indigo-700 leading-relaxed whitespace-pre-wrap">{entry.response}</p>
      </div>

      {entry.analysis && (
         <div className="bg-slate-100 p-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">마음 분석 리포트</h3>
            <div className="space-y-4">
                {entry.analysis.riskLevel === 'high' && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                        <p className="font-bold">중요</p>
                        <p>많이 힘든 시간을 보내고 계신 것 같아요. 혼자 감당하기 어렵다면 전문가의 도움을 받는 것이 중요해요. 주저하지 말고 연락해 보세요. (자살예방 상담전화 1393)</p>
                    </div>
                )}
                <div>
                    <h4 className="font-semibold text-slate-700">주요 감정</h4>
                    <p className="text-slate-600">{entry.analysis.mainEmotion}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700">마음 상태 분석</h4>
                    <p className="text-slate-600 leading-relaxed">{entry.analysis.emotionAnalysis}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-slate-700">마음챙김 제안</h4>
                    <p className="text-slate-600 leading-relaxed">{entry.analysis.suggestion}</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default DiaryCard;
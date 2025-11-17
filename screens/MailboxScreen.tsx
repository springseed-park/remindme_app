import React, { useState } from 'react';
import { useDiary } from '../context/DiaryContext';
import type { DiaryEntry } from '../types';

const MailboxScreen: React.FC = () => {
  const { entries } = useDiary();
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  // 최신 순으로 정렬
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">편지함 💌</h1>
        <p className="text-gray-600 mb-6">
          당신의 마음을 담은 소중한 기록들이에요
        </p>

        {sortedEntries.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500">아직 작성한 일기가 없어요</p>
            <p className="text-sm text-gray-400 mt-2">
              오늘의 감정을 기록해보세요
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">💌</div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {new Date(entry.date).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-sm text-purple-600 font-medium">
                        {entry.analysis.mainEmotion}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      entry.analysis.riskLevel === 'high'
                        ? 'bg-red-100 text-red-700'
                        : entry.analysis.riskLevel === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {entry.analysis.riskLevel === 'high'
                      ? '주의'
                      : entry.analysis.riskLevel === 'medium'
                      ? '보통'
                      : '좋음'}
                  </div>
                </div>

                <p className="text-gray-700 line-clamp-2 mb-3">
                  {entry.content}
                </p>

                <div className="text-sm text-gray-500 border-t pt-3">
                  <span className="font-medium">마음이의 응답:</span>{' '}
                  <span className="line-clamp-1">{entry.response}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 상세 모달 */}
        {selectedEntry && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEntry(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {new Date(selectedEntry.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h2>
                  <div className="text-purple-600 font-medium mt-1">
                    {selectedEntry.analysis.mainEmotion}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">내가 쓴 일기</h3>
                  <div className="bg-purple-50 rounded-lg p-4 text-gray-800">
                    {selectedEntry.content}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">마음이의 응답</h3>
                  <div className="bg-pink-50 rounded-lg p-4 text-gray-800">
                    {selectedEntry.response}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">감정 분석</h3>
                  <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">주요 감정: </span>
                      <span className="text-purple-600">{selectedEntry.analysis.mainEmotion}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">분석: </span>
                      <span className="text-gray-800">{selectedEntry.analysis.emotionAnalysis}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">제안: </span>
                      <span className="text-gray-800">{selectedEntry.analysis.suggestion}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailboxScreen;

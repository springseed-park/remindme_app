import React, { useState } from 'react';
import type { Quest } from '../types';
import { useQuest } from '../context/QuestContext';

interface QuestCardProps {
  quest: Quest;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const { startQuest, completeQuest } = useQuest();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [beforeRating, setBeforeRating] = useState<number>(3);
  const [afterRating, setAfterRating] = useState<number>(3);

  const handleStart = () => {
    startQuest(quest.id);
  };

  const handleComplete = () => {
    setShowRatingModal(true);
  };

  const handleSubmitRating = () => {
    completeQuest(quest.id, beforeRating, afterRating);
    setShowRatingModal(false);
  };

  const getDifficultyColor = () => {
    switch (quest.difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
    }
  };

  const getDifficultyText = () => {
    switch (quest.difficulty) {
      case 'easy':
        return '쉬움';
      case 'medium':
        return '보통';
      case 'hard':
        return '어려움';
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-md border-2 border-purple-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎯</span>
              <h3 className="font-bold text-gray-800 text-lg">{quest.title}</h3>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor()}`}
              >
                {getDifficultyText()}
              </span>
              <span className="text-sm text-purple-600 font-medium">
                💧 +{quest.heartPointsReward}
              </span>
            </div>
          </div>
          {quest.status === 'completed' && (
            <div className="text-3xl">✅</div>
          )}
        </div>

        <p className="text-gray-700 text-sm mb-4">{quest.description}</p>

        <div className="text-xs text-gray-500 mb-4">
          감정: {quest.detectedEmotion} | 할당됨:{' '}
          {new Date(quest.assignedAt).toLocaleDateString('ko-KR')}
        </div>

        {quest.status === 'assigned' && (
          <button
            onClick={handleStart}
            className="w-full py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600"
          >
            시작하기
          </button>
        )}

        {quest.status === 'in-progress' && (
          <button
            onClick={handleComplete}
            className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
          >
            완료하기
          </button>
        )}

        {quest.status === 'completed' && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm text-green-700 font-medium mb-1">
              완료됨 ✨
            </div>
            {quest.beforeRating !== undefined &&
              quest.afterRating !== undefined && (
                <div className="text-xs text-gray-600">
                  마음 변화: {quest.beforeRating} → {quest.afterRating} (
                  {quest.afterRating - quest.beforeRating > 0 ? '+' : ''}
                  {quest.afterRating - quest.beforeRating})
                </div>
              )}
          </div>
        )}
      </div>

      {/* 평가 모달 */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              퀘스트 완료! 🎉
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">
                  퀘스트를 하기 전 마음 상태는?
                </h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setBeforeRating(rating)}
                      className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                        beforeRating === rating
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 text-gray-600 hover:border-purple-300'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>매우 나쁨</span>
                  <span>매우 좋음</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-3">
                  퀘스트를 한 후 마음 상태는?
                </h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setAfterRating(rating)}
                      className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                        afterRating === rating
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 text-gray-600 hover:border-green-300'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>매우 나쁨</span>
                  <span>매우 좋음</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleSubmitRating}
                className="flex-1 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600"
              >
                제출
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestCard;

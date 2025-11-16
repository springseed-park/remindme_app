
import React, { useState } from 'react';
import { useDiary } from '../context/DiaryContext';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Screen } from '../types';

interface HomeScreenProps {
  setCurrentScreen: (screen: Screen) => void;
}

const prompts = [
  "오늘 하루는 어땠어?",
  "지금 뭐하고 있어?",
  "나한테 자랑하고 싶은 아주 작은 일이라도 있어?",
  "요즘 너의 마음을 채우는 건 뭐야?",
];


const HomeScreen: React.FC<HomeScreenProps> = ({ setCurrentScreen }) => {
  const [content, setContent] = useState('');
  const { addDiaryEntry, isStoring } = useDiary();
  const [prompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('오늘의 이야기를 들려주세요.');
      return;
    }
    try {
      await addDiaryEntry(content);
      setContent('');
      setCurrentScreen('history');
    } catch (error) {
      console.error("Failed to submit diary entry:", error);
      alert('일기 제출에 실패했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {isStoring ? (
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner message="당신의 마음에 귀 기울이는 중..." />
        </div>
      ) : (
        <div className="flex-grow flex flex-col justify-center">
          <label htmlFor="diary-content" className="text-lg font-semibold text-gray-700 mb-4 text-center">
            {prompt}
          </label>
          <textarea
            id="diary-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-2xl shadow-inner focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-shadow duration-200 resize-none text-base leading-relaxed"
            placeholder="어떤 이야기든 괜찮아요. 편하게 들려주세요."
            rows={10}
          />
          <button
            onClick={handleSubmit}
            disabled={isStoring || !content.trim()}
            className="mt-6 w-full bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg hover:bg-indigo-600 transition-all duration-300 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            마음 남기기
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
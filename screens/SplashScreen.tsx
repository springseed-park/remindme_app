
import React, { useMemo } from 'react';

const quotes = [
  "당신은 당신이 생각하는 것보다 훨씬 강해요.",
  "오늘 하루도 수고 많았어요. 잠시 쉬어가도 괜찮아요.",
  "작은 성공 하나하나가 모여 큰 성취를 이뤄요.",
  "당신의 감정은 소중해요. 어떤 감정이든 괜찮아요.",
  "가장 어두운 밤도 결국 지나가고 아침이 와요.",
  "당신은 혼자가 아니에요. 제가 곁에 있을게요.",
];

const SplashScreen: React.FC = () => {
  const quote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-100 via-purple-200 to-sky-200 animate-fadeIn overflow-hidden p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-slate-800 opacity-0 animate-fadeInUp" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.1)', animationDelay: '0.5s' }}>
          RemindMe
        </h1>
        <p className="mt-4 text-lg text-slate-700 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
          Your Daily Companion
        </p>
        <div className="mt-12 h-10">
          <p className="text-base text-slate-600 italic opacity-0 animate-fadeInUp" style={{ animationDelay: '1.3s' }}>
            "{quote}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
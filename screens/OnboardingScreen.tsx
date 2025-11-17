import React, { useState } from 'react';
import type { UserProfile } from '../types';

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
}

const CONCERN_OPTIONS = [
  '건강',
  '돈/재정',
  '여가/취미',
  '커리어/업무',
  '인간관계',
  '학업',
  '가족',
  '연애',
  '기타',
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    birthDate: '',
    gender: '' as 'male' | 'female' | 'other' | 'prefer-not-to-say' | '',
    concerns: [] as string[],
    curiosityMoments: [] as string[],
    dislikedPeople: '',
  });

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleConcernToggle = (concern: string) => {
    if (formData.concerns.includes(concern)) {
      setFormData({
        ...formData,
        concerns: formData.concerns.filter((c) => c !== concern),
      });
    } else {
      setFormData({
        ...formData,
        concerns: [...formData.concerns, concern],
      });
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    const profile: UserProfile = {
      id: Date.now().toString(),
      birthDate: formData.birthDate,
      age: calculateAge(formData.birthDate),
      gender: formData.gender as 'male' | 'female' | 'other' | 'prefer-not-to-say',
      concerns: formData.concerns,
      curiosityMoments: formData.curiosityMoments,
      dislikedPeople: formData.dislikedPeople,
      characterStyle: 'default',
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };
    onComplete(profile);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.birthDate !== '';
      case 2:
        return formData.gender !== '';
      case 3:
        return formData.concerns.length > 0;
      case 4:
        return formData.curiosityMoments.length > 0;
      case 5:
        return true; // 마지막 단계는 선택사항
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
        {/* 진행 표시 */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  s === step
                    ? 'bg-purple-500 text-white'
                    : s < step
                    ? 'bg-purple-300 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: 생년월일 */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 text-center">
              환영합니다! 🌸
            </h2>
            <p className="text-gray-600 text-center">
              당신의 마음을 돌보는 여정을 시작합니다
            </p>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">생년월일을 알려주세요</span>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  max={new Date().toISOString().split('T')[0]}
                />
              </label>
            </div>
          </div>
        )}

        {/* Step 2: 성별 */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 text-center">
              성별을 선택해주세요
            </h2>
            <p className="text-gray-600 text-center">
              캐릭터와 맞춤형 콘텐츠를 위한 정보입니다
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'male', label: '남성', emoji: '👨' },
                { value: 'female', label: '여성', emoji: '👩' },
                { value: 'other', label: '기타', emoji: '🌈' },
                { value: 'prefer-not-to-say', label: '선택 안 함', emoji: '💫' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      gender: option.value as 'male' | 'female' | 'other' | 'prefer-not-to-say',
                    })
                  }
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.gender === option.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{option.emoji}</div>
                  <div className="font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: 주요 관심사/고민 */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 text-center">
              요즘 고민이 있나요?
            </h2>
            <p className="text-gray-600 text-center">
              여러 가지를 선택할 수 있어요
            </p>
            <div className="grid grid-cols-2 gap-3">
              {CONCERN_OPTIONS.map((concern) => (
                <button
                  key={concern}
                  onClick={() => handleConcernToggle(concern)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.concerns.includes(concern)
                      ? 'border-purple-500 bg-purple-50 font-medium'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {concern}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: 궁금증을 느끼는 순간 */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 text-center">
              어떤 순간에 궁금증을 느끼나요?
            </h2>
            <p className="text-gray-600 text-center">
              AI와의 대화 주제로 활용됩니다
            </p>
            <div className="space-y-3">
              {formData.curiosityMoments.map((moment, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={moment}
                    onChange={(e) => {
                      const newMoments = [...formData.curiosityMoments];
                      newMoments[index] = e.target.value;
                      setFormData({ ...formData, curiosityMoments: newMoments });
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="예: 새로운 사람을 만날 때"
                  />
                  <button
                    onClick={() => {
                      const newMoments = formData.curiosityMoments.filter(
                        (_, i) => i !== index
                      );
                      setFormData({ ...formData, curiosityMoments: newMoments });
                    }}
                    className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    삭제
                  </button>
                </div>
              ))}
              {formData.curiosityMoments.length < 5 && (
                <button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      curiosityMoments: [...formData.curiosityMoments, ''],
                    })
                  }
                  className="w-full py-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50"
                >
                  + 추가하기
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 5: 가장 싫어하는 사람/상황 */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 text-center">
              마지막 질문이에요
            </h2>
            <p className="text-gray-600 text-center">
              가장 싫어하는 사람이나 상황이 있나요?
            </p>
            <textarea
              value={formData.dislikedPeople}
              onChange={(e) =>
                setFormData({ ...formData, dislikedPeople: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32"
              placeholder="선택사항입니다. 부정 감정 분석 및 극복을 위한 퀘스트에 활용됩니다."
            />
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="mt-8 flex gap-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
            >
              이전
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex-1 py-3 rounded-lg font-medium ${
                canProceed()
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex-1 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600"
            >
              시작하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;

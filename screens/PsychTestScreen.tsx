import React, { useState, useEffect } from 'react';
import type { PsychTest, PsychTestResult } from '../types';

// 샘플 심리 검사 데이터
const PSYCH_TESTS: PsychTest[] = [
  {
    id: 'depression-test',
    title: '우울 체크',
    description: '최근 2주간의 우울 증상을 평가합니다',
    category: 'depression',
    questions: [
      {
        id: 'q1',
        question: '일상 활동에 흥미나 즐거움을 느끼지 못한다',
        options: [
          { text: '전혀 그렇지 않다', score: 0 },
          { text: '며칠 동안', score: 1 },
          { text: '절반 이상', score: 2 },
          { text: '거의 매일', score: 3 },
        ],
      },
      {
        id: 'q2',
        question: '기분이 가라앉거나 우울하거나 희망이 없다',
        options: [
          { text: '전혀 그렇지 않다', score: 0 },
          { text: '며칠 동안', score: 1 },
          { text: '절반 이상', score: 2 },
          { text: '거의 매일', score: 3 },
        ],
      },
      {
        id: 'q3',
        question: '잠들기 어렵거나 자주 깨거나 너무 많이 잔다',
        options: [
          { text: '전혀 그렇지 않다', score: 0 },
          { text: '며칠 동안', score: 1 },
          { text: '절반 이상', score: 2 },
          { text: '거의 매일', score: 3 },
        ],
      },
      {
        id: 'q4',
        question: '피곤하고 기력이 없다',
        options: [
          { text: '전혀 그렇지 않다', score: 0 },
          { text: '며칠 동안', score: 1 },
          { text: '절반 이상', score: 2 },
          { text: '거의 매일', score: 3 },
        ],
      },
      {
        id: 'q5',
        question: '식욕이 없거나 과식을 한다',
        options: [
          { text: '전혀 그렇지 않다', score: 0 },
          { text: '며칠 동안', score: 1 },
          { text: '절반 이상', score: 2 },
          { text: '거의 매일', score: 3 },
        ],
      },
    ],
    scoringGuide: {
      ranges: [
        {
          min: 0,
          max: 4,
          level: '정상',
          description: '우울 증상이 거의 없는 상태입니다.',
        },
        {
          min: 5,
          max: 9,
          level: '경미',
          description: '경미한 우울 증상이 있습니다. 일상생활 관리에 주의를 기울이세요.',
        },
        {
          min: 10,
          max: 14,
          level: '중간',
          description: '중간 정도의 우울 증상이 있습니다. 전문가 상담을 고려해보세요.',
        },
        {
          min: 15,
          max: 100,
          level: '심각',
          description: '심각한 우울 증상이 있습니다. 전문가의 도움이 필요합니다.',
        },
      ],
    },
  },
  {
    id: 'anxiety-test',
    title: '불안 체크',
    description: '최근 2주간의 불안 증상을 평가합니다',
    category: 'anxiety',
    questions: [
      {
        id: 'q1',
        question: '긴장하거나 불안하거나 조마조마하게 느낀다',
        options: [
          { text: '전혀 그렇지 않다', score: 0 },
          { text: '며칠 동안', score: 1 },
          { text: '절반 이상', score: 2 },
          { text: '거의 매일', score: 3 },
        ],
      },
      {
        id: 'q2',
        question: '걱정을 멈추거나 조절할 수 없다',
        options: [
          { text: '전혀 그렇지 않다', score: 0 },
          { text: '며칠 동안', score: 1 },
          { text: '절반 이상', score: 2 },
          { text: '거의 매일', score: 3 },
        ],
      },
      {
        id: 'q3',
        question: '여러 가지 일에 대해 걱정을 너무 많이 한다',
        options: [
          { text: '전혀 그렇지 않다', score: 0 },
          { text: '며칠 동안', score: 1 },
          { text: '절반 이상', score: 2 },
          { text: '거의 매일', score: 3 },
        ],
      },
      {
        id: 'q4',
        question: '편안하게 있기가 어렵다',
        options: [
          { text: '전혀 그렇지 않다', score: 0 },
          { text: '며칠 동안', score: 1 },
          { text: '절반 이상', score: 2 },
          { text: '거의 매일', score: 3 },
        ],
      },
    ],
    scoringGuide: {
      ranges: [
        {
          min: 0,
          max: 3,
          level: '정상',
          description: '불안 증상이 거의 없는 상태입니다.',
        },
        {
          min: 4,
          max: 7,
          level: '경미',
          description: '경미한 불안 증상이 있습니다.',
        },
        {
          min: 8,
          max: 11,
          level: '중간',
          description: '중간 정도의 불안 증상이 있습니다.',
        },
        {
          min: 12,
          max: 100,
          level: '심각',
          description: '심각한 불안 증상이 있습니다. 전문가의 도움이 필요합니다.',
        },
      ],
    },
  },
];

const PsychTestScreen: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<PsychTest | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [testResults, setTestResults] = useState<PsychTestResult[]>([]);
  const [showResult, setShowResult] = useState(false);

  // LocalStorage에서 결과 로드
  useEffect(() => {
    const saved = localStorage.getItem('psychTestResults');
    if (saved) {
      setTestResults(JSON.parse(saved));
    }
  }, []);

  const handleStartTest = (test: PsychTest) => {
    setSelectedTest(test);
    setAnswers({});
    setShowResult(false);
  };

  const handleAnswerSelect = (questionId: string, score: number) => {
    setAnswers({
      ...answers,
      [questionId]: score,
    });
  };

  const handleSubmitTest = () => {
    if (!selectedTest) return;

    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const scoreRange = selectedTest.scoringGuide.ranges.find(
      (range) => totalScore >= range.min && totalScore <= range.max
    );

    if (!scoreRange) return;

    const result: PsychTestResult = {
      id: Date.now().toString(),
      testId: selectedTest.id,
      testTitle: selectedTest.title,
      date: new Date().toISOString(),
      answers: Object.entries(answers).map(([questionId, score]) => ({
        questionId,
        score,
      })),
      totalScore,
      level: scoreRange.level,
      interpretation: scoreRange.description,
      recommendations: getRecommendations(selectedTest.category, scoreRange.level),
    };

    const updatedResults = [...testResults, result];
    setTestResults(updatedResults);
    localStorage.setItem('psychTestResults', JSON.stringify(updatedResults));
    setShowResult(true);
  };

  const getRecommendations = (
    category: string,
    level: string
  ): string[] => {
    if (level === '정상') {
      return [
        '현재 상태를 잘 유지하세요',
        '규칙적인 운동과 충분한 수면을 권장합니다',
        '스트레스 관리를 계속 실천하세요',
      ];
    } else if (level === '경미') {
      return [
        '일상생활에서 스트레스 관리에 주의를 기울이세요',
        '규칙적인 생활 습관을 유지하세요',
        '취미 활동이나 운동으로 기분 전환을 하세요',
      ];
    } else if (level === '중간') {
      return [
        '전문가 상담을 고려해보세요',
        '충분한 휴식과 수면을 취하세요',
        '주변 사람들과 감정을 나누는 것이 도움이 됩니다',
      ];
    } else {
      return [
        '전문가의 도움이 필요합니다',
        '혼자 고민하지 말고 주변에 도움을 요청하세요',
        '자살예방 상담전화: 1393 (24시간)',
      ];
    }
  };

  const currentResult = showResult && selectedTest
    ? testResults.find((r) => r.testId === selectedTest.id && r.date === testResults[testResults.length - 1].date)
    : null;

  const isAllAnswered =
    selectedTest &&
    selectedTest.questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="h-full bg-gradient-to-br from-teal-50 to-cyan-50 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">심리 검사 🧪</h1>
        <p className="text-gray-600 mb-6">
          간단한 자가 평가를 통해 현재 마음 상태를 확인해보세요
        </p>

        {!selectedTest ? (
          <>
            {/* 검사 목록 */}
            <div className="grid gap-4 mb-8">
              {PSYCH_TESTS.map((test) => (
                <div
                  key={test.id}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {test.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {test.description}
                      </p>
                      <div className="text-xs text-gray-500 mt-2">
                        {test.questions.length}개 문항 | 약 2분 소요
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartTest(test)}
                    className="w-full mt-4 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600"
                  >
                    검사 시작하기
                  </button>
                </div>
              ))}
            </div>

            {/* 과거 검사 결과 */}
            {testResults.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  검사 기록 ({testResults.length})
                </h2>
                <div className="space-y-3">
                  {testResults
                    .slice()
                    .reverse()
                    .map((result) => (
                      <div
                        key={result.id}
                        className="bg-white rounded-lg p-4 shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {result.testTitle}
                            </h4>
                            <div className="text-sm text-gray-600 mt-1">
                              {new Date(result.date).toLocaleDateString('ko-KR')}
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              result.level === '정상'
                                ? 'bg-green-100 text-green-700'
                                : result.level === '경미'
                                ? 'bg-yellow-100 text-yellow-700'
                                : result.level === '중간'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {result.level}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          점수: {result.totalScore}점
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        ) : !showResult ? (
          /* 검사 진행 */
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedTest.title}
              </h2>
              <p className="text-gray-600 mt-1">{selectedTest.description}</p>
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 transition-all"
                  style={{
                    width: `${
                      (Object.keys(answers).length /
                        selectedTest.questions.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-6">
              {selectedTest.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="pb-6 border-b border-gray-200 last:border-0"
                >
                  <h3 className="font-medium text-gray-800 mb-3">
                    {index + 1}. {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() =>
                          handleAnswerSelect(question.id, option.score)
                        }
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          answers[question.id] === option.score
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-teal-300'
                        }`}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setSelectedTest(null)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleSubmitTest}
                disabled={!isAllAnswered}
                className={`flex-1 py-3 rounded-lg font-medium ${
                  isAllAnswered
                    ? 'bg-teal-500 text-white hover:bg-teal-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                결과 보기
              </button>
            </div>
          </div>
        ) : currentResult ? (
          /* 검사 결과 */
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {currentResult.level === '정상'
                  ? '😊'
                  : currentResult.level === '경미'
                  ? '😐'
                  : currentResult.level === '중간'
                  ? '😟'
                  : '😰'}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                검사 완료!
              </h2>
              <div className="text-4xl font-bold text-teal-600 mb-2">
                {currentResult.totalScore}점
              </div>
              <div
                className={`inline-block px-4 py-2 rounded-full text-lg font-medium ${
                  currentResult.level === '정상'
                    ? 'bg-green-100 text-green-700'
                    : currentResult.level === '경미'
                    ? 'bg-yellow-100 text-yellow-700'
                    : currentResult.level === '중간'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {currentResult.level}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">해석</h3>
                <p className="text-gray-700">{currentResult.interpretation}</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-2">권장사항</h3>
                <ul className="space-y-2">
                  {currentResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-teal-500">•</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setSelectedTest(null)}
              className="w-full mt-8 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600"
            >
              확인
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PsychTestScreen;

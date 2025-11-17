import React, { useState, useEffect } from 'react';
import type { MusicMix, MusicTrack } from '../types';

// 샘플 음악 트랙 (실제로는 오디오 파일 URL 사용)
const MELODY_TRACKS: MusicTrack[] = [
  { id: 'melody-1', name: '평화로운 피아노', type: 'melody', url: '' },
  { id: 'melody-2', name: '부드러운 기타', type: 'melody', url: '' },
  { id: 'melody-3', name: '잔잔한 하프', type: 'melody', url: '' },
  { id: 'melody-4', name: '따뜻한 첼로', type: 'melody', url: '' },
  { id: 'melody-5', name: '고요한 플루트', type: 'melody', url: '' },
];

const NATURE_TRACKS: MusicTrack[] = [
  { id: 'nature-1', name: '빗소리', type: 'nature', url: '' },
  { id: 'nature-2', name: '파도 소리', type: 'nature', url: '' },
  { id: 'nature-3', name: '숲 속 소리', type: 'nature', url: '' },
  { id: 'nature-4', name: '모닥불 소리', type: 'nature', url: '' },
  { id: 'nature-5', name: '새소리', type: 'nature', url: '' },
  { id: 'nature-6', name: '바람 소리', type: 'nature', url: '' },
];

const MusicStudioScreen: React.FC = () => {
  const [savedMixes, setSavedMixes] = useState<MusicMix[]>([]);
  const [currentMix, setCurrentMix] = useState<Partial<MusicMix>>({
    name: '나만의 힐링 음악',
    backgroundMelody: 'melody-1',
    natureSound: 'nature-1',
    melodyVolume: 50,
    natureSoundVolume: 50,
  });
  const [isEditing, setIsEditing] = useState(true);

  // LocalStorage에서 믹스 로드
  useEffect(() => {
    const saved = localStorage.getItem('musicMixes');
    if (saved) {
      setSavedMixes(JSON.parse(saved));
    }
  }, []);

  const handleSaveMix = () => {
    const newMix: MusicMix = {
      id: Date.now().toString(),
      name: currentMix.name || '나만의 힐링 음악',
      backgroundMelody: currentMix.backgroundMelody!,
      natureSound: currentMix.natureSound!,
      melodyVolume: currentMix.melodyVolume!,
      natureSoundVolume: currentMix.natureSoundVolume!,
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedMixes = [...savedMixes, newMix];
    setSavedMixes(updatedMixes);
    localStorage.setItem('musicMixes', JSON.stringify(updatedMixes));
    setIsEditing(false);
  };

  const handleActivateMix = (mixId: string) => {
    const updatedMixes = savedMixes.map((mix) => ({
      ...mix,
      isActive: mix.id === mixId,
    }));
    setSavedMixes(updatedMixes);
    localStorage.setItem('musicMixes', JSON.stringify(updatedMixes));
  };

  const handleDeleteMix = (mixId: string) => {
    const updatedMixes = savedMixes.filter((mix) => mix.id !== mixId);
    setSavedMixes(updatedMixes);
    localStorage.setItem('musicMixes', JSON.stringify(updatedMixes));
  };

  return (
    <div className="h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          나만의 힐링 음악 스튜디오 🎼
        </h1>
        <p className="text-gray-600 mb-6">
          배경 멜로디와 자연의 소리를 조합해 당신만의 힐링 음악을 만들어보세요
        </p>

        {isEditing ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
            {/* 믹스 이름 */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                믹스 이름
              </label>
              <input
                type="text"
                value={currentMix.name}
                onChange={(e) =>
                  setCurrentMix({ ...currentMix, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="예: 비 오는 날의 피아노"
              />
            </div>

            {/* 배경 멜로디 선택 */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">
                배경 멜로디 🎹
              </label>
              <div className="grid grid-cols-2 gap-3">
                {MELODY_TRACKS.map((track) => (
                  <button
                    key={track.id}
                    onClick={() =>
                      setCurrentMix({ ...currentMix, backgroundMelody: track.id })
                    }
                    className={`p-4 rounded-lg border-2 transition-all ${
                      currentMix.backgroundMelody === track.id
                        ? 'border-purple-500 bg-purple-50 font-medium'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {track.name}
                  </button>
                ))}
              </div>

              {/* 멜로디 볼륨 */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>볼륨</span>
                  <span>{currentMix.melodyVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentMix.melodyVolume}
                  onChange={(e) =>
                    setCurrentMix({
                      ...currentMix,
                      melodyVolume: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* 자연 소리 선택 */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">
                자연의 소리 🌿
              </label>
              <div className="grid grid-cols-2 gap-3">
                {NATURE_TRACKS.map((track) => (
                  <button
                    key={track.id}
                    onClick={() =>
                      setCurrentMix({ ...currentMix, natureSound: track.id })
                    }
                    className={`p-4 rounded-lg border-2 transition-all ${
                      currentMix.natureSound === track.id
                        ? 'border-green-500 bg-green-50 font-medium'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {track.name}
                  </button>
                ))}
              </div>

              {/* 자연 소리 볼륨 */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>볼륨</span>
                  <span>{currentMix.natureSoundVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentMix.natureSoundVolume}
                  onChange={(e) =>
                    setCurrentMix({
                      ...currentMix,
                      natureSoundVolume: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleSaveMix}
                className="flex-1 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600"
              >
                저장하기
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-purple-500 text-white py-4 rounded-lg font-medium hover:bg-purple-600 mb-6"
          >
            + 새 믹스 만들기
          </button>
        )}

        {/* 저장된 믹스 목록 */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            저장된 믹스 ({savedMixes.length})
          </h2>
          {savedMixes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <div className="text-5xl mb-3">🎵</div>
              <p className="text-gray-500">저장된 믹스가 없어요</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedMixes.map((mix) => (
                <div
                  key={mix.id}
                  className={`bg-white rounded-xl p-6 shadow-md ${
                    mix.isActive ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {mix.name}
                      </h3>
                      {mix.isActive && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full inline-block mt-1">
                          재생 중
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleActivateMix(mix.id)}
                        className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                        title="메인 화면에 적용"
                      >
                        <span className="text-xl">
                          {mix.isActive ? '🔊' : '🔇'}
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteMix(mix.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <span className="text-xl">🗑️</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">멜로디:</span>
                      <span>
                        {
                          MELODY_TRACKS.find(
                            (t) => t.id === mix.backgroundMelody
                          )?.name
                        }{' '}
                        ({mix.melodyVolume}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">자연 소리:</span>
                      <span>
                        {
                          NATURE_TRACKS.find((t) => t.id === mix.natureSound)
                            ?.name
                        }{' '}
                        ({mix.natureSoundVolume}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicStudioScreen;

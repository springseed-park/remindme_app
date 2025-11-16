import React, { useState, useMemo } from 'react';
import { useDiary } from '../context/DiaryContext';
import DiaryCard from '../components/DiaryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Calendar from '../components/Calendar';

const HistoryScreen: React.FC = () => {
  const { entries, isLoading } = useDiary();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    if (selectedDate && selectedDate.toDateString() === date.toDateString()) {
      setSelectedDate(null); // Deselect if clicked again
    } else {
      setSelectedDate(date);
    }
  };

  const filteredEntries = useMemo(() => {
    if (!selectedDate) {
      return entries; // Show all if no date is selected
    }
    return entries.filter(
      (entry) => new Date(entry.date).toDateString() === selectedDate.toDateString()
    );
  }, [entries, selectedDate]);


  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><LoadingSpinner message="기록을 불러오는 중..." /></div>;
  }

  return (
    <div className="p-4">
      <header className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">나의 기록</h2>
        <p className="text-gray-500 mt-2">마음이와 함께한 순간들</p>
      </header>
      
      <Calendar 
        entries={entries}
        selectedDate={selectedDate}
        onDateClick={handleDateSelect}
      />

      {selectedDate && (
        <div className="text-center my-4">
          <button
            onClick={() => setSelectedDate(null)}
            className="bg-indigo-100 text-indigo-700 font-semibold py-2 px-5 rounded-full text-sm hover:bg-indigo-200 transition-colors duration-200"
          >
            전체 기록 보기
          </button>
        </div>
      )}

      {filteredEntries.length === 0 ? (
        <div className="text-center text-gray-500 mt-12 p-6 bg-white">
          {selectedDate ? (
            <p>선택하신 날짜에는 기록된 이야기가 없어요.</p>
          ) : (
            <>
              <p>아직 기록된 이야기가 없어요.</p>
              <p className="mt-2">오늘의 마음을 남겨보는 건 어떨까요?</p>
            </>
          )}
        </div>
      ) : (
        <div className="-mx-4">
          {filteredEntries.map(entry => (
            <div key={entry.id} className="border-b border-gray-200">
                <DiaryCard entry={entry} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryScreen;
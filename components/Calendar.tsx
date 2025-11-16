import React, { useState, useMemo } from 'react';
import type { DiaryEntry } from '../types';

interface CalendarProps {
  entries: DiaryEntry[];
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ entries, selectedDate, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const entryDates = useMemo(() => 
    new Set(entries.map(e => new Date(e.date).toDateString())),
    [entries]
  );

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = endOfMonth.getDate();

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-7 h-7"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const isToday = dayDate.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === dayDate.toDateString();
      const hasEntry = entryDates.has(dayDate.toDateString());

      const dayClasses = `w-7 h-7 flex items-center justify-center rounded-full text-sm transition-colors duration-200 cursor-pointer relative ${
        isSelected
            ? 'bg-indigo-500 text-white font-bold'
            : isToday
            ? 'text-indigo-600 ring-1 ring-indigo-300'
            : 'text-gray-700 hover:bg-gray-100'
      }`;
      
      days.push(
        <button key={i} onClick={() => onDateClick(dayDate)} className={dayClasses} aria-label={`${i}일`}>
          {i}
          {hasEntry && !isSelected && (
            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full"></div>
          )}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md mb-6 w-[250px] mx-auto">
      <div className="flex justify-between items-center mb-4 px-2">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100" aria-label="이전 달">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h3 className="font-bold text-lg text-gray-800">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h3>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100" aria-label="다음 달">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 font-medium">
        <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 gap-x-0.5 text-center mt-2">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
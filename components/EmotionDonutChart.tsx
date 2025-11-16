import React from 'react';

interface EmotionDonutChartProps {
  data: { [key: string]: number };
}

const EMOTION_COLORS: { [key: string]: string } = {
  '기쁨': '#FFD700',
  '슬픔': '#6495ED',
  '분노': '#DC143C',
  '불안': '#9370DB',
  '놀람': '#00CED1',
  '죄책감': '#A52A2A',
  '수치심': '#FFC0CB',
  '외로움': '#778899',
  '기타': '#D3D3D3',
};

const EmotionDonutChart: React.FC<EmotionDonutChartProps> = ({ data }) => {
  // FIX: Cast values to number for arithmetic operations, as TypeScript may infer the value from
  // Object.entries on an indexed type as `unknown`, causing type errors.
  const sortedData = Object.entries(data).sort(([, a], [, b]) => (b as number) - (a as number));
  // FIX: Cast value to number for arithmetic operation.
  const total = sortedData.reduce((sum, [, value]) => sum + (value as number), 0);

  if (total === 0) {
    return <p className="text-center text-gray-500">감정 기록이 없어요.</p>;
  }

  let cumulativePercentage = 0;

  const segments = sortedData.map(([label, value]) => {
    // FIX: Cast value to number for arithmetic operation.
    const percentage = ((value as number) / total) * 100;
    const color = EMOTION_COLORS[label] || EMOTION_COLORS['기타'];

    const segment = {
      label,
      value,
      percentage,
      color,
      offset: cumulativePercentage,
    };

    cumulativePercentage += percentage;
    return segment;
  });

  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 200 200" className="transform -rotate-90">
          <circle cx="100" cy="100" r={radius} fill="transparent" stroke="#e6e6e6" strokeWidth="20" />
          {segments.map((segment) => (
            <circle
              key={segment.label}
              cx="100"
              cy="100"
              r={radius}
              fill="transparent"
              stroke={segment.color}
              strokeWidth="20"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (segment.percentage / 100) * circumference}
              transform={`rotate(${segment.offset * 3.6}, 100, 100)`}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-center">
                <div className="text-2xl font-bold text-gray-700">{total}</div>
                <div className="text-xs text-gray-500">Total</div>
            </span>
        </div>
      </div>
      <div className="w-full md:w-auto">
        <ul className="space-y-1">
          {segments.map((segment) => (
            <li key={segment.label} className="flex items-center text-sm">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: segment.color }}></span>
              <span className="text-gray-700 font-medium">{segment.label}</span>
              <span className="ml-auto text-gray-500">{segment.value}회 ({segment.percentage.toFixed(0)}%)</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmotionDonutChart;


import React, { useState, useMemo } from 'react';

interface ChartDataPoint {
  date: string;
  value: number; // The numerical value for the emotion
  label: string; // The original emotion string, e.g., "기쁨"
}

interface EmotionTrendChartProps {
  data: ChartDataPoint[];
}

const Y_AXIS_LABELS: { [key: number]: string } = {
  5: '매우 긍정',
  4: '긍정',
  3: '보통',
  2: '부정',
  1: '매우 부정',
};

const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; label: string } | null>(null);

  const width = 280;
  const height = 180;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const points = useMemo(() => {
    if (data.length < 2) return [];
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * innerWidth;
      const y = innerHeight - ((d.value - 1) / 4) * innerHeight; // Scale value from 1-5 to fit height
      return { x, y };
    });
  }, [data, innerWidth, innerHeight]);

  const linePath = useMemo(() => {
    if (points.length < 2) return '';
    return points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');
  }, [points]);

  const handleMouseOver = (index: number) => {
    const point = points[index];
    const dataPoint = data[index];
    setTooltip({
      x: point.x,
      y: point.y,
      date: new Date(dataPoint.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      label: dataPoint.label,
    });
  };
  
  const handleMouseOut = () => {
    setTooltip(null);
  };
  
  if (data.length < 2) {
    return (
        <div className="text-center text-gray-500 p-8 h-[180px] flex items-center justify-center">
            <p>감정 변화를 그리려면 기록이 2개 이상 필요해요.</p>
        </div>
    )
  }

  return (
    <div className="relative flex justify-center">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* Y-axis */}
                {Object.entries(Y_AXIS_LABELS).map(([value, label]) => {
                    const y = innerHeight - ((Number(value) - 1) / 4) * innerHeight;
                    return (
                        <g key={label} className="text-gray-400">
                            <line x1={-5} y1={y} x2={innerWidth} y2={y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                            <text x={-10} y={y} dy="0.32em" textAnchor="end" className="text-[10px] fill-current">{label}</text>
                        </g>
                    );
                })}

                {/* X-axis */}
                {data.map((d, i) => {
                    if (data.length > 7 && i % Math.floor(data.length / 5) !== 0 && i !== data.length -1 && i !== 0) return null;
                    const date = new Date(d.date);
                    const label = `${date.getMonth() + 1}/${date.getDate()}`;
                    const x = points[i].x;
                    return (
                        <g key={d.date} transform={`translate(${x}, ${innerHeight})`}>
                            <text dy="1em" y={5} textAnchor="middle" className="text-[10px] fill-gray-500">{label}</text>
                        </g>
                    )
                })}


                {/* Line */}
                <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2" />

                {/* Points and hover areas */}
                {points.map((p, i) => (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r="3" fill="#6366f1" />
                        <circle 
                            cx={p.x} 
                            cy={p.y} 
                            r="10" 
                            fill="transparent" 
                            onMouseOver={() => handleMouseOver(i)}
                            onMouseOut={handleMouseOut}
                            className="cursor-pointer"
                        />
                    </g>
                ))}

                {/* Tooltip */}
                {tooltip && (
                    <g transform={`translate(${tooltip.x}, ${tooltip.y})`}>
                        <g transform="translate(0, -10)">
                           <rect x="-40" y="-25" width="80" height="22" rx="4" fill="rgba(0,0,0,0.7)" />
                            <text x="0" y="-14" textAnchor="middle" className="text-[10px] font-semibold fill-white">
                                {tooltip.date}: {tooltip.label}
                            </text>
                        </g>
                    </g>
                )}
            </g>
        </svg>
    </div>
  );
};

export default EmotionTrendChart;
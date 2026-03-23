import { useEffect, useState } from 'react';

export default function RiskGauge({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 10) * circumference;
  const offset = circumference - progress;

  const getColor = (s) => {
    if (s <= 3) return '#00d4a0';
    if (s <= 7) return '#f5a623';
    return '#ff4f4f';
  };

  const getLabel = (s) => {
    if (s <= 3) return 'Low Risk';
    if (s <= 7) return 'Medium Risk';
    return 'High Risk';
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none" stroke="#2a2a40" strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs text-text-secondary">/10</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color }}>{getLabel(score)}</p>
        <p className="text-xs text-text-secondary">Risk Score</p>
      </div>
    </div>
  );
}

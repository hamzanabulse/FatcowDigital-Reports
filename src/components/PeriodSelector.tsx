'use client';

import { useState } from 'react';

export type ReportPeriod = '1month' | '3months' | '6months' | '12months';

interface PeriodSelectorProps {
  selected: ReportPeriod;
  onChange: (period: ReportPeriod) => void;
}

const periods = [
  { value: '1month' as ReportPeriod, label: 'Last Month', icon: '📅', description: '30 days' },
  { value: '3months' as ReportPeriod, label: '3 Months', icon: '📊', description: '90 days' },
  { value: '6months' as ReportPeriod, label: '6 Months', icon: '📈', description: '180 days' },
  { value: '12months' as ReportPeriod, label: '12 Months', icon: '📉', description: '1 year' },
];

export default function PeriodSelector({ selected, onChange }: PeriodSelectorProps) {
  const [hoveredPeriod, setHoveredPeriod] = useState<ReportPeriod | null>(null);

  return (
    <div className="bg-white rounded-xl shadow-fatcow p-2 animate-fade-in-up">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {periods.map((period, index) => {
          const isSelected = selected === period.value;
          const isHovered = hoveredPeriod === period.value;

          return (
            <button
              key={period.value}
              onClick={() => onChange(period.value)}
              onMouseEnter={() => setHoveredPeriod(period.value)}
              onMouseLeave={() => setHoveredPeriod(null)}
              className={`
                relative p-4 rounded-lg font-medium text-sm
                transition-all duration-300 ease-out
                transform hover:scale-105
                ${isSelected 
                  ? 'bg-gradient-to-br from-fatcow-blue to-fatcow-purple text-white shadow-fatcow scale-105' 
                  : 'bg-fatcow-light text-fatcow-navy hover:bg-gray-100'
                }
                ${isHovered && !isSelected ? 'ring-2 ring-fatcow-blue ring-opacity-50' : ''}
              `}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className={`text-2xl transition-transform duration-300 ${isHovered ? 'scale-125' : 'scale-100'}`}>
                  {period.icon}
                </span>
                <div className="text-center">
                  <div className="font-bold">{period.label}</div>
                  <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                    {period.description}
                  </div>
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute top-1 right-1">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

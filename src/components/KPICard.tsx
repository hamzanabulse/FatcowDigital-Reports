'use client';

import { KPICard as KPICardType } from '@/types';
import { useState } from 'react';

interface KPICardProps {
  kpi: KPICardType;
  index?: number;
}

export default function KPICard({ kpi, index = 0 }: KPICardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatValue = (value: number | string, format?: string) => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'decimal':
        return value.toFixed(2);
      case 'number':
      default:
        return value.toLocaleString();
    }
  };

  const getChangeColor = (change?: number) => {
    if (!change) return 'text-gray-500';
    return change >= 0 ? 'text-fatcow-green' : 'text-red-500';
  };

  const getChangeBgColor = (change?: number) => {
    if (!change) return 'bg-gray-100';
    return change >= 0 ? 'bg-green-50' : 'bg-red-50';
  };

  const getChangeIcon = (change?: number) => {
    if (!change) return null;
    return change >= 0 ? '↑' : '↓';
  };

  const getGradientForMetric = (title: string) => {
    if (title.includes('Click')) return 'from-blue-500 to-blue-600';
    if (title.includes('Impression')) return 'from-purple-500 to-purple-600';
    if (title.includes('CTR')) return 'from-green-500 to-green-600';
    if (title.includes('Position')) return 'from-orange-500 to-orange-600';
    return 'from-fatcow-blue to-fatcow-purple';
  };

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-fatcow hover:shadow-fatcow-lg p-6 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up overflow-hidden"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Background Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradientForMetric(kpi.title)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      {/* Icon with Pulse Effect */}
      <div className="absolute top-4 right-4">
        {kpi.icon && (
          <span className={`text-3xl transition-all duration-300 ${isHovered ? 'scale-125 animate-bounce-slow' : 'scale-100'}`}>
            {kpi.icon}
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
          {kpi.title}
        </h3>
        
        <div className="mb-3">
          <p className={`text-4xl font-bold bg-gradient-to-r ${getGradientForMetric(kpi.title)} bg-clip-text text-transparent transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
            {formatValue(kpi.value, kpi.format)}
          </p>
        </div>

        {kpi.change !== undefined && (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${getChangeBgColor(kpi.change)} transition-all duration-300`}>
            <span className={`text-sm font-bold ${getChangeColor(kpi.change)} flex items-center gap-1`}>
              <span className="text-lg">{getChangeIcon(kpi.change)}</span>
              {Math.abs(kpi.change).toFixed(1)}%
            </span>
            {kpi.changeLabel && (
              <span className="text-xs text-gray-600 font-medium">{kpi.changeLabel}</span>
            )}
          </div>
        )}
      </div>

      {/* Decorative Corner */}
      <div className="absolute bottom-0 right-0 w-20 h-20 opacity-5">
        <div className={`w-full h-full bg-gradient-to-tl ${getGradientForMetric(kpi.title)} rounded-tl-full`} />
      </div>
    </div>
  );
}

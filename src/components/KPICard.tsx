import { KPICard as KPICardType } from '@/types';

interface KPICardProps {
  kpi: KPICardType;
}

export default function KPICard({ kpi }: KPICardProps) {
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

  const getChangeIcon = (change?: number) => {
    if (!change) return null;
    return change >= 0 ? '↑' : '↓';
  };

  return (
    <div className="kpi-card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
        {kpi.icon && <span className="text-2xl">{kpi.icon}</span>}
      </div>
      
      <div className="mb-2">
        <p className="text-3xl font-bold text-fatcow-navy">
          {formatValue(kpi.value, kpi.format)}
        </p>
      </div>

      {kpi.change !== undefined && (
        <div className="flex items-center">
          <span className={`text-sm font-semibold ${getChangeColor(kpi.change)}`}>
            {getChangeIcon(kpi.change)} {Math.abs(kpi.change).toFixed(2)}%
          </span>
          {kpi.changeLabel && (
            <span className="ml-2 text-xs text-gray-500">{kpi.changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

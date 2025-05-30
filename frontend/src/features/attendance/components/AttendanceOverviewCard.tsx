import React from 'react';
import { 
  Users, 
  CheckSquare, 
  X, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface AttendanceOverviewCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: 'users' | 'present' | 'absent' | 'late' | 'warning' | 'trend-up' | 'trend-down';
  color?: 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'purple' | 'gray';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
  onClick?: () => void;
  className?: string;
}

export const AttendanceOverviewCard: React.FC<AttendanceOverviewCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  trend,
  onClick,
  className = ''
}) => {
  const getIcon = () => {
    const iconSize = 20;
    const iconClass = `text-${color}-600`;
    
    switch (icon) {
      case 'users': return <Users size={iconSize} className={iconClass} />;
      case 'present': return <CheckSquare size={iconSize} className={iconClass} />;
      case 'absent': return <X size={iconSize} className={iconClass} />;
      case 'late': return <Clock size={iconSize} className={iconClass} />;
      case 'warning': return <AlertTriangle size={iconSize} className={iconClass} />;
      case 'trend-up': return <TrendingUp size={iconSize} className={iconClass} />;
      case 'trend-down': return <TrendingDown size={iconSize} className={iconClass} />;
      default: return <Users size={iconSize} className={iconClass} />;
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    const trendIconSize = 16;
    switch (trend.direction) {
      case 'up': return <TrendingUp size={trendIconSize} className="text-green-600" />;
      case 'down': return <TrendingDown size={trendIconSize} className="text-red-600" />;
      case 'neutral': return <Minus size={trendIconSize} className="text-gray-600" />;
      default: return null;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    switch (trend.direction) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return '';
    }
  };

  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg p-6 ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className={`p-2 bg-${color}-100 rounded-lg mr-3`}>
              {getIcon()}
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">{title}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {subtitle && (
              <div className="text-sm text-gray-500">{subtitle}</div>
            )}
            
            {trend && (
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-gray-500">vs {trend.period}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 
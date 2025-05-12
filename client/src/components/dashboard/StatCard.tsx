import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  iconColor: string;
  timeframe?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  iconColor,
  timeframe = 'vs last month',
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${iconColor}`}>
          {icon}
        </div>
      </div>
      
      {change !== undefined && (
        <div className="mt-3 flex items-center">
          {isPositive && (
            <span className="text-green-600 flex items-center text-sm font-medium">
              <ArrowUpRight size={16} className="mr-1" />
              {Math.abs(change)}%
            </span>
          )}
          {isNegative && (
            <span className="text-red-600 flex items-center text-sm font-medium">
              <ArrowDownRight size={16} className="mr-1" />
              {Math.abs(change)}%
            </span>
          )}
          {!isPositive && !isNegative && (
            <span className="text-gray-600 text-sm font-medium">0%</span>
          )}
          <span className="text-gray-500 text-sm ml-1">{timeframe}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
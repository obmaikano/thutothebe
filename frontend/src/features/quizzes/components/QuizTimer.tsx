import React, { useState, useEffect, useCallback } from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface QuizTimerProps {
  timeLimit: number; // in minutes
  onTimeUp?: () => void;
  onWarning?: (minutesLeft: number) => void;
  warningThresholds?: number[]; // minutes when to show warnings
  autoSubmit?: boolean;
  className?: string;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  timeLimit,
  onTimeUp,
  onWarning,
  warningThresholds = [5, 2, 1],
  autoSubmit = true,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert to seconds
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  const [warningsTriggered, setWarningsTriggered] = useState<Set<number>>(new Set());

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getTimeColor = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    
    if (minutes <= 1) return 'text-red-600';
    if (minutes <= 5) return 'text-orange-600';
    if (minutes <= 10) return 'text-yellow-600';
    return 'text-green-600';
  }, []);

  const getProgressPercentage = useCallback((): number => {
    const totalSeconds = timeLimit * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  }, [timeLimit, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) {
        onTimeUp();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        const minutesLeft = Math.floor(newTime / 60);

        // Check for warnings
        if (warningThresholds.includes(minutesLeft) && !warningsTriggered.has(minutesLeft)) {
          setWarningsTriggered(prev => new Set([...prev, minutesLeft]));
          if (onWarning) {
            onWarning(minutesLeft);
          }
        }

        // Set warning states
        setIsWarning(minutesLeft <= 5 && minutesLeft > 1);
        setIsCritical(minutesLeft <= 1);

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, onWarning, warningThresholds, warningsTriggered]);

  const minutes = Math.floor(timeLeft / 60);
  const isTimeUp = timeLeft <= 0;

  return (
    <div className={`quiz-timer ${className}`}>
      {/* Main Timer Display */}
      <div className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 ${
        isTimeUp 
          ? 'bg-red-50 border-red-200' 
          : isCritical 
          ? 'bg-red-50 border-red-300 animate-pulse' 
          : isWarning 
          ? 'bg-orange-50 border-orange-300' 
          : 'bg-green-50 border-green-200'
      }`}>
        <div className={`p-2 rounded-full ${
          isTimeUp 
            ? 'bg-red-100' 
            : isCritical 
            ? 'bg-red-100' 
            : isWarning 
            ? 'bg-orange-100' 
            : 'bg-green-100'
        }`}>
          {isTimeUp ? (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          ) : (
            <Clock className={`h-5 w-5 ${getTimeColor(timeLeft)}`} />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {isTimeUp ? 'Time Up!' : 'Time Remaining'}
            </span>
            <span className={`text-lg font-bold ${getTimeColor(timeLeft)}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  isCritical 
                    ? 'bg-red-500' 
                    : isWarning 
                    ? 'bg-orange-500' 
                    : 'bg-green-500'
                }`}
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {isWarning && !isTimeUp && (
        <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
          isCritical 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-orange-50 border border-orange-200'
        }`}>
          <AlertTriangle className={`h-4 w-4 ${
            isCritical ? 'text-red-600' : 'text-orange-600'
          }`} />
          <span className={`text-sm font-medium ${
            isCritical ? 'text-red-800' : 'text-orange-800'
          }`}>
            {isCritical 
              ? 'Critical: Less than 2 minutes remaining!' 
              : 'Warning: Less than 5 minutes remaining!'}
          </span>
        </div>
      )}

      {/* Time Up Message */}
      {isTimeUp && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">
              Time has expired! 
              {autoSubmit && ' Your quiz will be submitted automatically.'}
            </span>
          </div>
        </div>
      )}

      {/* Time Milestones */}
      <div className="mt-3 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Started</span>
          <span>Total: {timeLimit} minutes</span>
        </div>
      </div>
    </div>
  );
};

export default QuizTimer; 
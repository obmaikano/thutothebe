import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchLessons } from '../features/lessons/lessonsSlice';
import { fetchLessonCompletions } from '../features/lessonCompletions/lessonCompletionsSlice';
import { fetchCurriculumProgress } from '../features/curriculumProgress/curriculumProgressSlice';

interface RealTimeDataConfig {
  enableWebSocket?: boolean;
  refreshInterval?: number; // in milliseconds
  autoRefresh?: boolean;
}

interface RealTimeDataState {
  isConnected: boolean;
  lastUpdate: Date | null;
  error: string | null;
  refreshCount: number;
}

export const useRealTimeData = (config: RealTimeDataConfig = {}) => {
  const {
    enableWebSocket = true,
    refreshInterval = 30000, // 30 seconds
    autoRefresh = true
  } = config;

  const dispatch = useDispatch<AppDispatch>();
  const [state, setState] = useState<RealTimeDataState>({
    isConnected: false,
    lastUpdate: null,
    error: null,
    refreshCount: 0
  });

  // Function to refresh all data
  const refreshData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      // Fetch all data in parallel
      await Promise.all([
        dispatch(fetchLessons()),
        dispatch(fetchLessonCompletions()),
        dispatch(fetchCurriculumProgress())
      ]);

      setState(prev => ({
        ...prev,
        lastUpdate: new Date(),
        refreshCount: prev.refreshCount + 1
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to refresh data'
      }));
    }
  }, [dispatch]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!enableWebSocket) return;

    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      try {
        // Replace with your actual WebSocket endpoint
        const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws';
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setState(prev => ({ ...prev, isConnected: true, error: null }));
          console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Handle different types of real-time updates
            switch (data.type) {
              case 'LESSON_UPDATED':
              case 'LESSON_CREATED':
              case 'LESSON_DELETED':
                dispatch(fetchLessons());
                break;
              
              case 'LESSON_COMPLETION_UPDATED':
              case 'LESSON_COMPLETION_CREATED':
                dispatch(fetchLessonCompletions());
                break;
              
              case 'CURRICULUM_PROGRESS_UPDATED':
                dispatch(fetchCurriculumProgress());
                break;
              
              case 'GENERAL_UPDATE':
                // Refresh all data
                refreshData();
                break;
              
              default:
                console.log('Unknown WebSocket message type:', data.type);
            }

            setState(prev => ({ ...prev, lastUpdate: new Date() }));
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onclose = () => {
          setState(prev => ({ ...prev, isConnected: false }));
          console.log('WebSocket disconnected');
          
          // Attempt to reconnect after 5 seconds
          reconnectTimeout = setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = (error) => {
          setState(prev => ({ 
            ...prev, 
            isConnected: false, 
            error: 'WebSocket connection error' 
          }));
          console.error('WebSocket error:', error);
        };

      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: 'Failed to establish WebSocket connection' 
        }));
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [enableWebSocket, dispatch, refreshData]);

  // Auto-refresh timer
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      refreshData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshData]);

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    ...state,
    refreshData,
    isWebSocketEnabled: enableWebSocket,
    isAutoRefreshEnabled: autoRefresh,
    refreshInterval
  };
};

// Hook for specific data type with real-time updates
export const useRealTimeLessons = (config: RealTimeDataConfig = {}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [state, setState] = useState<RealTimeDataState>({
    isConnected: false,
    lastUpdate: null,
    error: null,
    refreshCount: 0
  });

  const refreshLessons = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await dispatch(fetchLessons());
      setState(prev => ({
        ...prev,
        lastUpdate: new Date(),
        refreshCount: prev.refreshCount + 1
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to refresh lessons'
      }));
    }
  }, [dispatch]);

  useEffect(() => {
    refreshLessons();
  }, [refreshLessons]);

  return {
    ...state,
    refreshLessons
  };
};

export const useRealTimeLessonCompletions = (config: RealTimeDataConfig = {}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [state, setState] = useState<RealTimeDataState>({
    isConnected: false,
    lastUpdate: null,
    error: null,
    refreshCount: 0
  });

  const refreshCompletions = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await dispatch(fetchLessonCompletions());
      setState(prev => ({
        ...prev,
        lastUpdate: new Date(),
        refreshCount: prev.refreshCount + 1
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to refresh completions'
      }));
    }
  }, [dispatch]);

  useEffect(() => {
    refreshCompletions();
  }, [refreshCompletions]);

  return {
    ...state,
    refreshCompletions
  };
};

export const useRealTimeCurriculumProgress = (config: RealTimeDataConfig = {}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [state, setState] = useState<RealTimeDataState>({
    isConnected: false,
    lastUpdate: null,
    error: null,
    refreshCount: 0
  });

  const refreshProgress = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await dispatch(fetchCurriculumProgress());
      setState(prev => ({
        ...prev,
        lastUpdate: new Date(),
        refreshCount: prev.refreshCount + 1
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to refresh progress'
      }));
    }
  }, [dispatch]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  return {
    ...state,
    refreshProgress
  };
}; 
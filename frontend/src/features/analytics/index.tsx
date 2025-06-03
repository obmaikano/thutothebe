// Analytics Feature Exports

// Pages
export { default as PerformanceDashboardPage } from './pages/PerformanceDashboardPage';
export { default as StudentPerformancePage } from './pages/StudentPerformancePage';

// Redux Slices
export { default as studentPerformanceReducer } from './studentPerformanceSlice';
export { default as progressReducer } from './progressSlice';
export { default as analyticsReducer } from './analyticsSlice';

// Slice Actions
export * from './studentPerformanceSlice';
export * from './progressSlice';
export * from './analyticsSlice';

// Types
export type { StudentPerformance } from '../../api/services/studentPerformanceApi';
export type { Progress } from '../../api/services/progressApi';
export type { AnalyticsData } from '../../api/services/analyticsApi'; 
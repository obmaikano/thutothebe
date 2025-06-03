// Performance monitoring utilities for enterprise production
import React from 'react';

export interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  timestamp: number;
  userAgent: string;
  url: string;
}

export interface APIMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private apiMetrics: APIMetrics[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track component render performance
  trackComponentRender(componentName: string, startTime: number): void {
    const renderTime = performance.now() - startTime;
    
    const metric: PerformanceMetrics = {
      componentName,
      renderTime,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.metrics.push(metric);
    
    // Log slow renders (>100ms)
    if (renderTime > 100) {
      console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(metric);
    }
  }

  // Track API call performance
  trackAPICall(endpoint: string, method: string, startTime: number, statusCode: number): void {
    const responseTime = performance.now() - startTime;
    
    const metric: APIMetrics = {
      endpoint,
      method,
      responseTime,
      statusCode,
      timestamp: Date.now(),
    };

    this.apiMetrics.push(metric);
    
    // Log slow API calls (>2000ms)
    if (responseTime > 2000) {
      console.warn(`Slow API call: ${method} ${endpoint} took ${responseTime.toFixed(2)}ms`);
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendAPIMetricToService(metric);
    }
  }

  // Get performance summary
  getPerformanceSummary(): {
    averageRenderTime: number;
    slowestComponent: string;
    averageAPITime: number;
    slowestAPI: string;
  } {
    const avgRenderTime = this.metrics.length > 0 
      ? this.metrics.reduce((sum, m) => sum + m.renderTime, 0) / this.metrics.length 
      : 0;

    const slowestComponent = this.metrics.length > 0
      ? this.metrics.reduce((prev, current) => 
          prev.renderTime > current.renderTime ? prev : current
        ).componentName
      : 'None';

    const avgAPITime = this.apiMetrics.length > 0
      ? this.apiMetrics.reduce((sum, m) => sum + m.responseTime, 0) / this.apiMetrics.length
      : 0;

    const slowestAPI = this.apiMetrics.length > 0
      ? this.apiMetrics.reduce((prev, current) =>
          prev.responseTime > current.responseTime ? prev : current
        ).endpoint
      : 'None';

    return {
      averageRenderTime: avgRenderTime,
      slowestComponent,
      averageAPITime: avgAPITime,
      slowestAPI,
    };
  }

  private sendToMonitoringService(metric: PerformanceMetrics): void {
    // In production, send to monitoring service like Sentry, DataDog, etc.
    // Example with Sentry:
    // Sentry.addBreadcrumb({
    //   message: `Component render: ${metric.componentName}`,
    //   level: 'info',
    //   data: metric,
    // });
  }

  private sendAPIMetricToService(metric: APIMetrics): void {
    // In production, send to monitoring service
    // Example with custom analytics:
    // analytics.track('api_performance', metric);
  }
}

// React hook for component performance tracking
export const usePerformanceTracking = (componentName: string) => {
  const startTime = performance.now();
  
  React.useEffect(() => {
    return () => {
      PerformanceMonitor.getInstance().trackComponentRender(componentName, startTime);
    };
  }, [componentName, startTime]);
};

// API interceptor for performance tracking
export const createPerformanceInterceptor = () => {
  return {
    request: (config: any) => {
      config.metadata = { startTime: performance.now() };
      return config;
    },
    response: (response: any) => {
      const { startTime } = response.config.metadata;
      PerformanceMonitor.getInstance().trackAPICall(
        response.config.url,
        response.config.method.toUpperCase(),
        startTime,
        response.status
      );
      return response;
    },
    error: (error: any) => {
      if (error.config?.metadata?.startTime) {
        const { startTime } = error.config.metadata;
        PerformanceMonitor.getInstance().trackAPICall(
          error.config.url,
          error.config.method.toUpperCase(),
          startTime,
          error.response?.status || 0
        );
      }
      return Promise.reject(error);
    },
  };
};

export default PerformanceMonitor; 
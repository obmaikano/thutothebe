// Performance monitoring for forum operations
export interface PerformanceMetric {
  operation: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

export interface PerformanceStats {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  operationCounts: Record<string, number>;
  errorCounts: Record<string, number>;
}

// Performance thresholds (in milliseconds)
const PERFORMANCE_THRESHOLDS = {
  FAST: 100,
  ACCEPTABLE: 500,
  SLOW: 1000,
  CRITICAL: 2000
};

export enum PerformanceLevel {
  FAST = 'FAST',
  ACCEPTABLE = 'ACCEPTABLE',
  SLOW = 'SLOW',
  CRITICAL = 'CRITICAL'
}

export class ForumPerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics
  private activeOperations = new Map<string, number>();

  /**
   * Start monitoring an operation
   */
  startOperation(operation: string, metadata?: Record<string, any>): string {
    const operationId = `${operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.activeOperations.set(operationId, performance.now());
    
    // Log start if in development
    if (process.env.NODE_ENV === 'development') {
      console.time(`Forum Operation: ${operation}`);
    }
    
    return operationId;
  }

  /**
   * End monitoring an operation
   */
  endOperation(operationId: string, success: boolean = true, error?: string, metadata?: Record<string, any>): PerformanceMetric | null {
    const startTime = this.activeOperations.get(operationId);
    if (!startTime) {
      console.warn(`Performance monitor: Operation ${operationId} not found`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    const operation = operationId.split('_')[0];

    const metric: PerformanceMetric = {
      operation,
      startTime,
      endTime,
      duration,
      success,
      error,
      metadata
    };

    // Add to metrics
    this.metrics.unshift(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.pop();
    }

    // Remove from active operations
    this.activeOperations.delete(operationId);

    // Log end if in development
    if (process.env.NODE_ENV === 'development') {
      console.timeEnd(`Forum Operation: ${operation}`);
      this.logPerformanceLevel(metric);
    }

    // Alert on critical performance
    if (duration > PERFORMANCE_THRESHOLDS.CRITICAL) {
      this.alertCriticalPerformance(metric);
    }

    return metric;
  }

  /**
   * Get performance level for a duration
   */
  getPerformanceLevel(duration: number): PerformanceLevel {
    if (duration <= PERFORMANCE_THRESHOLDS.FAST) return PerformanceLevel.FAST;
    if (duration <= PERFORMANCE_THRESHOLDS.ACCEPTABLE) return PerformanceLevel.ACCEPTABLE;
    if (duration <= PERFORMANCE_THRESHOLDS.SLOW) return PerformanceLevel.SLOW;
    return PerformanceLevel.CRITICAL;
  }

  /**
   * Log performance level
   */
  private logPerformanceLevel(metric: PerformanceMetric): void {
    const level = this.getPerformanceLevel(metric.duration);
    const message = `${metric.operation}: ${metric.duration.toFixed(2)}ms (${level})`;
    
    switch (level) {
      case PerformanceLevel.FAST:
        console.log(`🟢 ${message}`);
        break;
      case PerformanceLevel.ACCEPTABLE:
        console.log(`🟡 ${message}`);
        break;
      case PerformanceLevel.SLOW:
        console.warn(`🟠 ${message}`);
        break;
      case PerformanceLevel.CRITICAL:
        console.error(`🔴 ${message}`);
        break;
    }
  }

  /**
   * Alert on critical performance
   */
  private alertCriticalPerformance(metric: PerformanceMetric): void {
    console.error(`CRITICAL PERFORMANCE: ${metric.operation} took ${metric.duration.toFixed(2)}ms`);
    
    // In production, you might want to send this to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to monitoring service
      this.sendToMonitoringService(metric);
    }
  }

  /**
   * Send metric to external monitoring service
   */
  private sendToMonitoringService(metric: PerformanceMetric): void {
    // Implementation would depend on your monitoring service
    // For now, just log to console
    console.error('MONITORING SERVICE:', metric);
  }

  /**
   * Get performance statistics
   */
  getStats(operation?: string): PerformanceStats {
    const filteredMetrics = operation 
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics;

    if (filteredMetrics.length === 0) {
      return {
        totalOperations: 0,
        successfulOperations: 0,
        failedOperations: 0,
        averageDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        operationCounts: {},
        errorCounts: {}
      };
    }

    const durations = filteredMetrics.map(m => m.duration);
    const successfulOps = filteredMetrics.filter(m => m.success);
    const failedOps = filteredMetrics.filter(m => !m.success);

    const operationCounts: Record<string, number> = {};
    const errorCounts: Record<string, number> = {};

    filteredMetrics.forEach(metric => {
      operationCounts[metric.operation] = (operationCounts[metric.operation] || 0) + 1;
      if (!metric.success && metric.error) {
        errorCounts[metric.error] = (errorCounts[metric.error] || 0) + 1;
      }
    });

    return {
      totalOperations: filteredMetrics.length,
      successfulOperations: successfulOps.length,
      failedOperations: failedOps.length,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      operationCounts,
      errorCounts
    };
  }

  /**
   * Get recent metrics
   */
  getRecentMetrics(count: number = 50): PerformanceMetric[] {
    return this.metrics.slice(0, count);
  }

  /**
   * Get slow operations
   */
  getSlowOperations(threshold: number = PERFORMANCE_THRESHOLDS.SLOW): PerformanceMetric[] {
    return this.metrics.filter(m => m.duration > threshold);
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): string {
    const stats = this.getStats();
    const slowOps = this.getSlowOperations();
    
    return `
Forum Performance Report
========================
Total Operations: ${stats.totalOperations}
Success Rate: ${((stats.successfulOperations / stats.totalOperations) * 100).toFixed(2)}%
Average Duration: ${stats.averageDuration.toFixed(2)}ms
Min Duration: ${stats.minDuration.toFixed(2)}ms
Max Duration: ${stats.maxDuration.toFixed(2)}ms
Slow Operations (>${PERFORMANCE_THRESHOLDS.SLOW}ms): ${slowOps.length}

Operation Breakdown:
${Object.entries(stats.operationCounts)
  .map(([op, count]) => `  ${op}: ${count} operations`)
  .join('\n')}

${stats.failedOperations > 0 ? `
Error Breakdown:
${Object.entries(stats.errorCounts)
  .map(([error, count]) => `  ${error}: ${count} occurrences`)
  .join('\n')}
` : ''}
    `.trim();
  }
}

// Global performance monitor instance
export const forumPerformanceMonitor = new ForumPerformanceMonitor();

// Decorator for automatic performance monitoring
export function monitorPerformance(operation: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const operationId = forumPerformanceMonitor.startOperation(operation, {
        method: propertyName,
        args: args.length
      });

      try {
        const result = await method.apply(this, args);
        forumPerformanceMonitor.endOperation(operationId, true, undefined, {
          resultType: typeof result
        });
        return result;
      } catch (error: any) {
        forumPerformanceMonitor.endOperation(operationId, false, error.message, {
          errorType: error.constructor.name
        });
        throw error;
      }
    };
  };
}

// Utility functions for common operations
export const monitorApiCall = async <T>(
  operation: string,
  apiCall: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> => {
  const operationId = forumPerformanceMonitor.startOperation(operation, metadata);
  
  try {
    const result = await apiCall();
    forumPerformanceMonitor.endOperation(operationId, true, undefined, {
      resultType: typeof result,
      ...metadata
    });
    return result;
  } catch (error: any) {
    forumPerformanceMonitor.endOperation(operationId, false, error.message, {
      errorType: error.constructor.name,
      ...metadata
    });
    throw error;
  }
};

export const monitorComponentRender = (componentName: string) => {
  const operationId = forumPerformanceMonitor.startOperation(`render_${componentName}`);
  
  return () => {
    forumPerformanceMonitor.endOperation(operationId, true);
  };
}; 
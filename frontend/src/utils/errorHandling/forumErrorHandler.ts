// Error types for forum operations
export enum ForumErrorType {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  CONTENT_TOO_LONG = 'CONTENT_TOO_LONG',
  PROFANITY_DETECTED = 'PROFANITY_DETECTED',
  SPAM_DETECTED = 'SPAM_DETECTED',
  
  // Resource errors
  FORUM_NOT_FOUND = 'FORUM_NOT_FOUND',
  THREAD_NOT_FOUND = 'THREAD_NOT_FOUND',
  COMMENT_NOT_FOUND = 'COMMENT_NOT_FOUND',
  COURSE_NOT_FOUND = 'COURSE_NOT_FOUND',
  
  // Permission errors
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  FORUM_ACCESS_DENIED = 'FORUM_ACCESS_DENIED',
  MODERATION_REQUIRED = 'MODERATION_REQUIRED',
  
  // Rate limiting errors
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  
  // Server errors
  SERVER_ERROR = 'SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // Unknown errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ForumError {
  type: ForumErrorType;
  message: string;
  details?: any;
  timestamp: Date;
  context?: {
    action?: string;
    resourceId?: number;
    userId?: number;
    resource?: string;
    additionalInfo?: Record<string, any>;
  };
}

// User-friendly error messages
const ERROR_MESSAGES: Record<ForumErrorType, string> = {
  [ForumErrorType.NETWORK_ERROR]: 'Network connection failed. Please check your internet connection and try again.',
  [ForumErrorType.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  [ForumErrorType.CONNECTION_ERROR]: 'Unable to connect to the server. Please try again later.',
  
  [ForumErrorType.UNAUTHORIZED]: 'You need to log in to perform this action.',
  [ForumErrorType.FORBIDDEN]: 'You do not have permission to perform this action.',
  [ForumErrorType.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  
  [ForumErrorType.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ForumErrorType.INVALID_INPUT]: 'Invalid input provided. Please correct and try again.',
  [ForumErrorType.CONTENT_TOO_LONG]: 'Content exceeds maximum length limit.',
  [ForumErrorType.PROFANITY_DETECTED]: 'Content contains inappropriate language. Please revise and try again.',
  [ForumErrorType.SPAM_DETECTED]: 'Content appears to be spam. Please revise and try again.',
  
  [ForumErrorType.FORUM_NOT_FOUND]: 'The requested forum could not be found.',
  [ForumErrorType.THREAD_NOT_FOUND]: 'The requested discussion thread could not be found.',
  [ForumErrorType.COMMENT_NOT_FOUND]: 'The requested comment could not be found.',
  [ForumErrorType.COURSE_NOT_FOUND]: 'The requested course could not be found.',
  
  [ForumErrorType.INSUFFICIENT_PERMISSIONS]: 'You do not have sufficient permissions for this action.',
  [ForumErrorType.FORUM_ACCESS_DENIED]: 'Access to this forum is restricted.',
  [ForumErrorType.MODERATION_REQUIRED]: 'This content requires moderation approval.',
  
  [ForumErrorType.RATE_LIMIT_EXCEEDED]: 'You are posting too frequently. Please wait before trying again.',
  [ForumErrorType.TOO_MANY_REQUESTS]: 'Too many requests. Please wait a moment before trying again.',
  
  [ForumErrorType.SERVER_ERROR]: 'A server error occurred. Please try again later.',
  [ForumErrorType.DATABASE_ERROR]: 'A database error occurred. Please try again later.',
  [ForumErrorType.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable. Please try again later.',
  
  [ForumErrorType.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
};

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Error severity mapping
const ERROR_SEVERITY: Record<ForumErrorType, ErrorSeverity> = {
  [ForumErrorType.NETWORK_ERROR]: ErrorSeverity.MEDIUM,
  [ForumErrorType.TIMEOUT_ERROR]: ErrorSeverity.LOW,
  [ForumErrorType.CONNECTION_ERROR]: ErrorSeverity.MEDIUM,
  
  [ForumErrorType.UNAUTHORIZED]: ErrorSeverity.MEDIUM,
  [ForumErrorType.FORBIDDEN]: ErrorSeverity.MEDIUM,
  [ForumErrorType.TOKEN_EXPIRED]: ErrorSeverity.MEDIUM,
  
  [ForumErrorType.VALIDATION_ERROR]: ErrorSeverity.LOW,
  [ForumErrorType.INVALID_INPUT]: ErrorSeverity.LOW,
  [ForumErrorType.CONTENT_TOO_LONG]: ErrorSeverity.LOW,
  [ForumErrorType.PROFANITY_DETECTED]: ErrorSeverity.MEDIUM,
  [ForumErrorType.SPAM_DETECTED]: ErrorSeverity.MEDIUM,
  
  [ForumErrorType.FORUM_NOT_FOUND]: ErrorSeverity.MEDIUM,
  [ForumErrorType.THREAD_NOT_FOUND]: ErrorSeverity.MEDIUM,
  [ForumErrorType.COMMENT_NOT_FOUND]: ErrorSeverity.MEDIUM,
  [ForumErrorType.COURSE_NOT_FOUND]: ErrorSeverity.MEDIUM,
  
  [ForumErrorType.INSUFFICIENT_PERMISSIONS]: ErrorSeverity.MEDIUM,
  [ForumErrorType.FORUM_ACCESS_DENIED]: ErrorSeverity.MEDIUM,
  [ForumErrorType.MODERATION_REQUIRED]: ErrorSeverity.LOW,
  
  [ForumErrorType.RATE_LIMIT_EXCEEDED]: ErrorSeverity.MEDIUM,
  [ForumErrorType.TOO_MANY_REQUESTS]: ErrorSeverity.MEDIUM,
  
  [ForumErrorType.SERVER_ERROR]: ErrorSeverity.HIGH,
  [ForumErrorType.DATABASE_ERROR]: ErrorSeverity.CRITICAL,
  [ForumErrorType.SERVICE_UNAVAILABLE]: ErrorSeverity.HIGH,
  
  [ForumErrorType.UNKNOWN_ERROR]: ErrorSeverity.HIGH
};

// Error logger class
export class ForumErrorLogger {
  private errors: ForumError[] = [];
  private maxErrors = 100; // Keep last 100 errors in memory
  
  /**
   * Log an error
   */
  logError(error: ForumError): void {
    // Add to in-memory storage
    this.errors.unshift(error);
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }
    
    // Log to console based on severity
    const severity = ERROR_SEVERITY[error.type];
    const logMessage = `[${error.type}] ${error.message}`;
    
    switch (severity) {
      case ErrorSeverity.LOW:
        console.info(logMessage, error);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn(logMessage, error);
        break;
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        console.error(logMessage, error);
        break;
    }
    
    // In production, you might want to send critical errors to a logging service
    if (severity === ErrorSeverity.CRITICAL) {
      this.sendToLoggingService(error);
    }
  }
  
  /**
   * Get recent errors
   */
  getRecentErrors(count: number = 10): ForumError[] {
    return this.errors.slice(0, count);
  }
  
  /**
   * Get errors by type
   */
  getErrorsByType(type: ForumErrorType): ForumError[] {
    return this.errors.filter(error => error.type === type);
  }
  
  /**
   * Clear error log
   */
  clearErrors(): void {
    this.errors = [];
  }
  
  /**
   * Send critical errors to external logging service
   */
  private sendToLoggingService(error: ForumError): void {
    // Implementation would depend on your logging service
    // For now, just log to console
    console.error('CRITICAL ERROR:', error);
  }
}

// Global error logger instance
export const forumErrorLogger = new ForumErrorLogger();

// Error handler class
export class ForumErrorHandler {
  
  /**
   * Handle API errors from axios responses
   */
  handleApiError(error: any, context?: any): ForumError {
    let forumError: ForumError;
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      
      forumError = this.createErrorFromStatus(status, data, context);
    } else if (error.request) {
      // Network error
      forumError = {
        type: ForumErrorType.NETWORK_ERROR,
        message: ERROR_MESSAGES[ForumErrorType.NETWORK_ERROR],
        details: error.message,
        timestamp: new Date(),
        context
      };
    } else {
      // Unknown error
      forumError = {
        type: ForumErrorType.UNKNOWN_ERROR,
        message: ERROR_MESSAGES[ForumErrorType.UNKNOWN_ERROR],
        details: error.message,
        timestamp: new Date(),
        context
      };
    }
    
    forumErrorLogger.logError(forumError);
    return forumError;
  }
  
  /**
   * Create error from HTTP status code
   */
  private createErrorFromStatus(status: number, data: any, context?: any): ForumError {
    let type: ForumErrorType;
    let message: string;
    
    switch (status) {
      case 400:
        type = ForumErrorType.VALIDATION_ERROR;
        message = data?.message || ERROR_MESSAGES[type];
        break;
      case 401:
        type = ForumErrorType.UNAUTHORIZED;
        message = ERROR_MESSAGES[type];
        break;
      case 403:
        type = ForumErrorType.FORBIDDEN;
        message = ERROR_MESSAGES[type];
        break;
      case 404:
        type = this.getNotFoundErrorType(context);
        message = ERROR_MESSAGES[type];
        break;
      case 429:
        type = ForumErrorType.RATE_LIMIT_EXCEEDED;
        message = ERROR_MESSAGES[type];
        break;
      case 500:
        type = ForumErrorType.SERVER_ERROR;
        message = ERROR_MESSAGES[type];
        break;
      case 503:
        type = ForumErrorType.SERVICE_UNAVAILABLE;
        message = ERROR_MESSAGES[type];
        break;
      default:
        type = ForumErrorType.UNKNOWN_ERROR;
        message = data?.message || ERROR_MESSAGES[type];
    }
    
    return {
      type,
      message,
      details: data,
      timestamp: new Date(),
      context
    };
  }
  
  /**
   * Determine specific not found error type based on context
   */
  private getNotFoundErrorType(context?: any): ForumErrorType {
    if (!context?.action) return ForumErrorType.UNKNOWN_ERROR;
    
    if (context.action.includes('forum')) return ForumErrorType.FORUM_NOT_FOUND;
    if (context.action.includes('thread')) return ForumErrorType.THREAD_NOT_FOUND;
    if (context.action.includes('comment')) return ForumErrorType.COMMENT_NOT_FOUND;
    if (context.action.includes('course')) return ForumErrorType.COURSE_NOT_FOUND;
    
    return ForumErrorType.UNKNOWN_ERROR;
  }
  
  /**
   * Handle validation errors
   */
  handleValidationError(validationResult: any, context?: any): ForumError {
    const error: ForumError = {
      type: ForumErrorType.VALIDATION_ERROR,
      message: 'Please correct the following errors and try again.',
      details: validationResult.errors,
      timestamp: new Date(),
      context
    };
    
    forumErrorLogger.logError(error);
    return error;
  }
  
  /**
   * Handle permission errors
   */
  handlePermissionError(action: string, resource?: string): ForumError {
    const error: ForumError = {
      type: ForumErrorType.INSUFFICIENT_PERMISSIONS,
      message: ERROR_MESSAGES[ForumErrorType.INSUFFICIENT_PERMISSIONS],
      details: { action, resource },
      timestamp: new Date(),
      context: { action, resource }
    };
    
    forumErrorLogger.logError(error);
    return error;
  }
  
  /**
   * Handle rate limiting errors
   */
  handleRateLimitError(remainingTime?: number): ForumError {
    let message = ERROR_MESSAGES[ForumErrorType.RATE_LIMIT_EXCEEDED];
    if (remainingTime) {
      message += ` Please wait ${Math.ceil(remainingTime / 1000)} seconds.`;
    }
    
    const error: ForumError = {
      type: ForumErrorType.RATE_LIMIT_EXCEEDED,
      message,
      details: { remainingTime },
      timestamp: new Date()
    };
    
    forumErrorLogger.logError(error);
    return error;
  }
  
  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error: ForumError): string {
    return error.message || ERROR_MESSAGES[error.type] || ERROR_MESSAGES[ForumErrorType.UNKNOWN_ERROR];
  }
  
  /**
   * Check if error is recoverable
   */
  isRecoverableError(error: ForumError): boolean {
    const recoverableTypes = [
      ForumErrorType.NETWORK_ERROR,
      ForumErrorType.TIMEOUT_ERROR,
      ForumErrorType.VALIDATION_ERROR,
      ForumErrorType.RATE_LIMIT_EXCEEDED
    ];
    
    return recoverableTypes.includes(error.type);
  }
  
  /**
   * Get retry delay for recoverable errors
   */
  getRetryDelay(error: ForumError, attempt: number): number {
    if (!this.isRecoverableError(error)) return 0;
    
    // Exponential backoff with jitter
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    const jitter = Math.random() * 0.1 * delay;
    
    return delay + jitter;
  }
}

// Global error handler instance
export const forumErrorHandler = new ForumErrorHandler();

// Utility functions for common error scenarios
export const createNetworkError = (details?: any): ForumError => ({
  type: ForumErrorType.NETWORK_ERROR,
  message: ERROR_MESSAGES[ForumErrorType.NETWORK_ERROR],
  details,
  timestamp: new Date()
});

export const createValidationError = (errors: Record<string, string>): ForumError => ({
  type: ForumErrorType.VALIDATION_ERROR,
  message: ERROR_MESSAGES[ForumErrorType.VALIDATION_ERROR],
  details: errors,
  timestamp: new Date()
});

export const createPermissionError = (action: string): ForumError => ({
  type: ForumErrorType.INSUFFICIENT_PERMISSIONS,
  message: ERROR_MESSAGES[ForumErrorType.INSUFFICIENT_PERMISSIONS],
  details: { action },
  timestamp: new Date()
});

export const createRateLimitError = (remainingTime?: number): ForumError => ({
  type: ForumErrorType.RATE_LIMIT_EXCEEDED,
  message: ERROR_MESSAGES[ForumErrorType.RATE_LIMIT_EXCEEDED],
  details: { remainingTime },
  timestamp: new Date()
}); 
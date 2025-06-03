// Error handling utilities for enterprise applications

export interface ErrorContext {
  operation: 'create' | 'update' | 'delete' | 'fetch';
  entityType: 'school' | 'region' | 'user' | 'general';
  originalData?: any;
  newData?: any;
}

export interface ProcessedError {
  message: string;
  fieldErrors: Record<string, string>;
  suggestions: string[];
  isRetryable: boolean;
  errorType: 'validation' | 'network' | 'server' | 'permission' | 'conflict' | 'unknown';
}

class ErrorHandler {
  private static instance: ErrorHandler;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Process and enhance error messages for better user experience
   */
  processError(error: any, context: ErrorContext): ProcessedError {
    const errorMessage = this.extractErrorMessage(error);
    const processedError: ProcessedError = {
      message: errorMessage,
      fieldErrors: {},
      suggestions: [],
      isRetryable: false,
      errorType: 'unknown'
    };

    // Handle specific error patterns
    if (this.isDuplicateError(errorMessage)) {
      return this.handleDuplicateError(errorMessage, context);
    }

    if (this.isValidationError(errorMessage)) {
      return this.handleValidationError(errorMessage, context);
    }

    if (this.isNetworkError(error)) {
      return this.handleNetworkError(errorMessage, context);
    }

    if (this.isPermissionError(errorMessage)) {
      return this.handlePermissionError(errorMessage, context);
    }

    if (this.isServerError(error)) {
      return this.handleServerError(errorMessage, context);
    }

    // Default handling
    processedError.errorType = 'unknown';
    processedError.suggestions = ['Please try again later', 'Contact support if the problem persists'];
    
    return processedError;
  }

  private extractErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.data?.message) {
      return error.data.message;
    }

    return 'An unexpected error occurred';
  }

  private isDuplicateError(message: string): boolean {
    const duplicatePatterns = [
      'already exists',
      'duplicate',
      'unique constraint',
      'constraint violation'
    ];
    return duplicatePatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  private isValidationError(message: string): boolean {
    const validationPatterns = [
      'validation',
      'invalid',
      'required',
      'must be',
      'cannot be'
    ];
    return validationPatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  private isNetworkError(error: any): boolean {
    return error?.code === 'NETWORK_ERROR' || 
           error?.message?.includes('Network Error') ||
           !error?.response;
  }

  private isPermissionError(message: string): boolean {
    const permissionPatterns = [
      'unauthorized',
      'forbidden',
      'access denied',
      'permission denied',
      'not allowed'
    ];
    return permissionPatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  private isServerError(error: any): boolean {
    return error?.response?.status >= 500;
  }

  private handleDuplicateError(message: string, context: ErrorContext): ProcessedError {
    const processedError: ProcessedError = {
      message: 'Duplicate data detected',
      fieldErrors: {},
      suggestions: [],
      isRetryable: false,
      errorType: 'conflict'
    };

    // Handle region-specific duplicate errors
    if (context.entityType === 'region') {
      if (message.toLowerCase().includes('code')) {
        // Special handling for update operations where code hasn't changed
        if (context.operation === 'update' && 
            context.originalData?.code === context.newData?.code) {
          processedError.message = 'System validation error during update';
          processedError.fieldErrors.code = 'The system incorrectly flagged this code as duplicate. This appears to be a backend issue.';
          processedError.suggestions = [
            'Try refreshing the page and attempting the update again',
            'Try making a small change to the code (e.g., add a number)',
            'Contact your system administrator about this validation issue',
            'This may be resolved by restarting your session'
          ];
          processedError.isRetryable = true;
        } else {
          processedError.message = 'Region code already exists';
          processedError.fieldErrors.code = `The region code "${context.newData?.code}" is already in use by another region.`;
          processedError.suggestions = [
            'Choose a different region code',
            'Check if a similar region already exists',
            'Use a more specific code (e.g., add numbers or location identifiers)'
          ];
        }
      } else if (message.toLowerCase().includes('name')) {
        processedError.message = 'Region name already exists';
        processedError.fieldErrors.name = `The region name "${context.newData?.name}" is already in use.`;
        processedError.suggestions = [
          'Choose a different region name',
          'Add location identifiers to make it unique',
          'Check if this region already exists in the system'
        ];
      }
    }

    // Handle school-specific duplicate errors
    if (context.entityType === 'school') {
      if (message.toLowerCase().includes('code')) {
        if (context.operation === 'update' && 
            context.originalData?.code === context.newData?.code) {
          processedError.message = 'System validation error during update';
          processedError.fieldErrors.code = 'The system incorrectly flagged this code as duplicate.';
          processedError.suggestions = [
            'Try refreshing the page and attempting the update again',
            'Contact your system administrator about this validation issue'
          ];
          processedError.isRetryable = true;
        } else {
          processedError.message = 'School code already exists';
          processedError.fieldErrors.code = `The school code "${context.newData?.code}" is already in use.`;
          processedError.suggestions = [
            'Choose a different school code',
            'Check if this school is already registered'
          ];
        }
      }
    }

    return processedError;
  }

  private handleValidationError(message: string, context: ErrorContext): ProcessedError {
    return {
      message: 'Validation error',
      fieldErrors: { general: message },
      suggestions: [
        'Please check your input and try again',
        'Ensure all required fields are filled correctly',
        'Check field length and format requirements'
      ],
      isRetryable: true,
      errorType: 'validation'
    };
  }

  private handleNetworkError(message: string, context: ErrorContext): ProcessedError {
    return {
      message: 'Network connection error',
      fieldErrors: {},
      suggestions: [
        'Check your internet connection',
        'Try again in a few moments',
        'Refresh the page if the problem persists'
      ],
      isRetryable: true,
      errorType: 'network'
    };
  }

  private handlePermissionError(message: string, context: ErrorContext): ProcessedError {
    return {
      message: 'Permission denied',
      fieldErrors: {},
      suggestions: [
        'You may not have permission to perform this action',
        'Contact your administrator for access',
        'Try logging out and logging back in'
      ],
      isRetryable: false,
      errorType: 'permission'
    };
  }

  private handleServerError(message: string, context: ErrorContext): ProcessedError {
    return {
      message: 'Server error occurred',
      fieldErrors: {},
      suggestions: [
        'This is a temporary server issue',
        'Please try again in a few minutes',
        'Contact support if the problem persists'
      ],
      isRetryable: true,
      errorType: 'server'
    };
  }

  /**
   * Generate user-friendly error message for display
   */
  formatErrorForUser(processedError: ProcessedError): string {
    let message = processedError.message;
    
    if (processedError.suggestions.length > 0) {
      message += '\n\nSuggestions:\n';
      message += processedError.suggestions.map(s => `• ${s}`).join('\n');
    }

    return message;
  }

  /**
   * Log error for monitoring and debugging
   */
  logError(error: any, context: ErrorContext, processedError: ProcessedError): void {
    const logData = {
      timestamp: new Date().toISOString(),
      originalError: error,
      context,
      processedError,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.error('Application Error:', logData);

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to monitoring service
      // monitoringService.logError(logData);
    }
  }
}

// Convenience function for common error handling
export const handleApiError = (
  error: any, 
  operation: ErrorContext['operation'], 
  entityType: ErrorContext['entityType'],
  originalData?: any,
  newData?: any
): ProcessedError => {
  const errorHandler = ErrorHandler.getInstance();
  const context: ErrorContext = {
    operation,
    entityType,
    originalData,
    newData
  };
  
  const processedError = errorHandler.processError(error, context);
  errorHandler.logError(error, context, processedError);
  
  return processedError;
};

export default ErrorHandler; 
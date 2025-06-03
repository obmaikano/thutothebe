// Security utilities for enterprise production

export interface SecurityConfig {
  maxInputLength: number;
  allowedFileTypes: string[];
  maxFileSize: number; // in bytes
  rateLimitRequests: number;
  rateLimitWindow: number; // in milliseconds
}

const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  maxInputLength: 1000,
  allowedFileTypes: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.png'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  rateLimitRequests: 100,
  rateLimitWindow: 60 * 1000, // 1 minute
};

class SecurityManager {
  private static instance: SecurityManager;
  private config: SecurityConfig;
  private requestCounts: Map<string, { count: number; timestamp: number }> = new Map();

  constructor(config: SecurityConfig = DEFAULT_SECURITY_CONFIG) {
    this.config = config;
  }

  static getInstance(config?: SecurityConfig): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager(config);
    }
    return SecurityManager.instance;
  }

  // Basic HTML sanitization (for production, use DOMPurify)
  sanitizeHTML(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Basic HTML sanitization - remove script tags and dangerous attributes
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  }

  // Sanitize and validate text input
  sanitizeTextInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove potentially dangerous characters
    let sanitized = input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();

    // Limit length
    if (sanitized.length > this.config.maxInputLength) {
      sanitized = sanitized.substring(0, this.config.maxInputLength);
    }

    return sanitized;
  }

  // Validate email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Validate school code format
  validateSchoolCode(code: string): boolean {
    const codeRegex = /^[A-Z0-9]{3,10}$/;
    return codeRegex.test(code);
  }

  // Validate file upload
  validateFileUpload(file: File): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > this.config.maxFileSize) {
      return {
        isValid: false,
        error: `File size exceeds maximum allowed size of ${this.config.maxFileSize / (1024 * 1024)}MB`,
      };
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.config.allowedFileTypes.includes(fileExtension)) {
      return {
        isValid: false,
        error: `File type ${fileExtension} is not allowed. Allowed types: ${this.config.allowedFileTypes.join(', ')}`,
      };
    }

    // Check for suspicious file names
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return {
        isValid: false,
        error: 'Invalid file name',
      };
    }

    return { isValid: true };
  }

  // Rate limiting check
  checkRateLimit(identifier: string): { allowed: boolean; remainingRequests?: number } {
    const now = Date.now();
    const userRequests = this.requestCounts.get(identifier);

    if (!userRequests || now - userRequests.timestamp > this.config.rateLimitWindow) {
      // Reset or create new entry
      this.requestCounts.set(identifier, { count: 1, timestamp: now });
      return { allowed: true, remainingRequests: this.config.rateLimitRequests - 1 };
    }

    if (userRequests.count >= this.config.rateLimitRequests) {
      return { allowed: false };
    }

    // Increment count
    userRequests.count++;
    return { 
      allowed: true, 
      remainingRequests: this.config.rateLimitRequests - userRequests.count 
    };
  }

  // Generate secure random token
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Validate JWT token format (basic check)
  validateJWTFormat(token: string): boolean {
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    return jwtRegex.test(token);
  }

  // Content Security Policy headers
  getCSPHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'",
      ].join('; '),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };
  }

  // Log security events
  logSecurityEvent(event: string, details: any): void {
    const securityLog = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.warn('Security Event:', securityLog);

    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to security monitoring service
      // Example: securityService.logEvent(securityLog);
    }
  }
}

// Input validation schemas
export const ValidationSchemas = {
  schoolName: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-'\.]+$/,
  },
  schoolCode: {
    minLength: 3,
    maxLength: 10,
    pattern: /^[A-Z0-9]+$/,
  },
  regionName: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-'\.]+$/,
  },
  email: {
    maxLength: 254,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]+$/,
  },
};

// Security middleware for API calls
export const createSecurityInterceptor = () => {
  const security = SecurityManager.getInstance();

  return {
    request: (config: any) => {
      // Add security headers
      config.headers = {
        ...config.headers,
        ...security.getCSPHeaders(),
      };

      // Validate JWT token
      const token = config.headers.Authorization?.replace('Bearer ', '');
      if (token && !security.validateJWTFormat(token)) {
        security.logSecurityEvent('invalid_jwt_format', { url: config.url });
        throw new Error('Invalid token format');
      }

      return config;
    },
    response: (response: any) => {
      return response;
    },
    error: (error: any) => {
      // Log security-related errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        security.logSecurityEvent('authentication_error', {
          status: error.response.status,
          url: error.config?.url,
        });
      }
      return Promise.reject(error);
    },
  };
};

export default SecurityManager; 
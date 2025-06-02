// Content sanitization without external dependencies
export const sanitizeContent = (content: string): string => {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embed tags
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '') // Remove form tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

// Profanity filter (basic implementation)
const PROFANITY_WORDS = [
  // Add your profanity word list here
  'spam', 'scam', 'fake', 'fraud'
];

export const containsProfanity = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return PROFANITY_WORDS.some(word => lowerText.includes(word));
};

// Spam detection
export const isSpamContent = (content: string): boolean => {
  // Check for excessive repetition
  const words = content.split(/\s+/);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
  
  if (wordCount > 10 && uniqueWords / wordCount < 0.3) {
    return true; // Too much repetition
  }
  
  // Check for excessive links
  const linkCount = (content.match(/https?:\/\/[^\s]+/g) || []).length;
  if (linkCount > 3) {
    return true; // Too many links
  }
  
  // Check for excessive caps
  const capsCount = (content.match(/[A-Z]/g) || []).length;
  if (content.length > 20 && capsCount / content.length > 0.7) {
    return true; // Too much caps
  }
  
  return false;
};

// Forum validation
export interface ForumValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: string[];
}

export const validateForum = (data: {
  title: string;
  description: string;
  courseId: number;
}): ForumValidationResult => {
  const errors: Record<string, string> = {};
  const warnings: string[] = [];
  
  // Title validation
  if (!data.title || !data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (data.title.trim().length > 200) {
    errors.title = 'Title cannot exceed 200 characters';
  } else if (!/^[a-zA-Z0-9\s\-_.,!?()]+$/.test(data.title)) {
    errors.title = 'Title contains invalid characters';
  } else if (containsProfanity(data.title)) {
    errors.title = 'Title contains inappropriate content';
  }
  
  // Description validation
  if (data.description && data.description.length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters';
  } else if (data.description && containsProfanity(data.description)) {
    errors.description = 'Description contains inappropriate content';
  }
  
  // Course ID validation
  if (!data.courseId || data.courseId <= 0) {
    errors.courseId = 'Valid course selection is required';
  }
  
  // Warnings
  if (data.title && data.title.length < 10) {
    warnings.push('Consider using a more descriptive title');
  }
  
  if (data.description && data.description.length < 20) {
    warnings.push('Consider adding a more detailed description');
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
};

// Thread validation
export const validateThread = (data: {
  title: string;
  content: string;
  forumId: number;
}): ForumValidationResult => {
  const errors: Record<string, string> = {};
  const warnings: string[] = [];
  
  // Title validation
  if (!data.title || !data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters';
  } else if (data.title.trim().length > 300) {
    errors.title = 'Title cannot exceed 300 characters';
  } else if (!/^[a-zA-Z0-9\s\-_.,!?()]+$/.test(data.title)) {
    errors.title = 'Title contains invalid characters';
  } else if (containsProfanity(data.title)) {
    errors.title = 'Title contains inappropriate content';
  }
  
  // Content validation
  if (!data.content || !data.content.trim()) {
    errors.content = 'Content is required';
  } else if (data.content.trim().length < 10) {
    errors.content = 'Content must be at least 10 characters';
  } else if (data.content.trim().length > 10000) {
    errors.content = 'Content cannot exceed 10000 characters';
  } else if (containsProfanity(data.content)) {
    errors.content = 'Content contains inappropriate content';
  } else if (isSpamContent(data.content)) {
    errors.content = 'Content appears to be spam';
  }
  
  // Forum ID validation
  if (!data.forumId || data.forumId <= 0) {
    errors.forumId = 'Valid forum is required';
  }
  
  // Warnings
  if (data.content && data.content.length < 50) {
    warnings.push('Consider providing more detailed content');
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
};

// Comment validation
export const validateComment = (data: {
  content: string;
  threadId: number;
  parentId?: number;
}): ForumValidationResult => {
  const errors: Record<string, string> = {};
  const warnings: string[] = [];
  
  // Content validation
  if (!data.content || !data.content.trim()) {
    errors.content = 'Comment content is required';
  } else if (data.content.trim().length < 3) {
    errors.content = 'Comment must be at least 3 characters';
  } else if (data.content.trim().length > 5000) {
    errors.content = 'Comment cannot exceed 5000 characters';
  } else if (containsProfanity(data.content)) {
    errors.content = 'Comment contains inappropriate content';
  } else if (isSpamContent(data.content)) {
    errors.content = 'Comment appears to be spam';
  }
  
  // Thread ID validation
  if (!data.threadId || data.threadId <= 0) {
    errors.threadId = 'Valid thread is required';
  }
  
  // Parent ID validation (for replies)
  if (data.parentId !== undefined && data.parentId <= 0) {
    errors.parentId = 'Invalid parent comment';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
};

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const validAttempts = userAttempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    
    return true;
  }
  
  getRemainingAttempts(identifier: string): number {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    const validAttempts = userAttempts.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxAttempts - validAttempts.length);
  }
}

// Global rate limiters
export const forumCreationLimiter = new RateLimiter(3, 300000); // 3 forums per 5 minutes
export const threadCreationLimiter = new RateLimiter(10, 600000); // 10 threads per 10 minutes
export const commentCreationLimiter = new RateLimiter(20, 300000); // 20 comments per 5 minutes 
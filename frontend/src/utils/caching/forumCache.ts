// Caching system for forum data
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  accessCount: number;
  lastAccessed: number;
}

export interface CacheStats {
  totalEntries: number;
  hitCount: number;
  missCount: number;
  hitRate: number;
  totalSize: number;
  oldestEntry: number;
  newestEntry: number;
}

// Cache configuration
const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_ENTRIES: 1000,
  CLEANUP_INTERVAL: 60 * 1000, // 1 minute
  FORUMS_TTL: 10 * 60 * 1000, // 10 minutes
  THREADS_TTL: 5 * 60 * 1000, // 5 minutes
  COMMENTS_TTL: 2 * 60 * 1000, // 2 minutes
  USER_DATA_TTL: 15 * 60 * 1000, // 15 minutes
};

export class ForumCache {
  private cache = new Map<string, CacheEntry<any>>();
  private hitCount = 0;
  private missCount = 0;
  private cleanupTimer?: NodeJS.Timeout;

  constructor() {
    this.startCleanupTimer();
  }

  /**
   * Set cache entry
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      ttl: ttl || CACHE_CONFIG.DEFAULT_TTL,
      accessCount: 0,
      lastAccessed: now
    };

    this.cache.set(key, entry);

    // Enforce max entries limit
    if (this.cache.size > CACHE_CONFIG.MAX_ENTRIES) {
      this.evictLeastRecentlyUsed();
    }
  }

  /**
   * Get cache entry
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.missCount++;
      return null;
    }

    const now = Date.now();
    
    // Check if entry has expired
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = now;
    this.hitCount++;

    return entry.data as T;
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  /**
   * Invalidate entries by pattern
   */
  invalidatePattern(pattern: string): number {
    let deletedCount = 0;
    const regex = new RegExp(pattern);

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const totalRequests = this.hitCount + this.missCount;
    
    return {
      totalEntries: this.cache.size,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0,
      totalSize: this.calculateCacheSize(),
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : 0,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : 0
    };
  }

  /**
   * Calculate approximate cache size in bytes
   */
  private calculateCacheSize(): number {
    let size = 0;
    for (const [key, entry] of this.cache.entries()) {
      size += key.length * 2; // Approximate string size
      size += JSON.stringify(entry.data).length * 2; // Approximate data size
      size += 64; // Approximate overhead
    }
    return size;
  }

  /**
   * Evict least recently used entries
   */
  private evictLeastRecentlyUsed(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

    // Remove oldest 10% of entries
    const toRemove = Math.ceil(entries.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  /**
   * Start cleanup timer
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, CACHE_CONFIG.CLEANUP_INTERVAL);
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0 && process.env.NODE_ENV === 'development') {
      console.log(`Forum cache cleanup: removed ${cleanedCount} expired entries`);
    }
  }

  /**
   * Stop cleanup timer
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

// Global cache instance
export const forumCache = new ForumCache();

// Cache key generators
export const CacheKeys = {
  // Forum keys
  FORUMS_ALL: 'forums:all',
  FORUM_BY_ID: (id: number) => `forum:${id}`,
  FORUM_BY_COURSE: (courseId: number) => `forum:course:${courseId}`,
  FORUMS_BY_USER: (userId: number) => `forums:user:${userId}`,

  // Thread keys
  THREADS_ALL: 'threads:all',
  THREAD_BY_ID: (id: number) => `thread:${id}`,
  THREADS_BY_FORUM: (forumId: number) => `threads:forum:${forumId}`,
  THREADS_BY_AUTHOR: (authorId: number) => `threads:author:${authorId}`,
  THREAD_WITH_COMMENTS: (id: number) => `thread:${id}:comments`,

  // Comment keys
  COMMENTS_ALL: 'comments:all',
  COMMENT_BY_ID: (id: number) => `comment:${id}`,
  COMMENTS_BY_THREAD: (threadId: number) => `comments:thread:${threadId}`,
  COMMENTS_BY_AUTHOR: (authorId: number) => `comments:author:${authorId}`,

  // User keys
  USER_PERMISSIONS: (userId: number) => `user:${userId}:permissions`,
  USER_FORUMS: (userId: number) => `user:${userId}:forums`,

  // Search keys
  SEARCH_FORUMS: (query: string) => `search:forums:${query}`,
  SEARCH_THREADS: (query: string) => `search:threads:${query}`,
};

// Cache utility functions
export const cacheUtils = {
  /**
   * Cache forum data
   */
  cacheForum: (forum: any) => {
    forumCache.set(CacheKeys.FORUM_BY_ID(forum.id), forum, CACHE_CONFIG.FORUMS_TTL);
    forumCache.set(CacheKeys.FORUM_BY_COURSE(forum.courseId), forum, CACHE_CONFIG.FORUMS_TTL);
  },

  /**
   * Cache thread data
   */
  cacheThread: (thread: any) => {
    forumCache.set(CacheKeys.THREAD_BY_ID(thread.id), thread, CACHE_CONFIG.THREADS_TTL);
  },

  /**
   * Cache comment data
   */
  cacheComment: (comment: any) => {
    forumCache.set(CacheKeys.COMMENT_BY_ID(comment.id), comment, CACHE_CONFIG.COMMENTS_TTL);
  },

  /**
   * Cache forum list
   */
  cacheForumList: (forums: any[]) => {
    forumCache.set(CacheKeys.FORUMS_ALL, forums, CACHE_CONFIG.FORUMS_TTL);
    forums.forEach(forum => cacheUtils.cacheForum(forum));
  },

  /**
   * Cache thread list
   */
  cacheThreadList: (forumId: number, threads: any[]) => {
    forumCache.set(CacheKeys.THREADS_BY_FORUM(forumId), threads, CACHE_CONFIG.THREADS_TTL);
    threads.forEach(thread => cacheUtils.cacheThread(thread));
  },

  /**
   * Cache comment list
   */
  cacheCommentList: (threadId: number, comments: any[]) => {
    forumCache.set(CacheKeys.COMMENTS_BY_THREAD(threadId), comments, CACHE_CONFIG.COMMENTS_TTL);
    comments.forEach(comment => cacheUtils.cacheComment(comment));
  },

  /**
   * Invalidate forum-related cache
   */
  invalidateForum: (forumId: number) => {
    forumCache.delete(CacheKeys.FORUM_BY_ID(forumId));
    forumCache.delete(CacheKeys.FORUMS_ALL);
    forumCache.invalidatePattern(`threads:forum:${forumId}`);
  },

  /**
   * Invalidate thread-related cache
   */
  invalidateThread: (threadId: number, forumId?: number) => {
    forumCache.delete(CacheKeys.THREAD_BY_ID(threadId));
    forumCache.delete(CacheKeys.THREAD_WITH_COMMENTS(threadId));
    forumCache.invalidatePattern(`comments:thread:${threadId}`);
    
    if (forumId) {
      forumCache.delete(CacheKeys.THREADS_BY_FORUM(forumId));
    }
  },

  /**
   * Invalidate comment-related cache
   */
  invalidateComment: (commentId: number, threadId?: number) => {
    forumCache.delete(CacheKeys.COMMENT_BY_ID(commentId));
    
    if (threadId) {
      forumCache.delete(CacheKeys.COMMENTS_BY_THREAD(threadId));
      forumCache.delete(CacheKeys.THREAD_WITH_COMMENTS(threadId));
    }
  },

  /**
   * Invalidate user-related cache
   */
  invalidateUser: (userId: number) => {
    forumCache.delete(CacheKeys.USER_PERMISSIONS(userId));
    forumCache.delete(CacheKeys.USER_FORUMS(userId));
    forumCache.invalidatePattern(`threads:author:${userId}`);
    forumCache.invalidatePattern(`comments:author:${userId}`);
  },

  /**
   * Get cached data with fallback
   */
  getWithFallback: async <T>(
    key: string,
    fallbackFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> => {
    // Try to get from cache first
    const cached = forumCache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fallback to API call
    const data = await fallbackFn();
    forumCache.set(key, data, ttl);
    return data;
  }
};

// Cache warming functions
export const cacheWarming = {
  /**
   * Warm up forum cache
   */
  warmForumCache: async (forumApi: any) => {
    try {
      const response = await forumApi.getAll();
      if (response.data?.data) {
        cacheUtils.cacheForumList(response.data.data);
      }
    } catch (error) {
      console.warn('Failed to warm forum cache:', error);
    }
  },

  /**
   * Warm up user permissions cache
   */
  warmUserPermissions: async (userId: number, permissionsFn: () => Promise<any>) => {
    try {
      const permissions = await permissionsFn();
      forumCache.set(CacheKeys.USER_PERMISSIONS(userId), permissions, CACHE_CONFIG.USER_DATA_TTL);
    } catch (error) {
      console.warn('Failed to warm user permissions cache:', error);
    }
  }
}; 
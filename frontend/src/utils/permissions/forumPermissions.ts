export interface User {
  id: number;
  role: string;
  schoolId?: number;
  regionId?: number;
  departmentId?: number;
  isActive?: boolean;
  permissions?: string[];
}

export interface Forum {
  id: number;
  title: string;
  description?: string;
  courseId: number;
  active: boolean;
}

export interface Thread {
  id: number;
  forumId: number;
  authorId: number;
  pinned: boolean;
  active: boolean;
}

export interface Comment {
  id: number;
  threadId: number;
  authorId: number;
  parentId?: number;
  active: boolean;
}

// Permission types
export enum ForumAction {
  // Forum actions
  CREATE_FORUM = 'CREATE_FORUM',
  VIEW_FORUM = 'VIEW_FORUM',
  EDIT_FORUM = 'EDIT_FORUM',
  DELETE_FORUM = 'DELETE_FORUM',
  MODERATE_FORUM = 'MODERATE_FORUM',
  
  // Thread actions
  CREATE_THREAD = 'CREATE_THREAD',
  VIEW_THREAD = 'VIEW_THREAD',
  EDIT_THREAD = 'EDIT_THREAD',
  DELETE_THREAD = 'DELETE_THREAD',
  PIN_THREAD = 'PIN_THREAD',
  LOCK_THREAD = 'LOCK_THREAD',
  
  // Comment actions
  CREATE_COMMENT = 'CREATE_COMMENT',
  VIEW_COMMENT = 'VIEW_COMMENT',
  EDIT_COMMENT = 'EDIT_COMMENT',
  DELETE_COMMENT = 'DELETE_COMMENT',
  MODERATE_COMMENT = 'MODERATE_COMMENT',
  
  // Moderation actions
  APPROVE_CONTENT = 'APPROVE_CONTENT',
  REJECT_CONTENT = 'REJECT_CONTENT',
  BAN_USER = 'BAN_USER',
  VIEW_REPORTS = 'VIEW_REPORTS'
}

// Role-based permissions matrix
const ROLE_PERMISSIONS: Record<string, ForumAction[]> = {
  STUDENT: [
    ForumAction.VIEW_FORUM,
    ForumAction.VIEW_THREAD,
    ForumAction.CREATE_THREAD,
    ForumAction.EDIT_THREAD, // Own threads only
    ForumAction.VIEW_COMMENT,
    ForumAction.CREATE_COMMENT,
    ForumAction.EDIT_COMMENT // Own comments only
  ],
  
  PARENT: [
    ForumAction.VIEW_FORUM,
    ForumAction.VIEW_THREAD,
    ForumAction.VIEW_COMMENT,
    ForumAction.CREATE_COMMENT,
    ForumAction.EDIT_COMMENT // Own comments only
  ],
  
  TEACHER: [
    ForumAction.CREATE_FORUM,
    ForumAction.VIEW_FORUM,
    ForumAction.EDIT_FORUM, // Own forums or course forums
    ForumAction.MODERATE_FORUM,
    ForumAction.CREATE_THREAD,
    ForumAction.VIEW_THREAD,
    ForumAction.EDIT_THREAD,
    ForumAction.DELETE_THREAD, // Own threads or in moderated forums
    ForumAction.PIN_THREAD,
    ForumAction.LOCK_THREAD,
    ForumAction.CREATE_COMMENT,
    ForumAction.VIEW_COMMENT,
    ForumAction.EDIT_COMMENT,
    ForumAction.DELETE_COMMENT,
    ForumAction.MODERATE_COMMENT,
    ForumAction.APPROVE_CONTENT,
    ForumAction.REJECT_CONTENT,
    ForumAction.VIEW_REPORTS
  ],
  
  SCHOOL_ADMIN: [
    ...Object.values(ForumAction) // All permissions
  ],
  
  REGIONAL_ADMIN: [
    ...Object.values(ForumAction) // All permissions
  ],
  
  MINISTRY_STAFF: [
    ...Object.values(ForumAction) // All permissions
  ],
  
  SUPER_ADMIN: [
    ...Object.values(ForumAction) // All permissions
  ]
};

// Permission checker class
export class ForumPermissionChecker {
  
  /**
   * Check if user has basic role permission for an action
   */
  private hasRolePermission(user: User, action: ForumAction): boolean {
    // If isActive is undefined, treat user as active (since they're logged in)
    const isUserActive = user.isActive !== false;
    
    if (!isUserActive) {
      return false;
    }
    
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    return rolePermissions.includes(action);
  }
  
  /**
   * Check if user can perform action on forum
   */
  canPerformForumAction(user: User, action: ForumAction, forum?: Forum): boolean {
    // Check basic role permission
    if (!this.hasRolePermission(user, action)) {
      return false;
    }
    
    // Context-specific checks
    if (forum) {
      switch (action) {
        case ForumAction.EDIT_FORUM:
        case ForumAction.DELETE_FORUM:
          // Can edit/delete forums if teacher or admin
          if (user.role === 'STUDENT' || user.role === 'PARENT') {
            return false;
          }
          return true; // Teachers and admins can edit any forum
          
        case ForumAction.VIEW_FORUM:
          // Basic access control - can be enhanced with course enrollment checks
          return forum.active; // Only active forums are viewable
          
        case ForumAction.MODERATE_FORUM:
          // Only teachers and above can moderate
          if (user.role === 'STUDENT' || user.role === 'PARENT') {
            return false;
          }
          return true;
      }
    }
    
    return true;
  }
  
  /**
   * Check if user can perform action on thread
   */
  canPerformThreadAction(user: User, action: ForumAction, thread?: Thread, forum?: Forum): boolean {
    // Check basic role permission
    if (!this.hasRolePermission(user, action)) {
      return false;
    }
    
    // Context-specific checks
    if (thread) {
      switch (action) {
        case ForumAction.EDIT_THREAD:
        case ForumAction.DELETE_THREAD:
          // Can edit/delete own threads or if moderator
          if (user.role === 'STUDENT' || user.role === 'PARENT') {
            return thread.authorId === user.id;
          }
          return true; // Teachers and above can edit any thread
          
        case ForumAction.PIN_THREAD:
        case ForumAction.LOCK_THREAD:
          // Only teachers and above can pin/lock
          return ['TEACHER', 'SCHOOL_ADMIN', 'REGIONAL_ADMIN', 'MINISTRY_STAFF', 'SUPER_ADMIN'].includes(user.role);
      }
    }
    
    // Check forum-level permissions if forum is provided
    if (forum) {
      return this.canPerformForumAction(user, ForumAction.VIEW_FORUM, forum);
    }
    
    return true;
  }
  
  /**
   * Check if user can perform action on comment
   */
  canPerformCommentAction(user: User, action: ForumAction, comment?: Comment, thread?: Thread): boolean {
    // Check basic role permission
    if (!this.hasRolePermission(user, action)) {
      return false;
    }
    
    // Context-specific checks
    if (comment) {
      switch (action) {
        case ForumAction.EDIT_COMMENT:
        case ForumAction.DELETE_COMMENT:
          // Can edit/delete own comments or if moderator
          if (user.role === 'STUDENT' || user.role === 'PARENT') {
            return comment.authorId === user.id;
          }
          return true; // Teachers and above can edit any comment
          
        case ForumAction.MODERATE_COMMENT:
          // Only teachers and above can moderate
          return ['TEACHER', 'SCHOOL_ADMIN', 'REGIONAL_ADMIN', 'MINISTRY_STAFF', 'SUPER_ADMIN'].includes(user.role);
      }
    }
    
    return true;
  }
  
  /**
   * Get all allowed actions for user in a forum context
   */
  getAllowedForumActions(user: User, forum?: Forum): ForumAction[] {
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    
    return rolePermissions.filter(action => 
      this.canPerformForumAction(user, action, forum)
    );
  }
  
  /**
   * Get all allowed actions for user in a thread context
   */
  getAllowedThreadActions(user: User, thread?: Thread, forum?: Forum): ForumAction[] {
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    
    return rolePermissions.filter(action => 
      this.canPerformThreadAction(user, action, thread, forum)
    );
  }
  
  /**
   * Get all allowed actions for user in a comment context
   */
  getAllowedCommentActions(user: User, comment?: Comment, thread?: Thread): ForumAction[] {
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    
    return rolePermissions.filter(action => 
      this.canPerformCommentAction(user, action, comment, thread)
    );
  }
  
  /**
   * Check if user can create content (with rate limiting consideration)
   */
  canCreateContent(user: User, contentType: 'forum' | 'thread' | 'comment'): {
    allowed: boolean;
    reason?: string;
  } {
    // If isActive is undefined, treat user as active (since they're logged in)
    const isUserActive = user.isActive !== false;
    
    if (!isUserActive) {
      return { allowed: false, reason: 'User account is inactive' };
    }
    
    // Check role permissions
    const actionMap = {
      forum: ForumAction.CREATE_FORUM,
      thread: ForumAction.CREATE_THREAD,
      comment: ForumAction.CREATE_COMMENT
    };
    
    if (!this.hasRolePermission(user, actionMap[contentType])) {
      return { allowed: false, reason: 'Insufficient permissions' };
    }
    
    // Additional checks can be added here (e.g., user reputation, suspension status)
    
    return { allowed: true };
  }
}

// Global permission checker instance
export const forumPermissions = new ForumPermissionChecker();

// Utility functions for common permission checks
export const canUserCreateForum = (user: User): boolean => {
  const result = forumPermissions.canPerformForumAction(user, ForumAction.CREATE_FORUM);
  return result;
};

export const canUserEditForum = (user: User, forum: Forum): boolean => {
  return forumPermissions.canPerformForumAction(user, ForumAction.EDIT_FORUM, forum);
};

export const canUserDeleteForum = (user: User, forum: Forum): boolean => {
  return forumPermissions.canPerformForumAction(user, ForumAction.DELETE_FORUM, forum);
};

export const canUserCreateThread = (user: User, forum: Forum): boolean => {
  return forumPermissions.canPerformThreadAction(user, ForumAction.CREATE_THREAD, undefined, forum);
};

export const canUserEditThread = (user: User, thread: Thread): boolean => {
  return forumPermissions.canPerformThreadAction(user, ForumAction.EDIT_THREAD, thread);
};

export const canUserDeleteThread = (user: User, thread: Thread): boolean => {
  return forumPermissions.canPerformThreadAction(user, ForumAction.DELETE_THREAD, thread);
};

export const canUserPinThread = (user: User, thread: Thread): boolean => {
  return forumPermissions.canPerformThreadAction(user, ForumAction.PIN_THREAD, thread);
};

export const canUserCreateComment = (user: User): boolean => {
  return forumPermissions.canPerformCommentAction(user, ForumAction.CREATE_COMMENT);
};

export const canUserEditComment = (user: User, comment: Comment): boolean => {
  return forumPermissions.canPerformCommentAction(user, ForumAction.EDIT_COMMENT, comment);
};

export const canUserDeleteComment = (user: User, comment: Comment): boolean => {
  return forumPermissions.canPerformCommentAction(user, ForumAction.DELETE_COMMENT, comment);
};

export const canUserModerate = (user: User): boolean => {
  return ['TEACHER', 'SCHOOL_ADMIN', 'REGIONAL_ADMIN', 'MINISTRY_STAFF', 'SUPER_ADMIN'].includes(user.role);
}; 
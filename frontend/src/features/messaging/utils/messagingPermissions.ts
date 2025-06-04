import { User } from '../../../api/services/userApi';

export interface MessagingContext {
  requireSameSchool?: boolean;
  schoolId?: number;
  regionId?: number;
}

export interface MessagingPermissions {
  canSendMessages: boolean;
  canCreateGroups: boolean;
  canMessageRole: (targetRole: string) => boolean;
  canMessageUser: (targetUser: User) => boolean;
  allowedContactRoles: string[];
  maxGroupSize?: number;
}

/**
 * Determines messaging permissions based on user role
 * Following real-world educational hierarchy and communication patterns
 */
export const getMessagingPermissions = (userRole: string): MessagingPermissions => {
  switch (userRole) {
    case 'STUDENT':
      return {
        canSendMessages: true,
        canCreateGroups: false, // Students typically can't create groups
        canMessageRole: (targetRole: string) => [
          'TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 
          'SCHOOL_HEAD', 'SCHOOL_ADMIN'
        ].includes(targetRole),
        canMessageUser: (targetUser: User) => {
          // Students can message teachers and admin in their school
          const allowedRoles = ['TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN'];
          return allowedRoles.includes(targetUser.role);
        },
        allowedContactRoles: ['TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN']
      };

    case 'PARENT':
      return {
        canSendMessages: true,
        canCreateGroups: false, // Parents typically can't create groups
        canMessageRole: (targetRole: string) => [
          'TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 
          'SCHOOL_HEAD', 'SCHOOL_ADMIN'
        ].includes(targetRole),
        canMessageUser: (targetUser: User) => {
          // Parents can message teachers and admin about their children
          const allowedRoles = ['TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN'];
          return allowedRoles.includes(targetUser.role);
        },
        allowedContactRoles: ['TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN']
      };

    case 'TEACHER':
      return {
        canSendMessages: true,
        canCreateGroups: true,
        canMessageRole: (targetRole: string) => [
          'STUDENT', 'PARENT', 'TEACHER', 'SENIOR_TEACHER', 
          'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN'
        ].includes(targetRole),
        canMessageUser: (targetUser: User) => {
          // Teachers can message within their school and to parents
          const allowedRoles = ['STUDENT', 'TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN', 'PARENT'];
          return allowedRoles.includes(targetUser.role);
        },
        allowedContactRoles: ['STUDENT', 'PARENT', 'TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN'],
        maxGroupSize: 50
      };

    case 'SENIOR_TEACHER':
      return {
        canSendMessages: true,
        canCreateGroups: true,
        canMessageRole: (targetRole: string) => [
          'STUDENT', 'PARENT', 'TEACHER', 'SENIOR_TEACHER', 
          'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN'
        ].includes(targetRole),
        canMessageUser: (targetUser: User) => {
          // Senior teachers have same permissions as teachers
          const allowedRoles = ['STUDENT', 'TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN', 'PARENT'];
          return allowedRoles.includes(targetUser.role);
        },
        allowedContactRoles: ['STUDENT', 'PARENT', 'TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN'],
        maxGroupSize: 100
      };

    case 'DEPARTMENT_HEAD':
      return {
        canSendMessages: true,
        canCreateGroups: true,
        canMessageRole: (targetRole: string) => [
          'STUDENT', 'PARENT', 'TEACHER', 'SENIOR_TEACHER', 
          'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN'
        ].includes(targetRole),
        canMessageUser: (targetUser: User) => {
          // Department heads can message within school and to parents
          const allowedRoles = ['STUDENT', 'TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN', 'PARENT'];
          return allowedRoles.includes(targetUser.role);
        },
        allowedContactRoles: ['STUDENT', 'PARENT', 'TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN'],
        maxGroupSize: 200
      };

    case 'SCHOOL_HEAD':
    case 'SCHOOL_ADMIN':
      return {
        canSendMessages: true,
        canCreateGroups: true,
        canMessageRole: (targetRole: string) => [
          'STUDENT', 'PARENT', 'TEACHER', 'SENIOR_TEACHER', 
          'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN',
          'REGIONAL_OFFICER', 'REGIONAL_ADMIN'
        ].includes(targetRole),
        canMessageUser: (targetUser: User) => {
          // School admins can message within school, to parents, and to regional staff
          const allowedRoles = ['STUDENT', 'TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN', 'PARENT', 'REGIONAL_OFFICER', 'REGIONAL_ADMIN'];
          return allowedRoles.includes(targetUser.role);
        },
        allowedContactRoles: ['STUDENT', 'PARENT', 'TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN', 'REGIONAL_OFFICER', 'REGIONAL_ADMIN'],
        maxGroupSize: 500
      };

    case 'REGIONAL_OFFICER':
      return {
        canSendMessages: true,
        canCreateGroups: true,
        canMessageRole: (targetRole: string) => [
          'SCHOOL_HEAD', 'SCHOOL_ADMIN', 'REGIONAL_OFFICER', 'REGIONAL_ADMIN'
        ].includes(targetRole),
        canMessageUser: (targetUser: User) => {
          // Regional officers can message schools and other regional staff
          if (['SCHOOL_HEAD', 'SCHOOL_ADMIN'].includes(targetUser.role)) {
            return true; // Can message any school (region filtering would be handled by backend)
          }
          if (['REGIONAL_OFFICER', 'REGIONAL_ADMIN'].includes(targetUser.role)) {
            return true;
          }
          return false;
        },
        allowedContactRoles: ['SCHOOL_HEAD', 'SCHOOL_ADMIN', 'REGIONAL_OFFICER', 'REGIONAL_ADMIN'],
        maxGroupSize: 100
      };

    case 'REGIONAL_ADMIN':
      return {
        canSendMessages: true,
        canCreateGroups: true,
        canMessageRole: (targetRole: string) => [
          'SCHOOL_HEAD', 'SCHOOL_ADMIN', 'REGIONAL_OFFICER', 'REGIONAL_ADMIN',
          'DIRECTOR', 'MINISTRY_STAFF', 'MINISTRY_EXECUTIVE'
        ].includes(targetRole),
        canMessageUser: (targetUser: User) => {
          // Regional admins can message schools, regional staff, and ministry
          if (['SCHOOL_HEAD', 'SCHOOL_ADMIN'].includes(targetUser.role)) {
            return true; // Can message any school (region filtering would be handled by backend)
          }
          if (['REGIONAL_OFFICER', 'REGIONAL_ADMIN', 'DIRECTOR', 'MINISTRY_STAFF', 'MINISTRY_EXECUTIVE'].includes(targetUser.role)) {
            return true;
          }
          return false;
        },
        allowedContactRoles: ['SCHOOL_HEAD', 'SCHOOL_ADMIN', 'REGIONAL_OFFICER', 'REGIONAL_ADMIN', 'DIRECTOR', 'MINISTRY_STAFF', 'MINISTRY_EXECUTIVE'],
        maxGroupSize: 200
      };

    case 'DIRECTOR':
    case 'MINISTRY_STAFF':
    case 'MINISTRY_EXECUTIVE':
    case 'SUPER_ADMIN':
      return {
        canSendMessages: true,
        canCreateGroups: true,
        canMessageRole: () => true, // Can message any role
        canMessageUser: () => true, // Can message any user
        allowedContactRoles: [
          'STUDENT', 'PARENT', 'TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD',
          'SCHOOL_HEAD', 'SCHOOL_ADMIN', 'REGIONAL_OFFICER', 'REGIONAL_ADMIN',
          'DIRECTOR', 'MINISTRY_STAFF', 'MINISTRY_EXECUTIVE', 'SUPER_ADMIN'
        ],
        maxGroupSize: 1000
      };

    default:
      return {
        canSendMessages: false,
        canCreateGroups: false,
        canMessageRole: () => false,
        canMessageUser: () => false,
        allowedContactRoles: []
      };
  }
};

/**
 * Get allowed contact roles for a user based on their role
 * @param userRole The role of the current user
 * @returns Array of roles that the user can message
 */
export const getAllowedContactRoles = (userRole: string): string[] => {
  const permissions = getMessagingPermissions(userRole);
  return permissions.allowedContactRoles;
};

/**
 * Check if a user can create group conversations
 * @param userRole The role of the current user
 * @returns Boolean indicating if user can create groups
 */
export const canCreateGroups = (userRole: string): boolean => {
  const permissions = getMessagingPermissions(userRole);
  return permissions.canCreateGroups;
};

/**
 * Check if a user can message another user based on roles and context
 * @param senderRole The role of the sender
 * @param recipientRole The role of the recipient
 * @param context Additional context like school affiliation
 * @returns Boolean indicating if messaging is allowed
 */
export const canUserMessageUser = (
  senderRole: string, 
  recipientRole: string, 
  context?: MessagingContext
): boolean => {
  const permissions = getMessagingPermissions(senderRole);
  
  // Check if recipient role is in allowed contact roles
  if (!permissions.allowedContactRoles.includes(recipientRole)) {
    return false;
  }
  
  // Additional context-based checks can be added here
  // For example, checking if users are in the same school
  if (context?.requireSameSchool) {
    // Implementation would check school affiliation
    return true; // Placeholder
  }
  
  return true;
};

/**
 * Get maximum group size for a user role
 */
export const getMaxGroupSize = (userRole: string): number => {
  const permissions = getMessagingPermissions(userRole);
  return permissions.maxGroupSize || 10; // Default to 10 if not specified
}; 
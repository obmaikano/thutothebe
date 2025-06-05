/**
 * Utility functions for role-based permission checking
 */

/**
 * User roles enum for type safety
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MINISTRY_EXECUTIVE = 'MINISTRY_EXECUTIVE',
  MINISTRY_STAFF = 'MINISTRY_STAFF',
  DIRECTOR = 'DIRECTOR',
  REGIONAL_ADMIN = 'REGIONAL_ADMIN',
  REGIONAL_MANAGER = 'REGIONAL_MANAGER',
  REGIONAL_OFFICER = 'REGIONAL_OFFICER',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  SCHOOL_HEAD = 'SCHOOL_HEAD',
  DEPUTY_HEAD = 'DEPUTY_HEAD',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  HEAD_TEACHER = 'HEAD_TEACHER',
  SENIOR_TEACHER = 'SENIOR_TEACHER',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}

/**
 * Check if user has permission based on role
 * @param userRole Current user's role
 * @param allowedRoles Array of roles that have permission
 * @returns True if user has permission
 */
export const hasPermission = (userRole: string | undefined, allowedRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole as UserRole);
};

/**
 * Check if user can create schedules
 * @param userRole Current user's role
 * @returns True if user can create schedules
 */
export const canCreateSchedules = (userRole: string | undefined): boolean => {
  return hasPermission(userRole, [
    UserRole.SUPER_ADMIN,
    UserRole.MINISTRY_EXECUTIVE,
    UserRole.MINISTRY_STAFF,
    UserRole.DIRECTOR,
    UserRole.REGIONAL_ADMIN,
    UserRole.REGIONAL_MANAGER,
    UserRole.REGIONAL_OFFICER,
    UserRole.SCHOOL_ADMIN,
    UserRole.SCHOOL_HEAD,
    UserRole.DEPUTY_HEAD,
    UserRole.DEPARTMENT_HEAD,
    UserRole.HEAD_TEACHER,
    UserRole.SENIOR_TEACHER
  ]);
};

/**
 * Check if user can edit schedules
 * @param userRole Current user's role
 * @returns True if user can edit schedules
 */
export const canEditSchedules = (userRole: string | undefined): boolean => {
  return hasPermission(userRole, [
    UserRole.SUPER_ADMIN,
    UserRole.MINISTRY_EXECUTIVE,
    UserRole.MINISTRY_STAFF,
    UserRole.DIRECTOR,
    UserRole.REGIONAL_ADMIN,
    UserRole.REGIONAL_MANAGER,
    UserRole.SCHOOL_ADMIN,
    UserRole.SCHOOL_HEAD,
    UserRole.DEPUTY_HEAD,
    UserRole.DEPARTMENT_HEAD,
    UserRole.HEAD_TEACHER
  ]);
};

/**
 * Check if user can delete schedules
 * @param userRole Current user's role
 * @returns True if user can delete schedules
 */
export const canDeleteSchedules = (userRole: string | undefined): boolean => {
  return hasPermission(userRole, [
    UserRole.SUPER_ADMIN,
    UserRole.MINISTRY_EXECUTIVE,
    UserRole.MINISTRY_STAFF,
    UserRole.DIRECTOR,
    UserRole.REGIONAL_ADMIN,
    UserRole.REGIONAL_MANAGER,
    UserRole.SCHOOL_ADMIN,
    UserRole.SCHOOL_HEAD,
    UserRole.DEPUTY_HEAD
  ]);
};

/**
 * Check if user can view schedules
 * @param userRole Current user's role
 * @returns True if user can view schedules
 */
export const canViewSchedules = (userRole: string | undefined): boolean => {
  return hasPermission(userRole, [
    UserRole.SUPER_ADMIN,
    UserRole.MINISTRY_EXECUTIVE,
    UserRole.MINISTRY_STAFF,
    UserRole.DIRECTOR,
    UserRole.REGIONAL_ADMIN,
    UserRole.REGIONAL_MANAGER,
    UserRole.REGIONAL_OFFICER,
    UserRole.SCHOOL_ADMIN,
    UserRole.SCHOOL_HEAD,
    UserRole.DEPUTY_HEAD,
    UserRole.DEPARTMENT_HEAD,
    UserRole.HEAD_TEACHER,
    UserRole.SENIOR_TEACHER,
    UserRole.TEACHER,
    UserRole.STUDENT,
    UserRole.PARENT
  ]);
};

/**
 * Check if user can manage timetables
 * @param userRole Current user's role
 * @returns True if user can manage timetables
 */
export const canManageTimetables = (userRole: string | undefined): boolean => {
  return hasPermission(userRole, [
    UserRole.SUPER_ADMIN,
    UserRole.MINISTRY_EXECUTIVE,
    UserRole.MINISTRY_STAFF,
    UserRole.DIRECTOR,
    UserRole.REGIONAL_ADMIN,
    UserRole.REGIONAL_MANAGER,
    UserRole.SCHOOL_ADMIN,
    UserRole.SCHOOL_HEAD,
    UserRole.DEPUTY_HEAD
  ]);
};

/**
 * Check if user can approve schedules
 * @param userRole Current user's role
 * @returns True if user can approve schedules
 */
export const canApproveSchedules = (userRole: string | undefined): boolean => {
  return hasPermission(userRole, [
    UserRole.SUPER_ADMIN,
    UserRole.MINISTRY_EXECUTIVE,
    UserRole.DIRECTOR,
    UserRole.REGIONAL_ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.SCHOOL_HEAD
  ]);
};

/**
 * Check if user is an administrator
 * @param userRole Current user's role
 * @returns True if user is an administrator
 */
export const isAdministrator = (userRole: string | undefined): boolean => {
  return hasPermission(userRole, [
    UserRole.SUPER_ADMIN,
    UserRole.MINISTRY_EXECUTIVE,
    UserRole.MINISTRY_STAFF,
    UserRole.DIRECTOR,
    UserRole.REGIONAL_ADMIN,
    UserRole.REGIONAL_MANAGER,
    UserRole.SCHOOL_ADMIN,
    UserRole.SCHOOL_HEAD
  ]);
};

/**
 * Check if user is a teacher or higher
 * @param userRole Current user's role
 * @returns True if user is a teacher or higher
 */
export const isTeacherOrHigher = (userRole: string | undefined): boolean => {
  return hasPermission(userRole, [
    UserRole.SUPER_ADMIN,
    UserRole.MINISTRY_EXECUTIVE,
    UserRole.MINISTRY_STAFF,
    UserRole.DIRECTOR,
    UserRole.REGIONAL_ADMIN,
    UserRole.REGIONAL_MANAGER,
    UserRole.REGIONAL_OFFICER,
    UserRole.SCHOOL_ADMIN,
    UserRole.SCHOOL_HEAD,
    UserRole.DEPUTY_HEAD,
    UserRole.DEPARTMENT_HEAD,
    UserRole.HEAD_TEACHER,
    UserRole.SENIOR_TEACHER,
    UserRole.TEACHER
  ]);
};

/**
 * Get permission level for user role
 * @param userRole Current user's role
 * @returns Permission level (0-10, higher is more permissions)
 */
export const getPermissionLevel = (userRole: string | undefined): number => {
  if (!userRole) return 0;
  
  const levels: Record<string, number> = {
    [UserRole.SUPER_ADMIN]: 10,
    [UserRole.MINISTRY_EXECUTIVE]: 9,
    [UserRole.MINISTRY_STAFF]: 8,
    [UserRole.DIRECTOR]: 8,
    [UserRole.REGIONAL_ADMIN]: 7,
    [UserRole.REGIONAL_MANAGER]: 6,
    [UserRole.REGIONAL_OFFICER]: 5,
    [UserRole.SCHOOL_ADMIN]: 6,
    [UserRole.SCHOOL_HEAD]: 5,
    [UserRole.DEPUTY_HEAD]: 4,
    [UserRole.DEPARTMENT_HEAD]: 4,
    [UserRole.HEAD_TEACHER]: 3,
    [UserRole.SENIOR_TEACHER]: 3,
    [UserRole.TEACHER]: 2,
    [UserRole.STUDENT]: 1,
    [UserRole.PARENT]: 1
  };
  
  return levels[userRole] || 0;
}; 
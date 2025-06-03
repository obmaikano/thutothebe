package com.ohma.thutothebe.entity;

/**
 * Defines access scopes for the faux multi-tenant LMS system.
 * Scopes are hierarchical: GLOBAL > REGION > SCHOOL > DEPARTMENT > CLASS > USER
 */
public enum AccessScope {
    GLOBAL,      // System-wide access (SUPER_ADMIN, MINISTRY_EXECUTIVE, MINISTRY_STAFF)
    REGION,      // Regional scope (REGIONAL_ADMIN, DIRECTOR)
    SCHOOL,      // School scope (SCHOOL_ADMIN, SCHOOL_HEAD, TEACHER, STUDENT)
    DEPARTMENT,  // Department scope (DEPARTMENT_HEAD)
    CLASS,       // Class scope (TEACHER, STUDENT for specific classes)
    USER,        // Individual user scope (Self access)
    PARENT       // Parent scope (Multi-child access across schools)
} 
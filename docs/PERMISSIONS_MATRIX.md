# Permissions Matrix for Educational LMS Platform

## Overview
This document provides a comprehensive matrix of permissions for all user roles in the educational LMS platform. Each role has specific access rights to various resources with defined scopes.

## Legend
- **✅ CRUD**: Full Create, Read, Update, Delete access
- **✅ CRU**: Create, Read, Update access (no delete)
- **✅ CR**: Create, Read access only
- **✅ R**: Read-only access
- **❌**: No access
- **Scope**: The level at which the permission applies

## User Roles Hierarchy
1. **SUPER_ADMIN** - System-wide administrative access
2. **MINISTRY_EXECUTIVE** - National education oversight
3. **MINISTRY_STAFF** - National education operations
4. **DIRECTOR** - Regional/district oversight
5. **REGIONAL_ADMIN** - Regional administrative control
6. **REGIONAL_OFFICER** - Regional operational support
7. **SCHOOL_ADMIN** - School-wide administrative control
8. **SCHOOL_HEAD** - School leadership and oversight
9. **DEPARTMENT_HEAD** - Department-level management
10. **SENIOR_TEACHER** - Advanced teaching responsibilities
11. **TEACHER** - Standard teaching responsibilities
12. **STUDENT** - Learning and participation
13. **PARENT** - Child monitoring and communication

## Detailed Permissions Matrix

### 1. User Management

| Role | Access Level | Scope | Create Users | Read Users | Update Users | Delete Users | Notes |
|------|-------------|-------|--------------|------------|--------------|--------------|-------|
| SUPER_ADMIN | ✅ CRUD | Global | All roles | All users | All users | All users | System-wide user management |
| MINISTRY_EXECUTIVE | ✅ CRUD | National | Below Director | All users | Below Director | Below Director | Cannot manage other executives |
| MINISTRY_STAFF | ✅ CRU | National | Below Regional Admin | All users | Below Regional Admin | ❌ | Operational user management |
| DIRECTOR | ✅ CRUD | Regional | Below School Admin | Regional scope | Regional scope | Regional scope | Regional user oversight |
| REGIONAL_ADMIN | ✅ CRUD | Regional | Below School Head | Regional scope | Regional scope | Regional scope | Regional administration |
| REGIONAL_OFFICER | ✅ CRU | Regional | Teachers/Students | Regional scope | Teachers/Students | ❌ | Regional support |
| SCHOOL_ADMIN | ✅ CRUD | School | School staff | School scope | School scope | School scope | School administration |
| SCHOOL_HEAD | ✅ CRU | School | Teachers/Students | School scope | Teachers/Students | ❌ | School leadership |
| DEPARTMENT_HEAD | ✅ CR | Department | Teachers in dept | Department scope | Teachers in dept | ❌ | Department management |
| SENIOR_TEACHER | ✅ R | Class | ❌ | Class scope | ❌ | ❌ | View class participants |
| TEACHER | ✅ R | Class | ❌ | Class scope | ❌ | ❌ | View class participants |
| STUDENT | ✅ R | Self | ❌ | Self only | Self profile | ❌ | Self-management |
| PARENT | ✅ R | Children | ❌ | Children only | ❌ | ❌ | Monitor children |

### 2. Schedule Management

| Role | Access Level | Scope | Create Schedule | Read Schedule | Update Schedule | Delete Schedule | Notes |
|------|-------------|-------|-----------------|---------------|-----------------|-----------------|-------|
| SUPER_ADMIN | ✅ CRUD | Global | All schedules | All schedules | All schedules | All schedules | System-wide scheduling |
| MINISTRY_EXECUTIVE | ✅ CRUD | National | National events | All schedules | National events | National events | National scheduling |
| MINISTRY_STAFF | ✅ CRU | National | Regional events | All schedules | Regional events | ❌ | National operations |
| DIRECTOR | ✅ CRUD | Regional | Regional events | Regional scope | Regional scope | Regional scope | Regional scheduling |
| REGIONAL_ADMIN | ✅ CRUD | Regional | Regional/School | Regional scope | Regional scope | Regional scope | Regional administration |
| REGIONAL_OFFICER | ✅ CRU | Regional | School events | Regional scope | School events | ❌ | Regional support |
| SCHOOL_ADMIN | ✅ CRUD | School | School events | School scope | School scope | School scope | School scheduling |
| SCHOOL_HEAD | ✅ CRU | School | School events | School scope | School events | ❌ | School oversight |
| DEPARTMENT_HEAD | ✅ CRU | Department | Dept events | Department scope | Dept events | ❌ | Department scheduling |
| SENIOR_TEACHER | ✅ CR | Class | Class events | Class scope | Class events | ❌ | Class scheduling |
| TEACHER | ✅ CR | Class | Class events | Class scope | Class events | ❌ | Class scheduling |
| STUDENT | ✅ R | Class/Self | ❌ | Class/Personal | ❌ | ❌ | View schedules |
| PARENT | ✅ R | Children | ❌ | Children's classes | ❌ | ❌ | Monitor child schedules |

### 3. Announcement Management

| Role | Access Level | Scope | Create Announcement | Read Announcement | Update Announcement | Delete Announcement | Notes |
|------|-------------|-------|---------------------|-------------------|---------------------|---------------------|-------|
| SUPER_ADMIN | ✅ CRUD | Global | All levels | All announcements | All announcements | All announcements | System-wide announcements |
| MINISTRY_EXECUTIVE | ✅ CRUD | National | National/Regional | All announcements | National/Regional | National/Regional | National communications |
| MINISTRY_STAFF | ✅ CRU | National | Regional/School | All announcements | Regional/School | ❌ | National operations |
| DIRECTOR | ✅ CRUD | Regional | Regional/School | Regional scope | Regional scope | Regional scope | Regional communications |
| REGIONAL_ADMIN | ✅ CRUD | Regional | Regional/School | Regional scope | Regional scope | Regional scope | Regional administration |
| REGIONAL_OFFICER | ✅ CRU | Regional | School level | Regional scope | School level | ❌ | Regional support |
| SCHOOL_ADMIN | ✅ CRUD | School | School/Class | School scope | School scope | School scope | School communications |
| SCHOOL_HEAD | ✅ CRU | School | School/Class | School scope | School/Class | ❌ | School leadership |
| DEPARTMENT_HEAD | ✅ CRU | Department | Department/Class | Department scope | Department/Class | ❌ | Department communications |
| SENIOR_TEACHER | ✅ CR | Class | Class level | Class scope | Class level | ❌ | Class communications |
| TEACHER | ✅ CR | Class | Class level | Class scope | Class level | ❌ | Class communications |
| STUDENT | ✅ R | Class/Self | ❌ | Relevant announcements | ❌ | ❌ | Receive announcements |
| PARENT | ✅ R | Children | ❌ | Children's announcements | ❌ | ❌ | Monitor communications |

### 4. Course Management

| Role | Access Level | Scope | Create Course | Read Course | Update Course | Delete Course | Notes |
|------|-------------|-------|---------------|-------------|---------------|---------------|-------|
| SUPER_ADMIN | ✅ CRUD | Global | All courses | All courses | All courses | All courses | System-wide course management |
| MINISTRY_EXECUTIVE | ✅ CRUD | National | National curriculum | All courses | National curriculum | National curriculum | Curriculum oversight |
| MINISTRY_STAFF | ✅ CRU | National | Regional courses | All courses | Regional courses | ❌ | Curriculum operations |
| DIRECTOR | ✅ CRUD | Regional | Regional courses | Regional scope | Regional scope | Regional scope | Regional curriculum |
| REGIONAL_ADMIN | ✅ CRUD | Regional | Regional/School | Regional scope | Regional scope | Regional scope | Regional administration |
| REGIONAL_OFFICER | ✅ CRU | Regional | School courses | Regional scope | School courses | ❌ | Regional support |
| SCHOOL_ADMIN | ✅ CRUD | School | School courses | School scope | School scope | School scope | School curriculum |
| SCHOOL_HEAD | ✅ CRU | School | School courses | School scope | School courses | ❌ | School oversight |
| DEPARTMENT_HEAD | ✅ CRU | Department | Dept courses | Department scope | Dept courses | ❌ | Department curriculum |
| SENIOR_TEACHER | ✅ CRU | Class | Assigned courses | Teaching scope | Assigned courses | ❌ | Course instruction |
| TEACHER | ✅ CRU | Class | Assigned courses | Teaching scope | Assigned courses | ❌ | Course instruction |
| STUDENT | ✅ R | Enrolled | ❌ | Enrolled courses | ❌ | ❌ | Course participation |
| PARENT | ✅ R | Children | ❌ | Children's courses | ❌ | ❌ | Monitor child courses |

### 5. Assignment Management

| Role | Access Level | Scope | Create Assignment | Read Assignment | Update Assignment | Delete Assignment | Notes |
|------|-------------|-------|-------------------|-----------------|-------------------|-------------------|-------|
| SUPER_ADMIN | ✅ CRUD | Global | All assignments | All assignments | All assignments | All assignments | System oversight |
| MINISTRY_EXECUTIVE | ✅ R | National | ❌ | All assignments | ❌ | ❌ | Monitoring only |
| MINISTRY_STAFF | ✅ R | National | ❌ | All assignments | ❌ | ❌ | Monitoring only |
| DIRECTOR | ✅ R | Regional | ❌ | Regional scope | ❌ | ❌ | Regional monitoring |
| REGIONAL_ADMIN | ✅ R | Regional | ❌ | Regional scope | ❌ | ❌ | Regional monitoring |
| REGIONAL_OFFICER | ✅ R | Regional | ❌ | Regional scope | ❌ | ❌ | Regional monitoring |
| SCHOOL_ADMIN | ✅ R | School | ❌ | School scope | ❌ | ❌ | School monitoring |
| SCHOOL_HEAD | ✅ R | School | ❌ | School scope | ❌ | ❌ | School monitoring |
| DEPARTMENT_HEAD | ✅ R | Department | ❌ | Department scope | ❌ | ❌ | Department monitoring |
| SENIOR_TEACHER | ✅ CRUD | Class | Class assignments | Teaching scope | Class assignments | Class assignments | Assignment management |
| TEACHER | ✅ CRUD | Class | Class assignments | Teaching scope | Class assignments | Class assignments | Assignment management |
| STUDENT | ✅ R | Enrolled | ❌ | Assigned to them | ❌ | ❌ | Assignment participation |
| PARENT | ✅ R | Children | ❌ | Children's assignments | ❌ | ❌ | Monitor child assignments |

### 6. Grade/Assessment Management

| Role | Access Level | Scope | Create Grade | Read Grade | Update Grade | Delete Grade | Notes |
|------|-------------|-------|--------------|------------|--------------|--------------|-------|
| SUPER_ADMIN | ✅ CRUD | Global | All grades | All grades | All grades | All grades | System oversight |
| MINISTRY_EXECUTIVE | ✅ R | National | ❌ | All grades | ❌ | ❌ | National monitoring |
| MINISTRY_STAFF | ✅ R | National | ❌ | All grades | ❌ | ❌ | National monitoring |
| DIRECTOR | ✅ R | Regional | ❌ | Regional scope | ❌ | ❌ | Regional monitoring |
| REGIONAL_ADMIN | ✅ R | Regional | ❌ | Regional scope | ❌ | ❌ | Regional monitoring |
| REGIONAL_OFFICER | ✅ R | Regional | ❌ | Regional scope | ❌ | ❌ | Regional monitoring |
| SCHOOL_ADMIN | ✅ R | School | ❌ | School scope | ❌ | ❌ | School monitoring |
| SCHOOL_HEAD | ✅ R | School | ❌ | School scope | ❌ | ❌ | School monitoring |
| DEPARTMENT_HEAD | ✅ R | Department | ❌ | Department scope | ❌ | ❌ | Department monitoring |
| SENIOR_TEACHER | ✅ CRUD | Class | Student grades | Teaching scope | Student grades | Student grades | Grade management |
| TEACHER | ✅ CRUD | Class | Student grades | Teaching scope | Student grades | Student grades | Grade management |
| STUDENT | ✅ R | Self | ❌ | Own grades | ❌ | ❌ | View own performance |
| PARENT | ✅ R | Children | ❌ | Children's grades | ❌ | ❌ | Monitor child performance |

### 7. Communication/Messaging

| Role | Access Level | Scope | Send Message | Read Message | Update Message | Delete Message | Notes |
|------|-------------|-------|--------------|--------------|----------------|----------------|-------|
| SUPER_ADMIN | ✅ CRUD | Global | To anyone | All messages | All messages | All messages | System communications |
| MINISTRY_EXECUTIVE | ✅ CRUD | National | National scope | National scope | Own messages | Own messages | National communications |
| MINISTRY_STAFF | ✅ CRU | National | National scope | National scope | Own messages | ❌ | National operations |
| DIRECTOR | ✅ CRUD | Regional | Regional scope | Regional scope | Own messages | Own messages | Regional communications |
| REGIONAL_ADMIN | ✅ CRUD | Regional | Regional scope | Regional scope | Own messages | Own messages | Regional communications |
| REGIONAL_OFFICER | ✅ CRU | Regional | Regional scope | Regional scope | Own messages | ❌ | Regional support |
| SCHOOL_ADMIN | ✅ CRUD | School | School scope | School scope | Own messages | Own messages | School communications |
| SCHOOL_HEAD | ✅ CRU | School | School scope | School scope | Own messages | ❌ | School communications |
| DEPARTMENT_HEAD | ✅ CRU | Department | Department scope | Department scope | Own messages | ❌ | Department communications |
| SENIOR_TEACHER | ✅ CRU | Class | Class scope | Class scope | Own messages | ❌ | Class communications |
| TEACHER | ✅ CRU | Class | Class scope | Class scope | Own messages | ❌ | Class communications |
| STUDENT | ✅ CR | Class | To teachers/peers | Class scope | Own messages | ❌ | Student communications |
| PARENT | ✅ CR | Children | To teachers/school | Child-related | Own messages | ❌ | Parent communications |

### 8. School Management

| Role | Access Level | Scope | Create School | Read School | Update School | Delete School | Notes |
|------|-------------|-------|---------------|-------------|---------------|---------------|-------|
| SUPER_ADMIN | ✅ CRUD | Global | All schools | All schools | All schools | All schools | System-wide school management |
| MINISTRY_EXECUTIVE | ✅ CRUD | National | All schools | All schools | All schools | All schools | National school oversight |
| MINISTRY_STAFF | ✅ CRU | National | Regional schools | All schools | Regional schools | ❌ | National operations |
| DIRECTOR | ✅ CRUD | Regional | Regional schools | Regional scope | Regional scope | Regional scope | Regional school management |
| REGIONAL_ADMIN | ✅ CRUD | Regional | Regional schools | Regional scope | Regional scope | Regional scope | Regional administration |
| REGIONAL_OFFICER | ✅ R | Regional | ❌ | Regional scope | ❌ | ❌ | Regional monitoring |
| SCHOOL_ADMIN | ✅ CRU | School | ❌ | Own school | Own school | ❌ | School self-management |
| SCHOOL_HEAD | ✅ R | School | ❌ | Own school | ❌ | ❌ | School monitoring |
| DEPARTMENT_HEAD | ✅ R | School | ❌ | Own school | ❌ | ❌ | School awareness |
| SENIOR_TEACHER | ✅ R | School | ❌ | Own school | ❌ | ❌ | School awareness |
| TEACHER | ✅ R | School | ❌ | Own school | ❌ | ❌ | School awareness |
| STUDENT | ✅ R | School | ❌ | Own school | ❌ | ❌ | School awareness |
| PARENT | ✅ R | Children | ❌ | Children's schools | ❌ | ❌ | School awareness |

### 9. Region Management

| Role | Access Level | Scope | Create Region | Read Region | Update Region | Delete Region | Notes |
|------|-------------|-------|---------------|-------------|---------------|---------------|-------|
| SUPER_ADMIN | ✅ CRUD | Global | All regions | All regions | All regions | All regions | System-wide region management |
| MINISTRY_EXECUTIVE | ✅ CRUD | National | All regions | All regions | All regions | All regions | National region oversight |
| MINISTRY_STAFF | ✅ CRU | National | New regions | All regions | All regions | ❌ | National operations |
| DIRECTOR | ✅ R | Regional | ❌ | All regions | ❌ | ❌ | Regional awareness |
| REGIONAL_ADMIN | ✅ CRU | Regional | ❌ | All regions | Own region | ❌ | Regional self-management |
| REGIONAL_OFFICER | ✅ R | Regional | ❌ | All regions | ❌ | ❌ | Regional awareness |
| SCHOOL_ADMIN | ✅ R | Regional | ❌ | Own region | ❌ | ❌ | Regional awareness |
| SCHOOL_HEAD | ✅ R | Regional | ❌ | Own region | ❌ | ❌ | Regional awareness |
| DEPARTMENT_HEAD | ✅ R | Regional | ❌ | Own region | ❌ | ❌ | Regional awareness |
| SENIOR_TEACHER | ✅ R | Regional | ❌ | Own region | ❌ | ❌ | Regional awareness |
| TEACHER | ✅ R | Regional | ❌ | Own region | ❌ | ❌ | Regional awareness |
| STUDENT | ✅ R | Regional | ❌ | Own region | ❌ | ❌ | Regional awareness |
| PARENT | ✅ R | Regional | ❌ | Own region | ❌ | ❌ | Regional awareness |

## Special Permission Rules

### 1. Role Hierarchy Inheritance
- Higher-level roles automatically inherit permissions from lower-level roles within their scope
- SUPER_ADMIN has unrestricted access to all resources and actions
- Each role can only manage users of lower hierarchy levels

### 2. Scope Restrictions
- **Global**: System-wide access (SUPER_ADMIN only)
- **National**: Country-wide access (Ministry levels)
- **Regional**: Regional/district-wide access
- **School**: School-wide access
- **Department**: Department-wide access
- **Class**: Class-specific access
- **Self**: Personal data only
- **Children**: Parent access to child data

### 3. Data Ownership Rules
- Users can always read their own profile data
- Parents can read their children's academic data
- Teachers can manage their assigned classes
- Administrators can manage their scope of responsibility

### 4. Emergency Override
- SUPER_ADMIN can override any permission restriction
- System maintenance operations bypass normal permission checks
- Audit logs track all permission overrides

## Implementation Notes

### 1. Permission Checking Order
1. Check explicit role-permission assignment
2. Check scoped permission assignment
3. Check role hierarchy inheritance
4. Deny access if no permission found

### 2. Caching Strategy
- Cache frequently checked permissions
- Invalidate cache on permission changes
- Use Redis for distributed caching

### 3. Audit Requirements
- Log all permission checks
- Track permission changes
- Monitor failed access attempts
- Generate compliance reports

This permissions matrix ensures proper access control while maintaining flexibility for the educational platform's diverse user base and organizational structure. 
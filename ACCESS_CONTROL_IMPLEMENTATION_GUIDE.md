# Rule-Based Access Control Implementation Guide

## Overview

This guide shows how the simple rule-based access control is implemented and used to filter access throughout the application, including frontend integration.

## 🏗️ Backend Implementation

### 1. **Core Access Control Flow**

```java
// Main access method - called everywhere access needs to be checked
@Cacheable(value = "accessControl", key = "#userId + '_' + #targetScope + '_' + #targetScopeId")
public boolean hasAccess(Long userId, AccessScope targetScope, Long targetScopeId) {
    User user = userRepository.findById(userId);
    
    return switch (user.getRole()) {
        case SUPER_ADMIN -> true; // Global access
        case TEACHER -> isTeacherAssignedToClass(userId, targetScopeId);
        case STUDENT -> isStudentInClass(userId, targetScopeId); 
        case SCHOOL_ADMIN -> user.getSchool().getId().equals(targetScopeId);
        case PARENT -> user.getChildren().stream()
            .anyMatch(child -> isStudentInClass(child.getId(), targetScopeId));
        default -> false;
    };
}
```

### 2. **Integration in Existing Controllers**

Add access control to any controller by injecting the service:

```java
@RestController
@RequestMapping("/api/classes")
public class ClassController extends BaseController {

    @Autowired
    private RuleBasedAccessControlServiceImpl accessControlService;
    
    @Autowired  
    private ClassService classService;

    @GetMapping("/{classId}")
    public ResponseEntity<OhmaApiResponse<ClassDTO>> getClass(@PathVariable Long classId) {
        try {
            // Get current user from security context
            Long currentUserId = getCurrentUserId();
            
            // Check access before processing
            if (!accessControlService.hasAccess(currentUserId, AccessScope.CLASS, classId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(OhmaApiResponse.error(403, "Access denied to this class"));
            }
            
            ClassDTO classData = classService.getClassById(classId);
            return ResponseEntity.ok(OhmaApiResponse.success(classData));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Error retrieving class: " + e.getMessage()));
        }
    }

    @GetMapping("/my-classes")
    public ResponseEntity<OhmaApiResponse<List<ClassDTO>>> getMyClasses() {
        try {
            Long currentUserId = getCurrentUserId();
            
            // Get all class IDs user has access to
            List<Long> accessibleClassIds = accessControlService
                .getAccessibleScopeIds(currentUserId, AccessScope.CLASS);
            
            List<ClassDTO> myClasses = classService.getClassesByIds(accessibleClassIds);
            return ResponseEntity.ok(OhmaApiResponse.success(myClasses));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Error retrieving classes: " + e.getMessage()));
        }
    }
}
```

### 3. **Service Layer Integration**

Add access filtering in service methods:

```java
@Service
@Transactional
public class GradeServiceImpl extends BaseServiceImpl<Grade> implements GradeService {

    @Autowired
    private RuleBasedAccessControlServiceImpl accessControlService;

    public List<GradeDTO> getStudentGrades(Long studentId, Long requestingUserId) {
        // Check if requesting user can access this student's data
        if (!accessControlService.hasAccess(requestingUserId, AccessScope.USER, studentId)) {
            throw new SecurityException("Access denied to student grades");
        }
        
        return gradeRepository.findByStudentId(studentId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public void saveGrade(GradeDTO gradeDTO, Long teacherId) {
        // Check if teacher can access the class
        if (!accessControlService.hasAccess(teacherId, AccessScope.CLASS, gradeDTO.getClassId())) {
            throw new SecurityException("Teacher cannot assign grades to this class");
        }
        
        // Check if teacher can access the student
        if (!accessControlService.hasAccess(teacherId, AccessScope.USER, gradeDTO.getStudentId())) {
            throw new SecurityException("Teacher cannot assign grades to this student");
        }
        
        Grade grade = convertToEntity(gradeDTO);
        gradeRepository.save(grade);
    }
}
```

### 4. **Annotation-Based Access Control** (Optional Enhancement)

Create custom annotations for easier integration:

```java
// Custom annotation
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresAccess {
    AccessScope scope();
    String scopeIdParam(); // Parameter name containing scope ID
}

// Usage in controllers
@RestController
public class StudentController {

    @GetMapping("/students/{studentId}/grades")
    @RequiresAccess(scope = AccessScope.USER, scopeIdParam = "studentId")
    public ResponseEntity<List<GradeDTO>> getStudentGrades(@PathVariable Long studentId) {
        // Access is automatically checked by aspect
        return ResponseEntity.ok(gradeService.getGradesByStudentId(studentId));
    }
}

// Aspect implementation
@Aspect
@Component
public class AccessControlAspect {
    
    @Autowired
    private RuleBasedAccessControlServiceImpl accessControlService;
    
    @Around("@annotation(requiresAccess)")
    public Object checkAccess(ProceedingJoinPoint joinPoint, RequiresAccess requiresAccess) throws Throwable {
        Long currentUserId = getCurrentUserId();
        Long scopeId = extractScopeId(joinPoint, requiresAccess.scopeIdParam());
        
        if (!accessControlService.hasAccess(currentUserId, requiresAccess.scope(), scopeId)) {
            throw new SecurityException("Access denied");
        }
        
        return joinPoint.proceed();
    }
}
```

## 🌐 Frontend Implementation

### 1. **Access Control Service**

Create a frontend service to interact with the backend:

```typescript
// services/accessControlService.ts
class AccessControlService {
  private baseUrl = '/api/rule-based-access';
  
  async checkAccess(targetScope: string, targetScopeId: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/check-access?userId=${this.getCurrentUserId()}&targetScope=${targetScope}&targetScopeId=${targetScopeId}`
      );
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Access check failed:', error);
      return false; // Fail closed - deny access on error
    }
  }

  async getAccessibleScopes(scopeType: string): Promise<number[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/accessible-scopes?userId=${this.getCurrentUserId()}&scopeType=${scopeType}`
      );
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to get accessible scopes:', error);
      return [];
    }
  }

  async canPerformAction(targetScope: string, targetScopeId: number, action: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/can-perform-action?userId=${this.getCurrentUserId()}&targetScope=${targetScope}&targetScopeId=${targetScopeId}&action=${action}`
      );
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Action permission check failed:', error);
      return false;
    }
  }

  private getCurrentUserId(): number {
    // Get from authentication context/JWT token
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr).id : null;
  }
}

export const accessControlService = new AccessControlService();
```

### 2. **React Hooks for Access Control**

```typescript
// hooks/useAccessControl.ts
import { useState, useEffect } from 'react';
import { accessControlService } from '../services/accessControlService';

export const useAccessControl = (targetScope: string, targetScopeId?: number) => {
  const [permissions, setPermissions] = useState({
    canRead: false,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    loading: true
  });

  useEffect(() => {
    const checkPermissions = async () => {
      if (!targetScopeId) {
        setPermissions(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const [canRead, canCreate, canUpdate, canDelete] = await Promise.all([
          accessControlService.canPerformAction(targetScope, targetScopeId, 'READ'),
          accessControlService.canPerformAction(targetScope, targetScopeId, 'CREATE'),
          accessControlService.canPerformAction(targetScope, targetScopeId, 'UPDATE'),
          accessControlService.canPerformAction(targetScope, targetScopeId, 'DELETE')
        ]);

        setPermissions({
          canRead,
          canCreate, 
          canUpdate,
          canDelete,
          loading: false
        });
      } catch (error) {
        console.error('Error checking permissions:', error);
        setPermissions({
          canRead: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          loading: false
        });
      }
    };

    checkPermissions();
  }, [targetScope, targetScopeId]);

  return permissions;
};

// Hook to get accessible scope IDs
export const useAccessibleScopes = (scopeType: string) => {
  const [accessibleIds, setAccessibleIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccessibleScopes = async () => {
      try {
        const ids = await accessControlService.getAccessibleScopes(scopeType);
        setAccessibleIds(ids);
      } catch (error) {
        console.error('Error loading accessible scopes:', error);
        setAccessibleIds([]);
      } finally {
        setLoading(false);
      }
    };

    loadAccessibleScopes();
  }, [scopeType]);

  return { accessibleIds, loading };
};
```

### 3. **Protected Components**

```typescript
// components/ProtectedComponent.tsx
import React from 'react';
import { useAccessControl } from '../hooks/useAccessControl';

interface ProtectedComponentProps {
  children: React.ReactNode;
  targetScope: string;
  targetScopeId: number;
  action?: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE';
  fallback?: React.ReactNode;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  targetScope,
  targetScopeId,
  action = 'READ',
  fallback = <div>Access Denied</div>
}) => {
  const permissions = useAccessControl(targetScope, targetScopeId);

  if (permissions.loading) {
    return <div>Loading...</div>;
  }

  const hasPermission = (() => {
    switch (action) {
      case 'READ': return permissions.canRead;
      case 'CREATE': return permissions.canCreate;
      case 'UPDATE': return permissions.canUpdate;
      case 'DELETE': return permissions.canDelete;
      default: return false;
    }
  })();

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

// Usage example
export const ClassDashboard: React.FC<{ classId: number }> = ({ classId }) => {
  return (
    <div>
      <h1>Class Dashboard</h1>
      
      {/* Only show if user can read class data */}
      <ProtectedComponent targetScope="CLASS" targetScopeId={classId} action="READ">
        <ClassInfo classId={classId} />
      </ProtectedComponent>

      {/* Only show if user can create assignments */}
      <ProtectedComponent targetScope="CLASS" targetScopeId={classId} action="CREATE">
        <CreateAssignmentButton classId={classId} />
      </ProtectedComponent>

      {/* Only show if user can update class */}
      <ProtectedComponent targetScope="CLASS" targetScopeId={classId} action="UPDATE">
        <EditClassButton classId={classId} />
      </ProtectedComponent>
    </div>
  );
};
```

### 4. **Data Filtering in Lists**

```typescript
// components/ClassList.tsx
import React, { useState, useEffect } from 'react';
import { useAccessibleScopes } from '../hooks/useAccessControl';

export const ClassList: React.FC = () => {
  const { accessibleIds: accessibleClassIds, loading } = useAccessibleScopes('CLASS');
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  useEffect(() => {
    const loadClasses = async () => {
      if (accessibleClassIds.length === 0) return;

      try {
        // Only fetch classes user has access to
        const response = await fetch('/api/classes/by-ids', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: accessibleClassIds })
        });
        const result = await response.json();
        setClasses(result.data);
      } catch (error) {
        console.error('Error loading classes:', error);
      }
    };

    loadClasses();
  }, [accessibleClassIds]);

  if (loading) return <div>Loading classes...</div>;

  return (
    <div>
      <h2>My Classes</h2>
      {classes.length === 0 ? (
        <p>No classes available</p>
      ) : (
        <ul>
          {classes.map(cls => (
            <li key={cls.id}>
              <ClassCard classInfo={cls} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### 5. **Route Protection**

```typescript
// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAccessControl } from '../hooks/useAccessControl';

interface ProtectedRouteProps {
  children: React.ReactNode;
  targetScope: string;
  targetScopeId: number;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  targetScope,
  targetScopeId,
  redirectTo = '/access-denied'
}) => {
  const { canRead, loading } = useAccessControl(targetScope, targetScopeId);

  if (loading) {
    return <div>Checking permissions...</div>;
  }

  return canRead ? <>{children}</> : <Navigate to={redirectTo} replace />;
};

// Usage in router
import { Routes, Route } from 'react-router-dom';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/classes/:classId" element={
        <ProtectedRoute 
          targetScope="CLASS" 
          targetScopeId={parseInt(useParams().classId)}
        >
          <ClassDetailPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
};
```

## 🔧 Practical Usage Examples

### Example 1: Teacher Viewing Student List

**Backend Flow:**
1. Teacher requests `/api/classes/123/students`
2. Controller checks `accessControlService.hasAccess(teacherId, CLASS, 123)`
3. If teacher is assigned to class → returns student list
4. If not assigned → returns 403 Forbidden

**Frontend Flow:**
1. `useAccessControl('CLASS', 123)` checks permissions
2. If `canRead = true` → show student list
3. If `canRead = false` → show "Access Denied" message

### Example 2: Parent Viewing Child's Grades

**Backend Flow:**
1. Parent requests `/api/students/456/grades`  
2. Controller checks `accessControlService.hasAccess(parentId, USER, 456)`
3. Rule checks if student 456 is in parent's children list
4. If yes → returns grades, if no → returns 403

**Frontend Flow:**
1. Parent navigates to child's profile
2. `ProtectedComponent` with `targetScope="USER"` and `targetScopeId={456}`
3. Only shows grades section if access is granted

### Example 3: School Admin Managing Classes

**Backend Flow:**
1. Admin requests `/api/classes/my-classes`
2. Service calls `getAccessibleScopeIds(adminId, CLASS)`
3. Returns all class IDs in admin's school
4. Fetches and returns class data for those IDs

**Frontend Flow:**
1. `useAccessibleScopes('CLASS')` gets accessible class IDs
2. Component automatically filters to show only accessible classes
3. Admin sees only classes in their school

## 🚀 Implementation Steps

### Backend Tasks:
1. ✅ **Core service implemented** - `RuleBasedAccessControlServiceImpl`
2. ✅ **REST APIs created** - Access control endpoints
3. **Add to existing controllers** - Inject access control service
4. **Update service methods** - Add permission checks
5. **Test access rules** - Verify role-based access works

### Frontend Tasks:
1. **Create access control service** - API integration
2. **Build React hooks** - `useAccessControl`, `useAccessibleScopes`
3. **Create protected components** - `ProtectedComponent`, `ProtectedRoute`
4. **Update existing components** - Add permission checks
5. **Filter data in lists** - Show only accessible items
6. **Test user flows** - Verify access control works in UI

### Configuration:
1. **Enable caching** - Redis/in-memory cache for access control
2. **Security headers** - CORS, authentication middleware
3. **Error handling** - Consistent error responses
4. **Logging** - Access control audit trail

The rule-based approach makes access control implementation straightforward - you just check permissions before showing UI elements or processing API requests, with simple service calls that return boolean results! 
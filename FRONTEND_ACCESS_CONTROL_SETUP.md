# Frontend Access Control Integration Guide

## Overview
This guide shows how to integrate the rule-based access control system with your React frontend. The system provides efficient, rule-based permissions checking without complex database queries.

## 1. API Service Layer

### Create Access Control Service (`src/services/accessControlService.ts`)

```typescript
import axios, { AxiosResponse } from 'axios';

export interface AccessCheck {
  key: string;
  scope: string;
  scopeId: number;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  errors?: any;
}

class AccessControlService {
  private baseURL = '/api/access-control-demo';

  /**
   * Check if current user has access to a specific scope
   */
  async hasAccess(targetScope: string, targetScopeId: number): Promise<boolean> {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await axios.get(
        `${this.baseURL}/check-access`,
        { params: { targetScope, targetScopeId } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Access check failed:', error);
      return false; // Deny access on error
    }
  }

  /**
   * Check multiple access permissions at once
   */
  async checkMultipleAccess(checks: AccessCheck[]): Promise<Record<string, boolean>> {
    try {
      const response: AxiosResponse<ApiResponse<Record<string, boolean>>> = await axios.post(
        `${this.baseURL}/check-multiple-access`,
        { checks }
      );
      return response.data.data;
    } catch (error) {
      console.error('Multiple access check failed:', error);
      return {}; // Return empty object on error
    }
  }

  /**
   * Get all class IDs the current user can access
   */
  async getAccessibleClasses(): Promise<number[]> {
    try {
      const response: AxiosResponse<ApiResponse<number[]>> = await axios.get(
        `${this.baseURL}/accessible-classes`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to get accessible classes:', error);
      return [];
    }
  }

  /**
   * Get user profile with access information
   */
  async getUserProfile(): Promise<any> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await axios.get(
        `${this.baseURL}/user-profile`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  /**
   * Get grades for a specific student (with access control)
   */
  async getStudentGrades(studentId: number): Promise<any[]> {
    try {
      const response: AxiosResponse<ApiResponse<any[]>> = await axios.get(
        `${this.baseURL}/grades/student/${studentId}`
      );
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied: You cannot view this student\'s grades');
      }
      throw error;
    }
  }

  /**
   * Create grade for a student in a class (with access control)
   */
  async createGrade(classId: number, studentId: number, gradeData: any): Promise<any> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await axios.post(
        `${this.baseURL}/grades/class/${classId}/student/${studentId}`,
        gradeData
      );
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied: You cannot modify grades for this class/student');
      }
      throw error;
    }
  }
}

export default new AccessControlService();
```

## 2. React Hooks

### Create Access Control Hooks (`src/hooks/useAccessControl.ts`)

```typescript
import { useState, useEffect, useCallback } from 'react';
import accessControlService, { AccessCheck } from '../services/accessControlService';

/**
 * Hook for checking single access permission
 */
export const useAccessControl = (targetScope: string, targetScopeId: number) => {
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setLoading(true);
        setError(null);
        const access = await accessControlService.hasAccess(targetScope, targetScopeId);
        setHasAccess(access);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Access check failed');
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (targetScope && targetScopeId) {
      checkAccess();
    }
  }, [targetScope, targetScopeId]);

  return { hasAccess, loading, error };
};

/**
 * Hook for checking multiple access permissions
 */
export const useMultipleAccessControl = (checks: AccessCheck[]) => {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkMultipleAccess = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await accessControlService.checkMultipleAccess(checks);
        setPermissions(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Multiple access check failed');
        setPermissions({});
      } finally {
        setLoading(false);
      }
    };

    if (checks.length > 0) {
      checkMultipleAccess();
    }
  }, [checks]);

  return { permissions, loading, error };
};

/**
 * Hook for getting accessible scope IDs
 */
export const useAccessibleScopes = () => {
  const [accessibleClasses, setAccessibleClasses] = useState<number[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAccess = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [classes, profile] = await Promise.all([
        accessControlService.getAccessibleClasses(),
        accessControlService.getUserProfile()
      ]);
      
      setAccessibleClasses(classes);
      setUserProfile(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load access information');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAccess();
  }, [refreshAccess]);

  return { 
    accessibleClasses, 
    userProfile, 
    loading, 
    error, 
    refreshAccess 
  };
};
```

## 3. Protected Components

### Access Control Wrapper (`src/components/AccessControl/ProtectedComponent.tsx`)

```tsx
import React from 'react';
import { useAccessControl } from '../../hooks/useAccessControl';

interface ProtectedComponentProps {
  targetScope: string;
  targetScopeId: number;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  targetScope,
  targetScopeId,
  children,
  fallback = <div className="text-red-500">Access Denied</div>,
  loadingComponent = <div className="text-gray-500">Checking permissions...</div>
}) => {
  const { hasAccess, loading, error } = useAccessControl(targetScope, targetScopeId);

  if (loading) {
    return <>{loadingComponent}</>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ProtectedComponent;
```

### Conditional Button (`src/components/AccessControl/ConditionalButton.tsx`)

```tsx
import React from 'react';
import { useAccessControl } from '../../hooks/useAccessControl';

interface ConditionalButtonProps {
  targetScope: string;
  targetScopeId: number;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const ConditionalButton: React.FC<ConditionalButtonProps> = ({
  targetScope,
  targetScopeId,
  onClick,
  children,
  className = '',
  disabled = false
}) => {
  const { hasAccess, loading } = useAccessControl(targetScope, targetScopeId);

  if (!hasAccess || loading) {
    return null; // Don't render button if no access
  }

  return (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ConditionalButton;
```

## 4. Example Implementations

### Student Grades Component (`src/components/Grades/StudentGrades.tsx`)

```tsx
import React, { useState, useEffect } from 'react';
import accessControlService from '../../services/accessControlService';
import ProtectedComponent from '../AccessControl/ProtectedComponent';

interface StudentGradesProps {
  studentId: number;
}

const StudentGrades: React.FC<StudentGradesProps> = ({ studentId }) => {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGrades = async () => {
    try {
      setLoading(true);
      setError(null);
      const studentGrades = await accessControlService.getStudentGrades(studentId);
      setGrades(studentGrades);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load grades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrades();
  }, [studentId]);

  return (
    <ProtectedComponent
      targetScope="USER"
      targetScopeId={studentId}
      fallback={<div className="text-red-500">You don't have permission to view this student's grades</div>}
    >
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Student Grades</h3>
        
        {loading && <div className="text-gray-500">Loading grades...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        
        {!loading && !error && (
          <div className="space-y-2">
            {grades.length === 0 ? (
              <div className="text-gray-500">No grades available</div>
            ) : (
              grades.map((grade, index) => (
                <div key={index} className="border p-3 rounded">
                  <div className="font-medium">{grade.subject}</div>
                  <div className="text-sm text-gray-600">Score: {grade.score}%</div>
                  <div className="text-xs text-gray-500">Date: {grade.date}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </ProtectedComponent>
  );
};

export default StudentGrades;
```

### Class Management Component (`src/components/Classes/ClassManager.tsx`)

```tsx
import React from 'react';
import { useAccessibleScopes } from '../../hooks/useAccessControl';
import ConditionalButton from '../AccessControl/ConditionalButton';

const ClassManager: React.FC = () => {
  const { accessibleClasses, userProfile, loading } = useAccessibleScopes();

  const handleCreateGrade = (classId: number) => {
    // Implementation for creating grade
    console.log('Creating grade for class:', classId);
  };

  const handleViewStatistics = (classId: number) => {
    // Implementation for viewing statistics
    console.log('Viewing statistics for class:', classId);
  };

  if (loading) {
    return <div className="text-gray-500">Loading classes...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">My Classes</h3>
      
      <div className="grid gap-4">
        {accessibleClasses.map(classId => (
          <div key={classId} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Class {classId}</h4>
                <p className="text-sm text-gray-600">Grade management available</p>
              </div>
              
              <div className="space-x-2">
                <ConditionalButton
                  targetScope="CLASS"
                  targetScopeId={classId}
                  onClick={() => handleCreateGrade(classId)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Add Grade
                </ConditionalButton>
                
                <ConditionalButton
                  targetScope="CLASS"
                  targetScopeId={classId}
                  onClick={() => handleViewStatistics(classId)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  Statistics
                </ConditionalButton>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {accessibleClasses.length === 0 && (
        <div className="text-gray-500 text-center py-8">
          No classes available for grade management
        </div>
      )}
    </div>
  );
};

export default ClassManager;
```

## 5. Usage Examples

### In Your App Component

```tsx
import React from 'react';
import StudentGrades from './components/Grades/StudentGrades';
import ClassManager from './components/Classes/ClassManager';
import ProtectedComponent from './components/AccessControl/ProtectedComponent';

const App: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Grade Management System</h1>
      
      {/* Show class manager only to teachers/admins */}
      <ProtectedComponent
        targetScope="CLASS"
        targetScopeId={1} // Example class ID
        fallback={null} // Don't show anything if no access
      >
        <ClassManager />
      </ProtectedComponent>
      
      {/* Show student grades with permission checking */}
      <StudentGrades studentId={123} />
      
      {/* Admin-only section */}
      <ProtectedComponent
        targetScope="SCHOOL"
        targetScopeId={1}
        fallback={<div>Administrative features not available</div>}
      >
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold">Administrative Panel</h2>
          <p>School-wide management features go here</p>
        </div>
      </ProtectedComponent>
    </div>
  );
};

export default App;
```

## 6. Implementation Notes

### Performance Optimizations
1. **Caching**: The backend uses `@Cacheable` annotations for fast permission checking
2. **Batch Requests**: Use `checkMultipleAccess` for checking many permissions at once
3. **Component Memoization**: Consider using `React.memo` for protected components

### Error Handling
1. **Graceful Degradation**: Always provide fallback UI for access denied scenarios
2. **Loading States**: Show appropriate loading indicators during permission checks
3. **Network Errors**: Handle API failures gracefully, defaulting to access denied

### Security Considerations
1. **Never Trust Frontend**: Always verify permissions on the backend
2. **Sensitive Data**: Don't expose sensitive information in error messages
3. **Token Management**: Ensure JWT tokens are properly managed and refreshed

### Development Workflow
1. Add access control to new features incrementally
2. Test with different user roles during development
3. Use browser dev tools to test different permission scenarios

## 7. Testing

### Unit Tests Example

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useAccessControl } from '../hooks/useAccessControl';
import accessControlService from '../services/accessControlService';

jest.mock('../services/accessControlService');

describe('useAccessControl', () => {
  it('should return true when user has access', async () => {
    (accessControlService.hasAccess as jest.Mock).mockResolvedValue(true);
    
    const { result, waitForNextUpdate } = renderHook(() =>
      useAccessControl('CLASS', 1)
    );
    
    await waitForNextUpdate();
    
    expect(result.current.hasAccess).toBe(true);
    expect(result.current.loading).toBe(false);
  });
});
```

This frontend implementation provides a complete, production-ready access control system that seamlessly integrates with the rule-based backend system. 
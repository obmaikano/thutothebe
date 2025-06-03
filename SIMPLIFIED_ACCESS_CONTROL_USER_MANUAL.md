# Simplified Rule-Based Access Control System - User Manual

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [User Roles and Access Patterns](#user-roles-and-access-patterns)
4. [API Reference](#api-reference)
5. [Frontend Integration](#frontend-integration)
6. [Configuration Management](#configuration-management)
7. [Usage Examples](#usage-examples)
8. [Best Practices](#best-practices)

## Overview

The Simplified Rule-Based Access Control System provides **faux multi-tenant** architecture using business rules derived from existing organizational relationships. This approach eliminates complex database tables while providing comprehensive access control.

### Key Benefits
- **No additional database tables** - Uses existing User, School, Region relationships
- **Simple business logic** - All access rules coded and version controlled
- **High performance** - Direct FK lookups with caching
- **Easy maintenance** - Clear, testable business rules

### Core Principle
Access is determined by:
1. **User's role** (`SUPER_ADMIN`, `TEACHER`, `STUDENT`, etc.)
2. **Organizational relationships** (school assignment, parent-child links)
3. **Hierarchical business rules** (coded in services)

## System Architecture

### Rule-Based Services

#### 1. RuleBasedAccessControlService
- **Purpose**: Determines user access to scopes and resources
- **Method**: `hasAccess(userId, targetScope, targetScopeId)` 
- **Caching**: `@Cacheable` for performance

#### 2. RuleBasedConfigurationService  
- **Purpose**: Hierarchical configuration resolution
- **Pattern**: USER → CLASS → SCHOOL → REGION → GLOBAL
- **Features**: Type-safe getters (Integer, Boolean, Double)

### Organizational Hierarchy
```
GLOBAL (System-wide)
  └── REGION (Provincial/State)
      └── SCHOOL (Institution)
          ├── DEPARTMENT (Academic divisions)
          └── CLASS (Individual classes)
              └── USER (Individual access)
```

## User Roles and Access Patterns

### 1. Administrative Roles

#### SUPER_ADMIN / MINISTRY_EXECUTIVE
```java
// Global access to everything
return true; // No restrictions
```

#### MINISTRY_STAFF
```java
// Can access all scopes except individual users
return targetScope != AccessScope.USER;
```

#### REGIONAL_ADMIN / REGIONAL_OFFICER
```java
// Can access anything in their region
Long userRegionId = user.getSchool().getRegion().getId();
switch (targetScope) {
    case REGION -> targetScopeId.equals(userRegionId);
    case SCHOOL -> isSchoolInRegion(targetScopeId, userRegionId);
    case CLASS -> isClassInRegion(targetScopeId, userRegionId);
    case USER -> isUserInRegion(targetScopeId, userRegionId);
}
```

### 2. Educational Institution Roles

#### SCHOOL_ADMIN / SCHOOL_HEAD
```java
// Can access anything in their school
Long userSchoolId = user.getSchool().getId();
switch (targetScope) {
    case SCHOOL -> targetScopeId.equals(userSchoolId);
    case CLASS -> isClassInSchool(targetScopeId, userSchoolId);
    case USER -> isUserInSchool(targetScopeId, userSchoolId);
}
```

#### TEACHER / SENIOR_TEACHER
```java
switch (targetScope) {
    case CLASS -> isTeacherAssignedToClass(userId, targetScopeId);
    case USER -> {
        if (targetScopeId.equals(userId)) return true; // Self access
        return isStudentInTeacherClass(userId, targetScopeId);
    }
}
```

### 3. Learning Community Roles

#### STUDENT
```java
switch (targetScope) {
    case CLASS -> isStudentEnrolledInClass(userId, targetScopeId);
    case USER -> {
        if (targetScopeId.equals(userId)) return true; // Self access
        return areInSameClass(userId, targetScopeId);
    }
}
```

#### PARENT
```java
List<Long> childrenIds = user.getChildren(); // Uses existing relationship
switch (targetScope) {
    case USER -> childrenIds.contains(targetScopeId);
    case CLASS -> childrenIds.stream().anyMatch(child -> 
        isStudentInClass(child, targetScopeId));
    case SCHOOL -> childrenIds.stream().anyMatch(child -> 
        isUserInSchool(child, targetScopeId));
}
```

## API Reference

### Access Control APIs

#### Check User Access
```http
GET /api/rule-based-access/check-access
  ?userId=123
  &targetScope=SCHOOL
  &targetScopeId=456

Response: { "success": true, "data": true }
```

#### Get Accessible Scopes
```http
GET /api/rule-based-access/accessible-scopes
  ?userId=123
  &scopeType=CLASS

Response: { "success": true, "data": [101, 102, 103] }
```

#### Check Action Permission
```http
GET /api/rule-based-access/can-perform-action
  ?userId=123
  &targetScope=CLASS
  &targetScopeId=456
  &action=CREATE

Response: { "success": true, "data": false }
```

#### Get User's Primary Scope
```http
GET /api/rule-based-access/primary-scope/123

Response: {
  "success": true,
  "data": {
    "scopeType": "SCHOOL",
    "scopeId": 456,
    "scopeName": "Lincoln High School"
  }
}
```

### Configuration APIs

#### Get Configuration (with hierarchy)
```http
GET /api/rule-based-config/get
  ?configKey=max_class_size
  &userId=123

Response: { "success": true, "data": "30" }
```

#### Set Configuration
```http
POST /api/rule-based-config/set
Content-Type: application/json

{
  "configKey": "max_class_size",
  "configValue": "25",
  "scopeType": "SCHOOL",
  "scopeId": 456,
  "userId": 123
}
```

#### Get Common Frontend Configs
```http
GET /api/rule-based-config/common/123

Response: {
  "success": true,
  "data": {
    "maxClassSize": 30,
    "sessionTimeoutMinutes": 30,
    "allowParentMessaging": true,
    "defaultLanguage": "en",
    "maintenanceMode": false
  }
}
```

## Frontend Integration

### 1. React/TypeScript Service

```typescript
// accessControlService.ts
class AccessControlService {
  private baseUrl = '/api/rule-based-access';

  async checkAccess(targetScope: string, targetScopeId: number): Promise<boolean> {
    const userId = this.getCurrentUserId();
    const response = await fetch(
      `${this.baseUrl}/check-access?userId=${userId}&targetScope=${targetScope}&targetScopeId=${targetScopeId}`
    );
    const result = await response.json();
    return result.data;
  }

  async getAccessibleScopes(scopeType: string): Promise<number[]> {
    const userId = this.getCurrentUserId();
    const response = await fetch(
      `${this.baseUrl}/accessible-scopes?userId=${userId}&scopeType=${scopeType}`
    );
    const result = await response.json();
    return result.data;
  }

  async canPerformAction(targetScope: string, targetScopeId: number, action: string): Promise<boolean> {
    const userId = this.getCurrentUserId();
    const response = await fetch(
      `${this.baseUrl}/can-perform-action?userId=${userId}&targetScope=${targetScope}&targetScopeId=${targetScopeId}&action=${action}`
    );
    const result = await response.json();
    return result.data;
  }

  private getCurrentUserId(): number {
    // Get from authentication context
    return 123; // Placeholder
  }
}

export const accessControlService = new AccessControlService();
```

### 2. Configuration Service

```typescript
// configurationService.ts
class ConfigurationService {
  private baseUrl = '/api/rule-based-config';

  async getConfig(key: string): Promise<string | null> {
    const userId = this.getCurrentUserId();
    const response = await fetch(`${this.baseUrl}/get?configKey=${key}&userId=${userId}`);
    const result = await response.json();
    return result.data;
  }

  async getIntConfig(key: string, defaultValue: number = 0): Promise<number> {
    const userId = this.getCurrentUserId();
    const response = await fetch(`${this.baseUrl}/get-int?configKey=${key}&userId=${userId}&defaultValue=${defaultValue}`);
    const result = await response.json();
    return result.data;
  }

  async getBoolConfig(key: string, defaultValue: boolean = false): Promise<boolean> {
    const userId = this.getCurrentUserId();
    const response = await fetch(`${this.baseUrl}/get-bool?configKey=${key}&userId=${userId}&defaultValue=${defaultValue}`);
    const result = await response.json();
    return result.data;
  }

  async getCommonConfigs(): Promise<CommonConfig> {
    const userId = this.getCurrentUserId();
    const response = await fetch(`${this.baseUrl}/common/${userId}`);
    const result = await response.json();
    return result.data;
  }

  private getCurrentUserId(): number {
    return 123; // Get from auth context
  }
}

interface CommonConfig {
  maxClassSize: number;
  sessionTimeoutMinutes: number;
  allowParentMessaging: boolean;
  defaultLanguage: string;
  maintenanceMode: boolean;
}

export const configurationService = new ConfigurationService();
```

### 3. React Hooks

```typescript
// useAccessControl.ts
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
      if (!targetScopeId) return;

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
        setPermissions(prev => ({ ...prev, loading: false }));
      }
    };

    checkPermissions();
  }, [targetScope, targetScopeId]);

  return permissions;
};

// useConfiguration.ts
import { useState, useEffect } from 'react';
import { configurationService } from '../services/configurationService';

export const useConfiguration = () => {
  const [config, setConfig] = useState<CommonConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const commonConfig = await configurationService.getCommonConfigs();
        setConfig(commonConfig);
      } catch (error) {
        console.error('Error loading configuration:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, loading };
};
```

## Configuration Management

### Hierarchical Resolution

Configuration values are resolved in this order:
1. **USER** - User-specific overrides
2. **CLASS** - Class-level settings  
3. **SCHOOL** - School-level settings
4. **REGION** - Regional policies
5. **GLOBAL** - System defaults

### Example Configuration Flow

```java
// User 123 is a student at School 5 in Region 2
getConfigurationValue("max_class_size", 123)

// Checks in order:
// 1. USER:123:max_class_size → null
// 2. CLASS:201:max_class_size → null  
// 3. SCHOOL:5:max_class_size → "25"
// 4. Returns "25" (school override)

// If school had no override:
// 4. REGION:2:max_class_size → "30"
// 5. GLOBAL:max_class_size → "35"
```

### Default Configurations

```java
// System initializes with:
GLOBAL:max_class_size = "35"
GLOBAL:session_timeout_minutes = "30" 
GLOBAL:allow_parent_messaging = "true"
GLOBAL:default_language = "en"
GLOBAL:maintenance_mode = "false"

// Regional overrides
REGION:1:max_class_size = "30"
REGION:2:default_language = "af"

// School overrides  
SCHOOL:1:max_class_size = "25"
SCHOOL:1:allow_parent_messaging = "false"
```

## Usage Examples

### Example 1: Teacher Dashboard

```typescript
// TeacherDashboard.tsx
import React from 'react';
import { useAccessControl, useConfiguration } from '../hooks';

export const TeacherDashboard: React.FC = () => {
  const { config } = useConfiguration();
  const classPermissions = useAccessControl('CLASS');

  return (
    <div className="teacher-dashboard">
      <h1>Teacher Dashboard</h1>
      
      {classPermissions.canRead && (
        <section>
          <h2>My Classes</h2>
          <p>Maximum class size: {config?.maxClassSize}</p>
          {/* Show classes teacher has access to */}
        </section>
      )}

      {classPermissions.canCreate && (
        <section>
          <h2>Create Assignment</h2>
          {/* Assignment creation form */}
        </section>
      )}
    </div>
  );
};
```

### Example 2: School Admin Configuration

```typescript
// SchoolConfigPanel.tsx
import React, { useState } from 'react';
import { configurationService } from '../services';

export const SchoolConfigPanel: React.FC<{ schoolId: number }> = ({ schoolId }) => {
  const [maxClassSize, setMaxClassSize] = useState<number>(35);

  const handleSaveConfig = async () => {
    try {
      await fetch('/api/rule-based-config/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configKey: 'max_class_size',
          configValue: maxClassSize.toString(),
          scopeType: 'SCHOOL',
          scopeId: schoolId,
          userId: getCurrentUserId()
        })
      });
      alert('Configuration saved!');
    } catch (error) {
      alert('Error saving configuration');
    }
  };

  return (
    <div className="config-panel">
      <h2>School Configuration</h2>
      
      <div className="config-item">
        <label>Maximum Class Size:</label>
        <input
          type="number"
          value={maxClassSize}
          onChange={(e) => setMaxClassSize(parseInt(e.target.value))}
        />
        <button onClick={handleSaveConfig}>Save</button>
      </div>
    </div>
  );
};
```

## Best Practices

### 1. Performance Optimization

```java
// Use caching for access control checks
@Cacheable(value = "accessControl", key = "#userId + '_' + #targetScope + '_' + #targetScopeId")
public boolean hasAccess(Long userId, AccessScope targetScope, Long targetScopeId)

// Batch permission checks in frontend
const [readAccess, writeAccess] = await Promise.all([
  accessControlService.canPerformAction('CLASS', classId, 'READ'),
  accessControlService.canPerformAction('CLASS', classId, 'CREATE')
]);
```

### 2. Error Handling

```typescript
// Graceful degradation for access control failures
const ProtectedComponent: React.FC = () => {
  const { canRead, loading } = useAccessControl('CLASS', classId);
  
  if (loading) return <Skeleton />;
  if (!canRead) return <AccessDeniedMessage />;
  
  return <FullContent />;
};
```

### 3. Configuration Defaults

```java
// Always provide sensible defaults
public Integer getIntegerConfiguration(String key, Long userId, Integer defaultValue) {
    String value = getConfigurationValue(key, userId);
    return value != null ? Integer.parseInt(value) : defaultValue;
}
```

### 4. Role-Based UI

```typescript
// Show/hide features based on role
const { user } = useAuth();

return (
  <div>
    {['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(user.role) && (
      <AdminPanel />
    )}
    
    {user.role === 'TEACHER' && (
      <TeacherTools />
    )}
  </div>
);
```

## Migration from Complex System

If migrating from the complex scope assignment system:

### Phase 1: Deploy Rule-Based Logic
1. Deploy new `RuleBasedAccessControlService`
2. Keep old system running in parallel
3. Add feature flags to switch between systems

### Phase 2: Frontend Migration
1. Update frontend to use new APIs
2. Test with rule-based backend
3. Remove old API calls

### Phase 3: Cleanup
1. Remove complex scope assignment tables
2. Remove old service implementations
3. Update documentation

---

*This simplified approach provides 95% of the functionality with 50% of the complexity, making it much easier to understand, maintain, and debug.* 
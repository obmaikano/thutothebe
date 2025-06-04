# Integration Example: Adding Access Control to Existing Features

## Scenario: Student Grades Management

Let's add access control to an existing grades feature. We'll show how teachers can view grades for their classes, students can view their own grades, and parents can view their children's grades.

## 🏗️ Backend Integration

### 1. **Update Existing Controller**

```java
// Before: No access control
@RestController
@RequestMapping("/api/grades")
public class GradeController extends BaseController {

    @Autowired
    private GradeService gradeService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getStudentGrades(@PathVariable Long studentId) {
        List<GradeDTO> grades = gradeService.getGradesByStudentId(studentId);
        return ResponseEntity.ok(OhmaApiResponse.success(grades));
    }
}
```

```java
// After: With access control
@RestController
@RequestMapping("/api/grades")
public class GradeController extends BaseController {

    @Autowired
    private GradeService gradeService;
    
    @Autowired
    private RuleBasedAccessControlServiceImpl accessControlService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getStudentGrades(@PathVariable Long studentId) {
        try {
            Long currentUserId = getCurrentUserId(); // From BaseController
            
            // Check if current user can access this student's grades
            if (!accessControlService.hasAccess(currentUserId, AccessScope.USER, studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(OhmaApiResponse.error(403, "Access denied to student grades"));
            }
            
            List<GradeDTO> grades = gradeService.getGradesByStudentId(studentId);
            return ResponseEntity.ok(OhmaApiResponse.success(grades));
            
        } catch (Exception e) {
            log.error("Error retrieving student grades: studentId={}", studentId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to retrieve grades: " + e.getMessage()));
        }
    }

    @PostMapping("/class/{classId}/student/{studentId}")
    public ResponseEntity<OhmaApiResponse<GradeDTO>> saveGrade(
            @PathVariable Long classId,
            @PathVariable Long studentId,
            @RequestBody GradeDTO gradeDTO) {
        try {
            Long currentUserId = getCurrentUserId();
            
            // Check if current user can modify grades for this class
            if (!accessControlService.hasAccess(currentUserId, AccessScope.CLASS, classId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(OhmaApiResponse.error(403, "Access denied to modify grades for this class"));
            }
            
            // Check if current user can assign grades to this student
            if (!accessControlService.hasAccess(currentUserId, AccessScope.USER, studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(OhmaApiResponse.error(403, "Access denied to assign grades to this student"));
            }
            
            GradeDTO savedGrade = gradeService.saveGrade(gradeDTO);
            return ResponseEntity.ok(OhmaApiResponse.success(savedGrade));
            
        } catch (Exception e) {
            log.error("Error saving grade: classId={}, studentId={}", classId, studentId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to save grade: " + e.getMessage()));
        }
    }

    @GetMapping("/my-grades")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getMyGrades() {
        try {
            Long currentUserId = getCurrentUserId();
            
            // Students can only see their own grades
            // Teachers/admins get grades for students they have access to
            List<GradeDTO> grades = gradeService.getGradesForUser(currentUserId);
            return ResponseEntity.ok(OhmaApiResponse.success(grades));
            
        } catch (Exception e) {
            log.error("Error retrieving user grades: userId={}", getCurrentUserId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to retrieve grades: " + e.getMessage()));
        }
    }
}
```

### 2. **Update Service Layer**

```java
// Before: No access control in service
@Service
public class GradeServiceImpl extends BaseServiceImpl<Grade> implements GradeService {

    public List<GradeDTO> getGradesByStudentId(Long studentId) {
        return gradeRepository.findByStudentId(studentId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
}
```

```java
// After: With access control in service
@Service
public class GradeServiceImpl extends BaseServiceImpl<Grade> implements GradeService {

    @Autowired
    private RuleBasedAccessControlServiceImpl accessControlService;

    public List<GradeDTO> getGradesForUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        return switch (user.getRole()) {
            case STUDENT -> {
                // Students see only their own grades
                yield gradeRepository.findByStudentId(userId)
                    .stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            }
            case TEACHER, SENIOR_TEACHER -> {
                // Teachers see grades for students in their classes
                List<Long> accessibleStudentIds = accessControlService
                    .getAccessibleScopeIds(userId, AccessScope.USER);
                yield gradeRepository.findByStudentIdIn(accessibleStudentIds)
                    .stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            }
            case PARENT -> {
                // Parents see grades for their children
                List<Long> childrenIds = user.getChildren().stream()
                    .map(User::getId)
                    .collect(Collectors.toList());
                yield gradeRepository.findByStudentIdIn(childrenIds)
                    .stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            }
            case SCHOOL_ADMIN, SCHOOL_HEAD -> {
                // School admins see grades for all students in their school
                List<Long> schoolStudentIds = userRepository
                    .findBySchoolIdAndRole(user.getSchool().getId(), UserRole.STUDENT)
                    .stream()
                    .map(User::getId)
                    .collect(Collectors.toList());
                yield gradeRepository.findByStudentIdIn(schoolStudentIds)
                    .stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            }
            default -> Collections.emptyList();
        };
    }
}
```

## 🌐 Frontend Integration

### 1. **Update Existing Component**

```typescript
// Before: No access control
const GradesList: React.FC<{ studentId: number }> = ({ studentId }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const response = await fetch(`/api/grades/student/${studentId}`);
        const result = await response.json();
        setGrades(result.data);
      } catch (error) {
        console.error('Error loading grades:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGrades();
  }, [studentId]);

  if (loading) return <div>Loading grades...</div>;

  return (
    <div>
      <h3>Grades</h3>
      {grades.map(grade => (
        <div key={grade.id}>{grade.subject}: {grade.score}</div>
      ))}
    </div>
  );
};
```

```typescript
// After: With access control
import React, { useState, useEffect } from 'react';
import { useAccessControl } from '../hooks/useAccessControl';

const GradesList: React.FC<{ studentId: number }> = ({ studentId }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if current user can access this student's grades
  const { canRead, loading: permissionLoading } = useAccessControl('USER', studentId);

  useEffect(() => {
    const loadGrades = async () => {
      if (!canRead) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/grades/student/${studentId}`);
        
        if (response.status === 403) {
          setError('Access denied to view grades');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to load grades');
        }

        const result = await response.json();
        setGrades(result.data);
      } catch (error) {
        console.error('Error loading grades:', error);
        setError('Error loading grades');
      } finally {
        setLoading(false);
      }
    };

    if (!permissionLoading) {
      loadGrades();
    }
  }, [studentId, canRead, permissionLoading]);

  if (permissionLoading || loading) {
    return <div>Loading grades...</div>;
  }

  if (!canRead) {
    return <div>You don't have permission to view these grades.</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Grades</h3>
      {grades.length === 0 ? (
        <p>No grades available</p>
      ) : (
        grades.map(grade => (
          <div key={grade.id} className="grade-item">
            <span>{grade.subject}: {grade.score}</span>
            <span className="grade-date">{grade.dateAssigned}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default GradesList;
```

### 2. **Protected Grade Input Component**

```typescript
// Component for teachers to input grades
import React, { useState } from 'react';
import { useAccessControl } from '../hooks/useAccessControl';

interface GradeInputProps {
  classId: number;
  studentId: number;
  onGradeSaved: () => void;
}

const GradeInput: React.FC<GradeInputProps> = ({ classId, studentId, onGradeSaved }) => {
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Check if user can create grades for this class and student
  const classPermissions = useAccessControl('CLASS', classId);
  const studentPermissions = useAccessControl('USER', studentId);

  const canInputGrades = classPermissions.canCreate && studentPermissions.canRead;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canInputGrades) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/grades/class/${classId}/student/${studentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          score: parseFloat(score),
          classId,
          studentId
        })
      });

      if (response.ok) {
        setSubject('');
        setScore('');
        onGradeSaved();
      } else {
        alert('Failed to save grade');
      }
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Error saving grade');
    } finally {
      setSaving(false);
    }
  };

  if (classPermissions.loading || studentPermissions.loading) {
    return <div>Loading permissions...</div>;
  }

  if (!canInputGrades) {
    return null; // Don't show the form if user can't input grades
  }

  return (
    <form onSubmit={handleSubmit} className="grade-input-form">
      <h4>Add Grade</h4>
      <div>
        <label>Subject:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Score:</label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Save Grade'}
      </button>
    </form>
  );
};

export default GradeInput;
```

### 3. **Dashboard with Role-Based Views**

```typescript
// Dashboard that shows different content based on user role and permissions
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibleScopes } from '../hooks/useAccessControl';
import GradesList from './GradesList';
import GradeInput from './GradeInput';

const GradesDashboard: React.FC = () => {
  const { user } = useAuth();
  const { accessibleIds: accessibleClasses } = useAccessibleScopes('CLASS');
  const { accessibleIds: accessibleStudents } = useAccessibleScopes('USER');

  return (
    <div className="grades-dashboard">
      <h2>Grades Dashboard</h2>

      {/* Student View - Own Grades */}
      {user.role === 'STUDENT' && (
        <div className="student-grades">
          <GradesList studentId={user.id} />
        </div>
      )}

      {/* Parent View - Children's Grades */}
      {user.role === 'PARENT' && (
        <div className="parent-grades">
          <h3>Children's Grades</h3>
          {user.children?.map(child => (
            <div key={child.id} className="child-grades">
              <h4>{child.name}</h4>
              <GradesList studentId={child.id} />
            </div>
          ))}
        </div>
      )}

      {/* Teacher View - Class Grades */}
      {['TEACHER', 'SENIOR_TEACHER'].includes(user.role) && (
        <div className="teacher-grades">
          <h3>My Classes</h3>
          {accessibleClasses.map(classId => (
            <div key={classId} className="class-grades">
              <ClassGradesSection 
                classId={classId} 
                canInputGrades={true}
              />
            </div>
          ))}
        </div>
      )}

      {/* Admin View - School Overview */}
      {['SCHOOL_ADMIN', 'SCHOOL_HEAD'].includes(user.role) && (
        <div className="admin-grades">
          <h3>School Grades Overview</h3>
          <GradesOverview 
            accessibleClasses={accessibleClasses}
            accessibleStudents={accessibleStudents}
          />
        </div>
      )}
    </div>
  );
};

// Helper component for class grades section
const ClassGradesSection: React.FC<{ classId: number; canInputGrades: boolean }> = ({ 
  classId, 
  canInputGrades 
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const { accessibleIds: classStudents } = useAccessibleScopes('USER');

  return (
    <div className="class-grades-section">
      <h4>Class {classId}</h4>
      
      <div className="students-list">
        {classStudents.map(studentId => (
          <div key={studentId} className="student-item">
            <button onClick={() => setSelectedStudentId(studentId)}>
              View Student {studentId} Grades
            </button>
          </div>
        ))}
      </div>

      {selectedStudentId && (
        <div className="selected-student">
          <GradesList studentId={selectedStudentId} />
          
          {canInputGrades && (
            <GradeInput
              classId={classId}
              studentId={selectedStudentId}
              onGradeSaved={() => {
                // Refresh grades list
                window.location.reload();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default GradesDashboard;
```

## 🔧 Key Benefits of This Integration

### **Backend Benefits:**
1. **Single Line Addition** - Just add access control check: `accessControlService.hasAccess(userId, scope, id)`
2. **Automatic Filtering** - Service methods return only accessible data
3. **Consistent Security** - Same access rules applied everywhere
4. **Performance** - Cached access checks, minimal database queries

### **Frontend Benefits:**
1. **Automatic UI Updates** - Components hide/show based on permissions
2. **Error Prevention** - Users can't attempt actions they can't perform
3. **Role-Based Views** - Same component shows different content per role
4. **Graceful Degradation** - Fails safely when permissions are denied

### **Implementation Effort:**
- **Backend**: Add 2-3 lines per endpoint
- **Frontend**: Use hooks and protected components
- **Testing**: Simple role-based test cases

The rule-based approach makes access control integration extremely straightforward - you just check permissions before showing UI or processing requests! 
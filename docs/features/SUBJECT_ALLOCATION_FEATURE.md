# Subject Allocation Feature Documentation

## Overview

The **Subject Allocation** feature is a comprehensive system within the Thutothebe Learning Management System that enables school administrators to assign subjects to teachers and monitor curriculum delivery progress. This feature serves as a critical bridge between curriculum planning and actual classroom delivery, ensuring optimal resource distribution and academic quality.

## 🎯 Purpose & Objectives

### Primary Goals
- **Resource Optimization**: Efficiently allocate teaching resources across subjects and classes
- **Quality Assurance**: Ensure qualified teachers are assigned to appropriate subjects
- **Progress Monitoring**: Track curriculum delivery and teaching effectiveness
- **Workload Management**: Balance teacher workloads to prevent burnout
- **Compliance**: Ensure curriculum requirements are met across all classes

### Key Benefits
- **Improved Academic Outcomes**: Better teacher-subject matching leads to enhanced learning
- **Operational Efficiency**: Streamlined allocation process reduces administrative overhead
- **Data-Driven Decisions**: Analytics support informed administrative choices
- **Resource Optimization**: Optimal distribution of teaching resources
- **Quality Control**: Systematic monitoring of curriculum delivery

## 🏗️ Technical Architecture

### Data Model

#### Core Entities

**1. Course Entity** (`Course.java`)
```java
@Entity
@Table(name = "courses")
public class Course extends BaseEntity {
    private String code;                    // Unique course identifier
    private String name;                    // Course name
    private Subject subject;                // Associated subject
    private Class classEntity;              // Target class
    private Term term;                      // Academic term
    private Integer year;                   // Academic year
    private boolean active;                 // Course status
    private CourseType type;                // Core/Elective
    private Set<CourseInstructor> courseInstructors; // Teacher assignments
}
```

**2. CourseInstructor Entity** (`CourseInstructor.java`)
```java
@Entity
@Table(name = "course_instructors")
public class CourseInstructor extends BaseEntity {
    private Course course;                  // Associated course
    private Teacher teacher;                // Assigned teacher
    private boolean isPrimary;              // Primary instructor flag
    private String notes;                   // Additional notes
}
```

**3. Subject Entity** (`Subject.java`)
```java
@Entity
@Table(name = "subjects")
public class Subject extends BaseEntity {
    private String code;                    // Subject code
    private String name;                    // Subject name
    private String description;             // Subject description
    private Department department;          // Associated department
    private boolean active;                 // Subject status
}
```

**4. Teacher Entity** (`Teacher.java`)
```java
@Entity
@Table(name = "teachers")
public class Teacher extends BaseEntity {
    private String staffId;                 // Staff identifier
    private String firstName;               // First name
    private String lastName;                // Last name
    private String email;                   // Email address
    private String qualification;           // Teaching qualifications
    private School school;                  // Associated school
    private User user;                      // User account
    private boolean active;                 // Teacher status
}
```

### Database Relationships

```
Subject (1) ←→ (N) Course
Class (1) ←→ (N) Course
Course (1) ←→ (N) CourseInstructor
Teacher (1) ←→ (N) CourseInstructor
School (1) ←→ (N) Teacher
Department (1) ←→ (N) Subject
```

## 🎨 User Interface Components

### Main Dashboard (`SubjectAllocationPage.tsx`)

#### Overview Statistics
- **Total Allocations**: Count of all subject-teacher assignments
- **Active Allocations**: Currently active assignments
- **Average Progress**: Overall curriculum delivery progress
- **Workload Distribution**: Teacher workload analysis

#### Quick Actions Panel
```typescript
// Quick action buttons
<button onClick={handleAllocateSubject}>
  <Plus size={16} />
  Allocate Subject
</button>

<button onClick={handleBulkAllocation}>
  <Users size={16} />
  Bulk Allocation
</button>
```

#### Teacher Workload Cards
Each teacher card displays:
- **Teacher Information**: Name, photo, and basic details
- **Subject Assignments**: List of assigned subjects with class information
- **Workload Indicator**: Visual status (Light/Moderate/Heavy)
- **Progress Percentage**: Curriculum delivery progress
- **Quick Actions**: Edit, view, or remove allocations

#### Allocations Table
Comprehensive table showing:
- **Subject & Teacher**: Subject name and assigned teacher
- **Class & Term**: Target class and academic period
- **Status**: Active, Pending, Completed, or Suspended
- **Progress**: Visual progress bar with percentage
- **Lessons**: Completed vs. total lessons
- **Assessments**: Number of assessments
- **Last Update**: Most recent activity timestamp
- **Actions**: View, edit, or remove options

### Allocation Modal (`SubjectAssignTeacherModal.tsx`)

#### Single Allocation Mode
```typescript
// Form fields for single allocation
<select value={formData.subjectId}>
  <option value="">Select Subject</option>
  {subjects.map(subject => (
    <option key={subject.id} value={subject.id}>
      {subject.name}
    </option>
  ))}
</select>

<select value={formData.teacherId}>
  <option value="">Select Teacher</option>
  {teachers.map(teacher => (
    <option key={teacher.id} value={teacher.id}>
      {teacher.firstName} {teacher.lastName}
    </option>
  ))}
</select>
```

#### Bulk Allocation Mode
- **Multiple Allocation Setup**: Configure multiple allocations simultaneously
- **Validation**: Ensures data integrity across all allocations
- **Preview**: Review all allocations before confirmation
- **Batch Processing**: Execute all allocations in a single operation

## 🔌 API Endpoints

### Course Management

#### Core Course Operations
```http
GET    /api/courses                    # Get all courses
POST   /api/courses                    # Create new course allocation
PUT    /api/courses/{id}               # Update course allocation
DELETE /api/courses/{id}               # Remove allocation
GET    /api/courses/{id}               # Get course by ID
```

#### Filtered Queries
```http
GET    /api/courses/teacher/{teacherId}     # Get courses by teacher
GET    /api/courses/subject/{subjectId}     # Get courses by subject
GET    /api/courses/class/{classId}         # Get courses by class
GET    /api/courses/active                  # Get active courses only
GET    /api/courses/term/{term}             # Get courses by term
GET    /api/courses/year/{year}             # Get courses by year
```

#### Instructor Management
```http
POST   /api/courses/{courseId}/instructors/{teacherId}  # Add instructor
DELETE /api/courses/{courseId}/instructors/{teacherId}  # Remove instructor
PUT    /api/courses/{courseId}/instructors/{teacherId}  # Update instructor role
```

### Subject Management

#### Subject Operations
```http
GET    /api/subjects                   # Get all subjects
GET    /api/subjects/{id}              # Get subject by ID
POST   /api/subjects                   # Create new subject
PUT    /api/subjects/{id}              # Update subject
DELETE /api/subjects/{id}              # Delete subject
GET    /api/subjects/code/{code}       # Get subject by code
GET    /api/subjects/active            # Get active subjects
```

### Curriculum Integration

#### Curriculum-Subject Operations
```http
POST   /api/curricula/{curriculumId}/subjects/{subjectId}    # Add subject to curriculum
DELETE /api/curricula/{curriculumId}/subjects/{subjectId}    # Remove subject from curriculum
GET    /api/curricula/{curriculumId}/subjects/available      # Get available subjects
GET    /api/curricula/{curriculumId}/subjects/statistics     # Get curriculum statistics
```

## 🔒 Security & Access Control

### Multi-Tenant Security Model

#### School-Level Access
```java
// School-level filtering in repository
@Query("SELECT c FROM Course c WHERE c.classEntity.school.id = :schoolId")
List<Course> findBySchoolId(@Param("schoolId") Long schoolId);
```

#### Region-Level Access
```java
// Region-level filtering
@Query("SELECT c FROM Course c WHERE c.classEntity.school.region.id = :regionId")
List<Course> findByRegionId(@Param("regionId") Long regionId);
```

#### Role-Based Permissions
- **Global Admin**: Full access to all allocations across all schools
- **Regional Admin**: Access to allocations within their region
- **School Admin**: Access to allocations within their school
- **Teacher**: View-only access to their own allocations

### Data Validation

#### Input Validation
```java
@NotBlank(message = "Course code is required")
@Size(min = 3, max = 20, message = "Course code must be between 3 and 20 characters")
private String code;

@NotNull(message = "Subject ID is required")
private Long subjectId;

@NotNull(message = "Class ID is required")
private Long classId;
```

#### Business Rule Validation
```java
// Check for duplicate allocations
if (courseRepository.existsByCodeAndSchoolId(courseCode, schoolId)) {
    throw new IllegalArgumentException("Course code already exists in this school");
}

// Validate teacher workload
if (teacherWorkload > MAX_WORKLOAD_THRESHOLD) {
    throw new IllegalArgumentException("Teacher workload exceeds maximum limit");
}
```

## 📊 Monitoring & Analytics

### Real-Time Metrics

#### Allocation Statistics
```typescript
const getStatistics = () => {
  const total = allocations.length;
  const active = allocations.filter(a => a.status === 'ACTIVE').length;
  const pending = allocations.filter(a => a.status === 'PENDING').length;
  const avgProgress = total > 0 ? 
    Math.round(allocations.reduce((sum, a) => sum + a.progress, 0) / total) : 0;
  
  return { total, active, pending, avgProgress };
};
```

#### Workload Analysis
```typescript
const getWorkloadStatus = (subjectCount: number) => {
  if (subjectCount <= 3) return { status: 'LIGHT', color: 'green' };
  if (subjectCount <= 6) return { status: 'MODERATE', color: 'yellow' };
  return { status: 'HEAVY', color: 'red' };
};
```

### Progress Tracking

#### Curriculum Delivery Progress
- **Lesson Completion**: Track completed vs. total lessons
- **Assessment Progress**: Monitor assignment and assessment completion
- **Performance Metrics**: Measure teaching effectiveness
- **Timeline Tracking**: Monitor delivery against academic calendar

#### Performance Indicators
- **Completion Rate**: Percentage of curriculum objectives completed
- **Quality Metrics**: Student performance in allocated subjects
- **Efficiency Score**: Time-to-completion vs. expected timeline
- **Satisfaction Rating**: Student and parent feedback scores

## 🔄 Workflow Processes

### 1. Subject Allocation Process

#### Step-by-Step Workflow
1. **Access**: Navigate to Subject Allocation page
2. **Select Subject**: Choose from available subjects
3. **Select Teacher**: Pick qualified teacher from roster
4. **Select Class**: Choose target class/grade level
5. **Set Parameters**: Define term, year, and course type
6. **Validate**: System checks for conflicts and workload
7. **Confirm**: Create the allocation
8. **Monitor**: Track progress and performance

#### Validation Rules
```java
// Workload validation
if (teacher.getCurrentWorkload() + newSubjectHours > MAX_WORKLOAD) {
    throw new WorkloadExceededException("Teacher workload would exceed maximum limit");
}

// Conflict validation
if (courseRepository.existsByTeacherAndTimeSlot(teacherId, timeSlot)) {
    throw new SchedulingConflictException("Teacher has conflicting schedule");
}

// Qualification validation
if (!teacher.getQualifications().contains(subject.getRequiredQualification())) {
    throw new QualificationMismatchException("Teacher lacks required qualification");
}
```

### 2. Bulk Allocation Process

#### Bulk Operation Steps
1. **Initiate**: Click "Bulk Allocation" button
2. **Configure**: Set up multiple allocation rules
3. **Upload Data**: Import allocation data from CSV/Excel
4. **Validate**: System validates all allocations
5. **Review**: Preview all allocations before confirmation
6. **Execute**: Process all allocations simultaneously
7. **Verify**: Confirm successful allocations
8. **Report**: Generate allocation summary report

#### Bulk Validation
```typescript
const validateBulkAllocations = (allocations: AllocationData[]) => {
  const errors = [];
  
  allocations.forEach((allocation, index) => {
    // Check for duplicate allocations
    if (hasDuplicate(allocation)) {
      errors.push(`Row ${index + 1}: Duplicate allocation detected`);
    }
    
    // Validate teacher workload
    if (exceedsWorkload(allocation.teacherId, allocation.subjectHours)) {
      errors.push(`Row ${index + 1}: Teacher workload exceeded`);
    }
    
    // Check scheduling conflicts
    if (hasSchedulingConflict(allocation)) {
      errors.push(`Row ${index + 1}: Scheduling conflict detected`);
    }
  });
  
  return errors;
};
```

### 3. Workload Management Process

#### Workload Monitoring
1. **Monitor**: Track teacher workload indicators
2. **Analyze**: Identify overloaded teachers
3. **Assess**: Evaluate impact on teaching quality
4. **Redistribute**: Reallocate subjects if necessary
5. **Optimize**: Balance workload across teachers
6. **Document**: Record changes and rationale

#### Workload Thresholds
```typescript
const WORKLOAD_THRESHOLDS = {
  LIGHT: { min: 1, max: 3, color: 'green', status: 'Healthy' },
  MODERATE: { min: 4, max: 6, color: 'yellow', status: 'Manageable' },
  HEAVY: { min: 7, max: 10, color: 'red', status: 'Overloaded' },
  CRITICAL: { min: 11, max: Infinity, color: 'red', status: 'Critical' }
};
```

## 🎯 Key Features

### Advanced Filtering & Search

#### Multi-Dimensional Filtering
```typescript
const filteredAllocations = allocations.filter(allocation => {
  const matchesSearch = 
    allocation.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.class.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesSubject = filterSubject === '' || allocation.subject === filterSubject;
  const matchesStatus = filterStatus === '' || allocation.status === filterStatus;
  const matchesClass = selectedClass === null || allocation.classId === selectedClass;

  return matchesSearch && matchesSubject && matchesStatus && matchesClass;
});
```

#### Search Capabilities
- **Global Search**: Search across all allocation fields
- **Subject Filter**: Filter by specific subjects
- **Teacher Filter**: Filter by assigned teachers
- **Class Filter**: Filter by class levels
- **Status Filter**: Filter by allocation status
- **Date Range Filter**: Filter by allocation date

### Progress Visualization

#### Progress Indicators
```typescript
const getProgressColor = (progress: number) => {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-800';
    case 'PENDING': return 'bg-yellow-100 text-yellow-800';
    case 'COMPLETED': return 'bg-blue-100 text-blue-800';
    case 'SUSPENDED': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
```

### Export Capabilities

#### Report Generation
- **PDF Reports**: Comprehensive allocation reports
- **Excel Exports**: Data analysis and manipulation
- **CSV Exports**: Data transfer and backup
- **Custom Reports**: User-defined report templates

## 🚀 Implementation Guidelines

### Frontend Implementation

#### Component Structure
```
SubjectAllocationPage/
├── SubjectAllocationPage.tsx          # Main page component
├── components/
│   ├── AllocationTable.tsx            # Allocations data table
│   ├── TeacherWorkloadCards.tsx       # Teacher workload display
│   ├── AllocationStats.tsx            # Statistics dashboard
│   └── QuickActions.tsx               # Action buttons
├── modals/
│   ├── SubjectAssignTeacherModal.tsx  # Allocation modal
│   ├── CourseEditModal.tsx            # Edit allocation modal
│   └── CourseDeleteModal.tsx          # Delete confirmation modal
└── hooks/
    ├── useAllocationData.ts           # Data management hook
    └── useAllocationActions.ts        # Action handlers hook
```

#### State Management
```typescript
// Redux slice for subject allocation
interface SubjectAllocationState {
  allocations: Allocation[];
  teachers: Teacher[];
  subjects: Subject[];
  classes: Class[];
  loading: boolean;
  error: string | null;
  filters: {
    searchTerm: string;
    subject: string;
    status: string;
    class: number | null;
  };
}
```

### Backend Implementation

#### Service Layer
```java
@Service
public class CourseServiceImpl extends BaseServiceImpl<Course, CourseDTO, Long> {
    
    @Override
    @Transactional
    public CourseDTO create(CourseDTO dto) {
        // Validate business rules
        validateCourseCreation(dto);
        
        // Create course entity
        Course course = courseMapper.toEntity(dto);
        
        // Save course
        Course savedCourse = courseRepository.save(course);
        
        // Create instructor relationships
        createInstructorRelationships(savedCourse, dto.instructorIds());
        
        return courseMapper.toDto(savedCourse);
    }
    
    private void validateCourseCreation(CourseDTO dto) {
        // Check for duplicate course codes
        if (courseRepository.existsByCodeAndSchoolId(dto.code(), getCurrentSchoolId())) {
            throw new IllegalArgumentException("Course code already exists");
        }
        
        // Validate teacher workload
        validateTeacherWorkload(dto.instructorIds());
        
        // Check for scheduling conflicts
        validateSchedulingConflicts(dto);
    }
}
```

#### Repository Layer
```java
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    @EntityGraph(attributePaths = {"classEntity", "subject", "courseInstructors", "courseInstructors.teacher"})
    @Query("SELECT c FROM Course c WHERE c.classEntity.school.id = :schoolId")
    List<Course> findBySchoolId(@Param("schoolId") Long schoolId);
    
    @Query("SELECT COUNT(c) > 0 FROM Course c WHERE c.code = :code AND c.classEntity.school.id = :schoolId")
    boolean existsByCodeAndSchoolId(@Param("code") String code, @Param("schoolId") Long schoolId);
    
    @Query("SELECT c FROM Course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId")
    List<Course> findByTeacherId(@Param("teacherId") Long teacherId);
}
```

## 📋 Configuration

### Environment Variables
```properties
# Subject Allocation Configuration
subject.allocation.max-workload=10
subject.allocation.conflict-checking=true
subject.allocation.auto-validation=true
subject.allocation.notification-enabled=true

# Workload Thresholds
subject.workload.light.max=3
subject.workload.moderate.max=6
subject.workload.heavy.max=10
subject.workload.critical.min=11
```

### Feature Flags
```typescript
const FEATURE_FLAGS = {
  BULK_ALLOCATION: process.env.REACT_APP_BULK_ALLOCATION === 'true',
  WORKLOAD_MONITORING: process.env.REACT_APP_WORKLOAD_MONITORING === 'true',
  PROGRESS_TRACKING: process.env.REACT_APP_PROGRESS_TRACKING === 'true',
  ADVANCED_FILTERING: process.env.REACT_APP_ADVANCED_FILTERING === 'true'
};
```

## 🧪 Testing

### Unit Tests

#### Service Layer Tests
```java
@Test
void testCreateCourseAllocation() {
    // Given
    CourseDTO courseDTO = createValidCourseDTO();
    
    // When
    CourseDTO result = courseService.create(courseDTO);
    
    // Then
    assertNotNull(result);
    assertEquals(courseDTO.code(), result.code());
    assertEquals(courseDTO.subjectId(), result.subjectId());
    assertEquals(courseDTO.classId(), result.classId());
}

@Test
void testCreateCourseWithInvalidWorkload() {
    // Given
    CourseDTO courseDTO = createCourseWithExcessiveWorkload();
    
    // When & Then
    assertThrows(WorkloadExceededException.class, () -> {
        courseService.create(courseDTO);
    });
}
```

#### Component Tests
```typescript
describe('SubjectAllocationPage', () => {
  it('should render allocation table with data', () => {
    const mockAllocations = createMockAllocations();
    
    render(<SubjectAllocationPage />);
    
    expect(screen.getByText('Subject Allocation')).toBeInTheDocument();
    expect(screen.getByText(mockAllocations[0].subject)).toBeInTheDocument();
  });
  
  it('should filter allocations by search term', () => {
    render(<SubjectAllocationPage />);
    
    const searchInput = screen.getByPlaceholderText('Search allocations...');
    fireEvent.change(searchInput, { target: { value: 'Mathematics' } });
    
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
    expect(screen.queryByText('Physics')).not.toBeInTheDocument();
  });
});
```

### Integration Tests

#### API Endpoint Tests
```java
@SpringBootTest
@AutoConfigureTestDatabase
class CourseControllerIntegrationTest {
    
    @Test
    void testCreateCourseAllocation() {
        // Given
        CourseDTO courseDTO = createValidCourseDTO();
        
        // When
        ResponseEntity<OhmaApiResponse<CourseDTO>> response = 
            restTemplate.postForEntity("/api/courses", courseDTO, 
                new ParameterizedTypeReference<OhmaApiResponse<CourseDTO>>() {});
        
        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody().getData());
    }
}
```

## 📚 Best Practices

### Code Quality Guidelines

#### Frontend Best Practices
- **Component Composition**: Use small, focused components
- **State Management**: Centralize state in Redux store
- **Type Safety**: Use TypeScript for all components
- **Error Handling**: Implement comprehensive error boundaries
- **Performance**: Use React.memo and useMemo for optimization

#### Backend Best Practices
- **Service Layer**: Implement business logic in service classes
- **Validation**: Use Bean Validation annotations
- **Exception Handling**: Create custom exceptions for business rules
- **Security**: Implement proper access control and data validation
- **Performance**: Use EntityGraph for efficient data loading

### Security Considerations

#### Data Protection
- **Input Validation**: Validate all user inputs
- **SQL Injection Prevention**: Use parameterized queries
- **XSS Protection**: Sanitize user-generated content
- **CSRF Protection**: Implement CSRF tokens
- **Access Control**: Enforce role-based permissions

#### Privacy Compliance
- **Data Minimization**: Collect only necessary data
- **Consent Management**: Obtain proper user consent
- **Data Retention**: Implement appropriate retention policies
- **Audit Logging**: Log all data access and modifications

## 🔮 Future Enhancements

### Planned Features

#### Advanced Analytics
- **Predictive Workload Analysis**: AI-powered workload prediction
- **Performance Correlation**: Link allocation patterns to student performance
- **Optimization Recommendations**: Automated allocation suggestions
- **Trend Analysis**: Historical allocation pattern analysis

#### Enhanced User Experience
- **Drag-and-Drop Interface**: Visual allocation management
- **Real-time Collaboration**: Multi-user allocation editing
- **Mobile Optimization**: Full mobile support
- **Offline Capabilities**: Offline allocation management

#### Integration Enhancements
- **Calendar Integration**: Sync with academic calendars
- **Notification System**: Automated allocation notifications
- **Reporting Engine**: Advanced reporting capabilities
- **API Extensions**: Additional API endpoints for third-party integration

### Technical Improvements

#### Performance Optimization
- **Caching Strategy**: Implement Redis caching
- **Database Optimization**: Query optimization and indexing
- **Frontend Optimization**: Code splitting and lazy loading
- **API Optimization**: GraphQL implementation

#### Scalability Enhancements
- **Microservices Architecture**: Service decomposition
- **Load Balancing**: Horizontal scaling support
- **Database Sharding**: Multi-tenant database optimization
- **CDN Integration**: Content delivery optimization

## 📞 Support & Maintenance

### Troubleshooting Guide

#### Common Issues

**Allocation Conflicts**
- **Problem**: Teachers assigned to overlapping time slots
- **Solution**: Implement conflict detection and resolution
- **Prevention**: Real-time validation during allocation

**Workload Imbalance**
- **Problem**: Uneven distribution of subjects among teachers
- **Solution**: Automated workload balancing algorithms
- **Prevention**: Proactive workload monitoring

**Performance Issues**
- **Problem**: Slow loading of allocation data
- **Solution**: Implement pagination and lazy loading
- **Prevention**: Database optimization and caching

### Maintenance Procedures

#### Regular Maintenance
- **Data Cleanup**: Remove inactive allocations
- **Performance Monitoring**: Monitor system performance
- **Security Updates**: Regular security patches
- **Backup Procedures**: Automated data backup

#### Update Procedures
- **Feature Updates**: Gradual rollout of new features
- **Database Migrations**: Safe database schema updates
- **API Versioning**: Backward-compatible API updates
- **User Training**: Training for new features

## 📄 Related Documentation

- [Curriculum Management Feature](./CURRICULUM_MANAGEMENT_FEATURE.md)
- [Teacher Management Feature](./TEACHER_MANAGEMENT_FEATURE.md)
- [Class Management Feature](./CLASS_MANAGEMENT_FEATURE.md)
- [Assessment Management Feature](./ASSESSMENT_MANAGEMENT_FEATURE.md)
- [API Documentation](../api/API_DOCUMENTATION.md)
- [User Guide](../user-guides/SCHOOL_ADMIN_USER_GUIDE.md)

---

*This document provides comprehensive coverage of the Subject Allocation feature. For additional information or support, please refer to the related documentation or contact the development team.* 
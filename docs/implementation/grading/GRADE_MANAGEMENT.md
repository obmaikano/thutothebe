# Grade Management Module Documentation

## Overview

The Grade Management module is a comprehensive grading system for ThutoLMS (Botswana's national learning management platform) that provides structured grade recording, moderation, calculation, and reporting capabilities. The module follows Botswana's education standards and implements best practices for academic grade management.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Entity Relationships](#entity-relationships)
3. [API Endpoints](#api-endpoints)
4. [Implementation Details](#implementation-details)
5. [Usage Examples](#usage-examples)
6. [Grade Calculation Rules](#grade-calculation-rules)
7. [Report Generation](#report-generation)
8. [Testing](#testing)
9. [Best Practices](#best-practices)

## Architecture Overview

The Grade Management module follows a layered architecture with clear separation of concerns:

```
┌─────────────────┐
│   Controllers   │ ← REST API Layer
├─────────────────┤
│    Services     │ ← Business Logic Layer
├─────────────────┤
│   Repositories  │ ← Data Access Layer
├─────────────────┤
│    Entities     │ ← Domain Model Layer
└─────────────────┘
```

### Key Components

- **Entities**: Grade, GradeCategory, GradeCalculationRule, GradeReport
- **DTOs**: GradeDTO, GradeCategoryDTO, GradeCalculationRuleDTO, GradeReportDTO
- **Services**: GradeService, GradeCalculationRuleService, GradeReportService
- **Controllers**: GradeController
- **Repositories**: GradeRepository, GradeCalculationRuleRepository, GradeReportRepository

## Entity Relationships

### Core Entities

#### Grade Entity
```java
@Entity
@Table(name = "grades")
public class Grade extends BaseEntity {
    @ManyToOne private User student;           // Required: Student receiving the grade
    @ManyToOne private Course course;          // Required: Course for the grade
    @ManyToOne private GradeCategory gradeCategory; // Optional: Category classification
    @ManyToOne private Assessment assessment;  // Optional: Related assessment
    @ManyToOne private Assignment assignment;  // Optional: Related assignment
    @Enumerated private GradeType gradeType;   // Required: Type classification
    private Double score;                      // Required: Actual score (0-100)
    private Double maxScore;                   // Optional: Maximum possible score
    private Double weight;                     // Optional: Weight for calculations
    private String feedback;                   // Optional: Feedback text
    @ManyToOne private User gradedBy;          // Required: Who entered the grade
    private LocalDateTime gradedAt;            // Required: When grade was entered
    private boolean isFinal;                   // Final grade flag
    private boolean isModerated;               // Moderation status
    @ManyToOne private User moderatedBy;       // Optional: Who moderated
    private LocalDateTime moderatedAt;         // Optional: When moderated
    private String moderationNotes;            // Optional: Moderation notes
    private Double originalScore;              // Optional: Original score before moderation
    private boolean active;                    // Soft delete flag
}
```

#### GradeCategory Entity
```java
@Entity
@Table(name = "grade_categories")
public class GradeCategory extends BaseEntity {
    private String name;                       // Category name (e.g., "Assignments")
    private String description;                // Category description
    private Double weight;                     // Weight percentage (0-100)
    @ManyToOne private Course course;          // Associated course
    private boolean active;                    // Active status
    private Double minGrade;                   // Minimum grade threshold
    private Double maxGrade;                   // Maximum grade threshold
    private Double passingGrade;               // Passing grade threshold
}
```

### Relationship Diagram

```
User (Student) ──┐
                 │
                 ├── Grade ──── Course
                 │    │
                 │    ├── GradeCategory
                 │    ├── Assessment
                 │    └── Assignment
                 │
User (Teacher) ──┘

Course ──── GradeCalculationRule
     │
     └── GradeReport
```

## API Endpoints

### Grade Management Endpoints

#### Basic CRUD Operations
```http
GET    /api/grades                           # Get all grades
GET    /api/grades/{id}                      # Get grade by ID
POST   /api/grades                          # Create new grade
PUT    /api/grades/{id}                     # Update grade
DELETE /api/grades/{id}                     # Delete grade
```

#### Student Grade Queries
```http
GET    /api/grades/student/{studentId}                    # All grades for student
GET    /api/grades/student/{studentId}/course/{courseId}  # Student grades in course
GET    /api/grades/student/{studentId}/category/{categoryId} # Student grades in category
GET    /api/grades/student/{studentId}/paginated          # Paginated student grades
```

#### Course and Category Queries
```http
GET    /api/grades/course/{courseId}                      # All grades for course
GET    /api/grades/category/{gradeCategoryId}             # All grades in category
GET    /api/grades/type/{gradeType}                       # Grades by type
GET    /api/grades/term/{term}                            # Grades by term
```

#### Assessment and Assignment Grades
```http
GET    /api/grades/assessment/{assessmentId}              # Grades for assessment
GET    /api/grades/assignment/{assignmentId}              # Grades for assignment
GET    /api/grades/teacher/{teacherId}                    # Grades entered by teacher
```

#### Statistics and Analytics
```http
GET    /api/grades/statistics/average/student/{studentId}           # Student average
GET    /api/grades/statistics/average/course/{courseId}             # Course average
GET    /api/grades/statistics/average/category/{gradeCategoryId}    # Category average
GET    /api/grades/statistics/average/student/{studentId}/course/{courseId} # Student-course average
```

#### Grade Creation
```http
POST   /api/grades/assessment                            # Create grade for assessment
POST   /api/grades/assignment                            # Create grade for assignment
POST   /api/grades/category                              # Create grade for category
POST   /api/grades/bulk                                  # Bulk create grades
```

#### Grade Moderation
```http
POST   /api/grades/moderate/{gradeId}                    # Moderate a grade
GET    /api/grades/unmoderated                           # Get unmoderated grades
GET    /api/grades/moderated                             # Get moderated grades
```

#### Grade Management
```http
PUT    /api/grades/{gradeId}/deactivate                  # Deactivate grade
PUT    /api/grades/{gradeId}/reactivate                  # Reactivate grade
GET    /api/grades/exists/student/{studentId}/assessment/{assessmentId} # Check existence
GET    /api/grades/exists/student/{studentId}/assignment/{assignmentId} # Check existence
GET    /api/grades/exists/student/{studentId}/category/{gradeCategoryId} # Check existence
```

## Implementation Details

### Service Layer Architecture

#### GradeService Interface
```java
public interface GradeService extends BaseService<GradeDTO, Long> {
    // Basic queries
    List<GradeDTO> findByStudentId(Long studentId);
    List<GradeDTO> findByCourseId(Long courseId);
    List<GradeDTO> findByGradeCategoryId(Long gradeCategoryId);
    
    // Statistical calculations
    Double calculateAverageScoreByStudent(Long studentId);
    Double calculateAverageScoreByCourse(Long courseId);
    Double calculateAverageScoreByGradeCategory(Long gradeCategoryId);
    
    // Grade moderation
    GradeDTO moderateGrade(Long gradeId, Long moderatorId, String notes, Double newScore);
    
    // Grade creation
    GradeDTO createGradeForCategory(Long studentId, Long gradeCategoryId, 
                                   Double score, Long gradedById, String feedback);
}
```

#### Repository Optimizations
```java
@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByStudentIdAndActive(Long studentId, boolean active);
    
    @Query("SELECT AVG(g.score) FROM Grade g WHERE g.gradeCategory.id = :categoryId AND g.active = true")
    Optional<Double> findAverageScoreByGradeCategory(@Param("categoryId") Long categoryId);
}
```

### Data Transfer Objects

#### GradeDTO
```java
public record GradeDTO(
    Long id,
    @NotNull Long studentId,
    @NotNull Long courseId,
    Long gradeCategoryId,              // New: Grade category relationship
    Long assessmentId,
    Long assignmentId,
    @NotNull GradeType gradeType,
    @NotNull @DecimalMin("0.0") @DecimalMax("100.0") Double score,
    Double maxScore,
    Double weight,
    String feedback,
    @NotNull Long gradedById,
    LocalDateTime gradedAt,
    boolean isFinal,
    boolean isModerated,
    Long moderatedById,
    LocalDateTime moderatedAt,
    String moderationNotes,
    Double originalScore,
    boolean active,
    LocalDateTime createdAt,
    LocalDateTime modifiedAt
) {
    // Validation logic in compact constructor
}
```

### Mapper Implementation

#### GradeMapper with Repository Integration
```java
@Component
public class GradeMapper implements BaseDtoMapper<Grade, GradeDTO> {
    @Autowired private UserRepository userRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private GradeCategoryRepository gradeCategoryRepository;
    
    @Override
    public Grade toEntity(GradeDTO dto) {
        Grade grade = new Grade();
        // Map basic fields
        grade.setScore(dto.score());
        grade.setGradeType(dto.gradeType());
        
        // Map entity references using repositories
        if (dto.gradeCategoryId() != null) {
            GradeCategory category = gradeCategoryRepository.findById(dto.gradeCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Grade category not found"));
            grade.setGradeCategory(category);
        }
        
        return grade;
    }
}
```

## Usage Examples

### 1. Creating a Grade for a Category

```java
// Create grade for a specific grade category
@PostMapping("/grades/category")
public ResponseEntity<OhmaApiResponse<GradeDTO>> createGradeForCategory(
        @RequestParam Long studentId,
        @RequestParam Long gradeCategoryId,
        @RequestParam Double score,
        @RequestParam Long gradedById,
        @RequestParam(required = false) String feedback) {
    
    GradeDTO grade = gradeService.createGradeForCategory(
        studentId, gradeCategoryId, score, gradedById, feedback);
    
    return ResponseEntity.ok(new OhmaApiResponse<>(
        "SUCCESS", "Grade created successfully", grade, null));
}
```

**Request Example:**
```bash
curl -X POST "http://localhost:8080/api/grades/category" \
  -d "studentId=123" \
  -d "gradeCategoryId=456" \
  -d "score=85.5" \
  -d "gradedById=789" \
  -d "feedback=Excellent work on the assignment"
```

### 2. Moderating a Grade

```java
// Moderate an existing grade
GradeDTO moderatedGrade = gradeService.moderateGrade(
    gradeId, 
    moderatorId, 
    "Score adjusted after review", 
    newScore
);
```

**Request Example:**
```bash
curl -X POST "http://localhost:8080/api/grades/moderate/123" \
  -d "moderatorId=456" \
  -d "moderationNotes=Adjusted for partial credit" \
  -d "newScore=78.0"
```

### 3. Bulk Grade Creation

```java
// Create multiple grades at once
List<GradeDTO> gradesToCreate = Arrays.asList(
    new GradeDTO(null, 123L, 456L, 789L, null, null, 
                 GradeType.ASSIGNMENT, 85.0, 100.0, 1.0, 
                 "Good work", 999L, LocalDateTime.now(), 
                 false, false, null, null, null, null, 
                 true, null, null),
    // ... more grades
);

List<GradeDTO> createdGrades = gradeService.bulkCreateGrades(gradesToCreate);
```

### 4. Calculating Statistics

```java
// Get various statistics
Double studentAverage = gradeService.calculateAverageScoreByStudent(studentId);
Double courseAverage = gradeService.calculateAverageScoreByCourse(courseId);
Double categoryAverage = gradeService.calculateAverageScoreByGradeCategory(categoryId);

// Count passing grades
Long passingCount = gradeService.countPassingGradesByGradeCategory(categoryId, 50.0);
```

### 5. Querying Grades by Category

```java
// Get all grades in a specific category
List<GradeDTO> categoryGrades = gradeService.findByGradeCategoryId(categoryId);

// Get student's grades in a specific category
List<GradeDTO> studentCategoryGrades = gradeService.findByStudentIdAndGradeCategoryId(
    studentId, categoryId);

// Check if grade exists for student in category
boolean exists = gradeService.existsByStudentIdAndGradeCategoryId(studentId, categoryId);
```

## Grade Calculation Rules

### Botswana Education System Standards

The system implements Botswana's education standards with default calculation rules:

```java
// Default calculation rules
public List<GradeCalculationRuleDTO> createDefaultRulesForCourse(
        Long courseId, Term term, Integer academicYear) {
    return Arrays.asList(
        new GradeCalculationRuleDTO(
            null, courseId, GradeType.CONTINUOUS, 40.0, 50.0,
            "Continuous assessment including assignments, quizzes, and participation",
            true, term, academicYear, null, null
        ),
        new GradeCalculationRuleDTO(
            null, courseId, GradeType.FINAL, 60.0, 50.0,
            "Final examination",
            true, term, academicYear, null, null
        )
    );
}
```

### Grade Letter Calculation

```java
private String calculateGradeLetter(Double score) {
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
}
```

## Report Generation

### Available Report Types

```java
public enum GradeReportType {
    STUDENT_INDIVIDUAL,    // Individual student performance
    STUDENT_TERM,          // Student term summary
    STUDENT_ANNUAL,        // Student annual summary
    CLASS_SUMMARY,         // Class performance summary
    SUBJECT_SUMMARY,       // Subject performance summary
    COURSE_SUMMARY,        // Course performance summary
    PROGRESS_REPORT,       // Student progress tracking
    TRANSCRIPT            // Official academic transcript
}
```

### Report Generation Examples

```java
// Generate individual student report
GradeReportDTO studentReport = gradeReportService.generateStudentIndividualReport(
    studentId, courseId, Term.FIRST_TERM, 2024, generatedById);

// Generate class summary report
GradeReportDTO classReport = gradeReportService.generateClassSummaryReport(
    classId, Term.FIRST_TERM, 2024, generatedById);

// Export report to PDF
byte[] pdfContent = gradeReportService.exportReportToPdf(reportId);

// Export report to Excel
byte[] excelContent = gradeReportService.exportReportToExcel(reportId);
```

## Testing

### Unit Test Example

```java
@ExtendWith(MockitoExtension.class)
class GradeServiceImplTest {
    
    @Mock private GradeRepository gradeRepository;
    @Mock private GradeMapper gradeMapper;
    @InjectMocks private GradeServiceImpl gradeService;
    
    @Test
    void createGradeForCategory_Success() {
        // Given
        Long studentId = 1L;
        Long categoryId = 2L;
        Double score = 85.0;
        Long gradedById = 3L;
        String feedback = "Good work";
        
        User student = new User();
        student.setId(studentId);
        
        GradeCategory category = new GradeCategory();
        category.setId(categoryId);
        category.setWeight(20.0);
        category.setMaxGrade(100.0);
        
        when(userRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(gradeCategoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        
        // When
        GradeDTO result = gradeService.createGradeForCategory(
            studentId, categoryId, score, gradedById, feedback);
        
        // Then
        assertNotNull(result);
        assertEquals(score, result.score());
        assertEquals(category.getWeight(), result.weight());
        verify(gradeRepository).save(any(Grade.class));
    }
    
    @Test
    void calculateAverageScoreByGradeCategory_Success() {
        // Given
        Long categoryId = 1L;
        Double expectedAverage = 78.5;
        
        when(gradeRepository.findAverageScoreByGradeCategory(categoryId))
            .thenReturn(Optional.of(expectedAverage));
        
        // When
        Double result = gradeService.calculateAverageScoreByGradeCategory(categoryId);
        
        // Then
        assertEquals(expectedAverage, result);
    }
}
```

### Integration Test Example

```java
@SpringBootTest
@Transactional
class GradeIntegrationTest {
    
    @Autowired private GradeService gradeService;
    @Autowired private TestDataFactory testDataFactory;
    
    @Test
    void gradeLifecycle_Success() {
        // Create test data
        User student = testDataFactory.createStudent();
        Course course = testDataFactory.createCourse();
        GradeCategory category = testDataFactory.createGradeCategory(course);
        User teacher = testDataFactory.createTeacher();
        
        // Create grade
        GradeDTO grade = gradeService.createGradeForCategory(
            student.getId(), category.getId(), 85.0, teacher.getId(), "Good work");
        
        assertNotNull(grade.id());
        assertEquals(85.0, grade.score());
        
        // Moderate grade
        GradeDTO moderatedGrade = gradeService.moderateGrade(
            grade.id(), teacher.getId(), "Adjusted score", 88.0);
        
        assertTrue(moderatedGrade.isModerated());
        assertEquals(88.0, moderatedGrade.score());
        assertEquals(85.0, moderatedGrade.originalScore());
        
        // Calculate statistics
        Double average = gradeService.calculateAverageScoreByGradeCategory(category.getId());
        assertEquals(88.0, average);
    }
}
```

## Best Practices

### 1. Grade Entry Guidelines

- **Always validate scores**: Ensure scores are within valid ranges (0-100)
- **Use grade categories**: Link grades to appropriate categories for better organization
- **Provide feedback**: Include meaningful feedback for student learning
- **Set appropriate weights**: Ensure category weights align with course requirements

### 2. Grade Moderation

- **Document changes**: Always provide moderation notes explaining adjustments
- **Preserve original scores**: System automatically stores original scores before moderation
- **Use proper authorization**: Ensure only authorized users can moderate grades
- **Audit trail**: All moderation activities are logged with timestamps

### 3. Performance Optimization

- **Use EntityGraph**: Repository methods include EntityGraph to prevent N+1 queries
- **Batch operations**: Use bulk operations for creating multiple grades
- **Pagination**: Use paginated queries for large result sets
- **Caching**: Consider caching frequently accessed statistics

### 4. Data Integrity

- **Validate relationships**: Ensure all referenced entities exist before creating grades
- **Soft deletes**: Use activation/deactivation instead of hard deletes
- **Transactional operations**: Use @Transactional for multi-step operations
- **Constraint validation**: Leverage JPA validation annotations

### 5. Security Considerations

- **Role-based access**: Implement proper role-based access control
- **Input validation**: Validate all input parameters
- **Audit logging**: Log all grade-related activities
- **Data privacy**: Ensure student grade data is properly protected

### 6. Error Handling

```java
// Proper error handling example
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<OhmaApiResponse<?>> handleResourceNotFound(ResourceNotFoundException ex) {
    return ResponseEntity.badRequest()
        .body(new OhmaApiResponse<>("ERROR", ex.getMessage(), null, null));
}
```

### 7. API Response Format

All API responses follow the standard OhmaApiResponse format:

```json
{
  "status": "SUCCESS",
  "message": "Grade created successfully",
  "data": {
    "id": 123,
    "studentId": 456,
    "courseId": 789,
    "gradeCategoryId": 101,
    "score": 85.5,
    "gradeType": "ASSIGNMENT",
    "feedback": "Excellent work",
    "active": true
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Conclusion

The Grade Management module provides a comprehensive, scalable, and maintainable solution for academic grade management in ThutoLMS. It follows best practices for Spring Boot development, implements proper validation and error handling, and provides extensive functionality for grade recording, moderation, calculation, and reporting.

The module's architecture ensures:
- **Scalability**: Efficient database queries and proper indexing
- **Maintainability**: Clean separation of concerns and comprehensive testing
- **Extensibility**: Easy to add new features and grade types
- **Reliability**: Robust error handling and data validation
- **Performance**: Optimized queries and caching strategies

For additional support or questions, please refer to the API documentation or contact the development team. 
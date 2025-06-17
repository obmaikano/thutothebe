# Enhanced Grading System - Quick Reference

## Overview
Comprehensive grading system supporting automatic, manual, and hybrid grading workflows for assignments and quizzes.

## Key Features
- ✅ **Real-time Auto-grading**: Immediate feedback for objective questions
- ✅ **Manual Grading**: Teacher review for subjective content  
- ✅ **Hybrid Workflow**: Combined auto + manual grading
- ✅ **Unified Interface**: Consistent grading for assignments and quizzes
- ✅ **Progressive Scoring**: Partial results available immediately
- ✅ **Grade Override**: Teachers can modify auto-graded scores

## Core Entities

### Gradable Interface
```java
public interface Gradable {
    Long getId();
    String getTitle();
    GradingType getGradingType();    // AUTO, MANUAL, HYBRID
    GradingMode getGradingMode();    // AUTO_ONLY, MANUAL_ONLY, HYBRID
    Integer getMaxScore();
    boolean canAutoGrade();
}
```

### GradingResult Entity
```java
@Entity
public class GradingResult extends BaseEntity {
    private Long submissionId;
    private Long graderId;
    private Integer autoScore;        // Auto-graded portion
    private Integer manualScore;      // Manually graded portion
    private Integer finalScore;       // Combined final score
    private GradingStatus status;     // PENDING, AUTO_COMPLETE, etc.
    private String feedback;
    private LocalDateTime gradedAt;
}
```

### AssignmentQuestion Entity
```java
@Entity
public class AssignmentQuestion extends BaseEntity {
    private Long assignmentId;
    private String questionText;
    private QuestionType questionType; // MCQ, TRUE_FALSE, SHORT_ANSWER, ESSAY
    private String correctAnswer;
    private Integer points;
    private boolean autoGradable;
}
```

## Grading Enums

### GradingType
- `AUTO` - Fully automatic grading
- `MANUAL` - Teacher-only grading  
- `HYBRID` - Auto + manual grading

### GradingStatus
- `PENDING` - Awaiting grading
- `AUTO_COMPLETE` - Auto-grading done
- `PENDING_MANUAL` - Needs teacher review
- `MANUAL_COMPLETE` - Teacher grading done
- `COMPLETE` - All grading finished
- `REQUIRES_REVIEW` - Needs attention

### QuestionType
- `MCQ` - Multiple choice (auto-gradable)
- `TRUE_FALSE` - True/false (auto-gradable)
- `SHORT_ANSWER` - Short text (auto-gradable with exact match)
- `ESSAY` - Long text (manual grading required)
- `NUMERICAL` - Number input (auto-gradable)

## Essential API Endpoints

### Auto-Grade Submission
```http
POST /api/grading/auto-grade/{submissionId}
```

### Manual Grade Submission  
```http
POST /api/grading/manual-grade/{submissionId}
Content-Type: application/json

{
  "graderId": 456,
  "manualScore": 90,
  "feedback": "Excellent work",
  "questionScores": [
    {"questionId": 789, "score": 8, "feedback": "Good analysis"}
  ]
}
```

### Finalize Grade
```http
POST /api/grading/finalize/{submissionId}
```

### Get Grading Results
```http
GET /api/grading/results/{submissionId}
```

### Re-grade Submission
```http
POST /api/grading/re-grade/{submissionId}
```

## Service Layer Usage

### GradingService Interface
```java
public interface GradingService extends BaseService<GradingResult, GradingResultDTO> {
    GradingResultDTO autoGrade(Long submissionId);
    GradingResultDTO manualGrade(Long submissionId, ManualGradingRequest request);
    GradingResultDTO finalizeGrade(Long submissionId);
    GradingResultDTO processSubmission(Long submissionId);
    boolean canAutoGrade(Long gradableId, String gradableType);
    GradingResultDTO reGrade(Long submissionId);
}
```

### Common Usage Patterns

#### 1. Process New Submission
```java
// Auto-grade if possible
GradingResultDTO result = gradingService.processSubmission(submissionId);

if (result.getStatus() == GradingStatus.AUTO_COMPLETE) {
    // Notify student of immediate results
    notificationService.notifyStudent(studentId, result);
} else if (result.getStatus() == GradingStatus.PENDING_MANUAL) {
    // Queue for teacher review
    gradingQueueService.addToQueue(submissionId, teacherId);
}
```

#### 2. Teacher Manual Grading
```java
// Get pending submissions
List<GradingResultDTO> pending = gradingService
    .findByStatusAndGrader(GradingStatus.PENDING_MANUAL, teacherId);

// Grade submission
ManualGradingRequest request = new ManualGradingRequest();
request.setGraderId(teacherId);
request.setManualScore(85);
request.setFeedback("Good work, but needs improvement in analysis");

GradingResultDTO result = gradingService.manualGrade(submissionId, request);
gradingService.finalizeGrade(submissionId);
```

#### 3. Check Auto-Grading Capability
```java
// For assignments
boolean canAutoGrade = assignmentService.canAutoGrade(assignmentId);

// For quizzes  
boolean canAutoGrade = quizService.canAutoGrade(quizId);

// Generic check
boolean canAutoGrade = gradingService.canAutoGrade(gradableId, "Assignment");
```

## Repository Queries

### GradingResultRepository
```java
@Repository
public interface GradingResultRepository extends JpaRepository<GradingResult, Long> {
    
    @Query("SELECT gr FROM GradingResult gr WHERE gr.submissionId = :submissionId")
    Optional<GradingResult> findBySubmissionId(@Param("submissionId") Long submissionId);
    
    @Query("SELECT gr FROM GradingResult gr WHERE gr.status = :status AND gr.graderId = :graderId")
    List<GradingResult> findByStatusAndGrader(@Param("status") GradingStatus status, 
                                             @Param("graderId") Long graderId);
    
    @Query("SELECT gr FROM GradingResult gr WHERE gr.status = :status")
    List<GradingResult> findByStatus(@Param("status") GradingStatus status);
}
```

### AssignmentQuestionRepository
```java
@Repository
public interface AssignmentQuestionRepository extends JpaRepository<AssignmentQuestion, Long> {
    
    @Query("SELECT aq FROM AssignmentQuestion aq WHERE aq.assignmentId = :assignmentId AND aq.autoGradable = true")
    List<AssignmentQuestion> findAutoGradableByAssignment(@Param("assignmentId") Long assignmentId);
    
    @Query("SELECT aq FROM AssignmentQuestion aq WHERE aq.assignmentId = :assignmentId AND aq.autoGradable = false")
    List<AssignmentQuestion> findManualGradableByAssignment(@Param("assignmentId") Long assignmentId);
}
```

## Configuration

### Application Properties
```properties
# Enable/disable features
grading.auto.enabled=true
grading.real-time.enabled=true
grading.hybrid.default-mode=true

# Auto-grading settings
grading.auto.mcq.threshold=0.8
grading.auto.short-answer.similarity=0.9
grading.auto.numerical.tolerance=0.01

# Performance
grading.batch.size=50
grading.timeout.seconds=30
```

## Common Workflows

### 1. Hybrid Assignment Workflow
```
Student Submits → Auto-grade MCQ/True-False → Partial Score Available
                ↓
Queue Essay Questions for Teacher → Teacher Reviews → Final Score
```

### 2. Auto-only Quiz Workflow  
```
Student Submits → Auto-grade All Questions → Final Score Available
```

### 3. Manual-only Assignment Workflow
```
Student Submits → Queue for Teacher → Teacher Grades → Final Score Available
```

## Error Handling

### Common Exceptions
```java
// Custom exceptions
public class GradingException extends RuntimeException
public class AutoGradingFailedException extends GradingException  
public class ManualGradingRequiredException extends GradingException
public class InvalidGradingStateException extends GradingException

// Global exception handler
@ExceptionHandler(GradingException.class)
public ResponseEntity<OhmaApiResponse<?>> handleGradingException(GradingException ex) {
    return GlobalExceptionHandler.errorResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
}
```

## Testing

### Unit Test Example
```java
@ExtendWith(MockitoExtension.class)
class GradingServiceImplTest {
    
    @Mock private GradingResultRepository gradingResultRepository;
    @Mock private AssignmentQuestionRepository assignmentQuestionRepository;
    
    @InjectMocks private GradingServiceImpl gradingService;
    
    @Test
    void autoGrade_WithMCQQuestions_ShouldCalculateCorrectScore() {
        // Given
        Long submissionId = 1L;
        // ... setup test data
        
        // When
        GradingResultDTO result = gradingService.autoGrade(submissionId);
        
        // Then
        assertThat(result.getAutoScore()).isEqualTo(expectedScore);
        assertThat(result.getStatus()).isEqualTo(GradingStatus.AUTO_COMPLETE);
    }
}
```

## Performance Tips

### 1. Batch Processing
```java
// Process multiple submissions
List<Long> submissionIds = Arrays.asList(1L, 2L, 3L);
List<GradingResultDTO> results = gradingService.batchAutoGrade(submissionIds);
```

### 2. Async Processing
```java
@Async
public CompletableFuture<GradingResultDTO> autoGradeAsync(Long submissionId) {
    return CompletableFuture.completedFuture(autoGrade(submissionId));
}
```

### 3. Caching
```java
@Cacheable(value = "gradingResults", key = "#submissionId")
public GradingResultDTO getGradingResult(Long submissionId) {
    return findBySubmissionId(submissionId);
}
```

## Monitoring

### Key Metrics to Track
- Auto-grading success rate
- Average grading time
- Manual grading queue length
- Teacher grading response time
- Student satisfaction scores

### Logging Examples
```java
logger.info("Auto-grading completed for submission {} with score {}", 
           submissionId, result.getAutoScore());
logger.warn("Auto-grading failed for submission {}: {}", 
           submissionId, exception.getMessage());
```

## Quick Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Auto-grading stuck | Missing correct answers | Check question configuration |
| Incorrect scores | Calculation error | Use `recalculateScore()` method |
| Slow performance | Large batches | Enable batch processing |
| Missing grades | Status not updated | Check grading workflow state |

## Architecture Compliance

### Required Base Classes
- **Entities**: Must extend `BaseEntity`
- **Services**: Must extend `BaseService` (interface) and `BaseServiceImpl` (implementation)
- **Controllers**: Must extend `BaseController`
- **Mappers**: Must implement `BaseDtoMapper`

### Example Implementation
```java
// Service Interface
public interface GradingService extends BaseService<GradingResult, GradingResultDTO> {
    // Custom methods
}

// Service Implementation  
@Service
public class GradingServiceImpl extends BaseServiceImpl<GradingResult, GradingResultDTO> 
                                implements GradingService {
    // Implementation
}

// Mapper
@Component
public class GradingResultMapper implements BaseDtoMapper<GradingResult, GradingResultDTO> {
    // Mapping logic
}
```

---

## Quick Commands

### Create Auto-Gradable Assignment
```java
Assignment assignment = new Assignment();
assignment.setGradingType(GradingType.HYBRID);
assignment.setGradingMode(GradingMode.HYBRID);
```

### Add MCQ Question
```java
AssignmentQuestion question = new AssignmentQuestion();
question.setQuestionType(QuestionType.MCQ);
question.setAutoGradable(true);
question.setCorrectAnswer("option_b");
```

### Process Submission
```java
GradingResultDTO result = gradingService.processSubmission(submissionId);
```

### Manual Grade
```java
ManualGradingRequest request = new ManualGradingRequest();
request.setManualScore(85);
gradingService.manualGrade(submissionId, request);
```

---

*Quick Reference v1.0 - Enhanced Grading System* 
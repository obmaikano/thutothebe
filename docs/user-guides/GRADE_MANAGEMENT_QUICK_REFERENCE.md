# Grade Management Quick Reference

## Quick Start

### 1. Create a Grade for a Category
```bash
curl -X POST "http://localhost:8080/api/grades/category" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "studentId=123&gradeCategoryId=456&score=85.5&gradedById=789&feedback=Good work"
```

### 2. Get Student Grades
```bash
curl "http://localhost:8080/api/grades/student/123"
```

### 3. Moderate a Grade
```bash
curl -X POST "http://localhost:8080/api/grades/moderate/123" \
  -d "moderatorId=456&moderationNotes=Adjusted score&newScore=88.0"
```

### 4. Get Grade Statistics
```bash
curl "http://localhost:8080/api/grades/statistics/average/student/123"
curl "http://localhost:8080/api/grades/statistics/average/category/456"
```

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/grades/student/{id}` | Get all grades for student |
| GET | `/api/grades/course/{id}` | Get all grades for course |
| GET | `/api/grades/category/{id}` | Get all grades in category |
| POST | `/api/grades/category` | Create grade for category |
| POST | `/api/grades/moderate/{id}` | Moderate a grade |
| GET | `/api/grades/statistics/average/category/{id}` | Category average |

## Entity Relationships

```
Grade {
  studentId: Long (required)
  courseId: Long (required)
  gradeCategoryId: Long (optional)
  score: Double (0-100, required)
  gradeType: GradeType (required)
  gradedById: Long (required)
  feedback: String (optional)
}
```

## Grade Types
- `ASSIGNMENT` - Individual assignments
- `ASSESSMENT` - Tests and assessments
- `QUIZ` - Quizzes
- `EXAM` - Examinations
- `PROJECT` - Projects
- `PARTICIPATION` - Class participation
- `CONTINUOUS` - Continuous assessment
- `FINAL` - Final examination

## Common Use Cases

### Create Grade with Category
```java
GradeDTO grade = gradeService.createGradeForCategory(
    studentId, categoryId, score, teacherId, feedback);
```

### Calculate Statistics
```java
Double average = gradeService.calculateAverageScoreByGradeCategory(categoryId);
Long passingCount = gradeService.countPassingGradesByGradeCategory(categoryId, 50.0);
```

### Bulk Operations
```java
List<GradeDTO> grades = gradeService.bulkCreateGrades(gradeList);
```

### Grade Moderation
```java
GradeDTO moderated = gradeService.moderateGrade(
    gradeId, moderatorId, "Adjustment reason", newScore);
```

## Response Format

```json
{
  "status": "SUCCESS",
  "message": "Operation completed",
  "data": { /* result data */ },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Error Handling

Common error responses:
- `400 Bad Request` - Invalid input data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Testing

### Unit Test Template
```java
@Test
void testGradeOperation() {
    // Given
    when(repository.method()).thenReturn(expectedResult);
    
    // When
    Result actual = service.operation(params);
    
    // Then
    assertEquals(expected, actual);
    verify(repository).method();
}
```

### Integration Test Template
```java
@SpringBootTest
@Transactional
class GradeIntegrationTest {
    @Autowired private GradeService gradeService;
    
    @Test
    void testGradeLifecycle() {
        // Create, modify, verify
    }
}
```

## Performance Tips

1. **Use EntityGraph**: Prevents N+1 queries
2. **Batch Operations**: Use bulk methods for multiple grades
3. **Pagination**: Use paginated endpoints for large datasets
4. **Caching**: Cache frequently accessed statistics

## Security Notes

- Validate all input parameters
- Check user permissions before operations
- Log all grade modifications
- Protect student data privacy 
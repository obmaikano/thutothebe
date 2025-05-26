# Grade Management API Specification

## Base URL
```
http://localhost:8080/api/grades
```

## Authentication
All endpoints require proper authentication and authorization based on user roles.

## Response Format
All responses follow the standard OhmaApiResponse format:

```json
{
  "status": "SUCCESS" | "ERROR",
  "message": "Human readable message",
  "data": "Response data or null",
  "timestamp": "ISO 8601 timestamp"
}
```

## Endpoints

### 1. Basic CRUD Operations

#### Get All Grades
```http
GET /api/grades
```

**Response:**
```json
{
  "status": "SUCCESS",
  "message": "Grades retrieved successfully",
  "data": [
    {
      "id": 1,
      "studentId": 123,
      "courseId": 456,
      "gradeCategoryId": 789,
      "score": 85.5,
      "gradeType": "ASSIGNMENT",
      "feedback": "Good work",
      "active": true
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Get Grade by ID
```http
GET /api/grades/{id}
```

**Parameters:**
- `id` (path): Grade ID

**Response:**
```json
{
  "status": "SUCCESS",
  "message": "Grade retrieved successfully",
  "data": {
    "id": 1,
    "studentId": 123,
    "courseId": 456,
    "gradeCategoryId": 789,
    "assessmentId": null,
    "assignmentId": null,
    "gradeType": "ASSIGNMENT",
    "score": 85.5,
    "maxScore": 100.0,
    "weight": 1.0,
    "feedback": "Good work",
    "gradedById": 999,
    "gradedAt": "2024-01-15T10:00:00Z",
    "isFinal": false,
    "isModerated": false,
    "moderatedById": null,
    "moderatedAt": null,
    "moderationNotes": null,
    "originalScore": null,
    "active": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "modifiedAt": "2024-01-15T10:00:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Create Grade
```http
POST /api/grades
```

**Request Body:**
```json
{
  "studentId": 123,
  "courseId": 456,
  "gradeCategoryId": 789,
  "gradeType": "ASSIGNMENT",
  "score": 85.5,
  "maxScore": 100.0,
  "weight": 1.0,
  "feedback": "Good work",
  "gradedById": 999,
  "isFinal": false
}
```

**Response:**
```json
{
  "status": "SUCCESS",
  "message": "Grade created successfully",
  "data": {
    "id": 1,
    "studentId": 123,
    "courseId": 456,
    "gradeCategoryId": 789,
    "score": 85.5,
    "gradeType": "ASSIGNMENT",
    "feedback": "Good work",
    "active": true
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Update Grade
```http
PUT /api/grades/{id}
```

**Parameters:**
- `id` (path): Grade ID

**Request Body:**
```json
{
  "score": 88.0,
  "feedback": "Updated feedback",
  "isFinal": true
}
```

#### Delete Grade
```http
DELETE /api/grades/{id}
```

**Parameters:**
- `id` (path): Grade ID

### 2. Student Grade Queries

#### Get Grades by Student
```http
GET /api/grades/student/{studentId}
```

**Parameters:**
- `studentId` (path): Student ID

#### Get Student Grades in Course
```http
GET /api/grades/student/{studentId}/course/{courseId}
```

**Parameters:**
- `studentId` (path): Student ID
- `courseId` (path): Course ID

#### Get Student Grades in Category
```http
GET /api/grades/student/{studentId}/category/{gradeCategoryId}
```

**Parameters:**
- `studentId` (path): Student ID
- `gradeCategoryId` (path): Grade Category ID

#### Get Paginated Student Grades
```http
GET /api/grades/student/{studentId}/paginated?page=0&size=10&sort=gradedAt,desc
```

**Parameters:**
- `studentId` (path): Student ID
- `page` (query): Page number (default: 0)
- `size` (query): Page size (default: 20)
- `sort` (query): Sort criteria

### 3. Course and Category Queries

#### Get Grades by Course
```http
GET /api/grades/course/{courseId}
```

**Parameters:**
- `courseId` (path): Course ID

#### Get Grades by Category
```http
GET /api/grades/category/{gradeCategoryId}
```

**Parameters:**
- `gradeCategoryId` (path): Grade Category ID

#### Get Grades by Type
```http
GET /api/grades/type/{gradeType}
```

**Parameters:**
- `gradeType` (path): Grade Type (ASSIGNMENT, ASSESSMENT, QUIZ, EXAM, etc.)

#### Get Grades by Term
```http
GET /api/grades/term/{term}
```

**Parameters:**
- `term` (path): Academic Term (FIRST_TERM, SECOND_TERM, THIRD_TERM)

### 4. Assessment and Assignment Grades

#### Get Grades by Assessment
```http
GET /api/grades/assessment/{assessmentId}
```

**Parameters:**
- `assessmentId` (path): Assessment ID

#### Get Grades by Assignment
```http
GET /api/grades/assignment/{assignmentId}
```

**Parameters:**
- `assignmentId` (path): Assignment ID

#### Get Grades by Teacher
```http
GET /api/grades/teacher/{teacherId}
```

**Parameters:**
- `teacherId` (path): Teacher ID

### 5. Statistics and Analytics

#### Get Student Average
```http
GET /api/grades/statistics/average/student/{studentId}
```

**Parameters:**
- `studentId` (path): Student ID

**Response:**
```json
{
  "status": "SUCCESS",
  "message": "Student average calculated successfully",
  "data": 78.5,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Get Course Average
```http
GET /api/grades/statistics/average/course/{courseId}
```

**Parameters:**
- `courseId` (path): Course ID

#### Get Category Average
```http
GET /api/grades/statistics/average/category/{gradeCategoryId}
```

**Parameters:**
- `gradeCategoryId` (path): Grade Category ID

#### Get Student-Course Average
```http
GET /api/grades/statistics/average/student/{studentId}/course/{courseId}
```

**Parameters:**
- `studentId` (path): Student ID
- `courseId` (path): Course ID

### 6. Grade Creation

#### Create Grade for Assessment
```http
POST /api/grades/assessment
```

**Parameters:**
- `studentId` (form): Student ID
- `assessmentId` (form): Assessment ID
- `score` (form): Score (0-100)
- `gradedById` (form): Grader User ID

**Example:**
```bash
curl -X POST "http://localhost:8080/api/grades/assessment" \
  -d "studentId=123&assessmentId=456&score=85.5&gradedById=789"
```

#### Create Grade for Assignment
```http
POST /api/grades/assignment
```

**Parameters:**
- `studentId` (form): Student ID
- `assignmentId` (form): Assignment ID
- `score` (form): Score (0-100)
- `gradedById` (form): Grader User ID

#### Create Grade for Category
```http
POST /api/grades/category
```

**Parameters:**
- `studentId` (form): Student ID
- `gradeCategoryId` (form): Grade Category ID
- `score` (form): Score (0-100)
- `gradedById` (form): Grader User ID
- `feedback` (form, optional): Feedback text

**Example:**
```bash
curl -X POST "http://localhost:8080/api/grades/category" \
  -d "studentId=123&gradeCategoryId=456&score=85.5&gradedById=789&feedback=Excellent work"
```

#### Bulk Create Grades
```http
POST /api/grades/bulk
```

**Request Body:**
```json
[
  {
    "studentId": 123,
    "courseId": 456,
    "gradeCategoryId": 789,
    "gradeType": "ASSIGNMENT",
    "score": 85.5,
    "gradedById": 999
  },
  {
    "studentId": 124,
    "courseId": 456,
    "gradeCategoryId": 789,
    "gradeType": "ASSIGNMENT",
    "score": 78.0,
    "gradedById": 999
  }
]
```

### 7. Grade Moderation

#### Moderate Grade
```http
POST /api/grades/moderate/{gradeId}
```

**Parameters:**
- `gradeId` (path): Grade ID
- `moderatorId` (form): Moderator User ID
- `moderationNotes` (form): Moderation notes
- `newScore` (form): New score

**Example:**
```bash
curl -X POST "http://localhost:8080/api/grades/moderate/123" \
  -d "moderatorId=456&moderationNotes=Adjusted for partial credit&newScore=78.0"
```

#### Get Unmoderated Grades
```http
GET /api/grades/unmoderated
```

#### Get Moderated Grades
```http
GET /api/grades/moderated
```

### 8. Grade Management

#### Deactivate Grade
```http
PUT /api/grades/{gradeId}/deactivate
```

**Parameters:**
- `gradeId` (path): Grade ID

#### Reactivate Grade
```http
PUT /api/grades/{gradeId}/reactivate
```

**Parameters:**
- `gradeId` (path): Grade ID

#### Check Grade Existence for Assessment
```http
GET /api/grades/exists/student/{studentId}/assessment/{assessmentId}
```

**Parameters:**
- `studentId` (path): Student ID
- `assessmentId` (path): Assessment ID

**Response:**
```json
{
  "status": "SUCCESS",
  "message": "Grade existence checked successfully",
  "data": true,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Check Grade Existence for Assignment
```http
GET /api/grades/exists/student/{studentId}/assignment/{assignmentId}
```

**Parameters:**
- `studentId` (path): Student ID
- `assignmentId` (path): Assignment ID

#### Check Grade Existence for Category
```http
GET /api/grades/exists/student/{studentId}/category/{gradeCategoryId}
```

**Parameters:**
- `studentId` (path): Student ID
- `gradeCategoryId` (path): Grade Category ID

## Data Models

### GradeDTO
```json
{
  "id": "Long (auto-generated)",
  "studentId": "Long (required)",
  "courseId": "Long (required)",
  "gradeCategoryId": "Long (optional)",
  "assessmentId": "Long (optional)",
  "assignmentId": "Long (optional)",
  "gradeType": "GradeType enum (required)",
  "score": "Double 0-100 (required)",
  "maxScore": "Double 0-100 (optional, default: 100)",
  "weight": "Double (optional, default: 1.0)",
  "feedback": "String (optional)",
  "gradedById": "Long (required)",
  "gradedAt": "LocalDateTime (auto-generated)",
  "isFinal": "boolean (default: false)",
  "isModerated": "boolean (default: false)",
  "moderatedById": "Long (optional)",
  "moderatedAt": "LocalDateTime (optional)",
  "moderationNotes": "String (optional)",
  "originalScore": "Double (optional)",
  "active": "boolean (default: true)",
  "createdAt": "LocalDateTime (auto-generated)",
  "modifiedAt": "LocalDateTime (auto-updated)"
}
```

### GradeType Enum
- `ASSIGNMENT` - Individual assignments
- `ASSESSMENT` - Tests and assessments
- `QUIZ` - Quizzes
- `EXAM` - Examinations
- `PROJECT` - Projects
- `PARTICIPATION` - Class participation
- `CONTINUOUS` - Continuous assessment
- `FINAL` - Final examination

## Error Responses

### 400 Bad Request
```json
{
  "status": "ERROR",
  "message": "Invalid input: Score must be between 0 and 100",
  "data": null,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 404 Not Found
```json
{
  "status": "ERROR",
  "message": "Grade not found with id: 123",
  "data": null,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 500 Internal Server Error
```json
{
  "status": "ERROR",
  "message": "Internal server error occurred",
  "data": null,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Rate Limiting
- Standard rate limiting applies: 1000 requests per hour per user
- Bulk operations have lower limits: 100 requests per hour

## Validation Rules

### Score Validation
- Must be between 0.0 and 100.0
- Required for all grade creation operations
- Cannot be null

### Required Fields
- `studentId`: Must reference existing student
- `courseId`: Must reference existing course
- `gradeType`: Must be valid GradeType enum value
- `score`: Must be valid decimal between 0-100
- `gradedById`: Must reference existing user

### Optional Fields
- `gradeCategoryId`: If provided, must reference existing category
- `assessmentId`: If provided, must reference existing assessment
- `assignmentId`: If provided, must reference existing assignment
- `feedback`: Free text, max 1000 characters
- `weight`: If provided, must be positive number

## Best Practices

1. **Always validate input**: Check all required fields before submission
2. **Use appropriate grade types**: Select the correct GradeType for the assessment
3. **Provide meaningful feedback**: Include constructive feedback for students
4. **Handle errors gracefully**: Check response status and handle errors appropriately
5. **Use bulk operations**: For multiple grades, use bulk endpoints for better performance
6. **Implement proper authorization**: Ensure users can only access/modify appropriate grades 
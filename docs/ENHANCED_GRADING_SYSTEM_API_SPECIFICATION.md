# Enhanced Grading System - API Specification

## Overview

This document provides comprehensive API specifications for the Enhanced Grading System, including all endpoints, request/response formats, authentication requirements, and error handling.

## Base Information

- **Base URL**: `/api`
- **API Version**: `v1`
- **Content Type**: `application/json`
- **Authentication**: JWT Bearer Token required for all endpoints

## Table of Contents

1. [Grading Management APIs](#grading-management-apis)
2. [Assignment Question Management APIs](#assignment-question-management-apis)
3. [Assignment Response Management APIs](#assignment-response-management-apis)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Authentication](#authentication)

## Grading Management APIs

### 1. Auto-Grade Submission

Automatically grades a submission based on auto-gradable questions.

**Endpoint**: `POST /api/grading/auto-grade/{submissionId}`

**Parameters**:
- `submissionId` (path, required): The ID of the submission to auto-grade

**Request Headers**:
```http
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Response**:
```json
{
  "status": "success",
  "message": "Auto-grading completed successfully",
  "data": {
    "id": 123,
    "submissionId": 456,
    "graderId": null,
    "autoScore": 85,
    "manualScore": null,
    "finalScore": 85,
    "status": "AUTO_COMPLETE",
    "feedback": "Auto-graded: 17/20 questions correct",
    "gradedAt": "2024-01-15T10:30:00Z",
    "autoGradedAt": "2024-01-15T10:30:00Z",
    "manualGradedAt": null,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid submission ID or submission not found
- `409 Conflict`: Submission already graded
- `422 Unprocessable Entity`: No auto-gradable questions found

---

### 2. Manual Grade Submission

Allows teachers to manually grade a submission.

**Endpoint**: `POST /api/grading/manual-grade/{submissionId}`

**Parameters**:
- `submissionId` (path, required): The ID of the submission to manually grade

**Request Body**:
```json
{
  "graderId": 789,
  "manualScore": 90,
  "feedback": "Excellent work on the essay portion. Good analysis and clear writing.",
  "questionScores": [
    {
      "questionId": 101,
      "score": 18,
      "feedback": "Good analysis, but could elaborate more on the conclusion"
    },
    {
      "questionId": 102,
      "score": 20,
      "feedback": "Excellent understanding of the concept"
    }
  ]
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Manual grading completed successfully",
  "data": {
    "id": 123,
    "submissionId": 456,
    "graderId": 789,
    "autoScore": 85,
    "manualScore": 90,
    "finalScore": 90,
    "status": "MANUAL_COMPLETE",
    "feedback": "Excellent work on the essay portion. Good analysis and clear writing.",
    "gradedAt": "2024-01-15T11:45:00Z",
    "autoGradedAt": "2024-01-15T10:30:00Z",
    "manualGradedAt": "2024-01-15T11:45:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:45:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data
- `403 Forbidden`: User not authorized to grade this submission
- `404 Not Found`: Submission not found

---

### 3. Finalize Grade

Finalizes the grading process and calculates the final score.

**Endpoint**: `POST /api/grading/finalize/{submissionId}`

**Parameters**:
- `submissionId` (path, required): The ID of the submission to finalize

**Response**:
```json
{
  "status": "success",
  "message": "Grade finalized successfully",
  "data": {
    "id": 123,
    "submissionId": 456,
    "graderId": 789,
    "autoScore": 85,
    "manualScore": 90,
    "finalScore": 88,
    "status": "COMPLETE",
    "feedback": "Combined auto and manual grading completed",
    "gradedAt": "2024-01-15T12:00:00Z",
    "autoGradedAt": "2024-01-15T10:30:00Z",
    "manualGradedAt": "2024-01-15T11:45:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

### 4. Get Grading Results

Retrieves grading results for a specific submission.

**Endpoint**: `GET /api/grading/results/{submissionId}`

**Parameters**:
- `submissionId` (path, required): The ID of the submission

**Response**:
```json
{
  "status": "success",
  "message": "Grading results retrieved successfully",
  "data": {
    "id": 123,
    "submissionId": 456,
    "graderId": 789,
    "autoScore": 85,
    "manualScore": 90,
    "finalScore": 88,
    "status": "COMPLETE",
    "feedback": "Combined auto and manual grading completed",
    "gradedAt": "2024-01-15T12:00:00Z",
    "autoGradedAt": "2024-01-15T10:30:00Z",
    "manualGradedAt": "2024-01-15T11:45:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

### 5. Re-grade Submission

Re-grades a submission, recalculating scores based on current grading rules.

**Endpoint**: `POST /api/grading/re-grade/{submissionId}`

**Parameters**:
- `submissionId` (path, required): The ID of the submission to re-grade

**Response**:
```json
{
  "status": "success",
  "message": "Re-grading completed successfully",
  "data": {
    "id": 123,
    "submissionId": 456,
    "graderId": 789,
    "autoScore": 87,
    "manualScore": 90,
    "finalScore": 89,
    "status": "COMPLETE",
    "feedback": "Re-graded with updated scoring rules",
    "gradedAt": "2024-01-15T14:30:00Z",
    "autoGradedAt": "2024-01-15T14:30:00Z",
    "manualGradedAt": "2024-01-15T11:45:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
}
```

---

### 6. Get Pending Grading

Retrieves submissions pending manual grading for a specific teacher.

**Endpoint**: `GET /api/grading/pending`

**Query Parameters**:
- `graderId` (optional): Filter by specific grader
- `status` (optional): Filter by grading status
- `page` (optional, default: 0): Page number
- `size` (optional, default: 20): Page size

**Response**:
```json
{
  "status": "success",
  "message": "Pending grading retrieved successfully",
  "data": {
    "content": [
      {
        "id": 124,
        "submissionId": 457,
        "graderId": null,
        "autoScore": 75,
        "manualScore": null,
        "finalScore": null,
        "status": "PENDING_MANUAL",
        "feedback": null,
        "gradedAt": null,
        "autoGradedAt": "2024-01-15T09:15:00Z",
        "manualGradedAt": null,
        "createdAt": "2024-01-15T09:15:00Z",
        "updatedAt": "2024-01-15T09:15:00Z"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20,
      "sort": {
        "sorted": true,
        "direction": "DESC",
        "property": "createdAt"
      }
    },
    "totalElements": 1,
    "totalPages": 1,
    "first": true,
    "last": true
  }
}
```

## Assignment Question Management APIs

### 1. Create Assignment Question

Creates a new question for an assignment.

**Endpoint**: `POST /api/assignments/{assignmentId}/questions`

**Parameters**:
- `assignmentId` (path, required): The ID of the assignment

**Request Body**:
```json
{
  "questionText": "What is the capital of France?",
  "questionType": "MCQ",
  "correctAnswer": "Paris",
  "points": 10,
  "orderIndex": 1,
  "autoGradable": true,
  "options": [
    {
      "optionText": "London",
      "isCorrect": false
    },
    {
      "optionText": "Paris",
      "isCorrect": true
    },
    {
      "optionText": "Berlin",
      "isCorrect": false
    },
    {
      "optionText": "Madrid",
      "isCorrect": false
    }
  ]
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Assignment question created successfully",
  "data": {
    "id": 201,
    "assignmentId": 301,
    "questionText": "What is the capital of France?",
    "questionType": "MCQ",
    "correctAnswer": "Paris",
    "points": 10,
    "orderIndex": 1,
    "autoGradable": true,
    "options": [
      {
        "id": 401,
        "questionId": 201,
        "optionText": "London",
        "isCorrect": false
      },
      {
        "id": 402,
        "questionId": 201,
        "optionText": "Paris",
        "isCorrect": true
      },
      {
        "id": 403,
        "questionId": 201,
        "optionText": "Berlin",
        "isCorrect": false
      },
      {
        "id": 404,
        "questionId": 201,
        "optionText": "Madrid",
        "isCorrect": false
      }
    ],
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-01-15T08:00:00Z"
  }
}
```

---

### 2. Get Assignment Questions

Retrieves all questions for a specific assignment.

**Endpoint**: `GET /api/assignments/{assignmentId}/questions`

**Parameters**:
- `assignmentId` (path, required): The ID of the assignment

**Query Parameters**:
- `autoGradable` (optional): Filter by auto-gradable status
- `questionType` (optional): Filter by question type

**Response**:
```json
{
  "status": "success",
  "message": "Assignment questions retrieved successfully",
  "data": [
    {
      "id": 201,
      "assignmentId": 301,
      "questionText": "What is the capital of France?",
      "questionType": "MCQ",
      "correctAnswer": "Paris",
      "points": 10,
      "orderIndex": 1,
      "autoGradable": true,
      "options": [
        {
          "id": 401,
          "questionId": 201,
          "optionText": "London",
          "isCorrect": false
        },
        {
          "id": 402,
          "questionId": 201,
          "optionText": "Paris",
          "isCorrect": true
        }
      ],
      "createdAt": "2024-01-15T08:00:00Z",
      "updatedAt": "2024-01-15T08:00:00Z"
    }
  ]
}
```

---

### 3. Update Assignment Question

Updates an existing assignment question.

**Endpoint**: `PUT /api/assignments/{assignmentId}/questions/{questionId}`

**Parameters**:
- `assignmentId` (path, required): The ID of the assignment
- `questionId` (path, required): The ID of the question

**Request Body**:
```json
{
  "questionText": "What is the capital city of France?",
  "questionType": "MCQ",
  "correctAnswer": "Paris",
  "points": 15,
  "orderIndex": 1,
  "autoGradable": true,
  "options": [
    {
      "id": 401,
      "optionText": "London",
      "isCorrect": false
    },
    {
      "id": 402,
      "optionText": "Paris",
      "isCorrect": true
    },
    {
      "optionText": "Rome",
      "isCorrect": false
    }
  ]
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Assignment question updated successfully",
  "data": {
    "id": 201,
    "assignmentId": 301,
    "questionText": "What is the capital city of France?",
    "questionType": "MCQ",
    "correctAnswer": "Paris",
    "points": 15,
    "orderIndex": 1,
    "autoGradable": true,
    "options": [
      {
        "id": 401,
        "questionId": 201,
        "optionText": "London",
        "isCorrect": false
      },
      {
        "id": 402,
        "questionId": 201,
        "optionText": "Paris",
        "isCorrect": true
      },
      {
        "id": 405,
        "questionId": 201,
        "optionText": "Rome",
        "isCorrect": false
      }
    ],
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-01-15T09:30:00Z"
  }
}
```

---

### 4. Delete Assignment Question

Deletes an assignment question.

**Endpoint**: `DELETE /api/assignments/{assignmentId}/questions/{questionId}`

**Parameters**:
- `assignmentId` (path, required): The ID of the assignment
- `questionId` (path, required): The ID of the question

**Response**:
```json
{
  "status": "success",
  "message": "Assignment question deleted successfully",
  "data": null
}
```

## Assignment Response Management APIs

### 1. Submit Assignment Response

Submits a student's response to an assignment question.

**Endpoint**: `POST /api/assignments/responses`

**Request Body**:
```json
{
  "submissionId": 456,
  "questionId": 201,
  "responseText": "Paris"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Assignment response submitted successfully",
  "data": {
    "id": 501,
    "submissionId": 456,
    "questionId": 201,
    "responseText": "Paris",
    "scoreAwarded": null,
    "autoGraded": false,
    "feedback": null,
    "createdAt": "2024-01-15T10:15:00Z",
    "updatedAt": "2024-01-15T10:15:00Z"
  }
}
```

---

### 2. Get Assignment Responses

Retrieves all responses for a specific submission.

**Endpoint**: `GET /api/assignments/responses`

**Query Parameters**:
- `submissionId` (required): The ID of the submission
- `questionId` (optional): Filter by specific question

**Response**:
```json
{
  "status": "success",
  "message": "Assignment responses retrieved successfully",
  "data": [
    {
      "id": 501,
      "submissionId": 456,
      "questionId": 201,
      "responseText": "Paris",
      "scoreAwarded": 10,
      "autoGraded": true,
      "feedback": "Correct answer",
      "createdAt": "2024-01-15T10:15:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## Data Models

### GradingResultDTO

```json
{
  "id": "Long",
  "submissionId": "Long",
  "graderId": "Long (nullable)",
  "autoScore": "Integer (nullable)",
  "manualScore": "Integer (nullable)",
  "finalScore": "Integer (nullable)",
  "status": "GradingStatus",
  "feedback": "String (nullable)",
  "gradedAt": "LocalDateTime (nullable)",
  "autoGradedAt": "LocalDateTime (nullable)",
  "manualGradedAt": "LocalDateTime (nullable)",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### AssignmentQuestionDTO

```json
{
  "id": "Long",
  "assignmentId": "Long",
  "questionText": "String",
  "questionType": "QuestionType",
  "correctAnswer": "String (nullable)",
  "points": "Integer",
  "orderIndex": "Integer",
  "autoGradable": "Boolean",
  "options": "List<AssignmentQuestionOptionDTO>",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### AssignmentQuestionOptionDTO

```json
{
  "id": "Long",
  "questionId": "Long",
  "optionText": "String",
  "isCorrect": "Boolean",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### AssignmentResponseDTO

```json
{
  "id": "Long",
  "submissionId": "Long",
  "questionId": "Long",
  "responseText": "String",
  "scoreAwarded": "Integer (nullable)",
  "autoGraded": "Boolean",
  "feedback": "String (nullable)",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### ManualGradingRequest

```json
{
  "graderId": "Long",
  "manualScore": "Integer",
  "feedback": "String (nullable)",
  "questionScores": [
    {
      "questionId": "Long",
      "score": "Integer",
      "feedback": "String (nullable)"
    }
  ]
}
```

## Enums

### GradingStatus
- `PENDING`: Awaiting grading
- `AUTO_COMPLETE`: Automatic grading completed
- `PENDING_MANUAL`: Awaiting manual grading
- `MANUAL_COMPLETE`: Manual grading completed
- `COMPLETE`: All grading completed
- `REQUIRES_REVIEW`: Requires instructor review

### GradingType
- `AUTO`: Fully automatic grading
- `MANUAL`: Manual grading only
- `HYBRID`: Combination of auto and manual grading

### GradingMode
- `AUTO_ONLY`: Only automatic grading allowed
- `MANUAL_ONLY`: Only manual grading allowed
- `HYBRID`: Both automatic and manual grading supported

### QuestionType
- `MCQ`: Multiple Choice Question
- `TRUE_FALSE`: True/False Question
- `SHORT_ANSWER`: Short Answer Question
- `ESSAY`: Essay Question
- `NUMERICAL`: Numerical Answer Question

## Error Handling

### Standard Error Response Format

```json
{
  "status": "error",
  "message": "Error description",
  "data": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/grading/auto-grade/123"
}
```

### HTTP Status Codes

- `200 OK`: Successful operation
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., already graded)
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

### Common Error Scenarios

#### Grading Errors

```json
{
  "status": "error",
  "message": "Submission has already been graded",
  "data": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/grading/auto-grade/123"
}
```

#### Validation Errors

```json
{
  "status": "error",
  "message": "Validation failed",
  "data": {
    "errors": [
      {
        "field": "manualScore",
        "message": "Score must be between 0 and 100"
      },
      {
        "field": "graderId",
        "message": "Grader ID is required"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/grading/manual-grade/123"
}
```

#### Authorization Errors

```json
{
  "status": "error",
  "message": "You are not authorized to grade this submission",
  "data": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/grading/manual-grade/123"
}
```

## Authentication

### JWT Token Requirements

All API endpoints require a valid JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Required Claims

The JWT token must contain the following claims:
- `sub`: User ID
- `role`: User role (STUDENT, TEACHER, ADMIN)
- `exp`: Token expiration time
- `iat`: Token issued at time

### Role-based Access Control

#### Students
- Can submit assignment responses
- Can view their own grading results
- Cannot access grading management endpoints

#### Teachers
- Can manually grade submissions for their assignments
- Can view grading results for their assignments
- Can create/update/delete assignment questions
- Cannot access admin-only endpoints

#### Administrators
- Full access to all grading endpoints
- Can override any grading decisions
- Can access system-wide grading statistics

## Rate Limiting

### Default Limits
- **General API calls**: 1000 requests per hour per user
- **Auto-grading**: 100 requests per hour per user
- **Bulk operations**: 10 requests per hour per user

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

## Versioning

### API Versioning Strategy
- **URL Versioning**: `/api/v1/grading/...`
- **Current Version**: v1
- **Backward Compatibility**: Maintained for at least 2 major versions

### Version Migration
When upgrading API versions:
1. Review breaking changes in changelog
2. Update client applications
3. Test thoroughly in staging environment
4. Monitor for errors after deployment

---

## Support and Documentation

- **API Documentation**: Available at `/api/docs`
- **Swagger UI**: Available at `/api/swagger-ui`
- **Postman Collection**: Available in project repository
- **Support**: Contact development team for technical support

---

*API Specification v1.0 - Enhanced Grading System*
*Last Updated: January 2024* 
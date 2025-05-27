# Calendar Event Module Usage Guide

This guide provides detailed instructions on how to use the Calendar Event module in the Thutothebe Learning Management System.

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Creating Events](#creating-events)
4. [Managing Events](#managing-events)
5. [Calendar Views](#calendar-views)
6. [Approval Workflow](#approval-workflow)
7. [Recurring Events](#recurring-events)
8. [Search and Filtering](#search-and-filtering)
9. [Bulk Operations](#bulk-operations)
10. [Academic Calendar](#academic-calendar)
11. [API Examples](#api-examples)
12. [Best Practices](#best-practices)

## Overview

The Calendar Event module provides comprehensive event management capabilities for educational institutions. It supports various event types, scopes, and workflows to accommodate different organizational needs.

### Key Concepts

- **Event Types**: Categorize events (academic, administrative, extracurricular, etc.)
- **Event Scopes**: Define visibility (global, regional, school, class, course, personal)
- **Event Status**: Track lifecycle (draft, scheduled, ongoing, completed, cancelled)
- **Recurring Events**: Create repeating events with various patterns
- **Approval Workflow**: Require approval for certain events before publication

## Getting Started

### Prerequisites
- Valid user account with appropriate permissions
- Understanding of your institution's organizational structure (regions, schools, classes)

### Basic Event Structure
Every event requires:
- **Title**: Descriptive name for the event
- **Start Time**: When the event begins
- **End Time**: When the event ends
- **Event Type**: Category of the event
- **Scope**: Who can see the event
- **Created By**: User creating the event

## Creating Events

### Simple Event Creation

```json
POST /api/calendar-events
{
  "title": "Mathematics Class",
  "description": "Algebra fundamentals",
  "startTime": "2024-03-15T09:00:00",
  "endTime": "2024-03-15T10:30:00",
  "location": "Room 101",
  "eventType": "CLASS_SESSION",
  "priority": "MEDIUM",
  "scope": "CLASS",
  "createdById": 1,
  "schoolId": 1,
  "targetClassId": 5,
  "isPublic": true
}
```

### Event with Attendees and Organizers

```json
POST /api/calendar-events
{
  "title": "Parent-Teacher Meeting",
  "description": "Quarterly progress discussion",
  "startTime": "2024-03-20T14:00:00",
  "endTime": "2024-03-20T16:00:00",
  "location": "Conference Room A",
  "eventType": "PARENT_MEETING",
  "priority": "HIGH",
  "scope": "SCHOOL",
  "createdById": 1,
  "schoolId": 1,
  "attendeeIds": [10, 11, 12],
  "organizerIds": [1, 2],
  "requiresApproval": true,
  "maxAttendees": 50,
  "registrationRequired": true,
  "registrationDeadline": "2024-03-18T23:59:59"
}
```

### Event Types by Category

#### Academic Events
- `ACADEMIC_TERM_START` - Beginning of academic term
- `ACADEMIC_TERM_END` - End of academic term
- `SEMESTER_START` - Semester beginning
- `SEMESTER_END` - Semester conclusion

#### Examination Events
- `EXAM_PERIOD` - General examination period
- `MIDTERM_EXAM` - Mid-semester examinations
- `FINAL_EXAM` - Final examinations
- `ASSESSMENT` - Continuous assessments

#### Class Events
- `CLASS_SESSION` - Regular class sessions
- `LECTURE` - Formal lectures
- `TUTORIAL` - Tutorial sessions
- `LAB_SESSION` - Laboratory sessions
- `FIELD_TRIP` - Educational field trips

## Managing Events

### Adding Attendees
```http
POST /api/calendar-events/123/attendees/456
```

### Removing Attendees
```http
DELETE /api/calendar-events/123/attendees/456
```

### Adding Organizers
```http
POST /api/calendar-events/123/organizers/789
```

### Status Management

#### Mark Event as Ongoing
```http
PUT /api/calendar-events/123/status/ongoing
```

#### Mark Event as Completed
```http
PUT /api/calendar-events/123/status/completed
```

#### Cancel Event
```http
PUT /api/calendar-events/123/cancel?reason=Weather conditions
```

#### Postpone Event
```http
PUT /api/calendar-events/123/postpone?newStartTime=2024-03-16T09:00:00&newEndTime=2024-03-16T10:30:00
```

## Calendar Views

### Get Month View
```http
GET /api/calendar-events/month/123/2024/3
```

### Get Week Events
```http
GET /api/calendar-events/calendar-view/123?startDate=2024-03-11T00:00:00&endDate=2024-03-17T23:59:59
```

### Get Today's Events
```http
GET /api/calendar-events/today
```

### Get Upcoming Events
```http
GET /api/calendar-events/upcoming
```

## Approval Workflow

### Events Requiring Approval
Set `requiresApproval: true` when creating events that need administrative approval.

### Get Pending Approvals
```http
GET /api/calendar-events/pending-approval
```

### Approve Event
```http
PUT /api/calendar-events/123/approve?approverId=456&approvalNotes=Approved for scheduling
```

### Reject Event
```http
PUT /api/calendar-events/123/reject?approverId=456&rejectionNotes=Conflicts with existing event
```

## Recurring Events

### Creating Recurring Events

```json
POST /api/calendar-events
{
  "title": "Weekly Staff Meeting",
  "startTime": "2024-03-15T10:00:00",
  "endTime": "2024-03-15T11:00:00",
  "eventType": "STAFF_MEETING",
  "scope": "SCHOOL",
  "isRecurring": true,
  "recurrenceRule": "weekly",
  "recurrenceEndDate": "2024-06-15T11:00:00",
  "createdById": 1,
  "schoolId": 1
}
```

### Recurrence Patterns
- `daily` - Every day
- `weekly` - Every week
- `monthly` - Every month
- `yearly` - Every year

### Generate Recurring Events
```http
POST /api/calendar-events/123/generate-recurring?until=2024-12-31T23:59:59
```

## Search and Filtering

### Search Events
```http
GET /api/calendar-events/search?searchTerm=mathematics
```

### Filter by Type
```http
GET /api/calendar-events/type/CLASS_SESSION
```

### Filter by Status
```http
GET /api/calendar-events/status/SCHEDULED
```

### Filter by Scope
```http
GET /api/calendar-events/scope/SCHOOL
```

### Date Range Filtering
```http
GET /api/calendar-events/date-range?startTime=2024-03-01T00:00:00&endTime=2024-03-31T23:59:59
```

## Bulk Operations

### Create Multiple Events
```json
POST /api/calendar-events/bulk
[
  {
    "title": "Event 1",
    "startTime": "2024-03-15T09:00:00",
    "endTime": "2024-03-15T10:00:00",
    "eventType": "CLASS_SESSION",
    "scope": "CLASS",
    "createdById": 1
  },
  {
    "title": "Event 2",
    "startTime": "2024-03-16T09:00:00",
    "endTime": "2024-03-16T10:00:00",
    "eventType": "CLASS_SESSION",
    "scope": "CLASS",
    "createdById": 1
  }
]
```

### Delete Multiple Events
```json
DELETE /api/calendar-events/bulk
[123, 124, 125]
```

## Academic Calendar

### Get Academic Year Events
```http
GET /api/calendar-events/academic-year/2024
```

### Get Holiday Events
```http
GET /api/calendar-events/holidays?startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59
```

### Get Exam Events
```http
GET /api/calendar-events/exams?startDate=2024-03-01T00:00:00&endDate=2024-03-31T23:59:59
```

## API Examples

### Complete Event Creation Example

```bash
curl -X POST http://localhost:8080/api/calendar-events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Science Fair",
    "description": "Annual school science fair showcasing student projects",
    "startTime": "2024-04-15T08:00:00",
    "endTime": "2024-04-15T17:00:00",
    "location": "Main Hall",
    "eventType": "CULTURAL_EVENT",
    "priority": "HIGH",
    "scope": "SCHOOL",
    "createdById": 1,
    "schoolId": 1,
    "targetRoles": ["STUDENT", "TEACHER", "PARENT"],
    "organizerIds": [1, 2, 3],
    "requiresApproval": true,
    "maxAttendees": 200,
    "registrationRequired": true,
    "registrationDeadline": "2024-04-10T23:59:59",
    "reminderMinutes": 1440,
    "color": "#FF6B6B",
    "isPublic": true,
    "notes": "Please bring your student ID for entry"
  }'
```

### Get User's Calendar View

```bash
curl -X GET "http://localhost:8080/api/calendar-events/calendar-view/123?startDate=2024-03-01T00:00:00&endDate=2024-03-31T23:59:59" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search Events with Pagination

```bash
curl -X GET "http://localhost:8080/api/calendar-events/search/paginated?searchTerm=exam&page=0&size=10&sort=startTime,asc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Best Practices

### Event Creation
1. **Use Descriptive Titles**: Make event titles clear and informative
2. **Set Appropriate Scope**: Choose the most restrictive scope that serves your needs
3. **Include Location**: Always specify where the event will take place
4. **Set Reminders**: Use reminder minutes for important events
5. **Use Colors Consistently**: Establish color coding standards for event types

### Recurring Events
1. **Set End Dates**: Always specify when recurring events should stop
2. **Review Generated Events**: Check automatically generated events for conflicts
3. **Use Parent-Child Relationships**: Leverage the parent event for bulk modifications

### Approval Workflow
1. **Require Approval for Public Events**: Use approval workflow for school-wide events
2. **Provide Clear Notes**: Include detailed approval/rejection reasons
3. **Set Appropriate Approvers**: Ensure approvers have necessary authority

### Performance Optimization
1. **Use Date Range Queries**: Limit queries to specific time periods
2. **Implement Pagination**: Use paginated endpoints for large result sets
3. **Filter by Scope**: Use scope-based queries to reduce data volume
4. **Cache Calendar Views**: Consider caching frequently accessed calendar views

### Security Considerations
1. **Validate Permissions**: Ensure users can only access events they're authorized to see
2. **Sanitize Input**: Validate all input data, especially for bulk operations
3. **Audit Trail**: Log important event modifications for accountability
4. **Rate Limiting**: Implement rate limiting for bulk operations

### Data Integrity
1. **Validate Time Ranges**: Ensure start time is before end time
2. **Check Conflicts**: Use conflict detection before scheduling
3. **Maintain Relationships**: Ensure referenced entities (users, schools) exist
4. **Handle Soft Deletes**: Use the active flag instead of hard deletes

## Troubleshooting

### Common Issues

#### Event Not Visible
- Check event scope and user permissions
- Verify event is active (`active: true`)
- Ensure event is within the queried date range

#### Cannot Add Attendees
- Check if event has reached maximum capacity
- Verify user has permission to modify the event
- Ensure the user being added exists

#### Approval Issues
- Verify the approver has appropriate role permissions
- Check if event requires approval (`requiresApproval: true`)
- Ensure event is in `PENDING_APPROVAL` status

#### Recurring Event Problems
- Validate recurrence rule format
- Check if recurrence end date is set
- Verify parent event exists for child events

### Error Codes
- `404 Not Found`: Event or related entity doesn't exist
- `400 Bad Request`: Invalid input data or business rule violation
- `403 Forbidden`: Insufficient permissions
- `409 Conflict`: Scheduling conflict detected

## Support

For additional support or questions about the Calendar Event module:
1. Check the API documentation
2. Review the unit tests for usage examples
3. Contact the development team
4. Submit issues through the project repository

This usage guide provides comprehensive coverage of the Calendar Event module functionality. For the most up-to-date API specifications, refer to the Swagger documentation available at `/swagger-ui.html` when the application is running. 
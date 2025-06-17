# Attendance Tracking Module Documentation

## Overview

The Attendance Tracking module is a comprehensive system for managing student attendance in a school-based Learning Management System (LMS). It supports both daily and per-period attendance tracking, integrates with classes, subjects, and courses, and provides extensive reporting and analytics capabilities.

## Architecture

The module follows the established architectural patterns of the system:

- **Entities**: Extend `BaseEntity`
- **Services**: Extend `BaseService` and implement in `BaseServiceImpl`
- **Controllers**: Extend `BaseController`
- **Mappers**: Implement `BaseDtoMapper`
- **DTOs**: Use record pattern with validation

## Core Components

### Entities

#### AttendanceStatus (Enum)
```java
public enum AttendanceStatus {
    PRESENT,
    ABSENT_EXCUSED,
    ABSENT_UNEXCUSED,
    LATE,
    EARLY_DEPARTURE
}
```

#### AttendanceType (Enum)
```java
public enum AttendanceType {
    DAILY,      // Full day attendance
    PERIOD,     // Per period/subject attendance
    SESSION     // Per session attendance
}
```

#### AttendanceRecord
Main entity for storing individual attendance records with the following key features:
- Links to Student, Class, Course, Subject, and Teacher (marked by)
- Supports both daily and period-based attendance
- Tracks modification history
- Includes arrival/departure times
- Supports remarks and feedback

#### AttendanceSummary
Aggregated attendance statistics for efficient reporting:
- Student-level summaries by class, course, academic year, and term
- Calculated attendance percentages
- Breakdown by attendance status
- Support for different summary types (daily, weekly, monthly, term, annual)

### DTOs

#### AttendanceRecordDTO
Comprehensive DTO with validation for attendance records:
- Student and class information
- Course and subject details
- Attendance status and type
- Time tracking (arrival, departure, period times)
- Modification tracking
- Academic year and term

#### AttendanceSummaryDTO
DTO for aggregated attendance data:
- Summary statistics
- Calculated percentages
- Period information
- Helper methods for calculations

#### BulkAttendanceDTO
Specialized DTO for bulk attendance operations:
- Class-level attendance marking
- List of student attendance records
- Common metadata (date, type, period)

### Repositories

#### AttendanceRecordRepository
Comprehensive repository with 30+ query methods:
- Student-based queries
- Class-based queries
- Course and subject queries
- Teacher-based queries
- Status and type filtering
- Date range queries
- Statistics and reporting queries
- Low attendance identification
- Modified records tracking

#### AttendanceSummaryRepository
Repository for aggregated data:
- Summary retrieval by various criteria
- Statistics calculations
- Low attendance identification
- Trend analysis support

### Services

#### AttendanceRecordService
Extends `BaseService` with 40+ specialized methods:

**Core Operations:**
- CRUD operations for attendance records
- Bulk attendance marking and updating
- Attendance modification with audit trail

**Query Operations:**
- Student, class, course, subject-based queries
- Date range and academic year filtering
- Status and type-based filtering

**Statistics and Analytics:**
- Attendance percentage calculations
- Statistics by student, class, and date
- Low attendance identification
- Trend analysis

**Utility Operations:**
- Duplicate checking
- Quick marking (all present/absent)
- Export functionality (Excel, PDF)
- Dashboard data generation

#### AttendanceSummaryService
Service for managing aggregated attendance data:
- Summary generation and calculation
- Bulk summary operations
- Analytics and reporting
- Performance optimization

### Controllers

#### AttendanceController
RESTful API controller extending `BaseController`:
- Complete CRUD operations
- Comprehensive query endpoints
- Bulk operations support
- Statistics and reporting endpoints
- Export functionality
- Dashboard data endpoints

## API Endpoints

### Basic CRUD
- `POST /api/attendance/record` - Create attendance record
- `GET /api/attendance/record/{id}` - Get attendance record
- `PUT /api/attendance/record/{id}` - Update attendance record
- `DELETE /api/attendance/record/{id}` - Delete attendance record
- `GET /api/attendance/records` - Get all attendance records

### Student Queries
- `GET /api/attendance/student/{studentId}` - Get all attendance for student
- `GET /api/attendance/student/{studentId}/date/{date}` - Get attendance for specific date
- `GET /api/attendance/student/{studentId}/date-range` - Get attendance for date range
- `GET /api/attendance/student/{studentId}/academic-year/{year}` - Get attendance for academic year
- `GET /api/attendance/student/{studentId}/academic-year/{year}/term/{term}` - Get attendance for term

### Class Queries
- `GET /api/attendance/class/{classId}` - Get all attendance for class
- `GET /api/attendance/class/{classId}/date/{date}` - Get class attendance for date
- `GET /api/attendance/class/{classId}/date-range` - Get class attendance for date range

### Course and Subject Queries
- `GET /api/attendance/course/{courseId}` - Get attendance by course
- `GET /api/attendance/subject/{subjectId}` - Get attendance by subject

### Teacher Queries
- `GET /api/attendance/teacher/{teacherId}` - Get attendance marked by teacher
- `GET /api/attendance/teacher/{teacherId}/date/{date}` - Get teacher's attendance for date

### Bulk Operations
- `POST /api/attendance/bulk/mark` - Mark bulk attendance
- `PUT /api/attendance/bulk/update` - Update bulk attendance

### Quick Marking
- `POST /api/attendance/quick-mark/class/{classId}/present` - Mark all students present
- `POST /api/attendance/quick-mark/class/{classId}/absent` - Mark all students absent

### Statistics and Reporting
- `GET /api/attendance/stats/student/{studentId}/academic-year/{year}` - Student statistics
- `GET /api/attendance/percentage/student/{studentId}/academic-year/{year}` - Student percentage
- `GET /api/attendance/low-attendance/class/{classId}` - Students with low attendance

### Dashboard
- `GET /api/attendance/dashboard/class/{classId}/date/{date}` - Class dashboard
- `GET /api/attendance/dashboard/teacher/{teacherId}` - Teacher dashboard
- `GET /api/attendance/dashboard/school/{schoolId}` - School dashboard

### Export
- `GET /api/attendance/export/excel/class/{classId}` - Export to Excel
- `GET /api/attendance/export/pdf/class/{classId}` - Export to PDF
- `GET /api/attendance/export/student/{studentId}/report` - Student report

## Features

### Core Functionality

1. **Attendance Recording**
   - Teachers can mark attendance per subject, period, or day
   - Support for multiple attendance statuses
   - Quick marking UI support
   - Remarks and notes per student

2. **Integration Points**
   - Links to Class, Subject, Course, Teacher
   - Date and time period tracking
   - Automatic student list population
   - Academic year and term support

3. **Reporting & Exports**
   - Attendance summary per student/class/subject
   - Daily, weekly, monthly reports
   - Filters by date, subject, class, teacher
   - Export options: PDF, Excel, CSV

### Advanced Features

1. **Real-time Analytics**
   - Attendance percentage calculations
   - Low attendance identification
   - Trend analysis
   - Dashboard visualizations

2. **Audit Trail**
   - Modification tracking
   - Reason for changes
   - User who made changes
   - Timestamp tracking

3. **Bulk Operations**
   - Mass attendance marking
   - Quick mark all present/absent
   - Bulk updates with validation

4. **Performance Optimization**
   - Aggregated summaries for reporting
   - Efficient queries with proper indexing
   - Caching support for dashboard data

## Database Schema

### attendance_records Table
```sql
CREATE TABLE attendance_records (
    id BIGINT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    course_id BIGINT,
    subject_id BIGINT,
    marked_by BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    attendance_status VARCHAR(20) NOT NULL,
    attendance_type VARCHAR(10) NOT NULL,
    period_number INTEGER,
    period_start_time TIME,
    period_end_time TIME,
    marked_at TIMESTAMP NOT NULL,
    arrival_time TIME,
    departure_time TIME,
    remarks TEXT,
    academic_year INTEGER NOT NULL,
    term VARCHAR(20),
    is_modified BOOLEAN DEFAULT FALSE,
    modified_reason VARCHAR(255),
    modified_by BIGINT,
    modified_at TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    modified_at TIMESTAMP,
    UNIQUE(student_id, attendance_date, course_id, period_number, attendance_type)
);
```

### attendance_summaries Table
```sql
CREATE TABLE attendance_summaries (
    id BIGINT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    course_id BIGINT,
    subject_id BIGINT,
    academic_year INTEGER NOT NULL,
    term VARCHAR(20),
    summary_type VARCHAR(20) NOT NULL,
    total_days INTEGER DEFAULT 0,
    present_days INTEGER DEFAULT 0,
    absent_excused_days INTEGER DEFAULT 0,
    absent_unexcused_days INTEGER DEFAULT 0,
    late_days INTEGER DEFAULT 0,
    early_departure_days INTEGER DEFAULT 0,
    attendance_percentage DOUBLE DEFAULT 0.0,
    period_from DATE,
    period_to DATE,
    last_calculated_date DATE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    modified_at TIMESTAMP,
    UNIQUE(student_id, class_id, course_id, academic_year, term, summary_type)
);
```

## Usage Examples

### Mark Individual Attendance
```java
AttendanceRecordDTO attendance = new AttendanceRecordDTO(
    null, // id
    studentId,
    null, // studentName
    classId,
    null, // className
    courseId,
    null, // courseName
    subjectId,
    null, // subjectName
    teacherId,
    null, // teacherName
    LocalDate.now(),
    AttendanceStatus.PRESENT,
    AttendanceType.PERIOD,
    1, // periodNumber
    LocalTime.of(8, 0),
    LocalTime.of(9, 0),
    LocalDateTime.now(),
    null, // arrivalTime
    null, // departureTime
    null, // remarks
    2024, // academicYear
    Term.FIRST,
    false, // isModified
    null, // modifiedReason
    null, // modifiedById
    null, // modifiedByName
    null, // modifiedAt
    true, // active
    LocalDateTime.now(),
    LocalDateTime.now()
);

AttendanceRecordDTO created = attendanceService.create(attendance);
```

### Bulk Attendance Marking
```java
List<BulkAttendanceDTO.StudentAttendanceDTO> studentAttendances = Arrays.asList(
    new BulkAttendanceDTO.StudentAttendanceDTO(student1Id, AttendanceStatus.PRESENT, null, null, null),
    new BulkAttendanceDTO.StudentAttendanceDTO(student2Id, AttendanceStatus.ABSENT_UNEXCUSED, null, null, "Sick")
);

BulkAttendanceDTO bulkAttendance = new BulkAttendanceDTO(
    classId,
    courseId,
    subjectId,
    LocalDate.now(),
    AttendanceType.PERIOD,
    1, // periodNumber
    LocalTime.of(8, 0),
    LocalTime.of(9, 0),
    2024, // academicYear
    Term.FIRST,
    teacherId,
    studentAttendances
);

List<AttendanceRecordDTO> records = attendanceService.markBulkAttendance(bulkAttendance);
```

### Get Attendance Statistics
```java
// Get student attendance percentage for academic year
Double percentage = attendanceService.getAttendancePercentageByStudent(studentId, 2024);

// Get attendance statistics by status
Map<AttendanceStatus, Long> stats = attendanceService.getAttendanceStatsByStudent(studentId, 2024);

// Get students with low attendance
List<Long> lowAttendanceStudents = attendanceService.getStudentsWithLowAttendance(
    classId, 
    LocalDate.of(2024, 1, 1), 
    LocalDate.of(2024, 12, 31), 
    75.0 // threshold percentage
);
```

## Security Considerations

1. **Role-based Access Control**
   - Teachers can only mark attendance for their classes
   - Students can only view their own attendance
   - Administrators have full access

2. **Data Validation**
   - Comprehensive input validation
   - Business rule enforcement
   - Duplicate prevention

3. **Audit Trail**
   - All modifications are tracked
   - User identification for changes
   - Timestamp tracking

## Performance Considerations

1. **Database Optimization**
   - Proper indexing on frequently queried columns
   - Unique constraints to prevent duplicates
   - Efficient query patterns

2. **Caching Strategy**
   - Dashboard data caching
   - Summary data caching
   - Query result caching

3. **Bulk Operations**
   - Batch processing for large datasets
   - Transaction management
   - Error handling and rollback

## Testing Strategy

The module includes comprehensive unit tests covering:
- Service layer functionality
- Repository queries
- DTO validation
- Business logic
- Edge cases and error scenarios

## Future Enhancements

1. **Real-time Notifications**
   - Absence notifications to parents
   - Low attendance alerts
   - Integration with messaging system

2. **Advanced Analytics**
   - Predictive analytics for attendance patterns
   - Machine learning for early intervention
   - Advanced reporting dashboards

3. **Mobile Integration**
   - QR code-based check-in
   - Student ID scanning
   - Mobile attendance marking

4. **Integration Features**
   - Calendar integration
   - Timetable synchronization
   - Grade correlation analysis 
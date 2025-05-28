package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.AttendanceRecordDTO;
import com.ohma.thutothebe.dto.BulkAttendanceDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AttendanceStatus;
import com.ohma.thutothebe.entity.AttendanceType;
import com.ohma.thutothebe.entity.Term;
import com.ohma.thutothebe.service.AttendanceRecordService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/attendance")
public class AttendanceController extends BaseController<AttendanceRecordDTO, Long> {

    private final AttendanceRecordService attendanceRecordService;

    @Autowired
    public AttendanceController(AttendanceRecordService attendanceRecordService) {
        super(attendanceRecordService);
        this.attendanceRecordService = attendanceRecordService;
    }

    // Basic CRUD operations
    @PostMapping("/record")
    public ResponseEntity<OhmaApiResponse<AttendanceRecordDTO>> createAttendanceRecord(@Valid @RequestBody AttendanceRecordDTO attendanceRecordDTO) {
        try {
            AttendanceRecordDTO createdRecord = attendanceRecordService.create(attendanceRecordDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new OhmaApiResponse<>("SUCCESS", "Attendance record created successfully", createdRecord, null));
        } catch (Exception e) {
            log.error("Error creating attendance record: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/record/{id}")
    public ResponseEntity<OhmaApiResponse<AttendanceRecordDTO>> getAttendanceRecord(@PathVariable Long id) {
        try {
            AttendanceRecordDTO record = attendanceRecordService.findById(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Attendance record retrieved successfully", record, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance record {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    @PutMapping("/record/{id}")
    public ResponseEntity<OhmaApiResponse<AttendanceRecordDTO>> updateAttendanceRecord(@PathVariable Long id, @Valid @RequestBody AttendanceRecordDTO attendanceRecordDTO) {
        try {
            AttendanceRecordDTO updatedRecord = attendanceRecordService.update(id, attendanceRecordDTO);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Attendance record updated successfully", updatedRecord, null));
        } catch (Exception e) {
            log.error("Error updating attendance record {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    @DeleteMapping("/record/{id}")
    public ResponseEntity<OhmaApiResponse<Void>> deleteAttendanceRecord(@PathVariable Long id) {
        try {
            attendanceRecordService.delete(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Attendance record deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting attendance record {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/records")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAllAttendanceRecords() {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAll();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Attendance records retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving all attendance records: {}", e.getMessage(), e);
            throw e;
        }
    }

    // Student-based queries
    @GetMapping("/student/{studentId}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByStudent(@PathVariable Long studentId) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByStudent(studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student attendance records retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance for student {}: {}", studentId, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/student/{studentId}/date/{date}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByStudentAndDate(
            @PathVariable Long studentId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByStudentAndDate(studentId, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student attendance for date retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance for student {} on date {}: {}", studentId, date, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/student/{studentId}/date-range")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByStudentAndDateRange(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByStudentAndDateRange(studentId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student attendance for date range retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance for student {} from {} to {}: {}", studentId, startDate, endDate, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/student/{studentId}/academic-year/{academicYear}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByStudentAndAcademicYear(
            @PathVariable Long studentId,
            @PathVariable Integer academicYear) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByStudentAndAcademicYear(studentId, academicYear);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student attendance for academic year retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance for student {} for academic year {}: {}", studentId, academicYear, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/student/{studentId}/academic-year/{academicYear}/term/{term}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByStudentAndAcademicYearAndTerm(
            @PathVariable Long studentId,
            @PathVariable Integer academicYear,
            @PathVariable Term term) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByStudentAndAcademicYearAndTerm(studentId, academicYear, term);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student attendance for academic year and term retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance for student {} for {} {}: {}", studentId, academicYear, term, e.getMessage(), e);
            throw e;
        }
    }

    // Class-based queries
    @GetMapping("/class/{classId}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByClass(@PathVariable Long classId) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByClass(classId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class attendance records retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance for class {}: {}", classId, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/class/{classId}/date/{date}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByClassAndDate(
            @PathVariable Long classId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByClassAndDate(classId, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class attendance for date retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance for class {} on date {}: {}", classId, date, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/class/{classId}/date-range")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByClassAndDateRange(
            @PathVariable Long classId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByClassAndDateRange(classId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class attendance for date range retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance for class {} from {} to {}: {}", classId, startDate, endDate, e.getMessage(), e);
            throw e;
        }
    }

    // Course-based queries
    @GetMapping("/course/{courseId}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByCourse(@PathVariable Long courseId) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByCourse(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course attendance records retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance for course {}: {}", courseId, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/course/{courseId}/date/{date}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByCourseAndDate(
            @PathVariable Long courseId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByCourseAndDate(courseId, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course attendance for date retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance for course {} on date {}: {}", courseId, date, e.getMessage(), e);
            throw e;
        }
    }

    // Subject-based queries
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceBySubject(@PathVariable Long subjectId) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceBySubject(subjectId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject attendance records retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance for subject {}: {}", subjectId, e.getMessage(), e);
            throw e;
        }
    }

    // Teacher-based queries
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByTeacher(@PathVariable Long teacherId) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByTeacher(teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher attendance records retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance for teacher {}: {}", teacherId, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/teacher/{teacherId}/date/{date}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByTeacherAndDate(
            @PathVariable Long teacherId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByTeacherAndDate(teacherId, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher attendance for date retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance for teacher {} on date {}: {}", teacherId, date, e.getMessage(), e);
            throw e;
        }
    }

    // Status-based queries
    @GetMapping("/status/{status}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByStatus(@PathVariable AttendanceStatus status) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByStatus(status);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Attendance records by status retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance by status {}: {}", status, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/class/{classId}/status/{status}/date/{date}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByClassAndStatusAndDate(
            @PathVariable Long classId,
            @PathVariable AttendanceStatus status,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByClassAndStatusAndDate(classId, status, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class attendance by status and date retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance for class {} with status {} on date {}: {}", classId, status, date, e.getMessage(), e);
            throw e;
        }
    }

    // Type-based queries
    @GetMapping("/type/{type}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByType(@PathVariable AttendanceType type) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByType(type);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Attendance records by type retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance by type {}: {}", type, e.getMessage(), e);
            throw e;
        }
    }

    // Period-based queries
    @GetMapping("/class/{classId}/date/{date}/type/{type}/period/{periodNumber}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getAttendanceByClassAndDateAndTypeAndPeriod(
            @PathVariable Long classId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable AttendanceType type,
            @PathVariable Integer periodNumber) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getAttendanceByClassAndDateAndTypeAndPeriod(classId, date, type, periodNumber);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Period attendance retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving period attendance for class {} on {} type {} period {}: {}", classId, date, type, periodNumber, e.getMessage(), e);
            throw e;
        }
    }

    // Bulk operations
    @PostMapping("/bulk/mark")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> markBulkAttendance(@Valid @RequestBody BulkAttendanceDTO bulkAttendanceDTO) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.markBulkAttendance(bulkAttendanceDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new OhmaApiResponse<>("SUCCESS", "Bulk attendance marked successfully", records, null));
        } catch (Exception e) {
            log.error("Error marking bulk attendance: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PutMapping("/bulk/update")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> updateBulkAttendance(@Valid @RequestBody BulkAttendanceDTO bulkAttendanceDTO) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.updateBulkAttendance(bulkAttendanceDTO);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Bulk attendance updated successfully", records, null));
        } catch (Exception e) {
            log.error("Error updating bulk attendance: {}", e.getMessage(), e);
            throw e;
        }
    }

    // Attendance modification
    @PutMapping("/record/{attendanceId}/modify")
    public ResponseEntity<OhmaApiResponse<AttendanceRecordDTO>> modifyAttendance(
            @PathVariable Long attendanceId,
            @Valid @RequestBody AttendanceRecordDTO updatedRecord,
            @RequestParam String reason,
            @RequestParam Long modifiedById) {
        try {
            AttendanceRecordDTO record = attendanceRecordService.modifyAttendance(attendanceId, updatedRecord, reason, modifiedById);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Attendance record modified successfully", record, null));
        } catch (Exception e) {
            log.error("Error modifying attendance record {}: {}", attendanceId, e.getMessage(), e);
            throw e;
        }
    }

    // Statistics and reporting
    @GetMapping("/stats/student/{studentId}/academic-year/{academicYear}")
    public ResponseEntity<OhmaApiResponse<Map<AttendanceStatus, Long>>> getAttendanceStatsByStudent(
            @PathVariable Long studentId,
            @PathVariable Integer academicYear) {
        try {
            Map<AttendanceStatus, Long> stats = attendanceRecordService.getAttendanceStatsByStudent(studentId, academicYear);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student attendance statistics retrieved successfully", stats, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance stats for student {} for year {}: {}", studentId, academicYear, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/stats/student/{studentId}/academic-year/{academicYear}/term/{term}")
    public ResponseEntity<OhmaApiResponse<Map<AttendanceStatus, Long>>> getAttendanceStatsByStudentAndTerm(
            @PathVariable Long studentId,
            @PathVariable Integer academicYear,
            @PathVariable Term term) {
        try {
            Map<AttendanceStatus, Long> stats = attendanceRecordService.getAttendanceStatsByStudentAndTerm(studentId, academicYear, term);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student attendance statistics for term retrieved successfully", stats, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance stats for student {} for {} {}: {}", studentId, academicYear, term, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/stats/class/{classId}/date/{date}")
    public ResponseEntity<OhmaApiResponse<Map<AttendanceStatus, Long>>> getAttendanceStatsByClassAndDate(
            @PathVariable Long classId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Map<AttendanceStatus, Long> stats = attendanceRecordService.getAttendanceStatsByClassAndDate(classId, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class attendance statistics for date retrieved successfully", stats, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance stats for class {} on date {}: {}", classId, date, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/percentage/student/{studentId}/academic-year/{academicYear}")
    public ResponseEntity<OhmaApiResponse<Double>> getAttendancePercentageByStudent(
            @PathVariable Long studentId,
            @PathVariable Integer academicYear) {
        try {
            Double percentage = attendanceRecordService.getAttendancePercentageByStudent(studentId, academicYear);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student attendance percentage retrieved successfully", percentage, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance percentage for student {} for year {}: {}", studentId, academicYear, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/percentage/student/{studentId}/academic-year/{academicYear}/term/{term}")
    public ResponseEntity<OhmaApiResponse<Double>> getAttendancePercentageByStudentAndTerm(
            @PathVariable Long studentId,
            @PathVariable Integer academicYear,
            @PathVariable Term term) {
        try {
            Double percentage = attendanceRecordService.getAttendancePercentageByStudentAndTerm(studentId, academicYear, term);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student attendance percentage for term retrieved successfully", percentage, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance percentage for student {} for {} {}: {}", studentId, academicYear, term, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/percentage/class/{classId}")
    public ResponseEntity<OhmaApiResponse<Double>> getAttendancePercentageByClass(
            @PathVariable Long classId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            Double percentage = attendanceRecordService.getAttendancePercentageByClass(classId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class attendance percentage retrieved successfully", percentage, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance percentage for class {} from {} to {}: {}", classId, startDate, endDate, e.getMessage(), e);
            throw e;
        }
    }

    // Low attendance identification
    @GetMapping("/low-attendance/class/{classId}")
    public ResponseEntity<OhmaApiResponse<List<Long>>> getStudentsWithLowAttendance(
            @PathVariable Long classId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam Double threshold) {
        try {
            List<Long> studentIds = attendanceRecordService.getStudentsWithLowAttendance(classId, startDate, endDate, threshold);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Students with low attendance retrieved successfully", studentIds, null));
        } catch (Exception e) {
            log.error("Error retrieving students with low attendance for class {}: {}", classId, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/low-attendance/class/{classId}/details")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getStudentsWithLowAttendanceDetails(
            @PathVariable Long classId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam Double threshold) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getStudentsWithLowAttendanceDetails(classId, startDate, endDate, threshold);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Low attendance details retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving low attendance details for class {}: {}", classId, e.getMessage(), e);
            throw e;
        }
    }

    // Validation and duplicate checking
    @GetMapping("/check-existing")
    public ResponseEntity<OhmaApiResponse<Boolean>> hasExistingAttendance(
            @RequestParam Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam AttendanceType type,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Integer periodNumber) {
        try {
            boolean exists = attendanceRecordService.hasExistingAttendance(studentId, date, type, courseId, periodNumber);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Attendance existence check completed", exists, null));
        } catch (Exception e) {
            log.error("Error checking existing attendance: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/get-existing")
    public ResponseEntity<OhmaApiResponse<AttendanceRecordDTO>> getExistingAttendance(
            @RequestParam Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam AttendanceType type,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Integer periodNumber) {
        try {
            AttendanceRecordDTO record = attendanceRecordService.getExistingAttendance(studentId, date, type, courseId, periodNumber);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Existing attendance record retrieved", record, null));
        } catch (Exception e) {
            log.error("Error retrieving existing attendance: {}", e.getMessage(), e);
            throw e;
        }
    }

    // Modified records tracking
    @GetMapping("/modified")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getModifiedRecords() {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getModifiedRecords();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Modified attendance records retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving modified attendance records: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/modified/user/{userId}")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> getModifiedRecordsByUser(@PathVariable Long userId) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.getModifiedRecordsByUser(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Modified attendance records by user retrieved successfully", records, null));
        } catch (Exception e) {
            log.error("Error retrieving modified attendance records by user {}: {}", userId, e.getMessage(), e);
            throw e;
        }
    }

    // Dashboard data
    @GetMapping("/dashboard/class/{classId}/date/{date}")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getAttendanceDashboardData(
            @PathVariable Long classId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Map<String, Object> dashboard = attendanceRecordService.getAttendanceDashboardData(classId, date);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Attendance dashboard data retrieved successfully", dashboard, null));
        } catch (Exception e) {
            log.error("Error retrieving attendance dashboard data for class {} on date {}: {}", classId, date, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/dashboard/teacher/{teacherId}")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getTeacherAttendanceDashboard(
            @PathVariable Long teacherId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            Map<String, Object> dashboard = attendanceRecordService.getTeacherAttendanceDashboard(teacherId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher attendance dashboard retrieved successfully", dashboard, null));
        } catch (Exception e) {
            log.error("Error retrieving teacher attendance dashboard for teacher {}: {}", teacherId, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/dashboard/school/{schoolId}")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getSchoolAttendanceDashboard(
            @PathVariable Long schoolId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            Map<String, Object> dashboard = attendanceRecordService.getSchoolAttendanceDashboard(schoolId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School attendance dashboard retrieved successfully", dashboard, null));
        } catch (Exception e) {
            log.error("Error retrieving school attendance dashboard for school {}: {}", schoolId, e.getMessage(), e);
            throw e;
        }
    }

    // Quick marking support
    @PostMapping("/quick-mark/class/{classId}/present")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> quickMarkAllPresent(
            @PathVariable Long classId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam AttendanceType type,
            @RequestParam(required = false) Integer periodNumber,
            @RequestParam Long markedById) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.quickMarkAllPresent(classId, date, type, periodNumber, markedById);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new OhmaApiResponse<>("SUCCESS", "All students marked as present successfully", records, null));
        } catch (Exception e) {
            log.error("Error quick marking all present for class {}: {}", classId, e.getMessage(), e);
            throw e;
        }
    }

    @PostMapping("/quick-mark/class/{classId}/absent")
    public ResponseEntity<OhmaApiResponse<List<AttendanceRecordDTO>>> quickMarkAllAbsent(
            @PathVariable Long classId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam AttendanceType type,
            @RequestParam(required = false) Integer periodNumber,
            @RequestParam Long markedById,
            @RequestParam AttendanceStatus absentType) {
        try {
            List<AttendanceRecordDTO> records = attendanceRecordService.quickMarkAllAbsent(classId, date, type, periodNumber, markedById, absentType);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new OhmaApiResponse<>("SUCCESS", "All students marked as absent successfully", records, null));
        } catch (Exception e) {
            log.error("Error quick marking all absent for class {}: {}", classId, e.getMessage(), e);
            throw e;
        }
    }

    // Export functionality
    @GetMapping("/export/excel/class/{classId}")
    public ResponseEntity<byte[]> exportAttendanceToExcel(
            @PathVariable Long classId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            byte[] excelData = attendanceRecordService.exportAttendanceToExcel(classId, startDate, endDate);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=attendance_report.xlsx")
                    .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    .body(excelData);
        } catch (Exception e) {
            log.error("Error exporting attendance to Excel for class {}: {}", classId, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/export/pdf/class/{classId}")
    public ResponseEntity<byte[]> exportAttendanceToPdf(
            @PathVariable Long classId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            byte[] pdfData = attendanceRecordService.exportAttendanceToPdf(classId, startDate, endDate);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=attendance_report.pdf")
                    .header("Content-Type", "application/pdf")
                    .body(pdfData);
        } catch (Exception e) {
            log.error("Error exporting attendance to PDF for class {}: {}", classId, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/export/student/{studentId}/report")
    public ResponseEntity<byte[]> exportStudentAttendanceReport(
            @PathVariable Long studentId,
            @RequestParam Integer academicYear,
            @RequestParam(required = false) Term term) {
        try {
            byte[] reportData = attendanceRecordService.exportStudentAttendanceReport(studentId, academicYear, term);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=student_attendance_report.pdf")
                    .header("Content-Type", "application/pdf")
                    .body(reportData);
        } catch (Exception e) {
            log.error("Error exporting student attendance report for student {}: {}", studentId, e.getMessage(), e);
            throw e;
        }
    }
} 
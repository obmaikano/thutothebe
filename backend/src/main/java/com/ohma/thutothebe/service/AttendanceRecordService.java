package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.AttendanceRecordDTO;
import com.ohma.thutothebe.dto.BulkAttendanceDTO;
import com.ohma.thutothebe.entity.AttendanceStatus;
import com.ohma.thutothebe.entity.AttendanceType;
import com.ohma.thutothebe.entity.Term;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface AttendanceRecordService extends BaseService<AttendanceRecordDTO, Long> {

    // Student-based queries
    List<AttendanceRecordDTO> getAttendanceByStudent(Long studentId);
    
    List<AttendanceRecordDTO> getAttendanceByStudentAndDate(Long studentId, LocalDate date);
    
    List<AttendanceRecordDTO> getAttendanceByStudentAndDateRange(Long studentId, LocalDate startDate, LocalDate endDate);
    
    List<AttendanceRecordDTO> getAttendanceByStudentAndAcademicYear(Long studentId, Integer academicYear);
    
    List<AttendanceRecordDTO> getAttendanceByStudentAndAcademicYearAndTerm(Long studentId, Integer academicYear, Term term);

    // Class-based queries
    List<AttendanceRecordDTO> getAttendanceByClass(Long classId);
    
    List<AttendanceRecordDTO> getAttendanceByClassAndDate(Long classId, LocalDate date);
    
    List<AttendanceRecordDTO> getAttendanceByClassAndDateRange(Long classId, LocalDate startDate, LocalDate endDate);

    // Course-based queries
    List<AttendanceRecordDTO> getAttendanceByCourse(Long courseId);
    
    List<AttendanceRecordDTO> getAttendanceByCourseAndDate(Long courseId, LocalDate date);
    
    List<AttendanceRecordDTO> getAttendanceByCourseAndDateRange(Long courseId, LocalDate startDate, LocalDate endDate);

    // Subject-based queries
    List<AttendanceRecordDTO> getAttendanceBySubject(Long subjectId);

    // Teacher-based queries
    List<AttendanceRecordDTO> getAttendanceByTeacher(Long teacherId);
    
    List<AttendanceRecordDTO> getAttendanceByTeacherAndDate(Long teacherId, LocalDate date);

    // Status-based queries
    List<AttendanceRecordDTO> getAttendanceByStatus(AttendanceStatus status);
    
    List<AttendanceRecordDTO> getAttendanceByClassAndStatusAndDate(Long classId, AttendanceStatus status, LocalDate date);

    // Type-based queries
    List<AttendanceRecordDTO> getAttendanceByType(AttendanceType type);

    // Period-based queries
    List<AttendanceRecordDTO> getAttendanceByClassAndDateAndTypeAndPeriod(Long classId, LocalDate date, AttendanceType type, Integer periodNumber);

    // Bulk operations
    List<AttendanceRecordDTO> markBulkAttendance(BulkAttendanceDTO bulkAttendanceDTO);
    
    List<AttendanceRecordDTO> updateBulkAttendance(BulkAttendanceDTO bulkAttendanceDTO);

    // Attendance modification
    AttendanceRecordDTO modifyAttendance(Long attendanceId, AttendanceRecordDTO updatedRecord, String reason, Long modifiedById);

    // Statistics and reporting
    Map<AttendanceStatus, Long> getAttendanceStatsByStudent(Long studentId, Integer academicYear);
    
    Map<AttendanceStatus, Long> getAttendanceStatsByStudentAndTerm(Long studentId, Integer academicYear, Term term);
    
    Map<AttendanceStatus, Long> getAttendanceStatsByClassAndDate(Long classId, LocalDate date);
    
    Double getAttendancePercentageByStudent(Long studentId, Integer academicYear);
    
    Double getAttendancePercentageByStudentAndTerm(Long studentId, Integer academicYear, Term term);
    
    Double getAttendancePercentageByClass(Long classId, LocalDate startDate, LocalDate endDate);

    // Low attendance identification
    List<Long> getStudentsWithLowAttendance(Long classId, LocalDate startDate, LocalDate endDate, Double threshold);
    
    List<AttendanceRecordDTO> getStudentsWithLowAttendanceDetails(Long classId, LocalDate startDate, LocalDate endDate, Double threshold);

    // Validation and duplicate checking
    boolean hasExistingAttendance(Long studentId, LocalDate date, AttendanceType type, Long courseId, Integer periodNumber);
    
    AttendanceRecordDTO getExistingAttendance(Long studentId, LocalDate date, AttendanceType type, Long courseId, Integer periodNumber);

    // Modified records tracking
    List<AttendanceRecordDTO> getModifiedRecords();
    
    List<AttendanceRecordDTO> getModifiedRecordsByUser(Long userId);

    // Academic year and term queries
    List<AttendanceRecordDTO> getAttendanceByAcademicYear(Integer academicYear);
    
    List<AttendanceRecordDTO> getAttendanceByAcademicYearAndTerm(Integer academicYear, Term term);

    // School-based queries for reporting
    List<AttendanceRecordDTO> getAttendanceBySchoolAndDateRange(Long schoolId, LocalDate startDate, LocalDate endDate);
    
    List<AttendanceRecordDTO> getAttendanceBySchoolAndAcademicYear(Long schoolId, Integer academicYear);

    // Export functionality
    byte[] exportAttendanceToExcel(Long classId, LocalDate startDate, LocalDate endDate);
    
    byte[] exportAttendanceToPdf(Long classId, LocalDate startDate, LocalDate endDate);
    
    byte[] exportStudentAttendanceReport(Long studentId, Integer academicYear, Term term);

    // Dashboard data
    Map<String, Object> getAttendanceDashboardData(Long classId, LocalDate date);
    
    Map<String, Object> getTeacherAttendanceDashboard(Long teacherId, LocalDate startDate, LocalDate endDate);
    
    Map<String, Object> getSchoolAttendanceDashboard(Long schoolId, LocalDate startDate, LocalDate endDate);

    // Attendance trends
    List<Map<String, Object>> getAttendanceTrends(Long classId, LocalDate startDate, LocalDate endDate);
    
    List<Map<String, Object>> getStudentAttendanceTrends(Long studentId, LocalDate startDate, LocalDate endDate);

    // Quick marking support
    List<AttendanceRecordDTO> quickMarkAllPresent(Long classId, LocalDate date, AttendanceType type, Integer periodNumber, Long markedById);
    
    List<AttendanceRecordDTO> quickMarkAllAbsent(Long classId, LocalDate date, AttendanceType type, Integer periodNumber, Long markedById, AttendanceStatus absentType);

    // Attendance summary generation
    void generateAttendanceSummaries(Long classId, Integer academicYear, Term term);
    
    void generateAttendanceSummariesForStudent(Long studentId, Integer academicYear, Term term);
} 
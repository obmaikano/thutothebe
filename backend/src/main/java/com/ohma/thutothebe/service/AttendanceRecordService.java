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

    // ==================== MULTI-TENANT SECURITY METHODS ====================
    
    // Core multi-tenant methods
    List<AttendanceRecordDTO> getAttendanceRecordsByAccessibleScopes(Long currentUserId);
    List<AttendanceRecordDTO> getActiveAttendanceRecordsByAccessibleScopes(Long currentUserId);
    List<AttendanceRecordDTO> getAttendanceRecordsBySchoolIdAndAccessibleScopes(Long schoolId, Long currentUserId);
    List<AttendanceRecordDTO> getAttendanceRecordsByRegionIdAndAccessibleScopes(Long regionId, Long currentUserId);
    
    // Student-based queries with multi-tenant security
    List<AttendanceRecordDTO> getAttendanceByStudentAndAccessibleScopes(Long studentId, Long currentUserId);
    List<AttendanceRecordDTO> getAttendanceByStudentAndDateAndAccessibleScopes(Long studentId, LocalDate date, Long currentUserId);
    List<AttendanceRecordDTO> getAttendanceByStudentAndDateRangeAndAccessibleScopes(Long studentId, LocalDate startDate, LocalDate endDate, Long currentUserId);
    List<AttendanceRecordDTO> getAttendanceByStudentAndAcademicYearAndAccessibleScopes(Long studentId, Integer academicYear, Long currentUserId);
    List<AttendanceRecordDTO> getAttendanceByStudentAndAcademicYearAndTermAndAccessibleScopes(Long studentId, Integer academicYear, Term term, Long currentUserId);
    
    // Class-based queries with multi-tenant security
    List<AttendanceRecordDTO> getAttendanceByClassAndAccessibleScopes(Long classId, Long currentUserId);
    List<AttendanceRecordDTO> getAttendanceByClassAndDateAndAccessibleScopes(Long classId, LocalDate date, Long currentUserId);
    List<AttendanceRecordDTO> getAttendanceByClassAndDateRangeAndAccessibleScopes(Long classId, LocalDate startDate, LocalDate endDate, Long currentUserId);
    
    // Course-based queries with multi-tenant security
    List<AttendanceRecordDTO> getAttendanceByCourseAndAccessibleScopes(Long courseId, Long currentUserId);
    List<AttendanceRecordDTO> getAttendanceByCourseAndDateAndAccessibleScopes(Long courseId, LocalDate date, Long currentUserId);
    List<AttendanceRecordDTO> getAttendanceByCourseAndDateRangeAndAccessibleScopes(Long courseId, LocalDate startDate, LocalDate endDate, Long currentUserId);
    
    // Subject-based queries with multi-tenant security
    List<AttendanceRecordDTO> getAttendanceBySubjectAndAccessibleScopes(Long subjectId, Long currentUserId);
    
    // Teacher-based queries with multi-tenant security
    List<AttendanceRecordDTO> getAttendanceByTeacherAndAccessibleScopes(Long teacherId, Long currentUserId);
    List<AttendanceRecordDTO> getAttendanceByTeacherAndDateAndAccessibleScopes(Long teacherId, LocalDate date, Long currentUserId);
    
    // Status-based queries with multi-tenant security
    List<AttendanceRecordDTO> getAttendanceByStatusAndAccessibleScopes(AttendanceStatus status, Long currentUserId);
    List<AttendanceRecordDTO> getAttendanceByClassAndStatusAndDateAndAccessibleScopes(Long classId, AttendanceStatus status, LocalDate date, Long currentUserId);
    
    // Type-based queries with multi-tenant security
    List<AttendanceRecordDTO> getAttendanceByTypeAndAccessibleScopes(AttendanceType type, Long currentUserId);
    
    // Period-based queries with multi-tenant security
    List<AttendanceRecordDTO> getAttendanceByClassAndDateAndTypeAndPeriodAndAccessibleScopes(Long classId, LocalDate date, AttendanceType type, Integer periodNumber, Long currentUserId);
    
    // Academic year and term queries with multi-tenant security
    List<AttendanceRecordDTO> getAttendanceByAcademicYearAndAccessibleScopes(Integer academicYear, Long currentUserId);
    List<AttendanceRecordDTO> getAttendanceByAcademicYearAndTermAndAccessibleScopes(Integer academicYear, Term term, Long currentUserId);
    
    // Modified records tracking with multi-tenant security
    List<AttendanceRecordDTO> getModifiedRecordsByAccessibleScopes(Long currentUserId);
    List<AttendanceRecordDTO> getModifiedRecordsByUserAndAccessibleScopes(Long userId, Long currentUserId);
    
    // Validation methods with multi-tenant security
    boolean validateAttendanceRecordAccess(Long attendanceId, Long currentUserId);
    boolean validateAttendanceRecordBusinessRules(AttendanceRecordDTO attendanceDTO, Long currentUserId);
    boolean hasExistingAttendanceAndAccessibleScopes(Long studentId, LocalDate date, AttendanceType type, Long courseId, Integer periodNumber, Long currentUserId);
    AttendanceRecordDTO getExistingAttendanceAndAccessibleScopes(Long studentId, LocalDate date, AttendanceType type, Long courseId, Integer periodNumber, Long currentUserId);
    
    // Statistics and reporting with multi-tenant security
    Map<AttendanceStatus, Long> getAttendanceStatsByStudentAndAccessibleScopes(Long studentId, Integer academicYear, Long currentUserId);
    Map<AttendanceStatus, Long> getAttendanceStatsByStudentAndTermAndAccessibleScopes(Long studentId, Integer academicYear, Term term, Long currentUserId);
    Map<AttendanceStatus, Long> getAttendanceStatsByClassAndDateAndAccessibleScopes(Long classId, LocalDate date, Long currentUserId);
    Double getAttendancePercentageByStudentAndAccessibleScopes(Long studentId, Integer academicYear, Long currentUserId);
    Double getAttendancePercentageByStudentAndTermAndAccessibleScopes(Long studentId, Integer academicYear, Term term, Long currentUserId);
    Double getAttendancePercentageByClassAndAccessibleScopes(Long classId, LocalDate startDate, LocalDate endDate, Long currentUserId);
    
    // Low attendance identification with multi-tenant security
    List<Long> getStudentsWithLowAttendanceAndAccessibleScopes(Long classId, LocalDate startDate, LocalDate endDate, Double threshold, Long currentUserId);
    List<AttendanceRecordDTO> getStudentsWithLowAttendanceDetailsAndAccessibleScopes(Long classId, LocalDate startDate, LocalDate endDate, Double threshold, Long currentUserId);
    
    // Dashboard data with multi-tenant security
    Map<String, Object> getAttendanceDashboardDataAndAccessibleScopes(Long classId, LocalDate date, Long currentUserId);
    Map<String, Object> getTeacherAttendanceDashboardAndAccessibleScopes(Long teacherId, LocalDate startDate, LocalDate endDate, Long currentUserId);
    Map<String, Object> getSchoolAttendanceDashboardAndAccessibleScopes(Long schoolId, LocalDate startDate, LocalDate endDate, Long currentUserId);
    
    // Attendance trends with multi-tenant security
    List<Map<String, Object>> getAttendanceTrendsAndAccessibleScopes(Long classId, LocalDate startDate, LocalDate endDate, Long currentUserId);
    List<Map<String, Object>> getStudentAttendanceTrendsAndAccessibleScopes(Long studentId, LocalDate startDate, LocalDate endDate, Long currentUserId);
    
    // Quick marking support with multi-tenant security
    List<AttendanceRecordDTO> quickMarkAllPresentAndAccessibleScopes(Long classId, LocalDate date, AttendanceType type, Integer periodNumber, Long markedById, Long currentUserId);
    List<AttendanceRecordDTO> quickMarkAllAbsentAndAccessibleScopes(Long classId, LocalDate date, AttendanceType type, Integer periodNumber, Long markedById, AttendanceStatus absentType, Long currentUserId);

    // ==================== EXISTING METHODS ====================

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
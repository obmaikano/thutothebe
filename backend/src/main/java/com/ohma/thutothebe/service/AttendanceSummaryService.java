package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.AttendanceSummaryDTO;
import com.ohma.thutothebe.entity.AttendanceSummary.AttendanceSummaryType;
import com.ohma.thutothebe.entity.Term;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface AttendanceSummaryService extends BaseService<AttendanceSummaryDTO, Long> {

    // Student-based queries
    List<AttendanceSummaryDTO> getSummariesByStudent(Long studentId);
    
    List<AttendanceSummaryDTO> getSummariesByStudentAndAcademicYear(Long studentId, Integer academicYear);
    
    List<AttendanceSummaryDTO> getSummariesByStudentAndAcademicYearAndTerm(Long studentId, Integer academicYear, Term term);

    // Class-based queries
    List<AttendanceSummaryDTO> getSummariesByClass(Long classId);
    
    List<AttendanceSummaryDTO> getSummariesByClassAndAcademicYear(Long classId, Integer academicYear);
    
    List<AttendanceSummaryDTO> getSummariesByClassAndAcademicYearAndTerm(Long classId, Integer academicYear, Term term);

    // Course-based queries
    List<AttendanceSummaryDTO> getSummariesByCourse(Long courseId);
    
    List<AttendanceSummaryDTO> getSummariesByCourseAndAcademicYear(Long courseId, Integer academicYear);
    
    List<AttendanceSummaryDTO> getSummariesByCourseAndAcademicYearAndTerm(Long courseId, Integer academicYear, Term term);

    // Subject-based queries
    List<AttendanceSummaryDTO> getSummariesBySubject(Long subjectId);

    // Summary type queries
    List<AttendanceSummaryDTO> getSummariesByType(AttendanceSummaryType summaryType);

    // Specific summary retrieval
    Optional<AttendanceSummaryDTO> getSummaryByStudentAndClassAndAcademicYearAndTermAndType(
        Long studentId, Long classId, Integer academicYear, Term term, AttendanceSummaryType summaryType);
    
    Optional<AttendanceSummaryDTO> getSummaryByStudentAndCourseAndAcademicYearAndTermAndType(
        Long studentId, Long courseId, Integer academicYear, Term term, AttendanceSummaryType summaryType);

    // Low attendance identification
    List<AttendanceSummaryDTO> getStudentsWithLowAttendance(Double threshold);
    
    List<AttendanceSummaryDTO> getStudentsWithLowAttendanceByClass(Long classId, Double threshold);
    
    List<AttendanceSummaryDTO> getStudentsWithLowAttendanceBySchool(Long schoolId, Double threshold);

    // Statistics and analytics
    Double getAverageAttendancePercentageByClass(Long classId, Integer academicYear, Term term);
    
    Double getAverageAttendancePercentageByCourse(Long courseId, Integer academicYear, Term term);
    
    Long countStudentsWithGoodAttendance(Long classId, Double threshold, Integer academicYear, Term term);
    
    Long countStudentsWithPoorAttendance(Long classId, Double threshold, Integer academicYear, Term term);

    // Summary generation and calculation
    AttendanceSummaryDTO generateSummaryForStudent(Long studentId, Long classId, Integer academicYear, Term term, AttendanceSummaryType summaryType);
    
    AttendanceSummaryDTO generateSummaryForStudentAndCourse(Long studentId, Long courseId, Integer academicYear, Term term, AttendanceSummaryType summaryType);
    
    List<AttendanceSummaryDTO> generateSummariesForClass(Long classId, Integer academicYear, Term term, AttendanceSummaryType summaryType);
    
    List<AttendanceSummaryDTO> generateSummariesForCourse(Long courseId, Integer academicYear, Term term, AttendanceSummaryType summaryType);

    // Bulk summary operations
    void generateAllSummariesForClass(Long classId, Integer academicYear, Term term);
    
    void generateAllSummariesForSchool(Long schoolId, Integer academicYear, Term term);
    
    void recalculateAllSummaries(Integer academicYear, Term term);

    // Summary updates and recalculation
    AttendanceSummaryDTO recalculateSummary(Long summaryId);
    
    List<AttendanceSummaryDTO> recalculateSummariesForStudent(Long studentId, Integer academicYear, Term term);
    
    void recalculateOutdatedSummaries(LocalDate cutoffDate);

    // Date range queries
    List<AttendanceSummaryDTO> getSummariesByLastCalculatedDateRange(LocalDate startDate, LocalDate endDate);
    
    List<AttendanceSummaryDTO> getSummariesByPeriodRange(LocalDate fromDate, LocalDate toDate);

    // School-based queries for reporting
    List<AttendanceSummaryDTO> getSummariesBySchoolAndAcademicYear(Long schoolId, Integer academicYear);
    
    List<AttendanceSummaryDTO> getSummariesBySchoolAndAcademicYearAndTerm(Long schoolId, Integer academicYear, Term term);

    // Academic year queries
    List<AttendanceSummaryDTO> getSummariesByAcademicYear(Integer academicYear);
    
    List<AttendanceSummaryDTO> getSummariesByAcademicYearAndTerm(Integer academicYear, Term term);

    // Dashboard and reporting data
    Map<String, Object> getAttendanceSummaryDashboard(Long classId, Integer academicYear, Term term);
    
    Map<String, Object> getSchoolAttendanceSummaryDashboard(Long schoolId, Integer academicYear, Term term);
    
    Map<String, Object> getStudentAttendanceSummaryReport(Long studentId, Integer academicYear);

    // Attendance trends and analytics
    List<Map<String, Object>> getAttendanceTrendsByClass(Long classId, Integer academicYear);
    
    List<Map<String, Object>> getAttendanceTrendsBySchool(Long schoolId, Integer academicYear);
    
    Map<String, Object> getAttendanceComparisonReport(Long classId, Integer academicYear, Term term);

    // Export functionality
    byte[] exportSummariesToExcel(Long classId, Integer academicYear, Term term);
    
    byte[] exportSummariesToPdf(Long classId, Integer academicYear, Term term);
    
    byte[] exportStudentSummaryReport(Long studentId, Integer academicYear);

    // Alert and notification support
    List<AttendanceSummaryDTO> getStudentsRequiringAttention(Long classId, Double attendanceThreshold, Integer absentDaysThreshold);
    
    List<Map<String, Object>> generateAttendanceAlerts(Long schoolId, Double attendanceThreshold);

    // Performance optimization
    void refreshSummaryCache(Long classId, Integer academicYear, Term term);
    
    void clearOutdatedSummaries(Integer academicYear);

    // Validation and integrity checks
    boolean validateSummaryData(Long summaryId);
    
    List<AttendanceSummaryDTO> findInconsistentSummaries(Long classId, Integer academicYear, Term term);
    
    void fixInconsistentSummaries(Long classId, Integer academicYear, Term term);
} 
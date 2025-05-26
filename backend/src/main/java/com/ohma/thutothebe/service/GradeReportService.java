package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.GradeReportDTO;
import com.ohma.thutothebe.entity.GradeReportType;
import com.ohma.thutothebe.entity.Term;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface GradeReportService extends BaseService<GradeReportDTO, Long> {

    List<GradeReportDTO> findByGeneratedByIdOrderByGeneratedAtDesc(Long userId);
    
    List<GradeReportDTO> findByCourseIdOrderByGeneratedAtDesc(Long courseId);
    
    List<GradeReportDTO> findByTermOrderByGeneratedAtDesc(Term term);
    
    List<GradeReportDTO> findByReportTypeOrderByGeneratedAtDesc(GradeReportType reportType);
    
    List<GradeReportDTO> findByCourseIdAndTermOrderByGeneratedAtDesc(Long courseId, Term term);
    
    List<GradeReportDTO> findByCourseIdAndTermAndReportTypeOrderByGeneratedAtDesc(
            Long courseId, Term term, GradeReportType reportType);
    
    List<GradeReportDTO> findByGeneratedAtBetweenOrderByGeneratedAtDesc(
            LocalDateTime startDate, LocalDateTime endDate);
    
    List<GradeReportDTO> findByGeneratedByIdAndCourseIdOrderByGeneratedAtDesc(
            Long userId, Long courseId);
    
    Long countByGeneratedByIdAndGeneratedAtAfter(Long userId, LocalDateTime startDate);
    
    Optional<GradeReportDTO> findByFileName(String fileName);
    
    GradeReportDTO generateStudentIndividualReport(Long studentId, Long courseId, Term term, 
                                                  Integer academicYear, Long generatedById);
    
    GradeReportDTO generateStudentTermReport(Long studentId, Term term, Integer academicYear, Long generatedById);
    
    GradeReportDTO generateStudentAnnualReport(Long studentId, Integer academicYear, Long generatedById);
    
    GradeReportDTO generateClassSummaryReport(Long classId, Term term, Integer academicYear, Long generatedById);
    
    GradeReportDTO generateSubjectSummaryReport(Long courseId, Term term, Integer academicYear, Long generatedById);
    
    GradeReportDTO generateCourseSummaryReport(Long courseId, Term term, Integer academicYear, Long generatedById);
    
    GradeReportDTO generateProgressReport(Long studentId, Term term, Integer academicYear, Long generatedById);
    
    GradeReportDTO generateTranscript(Long studentId, Integer academicYear, Long generatedById);
    
    byte[] exportReportToPdf(Long reportId);
    
    byte[] exportReportToExcel(Long reportId);
    
    String saveReportFile(Long reportId, byte[] fileContent, String fileExtension);
    
    void deleteReportFile(Long reportId);
    
    List<GradeReportDTO> findRecentReports(int limit);
    
    List<GradeReportDTO> findReportsByStudent(Long studentId);
} 
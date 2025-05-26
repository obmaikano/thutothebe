package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.GradeDTO;
import com.ohma.thutothebe.entity.GradeType;
import com.ohma.thutothebe.entity.Term;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface GradeService extends BaseService<GradeDTO, Long> {

    List<GradeDTO> findByStudentId(Long studentId);
    
    List<GradeDTO> findByCourseId(Long courseId);
    
    List<GradeDTO> findByStudentIdAndCourseId(Long studentId, Long courseId);
    
    List<GradeDTO> findByGradeType(GradeType gradeType);
    
    List<GradeDTO> findByStudentIdAndGradeType(Long studentId, GradeType gradeType);
    
    List<GradeDTO> findByCourseIdAndGradeType(Long courseId, GradeType gradeType);
    
    List<GradeDTO> findByAssessmentId(Long assessmentId);
    
    List<GradeDTO> findByAssignmentId(Long assignmentId);
    
    List<GradeDTO> findByTerm(Term term);
    
    List<GradeDTO> findByStudentIdAndTerm(Long studentId, Term term);
    
    List<GradeDTO> findByAcademicYear(Integer year);
    
    List<GradeDTO> findByStudentIdAndAcademicYear(Long studentId, Integer year);
    
    List<GradeDTO> findByClassId(Long classId);
    
    List<GradeDTO> findByStudentIdAndClassId(Long studentId, Long classId);
    
    List<GradeDTO> findByTeacherId(Long teacherId);
    
    Page<GradeDTO> findByStudentId(Long studentId, Pageable pageable);
    
    Page<GradeDTO> findByCourseId(Long courseId, Pageable pageable);
    
    Double calculateAverageScoreByStudentAndCourse(Long studentId, Long courseId);
    
    Double calculateAverageScoreByCourse(Long courseId);
    
    Double calculateAverageScoreByStudent(Long studentId);
    
    Long countPassingGradesByStudent(Long studentId, Double passingGrade);
    
    Long countPassingGradesByCourse(Long courseId, Double passingGrade);
    
    GradeDTO moderateGrade(Long gradeId, Long moderatorId, String moderationNotes, Double newScore);
    
    List<GradeDTO> findUnmoderatedGrades();
    
    List<GradeDTO> findModeratedGrades();
    
    boolean existsByStudentIdAndAssessmentId(Long studentId, Long assessmentId);
    
    boolean existsByStudentIdAndAssignmentId(Long studentId, Long assignmentId);
    
    GradeDTO createGradeForAssessment(Long studentId, Long assessmentId, Double score, Long gradedById);
    
    GradeDTO createGradeForAssignment(Long studentId, Long assignmentId, Double score, Long gradedById);
    
    List<GradeDTO> bulkCreateGrades(List<GradeDTO> grades);
    
    void deactivateGrade(Long gradeId);
    
    void reactivateGrade(Long gradeId);

    List<GradeDTO> findByGradeCategoryId(Long gradeCategoryId);
    
    List<GradeDTO> findByStudentIdAndGradeCategoryId(Long studentId, Long gradeCategoryId);
    
    Double calculateAverageScoreByGradeCategory(Long gradeCategoryId);
    
    Long countPassingGradesByGradeCategory(Long gradeCategoryId, Double passingGrade);
    
    boolean existsByStudentIdAndGradeCategoryId(Long studentId, Long gradeCategoryId);
    
    GradeDTO createGradeForCategory(Long studentId, Long gradeCategoryId, Double score, Long gradedById, String feedback);
} 
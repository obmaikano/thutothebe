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
    
    boolean existsForStudentAndAssessment(Long studentId, Long assessmentId);
    
    boolean existsForStudentAndAssignment(Long studentId, Long assignmentId);
    
    boolean existsForStudentAndCategory(Long studentId, Long gradeCategoryId);

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    /**
     * Get grades filtered by accessible scope IDs based on user's permissions
     * This replaces the unsafe getAll() method
     */
    List<GradeDTO> getGradesByAccessibleScopes(Long currentUserId);
    
    /**
     * Get active grades filtered by accessible scope IDs
     */
    List<GradeDTO> getActiveGradesByAccessibleScopes(Long currentUserId);
    
    /**
     * Get grades by specific school ID (for school-level access)
     */
    List<GradeDTO> getGradesBySchoolId(Long schoolId);
    
    /**
     * Get grades by specific region ID (for regional access)
     */
    List<GradeDTO> getGradesByRegionId(Long regionId);
    
    /**
     * Get active grades by school ID
     */
    List<GradeDTO> getActiveGradesBySchoolId(Long schoolId);
    
    /**
     * Get active grades by region ID
     */
    List<GradeDTO> getActiveGradesByRegionId(Long regionId);
    
    /**
     * Get grades by multiple school IDs (for class-level access across schools)
     */
    List<GradeDTO> getGradesBySchoolIds(List<Long> schoolIds);
    
    /**
     * Get grades by multiple region IDs (for regional access across regions)
     */
    List<GradeDTO> getGradesByRegionIds(List<Long> regionIds);
    
    /**
     * Get grades by specific student IDs (for user-level access)
     */
    List<GradeDTO> getGradesByStudentIds(List<Long> studentIds);
    
    /**
     * Get active grades by multiple school IDs
     */
    List<GradeDTO> getActiveGradesBySchoolIds(List<Long> schoolIds);
    
    /**
     * Get active grades by multiple region IDs
     */
    List<GradeDTO> getActiveGradesByRegionIds(List<Long> regionIds);
    
    /**
     * Get active grades by specific student IDs
     */
    List<GradeDTO> getActiveGradesByStudentIds(List<Long> studentIds);
    
    /**
     * Get grades by multi-scope access (combines school, region, and student level access)
     */
    List<GradeDTO> getGradesByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> studentIds);
    
    /**
     * Get active grades by multi-scope access
     */
    List<GradeDTO> getActiveGradesByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> studentIds);
    
    /**
     * Get grades by course and accessible scopes (secure course grades)
     */
    List<GradeDTO> getGradesByCourseIdAndAccessibleScopes(Long courseId, Long currentUserId);
    
    /**
     * Get grades by class and accessible scopes (secure class grades)
     */
    List<GradeDTO> getGradesByClassIdAndAccessibleScopes(Long classId, Long currentUserId);
    
    /**
     * Get grades by teacher and accessible scopes (secure teacher grades)
     */
    List<GradeDTO> getGradesByTeacherIdAndAccessibleScopes(Long teacherId, Long currentUserId);
    
    /**
     * Get grades by assessment and accessible scopes (secure assessment grades)
     */
    List<GradeDTO> getGradesByAssessmentIdAndAccessibleScopes(Long assessmentId, Long currentUserId);
    
    /**
     * Get grades by assignment and accessible scopes (secure assignment grades)
     */
    List<GradeDTO> getGradesByAssignmentIdAndAccessibleScopes(Long assignmentId, Long currentUserId);
    
    /**
     * Get grades by grade category and accessible scopes (secure grade category grades)
     */
    List<GradeDTO> getGradesByGradeCategoryIdAndAccessibleScopes(Long gradeCategoryId, Long currentUserId);
    
    /**
     * Get grades by grade type and accessible scopes (secure grade type filtering)
     */
    List<GradeDTO> getGradesByGradeTypeAndAccessibleScopes(GradeType gradeType, Long currentUserId);
    
    /**
     * Get grades by term and accessible scopes (secure term filtering)
     */
    List<GradeDTO> getGradesByTermAndAccessibleScopes(Term term, Long currentUserId);
    
    /**
     * Get grades by academic year and accessible scopes (secure academic year filtering)
     */
    List<GradeDTO> getGradesByAcademicYearAndAccessibleScopes(Integer academicYear, Long currentUserId);
    
    /**
     * Get grades by moderation status and accessible scopes (secure moderation filtering)
     */
    List<GradeDTO> getGradesByModerationStatusAndAccessibleScopes(boolean isModerated, Long currentUserId);
    
    /**
     * Get unmoderated grades by accessible scopes (secure unmoderated grades)
     */
    List<GradeDTO> getUnmoderatedGradesByAccessibleScopes(Long currentUserId);
    
    /**
     * Get moderated grades by accessible scopes (secure moderated grades)
     */
    List<GradeDTO> getModeratedGradesByAccessibleScopes(Long currentUserId);
} 
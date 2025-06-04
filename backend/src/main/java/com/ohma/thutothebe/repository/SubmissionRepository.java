package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.entity.Submission;
import com.ohma.thutothebe.entity.SubmissionStatus;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.enums.GradingMode;
import com.ohma.thutothebe.entity.enums.SubmissionPhase;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    
    List<Submission> findByAssignment(Assignment assignment);
    
    List<Submission> findByStudent(User student);
    
    Optional<Submission> findByAssignmentAndStudent(Assignment assignment, User student);
    
    @Query("SELECT s FROM Submission s WHERE s.assignment = :assignment AND s.status = 'GRADED'")
    List<Submission> findGradedByAssignment(@Param("assignment") Assignment assignment);
    
    @Query("SELECT s FROM Submission s WHERE s.student = :student AND s.status = 'GRADED'")
    List<Submission> findGradedByStudent(@Param("student") User student);
    
    boolean existsByAssignmentAndStudent(Assignment assignment, User student);

    @EntityGraph(attributePaths = {"user", "course", "assessments"})
    List<Submission> findByCourseId(Long courseId);

    @EntityGraph(attributePaths = {"user", "course", "assessments"})
    List<Submission> findByCourseIdAndPhase(Long courseId, SubmissionPhase phase);

    @Query("SELECT s FROM Submission s WHERE s.course.id = :courseId AND s.student.id != :userId")
    @EntityGraph(attributePaths = {"user", "course", "assessments"})
    List<Submission> findOtherSubmissionsByCourseId(Long courseId, Long userId);

    @Query("SELECT COUNT(s) FROM Submission s WHERE s.course.id = :courseId")
    long countSubmissionsByCourseId(Long courseId);

    @Query("SELECT s FROM Submission s JOIN s.assignment a JOIN a.course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId")
    List<Submission> findByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT s FROM Submission s JOIN s.assignment a JOIN a.course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId AND s.status = 'PENDING'")
    List<Submission> findPendingByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT s FROM Submission s JOIN s.assignment a JOIN a.course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId AND s.submittedAt > a.dueDate")
    List<Submission> findLateByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT s FROM Submission s WHERE s.course.id = :courseId AND s.status = 'PENDING'")
    List<Submission> findPendingByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT s FROM Submission s JOIN s.assignment a WHERE s.course.id = :courseId AND s.submittedAt > a.dueDate")
    List<Submission> findLateByCourseId(@Param("courseId") Long courseId);
    
    // Additional methods expected by tests
    @Query("SELECT s FROM Submission s JOIN s.assignment a JOIN a.course c JOIN c.courseInstructors ci WHERE ci.teacher.id = :teacherId AND s.requiresManualReview = true")
    List<Submission> findNeedingReviewByTeacherId(@Param("teacherId") Long teacherId);
    
    List<Submission> findByIdIn(List<Long> ids);

    // ==================== EXISTING BASIC METHODS ====================
    
    @EntityGraph(attributePaths = {"student", "course", "assignment", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s")
    List<Submission> findAllWithDetails();
    
    @EntityGraph(attributePaths = {"student", "course", "assignment", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.student.id = :studentId")
    List<Submission> findByStudentId(@Param("studentId") Long studentId);
    
    @EntityGraph(attributePaths = {"student", "course", "assignment", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.assignment.id = :assignmentId")
    List<Submission> findByAssignmentId(@Param("assignmentId") Long assignmentId);
    
    @EntityGraph(attributePaths = {"student", "course", "assignment", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.status = :status")
    List<Submission> findByStatus(@Param("status") SubmissionStatus status);
    
    @EntityGraph(attributePaths = {"student", "course", "assignment", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.phase = :phase")
    List<Submission> findByPhase(@Param("phase") SubmissionPhase phase);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.student.id = :studentId")
    Long countByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Submission s WHERE s.student.id = :studentId AND s.assignment.id = :assignmentId")
    boolean existsByStudentIdAndAssignmentId(@Param("studentId") Long studentId, @Param("assignmentId") Long assignmentId);

    // ==================== MULTI-TENANT SECURITY METHODS ====================
    
    // Enhanced school-level filtering with EntityGraph
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.course.classEntity.school.id = :schoolId")
    List<Submission> findBySchoolIdSecure(@Param("schoolId") Long schoolId);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.course.classEntity.school.id = :schoolId")
    List<Submission> findActiveSubmissionsBySchoolId(@Param("schoolId") Long schoolId);
    
    // Region-level filtering
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.course.classEntity.school.region.id = :regionId")
    List<Submission> findByRegionId(@Param("regionId") Long regionId);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.course.classEntity.school.region.id = :regionId")
    List<Submission> findActiveSubmissionsByRegionId(@Param("regionId") Long regionId);
    
    // Multi-scope filtering
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.course.classEntity.school.id IN :schoolIds")
    List<Submission> findBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.course.classEntity.school.id IN :schoolIds OR s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findByMultiScopeAccess(@Param("schoolIds") List<Long> schoolIds,
                                           @Param("regionIds") List<Long> regionIds);
    
    // Student filtering with multi-tenant security
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.student.id = :studentId AND s.course.classEntity.school.id IN :schoolIds")
    List<Submission> findByStudentIdAndSchoolIdIn(@Param("studentId") Long studentId,
                                                  @Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.student.id = :studentId AND s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findByStudentIdAndRegionIdIn(@Param("studentId") Long studentId,
                                                  @Param("regionIds") List<Long> regionIds);
    
    // Assignment filtering with multi-tenant security
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.assignment.id = :assignmentId AND s.course.classEntity.school.id IN :schoolIds")
    List<Submission> findByAssignmentIdAndSchoolIdIn(@Param("assignmentId") Long assignmentId,
                                                     @Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.assignment.id = :assignmentId AND s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findByAssignmentIdAndRegionIdIn(@Param("assignmentId") Long assignmentId,
                                                     @Param("regionIds") List<Long> regionIds);
    
    // Status filtering with multi-tenant security
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.status = :status AND s.course.classEntity.school.id IN :schoolIds")
    List<Submission> findByStatusAndSchoolIdIn(@Param("status") SubmissionStatus status,
                                              @Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.status = :status AND s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findByStatusAndRegionIdIn(@Param("status") SubmissionStatus status,
                                              @Param("regionIds") List<Long> regionIds);
    
    // Phase filtering with multi-tenant security
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.phase = :phase AND s.course.classEntity.school.id IN :schoolIds")
    List<Submission> findByPhaseAndSchoolIdIn(@Param("phase") SubmissionPhase phase,
                                             @Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.phase = :phase AND s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findByPhaseAndRegionIdIn(@Param("phase") SubmissionPhase phase,
                                             @Param("regionIds") List<Long> regionIds);
    
    // Grading mode filtering with multi-tenant security
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.gradingMode = :gradingMode AND s.course.classEntity.school.id IN :schoolIds")
    List<Submission> findByGradingModeAndSchoolIdIn(@Param("gradingMode") GradingMode gradingMode,
                                                   @Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.gradingMode = :gradingMode AND s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findByGradingModeAndRegionIdIn(@Param("gradingMode") GradingMode gradingMode,
                                                   @Param("regionIds") List<Long> regionIds);
    
    // Course filtering with multi-tenant security
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.course.id = :courseId AND s.course.classEntity.school.id IN :schoolIds")
    List<Submission> findByCourseIdAndSchoolIdIn(@Param("courseId") Long courseId,
                                                 @Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.course.id = :courseId AND s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findByCourseIdAndRegionIdIn(@Param("courseId") Long courseId,
                                                 @Param("regionIds") List<Long> regionIds);
    
    // Submission date range filtering with multi-tenant security
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.submittedAt >= :startDate AND s.submittedAt <= :endDate AND s.course.classEntity.school.id IN :schoolIds")
    List<Submission> findBySubmissionDateRangeAndSchoolIdIn(@Param("startDate") LocalDateTime startDate,
                                                           @Param("endDate") LocalDateTime endDate,
                                                           @Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.submittedAt >= :startDate AND s.submittedAt <= :endDate AND s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findBySubmissionDateRangeAndRegionIdIn(@Param("startDate") LocalDateTime startDate,
                                                           @Param("endDate") LocalDateTime endDate,
                                                           @Param("regionIds") List<Long> regionIds);
    
    // Late submissions filtering with multi-tenant security
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.isLateSubmission = true AND s.course.classEntity.school.id IN :schoolIds")
    List<Submission> findLateSubmissionsBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.isLateSubmission = true AND s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findLateSubmissionsByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    // Graded submissions filtering with multi-tenant security
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.gradedBy IS NOT NULL AND s.course.classEntity.school.id IN :schoolIds")
    List<Submission> findGradedSubmissionsBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.gradedBy IS NOT NULL AND s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findGradedSubmissionsByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    // Ungraded submissions filtering with multi-tenant security
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.gradedBy IS NULL AND s.course.classEntity.school.id IN :schoolIds")
    List<Submission> findUngradedSubmissionsBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.gradedBy IS NULL AND s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findUngradedSubmissionsByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    // Auto-graded submissions filtering with multi-tenant security
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.autoGraded = true AND s.course.classEntity.school.id IN :schoolIds")
    List<Submission> findAutoGradedSubmissionsBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.autoGraded = true AND s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findAutoGradedSubmissionsByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    // Manually graded submissions filtering with multi-tenant security
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.manuallyGraded = true AND s.course.classEntity.school.id IN :schoolIds")
    List<Submission> findManuallyGradedSubmissionsBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.manuallyGraded = true AND s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findManuallyGradedSubmissionsByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    // Needs review submissions filtering with multi-tenant security
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.needsReview = true AND s.course.classEntity.school.id IN :schoolIds")
    List<Submission> findSubmissionsNeedingReviewBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.needsReview = true AND s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findSubmissionsNeedingReviewByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    // Graded by filtering with multi-tenant security
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.gradedBy.id = :gradedById AND s.course.classEntity.school.id IN :schoolIds")
    List<Submission> findByGradedByIdAndSchoolIdIn(@Param("gradedById") Long gradedById,
                                                   @Param("schoolIds") List<Long> schoolIds);
    
    @EntityGraph(attributePaths = {"student", "course", "course.classEntity.school", "course.classEntity.school.region", "assignment", "assignment.course", "assignment.course.classEntity.school", "assessments", "assignmentResponses", "gradingResults", "gradedBy", "reviewedBy"})
    @Query("SELECT s FROM Submission s WHERE s.gradedBy.id = :gradedById AND s.course.classEntity.school.region.id IN :regionIds")
    List<Submission> findByGradedByIdAndRegionIdIn(@Param("gradedById") Long gradedById,
                                                   @Param("regionIds") List<Long> regionIds);
    
    // Business rule validation methods with multi-tenant security
    @Query("SELECT COUNT(s) > 0 FROM Submission s WHERE s.student.id = :studentId AND s.assignment.id = :assignmentId AND s.course.classEntity.school.id IN :schoolIds")
    boolean existsByStudentIdAndAssignmentIdAndSchoolIdIn(@Param("studentId") Long studentId,
                                                         @Param("assignmentId") Long assignmentId,
                                                         @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) > 0 FROM Submission s WHERE s.assignment.id = :assignmentId AND s.course.classEntity.school.id IN :schoolIds")
    boolean existsByAssignmentIdAndSchoolIdIn(@Param("assignmentId") Long assignmentId,
                                             @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) > 0 FROM Submission s WHERE s.course.id = :courseId AND s.course.classEntity.school.id IN :schoolIds")
    boolean existsByCourseIdAndSchoolIdIn(@Param("courseId") Long courseId,
                                         @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) > 0 FROM Submission s WHERE s.student.id = :studentId AND s.course.classEntity.school.id IN :schoolIds")
    boolean existsByStudentIdAndSchoolIdIn(@Param("studentId") Long studentId,
                                          @Param("schoolIds") List<Long> schoolIds);
    
    // Count methods for statistics with multi-tenant security
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.course.classEntity.school.id IN :schoolIds")
    Long countBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.course.classEntity.school.region.id IN :regionIds")
    Long countByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.status = :status AND s.course.classEntity.school.id IN :schoolIds")
    Long countByStatusAndSchoolIdIn(@Param("status") SubmissionStatus status,
                                   @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.phase = :phase AND s.course.classEntity.school.id IN :schoolIds")
    Long countByPhaseAndSchoolIdIn(@Param("phase") SubmissionPhase phase,
                                  @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.gradingMode = :gradingMode AND s.course.classEntity.school.id IN :schoolIds")
    Long countByGradingModeAndSchoolIdIn(@Param("gradingMode") GradingMode gradingMode,
                                        @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.student.id = :studentId AND s.course.classEntity.school.id IN :schoolIds")
    Long countByStudentIdAndSchoolIdIn(@Param("studentId") Long studentId,
                                      @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.assignment.id = :assignmentId AND s.course.classEntity.school.id IN :schoolIds")
    Long countByAssignmentIdAndSchoolIdIn(@Param("assignmentId") Long assignmentId,
                                         @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.isLateSubmission = true AND s.course.classEntity.school.id IN :schoolIds")
    Long countLateSubmissionsBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.gradedBy IS NOT NULL AND s.course.classEntity.school.id IN :schoolIds")
    Long countGradedSubmissionsBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.gradedBy IS NULL AND s.course.classEntity.school.id IN :schoolIds")
    Long countUngradedSubmissionsBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.autoGraded = true AND s.course.classEntity.school.id IN :schoolIds")
    Long countAutoGradedSubmissionsBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.manuallyGraded = true AND s.course.classEntity.school.id IN :schoolIds")
    Long countManuallyGradedSubmissionsBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.needsReview = true AND s.course.classEntity.school.id IN :schoolIds")
    Long countSubmissionsNeedingReviewBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.gradedBy.id = :gradedById AND s.course.classEntity.school.id IN :schoolIds")
    Long countByGradedByIdAndSchoolIdIn(@Param("gradedById") Long gradedById,
                                       @Param("schoolIds") List<Long> schoolIds);
    
    // Score statistics with multi-tenant security
    @Query("SELECT AVG(s.finalScore) FROM Submission s WHERE s.finalScore IS NOT NULL AND s.course.classEntity.school.id IN :schoolIds")
    Double getAverageScoreBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT MAX(s.finalScore) FROM Submission s WHERE s.finalScore IS NOT NULL AND s.course.classEntity.school.id IN :schoolIds")
    Double getMaxScoreBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT MIN(s.finalScore) FROM Submission s WHERE s.finalScore IS NOT NULL AND s.course.classEntity.school.id IN :schoolIds")
    Double getMinScoreBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT AVG(s.finalScore) FROM Submission s WHERE s.finalScore IS NOT NULL AND s.assignment.id = :assignmentId AND s.course.classEntity.school.id IN :schoolIds")
    Double getAverageScoreByAssignmentIdAndSchoolIdIn(@Param("assignmentId") Long assignmentId,
                                                     @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT AVG(s.finalScore) FROM Submission s WHERE s.finalScore IS NOT NULL AND s.student.id = :studentId AND s.course.classEntity.school.id IN :schoolIds")
    Double getAverageScoreByStudentIdAndSchoolIdIn(@Param("studentId") Long studentId,
                                                  @Param("schoolIds") List<Long> schoolIds);
} 
package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Grade;
import com.ohma.thutothebe.entity.GradeType;
import com.ohma.thutothebe.entity.Term;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {

    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByStudentIdAndActive(Long studentId, boolean active);

    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByCourseIdAndActive(Long courseId, boolean active);

    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByStudentIdAndCourseIdAndActive(Long studentId, Long courseId, boolean active);

    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByGradeTypeAndActive(GradeType gradeType, boolean active);

    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByStudentIdAndGradeTypeAndActive(Long studentId, GradeType gradeType, boolean active);

    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByCourseIdAndGradeTypeAndActive(Long courseId, GradeType gradeType, boolean active);

    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByGradeCategoryIdAndActive(Long gradeCategoryId, boolean active);

    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByStudentIdAndGradeCategoryIdAndActive(Long studentId, Long gradeCategoryId, boolean active);

    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByAssessmentIdAndActive(Long assessmentId, boolean active);

    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByAssignmentIdAndActive(Long assignmentId, boolean active);

    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    Page<Grade> findByStudentIdAndActive(Long studentId, boolean active, Pageable pageable);

    @Query("SELECT g FROM Grade g WHERE g.student.id = :studentId AND g.course.term = :term AND g.active = :active")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByStudentIdAndTermAndActive(@Param("studentId") Long studentId, @Param("term") Term term, @Param("active") boolean active);

    @Query("SELECT g FROM Grade g WHERE g.student.id = :studentId AND g.course.year = :academicYear AND g.active = :active")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByStudentIdAndAcademicYearAndActive(@Param("studentId") Long studentId, @Param("academicYear") Integer academicYear, @Param("active") boolean active);

    @Query("SELECT g FROM Grade g WHERE g.isModerated = false AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findUnmoderatedGrades();

    @Query("SELECT g FROM Grade g WHERE g.isModerated = true AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findModeratedGrades();

    @Query("SELECT AVG(g.score) FROM Grade g WHERE g.student.id = :studentId AND g.course.id = :courseId AND g.active = true")
    Optional<Double> findAverageScoreByStudentAndCourse(@Param("studentId") Long studentId, @Param("courseId") Long courseId);

    @Query("SELECT AVG(g.score) FROM Grade g WHERE g.course.id = :courseId AND g.active = true")
    Optional<Double> findAverageScoreByCourse(@Param("courseId") Long courseId);

    @Query("SELECT AVG(g.score) FROM Grade g WHERE g.student.id = :studentId AND g.active = true")
    Optional<Double> findAverageScoreByStudent(@Param("studentId") Long studentId);

    @Query("SELECT AVG(g.score) FROM Grade g WHERE g.gradeCategory.id = :gradeCategoryId AND g.active = true")
    Optional<Double> findAverageScoreByGradeCategory(@Param("gradeCategoryId") Long gradeCategoryId);

    @Query("SELECT COUNT(g) FROM Grade g WHERE g.student.id = :studentId AND g.score >= :passingGrade AND g.active = true")
    Long countPassingGradesByStudent(@Param("studentId") Long studentId, @Param("passingGrade") Double passingGrade);

    @Query("SELECT COUNT(g) FROM Grade g WHERE g.course.id = :courseId AND g.score >= :passingGrade AND g.active = true")
    Long countPassingGradesByCourse(@Param("courseId") Long courseId, @Param("passingGrade") Double passingGrade);

    @Query("SELECT COUNT(g) FROM Grade g WHERE g.gradeCategory.id = :gradeCategoryId AND g.score >= :passingGrade AND g.active = true")
    Long countPassingGradesByGradeCategory(@Param("gradeCategoryId") Long gradeCategoryId, @Param("passingGrade") Double passingGrade);

    @Query("SELECT g FROM Grade g WHERE g.student.id = :studentId AND g.course.classEntity.id = :classId AND g.active = :active")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByStudentIdAndClassIdAndActive(@Param("studentId") Long studentId, @Param("classId") Long classId, @Param("active") boolean active);

    @Query("SELECT g FROM Grade g WHERE g.course.classEntity.id = :classId AND g.active = :active")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByClassIdAndActive(@Param("classId") Long classId, @Param("active") boolean active);

    @Query("SELECT g FROM Grade g WHERE g.gradedBy.id = :teacherId AND g.active = :active")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByTeacherIdAndActive(@Param("teacherId") Long teacherId, @Param("active") boolean active);

    boolean existsByStudentIdAndAssessmentIdAndActive(Long studentId, Long assessmentId, boolean active);

    boolean existsByStudentIdAndAssignmentIdAndActive(Long studentId, Long assignmentId, boolean active);

    boolean existsByStudentIdAndGradeCategoryIdAndActive(Long studentId, Long gradeCategoryId, boolean active);

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    // School-level filtering (through student → school and course → school relationships)
    @Query("SELECT g FROM Grade g WHERE g.student.school.id = :schoolId")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findBySchoolId(@Param("schoolId") Long schoolId);
    
    @Query("SELECT g FROM Grade g WHERE g.student.school.id = :schoolId AND g.active = :active")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findBySchoolIdAndActive(@Param("schoolId") Long schoolId, @Param("active") boolean active);
    
    @Query("SELECT g FROM Grade g WHERE g.student.school.id = :schoolId AND g.gradeType = :gradeType")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findBySchoolIdAndGradeType(@Param("schoolId") Long schoolId, @Param("gradeType") GradeType gradeType);
    
    @Query("SELECT g FROM Grade g WHERE g.student.school.id = :schoolId AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findActiveGradesBySchoolId(@Param("schoolId") Long schoolId);
    
    // Region-level filtering (through student → school → region relationship)
    @Query("SELECT g FROM Grade g WHERE g.student.school.region.id = :regionId")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByRegionId(@Param("regionId") Long regionId);
    
    @Query("SELECT g FROM Grade g WHERE g.student.school.region.id = :regionId AND g.active = :active")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByRegionIdAndActive(@Param("regionId") Long regionId, @Param("active") boolean active);
    
    @Query("SELECT g FROM Grade g WHERE g.student.school.region.id = :regionId AND g.gradeType = :gradeType")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByRegionIdAndGradeType(@Param("regionId") Long regionId, @Param("gradeType") GradeType gradeType);
    
    @Query("SELECT g FROM Grade g WHERE g.student.school.region.id = :regionId AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findActiveGradesByRegionId(@Param("regionId") Long regionId);
    
    // Multi-scope filtering (school IDs list for class-level access)
    @Query("SELECT g FROM Grade g WHERE g.student.school.id IN :schoolIds")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findBySchoolIdIn(@Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT g FROM Grade g WHERE g.student.school.id IN :schoolIds AND g.active = :active")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findBySchoolIdInAndActive(@Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT g FROM Grade g WHERE g.student.school.id IN :schoolIds AND g.gradeType = :gradeType")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findBySchoolIdInAndGradeType(@Param("schoolIds") List<Long> schoolIds, @Param("gradeType") GradeType gradeType);
    
    // Region IDs list filtering
    @Query("SELECT g FROM Grade g WHERE g.student.school.region.id IN :regionIds")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByRegionIdIn(@Param("regionIds") List<Long> regionIds);
    
    @Query("SELECT g FROM Grade g WHERE g.student.school.region.id IN :regionIds AND g.active = :active")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByRegionIdInAndActive(@Param("regionIds") List<Long> regionIds, @Param("active") boolean active);
    
    @Query("SELECT g FROM Grade g WHERE g.student.school.region.id IN :regionIds AND g.gradeType = :gradeType")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByRegionIdInAndGradeType(@Param("regionIds") List<Long> regionIds, @Param("gradeType") GradeType gradeType);
    
    // Student IDs list filtering (for user-level access)
    @Query("SELECT g FROM Grade g WHERE g.student.id IN :studentIds")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByStudentIdIn(@Param("studentIds") List<Long> studentIds);
    
    @Query("SELECT g FROM Grade g WHERE g.student.id IN :studentIds AND g.active = :active")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByStudentIdInAndActive(@Param("studentIds") List<Long> studentIds, @Param("active") boolean active);
    
    @Query("SELECT g FROM Grade g WHERE g.student.id IN :studentIds AND g.gradeType = :gradeType")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByStudentIdInAndGradeType(@Param("studentIds") List<Long> studentIds, @Param("gradeType") GradeType gradeType);
    
    // Combined filtering for complex access patterns
    @Query("SELECT g FROM Grade g WHERE " +
           "(g.student.school.id IN :schoolIds OR g.student.school.region.id IN :regionIds OR g.student.id IN :studentIds) " +
           "AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByMultiScopeAccess(@Param("schoolIds") List<Long> schoolIds, 
                                      @Param("regionIds") List<Long> regionIds, 
                                      @Param("studentIds") List<Long> studentIds);
    
    @Query("SELECT g FROM Grade g WHERE " +
           "(g.student.school.id IN :schoolIds OR g.student.school.region.id IN :regionIds OR g.student.id IN :studentIds) " +
           "AND g.active = :active")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByMultiScopeAccessAndActive(@Param("schoolIds") List<Long> schoolIds, 
                                               @Param("regionIds") List<Long> regionIds, 
                                               @Param("studentIds") List<Long> studentIds,
                                               @Param("active") boolean active);
    
    @Query("SELECT g FROM Grade g WHERE " +
           "(g.student.school.id IN :schoolIds OR g.student.school.region.id IN :regionIds OR g.student.id IN :studentIds) " +
           "AND g.gradeType = :gradeType")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByMultiScopeAccessAndGradeType(@Param("schoolIds") List<Long> schoolIds, 
                                                  @Param("regionIds") List<Long> regionIds, 
                                                  @Param("studentIds") List<Long> studentIds,
                                                  @Param("gradeType") GradeType gradeType);
    
    @Query("SELECT g FROM Grade g WHERE " +
           "(g.student.school.id IN :schoolIds OR g.student.school.region.id IN :regionIds OR g.student.id IN :studentIds) " +
           "AND g.active = :active AND g.gradeType = :gradeType")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByMultiScopeAccessAndActiveAndGradeType(@Param("schoolIds") List<Long> schoolIds, 
                                                           @Param("regionIds") List<Long> regionIds, 
                                                           @Param("studentIds") List<Long> studentIds,
                                                           @Param("active") boolean active,
                                                           @Param("gradeType") GradeType gradeType);
    
    // Course-level filtering with multi-tenancy
    @Query("SELECT g FROM Grade g WHERE g.course.id = :courseId AND g.student.school.id IN :schoolIds")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByCourseIdAndSchoolIdIn(@Param("courseId") Long courseId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT g FROM Grade g WHERE g.course.id = :courseId AND g.student.school.id IN :schoolIds AND g.active = :active")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByCourseIdAndSchoolIdInAndActive(@Param("courseId") Long courseId, @Param("schoolIds") List<Long> schoolIds, @Param("active") boolean active);
    
    @Query("SELECT g FROM Grade g WHERE g.course.id = :courseId AND g.student.school.id = :schoolId AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByCourseIdAndSchoolIdAndActive(@Param("courseId") Long courseId, @Param("schoolId") Long schoolId);
    
    // Class-level filtering with multi-tenancy (through course → class relationship)
    @Query("SELECT g FROM Grade g WHERE g.course.classEntity.id = :classId AND g.student.school.id IN :schoolIds AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByClassIdAndSchoolIdInAndActive(@Param("classId") Long classId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT g FROM Grade g WHERE g.course.classEntity.id = :classId AND g.student.school.id = :schoolId AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByClassIdAndSchoolIdAndActive(@Param("classId") Long classId, @Param("schoolId") Long schoolId);
    
    // Teacher-level filtering with multi-tenancy (through gradedBy relationship)
    @Query("SELECT g FROM Grade g WHERE g.gradedBy.id = :teacherId AND g.student.school.id IN :schoolIds AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByTeacherIdAndSchoolIdInAndActive(@Param("teacherId") Long teacherId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT g FROM Grade g WHERE g.gradedBy.id = :teacherId AND g.student.school.region.id IN :regionIds AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByTeacherIdAndRegionIdInAndActive(@Param("teacherId") Long teacherId, @Param("regionIds") List<Long> regionIds);
    
    // Assessment-level filtering with multi-tenancy
    @Query("SELECT g FROM Grade g WHERE g.assessment.id = :assessmentId AND g.student.school.id IN :schoolIds AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByAssessmentIdAndSchoolIdInAndActive(@Param("assessmentId") Long assessmentId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT g FROM Grade g WHERE g.assessment.id = :assessmentId AND g.student.school.region.id IN :regionIds AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByAssessmentIdAndRegionIdInAndActive(@Param("assessmentId") Long assessmentId, @Param("regionIds") List<Long> regionIds);
    
    // Assignment-level filtering with multi-tenancy
    @Query("SELECT g FROM Grade g WHERE g.assignment.id = :assignmentId AND g.student.school.id IN :schoolIds AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByAssignmentIdAndSchoolIdInAndActive(@Param("assignmentId") Long assignmentId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT g FROM Grade g WHERE g.assignment.id = :assignmentId AND g.student.school.region.id IN :regionIds AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByAssignmentIdAndRegionIdInAndActive(@Param("assignmentId") Long assignmentId, @Param("regionIds") List<Long> regionIds);
    
    // Grade category filtering with multi-tenancy
    @Query("SELECT g FROM Grade g WHERE g.gradeCategory.id = :gradeCategoryId AND g.student.school.id IN :schoolIds AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByGradeCategoryIdAndSchoolIdInAndActive(@Param("gradeCategoryId") Long gradeCategoryId, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT g FROM Grade g WHERE g.gradeCategory.id = :gradeCategoryId AND g.student.school.region.id IN :regionIds AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByGradeCategoryIdAndRegionIdInAndActive(@Param("gradeCategoryId") Long gradeCategoryId, @Param("regionIds") List<Long> regionIds);
    
    // Term filtering with multi-tenancy
    @Query("SELECT g FROM Grade g WHERE g.course.term = :term AND g.student.school.id IN :schoolIds AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByTermAndSchoolIdInAndActive(@Param("term") Term term, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT g FROM Grade g WHERE g.course.term = :term AND g.student.school.region.id IN :regionIds AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByTermAndRegionIdInAndActive(@Param("term") Term term, @Param("regionIds") List<Long> regionIds);
    
    // Academic year filtering with multi-tenancy
    @Query("SELECT g FROM Grade g WHERE g.course.year = :academicYear AND g.student.school.id IN :schoolIds AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByAcademicYearAndSchoolIdInAndActive(@Param("academicYear") Integer academicYear, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT g FROM Grade g WHERE g.course.year = :academicYear AND g.student.school.region.id IN :regionIds AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByAcademicYearAndRegionIdInAndActive(@Param("academicYear") Integer academicYear, @Param("regionIds") List<Long> regionIds);
    
    // Moderation filtering with multi-tenancy
    @Query("SELECT g FROM Grade g WHERE g.isModerated = :isModerated AND g.student.school.id IN :schoolIds AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByModerationStatusAndSchoolIdInAndActive(@Param("isModerated") boolean isModerated, @Param("schoolIds") List<Long> schoolIds);
    
    @Query("SELECT g FROM Grade g WHERE g.isModerated = :isModerated AND g.student.school.region.id IN :regionIds AND g.active = true")
    @EntityGraph(attributePaths = {"student", "course", "gradeCategory", "gradedBy", "moderatedBy"})
    List<Grade> findByModerationStatusAndRegionIdInAndActive(@Param("isModerated") boolean isModerated, @Param("regionIds") List<Long> regionIds);
} 
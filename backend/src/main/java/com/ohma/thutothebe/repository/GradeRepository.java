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
} 
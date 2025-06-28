package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.LessonCompletion;
import com.ohma.thutothebe.entity.LessonCompletion.CompletionStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LessonCompletionRepository extends JpaRepository<LessonCompletion, Long> {

    @EntityGraph(attributePaths = {"lesson", "student"})
    List<LessonCompletion> findByLessonId(Long lessonId);

    @EntityGraph(attributePaths = {"lesson", "student"})
    List<LessonCompletion> findByLessonIdAndActive(Long lessonId, boolean active);

    @EntityGraph(attributePaths = {"lesson", "student"})
    List<LessonCompletion> findByStudentId(Long studentId);

    @EntityGraph(attributePaths = {"lesson", "student"})
    List<LessonCompletion> findByStudentIdAndActive(Long studentId, boolean active);

    @EntityGraph(attributePaths = {"lesson", "student"})
    List<LessonCompletion> findByLessonIdAndStudentId(Long lessonId, Long studentId);

    @EntityGraph(attributePaths = {"lesson", "student"})
    Optional<LessonCompletion> findByLessonIdAndStudentIdAndActive(Long lessonId, Long studentId, boolean active);

    @EntityGraph(attributePaths = {"lesson", "student"})
    List<LessonCompletion> findByCompletionStatus(CompletionStatus status);

    @EntityGraph(attributePaths = {"lesson", "student"})
    List<LessonCompletion> findByCompletionStatusAndActive(CompletionStatus status, boolean active);

    @EntityGraph(attributePaths = {"lesson", "student"})
    List<LessonCompletion> findByStudentIdAndCompletionStatus(Long studentId, CompletionStatus status);

    @EntityGraph(attributePaths = {"lesson", "student"})
    List<LessonCompletion> findByLessonIdAndCompletionStatus(Long lessonId, CompletionStatus status);

    @Query("SELECT lc FROM LessonCompletion lc WHERE lc.lesson.course.id = :courseId AND lc.active = true")
    @EntityGraph(attributePaths = {"lesson", "student"})
    List<LessonCompletion> findByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT lc FROM LessonCompletion lc WHERE lc.lesson.course.id = :courseId AND lc.student.id = :studentId AND lc.active = true")
    @EntityGraph(attributePaths = {"lesson", "student"})
    List<LessonCompletion> findByCourseIdAndStudentId(@Param("courseId") Long courseId, @Param("studentId") Long studentId);

    @Query("SELECT lc FROM LessonCompletion lc WHERE lc.lesson.course.id = :courseId AND lc.completionStatus = :status AND lc.active = true")
    @EntityGraph(attributePaths = {"lesson", "student"})
    List<LessonCompletion> findByCourseIdAndCompletionStatus(@Param("courseId") Long courseId, @Param("status") CompletionStatus status);

    @Query("SELECT lc FROM LessonCompletion lc WHERE lc.lesson.course.id = :courseId AND lc.student.id = :studentId AND lc.completionStatus = :status AND lc.active = true")
    @EntityGraph(attributePaths = {"lesson", "student"})
    List<LessonCompletion> findByCourseIdAndStudentIdAndCompletionStatus(@Param("courseId") Long courseId, 
                                                                        @Param("studentId") Long studentId, 
                                                                        @Param("status") CompletionStatus status);

    @Query("SELECT COUNT(lc) FROM LessonCompletion lc WHERE lc.lesson.course.id = :courseId AND lc.active = true")
    Long countByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT COUNT(lc) FROM LessonCompletion lc WHERE lc.lesson.course.id = :courseId AND lc.completionStatus = :status AND lc.active = true")
    Long countByCourseIdAndCompletionStatus(@Param("courseId") Long courseId, @Param("status") CompletionStatus status);

    @Query("SELECT COUNT(lc) FROM LessonCompletion lc WHERE lc.lesson.course.id = :courseId AND lc.student.id = :studentId AND lc.active = true")
    Long countByCourseIdAndStudentId(@Param("courseId") Long courseId, @Param("studentId") Long studentId);

    @Query("SELECT COUNT(lc) FROM LessonCompletion lc WHERE lc.lesson.course.id = :courseId AND lc.student.id = :studentId AND lc.completionStatus = :status AND lc.active = true")
    Long countByCourseIdAndStudentIdAndCompletionStatus(@Param("courseId") Long courseId, 
                                                       @Param("studentId") Long studentId, 
                                                       @Param("status") CompletionStatus status);

    @Query("SELECT AVG(lc.completionPercentage) FROM LessonCompletion lc WHERE lc.lesson.course.id = :courseId AND lc.active = true")
    Double getAverageCompletionPercentageByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT AVG(lc.completionPercentage) FROM LessonCompletion lc WHERE lc.lesson.course.id = :courseId AND lc.student.id = :studentId AND lc.active = true")
    Double getAverageCompletionPercentageByCourseIdAndStudentId(@Param("courseId") Long courseId, @Param("studentId") Long studentId);

    @Query("SELECT AVG(lc.score) FROM LessonCompletion lc WHERE lc.lesson.course.id = :courseId AND lc.active = true")
    Double getAverageScoreByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT AVG(lc.score) FROM LessonCompletion lc WHERE lc.lesson.course.id = :courseId AND lc.student.id = :studentId AND lc.active = true")
    Double getAverageScoreByCourseIdAndStudentId(@Param("courseId") Long courseId, @Param("studentId") Long studentId);

    @Query("SELECT lc FROM LessonCompletion lc WHERE lc.completedAt >= :startDate AND lc.completedAt <= :endDate AND lc.active = true")
    @EntityGraph(attributePaths = {"lesson", "student"})
    List<LessonCompletion> findByCompletedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT lc FROM LessonCompletion lc WHERE lc.lesson.course.id = :courseId AND lc.completedAt >= :startDate AND lc.completedAt <= :endDate AND lc.active = true")
    @EntityGraph(attributePaths = {"lesson", "student"})
    List<LessonCompletion> findByCourseIdAndCompletedAtBetween(@Param("courseId") Long courseId, 
                                                              @Param("startDate") LocalDateTime startDate, 
                                                              @Param("endDate") LocalDateTime endDate);
} 
package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Lesson;
import com.ohma.thutothebe.entity.Lesson.LessonStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    @EntityGraph(attributePaths = {"course", "instructor"})
    List<Lesson> findByCourseIdOrderByLessonOrder(Long courseId);

    @EntityGraph(attributePaths = {"course", "instructor"})
    List<Lesson> findByCourseIdAndActiveOrderByLessonOrder(Long courseId, boolean active);

    @EntityGraph(attributePaths = {"course", "instructor"})
    List<Lesson> findByInstructorIdOrderByScheduledDate(Long instructorId);

    @EntityGraph(attributePaths = {"course", "instructor"})
    List<Lesson> findByInstructorIdAndActiveOrderByScheduledDate(Long instructorId, boolean active);

    @EntityGraph(attributePaths = {"course", "instructor"})
    List<Lesson> findByStatus(LessonStatus status);

    @EntityGraph(attributePaths = {"course", "instructor"})
    List<Lesson> findByStatusAndActive(LessonStatus status, boolean active);

    @EntityGraph(attributePaths = {"course", "instructor"})
    List<Lesson> findByScheduledDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @EntityGraph(attributePaths = {"course", "instructor"})
    List<Lesson> findByCourseIdAndStatus(Long courseId, LessonStatus status);

    @EntityGraph(attributePaths = {"course", "instructor"})
    List<Lesson> findByCourseIdAndStatusAndActive(Long courseId, LessonStatus status, boolean active);

    @Query("SELECT l FROM Lesson l WHERE l.course.id = :courseId AND l.lessonOrder = :lessonOrder AND l.active = true")
    @EntityGraph(attributePaths = {"course", "instructor"})
    Optional<Lesson> findByCourseIdAndLessonOrder(@Param("courseId") Long courseId, @Param("lessonOrder") Integer lessonOrder);

    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.course.id = :courseId AND l.active = true")
    Long countByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.course.id = :courseId AND l.status = :status AND l.active = true")
    Long countByCourseIdAndStatus(@Param("courseId") Long courseId, @Param("status") LessonStatus status);

    @Query("SELECT MAX(l.lessonOrder) FROM Lesson l WHERE l.course.id = :courseId AND l.active = true")
    Integer getMaxLessonOrderByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT l FROM Lesson l WHERE l.course.id = :courseId AND l.scheduledDate >= :startDate AND l.scheduledDate <= :endDate AND l.active = true ORDER BY l.scheduledDate")
    @EntityGraph(attributePaths = {"course", "instructor"})
    List<Lesson> findByCourseIdAndScheduledDateBetween(@Param("courseId") Long courseId, 
                                                       @Param("startDate") LocalDateTime startDate, 
                                                       @Param("endDate") LocalDateTime endDate);

    @Query("SELECT l FROM Lesson l WHERE l.instructor.id = :instructorId AND l.scheduledDate >= :startDate AND l.scheduledDate <= :endDate AND l.active = true ORDER BY l.scheduledDate")
    @EntityGraph(attributePaths = {"course", "instructor"})
    List<Lesson> findByInstructorIdAndScheduledDateBetween(@Param("instructorId") Long instructorId, 
                                                          @Param("startDate") LocalDateTime startDate, 
                                                          @Param("endDate") LocalDateTime endDate);

    @Query("SELECT l FROM Lesson l WHERE l.course.id = :courseId AND l.isMandatory = true AND l.active = true ORDER BY l.lessonOrder")
    @EntityGraph(attributePaths = {"course", "instructor"})
    List<Lesson> findMandatoryLessonsByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT l FROM Lesson l WHERE l.course.id = :courseId AND l.status = 'COMPLETED' AND l.active = true ORDER BY l.completedDate DESC")
    @EntityGraph(attributePaths = {"course", "instructor"})
    List<Lesson> findCompletedLessonsByCourseId(@Param("courseId") Long courseId);
} 
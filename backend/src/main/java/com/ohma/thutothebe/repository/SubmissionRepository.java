package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.entity.Submission;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.enums.SubmissionPhase;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
    List<Submission> findByStudentId(Long userId);

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
} 
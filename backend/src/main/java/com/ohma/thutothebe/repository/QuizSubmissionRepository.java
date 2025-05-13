package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.QuizSubmission;
import com.ohma.thutothebe.entity.QuizSubmissionStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, Long> {
    
    @EntityGraph(attributePaths = {"responses", "responses.question", "responses.selectedOptions"})
    Optional<QuizSubmission> findWithResponsesById(Long id);
    
    List<QuizSubmission> findByQuizId(Long quizId);
    
    List<QuizSubmission> findByStudentId(Long studentId);
    
    List<QuizSubmission> findByQuizIdAndStudentId(Long quizId, Long studentId);
    
    List<QuizSubmission> findByStatus(QuizSubmissionStatus status);
    
    @Query("SELECT qs FROM QuizSubmission qs WHERE qs.quiz.id = :quizId AND qs.status = :status")
    List<QuizSubmission> findByQuizIdAndStatus(Long quizId, QuizSubmissionStatus status);
    
    @Query("SELECT qs FROM QuizSubmission qs WHERE qs.student.id = :studentId AND qs.status = :status")
    List<QuizSubmission> findByStudentIdAndStatus(Long studentId, QuizSubmissionStatus status);
    
    @EntityGraph(attributePaths = {"responses", "responses.question", "responses.selectedOptions"})
    List<QuizSubmission> findWithResponsesByQuizId(Long quizId);
    
    @EntityGraph(attributePaths = {"responses", "responses.question", "responses.selectedOptions"})
    List<QuizSubmission> findWithResponsesByStudentId(Long studentId);
    
    @Query("SELECT CASE WHEN COUNT(qs) > 0 THEN true ELSE false END FROM QuizSubmission qs " +
           "WHERE qs.quiz.id = :quizId AND qs.student.id = :studentId AND qs.status = :status")
    boolean existsByQuizIdAndStudentIdAndStatus(
        @Param("quizId") Long quizId,
        @Param("studentId") Long studentId,
        @Param("status") QuizSubmissionStatus status
    );
} 
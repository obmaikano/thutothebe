package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Quiz;
import com.ohma.thutothebe.entity.QuizStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    
    Optional<Quiz> findByCode(String code);
    
    @EntityGraph(attributePaths = {"questions", "questions.options"})
    Optional<Quiz> findWithQuestionsById(Long id);
    
    @EntityGraph(attributePaths = {"questions", "questions.options"})
    Optional<Quiz> findWithQuestionsByCode(String code);
    
    List<Quiz> findByCourseId(Long courseId);
    
    List<Quiz> findByInstructorId(Long instructorId);
    
    List<Quiz> findByStatus(QuizStatus status);
    
    List<Quiz> findByCourseIdAndStatus(Long courseId, QuizStatus status);
    
    @Query("SELECT q FROM Quiz q WHERE q.active = true AND q.course.id = :courseId")
    List<Quiz> findActiveByCourseId(Long courseId);
    
    boolean existsByCode(String code);
} 
package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.Question;
import com.ohma.thutothebe.entity.QuestionType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    @EntityGraph(attributePaths = {"options"})
    Optional<Question> findWithOptionsById(Long id);
    
    List<Question> findByQuizId(Long quizId);
    
    List<Question> findByQuizIdAndType(Long quizId, QuestionType type);
    
    @EntityGraph(attributePaths = {"options"})
    List<Question> findWithOptionsByQuizId(Long quizId);
    
    @EntityGraph(attributePaths = {"options"})
    List<Question> findWithOptionsByQuizIdAndType(Long quizId, QuestionType type);
} 
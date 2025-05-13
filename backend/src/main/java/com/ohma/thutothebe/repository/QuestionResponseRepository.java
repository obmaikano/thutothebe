package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.QuestionResponse;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionResponseRepository extends JpaRepository<QuestionResponse, Long> {
    
    @EntityGraph(attributePaths = {"selectedOptions"})
    Optional<QuestionResponse> findWithSelectedOptionsById(Long id);
    
    List<QuestionResponse> findBySubmissionId(Long submissionId);
    
    List<QuestionResponse> findByQuestionId(Long questionId);
    
    @EntityGraph(attributePaths = {"selectedOptions"})
    List<QuestionResponse> findWithSelectedOptionsBySubmissionId(Long submissionId);
    
    @EntityGraph(attributePaths = {"selectedOptions"})
    List<QuestionResponse> findWithSelectedOptionsByQuestionId(Long questionId);
    
    Optional<QuestionResponse> findBySubmissionIdAndQuestionId(Long submissionId, Long questionId);
} 
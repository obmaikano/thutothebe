package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.QuestionResponseDTO;

import java.util.List;
import java.util.Set;

public interface QuestionResponseService extends BaseService<QuestionResponseDTO, Long> {
    List<QuestionResponseDTO> getBySubmissionId(Long submissionId);
    List<QuestionResponseDTO> getByQuestionId(Long questionId);
    
    // Quiz lifecycle methods
    QuestionResponseDTO saveResponse(Long submissionId, Long questionId, String textResponse, Set<Long> selectedOptionIds);
    QuestionResponseDTO gradeResponse(Long responseId, Integer pointsAwarded, String feedback);
} 
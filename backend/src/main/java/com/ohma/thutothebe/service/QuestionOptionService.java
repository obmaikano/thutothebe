package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.QuestionOptionDTO;

import java.util.List;

public interface QuestionOptionService extends BaseService<QuestionOptionDTO, Long> {
    List<QuestionOptionDTO> getByQuestionId(Long questionId);
    List<QuestionOptionDTO> getByQuestionIdAndIsCorrect(Long questionId, boolean isCorrect);
} 
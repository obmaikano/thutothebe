package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.QuestionDTO;
import com.ohma.thutothebe.entity.QuestionType;

import java.util.List;

public interface QuestionService extends BaseService<QuestionDTO, Long> {
    List<QuestionDTO> getByQuizId(Long quizId);
    List<QuestionDTO> getByQuizIdAndType(Long quizId, QuestionType type);
} 
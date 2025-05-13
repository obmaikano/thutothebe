package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.QuizDTO;
import com.ohma.thutothebe.entity.QuizStatus;

import java.util.List;

public interface QuizService extends BaseService<QuizDTO, Long> {
    QuizDTO getByCode(String code);
    List<QuizDTO> getByCourseId(Long courseId);
    List<QuizDTO> getByInstructorId(Long instructorId);
    List<QuizDTO> getByStatus(QuizStatus status);
    List<QuizDTO> getByCourseIdAndStatus(Long courseId, QuizStatus status);
    List<QuizDTO> getActiveByCourseId(Long courseId);
    boolean existsByCode(String code);
} 
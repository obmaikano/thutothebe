package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.QuizSubmissionDTO;
import com.ohma.thutothebe.entity.QuizSubmissionStatus;

import java.util.List;

public interface QuizSubmissionService extends BaseService<QuizSubmissionDTO, Long> {
    List<QuizSubmissionDTO> getByQuizId(Long quizId);
    List<QuizSubmissionDTO> getByStudentId(Long studentId);
    List<QuizSubmissionDTO> getByQuizIdAndStudentId(Long quizId, Long studentId);
    List<QuizSubmissionDTO> getByStatus(QuizSubmissionStatus status);
    List<QuizSubmissionDTO> getByQuizIdAndStatus(Long quizId, QuizSubmissionStatus status);
    List<QuizSubmissionDTO> getByStudentIdAndStatus(Long studentId, QuizSubmissionStatus status);
    
    // Quiz lifecycle methods
    QuizSubmissionDTO startQuiz(Long quizId, Long studentId);
    QuizSubmissionDTO submitQuiz(Long submissionId);
    QuizSubmissionDTO gradeQuiz(Long submissionId, Integer score);
} 
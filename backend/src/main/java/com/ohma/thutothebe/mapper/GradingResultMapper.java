package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.GradingResultDTO;
import com.ohma.thutothebe.entity.GradingResult;
import com.ohma.thutothebe.entity.Submission;
import com.ohma.thutothebe.entity.QuizSubmission;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.repository.SubmissionRepository;
import com.ohma.thutothebe.repository.QuizSubmissionRepository;
import com.ohma.thutothebe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GradingResultMapper implements BaseDtoMapper<GradingResult, GradingResultDTO> {

    private final SubmissionRepository submissionRepository;
    private final QuizSubmissionRepository quizSubmissionRepository;
    private final UserRepository userRepository;

    @Override
    public GradingResultDTO toDto(GradingResult entity) {
        if (entity == null) return null;

        return new GradingResultDTO(
            entity.getId(),
            entity.getSubmission() != null ? entity.getSubmission().getId() : null,
            entity.getQuizSubmission() != null ? entity.getQuizSubmission().getId() : null,
            entity.getAutoScore(),
            entity.getManualScore(),
            entity.getFinalScore(),
            entity.getStatus(),
            entity.getAutoGradedAt(),
            entity.getManualGradedAt(),
            entity.getGradedBy() != null ? entity.getGradedBy().getId() : null,
            entity.getGradedBy() != null ? entity.getGradedBy().getUsername() : null,
            entity.getAutoFeedback(),
            entity.getManualFeedback(),
            entity.isRequiresManualReview(),
            entity.getAutoGradingDetails(),
            entity.getCreatedAt(),
            entity.getModifiedAt()
        );
    }

    @Override
    public GradingResult toEntity(GradingResultDTO dto) {
        if (dto == null) return null;

        GradingResult entity = new GradingResult();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(GradingResult entity, GradingResultDTO dto) {
        if (dto.submissionId() != null) {
            Submission submission = submissionRepository.findById(dto.submissionId())
                .orElseThrow(() -> new RuntimeException("Submission not found with id: " + dto.submissionId()));
            entity.setSubmission(submission);
        }
        
        if (dto.quizSubmissionId() != null) {
            QuizSubmission quizSubmission = quizSubmissionRepository.findById(dto.quizSubmissionId())
                .orElseThrow(() -> new RuntimeException("QuizSubmission not found with id: " + dto.quizSubmissionId()));
            entity.setQuizSubmission(quizSubmission);
        }
        
        if (dto.gradedById() != null) {
            User gradedBy = userRepository.findById(dto.gradedById())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.gradedById()));
            entity.setGradedBy(gradedBy);
        }

        entity.setAutoScore(dto.autoScore());
        entity.setManualScore(dto.manualScore());
        entity.setFinalScore(dto.finalScore());
        entity.setStatus(dto.status());
        entity.setAutoGradedAt(dto.autoGradedAt());
        entity.setManualGradedAt(dto.manualGradedAt());
        entity.setAutoFeedback(dto.autoFeedback());
        entity.setManualFeedback(dto.manualFeedback());
        entity.setRequiresManualReview(dto.requiresManualReview());
        entity.setAutoGradingDetails(dto.autoGradingDetails());
    }
} 
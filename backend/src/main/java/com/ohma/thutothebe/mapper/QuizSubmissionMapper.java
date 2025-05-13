package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.QuizSubmissionDTO;
import com.ohma.thutothebe.entity.QuizSubmission;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class QuizSubmissionMapper implements BaseDtoMapper<QuizSubmission, QuizSubmissionDTO> {

    private final QuestionResponseMapper responseMapper;

    public QuizSubmissionMapper(QuestionResponseMapper responseMapper) {
        this.responseMapper = responseMapper;
    }

    @Override
    public QuizSubmissionDTO toDto(QuizSubmission entity) {
        if (entity == null) {
            return null;
        }

        return new QuizSubmissionDTO(
            entity.getId(),
            entity.getQuiz() != null ? entity.getQuiz().getId() : null,
            entity.getStudent() != null ? entity.getStudent().getId() : null,
            entity.getStartedAt(),
            entity.getSubmittedAt(),
            entity.getGradedAt(),
            entity.getScore(),
            entity.getFeedback(),
            entity.getStatus(),
            entity.getResponses() != null ? 
                entity.getResponses().stream()
                    .map(responseMapper::toDto)
                    .collect(Collectors.toSet()) : 
                null,
            entity.isActive()
        );
    }

    @Override
    public QuizSubmission toEntity(QuizSubmissionDTO dto) {
        if (dto == null) {
            return null;
        }

        QuizSubmission entity = new QuizSubmission();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(QuizSubmission entity, QuizSubmissionDTO dto) {
        entity.setStartedAt(dto.startedAt());
        entity.setSubmittedAt(dto.submittedAt());
        entity.setGradedAt(dto.gradedAt());
        entity.setScore(dto.score());
        entity.setFeedback(dto.feedback());
        entity.setStatus(dto.status());
        entity.setActive(dto.active());
    }
} 
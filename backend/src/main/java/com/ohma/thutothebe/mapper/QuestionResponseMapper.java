package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.QuestionResponseDTO;
import com.ohma.thutothebe.entity.QuestionResponse;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class QuestionResponseMapper implements BaseDtoMapper<QuestionResponse, QuestionResponseDTO> {

    @Override
    public QuestionResponseDTO toDto(QuestionResponse entity) {
        if (entity == null) {
            return null;
        }

        return new QuestionResponseDTO(
            entity.getId(),
            entity.getSubmission() != null ? entity.getSubmission().getId() : null,
            entity.getQuestion() != null ? entity.getQuestion().getId() : null,
            entity.getTextResponse(),
            entity.getSelectedOptions() != null ? 
                entity.getSelectedOptions().stream()
                    .map(option -> option.getId())
                    .collect(Collectors.toSet()) : 
                null,
            entity.getPointsAwarded(),
            entity.getFeedback(),
            entity.isActive()
        );
    }

    @Override
    public QuestionResponse toEntity(QuestionResponseDTO dto) {
        if (dto == null) {
            return null;
        }

        QuestionResponse entity = new QuestionResponse();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(QuestionResponse entity, QuestionResponseDTO dto) {
        entity.setTextResponse(dto.textResponse());
        entity.setPointsAwarded(dto.pointsAwarded());
        entity.setFeedback(dto.feedback());
        entity.setActive(dto.active());
    }
} 
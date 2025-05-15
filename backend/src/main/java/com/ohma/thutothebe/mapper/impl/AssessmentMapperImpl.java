package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.AssessmentDto;
import com.ohma.thutothebe.entity.Assessment;
import com.ohma.thutothebe.mapper.AssessmentMapper;
import org.springframework.stereotype.Component;

@Component
public class AssessmentMapperImpl implements AssessmentMapper {

    @Override
    public Assessment toEntity(AssessmentDto dto) {
        if (dto == null) {
            return null;
        }

        Assessment entity = new Assessment();
        entity.setId(dto.id());
        entity.setSelfAssessment(dto.isSelfAssessment());
        entity.setGradingStrategy(dto.gradingStrategy());
        entity.setScore(dto.score());
        entity.setFeedback(dto.feedback());
        entity.setRubricScores(dto.rubricScores());
        entity.setSubmittedAt(dto.submittedAt());
        entity.setStatus(dto.status());
        entity.setCreatedAt(dto.createdAt());
        entity.setModifiedAt(dto.updatedAt());

        return entity;
    }

    @Override
    public AssessmentDto toDto(Assessment entity) {
        if (entity == null) {
            return null;
        }

        return new AssessmentDto(
            entity.getId(),
            entity.getSubmission() != null ? entity.getSubmission().getId() : null,
            entity.getAssessor() != null ? entity.getAssessor().getId() : null,
            entity.isSelfAssessment(),
            entity.getGradingStrategy(),
            entity.getScore(),
            entity.getFeedback(),
            entity.getRubricScores(),
            entity.getSubmittedAt(),
            entity.getStatus(),
            entity.getCreatedAt(),
            entity.getModifiedAt()
        );
    }

    @Override
    public void updateEntityFromDto(AssessmentDto dto, Assessment entity) {
        if (dto == null || entity == null) {
            return;
        }

        entity.setSelfAssessment(dto.isSelfAssessment());
        entity.setGradingStrategy(dto.gradingStrategy());
        entity.setScore(dto.score());
        entity.setFeedback(dto.feedback());
        entity.setRubricScores(dto.rubricScores());
        entity.setSubmittedAt(dto.submittedAt());
        entity.setStatus(dto.status());
    }
} 
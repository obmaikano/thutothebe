package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CurriculumTopicDTO;
import com.ohma.thutothebe.entity.CurriculumTopic;
import org.springframework.stereotype.Component;

@Component
public class CurriculumTopicMapper implements BaseDtoMapper<CurriculumTopic, CurriculumTopicDTO> {

    @Override
    public CurriculumTopicDTO toDto(CurriculumTopic entity) {
        if (entity == null) {
            return null;
        }

        return new CurriculumTopicDTO(
            entity.getId(),
            entity.getCurriculumUnit() != null ? entity.getCurriculumUnit().getId() : null,
            entity.getCurriculumUnit() != null ? entity.getCurriculumUnit().getTitle() : null,
            entity.getTitle(),
            entity.getDescription(),
            entity.getTopicOrder(),
            entity.getDurationHours(),
            entity.getLearningObjectives(),
            entity.getActivities(),
            entity.getResources(),
            entity.getAssessmentMethods(),
            entity.isActive(),
            entity.getCreatedAt(),
            entity.getModifiedAt()
        );
    }

    @Override
    public CurriculumTopic toEntity(CurriculumTopicDTO dto) {
        if (dto == null) {
            return null;
        }

        CurriculumTopic entity = new CurriculumTopic();
        entity.setId(dto.id());
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setTopicOrder(dto.topicOrder());
        entity.setDurationHours(dto.durationHours());
        entity.setLearningObjectives(dto.learningObjectives());
        entity.setActivities(dto.activities());
        entity.setResources(dto.resources());
        entity.setAssessmentMethods(dto.assessmentMethods());
        entity.setActive(dto.active());
        entity.setCreatedAt(dto.createdAt());
        entity.setModifiedAt(dto.modifiedAt());

        return entity;
    }
} 
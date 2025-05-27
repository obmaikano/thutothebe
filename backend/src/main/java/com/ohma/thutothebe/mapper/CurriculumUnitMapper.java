package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CurriculumUnitDTO;
import com.ohma.thutothebe.entity.CurriculumUnit;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class CurriculumUnitMapper implements BaseDtoMapper<CurriculumUnit, CurriculumUnitDTO> {

    @Override
    public CurriculumUnitDTO toDto(CurriculumUnit entity) {
        if (entity == null) {
            return null;
        }

        Set<Long> topicIds = entity.getCurriculumTopics() != null ?
            entity.getCurriculumTopics().stream()
                .map(topic -> topic.getId())
                .collect(Collectors.toSet()) : null;

        Set<String> topicTitles = entity.getCurriculumTopics() != null ?
            entity.getCurriculumTopics().stream()
                .map(topic -> topic.getTitle())
                .collect(Collectors.toSet()) : null;

        return new CurriculumUnitDTO(
            entity.getId(),
            entity.getCurriculum() != null ? entity.getCurriculum().getId() : null,
            entity.getCurriculum() != null ? entity.getCurriculum().getTitle() : null,
            entity.getTitle(),
            entity.getDescription(),
            entity.getUnitOrder(),
            entity.getDurationWeeks(),
            entity.getAllocatedHours(),
            entity.getLearningObjectives(),
            entity.getAssessmentCriteria(),
            topicIds,
            topicTitles,
            entity.isActive(),
            entity.getCreatedAt(),
            entity.getModifiedAt()
        );
    }

    @Override
    public CurriculumUnit toEntity(CurriculumUnitDTO dto) {
        if (dto == null) {
            return null;
        }

        CurriculumUnit entity = new CurriculumUnit();
        entity.setId(dto.id());
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setUnitOrder(dto.unitOrder());
        entity.setDurationWeeks(dto.durationWeeks());
        entity.setAllocatedHours(dto.allocatedHours());
        entity.setLearningObjectives(dto.learningObjectives());
        entity.setAssessmentCriteria(dto.assessmentCriteria());
        entity.setActive(dto.active());
        entity.setCreatedAt(dto.createdAt());
        entity.setModifiedAt(dto.modifiedAt());

        return entity;
    }
} 
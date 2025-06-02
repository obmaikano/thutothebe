package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CurriculumUnitDTO;
import com.ohma.thutothebe.entity.CurriculumUnit;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class CurriculumUnitMapper implements BaseDtoMapper<CurriculumUnit, CurriculumUnitDTO> {

    @Override
    public CurriculumUnitDTO toDto(CurriculumUnit entity) {
        if (entity == null) {
            return null;
        }

        // Safely handle lazy-loaded topics collection
        Set<Long> topicIds = null;
        Set<String> topicTitles = null;
        
        if (entity.getCurriculumTopics() != null && Hibernate.isInitialized(entity.getCurriculumTopics())) {
            topicIds = entity.getCurriculumTopics().stream()
                .map(topic -> topic.getId())
                .collect(Collectors.toSet());
                
            topicTitles = entity.getCurriculumTopics().stream()
                .map(topic -> topic.getTitle())
                .collect(Collectors.toSet());
        } else {
            topicIds = Collections.emptySet();
            topicTitles = Collections.emptySet();
        }

        // Safely handle curriculum reference to avoid circular references
        Long curriculumId = null;
        String curriculumTitle = null;
        
        if (entity.getCurriculum() != null && Hibernate.isInitialized(entity.getCurriculum())) {
            curriculumId = entity.getCurriculum().getId();
            curriculumTitle = entity.getCurriculum().getTitle();
        }

        return new CurriculumUnitDTO(
            entity.getId(),
            curriculumId,
            curriculumTitle,
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
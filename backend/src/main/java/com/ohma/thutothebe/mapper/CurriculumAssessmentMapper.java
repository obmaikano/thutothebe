package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CurriculumAssessmentDTO;
import com.ohma.thutothebe.entity.CurriculumAssessment;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CurriculumAssessmentMapper implements BaseDtoMapper<CurriculumAssessment, CurriculumAssessmentDTO> {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public CurriculumAssessmentDTO toDto(CurriculumAssessment entity) {
        if (entity == null) {
            return null;
        }

        return new CurriculumAssessmentDTO(
                entity.getId(),
                entity.getCurriculum() != null ? entity.getCurriculum().getId() : null,
                entity.getCurriculum() != null ? entity.getCurriculum().getTitle() : null,
                entity.getCurriculumUnit() != null ? entity.getCurriculumUnit().getId() : null,
                entity.getCurriculumUnit() != null ? entity.getCurriculumUnit().getTitle() : null,
                entity.getCurriculumTopic() != null ? entity.getCurriculumTopic().getId() : null,
                entity.getCurriculumTopic() != null ? entity.getCurriculumTopic().getTitle() : null,
                entity.getAssessment() != null ? entity.getAssessment().getId() : null,
                entity.getAssessment() != null ? "Assessment #" + entity.getAssessment().getId() : null,
                entity.getAssessmentPurpose(),
                entity.getWeightPercentage(),
                entity.isMandatory(),
                entity.getSequenceOrder(),
                parseJsonToLongList(entity.getPrerequisiteAssessments()),
                parseJsonToStringList(entity.getLearningObjectivesCovered()),
                parseJsonToStringList(entity.getCompetenciesAssessed()),
                entity.getAlignmentNotes(),
                entity.getLinkedBy() != null ? entity.getLinkedBy().getId() : null,
                entity.getLinkedBy() != null ? 
                    entity.getLinkedBy().getFirstName() + " " + entity.getLinkedBy().getLastName() : null,
                entity.getLinkedAt(),
                entity.isActive()
        );
    }

    @Override
    public CurriculumAssessment toEntity(CurriculumAssessmentDTO dto) {
        if (dto == null) {
            return null;
        }

        CurriculumAssessment entity = new CurriculumAssessment();
        entity.setId(dto.id());
        entity.setAssessmentPurpose(dto.assessmentPurpose());
        entity.setWeightPercentage(dto.weightPercentage());
        entity.setMandatory(dto.isMandatory());
        entity.setSequenceOrder(dto.sequenceOrder());
        entity.setPrerequisiteAssessments(longListToJson(dto.prerequisiteAssessments()));
        entity.setLearningObjectivesCovered(stringListToJson(dto.learningObjectivesCovered()));
        entity.setCompetenciesAssessed(stringListToJson(dto.competenciesAssessed()));
        entity.setAlignmentNotes(dto.alignmentNotes());
        entity.setLinkedAt(dto.linkedAt());
        entity.setActive(dto.isActive());

        return entity;
    }

    public void updateEntity(CurriculumAssessment entity, CurriculumAssessmentDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setAssessmentPurpose(dto.assessmentPurpose());
        entity.setWeightPercentage(dto.weightPercentage());
        entity.setMandatory(dto.isMandatory());
        entity.setSequenceOrder(dto.sequenceOrder());
        entity.setPrerequisiteAssessments(longListToJson(dto.prerequisiteAssessments()));
        entity.setLearningObjectivesCovered(stringListToJson(dto.learningObjectivesCovered()));
        entity.setCompetenciesAssessed(stringListToJson(dto.competenciesAssessed()));
        entity.setAlignmentNotes(dto.alignmentNotes());
        entity.setActive(dto.isActive());
    }

    @SuppressWarnings("unchecked")
    private List<String> parseJsonToStringList(String json) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    private List<Long> parseJsonToLongList(String json) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<Long>>() {});
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    private String stringListToJson(List<String> list) {
        if (list == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    private String longListToJson(List<Long> list) {
        if (list == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
} 
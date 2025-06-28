package com.ohma.thutothebe.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohma.thutothebe.dto.LessonDTO;
import com.ohma.thutothebe.entity.Lesson;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class LessonMapper implements BaseDtoMapper<Lesson, LessonDTO> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public LessonDTO toDto(Lesson entity) {
        if (entity == null) {
            return null;
        }

        return new LessonDTO(
            entity.getId(),
            entity.getTitle(),
            entity.getDescription(),
            entity.getCourse() != null ? entity.getCourse().getId() : null,
            entity.getCourse() != null ? entity.getCourse().getName() : null,
            entity.getInstructor() != null ? entity.getInstructor().getId() : null,
            entity.getInstructor() != null ? 
                entity.getInstructor().getFirstName() + " " + entity.getInstructor().getLastName() : null,
            entity.getLessonOrder(),
            entity.getDurationMinutes(),
            entity.getEstimatedDurationMinutes(),
            entity.getScheduledDate(),
            entity.getCompletedDate(),
            entity.getStatus(),
            entity.getObjectives(),
            entity.getMaterials(),
            entity.getActivities(),
            entity.getAssessment(),
            entity.getNotes(),
            entity.isMandatory(),
            parseJsonToLongList(entity.getPrerequisites()),
            parseJsonToStringList(entity.getLearningOutcomes()),
            entity.isActive(),
            entity.getCreatedAt(),
            entity.getModifiedAt()
        );
    }

    @Override
    public Lesson toEntity(LessonDTO dto) {
        if (dto == null) {
            return null;
        }

        Lesson entity = new Lesson();
        entity.setId(dto.id());
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setLessonOrder(dto.lessonOrder());
        entity.setDurationMinutes(dto.durationMinutes());
        entity.setEstimatedDurationMinutes(dto.estimatedDurationMinutes());
        entity.setScheduledDate(dto.scheduledDate());
        entity.setCompletedDate(dto.completedDate());
        entity.setStatus(dto.status());
        entity.setObjectives(dto.objectives());
        entity.setMaterials(dto.materials());
        entity.setActivities(dto.activities());
        entity.setAssessment(dto.assessment());
        entity.setNotes(dto.notes());
        entity.setMandatory(dto.isMandatory());
        entity.setPrerequisites(longListToJson(dto.prerequisites()));
        entity.setLearningOutcomes(stringListToJson(dto.learningOutcomes()));
        entity.setActive(dto.active());

        return entity;
    }

    public void updateEntity(Lesson entity, LessonDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setLessonOrder(dto.lessonOrder());
        entity.setDurationMinutes(dto.durationMinutes());
        entity.setEstimatedDurationMinutes(dto.estimatedDurationMinutes());
        entity.setScheduledDate(dto.scheduledDate());
        entity.setCompletedDate(dto.completedDate());
        entity.setStatus(dto.status());
        entity.setObjectives(dto.objectives());
        entity.setMaterials(dto.materials());
        entity.setActivities(dto.activities());
        entity.setAssessment(dto.assessment());
        entity.setNotes(dto.notes());
        entity.setMandatory(dto.isMandatory());
        entity.setPrerequisites(longListToJson(dto.prerequisites()));
        entity.setLearningOutcomes(stringListToJson(dto.learningOutcomes()));
        entity.setActive(dto.active());
    }

    private List<Long> parseJsonToLongList(String json) {
        if (json == null || json.trim().isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<Long>>() {});
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }

    private List<String> parseJsonToStringList(String json) {
        if (json == null || json.trim().isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }

    private String longListToJson(List<Long> list) {
        if (list == null || list.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    private String stringListToJson(List<String> list) {
        if (list == null || list.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
} 
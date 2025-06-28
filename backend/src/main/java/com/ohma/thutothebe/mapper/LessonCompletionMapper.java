package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.LessonCompletionDTO;
import com.ohma.thutothebe.entity.LessonCompletion;
import org.springframework.stereotype.Component;

@Component
public class LessonCompletionMapper implements BaseDtoMapper<LessonCompletion, LessonCompletionDTO> {

    @Override
    public LessonCompletionDTO toDto(LessonCompletion entity) {
        if (entity == null) {
            return null;
        }

        return new LessonCompletionDTO(
            entity.getId(),
            entity.getLesson() != null ? entity.getLesson().getId() : null,
            entity.getLesson() != null ? entity.getLesson().getTitle() : null,
            entity.getStudent() != null ? entity.getStudent().getId() : null,
            entity.getStudent() != null ? 
                entity.getStudent().getFirstName() + " " + entity.getStudent().getLastName() : null,
            entity.getCompletionStatus(),
            entity.getStartedAt(),
            entity.getCompletedAt(),
            entity.getTimeSpentMinutes(),
            entity.getCompletionPercentage(),
            entity.getScore(),
            entity.getMaxScore(),
            entity.getFeedback(),
            entity.getNotes(),
            entity.isAttendedInPerson(),
            entity.isParticipatedActively(),
            entity.isCompletedAssignments(),
            entity.isUnderstoodContent(),
            entity.isActive(),
            entity.getCreatedAt(),
            entity.getModifiedAt()
        );
    }

    @Override
    public LessonCompletion toEntity(LessonCompletionDTO dto) {
        if (dto == null) {
            return null;
        }

        LessonCompletion entity = new LessonCompletion();
        entity.setId(dto.id());
        entity.setCompletionStatus(dto.completionStatus());
        entity.setStartedAt(dto.startedAt());
        entity.setCompletedAt(dto.completedAt());
        entity.setTimeSpentMinutes(dto.timeSpentMinutes());
        entity.setCompletionPercentage(dto.completionPercentage());
        entity.setScore(dto.score());
        entity.setMaxScore(dto.maxScore());
        entity.setFeedback(dto.feedback());
        entity.setNotes(dto.notes());
        entity.setAttendedInPerson(dto.attendedInPerson());
        entity.setParticipatedActively(dto.participatedActively());
        entity.setCompletedAssignments(dto.completedAssignments());
        entity.setUnderstoodContent(dto.understoodContent());
        entity.setActive(dto.active());

        return entity;
    }

    public void updateEntity(LessonCompletion entity, LessonCompletionDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setCompletionStatus(dto.completionStatus());
        entity.setStartedAt(dto.startedAt());
        entity.setCompletedAt(dto.completedAt());
        entity.setTimeSpentMinutes(dto.timeSpentMinutes());
        entity.setCompletionPercentage(dto.completionPercentage());
        entity.setScore(dto.score());
        entity.setMaxScore(dto.maxScore());
        entity.setFeedback(dto.feedback());
        entity.setNotes(dto.notes());
        entity.setAttendedInPerson(dto.attendedInPerson());
        entity.setParticipatedActively(dto.participatedActively());
        entity.setCompletedAssignments(dto.completedAssignments());
        entity.setUnderstoodContent(dto.understoodContent());
        entity.setActive(dto.active());
    }
} 
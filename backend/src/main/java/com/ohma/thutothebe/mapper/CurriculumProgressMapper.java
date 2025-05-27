package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CurriculumProgressDTO;
import com.ohma.thutothebe.entity.CurriculumProgress;
import org.springframework.stereotype.Component;

@Component
public class CurriculumProgressMapper implements BaseDtoMapper<CurriculumProgress, CurriculumProgressDTO> {

    @Override
    public CurriculumProgressDTO toDto(CurriculumProgress entity) {
        if (entity == null) {
            return null;
        }

        return new CurriculumProgressDTO(
            entity.getId(),
            entity.getCurriculum() != null ? entity.getCurriculum().getId() : null,
            entity.getCurriculum() != null ? entity.getCurriculum().getTitle() : null,
            entity.getSchool() != null ? entity.getSchool().getId() : null,
            entity.getSchool() != null ? entity.getSchool().getName() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getId() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getName() : null,
            entity.getTeacher() != null ? entity.getTeacher().getId() : null,
            entity.getTeacher() != null ? entity.getTeacher().getFirstName() + " " + entity.getTeacher().getLastName() : null,
            entity.getImplementationStatus(),
            entity.getProgressPercentage(),
            entity.getStartDate(),
            entity.getExpectedCompletionDate(),
            entity.getActualCompletionDate(),
            entity.getLastUpdatedDate(),
            entity.getUpdatedBy() != null ? entity.getUpdatedBy().getId() : null,
            entity.getUpdatedBy() != null ? entity.getUpdatedBy().getFirstName() + " " + entity.getUpdatedBy().getLastName() : null,
            entity.getNotes(),
            entity.getChallenges(),
            entity.getAchievements(),
            entity.isActive(),
            entity.getCreatedAt(),
            entity.getModifiedAt()
        );
    }

    @Override
    public CurriculumProgress toEntity(CurriculumProgressDTO dto) {
        if (dto == null) {
            return null;
        }

        CurriculumProgress entity = new CurriculumProgress();
        entity.setId(dto.id());
        entity.setImplementationStatus(dto.implementationStatus());
        entity.setProgressPercentage(dto.progressPercentage());
        entity.setStartDate(dto.startDate());
        entity.setExpectedCompletionDate(dto.expectedCompletionDate());
        entity.setActualCompletionDate(dto.actualCompletionDate());
        entity.setLastUpdatedDate(dto.lastUpdatedDate());
        entity.setNotes(dto.notes());
        entity.setChallenges(dto.challenges());
        entity.setAchievements(dto.achievements());
        entity.setActive(dto.active());
        entity.setCreatedAt(dto.createdAt());
        entity.setModifiedAt(dto.modifiedAt());

        return entity;
    }
} 
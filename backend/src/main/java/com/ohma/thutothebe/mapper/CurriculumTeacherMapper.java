package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CurriculumTeacherDTO;
import com.ohma.thutothebe.entity.CurriculumTeacher;
import org.springframework.stereotype.Component;

@Component
public class CurriculumTeacherMapper implements BaseDtoMapper<CurriculumTeacher, CurriculumTeacherDTO> {

    @Override
    public CurriculumTeacherDTO toDto(CurriculumTeacher entity) {
        if (entity == null) {
            return null;
        }

        return new CurriculumTeacherDTO(
            entity.getId(),
            entity.getCurriculum() != null ? entity.getCurriculum().getId() : null,
            entity.getCurriculum() != null ? entity.getCurriculum().getTitle() : null,
            entity.getTeacher() != null ? entity.getTeacher().getId() : null,
            entity.getTeacher() != null ? entity.getTeacher().getFirstName() + " " + entity.getTeacher().getLastName() : null,
            entity.getSubject() != null ? entity.getSubject().getId() : null,
            entity.getSubject() != null ? entity.getSubject().getName() : null,
            entity.getAssignedDate(),
            entity.isPrimary(),
            entity.getResponsibilityPercentage(),
            entity.getNotes(),
            entity.isActive(),
            entity.getCreatedAt(),
            entity.getModifiedAt()
        );
    }

    @Override
    public CurriculumTeacher toEntity(CurriculumTeacherDTO dto) {
        if (dto == null) {
            return null;
        }

        CurriculumTeacher entity = new CurriculumTeacher();
        entity.setId(dto.id());
        entity.setAssignedDate(dto.assignedDate());
        entity.setPrimary(dto.isPrimary());
        entity.setResponsibilityPercentage(dto.responsibilityPercentage());
        entity.setNotes(dto.notes());
        entity.setActive(dto.active());
        entity.setCreatedAt(dto.createdAt());
        entity.setModifiedAt(dto.modifiedAt());

        return entity;
    }
} 
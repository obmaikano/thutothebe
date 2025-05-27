package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CurriculumSubjectDTO;
import com.ohma.thutothebe.entity.CurriculumSubject;
import org.springframework.stereotype.Component;

@Component
public class CurriculumSubjectMapper implements BaseDtoMapper<CurriculumSubject, CurriculumSubjectDTO> {

    @Override
    public CurriculumSubjectDTO toDto(CurriculumSubject entity) {
        if (entity == null) {
            return null;
        }

        return new CurriculumSubjectDTO(
            entity.getId(),
            entity.getCurriculum() != null ? entity.getCurriculum().getId() : null,
            entity.getCurriculum() != null ? entity.getCurriculum().getTitle() : null,
            entity.getSubject() != null ? entity.getSubject().getId() : null,
            entity.getSubject() != null ? entity.getSubject().getName() : null,
            entity.getSubject() != null ? entity.getSubject().getCode() : null,
            entity.isCore(),
            entity.getAllocatedHours(),
            entity.getWeightPercentage(),
            entity.getObjectives(),
            entity.isActive(),
            entity.getCreatedAt(),
            entity.getModifiedAt()
        );
    }

    @Override
    public CurriculumSubject toEntity(CurriculumSubjectDTO dto) {
        if (dto == null) {
            return null;
        }

        CurriculumSubject entity = new CurriculumSubject();
        entity.setId(dto.id());
        entity.setCore(dto.isCore());
        entity.setAllocatedHours(dto.allocatedHours());
        entity.setWeightPercentage(dto.weightPercentage());
        entity.setObjectives(dto.objectives());
        entity.setActive(dto.active());
        entity.setCreatedAt(dto.createdAt());
        entity.setModifiedAt(dto.modifiedAt());

        return entity;
    }
} 
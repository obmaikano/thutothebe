package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CurriculumDTO;
import com.ohma.thutothebe.entity.Curriculum;
import com.ohma.thutothebe.entity.CurriculumSubject;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class CurriculumMapper implements BaseDtoMapper<Curriculum, CurriculumDTO> {

    @Override
    public CurriculumDTO toDto(Curriculum entity) {
        if (entity == null) {
            return null;
        }

        Set<Long> subjectIds = entity.getCurriculumSubjects() != null ?
            entity.getCurriculumSubjects().stream()
                .map(cs -> cs.getSubject().getId())
                .collect(Collectors.toSet()) : null;

        Set<String> subjectNames = entity.getCurriculumSubjects() != null ?
            entity.getCurriculumSubjects().stream()
                .map(cs -> cs.getSubject().getName())
                .collect(Collectors.toSet()) : null;

        return new CurriculumDTO(
            entity.getId(),
            entity.getTitle(),
            entity.getDescription(),
            entity.getCurriculumType(),
            entity.getGradeLevel(),
            entity.getStatus(),
            entity.getAcademicYear(),
            entity.getEffectiveDate(),
            entity.getExpiryDate(),
            entity.getLearningOutcomes(),
            entity.getDurationWeeks(),
            entity.getTotalHours(),
            entity.getRegion() != null ? entity.getRegion().getId() : null,
            entity.getRegion() != null ? entity.getRegion().getName() : null,
            entity.getSchool() != null ? entity.getSchool().getId() : null,
            entity.getSchool() != null ? entity.getSchool().getName() : null,
            entity.getCreatedBy().getId(),
            entity.getCreatedBy().getFirstName() + " " + entity.getCreatedBy().getLastName(),
            entity.getApprovedBy() != null ? entity.getApprovedBy().getId() : null,
            entity.getApprovedBy() != null ? entity.getApprovedBy().getFirstName() + " " + entity.getApprovedBy().getLastName() : null,
            entity.getApprovedAt(),
            subjectIds,
            subjectNames,
            entity.isActive(),
            entity.getCurriculumVersion(),
            entity.getMetadata(),
            entity.getCreatedAt(),
            entity.getModifiedAt()
        );
    }

    @Override
    public Curriculum toEntity(CurriculumDTO dto) {
        if (dto == null) {
            return null;
        }

        Curriculum entity = new Curriculum();
        entity.setId(dto.id());
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setCurriculumType(dto.curriculumType());
        entity.setGradeLevel(dto.gradeLevel());
        entity.setStatus(dto.status());
        entity.setAcademicYear(dto.academicYear());
        entity.setEffectiveDate(dto.effectiveDate());
        entity.setExpiryDate(dto.expiryDate());
        entity.setLearningOutcomes(dto.learningOutcomes());
        entity.setDurationWeeks(dto.durationWeeks());
        entity.setTotalHours(dto.totalHours());
        entity.setActive(dto.active());
        entity.setCurriculumVersion(dto.curriculumVersion());
        entity.setMetadata(dto.metadata());
        entity.setCreatedAt(dto.createdAt());
        entity.setModifiedAt(dto.modifiedAt());

        return entity;
    }
} 
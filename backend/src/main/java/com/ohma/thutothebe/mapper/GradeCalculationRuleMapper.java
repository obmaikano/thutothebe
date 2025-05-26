package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.GradeCalculationRuleDTO;
import com.ohma.thutothebe.entity.GradeCalculationRule;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.mapper.BaseDtoMapper;
import org.springframework.stereotype.Component;

@Component
public class GradeCalculationRuleMapper implements BaseDtoMapper<GradeCalculationRule, GradeCalculationRuleDTO> {

    @Override
    public GradeCalculationRuleDTO toDto(GradeCalculationRule entity) {
        if (entity == null) {
            return null;
        }

        return new GradeCalculationRuleDTO(
                entity.getId(),
                entity.getCourse() != null ? entity.getCourse().getId() : null,
                entity.getGradeType(),
                entity.getWeightPercentage(),
                entity.getPassingGrade(),
                entity.getDescription(),
                entity.isActive(),
                entity.getTerm(),
                entity.getAcademicYear(),
                entity.getCreatedAt(),
                entity.getModifiedAt()
        );
    }

    @Override
    public GradeCalculationRule toEntity(GradeCalculationRuleDTO dto) {
        if (dto == null) {
            return null;
        }

        GradeCalculationRule rule = new GradeCalculationRule();
        rule.setId(dto.id());
        rule.setGradeType(dto.gradeType());
        rule.setWeightPercentage(dto.weightPercentage());
        rule.setPassingGrade(dto.passingGrade());
        rule.setDescription(dto.description());
        rule.setActive(dto.active());
        rule.setTerm(dto.term());
        rule.setAcademicYear(dto.academicYear());

        return rule;
    }

    public GradeCalculationRule toEntityWithReferences(GradeCalculationRuleDTO dto, Course course) {
        GradeCalculationRule rule = toEntity(dto);
        if (rule != null) {
            rule.setCourse(course);
        }
        return rule;
    }
} 
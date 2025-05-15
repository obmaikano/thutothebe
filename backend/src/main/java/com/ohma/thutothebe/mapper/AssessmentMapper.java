package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.AssessmentDto;
import com.ohma.thutothebe.entity.Assessment;

public interface AssessmentMapper extends BaseDtoMapper<Assessment, AssessmentDto> {
    Assessment toEntity(AssessmentDto dto);
    AssessmentDto toDto(Assessment entity);
    void updateEntityFromDto(AssessmentDto dto, Assessment entity);
} 
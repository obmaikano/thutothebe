package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.SubmissionDTO;
import com.ohma.thutothebe.entity.Submission;

public interface SubmissionMapper extends BaseDtoMapper<Submission, SubmissionDTO> {
    Submission toEntity(SubmissionDTO dto);
    SubmissionDTO toDto(Submission entity);
    void updateEntityFromDto(SubmissionDTO dto, Submission entity);
} 
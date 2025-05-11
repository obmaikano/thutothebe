package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.SubmissionDTO;
import com.ohma.thutothebe.entity.Submission;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SubmissionMapper implements BaseDtoMapper<Submission, SubmissionDTO> {

    @Override
    public SubmissionDTO toDto(Submission entity) {
        if (entity == null) return null;

        return new SubmissionDTO(
            entity.getId(),
            entity.getAssignment() != null ? entity.getAssignment().getId() : null,
            entity.getStudent() != null ? entity.getStudent().getId() : null,
            entity.getContent(),
            entity.getFileUrl(),
            entity.getSubmittedAt(),
            entity.getGradedAt(),
            entity.getScore(),
            entity.getFeedback(),
            entity.getStatus()
        );
    }

    @Override
    public Submission toEntity(SubmissionDTO dto) {
        if (dto == null) return null;

        Submission entity = new Submission();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(Submission entity, SubmissionDTO dto) {
        entity.setContent(dto.content());
        entity.setFileUrl(dto.fileUrl());
        entity.setSubmittedAt(dto.submittedAt());
        entity.setGradedAt(dto.gradedAt());
        entity.setScore(dto.score());
        entity.setFeedback(dto.feedback());
        entity.setStatus(dto.status());
    }

    public void updateEntityFromDto(SubmissionDTO dto, Submission entity) {
        updateEntity(entity, dto);
    }
} 
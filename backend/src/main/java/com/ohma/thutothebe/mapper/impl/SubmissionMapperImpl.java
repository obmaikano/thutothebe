package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.SubmissionDTO;
import com.ohma.thutothebe.dto.AssessmentDto;
import com.ohma.thutothebe.entity.Submission;
import com.ohma.thutothebe.mapper.SubmissionMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class SubmissionMapperImpl implements SubmissionMapper {

    @Override
    public Submission toEntity(SubmissionDTO dto) {
        if (dto == null) {
            return null;
        }
        Submission entity = new Submission();
        entity.setId(dto.id());
        entity.setContent(dto.content());
        entity.setSubmittedAt(dto.submittedAt());
        entity.setPhase(dto.phase());
        entity.setFinalScore(dto.finalScore());
        entity.setFeedback(dto.feedback());
        entity.setCreatedAt(dto.createdAt());
        entity.setModifiedAt(dto.updatedAt());
        // Note: user, course, and assessments should be set in the service layer
        return entity;
    }

    @Override
    public SubmissionDTO toDto(Submission entity) {
        if (entity == null) {
            return null;
        }
        List<AssessmentDto> assessmentDtos = null;
        if (entity.getAssessments() != null) {
            assessmentDtos = entity.getAssessments().stream()
                .map(assessment -> new AssessmentDto(
                    assessment.getId(),
                    assessment.getSubmission() != null ? assessment.getSubmission().getId() : null,
                    assessment.getAssessor() != null ? assessment.getAssessor().getId() : null,
                    assessment.isSelfAssessment(),
                    assessment.getGradingStrategy(),
                    assessment.getScore(),
                    assessment.getFeedback(),
                    assessment.getRubricScores(),
                    assessment.getSubmittedAt(),
                    assessment.getStatus(),
                    assessment.getCreatedAt(),
                    assessment.getModifiedAt()
                ))
                .collect(Collectors.toList());
        }
        return new SubmissionDTO(
            entity.getId(),
            entity.getStudent() != null ? entity.getStudent().getId() : null,
            entity.getCourse() != null ? entity.getCourse().getId() : null,
            entity.getAssignment() != null ? entity.getAssignment().getId() : null,
            entity.getContent(),
            entity.getSubmittedAt(),
            entity.getPhase(),
            entity.getStatus(),
            assessmentDtos,
            entity.getFinalScore(),
            entity.getFeedback(),
            entity.getCreatedAt(),
            entity.getModifiedAt(),
            entity.getScore(),
            entity.getMaxScore(),
            entity.getPercentage(),
            entity.getGrade(),
            entity.getComments(),
            entity.getFilePaths(),
            entity.getGradedAt(),
            entity.getGradedBy() != null ? entity.getGradedBy().getId() : null,
            entity.getAttemptNumber(),
            entity.isLateSubmission(),
            entity.isNeedsReview(),
            entity.getOriginalFileName(),
            entity.getFileSize(),
            entity.isAutoGraded(),
            entity.isManuallyGraded(),
            entity.getReviewedAt(),
            entity.getReviewedBy() != null ? entity.getReviewedBy().getId() : null,
            entity.getStudentComments(),
            entity.getRubricScores(),
            entity.getTimeSpent(),
            entity.isPlagiarismChecked()
        );
    }

    @Override
    public void updateEntityFromDto(SubmissionDTO dto, Submission entity) {
        if (dto == null || entity == null) {
            return;
        }
        entity.setContent(dto.content());
        entity.setSubmittedAt(dto.submittedAt());
        entity.setPhase(dto.phase());
        entity.setFinalScore(dto.finalScore());
        entity.setFeedback(dto.feedback());
        // Note: user, course, and assessments should be set in the service layer
    }
} 
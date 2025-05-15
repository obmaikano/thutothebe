package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.AssessmentDto;
import com.ohma.thutothebe.entity.enums.AssessmentStatus;
import com.ohma.thutothebe.entity.enums.GradingStrategy;

import java.util.List;

public interface AssessmentService extends BaseService<AssessmentDto, Long> {

    List<AssessmentDto> getAssessmentsBySubmissionId(Long submissionId);
    
    List<AssessmentDto> getAssessmentsByAssessorId(Long assessorId);
    
    List<AssessmentDto> getAssessmentsByCourseId(Long courseId);
    
    AssessmentDto submitAssessment(Long id, Double score, String feedback, String rubricScores);
    
    AssessmentDto updateAssessmentStatus(Long id, AssessmentStatus status);
    
    List<AssessmentDto> getAssessmentsBySubmissionIdAndStatus(Long submissionId, AssessmentStatus status);
    
    long countSelfAssessmentsBySubmissionId(Long submissionId);
    
    long countPeerAssessmentsBySubmissionId(Long submissionId);
    
    List<AssessmentDto> assignPeerAssessments(Long submissionId, List<Long> assessorIds, GradingStrategy gradingStrategy);
} 
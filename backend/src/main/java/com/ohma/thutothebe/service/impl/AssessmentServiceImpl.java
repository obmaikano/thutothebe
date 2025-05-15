package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AssessmentDto;
import com.ohma.thutothebe.entity.Assessment;
import com.ohma.thutothebe.entity.Submission;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.enums.AssessmentStatus;
import com.ohma.thutothebe.entity.enums.GradingStrategy;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.AssessmentMapper;
import com.ohma.thutothebe.repository.AssessmentRepository;
import com.ohma.thutothebe.repository.SubmissionRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.AssessmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class AssessmentServiceImpl extends BaseServiceImpl<Assessment, AssessmentDto, Long> implements AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final AssessmentMapper assessmentMapper;

    @Autowired
    public AssessmentServiceImpl(
            AssessmentRepository assessmentRepository,
            SubmissionRepository submissionRepository,
            UserRepository userRepository,
            AssessmentMapper assessmentMapper
    ) {
        super(assessmentRepository);
        this.assessmentRepository = assessmentRepository;
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.assessmentMapper = assessmentMapper;
    }

    @Override
    @Transactional
    public AssessmentDto submitAssessment(Long id, Double score, String feedback, String rubricScores) {
        log.info("Submitting assessment: {}", id);
        
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found"));
        
        assessment.setScore(score);
        assessment.setFeedback(feedback);
        assessment.setRubricScores(rubricScores);
        assessment.setSubmittedAt(LocalDateTime.now());
        assessment.setStatus(AssessmentStatus.SUBMITTED);
        
        Assessment submittedAssessment = assessmentRepository.save(assessment);
        return assessmentMapper.toDto(submittedAssessment);
    }

    @Override
    @Transactional
    public AssessmentDto updateAssessmentStatus(Long id, AssessmentStatus status) {
        log.info("Updating assessment status: {} to {}", id, status);
        
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found"));
        
        assessment.setStatus(status);
        
        Assessment updatedAssessment = assessmentRepository.save(assessment);
        return assessmentMapper.toDto(updatedAssessment);
    }

    @Override
    public List<AssessmentDto> getAssessmentsBySubmissionIdAndStatus(Long submissionId, AssessmentStatus status) {
        log.info("Getting assessments for submission: {} with status: {}", submissionId, status);
        return assessmentRepository.findBySubmissionIdAndStatus(submissionId, status).stream()
                .map(assessmentMapper::toDto)
                .toList();
    }

    @Override
    public long countSelfAssessmentsBySubmissionId(Long submissionId) {
        return assessmentRepository.countSelfAssessmentsBySubmissionId(submissionId);
    }

    @Override
    public long countPeerAssessmentsBySubmissionId(Long submissionId) {
        return assessmentRepository.countPeerAssessmentsBySubmissionId(submissionId);
    }

    @Override
    @Transactional
    public List<AssessmentDto> assignPeerAssessments(Long submissionId, List<Long> assessorIds, GradingStrategy gradingStrategy) {
        log.info("Assigning peer assessments for submission: {} to assessors: {}", submissionId, assessorIds);
        
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
        
        List<Assessment> assessments = new ArrayList<>();
        
        for (Long assessorId : assessorIds) {
            User assessor = userRepository.findById(assessorId)
                    .orElseThrow(() -> new ResourceNotFoundException("Assessor not found"));
            
            Assessment assessment = new Assessment();
            assessment.setSubmission(submission);
            assessment.setAssessor(assessor);
            assessment.setSelfAssessment(false);
            assessment.setGradingStrategy(gradingStrategy);
            assessment.setStatus(AssessmentStatus.PENDING);
            
            assessments.add(assessment);
        }
        
        List<Assessment> savedAssessments = assessmentRepository.saveAll(assessments);
        return savedAssessments.stream()
                .map(assessmentMapper::toDto)
                .toList();
    }

    @Override
    public List<AssessmentDto> getAssessmentsBySubmissionId(Long submissionId) {
        return assessmentRepository.findBySubmissionId(submissionId).stream()
                .map(assessmentMapper::toDto)
                .toList();
    }

    @Override
    public List<AssessmentDto> getAssessmentsByAssessorId(Long assessorId) {
        return assessmentRepository.findByAssessorId(assessorId).stream()
                .map(assessmentMapper::toDto)
                .toList();
    }

    @Override
    public List<AssessmentDto> getAssessmentsByCourseId(Long courseId) {
        return assessmentRepository.findByCourseId(courseId).stream()
                .map(assessmentMapper::toDto)
                .toList();
    }

    @Override
    protected Assessment mapToEntity(AssessmentDto dto) {
        return assessmentMapper.toEntity(dto);
    }

    @Override
    protected AssessmentDto mapToDto(Assessment entity) {
        return assessmentMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Assessment entity, AssessmentDto dto) {
        assessmentMapper.updateEntityFromDto(dto, entity);
    }
} 
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssessmentServiceImplTest {
    @Mock AssessmentRepository assessmentRepository;
    @Mock SubmissionRepository submissionRepository;
    @Mock UserRepository userRepository;
    @Mock AssessmentMapper assessmentMapper;
    @InjectMocks AssessmentServiceImpl assessmentService;

    Assessment assessment;
    AssessmentDto assessmentDto;
    Submission submission;
    User assessor;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        submission = new Submission();
        submission.setId(1L);
        assessor = new User();
        assessor.setId(2L);
        assessment = new Assessment();
        assessment.setId(3L);
        assessment.setSubmission(submission);
        assessment.setAssessor(assessor);
        assessment.setSelfAssessment(false);
        assessment.setGradingStrategy(GradingStrategy.ACCUMULATIVE);
        assessment.setStatus(AssessmentStatus.PENDING);
        assessmentDto = new AssessmentDto(3L, 1L, 2L, false, GradingStrategy.ACCUMULATIVE, 90.0, "Good", null, LocalDateTime.now(), AssessmentStatus.PENDING, LocalDateTime.now(), LocalDateTime.now());
    }

    @Test
    void createAssessment_success() {
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(userRepository.findById(2L)).thenReturn(Optional.of(assessor));
        when(assessmentRepository.save(any(Assessment.class))).thenReturn(assessment);
        when(assessmentMapper.toDto(any(Assessment.class))).thenReturn(assessmentDto);
        AssessmentDto result = assessmentService.create(assessmentDto);
        assertNotNull(result);
        assertEquals(3L, result.id());
    }

    @Test
    void createAssessment_submissionNotFound() {
        when(submissionRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> assessmentService.create(assessmentDto));
    }

    @Test
    void updateAssessment_success() {
        when(assessmentRepository.findById(3L)).thenReturn(Optional.of(assessment));
        when(assessmentRepository.save(any(Assessment.class))).thenReturn(assessment);
        when(assessmentMapper.toDto(any(Assessment.class))).thenReturn(assessmentDto);
        AssessmentDto result = assessmentService.update(3L, assessmentDto);
        assertNotNull(result);
        assertEquals(3L, result.id());
    }

    @Test
    void updateAssessment_notFound() {
        when(assessmentRepository.findById(3L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> assessmentService.update(3L, assessmentDto));
    }

    @Test
    void deleteAssessment_success() {
        doNothing().when(assessmentRepository).deleteById(3L);
        assertDoesNotThrow(() -> assessmentService.delete(3L));
    }

    @Test
    void getAssessmentById_success() {
        when(assessmentRepository.findById(3L)).thenReturn(Optional.of(assessment));
        when(assessmentMapper.toDto(assessment)).thenReturn(assessmentDto);
        AssessmentDto result = assessmentService.getById(3L);
        assertNotNull(result);
        assertEquals(3L, result.id());
    }

    @Test
    void getAssessmentById_notFound() {
        when(assessmentRepository.findById(3L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> assessmentService.getById(3L));
    }

    @Test
    void getAssessmentsBySubmissionId_success() {
        when(assessmentRepository.findBySubmissionId(1L)).thenReturn(Collections.singletonList(assessment));
        when(assessmentMapper.toDto(assessment)).thenReturn(assessmentDto);
        List<AssessmentDto> result = assessmentService.getAssessmentsBySubmissionId(1L);
        assertEquals(1, result.size());
    }

    @Test
    void submitAssessment_success() {
        when(assessmentRepository.findById(3L)).thenReturn(Optional.of(assessment));
        when(assessmentRepository.save(any(Assessment.class))).thenReturn(assessment);
        when(assessmentMapper.toDto(any(Assessment.class))).thenReturn(assessmentDto);
        AssessmentDto result = assessmentService.submitAssessment(3L, 95.0, "Excellent", null);
        assertNotNull(result);
    }

    @Test
    void updateAssessmentStatus_success() {
        when(assessmentRepository.findById(3L)).thenReturn(Optional.of(assessment));
        when(assessmentRepository.save(any(Assessment.class))).thenReturn(assessment);
        when(assessmentMapper.toDto(any(Assessment.class))).thenReturn(assessmentDto);
        AssessmentDto result = assessmentService.updateAssessmentStatus(3L, AssessmentStatus.GRADED);
        assertNotNull(result);
    }

    @Test
    void assignPeerAssessments_success() {
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(userRepository.findById(2L)).thenReturn(Optional.of(assessor));
        when(assessmentRepository.saveAll(anyList())).thenReturn(Arrays.asList(assessment));
        when(assessmentMapper.toDto(any(Assessment.class))).thenReturn(assessmentDto);
        List<AssessmentDto> result = assessmentService.assignPeerAssessments(1L, Collections.singletonList(2L), GradingStrategy.ACCUMULATIVE);
        assertEquals(1, result.size());
    }
} 
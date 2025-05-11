package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.SubmissionDTO;
import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.entity.Submission;
import com.ohma.thutothebe.entity.SubmissionStatus;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.SubmissionNotFoundException;
import com.ohma.thutothebe.mapper.SubmissionMapper;
import com.ohma.thutothebe.repository.SubmissionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubmissionServiceImplTest {

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private SubmissionMapper submissionMapper;

    @InjectMocks
    private SubmissionServiceImpl submissionService;

    private Submission submission;
    private SubmissionDTO submissionDTO;
    private Assignment assignment;
    private User student;

    @BeforeEach
    void setUp() {
        assignment = new Assignment();
        assignment.setId(1L);
        assignment.setTitle("Test Assignment");

        student = new User();
        student.setId(1L);
        student.setUsername("testStudent");

        submission = new Submission();
        submission.setId(1L);
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setContent("Test Content");
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus(SubmissionStatus.SUBMITTED);

        submissionDTO = new SubmissionDTO(
            1L,
            1L,
            1L,
            "Test Content",
            null,
            LocalDateTime.now(),
            null,
            null,
            null,
            SubmissionStatus.SUBMITTED
        );
    }

    @Test
    void whenGetById_thenReturnSubmission() {
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(submissionMapper.toDto(submission)).thenReturn(submissionDTO);

        SubmissionDTO result = submissionService.getById(1L);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.content()).isEqualTo("Test Content");
        verify(submissionRepository).findById(1L);
    }

    @Test
    void whenGetById_thenThrowException() {
        when(submissionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> submissionService.getById(1L))
            .isInstanceOf(SubmissionNotFoundException.class)
            .hasMessageContaining("Submission not found with id: 1");
    }

    @Test
    void whenGetAll_thenReturnAllSubmissions() {
        List<Submission> submissions = Arrays.asList(submission);
        List<SubmissionDTO> submissionDTOs = Arrays.asList(submissionDTO);

        when(submissionRepository.findAll()).thenReturn(submissions);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        List<SubmissionDTO> results = submissionService.getAll();

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(1L);
        verify(submissionRepository).findAll();
    }

    @Test
    void whenCreate_thenReturnCreatedSubmission() {
        when(submissionMapper.toEntity(submissionDTO)).thenReturn(submission);
        when(submissionRepository.save(any(Submission.class))).thenReturn(submission);
        when(submissionMapper.toDto(submission)).thenReturn(submissionDTO);

        SubmissionDTO result = submissionService.create(submissionDTO);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        verify(submissionRepository).save(any(Submission.class));
    }

    @Test
    void whenUpdate_thenReturnUpdatedSubmission() {
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(submissionRepository.save(any(Submission.class))).thenReturn(submission);
        when(submissionMapper.toDto(submission)).thenReturn(submissionDTO);

        SubmissionDTO result = submissionService.update(1L, submissionDTO);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        verify(submissionRepository).save(any(Submission.class));
    }

    @Test
    void whenDelete_thenDeleteSubmission() {
        when(submissionRepository.existsById(1L)).thenReturn(true);
        doNothing().when(submissionRepository).deleteById(1L);

        submissionService.delete(1L);

        verify(submissionRepository).deleteById(1L);
    }

    @Test
    void whenGetSubmissionByAssignmentAndStudent_thenReturnSubmission() {
        when(submissionRepository.findByAssignmentAndStudent(assignment, student))
            .thenReturn(Optional.of(submission));
        when(submissionMapper.toDto(submission)).thenReturn(submissionDTO);

        SubmissionDTO result = submissionService.getSubmissionByAssignmentAndStudent(assignment, student);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        verify(submissionRepository).findByAssignmentAndStudent(assignment, student);
    }

    @Test
    void whenGetSubmissionsByAssignment_thenReturnSubmissions() {
        List<Submission> submissions = Arrays.asList(submission);
        List<SubmissionDTO> submissionDTOs = Arrays.asList(submissionDTO);

        when(submissionRepository.findByAssignment(assignment)).thenReturn(submissions);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        List<SubmissionDTO> results = submissionService.getSubmissionsByAssignment(assignment);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(1L);
        verify(submissionRepository).findByAssignment(assignment);
    }

    @Test
    void whenGetSubmissionsByStudent_thenReturnSubmissions() {
        List<Submission> submissions = Arrays.asList(submission);
        List<SubmissionDTO> submissionDTOs = Arrays.asList(submissionDTO);

        when(submissionRepository.findByStudent(student)).thenReturn(submissions);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        List<SubmissionDTO> results = submissionService.getSubmissionsByStudent(student);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(1L);
        verify(submissionRepository).findByStudent(student);
    }

    @Test
    void whenGetGradedSubmissionsByAssignment_thenReturnSubmissions() {
        List<Submission> submissions = Arrays.asList(submission);
        List<SubmissionDTO> submissionDTOs = Arrays.asList(submissionDTO);

        when(submissionRepository.findGradedByAssignment(assignment)).thenReturn(submissions);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        List<SubmissionDTO> results = submissionService.getGradedSubmissionsByAssignment(assignment);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(1L);
        verify(submissionRepository).findGradedByAssignment(assignment);
    }

    @Test
    void whenGetGradedSubmissionsByStudent_thenReturnSubmissions() {
        List<Submission> submissions = Arrays.asList(submission);
        List<SubmissionDTO> submissionDTOs = Arrays.asList(submissionDTO);

        when(submissionRepository.findGradedByStudent(student)).thenReturn(submissions);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        List<SubmissionDTO> results = submissionService.getGradedSubmissionsByStudent(student);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(1L);
        verify(submissionRepository).findGradedByStudent(student);
    }

    @Test
    void whenGradeSubmission_thenReturnGradedSubmission() {
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(submissionRepository.save(any(Submission.class))).thenReturn(submission);
        when(submissionMapper.toDto(submission)).thenReturn(submissionDTO);

        SubmissionDTO result = submissionService.gradeSubmission(1L, 85, "Good work!");

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        verify(submissionRepository).save(any(Submission.class));
    }

    @Test
    void whenExistsByAssignmentAndStudent_thenReturnTrue() {
        when(submissionRepository.existsByAssignmentAndStudent(assignment, student)).thenReturn(true);

        boolean result = submissionService.existsByAssignmentAndStudent(assignment, student);

        assertThat(result).isTrue();
        verify(submissionRepository).existsByAssignmentAndStudent(assignment, student);
    }
} 
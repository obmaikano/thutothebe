package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.SubmissionDTO;
import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.entity.Submission;
import com.ohma.thutothebe.entity.SubmissionStatus;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.enums.SubmissionPhase;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.SubmissionMapper;
import com.ohma.thutothebe.repository.SubmissionRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.repository.CourseRepository;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubmissionServiceImplTest {

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private SubmissionMapper submissionMapper;

    @InjectMocks
    private SubmissionServiceImpl submissionService;

    private Submission submission;
    private SubmissionDTO submissionDTO;
    private Assignment assignment;
    private User student;
    private Course course;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        assignment = new Assignment();
        assignment.setId(1L);
        assignment.setTitle("Test Assignment");

        student = new User();
        student.setId(1L);
        student.setUsername("testStudent");

        course = new Course();
        course.setId(2L);

        submission = new Submission();
        submission.setId(3L);
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setCourse(course);
        submission.setContent("Test content");
        submission.setPhase(SubmissionPhase.SUBMISSION);
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus(SubmissionStatus.SUBMITTED);

        submissionDTO = new SubmissionDTO(
            3L,                          // id
            1L,                          // studentId
            2L,                          // courseId
            1L,                          // assignmentId
            "Test content",              // content
            LocalDateTime.now(),         // submittedAt
            SubmissionPhase.SUBMISSION,  // phase
            SubmissionStatus.SUBMITTED,  // status
            null,                        // assessments
            0.0,                         // finalScore
            null,                        // feedback
            LocalDateTime.now(),         // createdAt
            LocalDateTime.now(),         // updatedAt
            null,                        // score
            null,                        // maxScore
            null,                        // percentage
            null,                        // grade
            null,                        // comments
            null,                        // filePaths
            null,                        // gradedAt
            null,                        // gradedBy
            1,                           // attemptNumber
            false,                       // isLateSubmission
            false,                       // needsReview
            null,                        // originalFileName
            null,                        // fileSize
            false,                       // autoGraded
            false,                       // manuallyGraded
            null,                        // reviewedAt
            null,                        // reviewedBy
            null,                        // studentComments
            null,                        // rubricScores
            null,                        // timeSpent
            false                        // plagiarismChecked
        );
    }

    @Test
    void whenGetById_thenReturnSubmission() {
        when(submissionRepository.findById(3L)).thenReturn(Optional.of(submission));
        when(submissionMapper.toDto(submission)).thenReturn(submissionDTO);

        SubmissionDTO result = submissionService.getById(3L);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(3L);
        assertThat(result.content()).isEqualTo("Test content");
        verify(submissionRepository).findById(3L);
    }

    @Test
    void whenGetById_thenThrowException() {
        when(submissionRepository.findById(3L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> submissionService.getById(3L));
    }

    @Test
    void whenGetAll_thenReturnAllSubmissions() {
        List<Submission> submissions = Arrays.asList(submission);
        List<SubmissionDTO> submissionDTOS = Arrays.asList(submissionDTO);

        when(submissionRepository.findAll()).thenReturn(submissions);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        List<SubmissionDTO> results = submissionService.getAll();

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(3L);
        verify(submissionRepository).findAll();
    }

    @Test
    void whenCreate_thenReturnCreatedSubmission() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(2L)).thenReturn(Optional.of(course));
        when(submissionRepository.save(any(Submission.class))).thenReturn(submission);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        SubmissionDTO result = submissionService.create(submissionDTO);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(3L);
        verify(submissionRepository).save(any(Submission.class));
    }

    @Test
    void whenCreate_userNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> submissionService.create(submissionDTO));
    }

    @Test
    void whenUpdate_thenReturnUpdatedSubmission() {
        when(submissionRepository.findById(3L)).thenReturn(Optional.of(submission));
        when(submissionRepository.save(any(Submission.class))).thenReturn(submission);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        SubmissionDTO result = submissionService.update(3L, submissionDTO);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(3L);
        verify(submissionRepository).save(any(Submission.class));
    }

    @Test
    void whenUpdate_notFound() {
        when(submissionRepository.findById(3L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> submissionService.update(3L, submissionDTO));
    }

    @Test
    void whenDelete_thenDeleteSubmission() {
        when(submissionRepository.existsById(3L)).thenReturn(true);
        doNothing().when(submissionRepository).deleteById(3L);

        submissionService.delete(3L);

        verify(submissionRepository).deleteById(3L);
    }

    @Test
    void whenGetSubmissionByAssignmentAndStudent_thenReturnSubmission() {
        when(submissionRepository.findByAssignmentAndStudent(assignment, student))
            .thenReturn(Optional.of(submission));
        when(submissionMapper.toDto(submission)).thenReturn(submissionDTO);

        SubmissionDTO result = submissionService.getSubmissionByAssignmentAndStudent(assignment.getId(), student.getId());

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(3L);
        verify(submissionRepository).findByAssignmentAndStudent(assignment, student);
    }

    @Test
    void whenGetSubmissionsByAssignment_thenReturnSubmissions() {
        List<Submission> submissions = Arrays.asList(submission);
        List<SubmissionDTO> submissionDTOS = Arrays.asList(submissionDTO);

        when(submissionRepository.findByAssignment(assignment)).thenReturn(submissions);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        List<SubmissionDTO> results = submissionService.getSubmissionsByAssignment(assignment.getId());

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(3L);
        verify(submissionRepository).findByAssignment(assignment);
    }

    @Test
    void whenGetSubmissionsByStudent_thenReturnSubmissions() {
        List<Submission> submissions = Arrays.asList(submission);
        List<SubmissionDTO> submissionDTOS = Arrays.asList(submissionDTO);

        when(submissionRepository.findByStudent(student)).thenReturn(submissions);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        List<SubmissionDTO> results = submissionService.getSubmissionsByStudent(student.getId());

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(3L);
        verify(submissionRepository).findByStudent(student);
    }

    @Test
    void whenGetGradedSubmissionsByAssignment_thenReturnSubmissions() {
        List<Submission> submissions = Arrays.asList(submission);
        List<SubmissionDTO> submissionDTOS = Arrays.asList(submissionDTO);

        when(submissionRepository.findGradedByAssignment(assignment)).thenReturn(submissions);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        List<SubmissionDTO> results = submissionService.getGradedSubmissionsByAssignment(assignment.getId());

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(3L);
        verify(submissionRepository).findGradedByAssignment(assignment);
    }

    @Test
    void whenGetGradedSubmissionsByStudent_thenReturnSubmissions() {
        List<Submission> submissions = Arrays.asList(submission);
        List<SubmissionDTO> submissionDTOS = Arrays.asList(submissionDTO);

        when(submissionRepository.findGradedByStudent(student)).thenReturn(submissions);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);

        List<SubmissionDTO> results = submissionService.getGradedSubmissionsByStudent(student.getId());

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(3L);
        verify(submissionRepository).findGradedByStudent(student);
    }

    @Test
    void whenGradeSubmission_thenReturnGradedSubmission() {
        when(submissionRepository.findById(3L)).thenReturn(Optional.of(submission));
        when(submissionRepository.save(any(Submission.class))).thenReturn(submission);
        when(submissionMapper.toDto(submission)).thenReturn(submissionDTO);

        SubmissionDTO result = submissionService.gradeSubmission(3L, 85, "Good work!");

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(3L);
        verify(submissionRepository).save(any(Submission.class));
    }

    @Test
    void whenExistsByAssignmentAndStudent_thenReturnTrue() {
        when(submissionRepository.existsByAssignmentAndStudent(assignment, student)).thenReturn(true);

        boolean result = submissionService.existsByAssignmentAndStudent(assignment.getId(), student.getId());

        assertThat(result).isTrue();
        verify(submissionRepository).existsByAssignmentAndStudent(assignment, student);
    }

    @Test
    void updateSubmissionPhase_success() {
        when(submissionRepository.findById(3L)).thenReturn(Optional.of(submission));
        when(submissionRepository.save(any(Submission.class))).thenReturn(submission);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);
        SubmissionDTO result = submissionService.updateSubmissionPhase(3L, SubmissionPhase.SUBMISSION);
        assertNotNull(result);
    }

    @Test
    void calculateFinalScore_success() {
        when(submissionRepository.findById(3L)).thenReturn(Optional.of(submission));
        when(submissionRepository.save(any(Submission.class))).thenReturn(submission);
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDTO);
        SubmissionDTO result = submissionService.calculateFinalScore(3L);
        assertNotNull(result);
    }

    @Test
    void getSubmissionsByUserId_success() {
        when(submissionRepository.findByStudentId(1L)).thenReturn(Collections.singletonList(submission));
        when(submissionMapper.toDto(submission)).thenReturn(submissionDTO);
        List<SubmissionDTO> result = submissionService.getSubmissionsByUserId(1L);
        assertEquals(1, result.size());
    }

    @Test
    void getSubmissionsByCourseId_success() {
        when(submissionRepository.findByCourseId(2L)).thenReturn(Collections.singletonList(submission));
        when(submissionMapper.toDto(submission)).thenReturn(submissionDTO);
        List<SubmissionDTO> result = submissionService.getSubmissionsByCourseId(2L);
        assertEquals(1, result.size());
    }
} 
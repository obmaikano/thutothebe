package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.QuizSubmissionDTO;
import com.ohma.thutothebe.entity.Quiz;
import com.ohma.thutothebe.entity.QuizSubmission;
import com.ohma.thutothebe.entity.QuizSubmissionStatus;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.QuizSubmissionMapper;
import com.ohma.thutothebe.repository.QuizRepository;
import com.ohma.thutothebe.repository.QuizSubmissionRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuizSubmissionServiceImplTest {

    @Mock
    private QuizSubmissionRepository quizSubmissionRepository;

    @Mock
    private QuizSubmissionMapper quizSubmissionMapper;

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private QuizSubmissionServiceImpl quizSubmissionService;

    private QuizSubmission submission;
    private QuizSubmissionDTO submissionDTO;
    private Quiz quiz;
    private User student;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();

        quiz = new Quiz();
        quiz.setId(1L);

        student = new User();
        student.setId(1L);

        submission = new QuizSubmission();
        submission.setId(1L);
        submission.setQuiz(quiz);
        submission.setStudent(student);
        submission.setStartedAt(now);
        submission.setSubmittedAt(null);
        submission.setGradedAt(null);
        submission.setScore(null);
        submission.setFeedback(null);
        submission.setStatus(QuizSubmissionStatus.IN_PROGRESS);
        submission.setResponses(new HashSet<>());
        submission.setActive(true);

        submissionDTO = new QuizSubmissionDTO(
            1L,
            1L,
            1L,
            now,
            null,
            null,
            null,
            null,
            QuizSubmissionStatus.IN_PROGRESS,
            new HashSet<>(),
            true
        );
    }

    @Test
    void startQuiz_ShouldCreateNewSubmission() {
        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(quizSubmissionRepository.existsByQuizIdAndStudentIdAndStatus(1L, 1L, QuizSubmissionStatus.IN_PROGRESS))
            .thenReturn(false);
        when(quizSubmissionRepository.save(any(QuizSubmission.class))).thenReturn(submission);
        when(quizSubmissionMapper.toDto(any(QuizSubmission.class))).thenReturn(submissionDTO);

        QuizSubmissionDTO result = quizSubmissionService.startQuiz(1L, 1L);

        assertNotNull(result);
        assertEquals(QuizSubmissionStatus.IN_PROGRESS, result.status());
        assertNotNull(result.startedAt());
        assertNull(result.submittedAt());
        assertNull(result.score());
        verify(quizSubmissionRepository).save(any(QuizSubmission.class));
    }

    @Test
    void startQuiz_ShouldThrowException_WhenStudentHasActiveSubmission() {
        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(quizSubmissionRepository.existsByQuizIdAndStudentIdAndStatus(1L, 1L, QuizSubmissionStatus.IN_PROGRESS))
            .thenReturn(true);

        assertThrows(IllegalStateException.class, () -> quizSubmissionService.startQuiz(1L, 1L));
    }

    @Test
    void submitQuiz_ShouldUpdateSubmissionStatus() {
        submission.setStatus(QuizSubmissionStatus.IN_PROGRESS);
        
        QuizSubmission updatedSubmission = new QuizSubmission();
        updatedSubmission.setId(1L);
        updatedSubmission.setQuiz(quiz);
        updatedSubmission.setStudent(student);
        updatedSubmission.setStartedAt(LocalDateTime.now());
        updatedSubmission.setSubmittedAt(LocalDateTime.now());
        updatedSubmission.setStatus(QuizSubmissionStatus.SUBMITTED);
        
        when(quizSubmissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(quizSubmissionRepository.save(any(QuizSubmission.class))).thenReturn(updatedSubmission);
        
        QuizSubmissionDTO updatedDTO = new QuizSubmissionDTO(
            1L, 1L, 1L, LocalDateTime.now(), LocalDateTime.now(), null, null, null,
            QuizSubmissionStatus.SUBMITTED, new HashSet<>(), true
        );
        when(quizSubmissionMapper.toDto(updatedSubmission)).thenReturn(updatedDTO);
        
        QuizSubmissionDTO result = quizSubmissionService.submitQuiz(1L);
        
        assertNotNull(result);
        assertEquals(QuizSubmissionStatus.SUBMITTED, result.status());
        verify(quizSubmissionRepository).save(any(QuizSubmission.class));
    }

    @Test
    void submitQuiz_ShouldThrowException_WhenNotInProgress() {
        submission.setStatus(QuizSubmissionStatus.SUBMITTED);
        when(quizSubmissionRepository.findById(1L)).thenReturn(Optional.of(submission));

        assertThrows(IllegalStateException.class, () -> quizSubmissionService.submitQuiz(1L));
    }

    @Test
    void gradeQuiz_ShouldUpdateSubmissionScore() {
        submission.setStatus(QuizSubmissionStatus.SUBMITTED);
        
        QuizSubmission gradedSubmission = new QuizSubmission();
        gradedSubmission.setId(1L);
        gradedSubmission.setQuiz(quiz);
        gradedSubmission.setStudent(student);
        gradedSubmission.setStartedAt(LocalDateTime.now());
        gradedSubmission.setSubmittedAt(LocalDateTime.now());
        gradedSubmission.setGradedAt(LocalDateTime.now());
        gradedSubmission.setScore(85);
        gradedSubmission.setStatus(QuizSubmissionStatus.GRADED);
        
        when(quizSubmissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(quizSubmissionRepository.save(any(QuizSubmission.class))).thenReturn(gradedSubmission);
        
        QuizSubmissionDTO gradedDTO = new QuizSubmissionDTO(
            1L, 1L, 1L, LocalDateTime.now(), LocalDateTime.now(), LocalDateTime.now(), 85, null,
            QuizSubmissionStatus.GRADED, new HashSet<>(), true
        );
        when(quizSubmissionMapper.toDto(gradedSubmission)).thenReturn(gradedDTO);
        
        QuizSubmissionDTO result = quizSubmissionService.gradeQuiz(1L, 85);
        
        assertNotNull(result);
        assertEquals(Integer.valueOf(85), result.score());
        assertEquals(QuizSubmissionStatus.GRADED, result.status());
        verify(quizSubmissionRepository).save(any(QuizSubmission.class));
    }

    @Test
    void gradeQuiz_ShouldThrowException_WhenNotSubmitted() {
        submission.setStatus(QuizSubmissionStatus.IN_PROGRESS);
        when(quizSubmissionRepository.findById(1L)).thenReturn(Optional.of(submission));

        assertThrows(IllegalStateException.class, () -> quizSubmissionService.gradeQuiz(1L, 85));
    }

    @Test
    void getByQuizId_ShouldReturnListOfSubmissions() {
        when(quizSubmissionRepository.findByQuizId(1L))
            .thenReturn(Arrays.asList(submission));
        when(quizSubmissionMapper.toDto(any(QuizSubmission.class)))
            .thenReturn(submissionDTO);

        List<QuizSubmissionDTO> result = quizSubmissionService.getByQuizId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(submissionDTO, result.get(0));
        verify(quizSubmissionRepository).findByQuizId(1L);
    }

    @Test
    void getByStudentId_ShouldReturnListOfSubmissions() {
        when(quizSubmissionRepository.findByStudentId(1L))
            .thenReturn(Arrays.asList(submission));
        when(quizSubmissionMapper.toDto(any(QuizSubmission.class)))
            .thenReturn(submissionDTO);

        List<QuizSubmissionDTO> result = quizSubmissionService.getByStudentId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(submissionDTO, result.get(0));
        verify(quizSubmissionRepository).findByStudentId(1L);
    }

    @Test
    void getByStatus_ShouldReturnListOfSubmissions() {
        when(quizSubmissionRepository.findByStatus(QuizSubmissionStatus.IN_PROGRESS))
            .thenReturn(Arrays.asList(submission));
        when(quizSubmissionMapper.toDto(any(QuizSubmission.class)))
            .thenReturn(submissionDTO);

        List<QuizSubmissionDTO> result = quizSubmissionService.getByStatus(QuizSubmissionStatus.IN_PROGRESS);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(submissionDTO, result.get(0));
        verify(quizSubmissionRepository).findByStatus(QuizSubmissionStatus.IN_PROGRESS);
    }

    @Test
    void getByQuizIdAndStudentId_ShouldReturnListOfSubmissions() {
        when(quizSubmissionRepository.findByQuizIdAndStudentId(1L, 1L))
            .thenReturn(Arrays.asList(submission));
        when(quizSubmissionMapper.toDto(any(QuizSubmission.class)))
            .thenReturn(submissionDTO);

        List<QuizSubmissionDTO> result = quizSubmissionService.getByQuizIdAndStudentId(1L, 1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(submissionDTO, result.get(0));
        verify(quizSubmissionRepository).findByQuizIdAndStudentId(1L, 1L);
    }

    @Test
    void getByQuizIdAndStatus_ShouldReturnListOfSubmissions() {
        when(quizSubmissionRepository.findByQuizIdAndStatus(1L, QuizSubmissionStatus.IN_PROGRESS))
            .thenReturn(Arrays.asList(submission));
        when(quizSubmissionMapper.toDto(any(QuizSubmission.class)))
            .thenReturn(submissionDTO);

        List<QuizSubmissionDTO> result = quizSubmissionService.getByQuizIdAndStatus(1L, QuizSubmissionStatus.IN_PROGRESS);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(submissionDTO, result.get(0));
        verify(quizSubmissionRepository).findByQuizIdAndStatus(1L, QuizSubmissionStatus.IN_PROGRESS);
    }

    @Test
    void getByStudentIdAndStatus_ShouldReturnListOfSubmissions() {
        when(quizSubmissionRepository.findByStudentIdAndStatus(1L, QuizSubmissionStatus.IN_PROGRESS))
            .thenReturn(Arrays.asList(submission));
        when(quizSubmissionMapper.toDto(any(QuizSubmission.class)))
            .thenReturn(submissionDTO);

        List<QuizSubmissionDTO> result = quizSubmissionService.getByStudentIdAndStatus(1L, QuizSubmissionStatus.IN_PROGRESS);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(submissionDTO, result.get(0));
        verify(quizSubmissionRepository).findByStudentIdAndStatus(1L, QuizSubmissionStatus.IN_PROGRESS);
    }
} 
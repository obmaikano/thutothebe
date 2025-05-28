package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.GradingResultDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.entity.enums.*;
import com.ohma.thutothebe.mapper.GradingResultMapper;
import com.ohma.thutothebe.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GradingServiceImplTest {

    @Mock
    private GradingResultRepository gradingResultRepository;

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private QuizSubmissionRepository quizSubmissionRepository;

    @Mock
    private AssignmentQuestionRepository assignmentQuestionRepository;

    @Mock
    private GradingResultMapper gradingResultMapper;

    @InjectMocks
    private GradingServiceImpl gradingService;

    private Assignment assignment;
    private Submission submission;
    private User student;
    private User instructor;
    private Course course;
    private AssignmentQuestion mcqQuestion;
    private AssignmentQuestion essayQuestion;
    private AssignmentQuestionOption correctOption;
    private AssignmentQuestionOption incorrectOption;
    private AssignmentResponse mcqResponse;
    private AssignmentResponse essayResponse;
    private GradingResult gradingResult;
    private Quiz quiz;
    private QuizSubmission quizSubmission;
    private Question quizQuestion;
    private QuestionOption quizCorrectOption;
    private QuestionResponse quizResponse;

    @BeforeEach
    void setUp() {
        // Setup test data
        setupUsers();
        setupCourse();
        setupAssignment();
        setupQuiz();
        setupSubmission();
        setupQuizSubmission();
        setupGradingResult();
    }

    private void setupUsers() {
        student = new User();
        student.setId(1L);
        student.setUsername("student1");

        instructor = new User();
        instructor.setId(2L);
        instructor.setUsername("instructor1");
    }

    private void setupCourse() {
        course = new Course();
        course.setId(1L);
        course.setCode("CS101");
        course.setName("Introduction to Computer Science");
    }

    private void setupAssignment() {
        assignment = new Assignment();
        assignment.setId(1L);
        assignment.setCode("ASSIGN001");
        assignment.setTitle("Test Assignment");
        assignment.setCourse(course);
        assignment.setInstructor(instructor);
        assignment.setTotalPoints(100);
        assignment.setGradingType(GradingType.HYBRID);
        assignment.setDueDate(LocalDateTime.now().plusDays(7));

        // Setup MCQ question
        mcqQuestion = new AssignmentQuestion();
        mcqQuestion.setId(1L);
        mcqQuestion.setText("What is 2 + 2?");
        mcqQuestion.setType(QuestionType.MULTIPLE_CHOICE);
        mcqQuestion.setPoints(50);
        mcqQuestion.setAssignment(assignment);
        mcqQuestion.setAutoGradable(true);
        mcqQuestion.setOrderIndex(1);

        // Setup options for MCQ
        correctOption = new AssignmentQuestionOption();
        correctOption.setId(1L);
        correctOption.setText("4");
        correctOption.setCorrect(true);
        correctOption.setAssignmentQuestion(mcqQuestion);

        incorrectOption = new AssignmentQuestionOption();
        incorrectOption.setId(2L);
        incorrectOption.setText("5");
        incorrectOption.setCorrect(false);
        incorrectOption.setAssignmentQuestion(mcqQuestion);

        mcqQuestion.setOptions(Set.of(correctOption, incorrectOption));

        // Setup essay question
        essayQuestion = new AssignmentQuestion();
        essayQuestion.setId(2L);
        essayQuestion.setText("Explain the concept of inheritance in OOP.");
        essayQuestion.setType(QuestionType.ESSAY);
        essayQuestion.setPoints(50);
        essayQuestion.setAssignment(assignment);
        essayQuestion.setAutoGradable(false);
        essayQuestion.setOrderIndex(2);

        assignment.setQuestions(Set.of(mcqQuestion, essayQuestion));
    }

    private void setupQuiz() {
        quiz = new Quiz();
        quiz.setId(1L);
        quiz.setCode("QUIZ001");
        quiz.setTitle("Test Quiz");
        quiz.setCourse(course);
        quiz.setInstructor(instructor);
        quiz.setTotalPoints(50);
        quiz.setGradingType(GradingType.AUTO);

        quizQuestion = new Question();
        quizQuestion.setId(1L);
        quizQuestion.setText("What is the capital of France?");
        quizQuestion.setType(QuestionType.MULTIPLE_CHOICE);
        quizQuestion.setPoints(50);
        quizQuestion.setQuiz(quiz);

        quizCorrectOption = new QuestionOption();
        quizCorrectOption.setId(1L);
        quizCorrectOption.setText("Paris");
        quizCorrectOption.setCorrect(true);
        quizCorrectOption.setQuestion(quizQuestion);

        quizQuestion.setOptions(Set.of(quizCorrectOption));
        quiz.setQuestions(Set.of(quizQuestion));
    }

    private void setupSubmission() {
        submission = new Submission();
        submission.setId(1L);
        submission.setStudent(student);
        submission.setCourse(course);
        submission.setAssignment(assignment);
        submission.setContent("Test submission content");
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setGradingMode(GradingMode.HYBRID);
        submission.setStatus(SubmissionStatus.SUBMITTED);

        // Setup responses
        mcqResponse = new AssignmentResponse();
        mcqResponse.setId(1L);
        mcqResponse.setSubmission(submission);
        mcqResponse.setAssignmentQuestion(mcqQuestion);
        mcqResponse.setSelectedOption(correctOption);

        essayResponse = new AssignmentResponse();
        essayResponse.setId(2L);
        essayResponse.setSubmission(submission);
        essayResponse.setAssignmentQuestion(essayQuestion);
        essayResponse.setResponseText("Inheritance allows classes to inherit properties and methods from parent classes.");

        submission.setAssignmentResponses(Set.of(mcqResponse, essayResponse));
    }

    private void setupQuizSubmission() {
        quizSubmission = new QuizSubmission();
        quizSubmission.setId(1L);
        quizSubmission.setQuiz(quiz);
        quizSubmission.setStudent(student);
        quizSubmission.setStartedAt(LocalDateTime.now().minusMinutes(30));
        quizSubmission.setSubmittedAt(LocalDateTime.now());
        quizSubmission.setStatus(QuizSubmissionStatus.SUBMITTED);

        quizResponse = new QuestionResponse();
        quizResponse.setId(1L);
        quizResponse.setSubmission(quizSubmission);
        quizResponse.setQuestion(quizQuestion);
        quizResponse.setSelectedOptions(Set.of(quizCorrectOption));

        quizSubmission.setResponses(Set.of(quizResponse));
    }

    private void setupGradingResult() {
        gradingResult = new GradingResult();
        gradingResult.setId(1L);
        gradingResult.setSubmission(submission);
        gradingResult.setStatus(GradingStatus.PENDING);
    }

    @Test
    void testAutoGradeSubmission_Success() {
        // Given
        when(assignmentQuestionRepository.findAutoGradableByAssignmentId(assignment.getId()))
            .thenReturn(List.of(mcqQuestion));
        when(gradingResultRepository.save(any(GradingResult.class)))
            .thenReturn(gradingResult);
        when(submissionRepository.save(any(Submission.class)))
            .thenReturn(submission);
        when(gradingResultMapper.toDto(any(GradingResult.class)))
            .thenReturn(createGradingResultDTO());

        // When
        GradingResultDTO result = gradingService.autoGradeSubmission(submission);

        // Then
        assertNotNull(result);
        verify(assignmentQuestionRepository).findAutoGradableByAssignmentId(assignment.getId());
        verify(gradingResultRepository).save(any(GradingResult.class));
        verify(submissionRepository).save(submission);
        verify(gradingResultMapper).toDto(any(GradingResult.class));
    }

    @Test
    void testAutoGradeSubmission_CannotBeAutoGraded() {
        // Given
        submission.setGradingMode(GradingMode.MANUAL_ONLY);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> gradingService.autoGradeSubmission(submission)
        );
        assertEquals("Submission cannot be auto-graded", exception.getMessage());
    }

    @Test
    void testAutoGradeQuizSubmission_Success() {
        // Given
        when(gradingResultRepository.save(any(GradingResult.class)))
            .thenReturn(gradingResult);
        when(quizSubmissionRepository.save(any(QuizSubmission.class)))
            .thenReturn(quizSubmission);
        when(gradingResultMapper.toDto(any(GradingResult.class)))
            .thenReturn(createGradingResultDTO());

        // When
        GradingResultDTO result = gradingService.autoGradeQuizSubmission(quizSubmission);

        // Then
        assertNotNull(result);
        verify(gradingResultRepository).save(any(GradingResult.class));
        verify(quizSubmissionRepository).save(quizSubmission);
        verify(gradingResultMapper).toDto(any(GradingResult.class));
    }

    @Test
    void testManualGradeSubmission_NewGradingResult() {
        // Given
        Double manualScore = 45.0;
        String feedback = "Good work, but could be improved";
        
        when(gradingResultRepository.findLatestBySubmissionId(submission.getId()))
            .thenReturn(Optional.empty());
        when(gradingResultRepository.save(any(GradingResult.class)))
            .thenReturn(gradingResult);
        when(submissionRepository.save(any(Submission.class)))
            .thenReturn(submission);
        when(gradingResultMapper.toDto(any(GradingResult.class)))
            .thenReturn(createGradingResultDTO());

        // When
        GradingResultDTO result = gradingService.manualGradeSubmission(submission, instructor, manualScore, feedback);

        // Then
        assertNotNull(result);
        verify(gradingResultRepository).findLatestBySubmissionId(submission.getId());
        verify(gradingResultRepository).save(any(GradingResult.class));
        verify(submissionRepository).save(submission);
        verify(gradingResultMapper).toDto(any(GradingResult.class));
    }

    @Test
    void testManualGradeSubmission_ExistingGradingResult() {
        // Given
        Double manualScore = 45.0;
        String feedback = "Good work, but could be improved";
        
        when(gradingResultRepository.findLatestBySubmissionId(submission.getId()))
            .thenReturn(Optional.of(gradingResult));
        when(gradingResultRepository.save(any(GradingResult.class)))
            .thenReturn(gradingResult);
        when(submissionRepository.save(any(Submission.class)))
            .thenReturn(submission);
        when(gradingResultMapper.toDto(any(GradingResult.class)))
            .thenReturn(createGradingResultDTO());

        // When
        GradingResultDTO result = gradingService.manualGradeSubmission(submission, instructor, manualScore, feedback);

        // Then
        assertNotNull(result);
        verify(gradingResultRepository).findLatestBySubmissionId(submission.getId());
        verify(gradingResultRepository).save(gradingResult);
        verify(submissionRepository).save(submission);
        verify(gradingResultMapper).toDto(gradingResult);
    }

    @Test
    void testFinalizeGrade_Success() {
        // Given
        gradingResult.setAutoScore(50.0);
        gradingResult.setManualScore(45.0);
        
        when(gradingResultRepository.findLatestBySubmissionId(submission.getId()))
            .thenReturn(Optional.of(gradingResult));
        when(gradingResultRepository.save(any(GradingResult.class)))
            .thenReturn(gradingResult);
        when(submissionRepository.save(any(Submission.class)))
            .thenReturn(submission);
        when(gradingResultMapper.toDto(any(GradingResult.class)))
            .thenReturn(createGradingResultDTO());

        // When
        GradingResultDTO result = gradingService.finalizeGrade(submission);

        // Then
        assertNotNull(result);
        verify(gradingResultRepository).findLatestBySubmissionId(submission.getId());
        verify(gradingResultRepository).save(gradingResult);
        verify(submissionRepository).save(submission);
        verify(gradingResultMapper).toDto(gradingResult);
    }

    @Test
    void testFinalizeGrade_NoGradingResultFound() {
        // Given
        when(gradingResultRepository.findLatestBySubmissionId(submission.getId()))
            .thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> gradingService.finalizeGrade(submission)
        );
        assertEquals("No grading result found for submission", exception.getMessage());
    }

    @Test
    void testCanAutoGrade_Assignment_True() {
        // Given
        assignment.setGradingType(GradingType.AUTO);

        // When
        boolean result = gradingService.canAutoGrade(assignment);

        // Then
        assertTrue(result);
    }

    @Test
    void testCanAutoGrade_Assignment_False() {
        // Given
        assignment.setGradingType(GradingType.MANUAL);
        assignment.setQuestions(Set.of(essayQuestion)); // Only manual questions

        // When
        boolean result = gradingService.canAutoGrade(assignment);

        // Then
        assertFalse(result);
    }

    @Test
    void testCanAutoGrade_Quiz_True() {
        // Given
        quiz.setGradingType(GradingType.AUTO);

        // When
        boolean result = gradingService.canAutoGrade(quiz);

        // Then
        assertTrue(result);
    }

    @Test
    void testCanAutoGrade_Quiz_False() {
        // Given
        quiz.setGradingType(GradingType.MANUAL);

        // When
        boolean result = gradingService.canAutoGrade(quiz);

        // Then
        assertFalse(result);
    }

    @Test
    void testGetGradingResultsBySubmission() {
        // Given
        List<GradingResult> gradingResults = List.of(gradingResult);
        when(gradingResultRepository.findBySubmissionId(submission.getId()))
            .thenReturn(gradingResults);
        when(gradingResultMapper.toDto(gradingResult))
            .thenReturn(createGradingResultDTO());

        // When
        List<GradingResultDTO> results = gradingService.getGradingResultsBySubmission(submission.getId());

        // Then
        assertNotNull(results);
        assertEquals(1, results.size());
        verify(gradingResultRepository).findBySubmissionId(submission.getId());
        verify(gradingResultMapper).toDto(gradingResult);
    }

    @Test
    void testGetGradingResultsByQuizSubmission() {
        // Given
        gradingResult.setQuizSubmission(quizSubmission);
        List<GradingResult> gradingResults = List.of(gradingResult);
        when(gradingResultRepository.findByQuizSubmissionId(quizSubmission.getId()))
            .thenReturn(gradingResults);
        when(gradingResultMapper.toDto(gradingResult))
            .thenReturn(createGradingResultDTO());

        // When
        List<GradingResultDTO> results = gradingService.getGradingResultsByQuizSubmission(quizSubmission.getId());

        // Then
        assertNotNull(results);
        assertEquals(1, results.size());
        verify(gradingResultRepository).findByQuizSubmissionId(quizSubmission.getId());
        verify(gradingResultMapper).toDto(gradingResult);
    }

    @Test
    void testRealTimeAutoGrade() {
        // Given
        when(assignmentQuestionRepository.findAutoGradableByAssignmentId(assignment.getId()))
            .thenReturn(List.of(mcqQuestion));
        when(gradingResultRepository.save(any(GradingResult.class)))
            .thenReturn(gradingResult);
        when(submissionRepository.save(any(Submission.class)))
            .thenReturn(submission);
        when(gradingResultMapper.toDto(any(GradingResult.class)))
            .thenReturn(createGradingResultDTO());

        // When
        GradingResultDTO result = gradingService.realTimeAutoGrade(submission);

        // Then
        assertNotNull(result);
        verify(assignmentQuestionRepository).findAutoGradableByAssignmentId(assignment.getId());
        verify(gradingResultRepository).save(any(GradingResult.class));
        verify(submissionRepository).save(submission);
        verify(gradingResultMapper).toDto(any(GradingResult.class));
    }

    @Test
    void testReGradeSubmission_Success() {
        // Given
        when(submissionRepository.findById(submission.getId()))
            .thenReturn(Optional.of(submission));
        when(assignmentQuestionRepository.findAutoGradableByAssignmentId(assignment.getId()))
            .thenReturn(List.of(mcqQuestion));
        when(gradingResultRepository.save(any(GradingResult.class)))
            .thenReturn(gradingResult);
        when(submissionRepository.save(any(Submission.class)))
            .thenReturn(submission);
        when(gradingResultRepository.findLatestBySubmissionId(submission.getId()))
            .thenReturn(Optional.of(gradingResult));
        when(gradingResultMapper.toDto(gradingResult))
            .thenReturn(createGradingResultDTO());

        // When
        GradingResultDTO result = gradingService.reGradeSubmission(submission.getId(), instructor);

        // Then
        assertNotNull(result);
        verify(submissionRepository).findById(submission.getId());
        verify(gradingResultRepository).findLatestBySubmissionId(submission.getId());
        verify(gradingResultMapper).toDto(gradingResult);
    }

    @Test
    void testReGradeSubmission_SubmissionNotFound() {
        // Given
        when(submissionRepository.findById(submission.getId()))
            .thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> gradingService.reGradeSubmission(submission.getId(), instructor)
        );
        assertEquals("Submission not found", exception.getMessage());
    }

    @Test
    void testReGradeSubmission_NoGradingResultFound() {
        // Given
        when(submissionRepository.findById(submission.getId()))
            .thenReturn(Optional.of(submission));
        when(gradingResultRepository.findLatestBySubmissionId(submission.getId()))
            .thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> gradingService.reGradeSubmission(submission.getId(), instructor)
        );
        assertEquals("No grading result found", exception.getMessage());
    }

    @Test
    void testHybridGradingWorkflow() {
        // Test complete hybrid grading workflow
        
        // Step 1: Auto-grade the submission
        when(assignmentQuestionRepository.findAutoGradableByAssignmentId(assignment.getId()))
            .thenReturn(List.of(mcqQuestion));
        when(gradingResultRepository.save(any(GradingResult.class)))
            .thenReturn(gradingResult);
        when(submissionRepository.save(any(Submission.class)))
            .thenReturn(submission);
        when(gradingResultMapper.toDto(any(GradingResult.class)))
            .thenReturn(createGradingResultDTO());

        GradingResultDTO autoResult = gradingService.autoGradeSubmission(submission);
        assertNotNull(autoResult);

        // Step 2: Manual grade the submission
        when(gradingResultRepository.findLatestBySubmissionId(submission.getId()))
            .thenReturn(Optional.of(gradingResult));

        GradingResultDTO manualResult = gradingService.manualGradeSubmission(
            submission, instructor, 45.0, "Good essay response");
        assertNotNull(manualResult);

        // Step 3: Finalize the grade
        gradingResult.setAutoScore(50.0);
        gradingResult.setManualScore(45.0);

        GradingResultDTO finalResult = gradingService.finalizeGrade(submission);
        assertNotNull(finalResult);

        // Verify all steps were executed
        verify(assignmentQuestionRepository).findAutoGradableByAssignmentId(assignment.getId());
        verify(gradingResultRepository, times(3)).save(any(GradingResult.class));
        verify(submissionRepository, times(3)).save(submission);
        verify(gradingResultMapper, times(3)).toDto(any(GradingResult.class));
    }

    private GradingResultDTO createGradingResultDTO() {
        return new GradingResultDTO(
            1L,
            submission.getId(),
            null,
            50.0,
            45.0,
            95.0,
            GradingStatus.COMPLETE,
            LocalDateTime.now(),
            LocalDateTime.now(),
            instructor.getId(),
            instructor.getUsername(),
            "Auto-grading feedback",
            "Manual grading feedback",
            false,
            "{}",
            LocalDateTime.now(),
            LocalDateTime.now()
        );
    }
} 
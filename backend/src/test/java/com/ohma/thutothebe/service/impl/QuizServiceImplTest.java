package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.QuizDTO;
import com.ohma.thutothebe.entity.Quiz;
import com.ohma.thutothebe.entity.QuizStatus;
import com.ohma.thutothebe.mapper.QuizMapper;
import com.ohma.thutothebe.repository.QuizRepository;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuizServiceImplTest {

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private QuizMapper quizMapper;

    @InjectMocks
    private QuizServiceImpl quizService;

    private Quiz quiz;
    private QuizDTO quizDTO;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();
        quiz = new Quiz();
        quiz.setId(1L);
        quiz.setCode("TEST001");
        quiz.setStatus(QuizStatus.DRAFT);
        quiz.setActive(true);

        quizDTO = new QuizDTO(
            1L,
            "TEST001",
            "Test Quiz",
            "Test Description",
            1L,
            1L,
            now,
            now.plusHours(1),
            30,
            100,
            QuizStatus.DRAFT,
            null,
            true
        );
    }

    @Test
    void getByCode_ShouldReturnQuizDTO() {
        when(quizRepository.findByCode("TEST001")).thenReturn(Optional.of(quiz));
        when(quizMapper.toDto(quiz)).thenReturn(quizDTO);

        QuizDTO result = quizService.getByCode("TEST001");

        assertNotNull(result);
        assertEquals("TEST001", result.code());
        verify(quizRepository).findByCode("TEST001");
        verify(quizMapper).toDto(quiz);
    }

    @Test
    void getByCode_ShouldThrowException_WhenQuizNotFound() {
        when(quizRepository.findByCode("INVALID"))
            .thenReturn(Optional.empty());
        
        assertThrows(com.ohma.thutothebe.exception.ResourceNotFoundException.class, () -> 
            quizService.getByCode("INVALID"));
    }

    @Test
    void getByCourseId_ShouldReturnListOfQuizDTOs() {
        List<Quiz> quizzes = Arrays.asList(quiz);
        List<QuizDTO> quizDTOs = Arrays.asList(quizDTO);

        when(quizRepository.findByCourseId(1L))
            .thenReturn(Arrays.asList(quiz));
        when(quizMapper.toDto(any(Quiz.class))).thenReturn(quizDTO);

        List<QuizDTO> result = quizService.getByCourseId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("TEST001", result.get(0).code());
        verify(quizRepository).findByCourseId(1L);
    }

    @Test
    void getByInstructorId_ShouldReturnListOfQuizDTOs() {
        List<Quiz> quizzes = Arrays.asList(quiz);
        List<QuizDTO> quizDTOs = Arrays.asList(quizDTO);

        when(quizRepository.findByInstructorId(1L)).thenReturn(quizzes);
        when(quizMapper.toDto(any(Quiz.class))).thenReturn(quizDTO);

        List<QuizDTO> result = quizService.getByInstructorId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("TEST001", result.get(0).code());
        verify(quizRepository).findByInstructorId(1L);
    }

    @Test
    void getByStatus_ShouldReturnListOfQuizDTOs() {
        List<Quiz> quizzes = Arrays.asList(quiz);
        List<QuizDTO> quizDTOs = Arrays.asList(quizDTO);

        when(quizRepository.findByStatus(QuizStatus.DRAFT)).thenReturn(quizzes);
        when(quizMapper.toDto(any(Quiz.class))).thenReturn(quizDTO);

        List<QuizDTO> result = quizService.getByStatus(QuizStatus.DRAFT);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(QuizStatus.DRAFT, result.get(0).status());
        verify(quizRepository).findByStatus(QuizStatus.DRAFT);
    }

    @Test
    void getByCourseIdAndStatus_ShouldReturnListOfQuizDTOs() {
        List<Quiz> quizzes = Arrays.asList(quiz);
        List<QuizDTO> quizDTOs = Arrays.asList(quizDTO);

        when(quizRepository.findByCourseIdAndStatus(1L, QuizStatus.DRAFT)).thenReturn(quizzes);
        when(quizMapper.toDto(any(Quiz.class))).thenReturn(quizDTO);

        List<QuizDTO> result = quizService.getByCourseIdAndStatus(1L, QuizStatus.DRAFT);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(QuizStatus.DRAFT, result.get(0).status());
        verify(quizRepository).findByCourseIdAndStatus(1L, QuizStatus.DRAFT);
    }

    @Test
    void getActiveByCourseId_ShouldReturnListOfQuizDTOs() {
        // Make sure the quiz is active
        quiz.setActive(true);
        
        when(quizRepository.findActiveByCourseId(1L))
            .thenReturn(Arrays.asList(quiz));
        when(quizMapper.toDto(any(Quiz.class)))
            .thenReturn(quizDTO);
        
        List<QuizDTO> result = quizService.getActiveByCourseId(1L);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(quizDTO, result.get(0));
    }

    @Test
    void existsByCode_ShouldReturnTrue_WhenQuizExists() {
        when(quizRepository.existsByCode("TEST001")).thenReturn(true);

        boolean result = quizService.existsByCode("TEST001");

        assertTrue(result);
        verify(quizRepository).existsByCode("TEST001");
    }

    @Test
    void existsByCode_ShouldReturnFalse_WhenQuizDoesNotExist() {
        when(quizRepository.existsByCode("NONEXISTENT")).thenReturn(false);

        boolean result = quizService.existsByCode("NONEXISTENT");

        assertFalse(result);
        verify(quizRepository).existsByCode("NONEXISTENT");
    }
} 
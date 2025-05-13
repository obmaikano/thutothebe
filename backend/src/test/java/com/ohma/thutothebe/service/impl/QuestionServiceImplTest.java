package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.QuestionDTO;
import com.ohma.thutothebe.entity.Question;
import com.ohma.thutothebe.entity.QuestionType;
import com.ohma.thutothebe.mapper.QuestionMapper;
import com.ohma.thutothebe.repository.QuestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestionServiceImplTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private QuestionMapper questionMapper;

    @InjectMocks
    private QuestionServiceImpl questionService;

    private Question question;
    private QuestionDTO questionDTO;

    @BeforeEach
    void setUp() {
        question = new Question();
        question.setId(1L);
        question.setText("Test Question");
        question.setType(QuestionType.MULTIPLE_CHOICE);
        question.setPoints(10);

        questionDTO = new QuestionDTO(
            1L,
            "Test Question",
            QuestionType.MULTIPLE_CHOICE,
            10,
            1L,
            null,
            null,
            true
        );
    }

    @Test
    void getByQuizId_ShouldReturnListOfQuestionDTOs() {
        List<Question> questions = Arrays.asList(question);
        List<QuestionDTO> questionDTOs = Arrays.asList(questionDTO);

        when(questionRepository.findByQuizId(1L)).thenReturn(questions);
        when(questionMapper.toDto(any(Question.class))).thenReturn(questionDTO);

        List<QuestionDTO> result = questionService.getByQuizId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Question", result.get(0).text());
        assertEquals(QuestionType.MULTIPLE_CHOICE, result.get(0).type());
        assertEquals(10, result.get(0).points());
        verify(questionRepository).findByQuizId(1L);
    }

    @Test
    void getByQuizIdAndType_ShouldReturnListOfQuestionDTOs() {
        List<Question> questions = Arrays.asList(question);
        List<QuestionDTO> questionDTOs = Arrays.asList(questionDTO);

        when(questionRepository.findByQuizIdAndType(1L, QuestionType.MULTIPLE_CHOICE)).thenReturn(questions);
        when(questionMapper.toDto(any(Question.class))).thenReturn(questionDTO);

        List<QuestionDTO> result = questionService.getByQuizIdAndType(1L, QuestionType.MULTIPLE_CHOICE);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Question", result.get(0).text());
        assertEquals(QuestionType.MULTIPLE_CHOICE, result.get(0).type());
        assertEquals(10, result.get(0).points());
        verify(questionRepository).findByQuizIdAndType(1L, QuestionType.MULTIPLE_CHOICE);
    }
} 
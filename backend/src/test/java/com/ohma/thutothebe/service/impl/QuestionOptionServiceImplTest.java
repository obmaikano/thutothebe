package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.QuestionOptionDTO;
import com.ohma.thutothebe.entity.QuestionOption;
import com.ohma.thutothebe.mapper.QuestionOptionMapper;
import com.ohma.thutothebe.repository.QuestionOptionRepository;
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
class QuestionOptionServiceImplTest {

    @Mock
    private QuestionOptionRepository questionOptionRepository;

    @Mock
    private QuestionOptionMapper questionOptionMapper;

    @InjectMocks
    private QuestionOptionServiceImpl questionOptionService;

    private QuestionOption questionOption;
    private QuestionOptionDTO questionOptionDTO;

    @BeforeEach
    void setUp() {
        questionOption = new QuestionOption();
        questionOption.setId(1L);
        questionOption.setText("Test Option");
        questionOption.setCorrect(true);

        questionOptionDTO = new QuestionOptionDTO(
            1L,
            "Test Option",
            true,
            1L,
            true
        );
    }

    @Test
    void getByQuestionId_ShouldReturnListOfQuestionOptionDTOs() {
        List<QuestionOption> options = Arrays.asList(questionOption);
        List<QuestionOptionDTO> optionDTOs = Arrays.asList(questionOptionDTO);

        when(questionOptionRepository.findByQuestionId(1L)).thenReturn(options);
        when(questionOptionMapper.toDto(any(QuestionOption.class))).thenReturn(questionOptionDTO);

        List<QuestionOptionDTO> result = questionOptionService.getByQuestionId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Option", result.get(0).text());
        assertTrue(result.get(0).isCorrect());
        verify(questionOptionRepository).findByQuestionId(1L);
    }

    @Test
    void getByQuestionIdAndIsCorrect_ShouldReturnListOfQuestionOptionDTOs() {
        List<QuestionOption> options = Arrays.asList(questionOption);
        List<QuestionOptionDTO> optionDTOs = Arrays.asList(questionOptionDTO);

        when(questionOptionRepository.findByQuestionIdAndIsCorrect(1L, true)).thenReturn(options);
        when(questionOptionMapper.toDto(any(QuestionOption.class))).thenReturn(questionOptionDTO);

        List<QuestionOptionDTO> result = questionOptionService.getByQuestionIdAndIsCorrect(1L, true);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Option", result.get(0).text());
        assertTrue(result.get(0).isCorrect());
        verify(questionOptionRepository).findByQuestionIdAndIsCorrect(1L, true);
    }
} 
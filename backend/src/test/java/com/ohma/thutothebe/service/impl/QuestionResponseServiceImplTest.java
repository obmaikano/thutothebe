package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.QuestionResponseDTO;
import com.ohma.thutothebe.entity.Question;
import com.ohma.thutothebe.entity.QuestionOption;
import com.ohma.thutothebe.entity.QuestionResponse;
import com.ohma.thutothebe.entity.QuizSubmission;
import com.ohma.thutothebe.entity.QuizSubmissionStatus;
import com.ohma.thutothebe.mapper.QuestionResponseMapper;
import com.ohma.thutothebe.repository.QuestionOptionRepository;
import com.ohma.thutothebe.repository.QuestionRepository;
import com.ohma.thutothebe.repository.QuestionResponseRepository;
import com.ohma.thutothebe.repository.QuizSubmissionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestionResponseServiceImplTest {

    @Mock
    private QuestionResponseRepository questionResponseRepository;

    @Mock
    private QuestionResponseMapper questionResponseMapper;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private QuestionOptionRepository questionOptionRepository;

    @Mock
    private QuizSubmissionRepository quizSubmissionRepository;

    @InjectMocks
    private QuestionResponseServiceImpl questionResponseService;

    private QuestionResponse response;
    private QuestionResponseDTO responseDTO;
    private QuizSubmission submission;
    private Question question;
    private QuestionOption option1;
    private QuestionOption option2;

    @BeforeEach
    void setUp() {
        question = new Question();
        question.setId(1L);

        submission = new QuizSubmission();
        submission.setId(1L);
        submission.setStatus(QuizSubmissionStatus.IN_PROGRESS);

        option1 = new QuestionOption();
        option1.setId(1L);
        option1.setQuestion(question);

        option2 = new QuestionOption();
        option2.setId(2L);
        option2.setQuestion(question);

        response = new QuestionResponse();
        response.setId(1L);
        response.setSubmission(submission);
        response.setQuestion(question);
        response.setTextResponse("Test response");
        response.setSelectedOptions(new HashSet<>(Arrays.asList(option1, option2)));
        response.setPointsAwarded(null);
        response.setFeedback(null);

        responseDTO = new QuestionResponseDTO(
            1L,
            1L,
            1L,
            "Test response",
            new HashSet<>(Arrays.asList(1L, 2L)),
            null,
            null,
            true
        );
    }

    @Test
    void saveResponse_ShouldCreateNewResponse() {
        when(quizSubmissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        when(questionResponseRepository.findBySubmissionIdAndQuestionId(1L, 1L)).thenReturn(Optional.empty());
        when(questionOptionRepository.findById(1L)).thenReturn(Optional.of(option1));
        when(questionOptionRepository.findById(2L)).thenReturn(Optional.of(option2));
        when(questionResponseRepository.save(any(QuestionResponse.class))).thenReturn(response);
        when(questionResponseMapper.toDto(any(QuestionResponse.class))).thenReturn(responseDTO);

        QuestionResponseDTO result = questionResponseService.saveResponse(1L, 1L, "Test response", Set.of(1L, 2L));

        assertNotNull(result);
        assertEquals("Test response", result.textResponse());
        assertEquals(2, result.selectedOptionIds().size());
        assertTrue(result.selectedOptionIds().contains(1L));
        assertTrue(result.selectedOptionIds().contains(2L));
        verify(questionResponseRepository).save(any(QuestionResponse.class));
    }

    @Test
    void saveResponse_ShouldUpdateExistingResponse() {
        when(quizSubmissionRepository.findById(1L)).thenReturn(Optional.of(submission));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        when(questionResponseRepository.findBySubmissionIdAndQuestionId(1L, 1L)).thenReturn(Optional.of(response));
        when(questionOptionRepository.findById(1L)).thenReturn(Optional.of(option1));
        
        // Create a modified response to return from save
        QuestionResponse updatedResponse = new QuestionResponse();
        updatedResponse.setId(1L);
        updatedResponse.setSubmission(submission);
        updatedResponse.setQuestion(question);
        updatedResponse.setTextResponse("Updated response");
        updatedResponse.setSelectedOptions(new HashSet<>(Arrays.asList(option1)));
        
        when(questionResponseRepository.save(any(QuestionResponse.class))).thenReturn(updatedResponse);
        
        // Create a DTO that matches the updated response
        QuestionResponseDTO updatedDTO = new QuestionResponseDTO(
            1L, 1L, 1L, "Updated response", 
            new HashSet<>(Arrays.asList(1L)), null, null, true
        );
        when(questionResponseMapper.toDto(updatedResponse)).thenReturn(updatedDTO);

        QuestionResponseDTO result = questionResponseService.saveResponse(1L, 1L, "Updated response", Set.of(1L));

        assertNotNull(result);
        assertEquals("Updated response", result.textResponse());
        assertEquals(1, result.selectedOptionIds().size());
        assertTrue(result.selectedOptionIds().contains(1L));
        verify(questionResponseRepository).save(any(QuestionResponse.class));
    }

    @Test
    void saveResponse_ShouldThrowException_WhenSubmissionNotInProgress() {
        submission.setStatus(QuizSubmissionStatus.SUBMITTED);
        when(quizSubmissionRepository.findById(1L)).thenReturn(Optional.of(submission));

        assertThrows(IllegalStateException.class, () -> 
            questionResponseService.saveResponse(1L, 1L, "Test response", Set.of(1L, 2L)));
    }

    @Test
    void gradeResponse_ShouldUpdateResponseScore() {
        submission.setStatus(QuizSubmissionStatus.SUBMITTED);
        
        // Create a graded response to return from save
        QuestionResponse gradedResponse = new QuestionResponse();
        gradedResponse.setId(1L);
        gradedResponse.setSubmission(submission);
        gradedResponse.setQuestion(question);
        gradedResponse.setTextResponse("Test response");
        gradedResponse.setSelectedOptions(new HashSet<>(Arrays.asList(option1, option2)));
        gradedResponse.setPointsAwarded(10);
        gradedResponse.setFeedback("Good job!");
        
        when(questionResponseRepository.findById(1L)).thenReturn(Optional.of(response));
        when(questionResponseRepository.save(any(QuestionResponse.class))).thenReturn(gradedResponse);
        
        // Create a DTO that matches the graded response
        QuestionResponseDTO gradedDTO = new QuestionResponseDTO(
            1L, 1L, 1L, "Test response", 
            new HashSet<>(Arrays.asList(1L, 2L)), 10, "Good job!", true
        );
        when(questionResponseMapper.toDto(gradedResponse)).thenReturn(gradedDTO);

        QuestionResponseDTO result = questionResponseService.gradeResponse(1L, 10, "Good job!");

        assertNotNull(result);
        assertEquals(Integer.valueOf(10), result.pointsAwarded());
        assertEquals("Good job!", result.feedback());
        verify(questionResponseRepository).save(any(QuestionResponse.class));
    }

    @Test
    void gradeResponse_ShouldThrowException_WhenSubmissionNotSubmitted() {
        when(questionResponseRepository.findById(1L)).thenReturn(Optional.of(response));

        assertThrows(IllegalStateException.class, () -> 
            questionResponseService.gradeResponse(1L, 10, "Good job!"));
    }

    @Test
    void getBySubmissionId_ShouldReturnListOfResponses() {
        when(questionResponseRepository.findBySubmissionId(1L))
            .thenReturn(Arrays.asList(response));
        when(questionResponseMapper.toDto(any(QuestionResponse.class)))
            .thenReturn(responseDTO);

        var result = questionResponseService.getBySubmissionId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(responseDTO, result.get(0));
        verify(questionResponseRepository).findBySubmissionId(1L);
    }

    @Test
    void getByQuestionId_ShouldReturnListOfResponses() {
        when(questionResponseRepository.findByQuestionId(1L))
            .thenReturn(Arrays.asList(response));
        when(questionResponseMapper.toDto(any(QuestionResponse.class)))
            .thenReturn(responseDTO);

        var result = questionResponseService.getByQuestionId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(responseDTO, result.get(0));
        verify(questionResponseRepository).findByQuestionId(1L);
    }
} 
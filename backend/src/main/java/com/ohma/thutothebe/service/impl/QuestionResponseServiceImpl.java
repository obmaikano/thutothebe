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
import com.ohma.thutothebe.service.QuestionResponseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class QuestionResponseServiceImpl extends BaseServiceImpl<QuestionResponse, QuestionResponseDTO, Long> implements QuestionResponseService {

    private final QuestionResponseRepository questionResponseRepository;
    private final QuestionResponseMapper questionResponseMapper;
    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository questionOptionRepository;
    private final QuizSubmissionRepository quizSubmissionRepository;

    public QuestionResponseServiceImpl(
            QuestionResponseRepository questionResponseRepository,
            QuestionResponseMapper questionResponseMapper,
            QuestionRepository questionRepository,
            QuestionOptionRepository questionOptionRepository,
            QuizSubmissionRepository quizSubmissionRepository) {
        super(questionResponseRepository);
        this.questionResponseRepository = questionResponseRepository;
        this.questionResponseMapper = questionResponseMapper;
        this.questionRepository = questionRepository;
        this.questionOptionRepository = questionOptionRepository;
        this.quizSubmissionRepository = quizSubmissionRepository;
    }

    @Override
    protected QuestionResponse mapToEntity(QuestionResponseDTO dto) {
        return questionResponseMapper.toEntity(dto);
    }

    @Override
    protected QuestionResponseDTO mapToDto(QuestionResponse entity) {
        return questionResponseMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(QuestionResponse entity, QuestionResponseDTO dto) {
        questionResponseMapper.updateEntity(entity, dto);
    }

    @Override
    public List<QuestionResponseDTO> getBySubmissionId(Long submissionId) {
        return questionResponseRepository.findBySubmissionId(submissionId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<QuestionResponseDTO> getByQuestionId(Long questionId) {
        return questionResponseRepository.findByQuestionId(questionId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public QuestionResponseDTO saveResponse(Long submissionId, Long questionId, String textResponse, Set<Long> selectedOptionIds) {
        QuizSubmission submission = quizSubmissionRepository.findById(submissionId)
            .orElseThrow(() -> new IllegalArgumentException("Submission not found with id: " + submissionId));

        if (submission.getStatus() != QuizSubmissionStatus.IN_PROGRESS) {
            throw new IllegalStateException("Cannot save response for a submission that is not in progress");
        }

        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + questionId));

        // Check if response already exists
        QuestionResponse existingResponse = questionResponseRepository.findBySubmissionIdAndQuestionId(submissionId, questionId)
            .orElse(new QuestionResponse());

        existingResponse.setSubmission(submission);
        existingResponse.setQuestion(question);
        existingResponse.setTextResponse(textResponse);

        // Update selected options if provided
        if (selectedOptionIds != null && !selectedOptionIds.isEmpty()) {
            Set<QuestionOption> selectedOptions = selectedOptionIds.stream()
                .map(optionId -> questionOptionRepository.findById(optionId)
                    .orElseThrow(() -> new IllegalArgumentException("Question option not found with id: " + optionId)))
                .collect(Collectors.toSet());
            existingResponse.setSelectedOptions(selectedOptions);
        }

        return mapToDto(questionResponseRepository.save(existingResponse));
    }

    @Override
    public QuestionResponseDTO gradeResponse(Long responseId, Integer pointsAwarded, String feedback) {
        QuestionResponse response = questionResponseRepository.findById(responseId)
            .orElseThrow(() -> new IllegalArgumentException("Response not found with id: " + responseId));

        QuizSubmission submission = response.getSubmission();
        if (submission.getStatus() != QuizSubmissionStatus.SUBMITTED) {
            throw new IllegalStateException("Cannot grade response for a submission that is not submitted");
        }

        response.setPointsAwarded(pointsAwarded);
        response.setFeedback(feedback);

        return mapToDto(questionResponseRepository.save(response));
    }
} 
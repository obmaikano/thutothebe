package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.QuestionOptionDTO;
import com.ohma.thutothebe.entity.QuestionOption;
import com.ohma.thutothebe.repository.QuestionRepository;
import org.springframework.stereotype.Component;

@Component
public class QuestionOptionMapper implements BaseDtoMapper<QuestionOption, QuestionOptionDTO> {

    private final QuestionRepository questionRepository;

    public QuestionOptionMapper(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Override
    public QuestionOptionDTO toDto(QuestionOption entity) {
        if (entity == null) {
            return null;
        }

        return new QuestionOptionDTO(
            entity.getId(),
            entity.getText(),
            entity.isCorrect(),
            entity.getQuestion() != null ? entity.getQuestion().getId() : null,
            entity.isActive()
        );
    }

    @Override
    public QuestionOption toEntity(QuestionOptionDTO dto) {
        if (dto == null) {
            return null;
        }

        QuestionOption entity = new QuestionOption();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(QuestionOption entity, QuestionOptionDTO dto) {
        entity.setText(dto.text());
        entity.setCorrect(dto.isCorrect());
        entity.setActive(dto.active());
        
        // Set the question relationship if questionId is provided and valid (not 0 or null)
        if (dto.questionId() != null && dto.questionId() > 0 && entity.getQuestion() == null) {
            entity.setQuestion(questionRepository.findById(dto.questionId())
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + dto.questionId())));
        }
        // If questionId is null or 0, the question relationship should be set by the parent entity (Question)
    }
} 
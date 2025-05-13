package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.QuestionOptionDTO;
import com.ohma.thutothebe.entity.QuestionOption;
import org.springframework.stereotype.Component;

@Component
public class QuestionOptionMapper implements BaseDtoMapper<QuestionOption, QuestionOptionDTO> {

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
    }
} 
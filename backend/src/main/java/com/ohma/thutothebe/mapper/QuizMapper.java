package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.QuizDTO;
import com.ohma.thutothebe.dto.CreateQuizDTO;
import com.ohma.thutothebe.entity.Quiz;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class QuizMapper implements BaseDtoMapper<Quiz, QuizDTO> {

    private final QuestionMapper questionMapper;

    public QuizMapper(QuestionMapper questionMapper) {
        this.questionMapper = questionMapper;
    }

    @Override
    public QuizDTO toDto(Quiz entity) {
        if (entity == null) {
            return null;
        }

        return new QuizDTO(
            entity.getId(),
            entity.getCode(),
            entity.getTitle(),
            entity.getDescription(),
            entity.getCourse() != null ? entity.getCourse().getId() : null,
            entity.getInstructor() != null ? entity.getInstructor().getId() : null,
            entity.getStartDate(),
            entity.getEndDate(),
            entity.getTimeLimit(),
            entity.getTotalPoints(),
            entity.getStatus(),
            entity.getGradingType(),
            entity.isAutoGradeImmediately(),
            entity.isShowResultsImmediately(),
            entity.getMaxAttempts(),
            entity.getQuestions() != null ? 
                entity.getQuestions().stream()
                    .map(questionMapper::toDto)
                    .collect(Collectors.toSet()) : 
                null,
            entity.isActive()
        );
    }

    @Override
    public Quiz toEntity(QuizDTO dto) {
        if (dto == null) {
            return null;
        }

        Quiz entity = new Quiz();
        updateEntity(entity, dto);
        return entity;
    }

    public Quiz toEntity(CreateQuizDTO dto) {
        if (dto == null) {
            return null;
        }

        Quiz entity = new Quiz();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(Quiz entity, QuizDTO dto) {
        entity.setCode(dto.code());
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setStartDate(dto.startDate());
        entity.setEndDate(dto.endDate());
        entity.setTimeLimit(dto.timeLimit());
        entity.setTotalPoints(dto.totalPoints());
        entity.setStatus(dto.status());
        entity.setGradingType(dto.gradingType());
        entity.setAutoGradeImmediately(dto.autoGradeImmediately());
        entity.setShowResultsImmediately(dto.showResultsImmediately());
        entity.setMaxAttempts(dto.maxAttempts());
        entity.setActive(dto.active());
    }

    public void updateEntity(Quiz entity, CreateQuizDTO dto) {
        entity.setCode(dto.code());
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setStartDate(dto.startDate());
        entity.setEndDate(dto.endDate());
        entity.setTimeLimit(dto.timeLimit());
        entity.setTotalPoints(dto.totalPoints());
        entity.setStatus(dto.status());
        entity.setGradingType(dto.gradingType());
        entity.setAutoGradeImmediately(dto.autoGradeImmediately());
        entity.setShowResultsImmediately(dto.showResultsImmediately());
        entity.setMaxAttempts(dto.maxAttempts());
        entity.setActive(dto.active());
    }
}
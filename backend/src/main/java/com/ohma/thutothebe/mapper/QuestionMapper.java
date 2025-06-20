package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.QuestionDTO;
import com.ohma.thutothebe.entity.Question;
import com.ohma.thutothebe.entity.QuestionOption;
import com.ohma.thutothebe.repository.QuizRepository;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class QuestionMapper implements BaseDtoMapper<Question, QuestionDTO> {

    private final QuestionOptionMapper optionMapper;
    private final QuizRepository quizRepository;

    public QuestionMapper(QuestionOptionMapper optionMapper, QuizRepository quizRepository) {
        this.optionMapper = optionMapper;
        this.quizRepository = quizRepository;
    }

    @Override
    public QuestionDTO toDto(Question entity) {
        if (entity == null) {
            return null;
        }

        return new QuestionDTO(
            entity.getId(),
            entity.getText(),
            entity.getType(),
            entity.getPoints(),
            entity.getQuiz() != null ? entity.getQuiz().getId() : null,
            entity.getOptions() != null ? 
                entity.getOptions().stream()
                    .map(optionMapper::toDto)
                    .collect(Collectors.toSet()) : 
                null,
            entity.getCorrectAnswer(),
            entity.isActive()
        );
    }

    @Override
    public Question toEntity(QuestionDTO dto) {
        if (dto == null) {
            return null;
        }

        Question entity = new Question();
        updateEntity(entity, dto);
        return entity;
    }

    public void updateEntity(Question entity, QuestionDTO dto) {
        entity.setText(dto.text());
        entity.setType(dto.type());
        entity.setPoints(dto.points());
        entity.setCorrectAnswer(dto.correctAnswer());
        entity.setActive(dto.active());
        entity.setQuiz(dto.quizId() != null ? quizRepository.findById(dto.quizId()).get() : null);
        
        // Create options and set the question relationship
        if (dto.options() != null) {
            entity.setOptions(dto.options().stream()
                .map(optionDto -> {
                    QuestionOption option = new QuestionOption();
                    option.setText(optionDto.text());
                    option.setCorrect(optionDto.isCorrect());
                    option.setActive(optionDto.active());
                    option.setQuestion(entity);
                    return option;
                })
                .collect(Collectors.toSet()));
        }
    }
} 
package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.QuestionDTO;
import com.ohma.thutothebe.entity.Question;
import com.ohma.thutothebe.entity.QuestionType;
import com.ohma.thutothebe.mapper.QuestionMapper;
import com.ohma.thutothebe.repository.QuestionRepository;
import com.ohma.thutothebe.service.QuestionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class QuestionServiceImpl extends BaseServiceImpl<Question, QuestionDTO, Long> implements QuestionService {

    private final QuestionRepository questionRepository;
    private final QuestionMapper questionMapper;

    public QuestionServiceImpl(QuestionRepository questionRepository, QuestionMapper questionMapper) {
        super(questionRepository);
        this.questionRepository = questionRepository;
        this.questionMapper = questionMapper;
    }

    @Override
    protected Question mapToEntity(QuestionDTO dto) {
        return questionMapper.toEntity(dto);
    }

    @Override
    protected QuestionDTO mapToDto(Question entity) {
        return questionMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Question entity, QuestionDTO dto) {
        questionMapper.updateEntity(entity, dto);
    }

    @Override
    public List<QuestionDTO> getByQuizId(Long quizId) {
        return questionRepository.findByQuizId(quizId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<QuestionDTO> getByQuizIdAndType(Long quizId, QuestionType type) {
        return questionRepository.findByQuizIdAndType(quizId, type).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    protected Long extractSchoolId(Question entity) {
        return entity.getQuiz() != null && entity.getQuiz().getCourse() != null && entity.getQuiz().getCourse().getClassEntity() != null && entity.getQuiz().getCourse().getClassEntity().getSchool() != null 
            ? entity.getQuiz().getCourse().getClassEntity().getSchool().getId() : null;
    }
    
    @Override
    protected Long extractRegionId(Question entity) {
        return entity.getQuiz() != null && entity.getQuiz().getCourse() != null && entity.getQuiz().getCourse().getClassEntity() != null && entity.getQuiz().getCourse().getClassEntity().getSchool() != null && entity.getQuiz().getCourse().getClassEntity().getSchool().getRegion() != null 
            ? entity.getQuiz().getCourse().getClassEntity().getSchool().getRegion().getId() : null;
    }

    @Override
    @CacheEvict(value = {"accessControl", "accessibleScopes"}, allEntries = true)
    public QuestionDTO create(QuestionDTO dto) {
        Question entity = mapToEntity(dto);

        // Enterprise security validation
        validateBusinessRules(entity, false);

        beforeCreate(entity);

        try {
            Question savedEntity = repository.save(entity);
            log.info("Entity created successfully: {} by user: {}",
                    savedEntity.getClass().getSimpleName(), getCurrentUserId());
            return mapToDto(savedEntity);
        } catch (Exception e) {
            log.error("Failed to create entity: {}", e.getMessage());
            throw new RuntimeException("Failed to create entity: " + e.getMessage(), e);
        }
    }
} 
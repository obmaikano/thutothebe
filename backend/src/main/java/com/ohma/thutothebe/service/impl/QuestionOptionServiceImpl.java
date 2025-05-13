package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.QuestionOptionDTO;
import com.ohma.thutothebe.entity.QuestionOption;
import com.ohma.thutothebe.mapper.QuestionOptionMapper;
import com.ohma.thutothebe.repository.QuestionOptionRepository;
import com.ohma.thutothebe.service.QuestionOptionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class QuestionOptionServiceImpl extends BaseServiceImpl<QuestionOption, QuestionOptionDTO, Long> implements QuestionOptionService {

    private final QuestionOptionRepository questionOptionRepository;
    private final QuestionOptionMapper questionOptionMapper;

    public QuestionOptionServiceImpl(QuestionOptionRepository questionOptionRepository, QuestionOptionMapper questionOptionMapper) {
        super(questionOptionRepository);
        this.questionOptionRepository = questionOptionRepository;
        this.questionOptionMapper = questionOptionMapper;
    }

    @Override
    protected QuestionOption mapToEntity(QuestionOptionDTO dto) {
        return questionOptionMapper.toEntity(dto);
    }

    @Override
    protected QuestionOptionDTO mapToDto(QuestionOption entity) {
        return questionOptionMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(QuestionOption entity, QuestionOptionDTO dto) {
        questionOptionMapper.updateEntity(entity, dto);
    }

    @Override
    public List<QuestionOptionDTO> getByQuestionId(Long questionId) {
        return questionOptionRepository.findByQuestionId(questionId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<QuestionOptionDTO> getByQuestionIdAndIsCorrect(Long questionId, boolean isCorrect) {
        return questionOptionRepository.findByQuestionIdAndIsCorrect(questionId, isCorrect).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }
} 
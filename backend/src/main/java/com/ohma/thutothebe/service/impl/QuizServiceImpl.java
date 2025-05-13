package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.QuizDTO;
import com.ohma.thutothebe.entity.Quiz;
import com.ohma.thutothebe.entity.QuizStatus;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.QuizMapper;
import com.ohma.thutothebe.repository.QuizRepository;
import com.ohma.thutothebe.service.QuizService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class QuizServiceImpl extends BaseServiceImpl<Quiz, QuizDTO, Long> implements QuizService {

    private final QuizRepository quizRepository;
    private final QuizMapper quizMapper;

    public QuizServiceImpl(QuizRepository quizRepository, QuizMapper quizMapper) {
        super(quizRepository);
        this.quizRepository = quizRepository;
        this.quizMapper = quizMapper;
    }

    @Override
    protected Quiz mapToEntity(QuizDTO dto) {
        return quizMapper.toEntity(dto);
    }

    @Override
    protected QuizDTO mapToDto(Quiz entity) {
        return quizMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Quiz entity, QuizDTO dto) {
        quizMapper.updateEntity(entity, dto);
    }

    @Override
    public QuizDTO getByCode(String code) {
        Quiz quiz = quizRepository.findByCode(code)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with code: " + code));
        return mapToDto(quiz);
    }

    @Override
    public List<QuizDTO> getByCourseId(Long courseId) {
        return quizRepository.findByCourseId(courseId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<QuizDTO> getByInstructorId(Long instructorId) {
        return quizRepository.findByInstructorId(instructorId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<QuizDTO> getByStatus(QuizStatus status) {
        return quizRepository.findByStatus(status).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<QuizDTO> getByCourseIdAndStatus(Long courseId, QuizStatus status) {
        return quizRepository.findByCourseIdAndStatus(courseId, status).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<QuizDTO> getActiveByCourseId(Long courseId) {
        return quizRepository.findActiveByCourseId(courseId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public boolean existsByCode(String code) {
        return quizRepository.existsByCode(code);
    }
} 
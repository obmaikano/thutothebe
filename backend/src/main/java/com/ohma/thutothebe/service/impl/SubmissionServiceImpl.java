package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.SubmissionDTO;
import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.entity.Submission;
import com.ohma.thutothebe.entity.SubmissionStatus;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.SubmissionNotFoundException;
import com.ohma.thutothebe.mapper.SubmissionMapper;
import com.ohma.thutothebe.repository.SubmissionRepository;
import com.ohma.thutothebe.service.SubmissionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class SubmissionServiceImpl extends BaseServiceImpl<Submission, SubmissionDTO, Long> implements SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionMapper submissionMapper;

    public SubmissionServiceImpl(SubmissionRepository submissionRepository, SubmissionMapper submissionMapper) {
        super(submissionRepository);
        this.submissionRepository = submissionRepository;
        this.submissionMapper = submissionMapper;
    }

    @Override
    protected Submission mapToEntity(SubmissionDTO dto) {
        return submissionMapper.toEntity(dto);
    }

    @Override
    protected SubmissionDTO mapToDto(Submission entity) {
        return submissionMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Submission entity, SubmissionDTO dto) {
        submissionMapper.updateEntityFromDto(dto, entity);
    }

    @Override
    public SubmissionDTO getSubmissionByAssignmentAndStudent(Assignment assignment, User student) {
        Submission submission = submissionRepository.findByAssignmentAndStudent(assignment, student)
            .orElseThrow(() -> SubmissionNotFoundException.withAssignmentAndStudent(assignment.getId(), student.getId()));
        return mapToDto(submission);
    }

    @Override
    public List<SubmissionDTO> getSubmissionsByAssignment(Assignment assignment) {
        return submissionRepository.findByAssignment(assignment).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<SubmissionDTO> getSubmissionsByStudent(User student) {
        return submissionRepository.findByStudent(student).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<SubmissionDTO> getGradedSubmissionsByAssignment(Assignment assignment) {
        return submissionRepository.findGradedByAssignment(assignment).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<SubmissionDTO> getGradedSubmissionsByStudent(User student) {
        return submissionRepository.findGradedByStudent(student).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public boolean existsByAssignmentAndStudent(Assignment assignment, User student) {
        return submissionRepository.existsByAssignmentAndStudent(assignment, student);
    }

    @Override
    @Transactional
    public SubmissionDTO gradeSubmission(Long id, Integer score, String feedback) {
        Submission submission = submissionRepository.findById(id)
            .orElseThrow(() -> SubmissionNotFoundException.withId(id));
        
        submission.setScore(score);
        submission.setFeedback(feedback);
        submission.setGradedAt(LocalDateTime.now());
        submission.setStatus(SubmissionStatus.GRADED);
        
        return mapToDto(submissionRepository.save(submission));
    }

    @Override
    protected RuntimeException notFoundException(Long id) {
        return SubmissionNotFoundException.withId(id);
    }
} 
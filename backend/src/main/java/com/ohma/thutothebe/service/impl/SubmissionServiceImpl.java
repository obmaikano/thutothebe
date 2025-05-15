package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.SubmissionDTO;
import com.ohma.thutothebe.entity.Submission;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.enums.SubmissionPhase;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.SubmissionMapper;
import com.ohma.thutothebe.repository.SubmissionRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.service.SubmissionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class SubmissionServiceImpl extends BaseServiceImpl<Submission, SubmissionDTO, Long> implements SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final SubmissionMapper submissionMapper;

    @Autowired
    public SubmissionServiceImpl(
            SubmissionRepository submissionRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            SubmissionMapper submissionMapper
    ) {
        super(submissionRepository);
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.submissionMapper = submissionMapper;
    }

    @Override
    @Transactional
    public SubmissionDTO create(SubmissionDTO submissionDto) {
        log.info("Creating submission for user: {} in course: {}", submissionDto.studentId(), submissionDto.courseId());
        
        User user = userRepository.findById(submissionDto.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Course course = courseRepository.findById(submissionDto.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        Submission submission = new Submission();
        submission.setStudent(user);
        submission.setCourse(course);
        submission.setContent(submissionDto.content());
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setPhase(SubmissionPhase.SUBMISSION);
        
        Submission savedSubmission = submissionRepository.save(submission);
        return submissionMapper.toDto(savedSubmission);
    }

    @Override
    @Transactional
    public SubmissionDTO update(Long id, SubmissionDTO submissionDto) {
        log.info("Updating submission: {}", id);
        
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
        
        submission.setContent(submissionDto.content());
        
        Submission updatedSubmission = submissionRepository.save(submission);
        return submissionMapper.toDto(updatedSubmission);
    }

    @Override
    public List<SubmissionDTO> getSubmissionsByUserId(Long userId) {
        log.info("Getting submissions for student: {}", userId);
        return submissionRepository.findByStudentId(userId).stream()
                .map(submissionMapper::toDto)
                .toList();
    }

    @Override
    public List<SubmissionDTO> getSubmissionsByCourseId(Long courseId) {
        log.info("Getting submissions for course: {}", courseId);
        return submissionRepository.findByCourseId(courseId).stream()
                .map(submissionMapper::toDto)
                .toList();
    }

    @Override
    public List<SubmissionDTO> getSubmissionsByCourseIdAndPhase(Long courseId, SubmissionPhase phase) {
        log.info("Getting submissions for course: {} in phase: {}", courseId, phase);
        return submissionRepository.findByCourseIdAndPhase(courseId, phase).stream()
                .map(submissionMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public SubmissionDTO updateSubmissionPhase(Long id, SubmissionPhase phase) {
        log.info("Updating submission phase: {} to {}", id, phase);
        
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
        
        submission.setPhase(phase);
        
        Submission updatedSubmission = submissionRepository.save(submission);
        return submissionMapper.toDto(updatedSubmission);
    }

    @Override
    public List<SubmissionDTO> getOtherSubmissionsByCourseId(Long courseId, Long userId) {
        log.info("Getting other submissions for course: {} excluding user: {}", courseId, userId);
        return submissionRepository.findOtherSubmissionsByCourseId(courseId, userId).stream()
                .map(submissionMapper::toDto)
                .toList();
    }

    @Override
    public long countSubmissionsByCourseId(Long courseId) {
        return submissionRepository.countSubmissionsByCourseId(courseId);
    }

    @Override
    @Transactional
    public SubmissionDTO calculateFinalScore(Long id) {
        log.info("Calculating final score for submission: {}", id);
        
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
        
        // Calculate final score based on assessments
        double finalScore = submission.getAssessments().stream()
                .filter(assessment -> assessment.getScore() != null)
                .mapToDouble(assessment -> assessment.getScore())
                .average()
                .orElse(0.0);
        
        submission.setFinalScore(finalScore);
        
        Submission updatedSubmission = submissionRepository.save(submission);
        return submissionMapper.toDto(updatedSubmission);
    }

    @Override
    public SubmissionDTO getSubmissionByAssignmentAndStudent(Long assignmentId, Long studentId) {
        return null;
    }

    @Override
    public List<SubmissionDTO> getSubmissionsByAssignment(Long assignmentId) {
        return List.of();
    }

    @Override
    public List<SubmissionDTO> getSubmissionsByStudent(Long studentId) {
        return List.of();
    }

    @Override
    public List<SubmissionDTO> getGradedSubmissionsByAssignment(Long assignmentId) {
        return List.of();
    }

    @Override
    public List<SubmissionDTO> getGradedSubmissionsByStudent(Long studentId) {
        return List.of();
    }

    @Override
    public SubmissionDTO gradeSubmission(Long submissionId, int score, String feedback) {
        return null;
    }

    @Override
    public boolean existsByAssignmentAndStudent(Long assignmentId, Long studentId) {
        return false;
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
} 
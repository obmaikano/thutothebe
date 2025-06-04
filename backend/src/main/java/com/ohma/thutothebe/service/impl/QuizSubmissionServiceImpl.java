package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.QuizSubmissionDTO;
import com.ohma.thutothebe.entity.Quiz;
import com.ohma.thutothebe.entity.QuizSubmission;
import com.ohma.thutothebe.entity.QuizSubmissionStatus;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.QuizSubmissionMapper;
import com.ohma.thutothebe.repository.QuizRepository;
import com.ohma.thutothebe.repository.QuizSubmissionRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.QuizSubmissionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class QuizSubmissionServiceImpl extends BaseServiceImpl<QuizSubmission, QuizSubmissionDTO, Long> implements QuizSubmissionService {

    private final QuizSubmissionRepository quizSubmissionRepository;
    private final QuizSubmissionMapper quizSubmissionMapper;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;

    public QuizSubmissionServiceImpl(
            QuizSubmissionRepository quizSubmissionRepository,
            QuizSubmissionMapper quizSubmissionMapper,
            QuizRepository quizRepository,
            UserRepository userRepository) {
        super(quizSubmissionRepository);
        this.quizSubmissionRepository = quizSubmissionRepository;
        this.quizSubmissionMapper = quizSubmissionMapper;
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
    }

    @Override
    protected QuizSubmission mapToEntity(QuizSubmissionDTO dto) {
        return quizSubmissionMapper.toEntity(dto);
    }

    @Override
    protected QuizSubmissionDTO mapToDto(QuizSubmission entity) {
        return quizSubmissionMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(QuizSubmission entity, QuizSubmissionDTO dto) {
        quizSubmissionMapper.updateEntity(entity, dto);
    }

    @Override
    public List<QuizSubmissionDTO> getByQuizId(Long quizId) {
        return quizSubmissionRepository.findByQuizId(quizId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuizSubmissionDTO> getByStudentId(Long studentId) {
        return quizSubmissionRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuizSubmissionDTO> getByStatus(QuizSubmissionStatus status) {
        return quizSubmissionRepository.findByStatus(status).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuizSubmissionDTO> getByQuizIdAndStudentId(Long quizId, Long studentId) {
        return quizSubmissionRepository.findByQuizIdAndStudentId(quizId, studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuizSubmissionDTO> getByQuizIdAndStatus(Long quizId, QuizSubmissionStatus status) {
        return quizSubmissionRepository.findByQuizIdAndStatus(quizId, status).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuizSubmissionDTO> getByStudentIdAndStatus(Long studentId, QuizSubmissionStatus status) {
        return quizSubmissionRepository.findByStudentIdAndStatus(studentId, status).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public QuizSubmissionDTO startQuiz(Long quizId, Long studentId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found with id: " + quizId));
        
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + studentId));

        // Check if student already has an active submission
        if (quizSubmissionRepository.existsByQuizIdAndStudentIdAndStatus(quizId, studentId, QuizSubmissionStatus.IN_PROGRESS)) {
            throw new IllegalStateException("Student already has an active submission for this quiz");
        }

        QuizSubmission submission = new QuizSubmission();
        submission.setQuiz(quiz);
        submission.setStudent(student);
        submission.setStartedAt(LocalDateTime.now());
        submission.setStatus(QuizSubmissionStatus.IN_PROGRESS);
        submission.setActive(true);

        return mapToDto(quizSubmissionRepository.save(submission));
    }

    @Override
    public QuizSubmissionDTO submitQuiz(Long submissionId) {
        QuizSubmission submission = quizSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found with id: " + submissionId));

        if (submission.getStatus() != QuizSubmissionStatus.IN_PROGRESS) {
            throw new IllegalStateException("Cannot submit quiz that is not in progress");
        }

        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus(QuizSubmissionStatus.SUBMITTED);

        return mapToDto(quizSubmissionRepository.save(submission));
    }

    @Override
    public QuizSubmissionDTO gradeQuiz(Long submissionId, Integer score) {
        QuizSubmission submission = quizSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found with id: " + submissionId));

        if (submission.getStatus() != QuizSubmissionStatus.SUBMITTED) {
            throw new IllegalStateException("Cannot grade quiz that is not submitted");
        }

        submission.setGradedAt(LocalDateTime.now());
        submission.setScore(score);
        submission.setStatus(QuizSubmissionStatus.GRADED);

        return mapToDto(quizSubmissionRepository.save(submission));
    }

    @Override
    protected Long extractSchoolId(QuizSubmission entity) {
        return entity.getQuiz() != null && entity.getQuiz().getCourse() != null && entity.getQuiz().getCourse().getClassEntity() != null && entity.getQuiz().getCourse().getClassEntity().getSchool() != null 
            ? entity.getQuiz().getCourse().getClassEntity().getSchool().getId() : null;
    }
    
    @Override
    protected Long extractRegionId(QuizSubmission entity) {
        return entity.getQuiz() != null && entity.getQuiz().getCourse() != null && entity.getQuiz().getCourse().getClassEntity() != null && entity.getQuiz().getCourse().getClassEntity().getSchool() != null && entity.getQuiz().getCourse().getClassEntity().getSchool().getRegion() != null 
            ? entity.getQuiz().getCourse().getClassEntity().getSchool().getRegion().getId() : null;
    }
} 
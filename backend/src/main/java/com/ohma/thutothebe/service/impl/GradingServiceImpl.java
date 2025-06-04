package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.GradingResultDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.entity.enums.GradingStatus;
import com.ohma.thutothebe.entity.enums.GradingMode;
import com.ohma.thutothebe.mapper.GradingResultMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.GradingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@Transactional
public class GradingServiceImpl extends BaseServiceImpl<GradingResult, GradingResultDTO, Long> implements GradingService {

    private final GradingResultRepository gradingResultRepository;
    private final SubmissionRepository submissionRepository;
    private final QuizSubmissionRepository quizSubmissionRepository;
    private final AssignmentQuestionRepository assignmentQuestionRepository;
    private final GradingResultMapper gradingResultMapper;

    public GradingServiceImpl(
            GradingResultRepository gradingResultRepository,
            SubmissionRepository submissionRepository,
            QuizSubmissionRepository quizSubmissionRepository,
            AssignmentQuestionRepository assignmentQuestionRepository,
            GradingResultMapper gradingResultMapper) {
        super(gradingResultRepository);
        this.gradingResultRepository = gradingResultRepository;
        this.submissionRepository = submissionRepository;
        this.quizSubmissionRepository = quizSubmissionRepository;
        this.assignmentQuestionRepository = assignmentQuestionRepository;
        this.gradingResultMapper = gradingResultMapper;
    }

    @Override
    protected GradingResult mapToEntity(GradingResultDTO dto) {
        return gradingResultMapper.toEntity(dto);
    }

    @Override
    protected GradingResultDTO mapToDto(GradingResult entity) {
        return gradingResultMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(GradingResult entity, GradingResultDTO dto) {
        gradingResultMapper.updateEntity(entity, dto);
    }

    @Override
    @Transactional
    public GradingResultDTO autoGradeSubmission(Submission submission) {
        log.info("Starting auto-grading for submission ID: {}", submission.getId());
        
        if (!submission.canBeAutoGraded()) {
            throw new IllegalArgumentException("Submission cannot be auto-graded");
        }

        GradingResult gradingResult = new GradingResult();
        gradingResult.setSubmission(submission);
        gradingResult.setStatus(GradingStatus.PENDING);

        // Get auto-gradable questions for the assignment
        List<AssignmentQuestion> autoGradableQuestions = assignmentQuestionRepository
            .findAutoGradableByAssignmentId(submission.getAssignment().getId());

        double totalAutoScore = 0.0;
        StringBuilder autoFeedback = new StringBuilder();

        for (AssignmentQuestion question : autoGradableQuestions) {
            // Find student's response to this question
            AssignmentResponse response = submission.getAssignmentResponses().stream()
                .filter(r -> r.getAssignmentQuestion().getId().equals(question.getId()))
                .findFirst()
                .orElse(null);

            if (response != null) {
                double pointsEarned = gradeQuestionResponse(question, response);
                totalAutoScore += pointsEarned;
                
                response.setPointsEarned(pointsEarned);
                response.setAutoGraded(true);
                response.setAutoGradedAt(LocalDateTime.now());
                
                autoFeedback.append(String.format("Question %d: %.1f/%.1f points\n", 
                    question.getOrderIndex(), pointsEarned, question.getPoints().doubleValue()));
            }
        }

        gradingResult.setAutoScore(totalAutoScore);
        gradingResult.setAutoGradedAt(LocalDateTime.now());
        gradingResult.setAutoFeedback(autoFeedback.toString());
        gradingResult.setStatus(GradingStatus.AUTO_COMPLETE);

        // Update submission
        submission.setAutoScore(totalAutoScore);
        submission.setAutoGradedAt(LocalDateTime.now());

        // Check if manual grading is also required
        if (submission.getGradingMode() == GradingMode.HYBRID && 
            submission.getAssignment().getManualGradablePoints() > 0) {
            gradingResult.setRequiresManualReview(true);
            gradingResult.setStatus(GradingStatus.PENDING_MANUAL);
        } else if (submission.getGradingMode() == GradingMode.AUTO_ONLY) {
            submission.setFinalScore(totalAutoScore);
            gradingResult.setFinalScore(totalAutoScore);
            gradingResult.setStatus(GradingStatus.COMPLETE);
        }

        GradingResult savedResult = gradingResultRepository.save(gradingResult);
        submissionRepository.save(submission);

        log.info("Auto-grading completed for submission ID: {} with score: {}", 
            submission.getId(), totalAutoScore);

        return gradingResultMapper.toDto(savedResult);
    }

    @Override
    @Transactional
    public GradingResultDTO autoGradeQuizSubmission(QuizSubmission quizSubmission) {
        log.info("Starting auto-grading for quiz submission ID: {}", quizSubmission.getId());

        GradingResult gradingResult = new GradingResult();
        gradingResult.setQuizSubmission(quizSubmission);
        gradingResult.setStatus(GradingStatus.PENDING);

        double totalScore = 0.0;

        // Grade each question response
        for (QuestionResponse response : quizSubmission.getResponses()) {
            Question question = response.getQuestion();

            if (question.getType() == QuestionType.MULTIPLE_CHOICE || 
                question.getType() == QuestionType.TRUE_FALSE) {
                
                // Check if any selected option is correct
                boolean hasCorrectAnswer = response.getSelectedOptions().stream()
                    .anyMatch(QuestionOption::isCorrect);
                
                if (hasCorrectAnswer) {
                    totalScore += question.getPoints();
                }
            }
        }

        gradingResult.setAutoScore(totalScore);
        gradingResult.setFinalScore(totalScore);
        gradingResult.setAutoGradedAt(LocalDateTime.now());
        gradingResult.setStatus(GradingStatus.COMPLETE);

        // Update quiz submission
        quizSubmission.setScore((int) totalScore);
        quizSubmission.setGradedAt(LocalDateTime.now());

        GradingResult savedResult = gradingResultRepository.save(gradingResult);
        quizSubmissionRepository.save(quizSubmission);

        log.info("Auto-grading completed for quiz submission ID: {} with score: {}", 
            quizSubmission.getId(), totalScore);

        return gradingResultMapper.toDto(savedResult);
    }

    @Override
    @Transactional
    public GradingResultDTO manualGradeSubmission(Submission submission, User assessor, Double score, String feedback) {
        log.info("Starting manual grading for submission ID: {} by assessor ID: {}", 
            submission.getId(), assessor.getId());

        GradingResult gradingResult = gradingResultRepository.findLatestBySubmissionId(submission.getId())
            .orElse(new GradingResult());

        if (gradingResult.getId() == null) {
            gradingResult.setSubmission(submission);
            gradingResult.setStatus(GradingStatus.PENDING);
        }

        gradingResult.setManualScore(score);
        gradingResult.setManualFeedback(feedback);
        gradingResult.setGradedBy(assessor);
        gradingResult.setManualGradedAt(LocalDateTime.now());
        gradingResult.setStatus(GradingStatus.MANUAL_COMPLETE);

        // Calculate final score based on grading mode
        Double finalScore = calculateFinalScore(gradingResult, submission.getGradingMode());
        gradingResult.setFinalScore(finalScore);
        gradingResult.setStatus(GradingStatus.COMPLETE);

        // Update submission
        submission.setManualScore(score);
        submission.setFinalScore(finalScore);
        submission.setManuallyGradedAt(LocalDateTime.now());
        submission.setFeedback(feedback);

        GradingResult savedResult = gradingResultRepository.save(gradingResult);
        submissionRepository.save(submission);

        log.info("Manual grading completed for submission ID: {} with final score: {}", 
            submission.getId(), finalScore);

        return gradingResultMapper.toDto(savedResult);
    }

    @Override
    @Transactional
    public GradingResultDTO finalizeGrade(Submission submission) {
        GradingResult gradingResult = gradingResultRepository.findLatestBySubmissionId(submission.getId())
            .orElseThrow(() -> new RuntimeException("No grading result found for submission"));

        Double finalScore = calculateFinalScore(gradingResult, submission.getGradingMode());
        gradingResult.setFinalScore(finalScore);
        gradingResult.setStatus(GradingStatus.COMPLETE);

        submission.setFinalScore(finalScore);

        GradingResult savedResult = gradingResultRepository.save(gradingResult);
        submissionRepository.save(submission);

        return gradingResultMapper.toDto(savedResult);
    }

    @Override
    public boolean canAutoGrade(Assignment assignment) {
        return assignment.supportsAutoGrading() && assignment.hasAutoGradableQuestions();
    }

    @Override
    public boolean canAutoGrade(Quiz quiz) {
        return quiz.supportsAutoGrading();
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradingResultDTO> getGradingResultsBySubmission(Long submissionId) {
        return gradingResultRepository.findBySubmissionId(submissionId).stream()
            .map(gradingResultMapper::toDto)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradingResultDTO> getGradingResultsByQuizSubmission(Long quizSubmissionId) {
        return gradingResultRepository.findByQuizSubmissionId(quizSubmissionId).stream()
            .map(gradingResultMapper::toDto)
            .toList();
    }

    @Override
    @Transactional
    public GradingResultDTO realTimeAutoGrade(Submission submission) {
        return autoGradeSubmission(submission);
    }

    @Override
    @Transactional
    public GradingResultDTO reGradeSubmission(Long submissionId, User assessor) {
        Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new RuntimeException("Submission not found"));

        if (submission.canBeAutoGraded()) {
            autoGradeSubmission(submission);
        }

        return gradingResultRepository.findLatestBySubmissionId(submissionId)
            .map(gradingResultMapper::toDto)
            .orElseThrow(() -> new RuntimeException("No grading result found"));
    }

    private double gradeQuestionResponse(AssignmentQuestion question, AssignmentResponse response) {
        switch (question.getType()) {
            case MULTIPLE_CHOICE:
            case TRUE_FALSE:
                if (response.getSelectedOption() != null && response.getSelectedOption().isCorrect()) {
                    response.setIsCorrect(true);
                    return question.getPoints().doubleValue();
                } else {
                    response.setIsCorrect(false);
                    return 0.0;
                }
            case SHORT_ANSWER:
                if (question.getCorrectAnswer() != null && 
                    question.getCorrectAnswer().trim().equalsIgnoreCase(response.getResponseText().trim())) {
                    response.setIsCorrect(true);
                    return question.getPoints().doubleValue();
                } else {
                    response.setIsCorrect(false);
                    return 0.0;
                }
            default:
                return 0.0;
        }
    }

    private Double calculateFinalScore(GradingResult gradingResult, GradingMode gradingMode) {
        switch (gradingMode) {
            case AUTO_ONLY:
                return gradingResult.getAutoScore();
            case MANUAL_ONLY:
                return gradingResult.getManualScore();
            case HYBRID:
                Double autoScore = gradingResult.getAutoScore() != null ? gradingResult.getAutoScore() : 0.0;
                Double manualScore = gradingResult.getManualScore() != null ? gradingResult.getManualScore() : 0.0;
                return autoScore + manualScore;
            default:
                return 0.0;
        }
    }

    @Override
    protected Long extractSchoolId(GradingResult entity) {
        // Grading results can be for submissions or quiz submissions - extract from either
        if (entity.getSubmission() != null && entity.getSubmission().getCourse() != null && entity.getSubmission().getCourse().getClassEntity() != null && entity.getSubmission().getCourse().getClassEntity().getSchool() != null) {
            return entity.getSubmission().getCourse().getClassEntity().getSchool().getId();
        }
        if (entity.getQuizSubmission() != null && entity.getQuizSubmission().getQuiz() != null && entity.getQuizSubmission().getQuiz().getCourse() != null && entity.getQuizSubmission().getQuiz().getCourse().getClassEntity() != null && entity.getQuizSubmission().getQuiz().getCourse().getClassEntity().getSchool() != null) {
            return entity.getQuizSubmission().getQuiz().getCourse().getClassEntity().getSchool().getId();
        }
        return null;
    }
    
    @Override
    protected Long extractRegionId(GradingResult entity) {
        // Grading results can be for submissions or quiz submissions - extract from either
        if (entity.getSubmission() != null && entity.getSubmission().getCourse() != null && entity.getSubmission().getCourse().getClassEntity() != null && entity.getSubmission().getCourse().getClassEntity().getSchool() != null && entity.getSubmission().getCourse().getClassEntity().getSchool().getRegion() != null) {
            return entity.getSubmission().getCourse().getClassEntity().getSchool().getRegion().getId();
        }
        if (entity.getQuizSubmission() != null && entity.getQuizSubmission().getQuiz() != null && entity.getQuizSubmission().getQuiz().getCourse() != null && entity.getQuizSubmission().getQuiz().getCourse().getClassEntity() != null && entity.getQuizSubmission().getQuiz().getCourse().getClassEntity().getSchool() != null && entity.getQuizSubmission().getQuiz().getCourse().getClassEntity().getSchool().getRegion() != null) {
            return entity.getQuizSubmission().getQuiz().getCourse().getClassEntity().getSchool().getRegion().getId();
        }
        return null;
    }
} 
package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.GradingResultDTO;
import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.entity.Quiz;
import com.ohma.thutothebe.entity.Submission;
import com.ohma.thutothebe.entity.QuizSubmission;
import com.ohma.thutothebe.entity.User;

import java.util.List;

/**
 * Service interface for handling both automatic and manual grading
 */
public interface GradingService extends BaseService<GradingResultDTO, Long> {

    /**
     * Automatically grades a submission based on assignment questions
     * @param submission the submission to grade
     * @return the grading result
     */
    GradingResultDTO autoGradeSubmission(Submission submission);

    /**
     * Automatically grades a quiz submission
     * @param quizSubmission the quiz submission to grade
     * @return the grading result
     */
    GradingResultDTO autoGradeQuizSubmission(QuizSubmission quizSubmission);

    /**
     * Manually grades a submission
     * @param submission the submission to grade
     * @param assessor the user performing the assessment
     * @param score the manual score
     * @param feedback the manual feedback
     * @return the grading result
     */
    GradingResultDTO manualGradeSubmission(Submission submission, User assessor, Double score, String feedback);

    /**
     * Finalizes the grade for a submission (combines auto and manual scores if applicable)
     * @param submission the submission to finalize
     * @return the final grading result
     */
    GradingResultDTO finalizeGrade(Submission submission);

    /**
     * Checks if an assignment can be auto-graded
     * @param assignment the assignment to check
     * @return true if auto-grading is possible
     */
    boolean canAutoGrade(Assignment assignment);

    /**
     * Checks if a quiz can be auto-graded
     * @param quiz the quiz to check
     * @return true if auto-grading is possible
     */
    boolean canAutoGrade(Quiz quiz);

    /**
     * Gets all grading results for a submission
     * @param submissionId the submission ID
     * @return list of grading results
     */
    List<GradingResultDTO> getGradingResultsBySubmission(Long submissionId);

    /**
     * Gets all grading results for a quiz submission
     * @param quizSubmissionId the quiz submission ID
     * @return list of grading results
     */
    List<GradingResultDTO> getGradingResultsByQuizSubmission(Long quizSubmissionId);

    /**
     * Triggers real-time auto-grading for immediate feedback
     * @param submission the submission to grade in real-time
     * @return the immediate grading result
     */
    GradingResultDTO realTimeAutoGrade(Submission submission);

    /**
     * Re-grades a submission (useful for updated rubrics or corrections)
     * @param submissionId the submission ID to re-grade
     * @param assessor the user performing the re-grading
     * @return the updated grading result
     */
    GradingResultDTO reGradeSubmission(Long submissionId, User assessor);
} 
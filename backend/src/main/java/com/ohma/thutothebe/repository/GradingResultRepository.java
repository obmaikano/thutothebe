package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.GradingResult;
import com.ohma.thutothebe.entity.enums.GradingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradingResultRepository extends JpaRepository<GradingResult, Long> {

    /**
     * Find grading results by submission ID
     */
    @Query("SELECT gr FROM GradingResult gr WHERE gr.submission.id = :submissionId")
    List<GradingResult> findBySubmissionId(@Param("submissionId") Long submissionId);

    /**
     * Find grading results by quiz submission ID
     */
    @Query("SELECT gr FROM GradingResult gr WHERE gr.quizSubmission.id = :quizSubmissionId")
    List<GradingResult> findByQuizSubmissionId(@Param("quizSubmissionId") Long quizSubmissionId);

    /**
     * Find the latest grading result for a submission
     */
    @Query("SELECT gr FROM GradingResult gr WHERE gr.submission.id = :submissionId ORDER BY gr.createdAt DESC")
    Optional<GradingResult> findLatestBySubmissionId(@Param("submissionId") Long submissionId);

    /**
     * Find the latest grading result for a quiz submission
     */
    @Query("SELECT gr FROM GradingResult gr WHERE gr.quizSubmission.id = :quizSubmissionId ORDER BY gr.createdAt DESC")
    Optional<GradingResult> findLatestByQuizSubmissionId(@Param("quizSubmissionId") Long quizSubmissionId);

    /**
     * Find grading results by status
     */
    List<GradingResult> findByStatus(GradingStatus status);

    /**
     * Find grading results that require manual review
     */
    @Query("SELECT gr FROM GradingResult gr WHERE gr.requiresManualReview = true AND gr.status = :status")
    List<GradingResult> findRequiringManualReview(@Param("status") GradingStatus status);

    /**
     * Find grading results by grader
     */
    @Query("SELECT gr FROM GradingResult gr WHERE gr.gradedBy.id = :graderId")
    List<GradingResult> findByGraderId(@Param("graderId") Long graderId);

    /**
     * Count pending grading results for a course
     */
    @Query("SELECT COUNT(gr) FROM GradingResult gr WHERE gr.submission.course.id = :courseId AND gr.status = 'PENDING'")
    Long countPendingByCourseId(@Param("courseId") Long courseId);
} 
package com.ohma.thutothebe.integration;

import com.ohma.thutothebe.dto.AssignmentDTO;
import com.ohma.thutothebe.dto.SubmissionDTO;
import com.ohma.thutothebe.entity.AssignmentStatus;
import com.ohma.thutothebe.entity.SubmissionStatus;
import com.ohma.thutothebe.service.AssignmentService;
import com.ohma.thutothebe.service.SubmissionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AssignmentSubmissionIntegrationTest {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private SubmissionService submissionService;

    @Test
    void testCompleteAssignmentSubmissionWorkflow() {
        // Create an assignment
        AssignmentDTO assignmentDTO = new AssignmentDTO(
            null, "Integration Test Assignment", "Test Description", "Instructions",
            "TEST001", 1L, 1L, 1L, LocalDateTime.now().plusDays(7), LocalDateTime.now(),
            100.0, 1.0, true, 10.0, 3, false, 1, null, null, 1000L, 1L,
            "POINTS", false, true, true, false, AssignmentStatus.DRAFT, null,
            60, null, null, 0, 0, null, true, LocalDateTime.now(), LocalDateTime.now()
        );

        AssignmentDTO createdAssignment = assignmentService.create(assignmentDTO);
        assertThat(createdAssignment).isNotNull();
        assertThat(createdAssignment.id()).isNotNull();
        assertThat(createdAssignment.status()).isEqualTo(AssignmentStatus.DRAFT);

        // Publish the assignment
        AssignmentDTO publishedAssignment = assignmentService.publishAssignment(createdAssignment.id());
        assertThat(publishedAssignment.status()).isEqualTo(AssignmentStatus.PUBLISHED);

        // Create a submission for the assignment
        SubmissionDTO submissionDTO = new SubmissionDTO(
            null,                                  // id
            1L,                                    // studentId
            1L,                                    // courseId
            createdAssignment.id(),                // assignmentId
            "Student submission content",          // content
            LocalDateTime.now(),                   // submittedAt
            null,                                  // phase
            SubmissionStatus.SUBMITTED,            // status
            null,                                  // assessments
            null,                                  // finalScore
            null,                                  // feedback
            LocalDateTime.now(),                   // createdAt
            LocalDateTime.now(),                   // updatedAt
            null,                                  // score
            100.0,                                 // maxScore
            null,                                  // percentage
            null,                                  // grade
            "Student comments",                    // comments
            null,                                  // filePaths
            null,                                  // gradedAt
            null,                                  // gradedBy
            1,                                     // attemptNumber
            false,                                 // isLateSubmission
            false,                                 // needsReview
            null,                                  // originalFileName
            null,                                  // fileSize
            false,                                 // autoGraded
            true,                                  // manuallyGraded
            null,                                  // reviewedAt
            null,                                  // reviewedBy
            null,                                  // studentComments
            null,                                  // rubricScores
            1,                                     // timeSpent
            true                                   // plagiarismChecked
        );

        SubmissionDTO createdSubmission = submissionService.create(submissionDTO);
        assertThat(createdSubmission).isNotNull();
        assertThat(createdSubmission.id()).isNotNull();

        // Grade the submission
        SubmissionDTO gradedSubmission = submissionService.gradeSubmissionWithDetails(
            createdSubmission.id(), 85.0, 85.0, "B", "Good work", "Rubric: 85/100"
        );
        assertThat(gradedSubmission.score()).isEqualTo(85.0);
        assertThat(gradedSubmission.status()).isEqualTo(SubmissionStatus.GRADED);

        // Mark submission as reviewed
        SubmissionDTO reviewedSubmission = submissionService.markSubmissionReviewed(
            createdSubmission.id(), 1L
        );
        assertThat(reviewedSubmission.needsReview()).isFalse();

        // Close the assignment
        AssignmentDTO closedAssignment = assignmentService.closeAssignment(createdAssignment.id());
        assertThat(closedAssignment.status()).isEqualTo(AssignmentStatus.CLOSED);

        // Archive the assignment
        AssignmentDTO archivedAssignment = assignmentService.archiveAssignment(createdAssignment.id());
        assertThat(archivedAssignment.status()).isEqualTo(AssignmentStatus.ARCHIVED);
        assertThat(archivedAssignment.active()).isFalse();

        // Verify assignment statistics
        assignmentService.updateAssignmentStatistics(createdAssignment.id());
        AssignmentDTO updatedAssignment = assignmentService.getById(createdAssignment.id());
        assertThat(updatedAssignment.submissionCount()).isGreaterThan(0);
        assertThat(updatedAssignment.gradedCount()).isGreaterThan(0);
    }

    @Test
    void testBulkSubmissionOperations() {
        // Create multiple submissions (this would typically be done in setup)
        // For this test, we'll assume submissions exist and test bulk operations
        
        // Test bulk grading
        List<Long> submissionIds = List.of(1L, 2L, 3L);
        List<SubmissionDTO> gradedSubmissions = submissionService.gradeMultipleSubmissions(
            submissionIds, 80.0, "Bulk grading feedback"
        );
        
        assertThat(gradedSubmissions).isNotEmpty();
        gradedSubmissions.forEach(submission -> {
            assertThat(submission.score()).isEqualTo(80.0);
            assertThat(submission.feedback()).isEqualTo("Bulk grading feedback");
        });

        // Test bulk return
        List<SubmissionDTO> returnedSubmissions = submissionService.returnMultipleSubmissions(
            submissionIds, "Please revise and resubmit"
        );
        
        assertThat(returnedSubmissions).isNotEmpty();
        returnedSubmissions.forEach(submission -> {
            assertThat(submission.status()).isEqualTo(SubmissionStatus.RETURNED);
            assertThat(submission.feedback()).isEqualTo("Please revise and resubmit");
        });
    }

    @Test
    void testAssignmentStatusQueries() {
        // Test getting assignments by status
        List<AssignmentDTO> publishedAssignments = assignmentService.getAssignmentsByStatus("PUBLISHED");
        assertThat(publishedAssignments).isNotNull();

        List<AssignmentDTO> draftAssignments = assignmentService.getAssignmentsByStatus("DRAFT");
        assertThat(draftAssignments).isNotNull();

        // Test getting assignments by course and status
        List<AssignmentDTO> coursePublishedAssignments = assignmentService.getAssignmentsByCourseAndStatus(1L, "PUBLISHED");
        assertThat(coursePublishedAssignments).isNotNull();
    }

    @Test
    void testSubmissionReviewWorkflow() {
        // Test getting submissions needing review
        List<SubmissionDTO> needingReview = submissionService.getSubmissionsNeedingReviewByTeacher(1L);
        assertThat(needingReview).isNotNull();

        // Test getting late submissions
        List<SubmissionDTO> lateSubmissions = submissionService.getLateSubmissionsByCourse(1L);
        assertThat(lateSubmissions).isNotNull();

        // Test getting submissions by course
        List<SubmissionDTO> courseSubmissions = submissionService.getSubmissionsByCourse(1L);
        assertThat(courseSubmissions).isNotNull();
    }
} 
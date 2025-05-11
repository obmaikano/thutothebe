package com.ohma.thutothebe.exception;

public class SubmissionNotFoundException extends ResourceNotFoundException {
    
    public SubmissionNotFoundException(String message) {
        super(message);
    }

    public static SubmissionNotFoundException withId(Long id) {
        return new SubmissionNotFoundException("Submission not found with id: " + id);
    }

    public static SubmissionNotFoundException withAssignmentAndStudent(Long assignmentId, Long studentId) {
        return new SubmissionNotFoundException(
            String.format("Submission not found for assignment %d and student %d", assignmentId, studentId)
        );
    }
} 
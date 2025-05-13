package com.ohma.thutothebe.exception;

public class ProgressNotFoundException extends RuntimeException {
    
    private ProgressNotFoundException(String message) {
        super(message);
    }
    
    public static ProgressNotFoundException withId(Long id) {
        return new ProgressNotFoundException("Progress not found with id: " + id);
    }
    
    public static ProgressNotFoundException withStudentAndCourse(Long studentId, Long courseId) {
        return new ProgressNotFoundException(
            String.format("Progress not found for student %d in course %d", studentId, courseId)
        );
    }
} 
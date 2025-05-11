package com.ohma.thutothebe.exception;

public class AssignmentNotFoundException extends ResourceNotFoundException {
    
    public AssignmentNotFoundException(String message) {
        super(message);
    }

    public static AssignmentNotFoundException withId(Long id) {
        return new AssignmentNotFoundException("Assignment not found with id: " + id);
    }

    public static AssignmentNotFoundException withCode(String code) {
        return new AssignmentNotFoundException("Assignment not found with code: " + code);
    }
} 
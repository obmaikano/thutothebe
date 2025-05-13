package com.ohma.thutothebe.exception;

public class GradeCategoryNotFoundException extends RuntimeException {
    
    private GradeCategoryNotFoundException(String message) {
        super(message);
    }
    
    public static GradeCategoryNotFoundException withId(Long id) {
        return new GradeCategoryNotFoundException("Grade category not found with id: " + id);
    }
} 
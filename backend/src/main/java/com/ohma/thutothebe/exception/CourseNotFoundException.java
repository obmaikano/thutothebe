package com.ohma.thutothebe.exception;

public class CourseNotFoundException extends ResourceNotFoundException {
    
    public CourseNotFoundException(String message) {
        super(message);
    }

    public static CourseNotFoundException withId(Long id) {
        return new CourseNotFoundException("Course not found with id: " + id);
    }

    public static CourseNotFoundException withCode(String code) {
        return new CourseNotFoundException("Course not found with code: " + code);
    }
} 
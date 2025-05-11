package com.ohma.thutothebe.exception;

public class ContentNotFoundException extends RuntimeException {
    private ContentNotFoundException(String message) {
        super(message);
    }

    public static ContentNotFoundException withId(Long id) {
        return new ContentNotFoundException("Content not found with id: " + id);
    }
} 
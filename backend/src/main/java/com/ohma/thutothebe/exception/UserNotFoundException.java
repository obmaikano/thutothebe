package com.ohma.thutothebe.exception;

public class UserNotFoundException extends ResourceNotFoundException {
    public UserNotFoundException(String message) {
        super(message);
    }

    public static UserNotFoundException withId(Long id) {
        return new UserNotFoundException("User not found with id: " + id);
    }

    public static UserNotFoundException withEmail(String email) {
        return new UserNotFoundException("User not found with email: " + email);
    }
} 
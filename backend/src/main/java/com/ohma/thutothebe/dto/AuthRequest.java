package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthRequest(
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,
    
    @NotBlank(message = "Password is required")
    String password
) {
    public AuthRequest {
        if (email != null) email = email.trim();
    }
} 
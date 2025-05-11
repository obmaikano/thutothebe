package com.ohma.thutothebe.dto;

public record AuthResponse(
    String token,
    UserDTO user
) {} 
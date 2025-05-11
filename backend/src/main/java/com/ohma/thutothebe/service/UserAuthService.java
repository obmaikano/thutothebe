package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.AuthRequest;
import com.ohma.thutothebe.dto.AuthResponse;
import com.ohma.thutothebe.dto.UserDTO;

public interface UserAuthService {
    AuthResponse authenticate(AuthRequest request);
    boolean validatePassword(UserDTO user, String oldPassword);
} 
package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AuthRequest;
import com.ohma.thutothebe.dto.AuthResponse;
import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.service.UserAuthService;
import com.ohma.thutothebe.service.UserService;
import com.ohma.thutothebe.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserAuthServiceImpl implements UserAuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse authenticate(AuthRequest request) {
        UserDTO user = userService.getUserByEmail(request.email());
        
        if (!validatePassword(user, request.password())) {
            throw new IllegalArgumentException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user);
    }

    @Override
    public boolean validatePassword(UserDTO user, String password) {
        if (user == null || password == null) {
            throw new IllegalArgumentException("User and password cannot be null");
        }
        return passwordEncoder.matches(password, user.getPassword());
    }
} 
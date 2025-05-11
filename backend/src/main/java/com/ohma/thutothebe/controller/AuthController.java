package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.AuthRequest;
import com.ohma.thutothebe.dto.AuthResponse;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.dto.PasswordChangeRequest;
import com.ohma.thutothebe.service.UserService;
import com.ohma.thutothebe.service.UserAuthService;
import com.ohma.thutothebe.util.JwtUtil;
import com.ohma.thutothebe.util.LoggingUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserAuthService userAuthService;
    private final JwtUtil jwtUtil;
    private final Logger logger = LoggingUtil.getLogger(AuthController.class);

    @PostMapping("/register")
    public ResponseEntity<OhmaApiResponse<UserDTO>> register(@Valid @RequestBody UserDTO userDTO) {
        try {
            LoggingUtil.logInfo(logger, "Attempting to register user with email: {}", userDTO.email());
            UserDTO created = userService.create(userDTO);
            LoggingUtil.logInfo(logger, "Successfully registered user with email: {}", userDTO.email());
            return ResponseEntity.ok(OhmaApiResponse.success(created));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Registration error for email: {}", e, userDTO.email());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<OhmaApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        try {
            LoggingUtil.logInfo(logger, "Login attempt for user: {}", request.email());
            AuthResponse response = userAuthService.authenticate(request);
            LoggingUtil.logInfo(logger, "Successful login for user: {}", request.email());
            return ResponseEntity.ok(OhmaApiResponse.success(response));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Login error for user: {}", e, request.email());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(OhmaApiResponse.error(401, "Invalid credentials"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<OhmaApiResponse<UserDTO>> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            UserDTO user = userService.getUserByEmail(username);
            return ResponseEntity.ok(OhmaApiResponse.success(user));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error fetching current user: {}", e, e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(OhmaApiResponse.error(401, "Invalid token"));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<OhmaApiResponse<Void>> changePassword(@RequestHeader("Authorization") String token, @Valid @RequestBody PasswordChangeRequest request) {
        try {
            String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            UserDTO user = userService.getUserByEmail(username);
            if (!userAuthService.validatePassword(user, request.oldPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(OhmaApiResponse.error(400, "Invalid old password"));
            }
            userService.updatePassword(user.id(), request.newPassword());
            return ResponseEntity.ok(OhmaApiResponse.success(null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error changing password: {}", e, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }
} 
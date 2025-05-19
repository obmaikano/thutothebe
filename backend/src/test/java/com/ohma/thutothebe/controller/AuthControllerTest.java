package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.AuthRequest;
import com.ohma.thutothebe.dto.AuthResponse;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.dto.PasswordChangeRequest;
import com.ohma.thutothebe.service.UserService;
import com.ohma.thutothebe.service.UserAuthService;
import com.ohma.thutothebe.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private UserAuthService userAuthService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthController authController;

    private UserDTO userDTO;
    private AuthRequest authRequest;
    private AuthResponse authResponse;
    private PasswordChangeRequest passwordChangeRequest;

    @BeforeEach
    void setUp() {
        userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setEmail("john@example.com");
        userDTO.setFirstName("John");
        userDTO.setLastName("Doe");
        userDTO.setPassword("password");
        authRequest = new AuthRequest("john@example.com", "password");
        authResponse = new AuthResponse("jwt-token", userDTO);
        passwordChangeRequest = new PasswordChangeRequest("oldPassword", "newPassword");
    }

    @Test
    void register_ValidUser_ReturnsCreatedUser() {
        when(userService.create(any(UserDTO.class))).thenReturn(userDTO);

        ResponseEntity<OhmaApiResponse<UserDTO>> response = authController.register(userDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(userDTO, response.getBody().getData());
    }

    @Test
    void login_ValidCredentials_ReturnsAuthResponse() {
        when(userAuthService.authenticate(authRequest)).thenReturn(authResponse);

        ResponseEntity<OhmaApiResponse<AuthResponse>> response = authController.login(authRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(authResponse, response.getBody().getData());
    }

    @Test
    void getCurrentUser_ValidToken_ReturnsUser() {
        when(jwtUtil.getUsernameFromToken("jwt-token")).thenReturn("john@example.com");
        when(userService.getUserByEmail("john@example.com")).thenReturn(userDTO);

        ResponseEntity<OhmaApiResponse<UserDTO>> response = authController.getCurrentUser("Bearer jwt-token");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(userDTO, response.getBody().getData());
    }

    @Test
    void changePassword_ValidOldPassword_ReturnsSuccess() {
        when(jwtUtil.getUsernameFromToken("jwt-token")).thenReturn("john@example.com");
        when(userService.getUserByEmail("john@example.com")).thenReturn(userDTO);
        when(userAuthService.validatePassword(userDTO, passwordChangeRequest.oldPassword())).thenReturn(true);

        ResponseEntity<OhmaApiResponse<Void>> response = authController.changePassword("Bearer jwt-token", passwordChangeRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void changePassword_InvalidOldPassword_ReturnsBadRequest() {
        when(jwtUtil.getUsernameFromToken("jwt-token")).thenReturn("john@example.com");
        when(userService.getUserByEmail("john@example.com")).thenReturn(userDTO);
        when(userAuthService.validatePassword(userDTO, passwordChangeRequest.oldPassword())).thenReturn(false);

        ResponseEntity<OhmaApiResponse<Void>> response = authController.changePassword("Bearer jwt-token", passwordChangeRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
    }
} 
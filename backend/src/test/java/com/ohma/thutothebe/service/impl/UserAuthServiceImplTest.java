package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AuthRequest;
import com.ohma.thutothebe.dto.AuthResponse;
import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.service.UserService;
import com.ohma.thutothebe.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserAuthServiceImplTest {

    @Mock
    private UserService userService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserAuthServiceImpl userAuthService;

    private UserDTO userDTO;
    private AuthRequest authRequest;
    private static final String TEST_TOKEN = "test.jwt.token";

    @BeforeEach
    void setUp() {
        userDTO = new UserDTO(1L, "John", "Doe", "john@example.com", "encodedPassword", null);
        authRequest = new AuthRequest("john@example.com", "password");
    }

    @Test
    void authenticate_ValidCredentials_ReturnsAuthResponse() {
        when(userService.getUserByEmail(authRequest.email())).thenReturn(userDTO);
        when(passwordEncoder.matches(authRequest.password(), userDTO.password())).thenReturn(true);
        when(jwtUtil.generateToken(userDTO.email())).thenReturn(TEST_TOKEN);

        AuthResponse response = userAuthService.authenticate(authRequest);

        assertNotNull(response);
        assertEquals(TEST_TOKEN, response.token());
        assertEquals(userDTO, response.user());
    }

    @Test
    void authenticate_InvalidPassword_ThrowsIllegalArgumentException() {
        when(userService.getUserByEmail(authRequest.email())).thenReturn(userDTO);
        when(passwordEncoder.matches(authRequest.password(), userDTO.password())).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> userAuthService.authenticate(authRequest));
    }

    @Test
    void authenticate_UserNotFound_ThrowsIllegalArgumentException() {
        when(userService.getUserByEmail(authRequest.email())).thenReturn(null);

        assertThrows(IllegalArgumentException.class, () -> userAuthService.authenticate(authRequest));
    }

    @Test
    void validatePassword_ValidPassword_ReturnsTrue() {
        when(passwordEncoder.matches(any(), any())).thenReturn(true);

        assertTrue(userAuthService.validatePassword(userDTO, "validPassword"));
    }

    @Test
    void validatePassword_InvalidPassword_ReturnsFalse() {
        when(passwordEncoder.matches(any(), any())).thenReturn(false);

        assertFalse(userAuthService.validatePassword(userDTO, "invalidPassword"));
    }

    @Test
    void validatePassword_NullUser_ThrowsIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, 
            () -> userAuthService.validatePassword(null, "password"));
    }

    @Test
    void validatePassword_NullPassword_ThrowsIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, 
            () -> userAuthService.validatePassword(userDTO, null));
    }
} 
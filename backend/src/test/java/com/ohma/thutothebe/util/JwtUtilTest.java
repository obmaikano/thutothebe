package com.ohma.thutothebe.util;

import com.ohma.thutothebe.config.JwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilTest {

    private JwtUtil jwtUtil;
    private JwtConfig jwtConfig;
    // 64 bytes (512 bits) for HS512
    private static final String SECURE_TEST_SECRET = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    private static final long TEST_EXPIRATION = 3600000; // 1 hour in milliseconds
    private static final String TEST_USERNAME = "testuser@example.com";
    private String secretKey = "testSecretKey1234567890123456789012345678901234567890";
    private String invalidSecretKey = "invalidSecretKey1234567890123456789012345678901234567890";

    @BeforeEach
    void setUp() {
        jwtConfig = new JwtConfig();
        jwtConfig.setSecret(SECURE_TEST_SECRET);
        jwtConfig.setExpiration(TEST_EXPIRATION);
        jwtUtil = new JwtUtil(jwtConfig);
    }

    @Test
    void generateToken_ShouldCreateValidToken() {
        String token = jwtUtil.generateToken(TEST_USERNAME);

        assertNotNull(token);
        assertTrue(jwtUtil.validateToken(token));
        assertEquals(TEST_USERNAME, jwtUtil.getUsernameFromToken(token));
    }

    @Test
    void getUsernameFromToken_ShouldReturnUsername() {
        String token = jwtUtil.generateToken(TEST_USERNAME);

        String extractedUsername = jwtUtil.getUsernameFromToken(token);
        assertEquals(TEST_USERNAME, extractedUsername);
    }

    @Test
    void validateToken_ValidToken_ShouldReturnTrue() {
        String token = jwtUtil.generateToken(TEST_USERNAME);
        assertTrue(jwtUtil.validateToken(token));
    }

    @Test
    void validateToken_InvalidSignature_ThrowsSignatureException() {
        // Create a token with a different secure secret key (64 bytes)
        JwtConfig otherConfig = new JwtConfig();
        otherConfig.setSecret("fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210");
        otherConfig.setExpiration(TEST_EXPIRATION);
        JwtUtil otherJwtUtil = new JwtUtil(otherConfig);
        String token = otherJwtUtil.generateToken(TEST_USERNAME);

        // Try to validate with the original secret key
        assertThrows(SignatureException.class, () -> jwtUtil.validateToken(token));
    }

    @Test
    void getClaimsFromToken_ShouldReturnClaims() {
        String token = jwtUtil.generateToken(TEST_USERNAME);

        Claims claims = jwtUtil.getClaimsFromToken(token);
        assertNotNull(claims);
        assertEquals(TEST_USERNAME, claims.getSubject());
    }

    @Test
    void validateToken_InvalidToken_ReturnsFalse() {
        assertThrows(Exception.class, () -> jwtUtil.validateToken("invalid.token.here"));
    }

    @Test
    void validateToken_ExpiredToken_ThrowsExpiredJwtException() {
        JwtConfig shortConfig = new JwtConfig();
        shortConfig.setSecret(SECURE_TEST_SECRET);
        shortConfig.setExpiration(1L);
        JwtUtil shortJwtUtil = new JwtUtil(shortConfig);
        String token = shortJwtUtil.generateToken(TEST_USERNAME);

        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        assertThrows(ExpiredJwtException.class, () -> shortJwtUtil.validateToken(token));
    }

    @Test
    void validateToken_MalformedToken_ThrowsMalformedJwtException() {
        assertThrows(MalformedJwtException.class, () -> jwtUtil.validateToken("malformed.token"));
    }
} 
package com.ohma.thutothebe.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public JwtAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                        AuthenticationException authException) throws IOException, ServletException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        OhmaApiResponse<?> body = new OhmaApiResponse<>(
            "ERROR",
            "Unauthorized: " + authException.getMessage(),
            null,
            LocalDateTime.now()
        );

        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
} 
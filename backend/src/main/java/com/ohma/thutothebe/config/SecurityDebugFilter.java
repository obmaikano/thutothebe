package com.ohma.thutothebe.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityDebugFilter extends OncePerRequestFilter {
    
    private static final Logger logger = LoggerFactory.getLogger(SecurityDebugFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        logger.debug("Request URI: {}", request.getRequestURI());
        logger.debug("Request Method: {}", request.getMethod());
        logger.debug("Request Headers: {}", request.getHeaderNames());
        logger.debug("Authorization Header: {}", request.getHeader("Authorization"));
        
        filterChain.doFilter(request, response);
        
        logger.debug("Response Status: {}", response.getStatus());
    }
} 
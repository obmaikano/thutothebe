package com.ohma.thutothebe.util;

import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AuthUtils {

    @Autowired
    private UserRepository userRepository;

    /**
     * Get current user ID from security context
     * @return Current user ID or null if not authenticated
     */
    public Long getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                return null;
            }

            Object principal = authentication.getPrincipal();
            
            if (principal instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal;
                String email = userDetails.getUsername();
                
                User user = userRepository.findByEmail(email).orElse(null);
                return user != null ? user.getId() : null;
            }
            
            return null;
        } catch (Exception e) {
            log.error("Error getting current user ID", e);
            return null;
        }
    }

    /**
     * Get current user from security context
     * @return Current user or null if not authenticated
     */
    public User getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                return null;
            }

            Object principal = authentication.getPrincipal();
            
            if (principal instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal;
                String email = userDetails.getUsername();
                
                return userRepository.findByEmail(email).orElse(null);
            }
            
            return null;
        } catch (Exception e) {
            log.error("Error getting current user", e);
            return null;
        }
    }

    /**
     * Get current user email from security context
     * @return Current user email or null if not authenticated
     */
    public String getCurrentUserEmail() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                return null;
            }

            Object principal = authentication.getPrincipal();
            
            if (principal instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal;
                return userDetails.getUsername();
            }
            
            return null;
        } catch (Exception e) {
            log.error("Error getting current user email", e);
            return null;
        }
    }

    /**
     * Check if current user is authenticated
     * @return true if authenticated, false otherwise
     */
    public boolean isAuthenticated() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            return authentication != null && authentication.isAuthenticated() 
                && !(authentication.getPrincipal() instanceof String); // Not "anonymousUser"
        } catch (Exception e) {
            log.error("Error checking authentication status", e);
            return false;
        }
    }
} 
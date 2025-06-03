package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.impl.RuleBasedConfigurationServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/rule-based-config")
public class RuleBasedConfigurationController {

    @Autowired
    private RuleBasedConfigurationServiceImpl configurationService;

    /**
     * Get configuration value for user (with automatic hierarchy resolution)
     */
    @GetMapping("/get")
    public ResponseEntity<OhmaApiResponse<String>> getConfiguration(
            @RequestParam String configKey,
            @RequestParam Long userId) {
        try {
            String value = configurationService.getConfigurationValue(configKey, userId);
            return ResponseEntity.ok(OhmaApiResponse.success(value));
        } catch (Exception e) {
            log.error("Error getting configuration: key={}, user={}", configKey, userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to get configuration: " + e.getMessage()));
        }
    }

    /**
     * Get configuration value as integer with default
     */
    @GetMapping("/get-int")
    public ResponseEntity<OhmaApiResponse<Integer>> getIntegerConfiguration(
            @RequestParam String configKey,
            @RequestParam Long userId,
            @RequestParam(required = false) Integer defaultValue) {
        try {
            Integer value = configurationService.getIntegerConfiguration(configKey, userId, defaultValue);
            return ResponseEntity.ok(OhmaApiResponse.success(value));
        } catch (Exception e) {
            log.error("Error getting integer configuration: key={}, user={}", configKey, userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to get integer configuration: " + e.getMessage()));
        }
    }

    /**
     * Get configuration value as boolean with default
     */
    @GetMapping("/get-bool")
    public ResponseEntity<OhmaApiResponse<Boolean>> getBooleanConfiguration(
            @RequestParam String configKey,
            @RequestParam Long userId,
            @RequestParam(required = false) Boolean defaultValue) {
        try {
            Boolean value = configurationService.getBooleanConfiguration(configKey, userId, defaultValue);
            return ResponseEntity.ok(OhmaApiResponse.success(value));
        } catch (Exception e) {
            log.error("Error getting boolean configuration: key={}, user={}", configKey, userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to get boolean configuration: " + e.getMessage()));
        }
    }

    /**
     * Set configuration value at specific scope
     */
    @PostMapping("/set")
    public ResponseEntity<OhmaApiResponse<Void>> setConfiguration(
            @RequestBody SetConfigurationRequest request) {
        try {
            configurationService.setConfiguration(
                request.configKey,
                request.configValue,
                request.scopeType,
                request.scopeId,
                request.userId
            );
            return ResponseEntity.ok(OhmaApiResponse.success(null));
        } catch (SecurityException e) {
            log.warn("Access denied setting configuration: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(OhmaApiResponse.error(403, e.getMessage()));
        } catch (Exception e) {
            log.error("Error setting configuration: {}", request, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to set configuration: " + e.getMessage()));
        }
    }

    /**
     * Get configuration value at specific scope (no hierarchy resolution)
     */
    @GetMapping("/get-direct")
    public ResponseEntity<OhmaApiResponse<String>> getDirectConfiguration(
            @RequestParam String configKey,
            @RequestParam AccessScope scopeType,
            @RequestParam(required = false) Long scopeId) {
        try {
            String value = configurationService.getDirectConfiguration(configKey, scopeType, scopeId);
            return ResponseEntity.ok(OhmaApiResponse.success(value));
        } catch (Exception e) {
            log.error("Error getting direct configuration: key={}, scope={}-{}", configKey, scopeType, scopeId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to get direct configuration: " + e.getMessage()));
        }
    }

    /**
     * Get all configurations accessible to user
     */
    @GetMapping("/user-configs/{userId}")
    public ResponseEntity<OhmaApiResponse<Map<String, String>>> getUserAccessibleConfigurations(
            @PathVariable Long userId) {
        try {
            Map<String, String> configurations = configurationService.getUserAccessibleConfigurations(userId);
            return ResponseEntity.ok(OhmaApiResponse.success(configurations));
        } catch (Exception e) {
            log.error("Error getting user configurations: user={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to get user configurations: " + e.getMessage()));
        }
    }

    /**
     * Get common configuration values for frontend
     */
    @GetMapping("/common/{userId}")
    public ResponseEntity<OhmaApiResponse<CommonConfigurationResponse>> getCommonConfigurations(
            @PathVariable Long userId) {
        try {
            CommonConfigurationResponse response = new CommonConfigurationResponse();
            
            // Get common settings that frontend typically needs
            response.maxClassSize = configurationService.getIntegerConfiguration("max_class_size", userId, 35);
            response.sessionTimeoutMinutes = configurationService.getIntegerConfiguration("session_timeout_minutes", userId, 30);
            response.allowParentMessaging = configurationService.getBooleanConfiguration("allow_parent_messaging", userId, true);
            response.defaultLanguage = configurationService.getConfigurationValue("default_language", userId);
            response.maintenanceMode = configurationService.getBooleanConfiguration("maintenance_mode", userId, false);
            
            return ResponseEntity.ok(OhmaApiResponse.success(response));
        } catch (Exception e) {
            log.error("Error getting common configurations: user={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to get common configurations: " + e.getMessage()));
        }
    }

    // Request DTOs
    public static class SetConfigurationRequest {
        public String configKey;
        public String configValue;
        public AccessScope scopeType;
        public Long scopeId;
        public Long userId;
    }

    // Response DTOs
    public static class CommonConfigurationResponse {
        public Integer maxClassSize;
        public Integer sessionTimeoutMinutes;
        public Boolean allowParentMessaging;
        public String defaultLanguage;
        public Boolean maintenanceMode;
    }
} 
package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.ClassRepository;
import com.ohma.thutothebe.repository.RegionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Rule-based configuration service that resolves configuration values
 * using hierarchical inheritance: USER -> CLASS -> SCHOOL -> REGION -> GLOBAL
 */
@Slf4j
@Service
public class RuleBasedConfigurationServiceImpl {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private RegionRepository regionRepository;

    // Simple in-memory configuration store (in real implementation would use database table)
    private final Map<String, String> configurations = new HashMap<>();

    public RuleBasedConfigurationServiceImpl() {
        // Initialize some default configurations
        initializeDefaultConfigurations();
    }

    /**
     * Get configuration value with automatic hierarchy resolution
     * Checks: USER -> CLASS -> SCHOOL -> REGION -> GLOBAL
     */
    @Cacheable(value = "configuration", key = "#configKey + '_' + #userId")
    public String getConfigurationValue(String configKey, Long userId) {
        log.debug("Getting configuration: {} for user: {}", configKey, userId);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // Try user-specific configuration first
        String value = getDirectConfiguration(configKey, AccessScope.USER, userId);
        if (value != null) {
            log.debug("Found user-specific config: {} = {}", configKey, value);
            return value;
        }

        // Try user's primary class (if student/teacher)
        if (user.getSchool() != null) {
            // For students/teachers, try class-level config
            // In real implementation would get user's primary class
            Long primaryClassId = getUserPrimaryClassId(userId);
            if (primaryClassId != null) {
                value = getDirectConfiguration(configKey, AccessScope.CLASS, primaryClassId);
                if (value != null) {
                    log.debug("Found class-level config: {} = {}", configKey, value);
                    return value;
                }
            }

            // Try school-level configuration
            value = getDirectConfiguration(configKey, AccessScope.SCHOOL, user.getSchool().getId());
            if (value != null) {
                log.debug("Found school-level config: {} = {}", configKey, value);
                return value;
            }

            // Try region-level configuration
            value = getDirectConfiguration(configKey, AccessScope.REGION, user.getSchool().getRegion().getId());
            if (value != null) {
                log.debug("Found region-level config: {} = {}", configKey, value);
                return value;
            }
        }

        // Finally try global configuration
        value = getDirectConfiguration(configKey, AccessScope.GLOBAL, null);
        if (value != null) {
            log.debug("Found global config: {} = {}", configKey, value);
            return value;
        }

        log.warn("No configuration found for key: {}", configKey);
        return null;
    }

    /**
     * Set configuration value at specific scope
     */
    public void setConfiguration(String configKey, String configValue, AccessScope scopeType, Long scopeId, Long userId) {
        log.info("Setting configuration: {} = {} at scope: {}-{} by user: {}", 
            configKey, configValue, scopeType, scopeId, userId);

        // Validate user has permission to set configuration at this scope
        if (!canSetConfigurationAtScope(userId, scopeType, scopeId)) {
            throw new SecurityException("User does not have permission to set configuration at this scope");
        }

        String configurationKey = buildConfigurationKey(configKey, scopeType, scopeId);
        configurations.put(configurationKey, configValue);
    }

    /**
     * Get configuration value at specific scope (no hierarchy resolution)
     */
    public String getDirectConfiguration(String configKey, AccessScope scopeType, Long scopeId) {
        String configurationKey = buildConfigurationKey(configKey, scopeType, scopeId);
        return configurations.get(configurationKey);
    }

    /**
     * Get all configurations accessible to user
     */
    public Map<String, String> getUserAccessibleConfigurations(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        Map<String, String> accessibleConfigs = new HashMap<>();

        // Get configurations from all scopes user has access to
        // Global configs (everyone can read)
        configurations.entrySet().stream()
            .filter(entry -> entry.getKey().startsWith("GLOBAL:"))
            .forEach(entry -> {
                String key = entry.getKey().substring("GLOBAL:".length());
                accessibleConfigs.put(key, entry.getValue());
            });

        // Add school-specific configs if user has school
        if (user.getSchool() != null) {
            String schoolPrefix = "SCHOOL:" + user.getSchool().getId() + ":";
            configurations.entrySet().stream()
                .filter(entry -> entry.getKey().startsWith(schoolPrefix))
                .forEach(entry -> {
                    String key = entry.getKey().substring(schoolPrefix.length());
                    accessibleConfigs.put(key, entry.getValue());
                });

            // Add region-specific configs
            String regionPrefix = "REGION:" + user.getSchool().getRegion().getId() + ":";
            configurations.entrySet().stream()
                .filter(entry -> entry.getKey().startsWith(regionPrefix))
                .forEach(entry -> {
                    String key = entry.getKey().substring(regionPrefix.length());
                    accessibleConfigs.put(key, entry.getValue());
                });
        }

        // Add user-specific configs
        String userPrefix = "USER:" + userId + ":";
        configurations.entrySet().stream()
            .filter(entry -> entry.getKey().startsWith(userPrefix))
            .forEach(entry -> {
                String key = entry.getKey().substring(userPrefix.length());
                accessibleConfigs.put(key, entry.getValue());
            });

        return accessibleConfigs;
    }

    /**
     * Check if user can set configuration at given scope
     */
    private boolean canSetConfigurationAtScope(Long userId, AccessScope scopeType, Long scopeId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        return switch (user.getRole()) {
            case SUPER_ADMIN, MINISTRY_EXECUTIVE -> true; // Can set at any scope
            case MINISTRY_STAFF, DIRECTOR -> scopeType != AccessScope.USER; // Can't set user-specific
            case REGIONAL_ADMIN, REGIONAL_OFFICER -> {
                // Can set at region/school/class level within their region
                if (scopeType == AccessScope.USER) yield false;
                if (scopeType == AccessScope.GLOBAL) yield false;
                if (user.getSchool() == null) yield false;
                
                Long userRegionId = user.getSchool().getRegion().getId();
                yield switch (scopeType) {
                    case REGION -> scopeId.equals(userRegionId);
                    case SCHOOL -> isSchoolInRegion(scopeId, userRegionId);
                    case CLASS -> isClassInRegion(scopeId, userRegionId);
                    default -> false;
                };
            }
            case SCHOOL_ADMIN, SCHOOL_HEAD -> {
                // Can set at school/class level within their school
                if (scopeType == AccessScope.USER || scopeType == AccessScope.GLOBAL || scopeType == AccessScope.REGION) {
                    yield false;
                }
                if (user.getSchool() == null) yield false;
                
                Long userSchoolId = user.getSchool().getId();
                yield switch (scopeType) {
                    case SCHOOL -> scopeId.equals(userSchoolId);
                    case CLASS -> isClassInSchool(scopeId, userSchoolId);
                    default -> false;
                };
            }
            case DEPARTMENT_HEAD -> {
                // Can set class-level configs in their school
                if (scopeType != AccessScope.CLASS) yield false;
                if (user.getSchool() == null) yield false;
                yield isClassInSchool(scopeId, user.getSchool().getId());
            }
            case SENIOR_TEACHER, TEACHER -> {
                // Can only set user-level configs for themselves
                if (scopeType != AccessScope.USER) yield false;
                yield scopeId.equals(userId);
            }
            case STUDENT, PARENT -> {
                // Can only set user-level configs for themselves
                if (scopeType != AccessScope.USER) yield false;
                yield scopeId.equals(userId);
            }
            default -> false;
        };
    }

    /**
     * Build configuration key for storage
     */
    private String buildConfigurationKey(String configKey, AccessScope scopeType, Long scopeId) {
        return switch (scopeType) {
            case GLOBAL -> "GLOBAL:" + configKey;
            case REGION -> "REGION:" + scopeId + ":" + configKey;
            case SCHOOL -> "SCHOOL:" + scopeId + ":" + configKey;
            case CLASS -> "CLASS:" + scopeId + ":" + configKey;
            case USER -> "USER:" + scopeId + ":" + configKey;
            default -> throw new IllegalArgumentException("Unsupported scope type: " + scopeType);
        };
    }

    /**
     * Get user's primary class ID (placeholder - would be implemented based on enrollment/assignment tables)
     */
    private Long getUserPrimaryClassId(Long userId) {
        // In real implementation:
        // - For students: get from StudentEnrollment table
        // - For teachers: get from TeacherClassAssignment table
        return null; // Placeholder
    }

    /**
     * Check if school is in region
     */
    private boolean isSchoolInRegion(Long schoolId, Long regionId) {
        return schoolRepository.findById(schoolId)
            .map(school -> school.getRegion().getId().equals(regionId))
            .orElse(false);
    }

    /**
     * Check if class is in region
     */
    private boolean isClassInRegion(Long classId, Long regionId) {
        return classRepository.findById(classId)
            .map(cls -> cls.getSchool().getRegion().getId().equals(regionId))
            .orElse(false);
    }

    /**
     * Check if class is in school
     */
    private boolean isClassInSchool(Long classId, Long schoolId) {
        return classRepository.findById(classId)
            .map(cls -> cls.getSchool().getId().equals(schoolId))
            .orElse(false);
    }

    /**
     * Initialize default system configurations
     */
    private void initializeDefaultConfigurations() {
        // Global defaults
        configurations.put("GLOBAL:max_class_size", "35");
        configurations.put("GLOBAL:session_timeout_minutes", "30");
        configurations.put("GLOBAL:allow_parent_messaging", "true");
        configurations.put("GLOBAL:default_language", "en");
        configurations.put("GLOBAL:maintenance_mode", "false");
        
        // Regional overrides (example)
        configurations.put("REGION:1:max_class_size", "30"); // Region 1 has smaller classes
        configurations.put("REGION:2:default_language", "af"); // Region 2 uses Afrikaans
        
        // School overrides (example)
        configurations.put("SCHOOL:1:max_class_size", "25"); // School 1 has even smaller classes
        configurations.put("SCHOOL:1:allow_parent_messaging", "false"); // School 1 restricts messaging
        
        log.info("Initialized {} default configurations", configurations.size());
    }

    /**
     * Get configuration with type conversion
     */
    public Integer getIntegerConfiguration(String configKey, Long userId, Integer defaultValue) {
        String value = getConfigurationValue(configKey, userId);
        if (value == null) return defaultValue;
        
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            log.warn("Invalid integer configuration value for {}: {}", configKey, value);
            return defaultValue;
        }
    }

    public Boolean getBooleanConfiguration(String configKey, Long userId, Boolean defaultValue) {
        String value = getConfigurationValue(configKey, userId);
        if (value == null) return defaultValue;
        
        return "true".equalsIgnoreCase(value) || "1".equals(value) || "yes".equalsIgnoreCase(value);
    }

    public Double getDoubleConfiguration(String configKey, Long userId, Double defaultValue) {
        String value = getConfigurationValue(configKey, userId);
        if (value == null) return defaultValue;
        
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            log.warn("Invalid double configuration value for {}: {}", configKey, value);
            return defaultValue;
        }
    }
} 
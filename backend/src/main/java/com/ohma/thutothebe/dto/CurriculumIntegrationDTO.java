package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.CurriculumIntegration;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Map;

public record CurriculumIntegrationDTO(
    Long id,
    
    @NotNull(message = "Curriculum ID is required")
    Long curriculumId,
    String curriculumTitle,
    
    @NotBlank(message = "External system name is required")
    String externalSystemName,
    
    @NotBlank(message = "External system ID is required")
    String externalSystemId,
    
    @NotNull(message = "Integration type is required")
    CurriculumIntegration.IntegrationType integrationType,
    
    @NotNull(message = "Sync direction is required")
    CurriculumIntegration.SyncDirection syncDirection,
    
    String apiEndpoint,
    String authenticationMethod,
    String apiKeyReference,
    Map<String, Object> mappingConfiguration,
    String syncFrequency,
    LocalDateTime lastSyncAt,
    LocalDateTime nextSyncAt,
    
    @NotNull(message = "Sync status is required")
    CurriculumIntegration.SyncStatus syncStatus,
    
    String lastSyncResult,
    Integer errorCount,
    String lastErrorMessage,
    Integer retryCount,
    Integer maxRetries,
    String webhookUrl,
    String webhookSecret,
    Map<String, Object> dataTransformationRules,
    Map<String, Object> validationRules,
    String conflictResolutionStrategy,
    
    @NotNull(message = "Configured by ID is required")
    Long configuredById,
    String configuredByName,
    
    LocalDateTime configuredAt,
    boolean isActive,
    boolean isEnabled,
    boolean monitoringEnabled,
    Map<String, Object> notificationSettings,
    Map<String, Object> performanceMetrics
) {
    public CurriculumIntegrationDTO {
        if (externalSystemName != null && externalSystemName.isBlank()) {
            throw new IllegalArgumentException("External system name cannot be blank");
        }
        if (externalSystemId != null && externalSystemId.isBlank()) {
            throw new IllegalArgumentException("External system ID cannot be blank");
        }
        if (errorCount == null) {
            errorCount = 0;
        }
        if (retryCount == null) {
            retryCount = 0;
        }
        if (maxRetries == null) {
            maxRetries = 3;
        }
    }
} 
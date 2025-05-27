package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "curriculum_integrations")
@EqualsAndHashCode(callSuper = true)
public class CurriculumIntegration extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_id", nullable = false)
    private Curriculum curriculum;

    @NotBlank
    @Column(name = "external_system_name", nullable = false)
    private String externalSystemName;

    @NotBlank
    @Column(name = "external_system_id", nullable = false)
    private String externalSystemId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "integration_type", nullable = false)
    private IntegrationType integrationType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "sync_direction", nullable = false)
    private SyncDirection syncDirection;

    @Column(name = "api_endpoint")
    private String apiEndpoint;

    @Column(name = "authentication_method")
    private String authenticationMethod;

    @Column(name = "api_key_reference")
    private String apiKeyReference; // Reference to secure storage

    @Column(name = "mapping_configuration", columnDefinition = "JSONB")
    private String mappingConfiguration; // Field mapping configuration

    @Column(name = "sync_frequency")
    private String syncFrequency; // REAL_TIME, HOURLY, DAILY, WEEKLY, MANUAL

    @Column(name = "last_sync_at")
    private LocalDateTime lastSyncAt;

    @Column(name = "next_sync_at")
    private LocalDateTime nextSyncAt;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "sync_status", nullable = false)
    private SyncStatus syncStatus = SyncStatus.PENDING;

    @Column(name = "last_sync_result", columnDefinition = "TEXT")
    private String lastSyncResult;

    @Column(name = "error_count", nullable = false)
    private Integer errorCount = 0;

    @Column(name = "last_error_message", columnDefinition = "TEXT")
    private String lastErrorMessage;

    @Column(name = "retry_count", nullable = false)
    private Integer retryCount = 0;

    @Column(name = "max_retries", nullable = false)
    private Integer maxRetries = 3;

    @Column(name = "webhook_url")
    private String webhookUrl;

    @Column(name = "webhook_secret")
    private String webhookSecret;

    @Column(name = "data_transformation_rules", columnDefinition = "JSONB")
    private String dataTransformationRules;

    @Column(name = "validation_rules", columnDefinition = "JSONB")
    private String validationRules;

    @Column(name = "conflict_resolution_strategy")
    private String conflictResolutionStrategy; // MANUAL, AUTO_MERGE, SOURCE_WINS, TARGET_WINS

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "configured_by", nullable = false)
    private User configuredBy;

    @Column(name = "configured_at", nullable = false)
    private LocalDateTime configuredAt;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "is_enabled", nullable = false)
    private boolean isEnabled = true;

    @Column(name = "monitoring_enabled", nullable = false)
    private boolean monitoringEnabled = true;

    @Column(name = "notification_settings", columnDefinition = "JSONB")
    private String notificationSettings;

    @Column(name = "performance_metrics", columnDefinition = "JSONB")
    private String performanceMetrics;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (configuredAt == null) {
            configuredAt = LocalDateTime.now();
        }
    }

    public enum IntegrationType {
        CURRICULUM_EXPORT,      // Export curriculum to external system
        CURRICULUM_IMPORT,      // Import curriculum from external system
        PROGRESS_SYNC,          // Sync progress data
        ASSESSMENT_INTEGRATION, // Integrate with assessment systems
        RESOURCE_SYNC,          // Sync resources and materials
        ANALYTICS_EXPORT,       // Export analytics data
        USER_SYNC,              // Sync user data
        GRADE_SYNC,             // Sync grading data
        ATTENDANCE_SYNC,        // Sync attendance data
        REPORTING_INTEGRATION,  // Integrate with reporting systems
        LTI_INTEGRATION,        // Learning Tools Interoperability
        API_INTEGRATION,        // Generic API integration
        FILE_TRANSFER,          // File-based integration
        DATABASE_SYNC           // Direct database synchronization
    }

    public enum SyncDirection {
        INBOUND,    // Data flows into our system
        OUTBOUND,   // Data flows out of our system
        BIDIRECTIONAL // Data flows both ways
    }

    public enum SyncStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        FAILED,
        CANCELLED,
        PAUSED,
        SCHEDULED
    }
} 
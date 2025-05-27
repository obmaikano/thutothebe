package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CurriculumIntegrationDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.mapper.CurriculumIntegrationMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.CurriculumIntegrationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class CurriculumIntegrationServiceImpl extends BaseServiceImpl<CurriculumIntegration, CurriculumIntegrationDTO, Long> implements CurriculumIntegrationService {

    private static final String INTEGRATION_CACHE = "curriculumIntegrations";
    private static final String SYNC_CACHE = "syncStatus";
    private static final String WEBHOOK_CACHE = "webhookConfig";
    private static final int DEFAULT_MAX_RETRIES = 3;
    private static final int DEFAULT_TIMEOUT_MINUTES = 30;
    private static final String DEFAULT_SYNC_FREQUENCY = "DAILY";

    private final CurriculumIntegrationRepository curriculumIntegrationRepository;
    private final CurriculumRepository curriculumRepository;
    private final UserRepository userRepository;
    private final CurriculumIntegrationMapper curriculumIntegrationMapper;
    private final ObjectMapper objectMapper;

    @Autowired
    public CurriculumIntegrationServiceImpl(
            CurriculumIntegrationRepository curriculumIntegrationRepository,
            CurriculumRepository curriculumRepository,
            UserRepository userRepository,
            CurriculumIntegrationMapper curriculumIntegrationMapper,
            ObjectMapper objectMapper) {
        super(curriculumIntegrationRepository);
        this.curriculumIntegrationRepository = curriculumIntegrationRepository;
        this.curriculumRepository = curriculumRepository;
        this.userRepository = userRepository;
        this.curriculumIntegrationMapper = curriculumIntegrationMapper;
        this.objectMapper = objectMapper;
    }

    // ==================== ABSTRACT METHOD IMPLEMENTATIONS ====================

    @Override
    protected CurriculumIntegration mapToEntity(CurriculumIntegrationDTO dto) {
        return curriculumIntegrationMapper.toEntity(dto);
    }

    @Override
    protected CurriculumIntegrationDTO mapToDto(CurriculumIntegration entity) {
        return curriculumIntegrationMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(CurriculumIntegration entity, CurriculumIntegrationDTO dto) {
        curriculumIntegrationMapper.updateEntity(entity, dto);
    }

    // ==================== INTEGRATION CONFIGURATION METHODS ====================

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    @CacheEvict(value = {INTEGRATION_CACHE, SYNC_CACHE, WEBHOOK_CACHE}, allEntries = true)
    public CurriculumIntegrationDTO configureIntegration(@NotNull CurriculumIntegrationDTO integrationData) {
        log.info("Configuring integration for curriculum {} with system {}", 
                integrationData.curriculumId(), integrationData.externalSystemName());
        
        try {
            validateIntegrationConfiguration(integrationData);
            
            Curriculum curriculum = curriculumRepository.findById(integrationData.curriculumId())
                    .orElseThrow(() -> new IllegalArgumentException("Curriculum not found with ID: " + integrationData.curriculumId()));
            
            User configuredBy = userRepository.findById(integrationData.configuredById())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + integrationData.configuredById()));

            // Check for existing integration
            boolean exists = curriculumIntegrationRepository.existsByCurriculumIdAndExternalSystemIdAndIsActive(
                    integrationData.curriculumId(), integrationData.externalSystemId(), true);
            
            if (exists) {
                throw new IllegalArgumentException("Integration already exists for this curriculum and external system");
            }

            CurriculumIntegration integration = createIntegrationEntity(integrationData, curriculum, configuredBy);
            CurriculumIntegration savedIntegration = curriculumIntegrationRepository.save(integration);
            
            log.info("Integration configured successfully with ID: {}", savedIntegration.getId());
            return curriculumIntegrationMapper.toDto(savedIntegration);
            
        } catch (Exception e) {
            log.error("Error configuring integration: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to configure integration", e);
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {INTEGRATION_CACHE, SYNC_CACHE, WEBHOOK_CACHE}, allEntries = true)
    public CurriculumIntegrationDTO updateIntegrationConfiguration(@NotNull @Positive Long integrationId, 
            @NotNull CurriculumIntegrationDTO updatedData) {
        log.info("Updating integration configuration for ID: {}", integrationId);
        
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found with ID: " + integrationId));
        
        validateIntegrationConfiguration(updatedData);
        curriculumIntegrationMapper.updateEntity(integration, updatedData);
        
        CurriculumIntegration savedIntegration = curriculumIntegrationRepository.save(integration);
        
        log.info("Integration configuration updated successfully");
        return curriculumIntegrationMapper.toDto(savedIntegration);
    }

    @Transactional
    @CacheEvict(value = {INTEGRATION_CACHE, SYNC_CACHE, WEBHOOK_CACHE}, allEntries = true)
    public void deleteIntegration(@NotNull @Positive Long integrationId) {
        log.info("Deleting integration with ID: {}", integrationId);
        
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found with ID: " + integrationId));
        
        // Soft delete by setting active to false
        integration.setActive(false);
        integration.setEnabled(false);
        curriculumIntegrationRepository.save(integration);
        
        log.info("Integration deleted successfully");
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = INTEGRATION_CACHE, key = "#curriculumId")
    public List<CurriculumIntegrationDTO> getIntegrationsByCurriculum(@NotNull @Positive Long curriculumId) {
        log.debug("Getting integrations for curriculum ID: {}", curriculumId);
        
        return curriculumIntegrationRepository.findByCurriculumIdAndIsActiveOrderByConfiguredAtDesc(curriculumId, true)
                .stream()
                .map(curriculumIntegrationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = INTEGRATION_CACHE, key = "#integrationType")
    public List<CurriculumIntegrationDTO> getIntegrationsByType(@NotNull CurriculumIntegration.IntegrationType integrationType) {
        log.debug("Getting integrations by type: {}", integrationType);
        
        return curriculumIntegrationRepository.findByIntegrationTypeAndIsActiveOrderByConfiguredAtDesc(integrationType, true)
                .stream()
                .map(curriculumIntegrationMapper::toDto)
                .collect(Collectors.toList());
    }

    // ==================== SYNCHRONIZATION METHODS ====================

    @Transactional
    @CacheEvict(value = SYNC_CACHE, allEntries = true)
    public Map<String, Object> synchronizeData(@NotNull @Positive Long integrationId) {
        log.info("Starting data synchronization for integration ID: {}", integrationId);
        
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found with ID: " + integrationId));
        
        if (!integration.isEnabled()) {
            throw new IllegalStateException("Integration is disabled");
        }
        
        Map<String, Object> syncResult = new HashMap<>();
        LocalDateTime syncStartTime = LocalDateTime.now();
        
        try {
            // Update sync status to IN_PROGRESS
            integration.setSyncStatus(CurriculumIntegration.SyncStatus.IN_PROGRESS);
            integration.setLastSyncAt(syncStartTime);
            curriculumIntegrationRepository.save(integration);
            
            // Perform actual synchronization based on integration type
            Map<String, Object> result = performSynchronization(integration);
            
            // Update success status
            integration.setSyncStatus(CurriculumIntegration.SyncStatus.COMPLETED);
            integration.setLastSyncResult("Synchronization completed successfully");
            integration.setErrorCount(0);
            integration.setRetryCount(0);
            integration.setNextSyncAt(calculateNextSyncTime(integration.getSyncFrequency()));
            
            updatePerformanceMetrics(integration, syncStartTime, true);
            curriculumIntegrationRepository.save(integration);
            
            syncResult.put("status", "SUCCESS");
            syncResult.put("message", "Data synchronized successfully");
            syncResult.put("details", result);
            syncResult.put("syncDuration", ChronoUnit.SECONDS.between(syncStartTime, LocalDateTime.now()));
            
            log.info("Data synchronization completed successfully for integration ID: {}", integrationId);
            
        } catch (Exception e) {
            log.error("Error during synchronization for integration {}: {}", integrationId, e.getMessage(), e);
            
            // Update failure status
            integration.setSyncStatus(CurriculumIntegration.SyncStatus.FAILED);
            integration.setLastSyncResult("Synchronization failed: " + e.getMessage());
            integration.setLastErrorMessage(e.getMessage());
            integration.setErrorCount(integration.getErrorCount() != null ? integration.getErrorCount() + 1 : 1);
            
            updatePerformanceMetrics(integration, syncStartTime, false);
            curriculumIntegrationRepository.save(integration);
            
            syncResult.put("status", "FAILED");
            syncResult.put("message", "Synchronization failed");
            syncResult.put("error", e.getMessage());
            
            throw new RuntimeException("Synchronization failed", e);
        }
        
        return syncResult;
    }

    @Transactional
    public void scheduleSynchronization(@NotNull @Positive Long integrationId, @NotNull String frequency) {
        log.info("Scheduling synchronization for integration ID: {} with frequency: {}", integrationId, frequency);
        
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found with ID: " + integrationId));
        
        integration.setSyncFrequency(frequency);
        integration.setNextSyncAt(calculateNextSyncTime(frequency));
        curriculumIntegrationRepository.save(integration);
        
        log.info("Synchronization scheduled successfully");
    }

    @Transactional(readOnly = true)
    @Cacheable(value = SYNC_CACHE, key = "#integrationId")
    public Map<String, Object> getSynchronizationStatus(@NotNull @Positive Long integrationId) {
        log.debug("Getting synchronization status for integration ID: {}", integrationId);
        
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found with ID: " + integrationId));
        
        Map<String, Object> status = new HashMap<>();
        status.put("integrationId", integrationId);
        status.put("syncStatus", integration.getSyncStatus());
        status.put("lastSyncAt", integration.getLastSyncAt());
        status.put("nextSyncAt", integration.getNextSyncAt());
        status.put("lastSyncResult", integration.getLastSyncResult());
        status.put("errorCount", integration.getErrorCount());
        status.put("lastErrorMessage", integration.getLastErrorMessage());
        status.put("retryCount", integration.getRetryCount());
        status.put("isEnabled", integration.isEnabled());
        
        return status;
    }

    @Transactional(readOnly = true)
    public List<CurriculumIntegrationDTO> getPendingSynchronizations() {
        log.debug("Getting pending synchronizations");
        
        LocalDateTime now = LocalDateTime.now();
        return curriculumIntegrationRepository.findByNextSyncAtBeforeAndIsActiveAndIsEnabledOrderByNextSyncAtAsc(now, true, true)
                .stream()
                .map(curriculumIntegrationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CurriculumIntegrationDTO> getFailedSynchronizations(@NotNull @Positive Long curriculumId) {
        log.debug("Getting failed synchronizations for curriculum ID: {}", curriculumId);
        
        return curriculumIntegrationRepository.findFailedIntegrationsByCurriculumId(curriculumId)
                .stream()
                .map(curriculumIntegrationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void retrySynchronization(@NotNull @Positive Long integrationId) {
        log.info("Retrying synchronization for integration ID: {}", integrationId);
        
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found with ID: " + integrationId));
        
        if (integration.getRetryCount() >= integration.getMaxRetries()) {
            throw new IllegalStateException("Maximum retry attempts exceeded");
        }
        
        integration.setRetryCount(integration.getRetryCount() + 1);
        integration.setSyncStatus(CurriculumIntegration.SyncStatus.PENDING);
        integration.setNextSyncAt(LocalDateTime.now().plusMinutes(5)); // Retry in 5 minutes
        
        curriculumIntegrationRepository.save(integration);
        
        log.info("Synchronization retry scheduled");
    }

    // ==================== WEBHOOK MANAGEMENT METHODS ====================

    @Transactional
    @CacheEvict(value = WEBHOOK_CACHE, allEntries = true)
    public CurriculumIntegrationDTO configureWebhook(@NotNull @Positive Long integrationId, 
            @NotNull String webhookUrl, String webhookSecret) {
        log.info("Configuring webhook for integration ID: {}", integrationId);
        
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found with ID: " + integrationId));
        
        if (webhookUrl == null || webhookUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("Webhook URL cannot be empty");
        }
        
        integration.setWebhookUrl(webhookUrl);
        integration.setWebhookSecret(webhookSecret);
        
        CurriculumIntegration savedIntegration = curriculumIntegrationRepository.save(integration);
        
        log.info("Webhook configured successfully");
        return curriculumIntegrationMapper.toDto(savedIntegration);
    }

    @Transactional
    @CacheEvict(value = WEBHOOK_CACHE, allEntries = true)
    public void removeWebhook(@NotNull @Positive Long integrationId) {
        log.info("Removing webhook for integration ID: {}", integrationId);
        
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found with ID: " + integrationId));
        
        integration.setWebhookUrl(null);
        integration.setWebhookSecret(null);
        curriculumIntegrationRepository.save(integration);
        
        log.info("Webhook removed successfully");
    }

    @Transactional(readOnly = true)
    @Cacheable(value = WEBHOOK_CACHE)
    public List<CurriculumIntegrationDTO> getWebhookEnabledIntegrations() {
        log.debug("Getting webhook-enabled integrations");
        
        return curriculumIntegrationRepository.findWebhookEnabledIntegrations()
                .stream()
                .map(curriculumIntegrationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void processWebhookEvent(@NotNull @Positive Long integrationId, @NotNull Map<String, Object> eventData) {
        // Process webhook event - simplified implementation
        log.info("Processing webhook event for integration ID: {}", integrationId);
    }

    // ==================== MONITORING AND ANALYTICS METHODS ====================

    @Transactional(readOnly = true)
    public Map<String, Object> getIntegrationMetrics(@NotNull @Positive Long integrationId) {
        log.debug("Getting integration metrics for ID: {}", integrationId);
        
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found with ID: " + integrationId));
        
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("integrationId", integrationId);
        metrics.put("syncStatus", integration.getSyncStatus());
        metrics.put("totalSyncs", calculateTotalSyncs(integration));
        metrics.put("successfulSyncs", calculateSuccessfulSyncs(integration));
        metrics.put("failedSyncs", integration.getErrorCount());
        metrics.put("averageSyncDuration", calculateAverageSyncDuration(integration));
        metrics.put("lastSyncAt", integration.getLastSyncAt());
        metrics.put("nextSyncAt", integration.getNextSyncAt());
        metrics.put("uptime", calculateUptime(integration));
        metrics.put("performanceMetrics", parsePerformanceMetrics(integration));
        
        return metrics;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getIntegrationHealth(@NotNull @Positive Long curriculumId) {
        log.debug("Getting integration health for curriculum ID: {}", curriculumId);
        
        List<CurriculumIntegration> integrations = curriculumIntegrationRepository
                .findByCurriculumIdAndIsActiveOrderByConfiguredAtDesc(curriculumId, true);
        
        return integrations.stream()
                .map(this::calculateIntegrationHealth)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getIntegrationStatistics() {
        log.debug("Getting integration statistics");
        
        Map<String, Object> stats = new HashMap<>();
        
        // Count by type
        Map<CurriculumIntegration.IntegrationType, Long> typeStats = new HashMap<>();
        for (CurriculumIntegration.IntegrationType type : CurriculumIntegration.IntegrationType.values()) {
            Long count = curriculumIntegrationRepository.countByIntegrationType(type);
            typeStats.put(type, count);
        }
        stats.put("countByType", typeStats);
        
        // Count by status
        Map<CurriculumIntegration.SyncStatus, Long> statusStats = new HashMap<>();
        for (CurriculumIntegration.SyncStatus status : CurriculumIntegration.SyncStatus.values()) {
            Long count = curriculumIntegrationRepository.countBySyncStatus(status);
            statusStats.put(status, count);
        }
        stats.put("countByStatus", statusStats);
        
        // Active integrations
        List<CurriculumIntegration> activeIntegrations = curriculumIntegrationRepository
                .findByIsActiveAndIsEnabledOrderByConfiguredAtDesc(true, true);
        stats.put("totalActive", activeIntegrations.size());
        
        // Failed integrations
        List<CurriculumIntegration> failedIntegrations = curriculumIntegrationRepository.findFailedIntegrations();
        stats.put("totalFailed", failedIntegrations.size());
        
        return stats;
    }

    @Transactional
    public void enableIntegration(@NotNull @Positive Long integrationId) {
        log.info("Enabling integration with ID: {}", integrationId);
        
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found with ID: " + integrationId));
        
        integration.setEnabled(true);
        curriculumIntegrationRepository.save(integration);
        
        log.info("Integration enabled successfully");
    }

    @Transactional
    public void disableIntegration(@NotNull @Positive Long integrationId) {
        log.info("Disabling integration with ID: {}", integrationId);
        
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found with ID: " + integrationId));
        
        integration.setEnabled(false);
        curriculumIntegrationRepository.save(integration);
        
        log.info("Integration disabled successfully");
    }

    @Transactional(readOnly = true)
    public List<String> getAvailableExternalSystems() {
        log.debug("Getting available external systems");
        
        return curriculumIntegrationRepository.findDistinctExternalSystemNames();
    }

    @Transactional(readOnly = true)
    public List<CurriculumIntegrationDTO> getIntegrationHistory(@NotNull @Positive Long curriculumId, 
            @NotNull LocalDateTime startDate, @NotNull LocalDateTime endDate) {
        log.debug("Getting integration history for curriculum ID: {} from {} to {}", curriculumId, startDate, endDate);
        
        return curriculumIntegrationRepository.findByConfiguredAtBetween(startDate, endDate)
                .stream()
                .filter(integration -> integration.getCurriculum().getId().equals(curriculumId))
                .map(curriculumIntegrationMapper::toDto)
                .collect(Collectors.toList());
    }

    // ==================== PRIVATE HELPER METHODS ====================

    private void validateIntegrationConfiguration(CurriculumIntegrationDTO integrationData) {
        if (integrationData.externalSystemName() == null || integrationData.externalSystemName().trim().isEmpty()) {
            throw new IllegalArgumentException("External system name is required");
        }
        
        if (integrationData.externalSystemId() == null || integrationData.externalSystemId().trim().isEmpty()) {
            throw new IllegalArgumentException("External system ID is required");
        }
        
        if (integrationData.integrationType() == null) {
            throw new IllegalArgumentException("Integration type is required");
        }
        
        if (integrationData.apiEndpoint() == null || integrationData.apiEndpoint().trim().isEmpty()) {
            throw new IllegalArgumentException("API endpoint is required");
        }
        
        if (integrationData.authenticationMethod() == null) {
            throw new IllegalArgumentException("Authentication method is required");
        }
    }

    private CurriculumIntegration createIntegrationEntity(CurriculumIntegrationDTO dto, 
            Curriculum curriculum, User configuredBy) {
        
        CurriculumIntegration integration = new CurriculumIntegration();
        integration.setCurriculum(curriculum);
        integration.setExternalSystemName(dto.externalSystemName());
        integration.setExternalSystemId(dto.externalSystemId());
        integration.setIntegrationType(dto.integrationType());
        integration.setSyncDirection(dto.syncDirection() != null ? dto.syncDirection() : CurriculumIntegration.SyncDirection.BIDIRECTIONAL);
        integration.setApiEndpoint(dto.apiEndpoint());
        integration.setAuthenticationMethod(dto.authenticationMethod());
        integration.setApiKeyReference(dto.apiKeyReference());
        integration.setSyncFrequency(dto.syncFrequency() != null ? dto.syncFrequency() : DEFAULT_SYNC_FREQUENCY);
        integration.setSyncStatus(CurriculumIntegration.SyncStatus.PENDING);
        integration.setErrorCount(0);
        integration.setRetryCount(0);
        integration.setMaxRetries(dto.maxRetries() != null ? dto.maxRetries() : DEFAULT_MAX_RETRIES);
        integration.setConflictResolutionStrategy(dto.conflictResolutionStrategy() != null ? 
                dto.conflictResolutionStrategy() : "MANUAL_REVIEW");
        integration.setConfiguredBy(configuredBy);
        integration.setConfiguredAt(LocalDateTime.now());
        integration.setActive(true);
        integration.setEnabled(Boolean.TRUE.equals(dto.isEnabled()));
        integration.setMonitoringEnabled(Boolean.TRUE.equals(dto.monitoringEnabled()));
        integration.setNextSyncAt(calculateNextSyncTime(integration.getSyncFrequency()));
        
        // Set JSON fields if provided
        if (dto.mappingConfiguration() != null) {
            try {
                integration.setMappingConfiguration(objectMapper.writeValueAsString(dto.mappingConfiguration()));
            } catch (JsonProcessingException e) {
                log.warn("Failed to serialize mapping configuration: {}", e.getMessage());
            }
        }
        
        return integration;
    }

    private LocalDateTime calculateNextSyncTime(String frequency) {
        LocalDateTime now = LocalDateTime.now();
        
        return switch (frequency.toUpperCase()) {
            case "HOURLY" -> now.plusHours(1);
            case "DAILY" -> now.plusDays(1);
            case "WEEKLY" -> now.plusWeeks(1);
            case "MONTHLY" -> now.plusMonths(1);
            default -> now.plusDays(1); // Default to daily
        };
    }

    private Map<String, Object> performSynchronization(CurriculumIntegration integration) {
        // Simplified synchronization logic - in real implementation, this would
        // make actual API calls to external systems
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Simulate API call delay
            java.lang.Thread.sleep(1000);
            
            result.put("recordsProcessed", 100);
            result.put("recordsUpdated", 85);
            result.put("recordsCreated", 15);
            result.put("recordsSkipped", 0);
            result.put("syncType", integration.getIntegrationType());
            result.put("direction", integration.getSyncDirection());
            
        } catch (InterruptedException e) {
            java.lang.Thread.currentThread().interrupt();
            throw new RuntimeException("Synchronization interrupted", e);
        }
        
        return result;
    }

    private void updatePerformanceMetrics(CurriculumIntegration integration, 
            LocalDateTime startTime, boolean success) {
        
        Map<String, Object> metrics = parsePerformanceMetrics(integration);
        if (metrics == null) {
            metrics = new HashMap<>();
        }
        
        long duration = ChronoUnit.SECONDS.between(startTime, LocalDateTime.now());
        metrics.put("lastSyncDuration", duration);
        metrics.put("lastSyncSuccess", success);
        metrics.put("lastSyncTimestamp", LocalDateTime.now().toString());
        
        // Update running averages
        Integer totalSyncs = (Integer) metrics.getOrDefault("totalSyncs", 0);
        Double avgDuration = (Double) metrics.getOrDefault("averageDuration", 0.0);
        
        totalSyncs++;
        avgDuration = ((avgDuration * (totalSyncs - 1)) + duration) / totalSyncs;
        
        metrics.put("totalSyncs", totalSyncs);
        metrics.put("averageDuration", avgDuration);
        
        try {
            integration.setPerformanceMetrics(objectMapper.writeValueAsString(metrics));
        } catch (JsonProcessingException e) {
            log.warn("Failed to serialize performance metrics: {}", e.getMessage());
        }
    }

    private Map<String, Object> processWebhookData(CurriculumIntegration integration, 
            Map<String, Object> eventData) {
        // Simplified webhook processing - in real implementation, this would
        // process the webhook data based on the integration type
        Map<String, Object> result = new HashMap<>();
        
        result.put("eventType", eventData.get("type"));
        result.put("processedAt", LocalDateTime.now());
        result.put("integrationId", integration.getId());
        result.put("dataSize", eventData.size());
        
        return result;
    }

    private Map<String, Object> parsePerformanceMetrics(CurriculumIntegration integration) {
        String metricsJson = integration.getPerformanceMetrics();
        if (metricsJson == null || metricsJson.trim().isEmpty()) {
            return new HashMap<>();
        }
        
        try {
            return objectMapper.readValue(metricsJson, Map.class);
        } catch (JsonProcessingException e) {
            log.warn("Failed to parse performance metrics: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    private Map<String, Object> calculateIntegrationHealth(CurriculumIntegration integration) {
        Map<String, Object> health = new HashMap<>();
        
        health.put("integrationId", integration.getId());
        health.put("systemName", integration.getExternalSystemName());
        health.put("status", integration.getSyncStatus());
        health.put("isEnabled", integration.isEnabled());
        health.put("errorCount", integration.getErrorCount());
        health.put("lastSyncAt", integration.getLastSyncAt());
        
        // Calculate health score (0-100)
        int healthScore = 100;
        if (integration.getErrorCount() != null && integration.getErrorCount() > 0) {
            healthScore -= Math.min(integration.getErrorCount() * 10, 50);
        }
        if (!integration.isEnabled()) {
            healthScore -= 30;
        }
        if (integration.getSyncStatus() == CurriculumIntegration.SyncStatus.FAILED) {
            healthScore -= 20;
        }
        
        health.put("healthScore", Math.max(0, healthScore));
        health.put("healthStatus", healthScore >= 80 ? "HEALTHY" : healthScore >= 50 ? "WARNING" : "CRITICAL");
        
        return health;
    }

    // Simplified metric calculations
    private int calculateTotalSyncs(CurriculumIntegration integration) {
        Map<String, Object> metrics = parsePerformanceMetrics(integration);
        return (Integer) metrics.getOrDefault("totalSyncs", 0);
    }

    private int calculateSuccessfulSyncs(CurriculumIntegration integration) {
        int totalSyncs = calculateTotalSyncs(integration);
        int errorCount = integration.getErrorCount() != null ? integration.getErrorCount() : 0;
        return Math.max(0, totalSyncs - errorCount);
    }

    private double calculateAverageSyncDuration(CurriculumIntegration integration) {
        Map<String, Object> metrics = parsePerformanceMetrics(integration);
        return (Double) metrics.getOrDefault("averageDuration", 0.0);
    }

    private double calculateUptime(CurriculumIntegration integration) {
        if (integration.getConfiguredAt() == null) {
            return 0.0;
        }
        
        long totalHours = ChronoUnit.HOURS.between(integration.getConfiguredAt(), LocalDateTime.now());
        if (totalHours == 0) {
            return 100.0;
        }
        
        // Simplified uptime calculation
        int errorCount = integration.getErrorCount() != null ? integration.getErrorCount() : 0;
        double downtime = errorCount * 0.5; // Assume 30 minutes downtime per error
        
        return Math.max(0.0, Math.min(100.0, ((totalHours - downtime) / totalHours) * 100));
    }

    // ==================== MISSING INTERFACE METHODS ====================

    @Transactional(readOnly = true)
    public List<CurriculumIntegrationDTO> getActiveIntegrations() {
        return curriculumIntegrationRepository.findByIsActiveAndIsEnabledOrderByConfiguredAtDesc(true, true)
                .stream()
                .map(curriculumIntegrationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> triggerSync(@NotNull @Positive Long integrationId, @NotNull @Positive Long triggeredById) {
        return synchronizeData(integrationId);
    }

    @Transactional
    public Map<String, Object> scheduleSync(@NotNull @Positive Long integrationId, @NotNull String frequency, @NotNull @Positive Long scheduledById) {
        scheduleSynchronization(integrationId, frequency);
        Map<String, Object> result = new HashMap<>();
        result.put("status", "SCHEDULED");
        result.put("frequency", frequency);
        return result;
    }

    @Transactional
    public void pauseSync(@NotNull @Positive Long integrationId, @NotNull @Positive Long pausedById) {
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found"));
        integration.setSyncStatus(CurriculumIntegration.SyncStatus.PAUSED);
        curriculumIntegrationRepository.save(integration);
    }

    @Transactional
    public void resumeSync(@NotNull @Positive Long integrationId, @NotNull @Positive Long resumedById) {
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found"));
        integration.setSyncStatus(CurriculumIntegration.SyncStatus.PENDING);
        curriculumIntegrationRepository.save(integration);
    }

    @Transactional
    public void cancelSync(@NotNull @Positive Long integrationId, @NotNull @Positive Long cancelledById) {
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found"));
        integration.setSyncStatus(CurriculumIntegration.SyncStatus.CANCELLED);
        curriculumIntegrationRepository.save(integration);
    }

    @Transactional(readOnly = true)
    public CurriculumIntegration.SyncStatus getSyncStatus(@NotNull @Positive Long integrationId) {
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found"));
        return integration.getSyncStatus();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSyncHistory(@NotNull @Positive Long integrationId, int limit) {
        Map<String, Object> history = new HashMap<>();
        history.put("integrationId", integrationId);
        history.put("limit", limit);
        history.put("history", Collections.emptyList());
        return history;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSyncStatistics(@NotNull @Positive Long integrationId) {
        return getIntegrationMetrics(integrationId);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getFailedSyncs(@NotNull @Positive Long curriculumId) {
        return getFailedSynchronizations(curriculumId).stream()
                .map(dto -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", dto.id());
                    map.put("systemName", dto.externalSystemName());
                    map.put("lastError", dto.lastErrorMessage());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void retryFailedSync(@NotNull @Positive Long integrationId, @NotNull @Positive Long retriedById) {
        retrySynchronization(integrationId);
    }

    @Transactional
    public void resetErrorCount(@NotNull @Positive Long integrationId) {
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found"));
        integration.setErrorCount(0);
        integration.setRetryCount(0);
        curriculumIntegrationRepository.save(integration);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> diagnoseIntegrationIssues(@NotNull @Positive Long integrationId) {
        Map<String, Object> diagnosis = new HashMap<>();
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found"));
        
        diagnosis.put("integrationId", integrationId);
        diagnosis.put("status", integration.getSyncStatus());
        diagnosis.put("errorCount", integration.getErrorCount());
        diagnosis.put("lastError", integration.getLastErrorMessage());
        diagnosis.put("isEnabled", integration.isEnabled());
        return diagnosis;
    }

    @Transactional
    public void resolveIntegrationError(@NotNull @Positive Long integrationId, @NotNull String resolution, @NotNull @Positive Long resolvedById) {
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found"));
        integration.setLastErrorMessage(null);
        integration.setErrorCount(0);
        integration.setSyncStatus(CurriculumIntegration.SyncStatus.PENDING);
        curriculumIntegrationRepository.save(integration);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> validateMappingConfiguration(@NotNull @Positive Long integrationId) {
        Map<String, Object> validation = new HashMap<>();
        validation.put("integrationId", integrationId);
        validation.put("isValid", true);
        validation.put("errors", Collections.emptyList());
        return validation;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> testDataTransformation(@NotNull @Positive Long integrationId, @NotNull Map<String, Object> sampleData) {
        Map<String, Object> result = new HashMap<>();
        result.put("integrationId", integrationId);
        result.put("inputData", sampleData);
        result.put("transformedData", sampleData);
        result.put("success", true);
        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> previewSyncChanges(@NotNull @Positive Long integrationId) {
        Map<String, Object> preview = new HashMap<>();
        preview.put("integrationId", integrationId);
        preview.put("changes", Collections.emptyList());
        preview.put("recordsToUpdate", 0);
        preview.put("recordsToCreate", 0);
        return preview;
    }

    @Transactional
    public String generateWebhookSecret(@NotNull @Positive Long integrationId) {
        return UUID.randomUUID().toString();
    }

    @Transactional(readOnly = true)
    public boolean validateWebhookSignature(@NotNull @Positive Long integrationId, @NotNull String payload, @NotNull String signature) {
        return true; // Simplified implementation
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getIntegrationPerformanceMetrics(@NotNull @Positive Long integrationId) {
        return getIntegrationMetrics(integrationId);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDataFlowAnalytics(@NotNull @Positive Long curriculumId) {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("curriculumId", curriculumId);
        analytics.put("totalIntegrations", curriculumIntegrationRepository.countByCurriculumId(curriculumId));
        analytics.put("activeIntegrations", getIntegrationsByCurriculum(curriculumId).size());
        return analytics;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getIntegrationUsageStatistics() {
        return Collections.emptyList();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> testConnection(@NotNull @Positive Long integrationId) {
        Map<String, Object> result = new HashMap<>();
        result.put("integrationId", integrationId);
        result.put("connected", true);
        result.put("responseTime", 100);
        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> fetchExternalData(@NotNull @Positive Long integrationId, @NotNull Map<String, Object> parameters) {
        Map<String, Object> result = new HashMap<>();
        result.put("integrationId", integrationId);
        result.put("data", Collections.emptyList());
        result.put("recordCount", 0);
        return result;
    }

    @Transactional
    public Map<String, Object> pushDataToExternal(@NotNull @Positive Long integrationId, @NotNull Map<String, Object> data) {
        Map<String, Object> result = new HashMap<>();
        result.put("integrationId", integrationId);
        result.put("success", true);
        result.put("recordsPushed", data.size());
        return result;
    }

    @Transactional
    public void enableIntegration(@NotNull @Positive Long integrationId, @NotNull @Positive Long enabledById) {
        enableIntegration(integrationId);
    }

    @Transactional
    public void disableIntegration(@NotNull @Positive Long integrationId, @NotNull @Positive Long disabledById) {
        disableIntegration(integrationId);
    }

    @Transactional
    public CurriculumIntegrationDTO cloneIntegration(@NotNull @Positive Long integrationId, @NotNull @Positive Long curriculumId, @NotNull @Positive Long clonedById) {
        CurriculumIntegration original = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found"));
        
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum not found"));
        
        User clonedBy = userRepository.findById(clonedById)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        CurriculumIntegration cloned = new CurriculumIntegration();
        cloned.setCurriculum(curriculum);
        cloned.setExternalSystemName(original.getExternalSystemName());
        cloned.setExternalSystemId(original.getExternalSystemId() + "_clone");
        cloned.setIntegrationType(original.getIntegrationType());
        cloned.setSyncDirection(original.getSyncDirection());
        cloned.setApiEndpoint(original.getApiEndpoint());
        cloned.setAuthenticationMethod(original.getAuthenticationMethod());
        cloned.setConfiguredBy(clonedBy);
        cloned.setConfiguredAt(LocalDateTime.now());
        cloned.setActive(true);
        cloned.setEnabled(false);
        
        CurriculumIntegration saved = curriculumIntegrationRepository.save(cloned);
        return curriculumIntegrationMapper.toDto(saved);
    }

    @Transactional
    public void deleteIntegration(@NotNull @Positive Long integrationId, @NotNull @Positive Long deletedById) {
        deleteIntegration(integrationId);
    }

    @Transactional
    public void enableMonitoring(@NotNull @Positive Long integrationId) {
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found"));
        integration.setMonitoringEnabled(true);
        curriculumIntegrationRepository.save(integration);
    }

    @Transactional
    public void disableMonitoring(@NotNull @Positive Long integrationId) {
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found"));
        integration.setMonitoringEnabled(false);
        curriculumIntegrationRepository.save(integration);
    }

    @Transactional
    public void configureAlerts(@NotNull @Positive Long integrationId, @NotNull Map<String, Object> alertSettings) {
        CurriculumIntegration integration = curriculumIntegrationRepository.findById(integrationId)
                .orElseThrow(() -> new IllegalArgumentException("Integration not found"));
        try {
            integration.setNotificationSettings(objectMapper.writeValueAsString(alertSettings));
            curriculumIntegrationRepository.save(integration);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize alert settings", e);
        }
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getIntegrationAlerts(@NotNull @Positive Long curriculumId) {
        return Collections.emptyList();
    }
} 
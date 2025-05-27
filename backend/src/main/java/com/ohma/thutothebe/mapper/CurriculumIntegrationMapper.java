package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CurriculumIntegrationDTO;
import com.ohma.thutothebe.entity.CurriculumIntegration;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class CurriculumIntegrationMapper implements BaseDtoMapper<CurriculumIntegration, CurriculumIntegrationDTO> {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public CurriculumIntegrationDTO toDto(CurriculumIntegration entity) {
        if (entity == null) {
            return null;
        }

        return new CurriculumIntegrationDTO(
                entity.getId(),
                entity.getCurriculum() != null ? entity.getCurriculum().getId() : null,
                entity.getCurriculum() != null ? entity.getCurriculum().getTitle() : null,
                entity.getExternalSystemName(),
                entity.getExternalSystemId(),
                entity.getIntegrationType(),
                entity.getSyncDirection(),
                entity.getApiEndpoint(),
                entity.getAuthenticationMethod(),
                entity.getApiKeyReference(),
                parseJsonToMap(entity.getMappingConfiguration()),
                entity.getSyncFrequency(),
                entity.getLastSyncAt(),
                entity.getNextSyncAt(),
                entity.getSyncStatus(),
                entity.getLastSyncResult(),
                entity.getErrorCount(),
                entity.getLastErrorMessage(),
                entity.getRetryCount(),
                entity.getMaxRetries(),
                entity.getWebhookUrl(),
                entity.getWebhookSecret(),
                parseJsonToMap(entity.getDataTransformationRules()),
                parseJsonToMap(entity.getValidationRules()),
                entity.getConflictResolutionStrategy(),
                entity.getConfiguredBy() != null ? entity.getConfiguredBy().getId() : null,
                entity.getConfiguredBy() != null ? 
                    entity.getConfiguredBy().getFirstName() + " " + entity.getConfiguredBy().getLastName() : null,
                entity.getConfiguredAt(),
                entity.isActive(),
                entity.isEnabled(),
                entity.isMonitoringEnabled(),
                parseJsonToMap(entity.getNotificationSettings()),
                parseJsonToMap(entity.getPerformanceMetrics())
        );
    }

    @Override
    public CurriculumIntegration toEntity(CurriculumIntegrationDTO dto) {
        if (dto == null) {
            return null;
        }

        CurriculumIntegration entity = new CurriculumIntegration();
        entity.setId(dto.id());
        entity.setExternalSystemName(dto.externalSystemName());
        entity.setExternalSystemId(dto.externalSystemId());
        entity.setIntegrationType(dto.integrationType());
        entity.setSyncDirection(dto.syncDirection());
        entity.setApiEndpoint(dto.apiEndpoint());
        entity.setAuthenticationMethod(dto.authenticationMethod());
        entity.setApiKeyReference(dto.apiKeyReference());
        entity.setMappingConfiguration(mapToJson(dto.mappingConfiguration()));
        entity.setSyncFrequency(dto.syncFrequency());
        entity.setLastSyncAt(dto.lastSyncAt());
        entity.setNextSyncAt(dto.nextSyncAt());
        entity.setSyncStatus(dto.syncStatus());
        entity.setLastSyncResult(dto.lastSyncResult());
        entity.setErrorCount(dto.errorCount());
        entity.setLastErrorMessage(dto.lastErrorMessage());
        entity.setRetryCount(dto.retryCount());
        entity.setMaxRetries(dto.maxRetries());
        entity.setWebhookUrl(dto.webhookUrl());
        entity.setWebhookSecret(dto.webhookSecret());
        entity.setDataTransformationRules(mapToJson(dto.dataTransformationRules()));
        entity.setValidationRules(mapToJson(dto.validationRules()));
        entity.setConflictResolutionStrategy(dto.conflictResolutionStrategy());
        entity.setConfiguredAt(dto.configuredAt());
        entity.setActive(dto.isActive());
        entity.setEnabled(dto.isEnabled());
        entity.setMonitoringEnabled(dto.monitoringEnabled());
        entity.setNotificationSettings(mapToJson(dto.notificationSettings()));
        entity.setPerformanceMetrics(mapToJson(dto.performanceMetrics()));

        return entity;
    }

    public void updateEntity(CurriculumIntegration entity, CurriculumIntegrationDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setExternalSystemName(dto.externalSystemName());
        entity.setExternalSystemId(dto.externalSystemId());
        entity.setIntegrationType(dto.integrationType());
        entity.setSyncDirection(dto.syncDirection());
        entity.setApiEndpoint(dto.apiEndpoint());
        entity.setAuthenticationMethod(dto.authenticationMethod());
        entity.setApiKeyReference(dto.apiKeyReference());
        entity.setMappingConfiguration(mapToJson(dto.mappingConfiguration()));
        entity.setSyncFrequency(dto.syncFrequency());
        entity.setLastSyncAt(dto.lastSyncAt());
        entity.setNextSyncAt(dto.nextSyncAt());
        entity.setSyncStatus(dto.syncStatus());
        entity.setLastSyncResult(dto.lastSyncResult());
        entity.setErrorCount(dto.errorCount());
        entity.setLastErrorMessage(dto.lastErrorMessage());
        entity.setRetryCount(dto.retryCount());
        entity.setMaxRetries(dto.maxRetries());
        entity.setWebhookUrl(dto.webhookUrl());
        entity.setWebhookSecret(dto.webhookSecret());
        entity.setDataTransformationRules(mapToJson(dto.dataTransformationRules()));
        entity.setValidationRules(mapToJson(dto.validationRules()));
        entity.setConflictResolutionStrategy(dto.conflictResolutionStrategy());
        entity.setActive(dto.isActive());
        entity.setEnabled(dto.isEnabled());
        entity.setMonitoringEnabled(dto.monitoringEnabled());
        entity.setNotificationSettings(mapToJson(dto.notificationSettings()));
        entity.setPerformanceMetrics(mapToJson(dto.performanceMetrics()));
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseJsonToMap(String json) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, Map.class);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    private String mapToJson(Map<String, Object> map) {
        if (map == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
} 
package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CurriculumIntegrationDTO;
import com.ohma.thutothebe.entity.CurriculumIntegration;

import java.util.List;
import java.util.Map;

public interface CurriculumIntegrationService extends BaseService<CurriculumIntegrationDTO, Long> {

    // Integration Configuration
    CurriculumIntegrationDTO configureIntegration(CurriculumIntegrationDTO integrationData);
    
    CurriculumIntegrationDTO updateIntegrationConfiguration(Long integrationId, CurriculumIntegrationDTO integrationData);
    
    List<CurriculumIntegrationDTO> getIntegrationsByCurriculum(Long curriculumId);
    
    List<CurriculumIntegrationDTO> getIntegrationsByType(CurriculumIntegration.IntegrationType integrationType);
    
    List<CurriculumIntegrationDTO> getActiveIntegrations();
    
    // Synchronization Operations
    Map<String, Object> triggerSync(Long integrationId, Long triggeredById);
    
    Map<String, Object> scheduleSync(Long integrationId, String frequency, Long scheduledById);
    
    void pauseSync(Long integrationId, Long pausedById);
    
    void resumeSync(Long integrationId, Long resumedById);
    
    void cancelSync(Long integrationId, Long cancelledById);
    
    // Sync Status and Monitoring
    CurriculumIntegration.SyncStatus getSyncStatus(Long integrationId);
    
    Map<String, Object> getSyncHistory(Long integrationId, int limit);
    
    Map<String, Object> getSyncStatistics(Long integrationId);
    
    List<Map<String, Object>> getFailedSyncs(Long curriculumId);
    
    // Error Handling and Recovery
    void retryFailedSync(Long integrationId, Long retriedById);
    
    void resetErrorCount(Long integrationId);
    
    Map<String, Object> diagnoseIntegrationIssues(Long integrationId);
    
    void resolveIntegrationError(Long integrationId, String resolution, Long resolvedById);
    
    // Data Transformation and Validation
    Map<String, Object> validateMappingConfiguration(Long integrationId);
    
    Map<String, Object> testDataTransformation(Long integrationId, Map<String, Object> sampleData);
    
    Map<String, Object> previewSyncChanges(Long integrationId);
    
    // Webhook Management
    String generateWebhookSecret(Long integrationId);
    
    boolean validateWebhookSignature(Long integrationId, String payload, String signature);
    
    void processWebhookEvent(Long integrationId, Map<String, Object> eventData);
    
    // Integration Analytics
    Map<String, Object> getIntegrationPerformanceMetrics(Long integrationId);
    
    Map<String, Object> getDataFlowAnalytics(Long curriculumId);
    
    List<Map<String, Object>> getIntegrationUsageStatistics();
    
    // External System Communication
    Map<String, Object> testConnection(Long integrationId);
    
    Map<String, Object> fetchExternalData(Long integrationId, Map<String, Object> parameters);
    
    Map<String, Object> pushDataToExternal(Long integrationId, Map<String, Object> data);
    
    // Configuration Management
    void enableIntegration(Long integrationId, Long enabledById);
    
    void disableIntegration(Long integrationId, Long disabledById);
    
    CurriculumIntegrationDTO cloneIntegration(Long integrationId, Long curriculumId, Long clonedById);
    
    void deleteIntegration(Long integrationId, Long deletedById);
    
    // Monitoring and Alerts
    void enableMonitoring(Long integrationId);
    
    void disableMonitoring(Long integrationId);
    
    void configureAlerts(Long integrationId, Map<String, Object> alertSettings);
    
    List<Map<String, Object>> getIntegrationAlerts(Long curriculumId);
} 
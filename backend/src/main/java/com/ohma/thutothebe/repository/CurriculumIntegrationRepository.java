package com.ohma.thutothebe.repository;

import com.ohma.thutothebe.entity.CurriculumIntegration;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CurriculumIntegrationRepository extends JpaRepository<CurriculumIntegration, Long> {

    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findByCurriculumIdAndIsActiveOrderByConfiguredAtDesc(Long curriculumId, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findByIntegrationTypeAndIsActiveOrderByConfiguredAtDesc(
            CurriculumIntegration.IntegrationType integrationType, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findByIsActiveAndIsEnabledOrderByConfiguredAtDesc(boolean isActive, boolean isEnabled);

    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findBySyncStatusAndIsActiveOrderByLastSyncAtDesc(
            CurriculumIntegration.SyncStatus syncStatus, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findByExternalSystemNameAndIsActiveOrderByConfiguredAtDesc(
            String externalSystemName, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findByExternalSystemIdAndIsActiveOrderByConfiguredAtDesc(
            String externalSystemId, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findBySyncDirectionAndIsActiveOrderByConfiguredAtDesc(
            CurriculumIntegration.SyncDirection syncDirection, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findByNextSyncAtBeforeAndIsActiveAndIsEnabledOrderByNextSyncAtAsc(
            LocalDateTime dateTime, boolean isActive, boolean isEnabled);

    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findByLastSyncAtAfterAndIsActiveOrderByLastSyncAtDesc(
            LocalDateTime dateTime, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findByErrorCountGreaterThanAndIsActiveOrderByErrorCountDesc(
            Integer errorCount, boolean isActive);

    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findByMonitoringEnabledAndIsActiveOrderByConfiguredAtDesc(
            boolean monitoringEnabled, boolean isActive);

    @Query("SELECT ci FROM CurriculumIntegration ci WHERE ci.curriculum.id = :curriculumId AND ci.integrationType = :type AND ci.isActive = true ORDER BY ci.configuredAt DESC")
    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findByCurriculumIdAndIntegrationType(
            @Param("curriculumId") Long curriculumId, 
            @Param("type") CurriculumIntegration.IntegrationType type);

    @Query("SELECT ci FROM CurriculumIntegration ci WHERE ci.syncStatus = 'FAILED' AND ci.isActive = true ORDER BY ci.lastSyncAt DESC")
    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findFailedIntegrations();

    @Query("SELECT ci FROM CurriculumIntegration ci WHERE ci.curriculum.id = :curriculumId AND ci.syncStatus = 'FAILED' AND ci.isActive = true ORDER BY ci.lastSyncAt DESC")
    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findFailedIntegrationsByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT ci FROM CurriculumIntegration ci WHERE ci.retryCount < ci.maxRetries AND ci.syncStatus = 'FAILED' AND ci.isActive = true ORDER BY ci.lastSyncAt ASC")
    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findRetryableIntegrations();

    @Query("SELECT ci FROM CurriculumIntegration ci WHERE ci.webhookUrl IS NOT NULL AND ci.isActive = true ORDER BY ci.configuredAt DESC")
    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findWebhookEnabledIntegrations();

    @Query("SELECT COUNT(ci) FROM CurriculumIntegration ci WHERE ci.curriculum.id = :curriculumId AND ci.isActive = true")
    Long countByCurriculumId(@Param("curriculumId") Long curriculumId);

    @Query("SELECT COUNT(ci) FROM CurriculumIntegration ci WHERE ci.integrationType = :type AND ci.isActive = true")
    Long countByIntegrationType(@Param("type") CurriculumIntegration.IntegrationType type);

    @Query("SELECT COUNT(ci) FROM CurriculumIntegration ci WHERE ci.syncStatus = :status AND ci.isActive = true")
    Long countBySyncStatus(@Param("status") CurriculumIntegration.SyncStatus status);

    boolean existsByCurriculumIdAndExternalSystemIdAndIsActive(Long curriculumId, String externalSystemId, boolean isActive);

    boolean existsByExternalSystemNameAndExternalSystemIdAndIsActive(String externalSystemName, String externalSystemId, boolean isActive);

    @Query("SELECT ci FROM CurriculumIntegration ci WHERE ci.curriculum.id IN :curriculumIds AND ci.isActive = true ORDER BY ci.configuredAt DESC")
    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findByMultipleCurriculumIds(@Param("curriculumIds") List<Long> curriculumIds);

    @Query("SELECT DISTINCT ci.externalSystemName FROM CurriculumIntegration ci WHERE ci.isActive = true ORDER BY ci.externalSystemName")
    List<String> findDistinctExternalSystemNames();

    @Query("SELECT ci FROM CurriculumIntegration ci WHERE ci.configuredAt BETWEEN :startDate AND :endDate AND ci.isActive = true ORDER BY ci.configuredAt DESC")
    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findByConfiguredAtBetween(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT ci FROM CurriculumIntegration ci WHERE ci.lastSyncAt BETWEEN :startDate AND :endDate AND ci.isActive = true ORDER BY ci.lastSyncAt DESC")
    @EntityGraph(attributePaths = {"curriculum", "configuredBy"})
    List<CurriculumIntegration> findByLastSyncAtBetween(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
} 
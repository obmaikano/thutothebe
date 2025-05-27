package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CurriculumVersionDTO;
import com.ohma.thutothebe.dto.CurriculumComparisonDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface CurriculumVersionService extends BaseService<CurriculumVersionDTO, Long> {

    // Version Management
    CurriculumVersionDTO createVersion(Long curriculumId, String versionName, String description, boolean isMajorVersion, Long createdById);
    
    CurriculumVersionDTO createSnapshotVersion(Long curriculumId, String versionName, String changeSummary, Long createdById);
    
    List<CurriculumVersionDTO> getVersionsByCurriculumId(Long curriculumId);
    
    CurriculumVersionDTO getCurrentVersion(Long curriculumId);
    
    CurriculumVersionDTO getVersionByNumber(Long curriculumId, Integer versionNumber);
    
    List<CurriculumVersionDTO> getMajorVersions(Long curriculumId);
    
    // Version Comparison
    CurriculumComparisonDTO compareVersions(Long sourceVersionId, Long targetVersionId, Long comparedById);
    
    CurriculumComparisonDTO compareWithCurrent(Long versionId, Long comparedById);
    
    List<CurriculumComparisonDTO> getVersionHistory(Long curriculumId, Integer startVersion, Integer endVersion);
    
    // Version Operations
    CurriculumVersionDTO setCurrentVersion(Long versionId, Long userId);
    
    CurriculumVersionDTO revertToVersion(Long curriculumId, Long versionId, String reason, Long userId);
    
    CurriculumVersionDTO mergeVersions(Long baseVersionId, Long sourceVersionId, String mergeStrategy, Long userId);
    
    // Version Search and Filtering
    List<CurriculumVersionDTO> findVersionsByTag(Long curriculumId, String tag);
    
    List<CurriculumVersionDTO> findVersionsCreatedBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<CurriculumVersionDTO> findVersionsByCreator(Long userId);
    
    // Version Analytics
    Long getVersionCount(Long curriculumId);
    
    Double calculateSimilarityScore(Long version1Id, Long version2Id);
    
    List<String> getChangesSummary(Long curriculumId, Integer fromVersion, Integer toVersion);
    
    // Version Export/Import
    String exportVersion(Long versionId, String format); // JSON, XML, PDF
    
    CurriculumVersionDTO importVersion(Long curriculumId, String versionData, String format, Long importedById);
    
    // Version Validation
    boolean validateVersionIntegrity(Long versionId);
    
    String generateChecksum(Long versionId);
    
    boolean verifyChecksum(Long versionId, String expectedChecksum);
} 
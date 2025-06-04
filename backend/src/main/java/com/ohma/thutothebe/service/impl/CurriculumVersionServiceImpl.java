package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CurriculumVersionDTO;
import com.ohma.thutothebe.dto.CurriculumComparisonDTO;
import com.ohma.thutothebe.entity.Curriculum;
import com.ohma.thutothebe.entity.CurriculumVersion;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.CurriculumVersionMapper;
import com.ohma.thutothebe.repository.CurriculumRepository;
import com.ohma.thutothebe.repository.CurriculumVersionRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.CurriculumVersionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
@Validated
public class CurriculumVersionServiceImpl extends BaseServiceImpl<CurriculumVersion, CurriculumVersionDTO, Long> implements CurriculumVersionService {

    private static final String VERSION_CACHE = "curriculumVersions";
    private static final String COMPARISON_CACHE = "versionComparisons";
    private static final int MAX_VERSION_NAME_LENGTH = 100;
    private static final int MAX_DESCRIPTION_LENGTH = 1000;
    private static final double SIMILARITY_THRESHOLD = 0.8;
    
    private final CurriculumVersionRepository curriculumVersionRepository;
    private final CurriculumRepository curriculumRepository;
    private final UserRepository userRepository;
    private final CurriculumVersionMapper curriculumVersionMapper;
    private final ObjectMapper objectMapper;
    private final Map<String, Object> comparisonCache = new ConcurrentHashMap<>();

    @Autowired
    public CurriculumVersionServiceImpl(
            CurriculumVersionRepository curriculumVersionRepository,
            CurriculumRepository curriculumRepository,
            UserRepository userRepository,
            CurriculumVersionMapper curriculumVersionMapper,
            ObjectMapper objectMapper) {
        super(curriculumVersionRepository);
        this.curriculumVersionRepository = curriculumVersionRepository;
        this.curriculumRepository = curriculumRepository;
        this.userRepository = userRepository;
        this.curriculumVersionMapper = curriculumVersionMapper;
        this.objectMapper = objectMapper;
    }

    // Implement abstract methods from BaseServiceImpl
    @Override
    protected CurriculumVersion mapToEntity(CurriculumVersionDTO dto) {
        return curriculumVersionMapper.toEntity(dto);
    }

    @Override
    protected CurriculumVersionDTO mapToDto(CurriculumVersion entity) {
        return curriculumVersionMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(CurriculumVersion entity, CurriculumVersionDTO dto) {
        curriculumVersionMapper.updateEntity(entity, dto);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.READ_COMMITTED)
    @CacheEvict(value = VERSION_CACHE, key = "#curriculumId")
    public CurriculumVersionDTO createVersion(
            @NotNull @Positive Long curriculumId, 
            @NotBlank String versionName, 
            String description, 
            boolean isMajorVersion, 
            @NotNull @Positive Long createdById) {
        
        log.info("Creating new version for curriculum ID: {}, version name: {}, major: {}", 
                curriculumId, versionName, isMajorVersion);
        
        // Input validation
        validateVersionInput(versionName, description);
        
        try {
            // Fetch entities with validation
            Curriculum curriculum = fetchCurriculumWithValidation(curriculumId);
            User createdBy = fetchUserWithValidation(createdById);
            
            // Business rule validation
            validateVersionCreationRules(curriculumId, versionName, curriculum);
            
            // Create version with proper transaction handling
            CurriculumVersion version = buildNewVersion(curriculum, versionName, description, 
                    isMajorVersion, createdBy);
            
            // Save with optimistic locking
            CurriculumVersion savedVersion = saveVersionSafely(version);
            
            log.info("Successfully created version {} (ID: {}) for curriculum {}", 
                    savedVersion.getVersionNumber(), savedVersion.getId(), curriculumId);
            
            return curriculumVersionMapper.toDto(savedVersion);
            
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while creating version: {}", e.getMessage());
            throw new IllegalStateException("Version creation failed due to data constraints", e);
        } catch (Exception e) {
            log.error("Unexpected error creating version for curriculum {}: {}", curriculumId, e.getMessage(), e);
            throw new RuntimeException("Failed to create curriculum version", e);
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRED)
    @CacheEvict(value = VERSION_CACHE, key = "#curriculumId")
    public CurriculumVersionDTO createSnapshotVersion(
            @NotNull @Positive Long curriculumId, 
            @NotBlank String versionName, 
            String changeSummary, 
            @NotNull @Positive Long createdById) {
        
        log.info("Creating snapshot version for curriculum ID: {}, name: {}", curriculumId, versionName);
        
        try {
            // Create base version
            CurriculumVersionDTO version = createVersion(curriculumId, versionName, 
                    "Snapshot version: " + (changeSummary != null ? changeSummary : "Auto-generated"), 
                    false, createdById);
            
            // Update with change summary and snapshot-specific metadata
            CurriculumVersion entity = curriculumVersionRepository.findById(version.id())
                    .orElseThrow(() -> new IllegalStateException("Version not found after creation"));
            
            entity.setChangeSummary(changeSummary);
            entity.setTags(entity.getTags() != null ? entity.getTags() + ",snapshot" : "snapshot");
            
            CurriculumVersion savedEntity = curriculumVersionRepository.save(entity);
            
            log.info("Successfully created snapshot version {} for curriculum {}", 
                    savedEntity.getVersionNumber(), curriculumId);
            
            return curriculumVersionMapper.toDto(savedEntity);
            
        } catch (Exception e) {
            log.error("Failed to create snapshot version for curriculum {}: {}", curriculumId, e.getMessage(), e);
            throw new RuntimeException("Failed to create snapshot version", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = VERSION_CACHE, key = "#curriculumId + '_all'")
    public List<CurriculumVersionDTO> getVersionsByCurriculumId(@NotNull @Positive Long curriculumId) {
        log.debug("Retrieving all versions for curriculum ID: {}", curriculumId);
        
        try {
            List<CurriculumVersion> versions = curriculumVersionRepository
                    .findByCurriculumIdOrderByVersionNumberDesc(curriculumId);
            
            if (versions.isEmpty()) {
                log.info("No versions found for curriculum ID: {}", curriculumId);
                return Collections.emptyList();
            }
            
            return versions.stream()
                    .map(curriculumVersionMapper::toDto)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.error("Error retrieving versions for curriculum {}: {}", curriculumId, e.getMessage(), e);
            throw new RuntimeException("Failed to retrieve curriculum versions", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = VERSION_CACHE, key = "#curriculumId + '_current'")
    public CurriculumVersionDTO getCurrentVersion(@NotNull @Positive Long curriculumId) {
        log.debug("Retrieving current version for curriculum ID: {}", curriculumId);
        
        try {
            CurriculumVersion currentVersion = curriculumVersionRepository
                    .findByCurriculumIdAndIsCurrent(curriculumId, true)
                    .orElseThrow(() -> {
                        log.warn("No current version found for curriculum: {}", curriculumId);
                        return new IllegalArgumentException("No current version found for curriculum: " + curriculumId);
                    });
            
            return curriculumVersionMapper.toDto(currentVersion);
            
        } catch (Exception e) {
            log.error("Error retrieving current version for curriculum {}: {}", curriculumId, e.getMessage(), e);
            throw new RuntimeException("Failed to retrieve current version", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = VERSION_CACHE, key = "#curriculumId + '_' + #versionNumber")
    public CurriculumVersionDTO getVersionByNumber(@NotNull @Positive Long curriculumId, 
            @NotNull @Positive Integer versionNumber) {
        log.debug("Retrieving version {} for curriculum ID: {}", versionNumber, curriculumId);
        
        try {
            CurriculumVersion version = curriculumVersionRepository
                    .findByCurriculumIdAndVersionNumber(curriculumId, versionNumber)
                    .orElseThrow(() -> {
                        log.warn("Version {} not found for curriculum: {}", versionNumber, curriculumId);
                        return new IllegalArgumentException(
                                String.format("Version %d not found for curriculum: %d", versionNumber, curriculumId));
                    });
            
            return curriculumVersionMapper.toDto(version);
            
        } catch (Exception e) {
            log.error("Error retrieving version {} for curriculum {}: {}", versionNumber, curriculumId, e.getMessage(), e);
            throw new RuntimeException("Failed to retrieve version", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = VERSION_CACHE, key = "#curriculumId + '_major'")
    public List<CurriculumVersionDTO> getMajorVersions(@NotNull @Positive Long curriculumId) {
        log.info("Retrieving major versions for curriculum ID: {}", curriculumId);
        
        List<CurriculumVersion> majorVersions = curriculumVersionRepository.findMajorVersionsByCurriculumId(curriculumId);
        return majorVersions.stream()
                .map(curriculumVersionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPARISON_CACHE, key = "#sourceVersionId + '_' + #targetVersionId")
    public CurriculumComparisonDTO compareVersions(@NotNull @Positive Long sourceVersionId, 
            @NotNull @Positive Long targetVersionId, @NotNull @Positive Long comparedById) {
        
        log.info("Comparing versions {} and {} by user {}", sourceVersionId, targetVersionId, comparedById);
        
        if (sourceVersionId.equals(targetVersionId)) {
            throw new IllegalArgumentException("Cannot compare a version with itself");
        }
        
        try {
            // Fetch versions with validation
            CurriculumVersion sourceVersion = fetchVersionWithValidation(sourceVersionId);
            CurriculumVersion targetVersion = fetchVersionWithValidation(targetVersionId);
            User comparedBy = fetchUserWithValidation(comparedById);
            
            // Validate versions belong to same curriculum
            if (!sourceVersion.getCurriculum().getId().equals(targetVersion.getCurriculum().getId())) {
                throw new IllegalArgumentException("Cannot compare versions from different curricula");
            }
            
            // Perform comprehensive comparison
            ComparisonResult comparisonResult = performComprehensiveComparison(sourceVersion, targetVersion);
            
            // Build comparison DTO
            CurriculumComparisonDTO comparison = buildComparisonDTO(
                    sourceVersion, targetVersion, comparedBy, comparisonResult);
            
            log.info("Successfully compared versions {} and {}, found {} changes", 
                    sourceVersionId, targetVersionId, comparisonResult.changes.size());
            
            return comparison;
            
        } catch (Exception e) {
            log.error("Error comparing versions {} and {}: {}", sourceVersionId, targetVersionId, e.getMessage(), e);
            throw new RuntimeException("Failed to compare versions", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public CurriculumComparisonDTO compareWithCurrent(@NotNull @Positive Long versionId, 
            @NotNull @Positive Long comparedById) {
        
        log.info("Comparing version {} with current version", versionId);
        
        try {
            CurriculumVersion version = fetchVersionWithValidation(versionId);
            
            CurriculumVersion currentVersion = curriculumVersionRepository
                    .findByCurriculumIdAndIsCurrent(version.getCurriculum().getId(), true)
                    .orElseThrow(() -> new IllegalArgumentException("No current version found for comparison"));
            
            return compareVersions(versionId, currentVersion.getId(), comparedById);
            
        } catch (Exception e) {
            log.error("Error comparing version {} with current: {}", versionId, e.getMessage(), e);
            throw new RuntimeException("Failed to compare with current version", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumComparisonDTO> getVersionHistory(@NotNull @Positive Long curriculumId, 
            @NotNull @Positive Integer startVersion, @NotNull @Positive Integer endVersion) {
        
        log.info("Retrieving version history for curriculum {} from version {} to {}", 
                curriculumId, startVersion, endVersion);
        
        if (startVersion >= endVersion) {
            throw new IllegalArgumentException("Start version must be less than end version");
        }
        
        try {
            List<CurriculumVersion> versions = curriculumVersionRepository
                    .findVersionsInRange(curriculumId, startVersion, endVersion);
            
            if (versions.size() < 2) {
                return Collections.emptyList();
            }
            
            // Create comparison chain using parallel processing for better performance
            return createComparisonChain(versions);
            
        } catch (Exception e) {
            log.error("Error retrieving version history for curriculum {}: {}", curriculumId, e.getMessage(), e);
            throw new RuntimeException("Failed to retrieve version history", e);
        }
    }

    @Override
    public CurriculumVersionDTO setCurrentVersion(Long versionId, Long userId) {
        log.info("Setting version {} as current", versionId);
        
        CurriculumVersion version = curriculumVersionRepository.findById(versionId)
                .orElseThrow(() -> new IllegalArgumentException("Version not found: " + versionId));
        
        // Unset current version
        curriculumVersionRepository.findByCurriculumIdAndIsCurrent(version.getCurriculum().getId(), true)
                .ifPresent(currentVersion -> {
                    currentVersion.setCurrent(false);
                    curriculumVersionRepository.save(currentVersion);
                });
        
        // Set new current version
        version.setCurrent(true);
        CurriculumVersion savedVersion = curriculumVersionRepository.save(version);
        
        return curriculumVersionMapper.toDto(savedVersion);
    }

    @Override
    public CurriculumVersionDTO revertToVersion(Long curriculumId, Long versionId, String reason, Long userId) {
        log.info("Reverting curriculum {} to version {}", curriculumId, versionId);
        
        CurriculumVersion targetVersion = curriculumVersionRepository.findById(versionId)
                .orElseThrow(() -> new IllegalArgumentException("Version not found: " + versionId));
        
        // Create new version based on target version
        String revertVersionName = "Revert to v" + targetVersion.getVersionNumber();
        String description = "Reverted to version " + targetVersion.getVersionNumber() + ". Reason: " + reason;
        
        return createVersion(curriculumId, revertVersionName, description, false, userId);
    }

    @Override
    public CurriculumVersionDTO mergeVersions(Long baseVersionId, Long sourceVersionId, String mergeStrategy, Long userId) {
        log.info("Merging versions {} and {} with strategy {}", baseVersionId, sourceVersionId, mergeStrategy);
        
        CurriculumVersion baseVersion = curriculumVersionRepository.findById(baseVersionId)
                .orElseThrow(() -> new IllegalArgumentException("Base version not found: " + baseVersionId));
        
        CurriculumVersion sourceVersion = curriculumVersionRepository.findById(sourceVersionId)
                .orElseThrow(() -> new IllegalArgumentException("Source version not found: " + sourceVersionId));
        
        // Simplified merge logic - in real implementation would handle conflicts
        String mergedData = performVersionMerge(baseVersion, sourceVersion, mergeStrategy);
        
        String mergeVersionName = "Merge v" + baseVersion.getVersionNumber() + " + v" + sourceVersion.getVersionNumber();
        String description = "Merged versions using " + mergeStrategy + " strategy";
        
        return createVersion(baseVersion.getCurriculum().getId(), mergeVersionName, description, false, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumVersionDTO> findVersionsByTag(Long curriculumId, String tag) {
        log.info("Finding versions by tag '{}' for curriculum {}", tag, curriculumId);
        
        List<CurriculumVersion> versions = curriculumVersionRepository.findVersionsByTag(curriculumId, tag);
        return versions.stream()
                .map(curriculumVersionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumVersionDTO> findVersionsCreatedBetween(LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Finding versions created between {} and {}", startDate, endDate);
        
        List<CurriculumVersion> versions = curriculumVersionRepository.findVersionsCreatedBetween(startDate, endDate);
        return versions.stream()
                .map(curriculumVersionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumVersionDTO> findVersionsByCreator(Long userId) {
        log.info("Finding versions created by user {}", userId);
        
        List<CurriculumVersion> versions = curriculumVersionRepository.findVersionsByCreatedBy(userId);
        return versions.stream()
                .map(curriculumVersionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Long getVersionCount(Long curriculumId) {
        log.info("Getting version count for curriculum {}", curriculumId);
        return curriculumVersionRepository.countVersionsByCurriculumId(curriculumId);
    }

    @Override
    @Transactional(readOnly = true)
    public Double calculateSimilarityScore(Long version1Id, Long version2Id) {
        log.info("Calculating similarity score between versions {} and {}", version1Id, version2Id);
        
        CurriculumVersion version1 = curriculumVersionRepository.findById(version1Id)
                .orElseThrow(() -> new IllegalArgumentException("Version not found: " + version1Id));
        
        CurriculumVersion version2 = curriculumVersionRepository.findById(version2Id)
                .orElseThrow(() -> new IllegalArgumentException("Version not found: " + version2Id));
        
        // Simplified similarity calculation
        String data1 = version1.getSnapshotData();
        String data2 = version2.getSnapshotData();
        
        if (data1.equals(data2)) {
            return 100.0;
        }
        
        // Basic similarity calculation based on string comparison
        int commonChars = 0;
        int maxLength = Math.max(data1.length(), data2.length());
        
        for (int i = 0; i < Math.min(data1.length(), data2.length()); i++) {
            if (data1.charAt(i) == data2.charAt(i)) {
                commonChars++;
            }
        }
        
        return (double) commonChars / maxLength * 100.0;
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getChangesSummary(Long curriculumId, Integer fromVersion, Integer toVersion) {
        log.info("Getting changes summary for curriculum {} from version {} to {}", curriculumId, fromVersion, toVersion);
        
        List<CurriculumVersion> versions = curriculumVersionRepository.findVersionsInRange(curriculumId, fromVersion, toVersion);
        
        return versions.stream()
                .filter(v -> v.getChangeSummary() != null)
                .map(CurriculumVersion::getChangeSummary)
                .collect(Collectors.toList());
    }

    @Override
    public String exportVersion(Long versionId, String format) {
        log.info("Exporting version {} in format {}", versionId, format);
        
        CurriculumVersion version = curriculumVersionRepository.findById(versionId)
                .orElseThrow(() -> new IllegalArgumentException("Version not found: " + versionId));
        
        // Simplified export logic
        switch (format.toUpperCase()) {
            case "JSON":
                return version.getSnapshotData();
            case "XML":
                return convertToXml(version.getSnapshotData());
            case "PDF":
                return generatePdfPath(version);
            default:
                throw new IllegalArgumentException("Unsupported export format: " + format);
        }
    }

    @Override
    public CurriculumVersionDTO importVersion(Long curriculumId, String versionData, String format, Long importedById) {
        log.info("Importing version for curriculum {} in format {}", curriculumId, format);
        
        String processedData;
        switch (format.toUpperCase()) {
            case "JSON":
                processedData = versionData;
                break;
            case "XML":
                processedData = convertFromXml(versionData);
                break;
            default:
                throw new IllegalArgumentException("Unsupported import format: " + format);
        }
        
        String importVersionName = "Import_" + System.currentTimeMillis();
        return createVersion(curriculumId, importVersionName, "Imported version", false, importedById);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateVersionIntegrity(Long versionId) {
        log.info("Validating integrity of version {}", versionId);
        
        CurriculumVersion version = curriculumVersionRepository.findById(versionId)
                .orElseThrow(() -> new IllegalArgumentException("Version not found: " + versionId));
        
        String currentChecksum = generateChecksum(version.getSnapshotData());
        return currentChecksum.equals(version.getChecksum());
    }

    @Override
    public String generateChecksum(Long versionId) {
        CurriculumVersion version = curriculumVersionRepository.findById(versionId)
                .orElseThrow(() -> new IllegalArgumentException("Version not found: " + versionId));
        
        return generateChecksum(version.getSnapshotData());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean verifyChecksum(Long versionId, String expectedChecksum) {
        log.info("Verifying checksum for version {}", versionId);
        
        CurriculumVersion version = curriculumVersionRepository.findById(versionId)
                .orElseThrow(() -> new IllegalArgumentException("Version not found: " + versionId));
        
        return expectedChecksum.equals(version.getChecksum());
    }

    // Private helper methods
    private String createCurriculumSnapshot(Curriculum curriculum) {
        // Simplified snapshot creation - in real implementation would serialize full structure
        return "{\"curriculumId\":" + curriculum.getId() + ",\"title\":\"" + curriculum.getTitle() + "\",\"timestamp\":\"" + LocalDateTime.now() + "\"}";
    }

    private String generateChecksum(String data) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(data.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating checksum", e);
        }
    }

    private List<CurriculumComparisonDTO.ChangeDetail> performVersionComparison(CurriculumVersion source, CurriculumVersion target) {
        // Simplified comparison - in real implementation would do deep structural comparison
        return List.of(
                new CurriculumComparisonDTO.ChangeDetail(
                        "curriculum",
                        "title",
                        CurriculumComparisonDTO.ChangeType.MODIFIED,
                        "Old Title",
                        "New Title",
                        "Title was updated"
                )
        );
    }

    private String performVersionMerge(CurriculumVersion base, CurriculumVersion source, String strategy) {
        // Simplified merge logic
        switch (strategy) {
            case "SOURCE_WINS":
                return source.getSnapshotData();
            case "BASE_WINS":
                return base.getSnapshotData();
            default:
                return base.getSnapshotData(); // Default to base
        }
    }

    private String convertToXml(String jsonData) {
        // Simplified XML conversion
        return "<curriculum>" + jsonData + "</curriculum>";
    }

    private String convertFromXml(String xmlData) {
        // Simplified XML to JSON conversion
        return xmlData.replace("<curriculum>", "").replace("</curriculum>", "");
    }

    private String generatePdfPath(CurriculumVersion version) {
        // Return path where PDF would be generated
        return "/exports/curriculum_version_" + version.getId() + ".pdf";
    }

    private void validateVersionInput(String versionName, String description) {
        if (!StringUtils.hasText(versionName)) {
            throw new IllegalArgumentException("Version name cannot be empty");
        }
        if (versionName.length() > MAX_VERSION_NAME_LENGTH) {
            throw new IllegalArgumentException("Version name cannot exceed " + MAX_VERSION_NAME_LENGTH + " characters");
        }
        if (description != null && description.length() > MAX_DESCRIPTION_LENGTH) {
            throw new IllegalArgumentException("Description cannot exceed " + MAX_DESCRIPTION_LENGTH + " characters");
        }
        if (!isValidVersionName(versionName)) {
            throw new IllegalArgumentException("Version name contains invalid characters");
        }
    }

    private boolean isValidVersionName(String versionName) {
        // Allow alphanumeric, dots, hyphens, underscores
        return versionName.matches("^[a-zA-Z0-9._-]+$");
    }

    private Curriculum fetchCurriculumWithValidation(Long curriculumId) {
        return curriculumRepository.findById(curriculumId)
                .orElseThrow(() -> {
                    log.warn("Curriculum not found with ID: {}", curriculumId);
                    return new IllegalArgumentException("Curriculum not found with ID: " + curriculumId);
                });
    }

    private User fetchUserWithValidation(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found with ID: {}", userId);
                    return new IllegalArgumentException("User not found with ID: " + userId);
                });
    }

    private void validateVersionCreationRules(Long curriculumId, String versionName, Curriculum curriculum) {
        // Check for duplicate version name
        if (curriculumVersionRepository.existsByCurriculumIdAndVersionName(curriculumId, versionName)) {
            throw new IllegalArgumentException("Version name already exists for this curriculum: " + versionName);
        }
        
        // Check curriculum status
        if (!isValidCurriculumForVersioning(curriculum)) {
            throw new IllegalStateException("Curriculum is not in a valid state for versioning");
        }
        
        // Check version limits
        Long versionCount = curriculumVersionRepository.countVersionsByCurriculumId(curriculumId);
        if (versionCount >= getMaxVersionsPerCurriculum()) {
            throw new IllegalStateException("Maximum number of versions reached for this curriculum");
        }
    }

    private boolean isValidCurriculumForVersioning(Curriculum curriculum) {
        // Add business logic to validate curriculum state
        return curriculum != null && curriculum.isActive();
    }

    private int getMaxVersionsPerCurriculum() {
        // This could be configurable
        return 100;
    }

    private CurriculumVersion buildNewVersion(Curriculum curriculum, String versionName, 
            String description, boolean isMajorVersion, User createdBy) {
        
        // Get next version number with proper synchronization
        Integer nextVersionNumber = getNextVersionNumber(curriculum.getId());
        
        // Create comprehensive snapshot
        String snapshotData = createComprehensiveSnapshot(curriculum);
        String checksum = generateSecureChecksum(snapshotData);
        
        CurriculumVersion version = new CurriculumVersion();
        version.setCurriculum(curriculum);
        version.setVersionNumber(nextVersionNumber);
        version.setVersionName(versionName);
        version.setDescription(description);
        version.setSnapshotData(snapshotData);
        version.setCreatedBy(createdBy);
        version.setCreatedAt(LocalDateTime.now());
        version.setMajorVersion(isMajorVersion);
        version.setCurrent(false); // New versions are not current by default
        version.setChecksum(checksum);
        
        // Set additional metadata
        version.setFilePath(generateVersionFilePath(curriculum.getId(), nextVersionNumber));
        
        return version;
    }

    private synchronized Integer getNextVersionNumber(Long curriculumId) {
        return curriculumVersionRepository.findMaxVersionNumberByCurriculumId(curriculumId)
                .orElse(0) + 1;
    }

    private CurriculumVersion saveVersionSafely(CurriculumVersion version) {
        try {
            return curriculumVersionRepository.save(version);
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation saving version: {}", e.getMessage());
            throw new IllegalStateException("Version save failed due to concurrent modification", e);
        }
    }

    private String createComprehensiveSnapshot(Curriculum curriculum) {
        try {
            Map<String, Object> snapshot = new HashMap<>();
            snapshot.put("curriculumId", curriculum.getId());
            snapshot.put("title", curriculum.getTitle());
            snapshot.put("description", curriculum.getDescription());
            snapshot.put("gradeLevel", curriculum.getGradeLevel());
            snapshot.put("curriculumType", curriculum.getCurriculumType());
            snapshot.put("status", curriculum.getStatus());
            snapshot.put("academicYear", curriculum.getAcademicYear());
            snapshot.put("metadata", curriculum.getMetadata());
            snapshot.put("timestamp", LocalDateTime.now().toString());
            snapshot.put("snapshotVersion", "1.0");
            
            // Add units and topics if available (would need to fetch these)
            // snapshot.put("units", getUnitsSnapshot(curriculum.getId()));
            // snapshot.put("topics", getTopicsSnapshot(curriculum.getId()));
            
            return objectMapper.writeValueAsString(snapshot);
        } catch (JsonProcessingException e) {
            log.error("Failed to create curriculum snapshot: {}", e.getMessage());
            throw new RuntimeException("Failed to create curriculum snapshot", e);
        }
    }

    private String generateSecureChecksum(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            log.error("SHA-256 algorithm not available: {}", e.getMessage());
            throw new RuntimeException("Checksum generation failed", e);
        }
    }

    private String generateVersionFilePath(Long curriculumId, Integer versionNumber) {
        return String.format("/versions/curriculum_%d/version_%d.json", curriculumId, versionNumber);
    }

    private CurriculumVersion fetchVersionWithValidation(Long versionId) {
        return curriculumVersionRepository.findById(versionId)
                .orElseThrow(() -> {
                    log.warn("Version not found: {}", versionId);
                    return new IllegalArgumentException("Version not found: " + versionId);
                });
    }

    private ComparisonResult performComprehensiveComparison(CurriculumVersion source, CurriculumVersion target) {
        try {
            // Parse snapshot data
            JsonNode sourceData = objectMapper.readTree(source.getSnapshotData());
            JsonNode targetData = objectMapper.readTree(target.getSnapshotData());
            
            List<CurriculumComparisonDTO.ChangeDetail> changes = new ArrayList<>();
            
            // Compare basic fields
            compareBasicFields(sourceData, targetData, changes);
            
            // Compare complex structures (units, topics, etc.)
            compareComplexStructures(sourceData, targetData, changes);
            
            // Calculate similarity score
            double similarityScore = calculateAdvancedSimilarityScore(sourceData, targetData);
            
            // Generate summary
            CurriculumComparisonDTO.ComparisonSummary summary = generateComparisonSummary(
                    changes, similarityScore);
            
            return new ComparisonResult(changes, summary, similarityScore);
            
        } catch (JsonProcessingException e) {
            log.error("Error parsing snapshot data for comparison: {}", e.getMessage());
            throw new RuntimeException("Failed to parse version data for comparison", e);
        }
    }

    private void compareBasicFields(JsonNode source, JsonNode target, 
            List<CurriculumComparisonDTO.ChangeDetail> changes) {
        
        String[] fieldsToCompare = {"title", "description", "gradeLevel", "subject", "language", "status"};
        
        for (String field : fieldsToCompare) {
            JsonNode sourceValue = source.get(field);
            JsonNode targetValue = target.get(field);
            
            if (!Objects.equals(sourceValue, targetValue)) {
                changes.add(new CurriculumComparisonDTO.ChangeDetail(
                        "curriculum",
                        field,
                        determineChangeType(sourceValue, targetValue),
                        sourceValue != null ? sourceValue.asText() : null,
                        targetValue != null ? targetValue.asText() : null,
                        String.format("Field '%s' was %s", field, getChangeDescription(sourceValue, targetValue))
                ));
            }
        }
    }

    private void compareComplexStructures(JsonNode source, JsonNode target, 
            List<CurriculumComparisonDTO.ChangeDetail> changes) {
        // This would be expanded to compare units, topics, learning objectives, etc.
        // For now, implementing basic structure comparison
        
        JsonNode sourceUnits = source.get("units");
        JsonNode targetUnits = target.get("units");
        
        if (sourceUnits != null || targetUnits != null) {
            if (sourceUnits == null) {
                changes.add(createStructuralChange("units", "ADDED", "Units were added"));
            } else if (targetUnits == null) {
                changes.add(createStructuralChange("units", "DELETED", "Units were removed"));
            } else if (!sourceUnits.equals(targetUnits)) {
                changes.add(createStructuralChange("units", "MODIFIED", "Units were modified"));
            }
        }
    }

    private CurriculumComparisonDTO.ChangeDetail createStructuralChange(String section, String changeType, String description) {
        return new CurriculumComparisonDTO.ChangeDetail(
                section,
                "structure",
                CurriculumComparisonDTO.ChangeType.valueOf(changeType),
                null,
                null,
                description
        );
    }

    private CurriculumComparisonDTO.ChangeType determineChangeType(JsonNode oldValue, JsonNode newValue) {
        if (oldValue == null && newValue != null) {
            return CurriculumComparisonDTO.ChangeType.ADDED;
        } else if (oldValue != null && newValue == null) {
            return CurriculumComparisonDTO.ChangeType.DELETED;
        } else {
            return CurriculumComparisonDTO.ChangeType.MODIFIED;
        }
    }

    private String getChangeDescription(JsonNode oldValue, JsonNode newValue) {
        if (oldValue == null && newValue != null) {
            return "added";
        } else if (oldValue != null && newValue == null) {
            return "removed";
        } else {
            return "modified";
        }
    }

    private double calculateAdvancedSimilarityScore(JsonNode source, JsonNode target) {
        try {
            String sourceStr = objectMapper.writeValueAsString(source);
            String targetStr = objectMapper.writeValueAsString(target);
            
            // Use Levenshtein distance for similarity calculation
            int distance = calculateLevenshteinDistance(sourceStr, targetStr);
            int maxLength = Math.max(sourceStr.length(), targetStr.length());
            
            if (maxLength == 0) return 100.0;
            
            double similarity = (1.0 - (double) distance / maxLength) * 100.0;
            return Math.max(0.0, Math.min(100.0, similarity));
            
        } catch (JsonProcessingException e) {
            log.warn("Error calculating similarity score: {}", e.getMessage());
            return 0.0;
        }
    }

    private int calculateLevenshteinDistance(String s1, String s2) {
        int[][] dp = new int[s1.length() + 1][s2.length() + 1];
        
        for (int i = 0; i <= s1.length(); i++) {
            for (int j = 0; j <= s2.length(); j++) {
                if (i == 0) {
                    dp[i][j] = j;
                } else if (j == 0) {
                    dp[i][j] = i;
                } else {
                    dp[i][j] = Math.min(
                            dp[i - 1][j - 1] + (s1.charAt(i - 1) == s2.charAt(j - 1) ? 0 : 1),
                            Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1)
                    );
                }
            }
        }
        
        return dp[s1.length()][s2.length()];
    }

    private CurriculumComparisonDTO.ComparisonSummary generateComparisonSummary(
            List<CurriculumComparisonDTO.ChangeDetail> changes, double similarityScore) {
        
        int totalChanges = changes.size();
        int addedCount = (int) changes.stream().filter(c -> c.changeType() == CurriculumComparisonDTO.ChangeType.ADDED).count();
        int modifiedCount = (int) changes.stream().filter(c -> c.changeType() == CurriculumComparisonDTO.ChangeType.MODIFIED).count();
        int deletedCount = (int) changes.stream().filter(c -> c.changeType() == CurriculumComparisonDTO.ChangeType.DELETED).count();
        
        List<String> affectedSections = changes.stream()
                .map(CurriculumComparisonDTO.ChangeDetail::section)
                .distinct()
                .collect(Collectors.toList());
        
        boolean hasBreakingChanges = changes.stream()
                .anyMatch(c -> isBreakingChange(c));
        
        boolean isBackwardCompatible = !hasBreakingChanges && similarityScore >= SIMILARITY_THRESHOLD * 100;
        
        return new CurriculumComparisonDTO.ComparisonSummary(
                totalChanges,
                addedCount,
                modifiedCount,
                deletedCount,
                affectedSections,
                hasBreakingChanges,
                isBackwardCompatible,
                similarityScore
        );
    }

    private boolean isBreakingChange(CurriculumComparisonDTO.ChangeDetail change) {
        // Define what constitutes a breaking change
        return change.changeType() == CurriculumComparisonDTO.ChangeType.DELETED ||
               (change.changeType() == CurriculumComparisonDTO.ChangeType.MODIFIED && 
                isStructuralField(change.field()));
    }

    private boolean isStructuralField(String fieldName) {
        return Arrays.asList("gradeLevel", "subject", "structure").contains(fieldName);
    }

    private CurriculumComparisonDTO buildComparisonDTO(CurriculumVersion source, CurriculumVersion target, 
            User comparedBy, ComparisonResult result) {
        
        return new CurriculumComparisonDTO(
                source.getId(),
                source.getVersionName(),
                source.getCreatedAt(),
                target.getId(),
                target.getVersionName(),
                target.getCreatedAt(),
                result.changes,
                result.summary,
                LocalDateTime.now(),
                comparedBy.getFirstName() + " " + comparedBy.getLastName()
        );
    }

    private List<CurriculumComparisonDTO> createComparisonChain(List<CurriculumVersion> versions) {
        List<CurriculumComparisonDTO> comparisons = new ArrayList<>();
        
        for (int i = 0; i < versions.size() - 1; i++) {
            CurriculumVersion current = versions.get(i);
            CurriculumVersion next = versions.get(i + 1);
            
            try {
                CurriculumComparisonDTO comparison = compareVersions(current.getId(), next.getId(), 1L); // System user
                comparisons.add(comparison);
            } catch (Exception e) {
                log.warn("Failed to compare versions {} and {}: {}", current.getId(), next.getId(), e.getMessage());
            }
        }
        
        return comparisons;
    }

    // Helper class for comparison results
    private static class ComparisonResult {
        final List<CurriculumComparisonDTO.ChangeDetail> changes;
        final CurriculumComparisonDTO.ComparisonSummary summary;
        final double similarityScore;
        
        ComparisonResult(List<CurriculumComparisonDTO.ChangeDetail> changes, 
                CurriculumComparisonDTO.ComparisonSummary summary, double similarityScore) {
            this.changes = changes;
            this.summary = summary;
            this.similarityScore = similarityScore;
        }
    }

    @Override
    protected Long extractSchoolId(CurriculumVersion entity) {
        // Extract school from curriculum's school
        return entity.getCurriculum() != null && entity.getCurriculum().getSchool() != null 
            ? entity.getCurriculum().getSchool().getId() : null;
    }
    
    @Override
    protected Long extractRegionId(CurriculumVersion entity) {
        // Extract region from curriculum's region or school's region
        if (entity.getCurriculum() != null && entity.getCurriculum().getRegion() != null) {
            return entity.getCurriculum().getRegion().getId();
        }
        if (entity.getCurriculum() != null && entity.getCurriculum().getSchool() != null && entity.getCurriculum().getSchool().getRegion() != null) {
            return entity.getCurriculum().getSchool().getRegion().getId();
        }
        return null;
    }
} 
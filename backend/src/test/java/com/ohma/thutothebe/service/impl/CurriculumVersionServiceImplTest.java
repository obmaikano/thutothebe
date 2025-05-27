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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CurriculumVersionServiceImplTest {

    @Mock
    private CurriculumVersionRepository curriculumVersionRepository;

    @Mock
    private CurriculumRepository curriculumRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CurriculumVersionMapper curriculumVersionMapper;

    @InjectMocks
    private CurriculumVersionServiceImpl curriculumVersionService;

    private Curriculum testCurriculum;
    private User testUser;
    private CurriculumVersion testVersion;
    private CurriculumVersionDTO testVersionDTO;

    @BeforeEach
    void setUp() {
        // Setup test curriculum
        testCurriculum = new Curriculum();
        testCurriculum.setId(1L);
        testCurriculum.setTitle("Test Curriculum");

        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");

        // Setup test version
        testVersion = new CurriculumVersion();
        testVersion.setId(1L);
        testVersion.setCurriculum(testCurriculum);
        testVersion.setVersionNumber(1);
        testVersion.setVersionName("v1.0");
        testVersion.setDescription("Initial version");
        testVersion.setSnapshotData("{\"test\":\"data\"}");
        testVersion.setCreatedBy(testUser);
        testVersion.setCreatedAt(LocalDateTime.now());
        testVersion.setMajorVersion(true);
        testVersion.setCurrent(false);
        testVersion.setChecksum("test-checksum");

        // Setup test DTO
        testVersionDTO = new CurriculumVersionDTO(
                1L, 1L, "Test Curriculum", 1, "v1.0", "Initial version",
                "{\"test\":\"data\"}", 1L, "John Doe", LocalDateTime.now(),
                null, true, false, null, null, "test-checksum"
        );
    }

    // ==================== CREATE VERSION TESTS ====================

    @Test
    void createVersion_Success() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(curriculumVersionRepository.existsByCurriculumIdAndVersionName(1L, "v1.0")).thenReturn(false);
        when(curriculumVersionRepository.findMaxVersionNumberByCurriculumId(1L)).thenReturn(Optional.of(0));
        when(curriculumVersionRepository.save(any(CurriculumVersion.class))).thenReturn(testVersion);
        when(curriculumVersionMapper.toDto(testVersion)).thenReturn(testVersionDTO);

        // Act
        CurriculumVersionDTO result = curriculumVersionService.createVersion(1L, "v1.0", "Initial version", true, 1L);

        // Assert
        assertNotNull(result);
        assertEquals("v1.0", result.versionName());
        assertEquals("Initial version", result.description());
        assertTrue(result.isMajorVersion());
        verify(curriculumVersionRepository).save(any(CurriculumVersion.class));
        verify(curriculumVersionMapper).toDto(testVersion);
    }

    @Test
    void createVersion_CurriculumNotFound_ThrowsException() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumVersionService.createVersion(1L, "v1.0", "Initial version", true, 1L));
        assertEquals("Curriculum not found with ID: 1", exception.getMessage());
    }

    @Test
    void createVersion_UserNotFound_ThrowsException() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumVersionService.createVersion(1L, "v1.0", "Initial version", true, 1L));
        assertEquals("User not found with ID: 1", exception.getMessage());
    }

    @Test
    void createVersion_DuplicateVersionName_ThrowsException() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(curriculumVersionRepository.existsByCurriculumIdAndVersionName(1L, "v1.0")).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumVersionService.createVersion(1L, "v1.0", "Initial version", true, 1L));
        assertEquals("Version name already exists for this curriculum: v1.0", exception.getMessage());
    }

    @Test
    void createSnapshotVersion_Success() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(curriculumVersionRepository.existsByCurriculumIdAndVersionName(anyLong(), anyString())).thenReturn(false);
        when(curriculumVersionRepository.findMaxVersionNumberByCurriculumId(1L)).thenReturn(Optional.of(0));
        when(curriculumVersionRepository.save(any(CurriculumVersion.class))).thenReturn(testVersion);
        when(curriculumVersionRepository.findById(anyLong())).thenReturn(Optional.of(testVersion));
        when(curriculumVersionMapper.toDto(testVersion)).thenReturn(testVersionDTO);

        // Act
        CurriculumVersionDTO result = curriculumVersionService.createSnapshotVersion(1L, "snapshot-v1", "Test changes", 1L);

        // Assert
        assertNotNull(result);
        verify(curriculumVersionRepository, times(2)).save(any(CurriculumVersion.class));
    }

    // ==================== RETRIEVE VERSION TESTS ====================

    @Test
    void getVersionsByCurriculumId_Success() {
        // Arrange
        List<CurriculumVersion> versions = Arrays.asList(testVersion);
        when(curriculumVersionRepository.findByCurriculumIdOrderByVersionNumberDesc(1L)).thenReturn(versions);
        when(curriculumVersionMapper.toDto(testVersion)).thenReturn(testVersionDTO);

        // Act
        List<CurriculumVersionDTO> result = curriculumVersionService.getVersionsByCurriculumId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testVersionDTO, result.get(0));
        verify(curriculumVersionRepository).findByCurriculumIdOrderByVersionNumberDesc(1L);
    }

    @Test
    void getCurrentVersion_Success() {
        // Arrange
        testVersion.setCurrent(true);
        when(curriculumVersionRepository.findByCurriculumIdAndIsCurrent(1L, true)).thenReturn(Optional.of(testVersion));
        when(curriculumVersionMapper.toDto(testVersion)).thenReturn(testVersionDTO);

        // Act
        CurriculumVersionDTO result = curriculumVersionService.getCurrentVersion(1L);

        // Assert
        assertNotNull(result);
        assertEquals(testVersionDTO, result);
        verify(curriculumVersionRepository).findByCurriculumIdAndIsCurrent(1L, true);
    }

    @Test
    void getCurrentVersion_NotFound_ThrowsException() {
        // Arrange
        when(curriculumVersionRepository.findByCurriculumIdAndIsCurrent(1L, true)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumVersionService.getCurrentVersion(1L));
        assertEquals("No current version found for curriculum: 1", exception.getMessage());
    }

    @Test
    void getVersionByNumber_Success() {
        // Arrange
        when(curriculumVersionRepository.findByCurriculumIdAndVersionNumber(1L, 1)).thenReturn(Optional.of(testVersion));
        when(curriculumVersionMapper.toDto(testVersion)).thenReturn(testVersionDTO);

        // Act
        CurriculumVersionDTO result = curriculumVersionService.getVersionByNumber(1L, 1);

        // Assert
        assertNotNull(result);
        assertEquals(testVersionDTO, result);
        verify(curriculumVersionRepository).findByCurriculumIdAndVersionNumber(1L, 1);
    }

    @Test
    void getVersionByNumber_NotFound_ThrowsException() {
        // Arrange
        when(curriculumVersionRepository.findByCurriculumIdAndVersionNumber(1L, 1)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumVersionService.getVersionByNumber(1L, 1));
        assertEquals("Version not found: 1 for curriculum: 1", exception.getMessage());
    }

    @Test
    void getMajorVersions_Success() {
        // Arrange
        List<CurriculumVersion> majorVersions = Arrays.asList(testVersion);
        when(curriculumVersionRepository.findMajorVersionsByCurriculumId(1L)).thenReturn(majorVersions);
        when(curriculumVersionMapper.toDto(testVersion)).thenReturn(testVersionDTO);

        // Act
        List<CurriculumVersionDTO> result = curriculumVersionService.getMajorVersions(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testVersionDTO, result.get(0));
        verify(curriculumVersionRepository).findMajorVersionsByCurriculumId(1L);
    }

    // ==================== VERSION COMPARISON TESTS ====================

    @Test
    void compareVersions_Success() {
        // Arrange
        CurriculumVersion sourceVersion = new CurriculumVersion();
        sourceVersion.setId(1L);
        sourceVersion.setVersionName("v1.0");
        sourceVersion.setCreatedAt(LocalDateTime.now());
        sourceVersion.setSnapshotData("{\"test\":\"data1\"}");

        CurriculumVersion targetVersion = new CurriculumVersion();
        targetVersion.setId(2L);
        targetVersion.setVersionName("v2.0");
        targetVersion.setCreatedAt(LocalDateTime.now());
        targetVersion.setSnapshotData("{\"test\":\"data2\"}");

        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.of(sourceVersion));
        when(curriculumVersionRepository.findById(2L)).thenReturn(Optional.of(targetVersion));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        CurriculumComparisonDTO result = curriculumVersionService.compareVersions(1L, 2L, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.sourceVersionId());
        assertEquals(2L, result.targetVersionId());
        assertEquals("v1.0", result.sourceVersionName());
        assertEquals("v2.0", result.targetVersionName());
        assertNotNull(result.changes());
        assertNotNull(result.summary());
        verify(curriculumVersionRepository).findById(1L);
        verify(curriculumVersionRepository).findById(2L);
        verify(userRepository).findById(1L);
    }

    @Test
    void compareVersions_SourceVersionNotFound_ThrowsException() {
        // Arrange
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumVersionService.compareVersions(1L, 2L, 1L));
        assertEquals("Source version not found: 1", exception.getMessage());
    }

    @Test
    void compareWithCurrent_Success() {
        // Arrange
        CurriculumVersion currentVersion = new CurriculumVersion();
        currentVersion.setId(2L);
        currentVersion.setCurrent(true);

        testVersion.setCurriculum(testCurriculum);
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.of(testVersion));
        when(curriculumVersionRepository.findByCurriculumIdAndIsCurrent(1L, true)).thenReturn(Optional.of(currentVersion));
        when(curriculumVersionRepository.findById(2L)).thenReturn(Optional.of(currentVersion));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        CurriculumComparisonDTO result = curriculumVersionService.compareWithCurrent(1L, 1L);

        // Assert
        assertNotNull(result);
        verify(curriculumVersionRepository).findById(1L);
        verify(curriculumVersionRepository).findByCurriculumIdAndIsCurrent(1L, true);
    }

    // ==================== VERSION OPERATIONS TESTS ====================

    @Test
    void setCurrentVersion_Success() {
        // Arrange
        CurriculumVersion oldCurrentVersion = new CurriculumVersion();
        oldCurrentVersion.setId(2L);
        oldCurrentVersion.setCurrent(true);
        oldCurrentVersion.setCurriculum(testCurriculum);

        testVersion.setCurriculum(testCurriculum);
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.of(testVersion));
        when(curriculumVersionRepository.findByCurriculumIdAndIsCurrent(1L, true)).thenReturn(Optional.of(oldCurrentVersion));
        when(curriculumVersionRepository.save(any(CurriculumVersion.class))).thenReturn(testVersion);
        when(curriculumVersionMapper.toDto(testVersion)).thenReturn(testVersionDTO);

        // Act
        CurriculumVersionDTO result = curriculumVersionService.setCurrentVersion(1L, 1L);

        // Assert
        assertNotNull(result);
        verify(curriculumVersionRepository, times(2)).save(any(CurriculumVersion.class));
        verify(curriculumVersionMapper).toDto(testVersion);
    }

    @Test
    void revertToVersion_Success() {
        // Arrange
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.of(testVersion));
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(curriculumVersionRepository.existsByCurriculumIdAndVersionName(anyLong(), anyString())).thenReturn(false);
        when(curriculumVersionRepository.findMaxVersionNumberByCurriculumId(1L)).thenReturn(Optional.of(1));
        when(curriculumVersionRepository.save(any(CurriculumVersion.class))).thenReturn(testVersion);
        when(curriculumVersionMapper.toDto(testVersion)).thenReturn(testVersionDTO);

        // Act
        CurriculumVersionDTO result = curriculumVersionService.revertToVersion(1L, 1L, "Bug fix", 1L);

        // Assert
        assertNotNull(result);
        verify(curriculumVersionRepository).findById(1L);
        verify(curriculumVersionRepository).save(any(CurriculumVersion.class));
    }

    @Test
    void mergeVersions_Success() {
        // Arrange
        CurriculumVersion baseVersion = new CurriculumVersion();
        baseVersion.setId(1L);
        baseVersion.setVersionNumber(1);
        baseVersion.setCurriculum(testCurriculum);
        baseVersion.setSnapshotData("{\"base\":\"data\"}");

        CurriculumVersion sourceVersion = new CurriculumVersion();
        sourceVersion.setId(2L);
        sourceVersion.setVersionNumber(2);
        sourceVersion.setSnapshotData("{\"source\":\"data\"}");

        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.of(baseVersion));
        when(curriculumVersionRepository.findById(2L)).thenReturn(Optional.of(sourceVersion));
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(curriculumVersionRepository.existsByCurriculumIdAndVersionName(anyLong(), anyString())).thenReturn(false);
        when(curriculumVersionRepository.findMaxVersionNumberByCurriculumId(1L)).thenReturn(Optional.of(2));
        when(curriculumVersionRepository.save(any(CurriculumVersion.class))).thenReturn(testVersion);
        when(curriculumVersionMapper.toDto(testVersion)).thenReturn(testVersionDTO);

        // Act
        CurriculumVersionDTO result = curriculumVersionService.mergeVersions(1L, 2L, "SOURCE_WINS", 1L);

        // Assert
        assertNotNull(result);
        verify(curriculumVersionRepository).findById(1L);
        verify(curriculumVersionRepository).findById(2L);
        verify(curriculumVersionRepository).save(any(CurriculumVersion.class));
    }

    // ==================== VERSION SEARCH AND FILTERING TESTS ====================

    @Test
    void findVersionsByTag_Success() {
        // Arrange
        List<CurriculumVersion> versions = Arrays.asList(testVersion);
        when(curriculumVersionRepository.findVersionsByTag(1L, "release")).thenReturn(versions);
        when(curriculumVersionMapper.toDto(testVersion)).thenReturn(testVersionDTO);

        // Act
        List<CurriculumVersionDTO> result = curriculumVersionService.findVersionsByTag(1L, "release");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curriculumVersionRepository).findVersionsByTag(1L, "release");
    }

    @Test
    void findVersionsCreatedBetween_Success() {
        // Arrange
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        LocalDateTime endDate = LocalDateTime.now();
        List<CurriculumVersion> versions = Arrays.asList(testVersion);
        when(curriculumVersionRepository.findVersionsCreatedBetween(startDate, endDate)).thenReturn(versions);
        when(curriculumVersionMapper.toDto(testVersion)).thenReturn(testVersionDTO);

        // Act
        List<CurriculumVersionDTO> result = curriculumVersionService.findVersionsCreatedBetween(startDate, endDate);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curriculumVersionRepository).findVersionsCreatedBetween(startDate, endDate);
    }

    @Test
    void findVersionsByCreator_Success() {
        // Arrange
        List<CurriculumVersion> versions = Arrays.asList(testVersion);
        when(curriculumVersionRepository.findVersionsByCreatedBy(1L)).thenReturn(versions);
        when(curriculumVersionMapper.toDto(testVersion)).thenReturn(testVersionDTO);

        // Act
        List<CurriculumVersionDTO> result = curriculumVersionService.findVersionsByCreator(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curriculumVersionRepository).findVersionsByCreatedBy(1L);
    }

    // ==================== VERSION ANALYTICS TESTS ====================

    @Test
    void getVersionCount_Success() {
        // Arrange
        when(curriculumVersionRepository.countVersionsByCurriculumId(1L)).thenReturn(5L);

        // Act
        Long result = curriculumVersionService.getVersionCount(1L);

        // Assert
        assertEquals(5L, result);
        verify(curriculumVersionRepository).countVersionsByCurriculumId(1L);
    }

    @Test
    void calculateSimilarityScore_IdenticalVersions_Returns100() {
        // Arrange
        CurriculumVersion version1 = new CurriculumVersion();
        version1.setSnapshotData("identical data");
        CurriculumVersion version2 = new CurriculumVersion();
        version2.setSnapshotData("identical data");

        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.of(version1));
        when(curriculumVersionRepository.findById(2L)).thenReturn(Optional.of(version2));

        // Act
        Double result = curriculumVersionService.calculateSimilarityScore(1L, 2L);

        // Assert
        assertEquals(100.0, result);
    }

    @Test
    void calculateSimilarityScore_DifferentVersions_ReturnsLessThan100() {
        // Arrange
        CurriculumVersion version1 = new CurriculumVersion();
        version1.setSnapshotData("data1");
        CurriculumVersion version2 = new CurriculumVersion();
        version2.setSnapshotData("data2");

        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.of(version1));
        when(curriculumVersionRepository.findById(2L)).thenReturn(Optional.of(version2));

        // Act
        Double result = curriculumVersionService.calculateSimilarityScore(1L, 2L);

        // Assert
        assertTrue(result < 100.0);
        assertTrue(result >= 0.0);
    }

    @Test
    void getChangesSummary_Success() {
        // Arrange
        CurriculumVersion version1 = new CurriculumVersion();
        version1.setChangeSummary("Added new unit");
        CurriculumVersion version2 = new CurriculumVersion();
        version2.setChangeSummary("Updated topics");

        List<CurriculumVersion> versions = Arrays.asList(version1, version2);
        when(curriculumVersionRepository.findVersionsInRange(1L, 1, 2)).thenReturn(versions);

        // Act
        List<String> result = curriculumVersionService.getChangesSummary(1L, 1, 2);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains("Added new unit"));
        assertTrue(result.contains("Updated topics"));
    }

    // ==================== VERSION EXPORT/IMPORT TESTS ====================

    @Test
    void exportVersion_JSON_Success() {
        // Arrange
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.of(testVersion));

        // Act
        String result = curriculumVersionService.exportVersion(1L, "JSON");

        // Assert
        assertEquals("{\"test\":\"data\"}", result);
        verify(curriculumVersionRepository).findById(1L);
    }

    @Test
    void exportVersion_XML_Success() {
        // Arrange
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.of(testVersion));

        // Act
        String result = curriculumVersionService.exportVersion(1L, "XML");

        // Assert
        assertTrue(result.contains("<curriculum>"));
        assertTrue(result.contains("</curriculum>"));
        verify(curriculumVersionRepository).findById(1L);
    }

    @Test
    void exportVersion_UnsupportedFormat_ThrowsException() {
        // Arrange
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.of(testVersion));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumVersionService.exportVersion(1L, "UNSUPPORTED"));
        assertEquals("Unsupported export format: UNSUPPORTED", exception.getMessage());
    }

    @Test
    void importVersion_JSON_Success() {
        // Arrange
        String jsonData = "{\"imported\":\"data\"}";
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(curriculumVersionRepository.existsByCurriculumIdAndVersionName(anyLong(), anyString())).thenReturn(false);
        when(curriculumVersionRepository.findMaxVersionNumberByCurriculumId(1L)).thenReturn(Optional.of(0));
        when(curriculumVersionRepository.save(any(CurriculumVersion.class))).thenReturn(testVersion);
        when(curriculumVersionMapper.toDto(testVersion)).thenReturn(testVersionDTO);

        // Act
        CurriculumVersionDTO result = curriculumVersionService.importVersion(1L, jsonData, "JSON", 1L);

        // Assert
        assertNotNull(result);
        verify(curriculumVersionRepository).save(any(CurriculumVersion.class));
    }

    // ==================== VERSION VALIDATION TESTS ====================

    @Test
    void validateVersionIntegrity_ValidChecksum_ReturnsTrue() {
        // Arrange
        testVersion.setChecksum("a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"); // SHA-256 of "hello"
        testVersion.setSnapshotData("hello");
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.of(testVersion));

        // Act
        boolean result = curriculumVersionService.validateVersionIntegrity(1L);

        // Assert
        assertTrue(result);
        verify(curriculumVersionRepository).findById(1L);
    }

    @Test
    void validateVersionIntegrity_InvalidChecksum_ReturnsFalse() {
        // Arrange
        testVersion.setChecksum("invalid-checksum");
        testVersion.setSnapshotData("hello");
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.of(testVersion));

        // Act
        boolean result = curriculumVersionService.validateVersionIntegrity(1L);

        // Assert
        assertFalse(result);
        verify(curriculumVersionRepository).findById(1L);
    }

    @Test
    void generateChecksum_Success() {
        // Arrange
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.of(testVersion));

        // Act
        String result = curriculumVersionService.generateChecksum(1L);

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        verify(curriculumVersionRepository).findById(1L);
    }

    @Test
    void verifyChecksum_ValidChecksum_ReturnsTrue() {
        // Arrange
        String expectedChecksum = "test-checksum";
        testVersion.setChecksum(expectedChecksum);
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.of(testVersion));

        // Act
        boolean result = curriculumVersionService.verifyChecksum(1L, expectedChecksum);

        // Assert
        assertTrue(result);
        verify(curriculumVersionRepository).findById(1L);
    }

    @Test
    void verifyChecksum_InvalidChecksum_ReturnsFalse() {
        // Arrange
        testVersion.setChecksum("different-checksum");
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.of(testVersion));

        // Act
        boolean result = curriculumVersionService.verifyChecksum(1L, "expected-checksum");

        // Assert
        assertFalse(result);
        verify(curriculumVersionRepository).findById(1L);
    }

    // ==================== EDGE CASES AND ERROR SCENARIOS ====================

    @Test
    void getVersionHistory_EmptyRange_ReturnsEmptyList() {
        // Arrange
        when(curriculumVersionRepository.findVersionsInRange(1L, 1, 1)).thenReturn(Arrays.asList());

        // Act
        List<CurriculumComparisonDTO> result = curriculumVersionService.getVersionHistory(1L, 1, 1);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void setCurrentVersion_VersionNotFound_ThrowsException() {
        // Arrange
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumVersionService.setCurrentVersion(1L, 1L));
        assertEquals("Version not found: 1", exception.getMessage());
    }

    @Test
    void revertToVersion_VersionNotFound_ThrowsException() {
        // Arrange
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumVersionService.revertToVersion(1L, 1L, "reason", 1L));
        assertEquals("Version not found: 1", exception.getMessage());
    }

    @Test
    void calculateSimilarityScore_VersionNotFound_ThrowsException() {
        // Arrange
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumVersionService.calculateSimilarityScore(1L, 2L));
        assertEquals("Version not found: 1", exception.getMessage());
    }

    @Test
    void exportVersion_VersionNotFound_ThrowsException() {
        // Arrange
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumVersionService.exportVersion(1L, "JSON"));
        assertEquals("Version not found: 1", exception.getMessage());
    }

    @Test
    void validateVersionIntegrity_VersionNotFound_ThrowsException() {
        // Arrange
        when(curriculumVersionRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumVersionService.validateVersionIntegrity(1L));
        assertEquals("Version not found: 1", exception.getMessage());
    }
} 
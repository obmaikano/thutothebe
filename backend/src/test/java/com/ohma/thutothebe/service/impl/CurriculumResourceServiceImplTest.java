package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CurriculumResourceDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.mapper.CurriculumResourceMapper;
import com.ohma.thutothebe.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CurriculumResourceServiceImplTest {

    @Mock
    private CurriculumResourceRepository curriculumResourceRepository;

    @Mock
    private CurriculumRepository curriculumRepository;

    @Mock
    private CurriculumUnitRepository curriculumUnitRepository;

    @Mock
    private CurriculumTopicRepository curriculumTopicRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CurriculumResourceMapper curriculumResourceMapper;

    @Mock
    private MultipartFile mockFile;

    @InjectMocks
    private CurriculumResourceServiceImpl curriculumResourceService;

    private Curriculum testCurriculum;
    private User testUser;
    private CurriculumResource testResource;
    private CurriculumResourceDTO testResourceDTO;
    private CurriculumUnit testUnit;
    private CurriculumTopic testTopic;

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

        // Setup test unit
        testUnit = new CurriculumUnit();
        testUnit.setId(1L);
        testUnit.setTitle("Test Unit");

        // Setup test topic
        testTopic = new CurriculumTopic();
        testTopic.setId(1L);
        testTopic.setTitle("Test Topic");

        // Setup test resource
        testResource = new CurriculumResource();
        testResource.setId(1L);
        testResource.setCurriculum(testCurriculum);
        testResource.setTitle("Test Resource");
        testResource.setDescription("Test Description");
        testResource.setResourceType(CurriculumResource.ResourceType.DOCUMENT);
        testResource.setUrl("http://example.com/resource.pdf");
        testResource.setUploadedBy(testUser);
        testResource.setUploadedAt(LocalDateTime.now());
        testResource.setAccessCount(0L);
        testResource.setDownloadCount(0L);
        testResource.setPublic(true);
        testResource.setRequiresAuthentication(false);
        testResource.setActive(true);

        // Setup test DTO
        testResourceDTO = new CurriculumResourceDTO(
                1L, 1L, "Test Curriculum", null, null, null, null,
                "Test Resource", "Test Description", CurriculumResource.ResourceType.DOCUMENT,
                "http://example.com/resource.pdf", null, null, null, null, null,
                "en", null, null, null, 1L, "John Doe", LocalDateTime.now(),
                null, 0L, 0L, true, false, null, null, null, null, true
        );
    }

    // ==================== UPLOAD RESOURCE TESTS ====================

    @Test
    void uploadResource_WithFile_Success() throws IOException {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(mockFile.isEmpty()).thenReturn(false);
        when(mockFile.getOriginalFilename()).thenReturn("test.pdf");
        when(mockFile.getSize()).thenReturn(1024L);
        when(mockFile.getContentType()).thenReturn("application/pdf");
        when(mockFile.getBytes()).thenReturn("test content".getBytes());
        when(mockFile.getInputStream()).thenReturn(null); // Simplified for test
        when(curriculumResourceRepository.save(any(CurriculumResource.class))).thenReturn(testResource);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        CurriculumResourceDTO result = curriculumResourceService.uploadResource(1L, mockFile, testResourceDTO);

        // Assert
        assertNotNull(result);
        assertEquals("Test Resource", result.title());
        verify(curriculumResourceRepository).save(any(CurriculumResource.class));
        verify(curriculumResourceMapper).toDto(testResource);
    }

    @Test
    void uploadResource_WithoutFile_LinkResource_Success() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(curriculumResourceRepository.save(any(CurriculumResource.class))).thenReturn(testResource);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        CurriculumResourceDTO result = curriculumResourceService.uploadResource(1L, null, testResourceDTO);

        // Assert
        assertNotNull(result);
        assertEquals("Test Resource", result.title());
        verify(curriculumResourceRepository).save(any(CurriculumResource.class));
    }

    @Test
    void uploadResource_WithUnitAndTopic_Success() {
        // Arrange
        CurriculumResourceDTO resourceWithUnitTopic = new CurriculumResourceDTO(
                null, 1L, "Test Curriculum", 1L, "Test Unit", 1L, "Test Topic",
                "Test Resource", "Test Description", CurriculumResource.ResourceType.DOCUMENT,
                "http://example.com/resource.pdf", null, null, null, null, null,
                "en", null, null, null, 1L, "John Doe", LocalDateTime.now(),
                null, 0L, 0L, true, false, null, null, null, null, true
        );

        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(curriculumUnitRepository.findById(1L)).thenReturn(Optional.of(testUnit));
        when(curriculumTopicRepository.findById(1L)).thenReturn(Optional.of(testTopic));
        when(curriculumResourceRepository.save(any(CurriculumResource.class))).thenReturn(testResource);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        CurriculumResourceDTO result = curriculumResourceService.uploadResource(1L, null, resourceWithUnitTopic);

        // Assert
        assertNotNull(result);
        verify(curriculumUnitRepository).findById(1L);
        verify(curriculumTopicRepository).findById(1L);
        verify(curriculumResourceRepository).save(any(CurriculumResource.class));
    }

    @Test
    void uploadResource_CurriculumNotFound_ThrowsException() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumResourceService.uploadResource(1L, null, testResourceDTO));
        assertEquals("Curriculum not found with ID: 1", exception.getMessage());
    }

    @Test
    void uploadResource_UserNotFound_ThrowsException() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumResourceService.uploadResource(1L, null, testResourceDTO));
        assertEquals("User not found with ID: 1", exception.getMessage());
    }

    @Test
    void addLinkResource_Success() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(curriculumResourceRepository.save(any(CurriculumResource.class))).thenReturn(testResource);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        CurriculumResourceDTO result = curriculumResourceService.addLinkResource(1L, testResourceDTO);

        // Assert
        assertNotNull(result);
        assertEquals("Test Resource", result.title());
        verify(curriculumResourceRepository).save(any(CurriculumResource.class));
    }

    // ==================== RETRIEVE RESOURCES TESTS ====================

    @Test
    void getResourcesByCurriculum_AllFilters_Success() {
        // Arrange
        List<CurriculumResource> resources = Arrays.asList(testResource);
        when(curriculumResourceRepository.findByCurriculumIdAndResourceTypeAndCurriculumUnitIdAndCurriculumTopicId(
                1L, CurriculumResource.ResourceType.DOCUMENT, 1L, 1L)).thenReturn(resources);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        List<CurriculumResourceDTO> result = curriculumResourceService.getResourcesByCurriculum(
                1L, "DOCUMENT", 1L, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testResourceDTO, result.get(0));
        verify(curriculumResourceRepository).findByCurriculumIdAndResourceTypeAndCurriculumUnitIdAndCurriculumTopicId(
                1L, CurriculumResource.ResourceType.DOCUMENT, 1L, 1L);
    }

    @Test
    void getResourcesByCurriculum_NoFilters_Success() {
        // Arrange
        List<CurriculumResource> resources = Arrays.asList(testResource);
        when(curriculumResourceRepository.findByCurriculumIdAndIsActive(1L, true)).thenReturn(resources);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        List<CurriculumResourceDTO> result = curriculumResourceService.getResourcesByCurriculum(
                1L, null, null, null);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curriculumResourceRepository).findByCurriculumIdAndIsActive(1L, true);
    }

    @Test
    void getResourcesByUnit_Success() {
        // Arrange
        List<CurriculumResource> resources = Arrays.asList(testResource);
        when(curriculumResourceRepository.findByCurriculumUnitIdAndIsActive(1L, true)).thenReturn(resources);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        List<CurriculumResourceDTO> result = curriculumResourceService.getResourcesByUnit(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curriculumResourceRepository).findByCurriculumUnitIdAndIsActive(1L, true);
    }

    @Test
    void getResourcesByTopic_Success() {
        // Arrange
        List<CurriculumResource> resources = Arrays.asList(testResource);
        when(curriculumResourceRepository.findByCurriculumTopicIdAndIsActive(1L, true)).thenReturn(resources);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        List<CurriculumResourceDTO> result = curriculumResourceService.getResourcesByTopic(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curriculumResourceRepository).findByCurriculumTopicIdAndIsActive(1L, true);
    }

    @Test
    void getResourcesByType_Success() {
        // Arrange
        List<CurriculumResource> resources = Arrays.asList(testResource);
        when(curriculumResourceRepository.findByResourceTypeAndIsActive(
                CurriculumResource.ResourceType.DOCUMENT, true)).thenReturn(resources);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        List<CurriculumResourceDTO> result = curriculumResourceService.getResourcesByType(
                CurriculumResource.ResourceType.DOCUMENT);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curriculumResourceRepository).findByResourceTypeAndIsActive(
                CurriculumResource.ResourceType.DOCUMENT, true);
    }

    // ==================== ACCESS TRACKING TESTS ====================

    @Test
    void trackAccess_Success() {
        // Arrange
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));
        when(curriculumResourceRepository.save(any(CurriculumResource.class))).thenReturn(testResource);

        // Act
        curriculumResourceService.trackAccess(1L, 1L);

        // Assert
        verify(curriculumResourceRepository).findById(1L);
        verify(curriculumResourceRepository).save(any(CurriculumResource.class));
    }

    @Test
    void trackAccess_ResourceNotFound_ThrowsException() {
        // Arrange
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumResourceService.trackAccess(1L, 1L));
        assertEquals("Resource not found with ID: 1", exception.getMessage());
    }

    @Test
    void trackDownload_Success() {
        // Arrange
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));
        when(curriculumResourceRepository.save(any(CurriculumResource.class))).thenReturn(testResource);

        // Act
        curriculumResourceService.trackDownload(1L, 1L);

        // Assert
        verify(curriculumResourceRepository).findById(1L);
        verify(curriculumResourceRepository).save(any(CurriculumResource.class));
    }

    @Test
    void getAccessCount_Success() {
        // Arrange
        testResource.setAccessCount(5L);
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));

        // Act
        Long result = curriculumResourceService.getAccessCount(1L);

        // Assert
        assertEquals(5L, result);
        verify(curriculumResourceRepository).findById(1L);
    }

    @Test
    void getDownloadCount_Success() {
        // Arrange
        testResource.setDownloadCount(3L);
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));

        // Act
        Long result = curriculumResourceService.getDownloadCount(1L);

        // Assert
        assertEquals(3L, result);
        verify(curriculumResourceRepository).findById(1L);
    }

    // ==================== SEARCH AND FILTERING TESTS ====================

    @Test
    void searchResources_Success() {
        // Arrange
        List<CurriculumResource> resources = Arrays.asList(testResource);
        when(curriculumResourceRepository.searchByTitleOrDescription("test", 1L)).thenReturn(resources);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        List<CurriculumResourceDTO> result = curriculumResourceService.searchResources("test", 1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curriculumResourceRepository).searchByTitleOrDescription("test", 1L);
    }

    @Test
    void getResourcesByTag_Success() {
        // Arrange
        List<CurriculumResource> resources = Arrays.asList(testResource);
        when(curriculumResourceRepository.findByTagsContainingAndCurriculumId("important", 1L)).thenReturn(resources);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        List<CurriculumResourceDTO> result = curriculumResourceService.getResourcesByTag("important", 1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curriculumResourceRepository).findByTagsContainingAndCurriculumId("important", 1L);
    }

    @Test
    void getPublicResources_Success() {
        // Arrange
        List<CurriculumResource> resources = Arrays.asList(testResource);
        when(curriculumResourceRepository.findByCurriculumIdAndIsPublicAndIsActive(1L, true, true)).thenReturn(resources);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        List<CurriculumResourceDTO> result = curriculumResourceService.getPublicResources(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curriculumResourceRepository).findByCurriculumIdAndIsPublicAndIsActive(1L, true, true);
    }

    @Test
    void getResourcesByLanguage_Success() {
        // Arrange
        List<CurriculumResource> resources = Arrays.asList(testResource);
        when(curriculumResourceRepository.findByCurriculumIdAndLanguageAndIsActive(1L, "en", true)).thenReturn(resources);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        List<CurriculumResourceDTO> result = curriculumResourceService.getResourcesByLanguage("en", 1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curriculumResourceRepository).findByCurriculumIdAndLanguageAndIsActive(1L, "en", true);
    }

    // ==================== ANALYTICS TESTS ====================

    @Test
    void getMostAccessedResources_Success() {
        // Arrange
        List<CurriculumResource> resources = Arrays.asList(testResource);
        when(curriculumResourceRepository.findMostAccessedByCurriculumId(1L, 10)).thenReturn(resources);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        List<CurriculumResourceDTO> result = curriculumResourceService.getMostAccessedResources(1L, 10);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curriculumResourceRepository).findMostAccessedByCurriculumId(1L, 10);
    }

    @Test
    void getRecentlyAddedResources_Success() {
        // Arrange
        List<CurriculumResource> resources = Arrays.asList(testResource);
        when(curriculumResourceRepository.findRecentlyAddedByCurriculumId(1L, 5)).thenReturn(resources);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        List<CurriculumResourceDTO> result = curriculumResourceService.getRecentlyAddedResources(1L, 5);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curriculumResourceRepository).findRecentlyAddedByCurriculumId(1L, 5);
    }

    @Test
    void getUnderutilizedResources_Success() {
        // Arrange
        List<CurriculumResource> resources = Arrays.asList(testResource);
        when(curriculumResourceRepository.findUnderutilizedByCurriculumId(1L)).thenReturn(resources);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        List<CurriculumResourceDTO> result = curriculumResourceService.getUnderutilizedResources(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curriculumResourceRepository).findUnderutilizedByCurriculumId(1L);
    }

    // ==================== RESOURCE MANAGEMENT TESTS ====================

    @Test
    void updateResourceMetadata_Success() {
        // Arrange
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));
        when(curriculumResourceRepository.save(any(CurriculumResource.class))).thenReturn(testResource);
        when(curriculumResourceMapper.toDto(testResource)).thenReturn(testResourceDTO);

        // Act
        CurriculumResourceDTO result = curriculumResourceService.updateResourceMetadata(1L, testResourceDTO);

        // Assert
        assertNotNull(result);
        verify(curriculumResourceRepository).findById(1L);
        verify(curriculumResourceRepository).save(any(CurriculumResource.class));
    }

    @Test
    void deleteResource_Success() {
        // Arrange
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));
        when(curriculumResourceRepository.save(any(CurriculumResource.class))).thenReturn(testResource);

        // Act
        curriculumResourceService.deleteResource(1L);

        // Assert
        verify(curriculumResourceRepository).findById(1L);
        verify(curriculumResourceRepository).save(any(CurriculumResource.class));
    }

    @Test
    void activateResource_Success() {
        // Arrange
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));
        when(curriculumResourceRepository.save(any(CurriculumResource.class))).thenReturn(testResource);

        // Act
        curriculumResourceService.activateResource(1L);

        // Assert
        verify(curriculumResourceRepository).findById(1L);
        verify(curriculumResourceRepository).save(any(CurriculumResource.class));
    }

    @Test
    void deactivateResource_Success() {
        // Arrange
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));
        when(curriculumResourceRepository.save(any(CurriculumResource.class))).thenReturn(testResource);

        // Act
        curriculumResourceService.deactivateResource(1L);

        // Assert
        verify(curriculumResourceRepository).findById(1L);
        verify(curriculumResourceRepository).save(any(CurriculumResource.class));
    }

    // ==================== FILE OPERATIONS TESTS ====================

    @Test
    void generateThumbnail_ImageFile_Success() {
        // Arrange
        testResource.setMimeType("image/jpeg");
        testResource.setUrl("/uploads/test.jpg");
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));
        when(curriculumResourceRepository.save(any(CurriculumResource.class))).thenReturn(testResource);

        // Act
        String result = curriculumResourceService.generateThumbnail(1L);

        // Assert
        assertNotNull(result);
        assertTrue(result.contains("thumbnails"));
        verify(curriculumResourceRepository).save(any(CurriculumResource.class));
    }

    @Test
    void generateThumbnail_NonImageFile_ThrowsException() {
        // Arrange
        testResource.setMimeType("application/pdf");
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumResourceService.generateThumbnail(1L));
        assertEquals("Thumbnail generation not supported for this file type", exception.getMessage());
    }

    @Test
    void validateFileIntegrity_ValidChecksum_ReturnsTrue() {
        // Arrange
        testResource.setChecksum("valid-checksum");
        testResource.setUrl("/uploads/test.pdf");
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));

        // Act
        boolean result = curriculumResourceService.validateFileIntegrity(1L);

        // Assert
        assertTrue(result);
        verify(curriculumResourceRepository).findById(1L);
    }

    @Test
    void validateFileIntegrity_NoChecksum_ReturnsFalse() {
        // Arrange
        testResource.setChecksum(null);
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));

        // Act
        boolean result = curriculumResourceService.validateFileIntegrity(1L);

        // Assert
        assertFalse(result);
    }

    @Test
    void getResourceUrl_PublicResource_Success() {
        // Arrange
        testResource.setPublic(true);
        testResource.setRequiresAuthentication(false);
        testResource.setActive(true);
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));
        when(curriculumResourceRepository.save(any(CurriculumResource.class))).thenReturn(testResource);

        // Act
        String result = curriculumResourceService.getResourceUrl(1L, 1L);

        // Assert
        assertEquals("http://example.com/resource.pdf", result);
        verify(curriculumResourceRepository).save(any(CurriculumResource.class)); // Access tracking
    }

    @Test
    void getResourceUrl_RequiresAuthentication_NoUser_ThrowsException() {
        // Arrange
        testResource.setRequiresAuthentication(true);
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumResourceService.getResourceUrl(1L, null));
        assertEquals("Authentication required to access this resource", exception.getMessage());
    }

    @Test
    void downloadResource_Success() {
        // Arrange
        testResource.setRequiresAuthentication(false);
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));
        when(curriculumResourceRepository.save(any(CurriculumResource.class))).thenReturn(testResource);

        // Act
        byte[] result = curriculumResourceService.downloadResource(1L, 1L);

        // Assert
        assertNotNull(result);
        assertTrue(result.length > 0);
        verify(curriculumResourceRepository).save(any(CurriculumResource.class)); // Download tracking
    }

    @Test
    void downloadResource_RequiresAuthentication_NoUser_ThrowsException() {
        // Arrange
        testResource.setRequiresAuthentication(true);
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.of(testResource));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumResourceService.downloadResource(1L, null));
        assertEquals("Authentication required to download this resource", exception.getMessage());
    }

    // ==================== ERROR SCENARIOS ====================

    @Test
    void updateResourceMetadata_ResourceNotFound_ThrowsException() {
        // Arrange
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumResourceService.updateResourceMetadata(1L, testResourceDTO));
        assertEquals("Resource not found with ID: 1", exception.getMessage());
    }

    @Test
    void deleteResource_ResourceNotFound_ThrowsException() {
        // Arrange
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumResourceService.deleteResource(1L));
        assertEquals("Resource not found with ID: 1", exception.getMessage());
    }

    @Test
    void generateThumbnail_ResourceNotFound_ThrowsException() {
        // Arrange
        when(curriculumResourceRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> curriculumResourceService.generateThumbnail(1L));
        assertEquals("Resource not found with ID: 1", exception.getMessage());
    }
} 
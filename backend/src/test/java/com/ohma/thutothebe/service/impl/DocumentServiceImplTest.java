package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.DocumentDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.DocumentMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.DocumentAccessLogService;
import com.ohma.thutothebe.service.DocumentPermissionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
class DocumentServiceImplTest {

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private DocumentMapper documentMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SchoolRepository schoolRepository;

    @Mock
    private RegionRepository regionRepository;

    @Mock
    private ClassRepository classRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private DocumentAccessLogService documentAccessLogService;

    @Mock
    private DocumentPermissionService documentPermissionService;

    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private DocumentServiceImpl documentService;

    private Document document;
    private DocumentDTO documentDTO;
    private User user;
    private School school;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        // Setup test data
        user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@example.com");

        school = new School();
        school.setId(1L);
        school.setName("Test School");

        document = new Document();
        document.setId(1L);
        document.setTitle("Test Document");
        document.setDescription("Test Description");
        document.setFileName("test.pdf");
        document.setFilePath("/uploads/test.pdf");
        document.setFileSize(1024L);
        document.setMimeType("application/pdf");
        document.setDocumentType(DocumentType.PDF);
        document.setDocumentCategory(DocumentCategory.ACADEMIC_RESOURCE);
        document.setAccessLevel(DocumentAccessLevel.SCHOOL);
        document.setUploadedBy(user);
        document.setUploadedAt(LocalDateTime.now());
        document.setSchool(school);
        document.setVersionNumber(1);
        document.setApprovalStatus(DocumentApprovalStatus.PENDING);
        document.setActive(true);

        documentDTO = new DocumentDTO(
            1L, "Test Document", "Test Description", "test.pdf", "/uploads/test.pdf",
            1024L, "application/pdf", DocumentType.PDF, DocumentCategory.ACADEMIC_RESOURCE,
            DocumentAccessLevel.SCHOOL, 1L, "John Doe", LocalDateTime.now(),
            1L, "Test School", null, null, null, null, null, null,
            null, null, null, null, 1, null, null, null,
            false, false, DocumentApprovalStatus.PENDING, null, null, null, null,
            0L, 0L, null, null, false, null, null, null,
            true, null, null, LocalDateTime.now(), LocalDateTime.now(), 1L
        );

        pageable = PageRequest.of(0, 10);
    }

    @Test
    void getAllActiveDocuments_ShouldReturnPageOfDocuments() {
        // Given
        List<Document> documents = Arrays.asList(document);
        Page<Document> documentPage = new PageImpl<>(documents, pageable, 1);
        when(documentRepository.findAllActiveDocuments(pageable)).thenReturn(documentPage);
        when(documentMapper.toDto(document)).thenReturn(documentDTO);

        // When
        Page<DocumentDTO> result = documentService.getAllActiveDocuments(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(documentDTO, result.getContent().get(0));
        verify(documentRepository).findAllActiveDocuments(pageable);
        verify(documentMapper).toDto(document);
    }

    @Test
    void getActiveDocumentById_ShouldReturnDocument_WhenDocumentExists() {
        // Given
        when(documentRepository.findActiveDocumentById(1L)).thenReturn(Optional.of(document));
        when(documentMapper.toDto(document)).thenReturn(documentDTO);

        // When
        DocumentDTO result = documentService.getActiveDocumentById(1L);

        // Then
        assertNotNull(result);
        assertEquals(documentDTO, result);
        verify(documentRepository).findActiveDocumentById(1L);
        verify(documentMapper).toDto(document);
    }

    @Test
    void getActiveDocumentById_ShouldThrowException_WhenDocumentNotFound() {
        // Given
        when(documentRepository.findActiveDocumentById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            documentService.getActiveDocumentById(1L);
        });
        verify(documentRepository).findActiveDocumentById(1L);
        verify(documentMapper, never()).toDto(any());
    }

    @Test
    void uploadDocument_ShouldUploadDocument_WhenValidFile() throws IOException {
        // Given
        byte[] fileContent = "test content".getBytes();
        when(multipartFile.getOriginalFilename()).thenReturn("test.pdf");
        when(multipartFile.getSize()).thenReturn(1024L);
        when(multipartFile.getContentType()).thenReturn("application/pdf");
        when(multipartFile.getBytes()).thenReturn(fileContent);
        when(multipartFile.isEmpty()).thenReturn(false);
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(schoolRepository.findById(1L)).thenReturn(Optional.of(school));
        when(documentMapper.toEntity(any(DocumentDTO.class))).thenReturn(document);
        when(documentRepository.save(any(Document.class))).thenReturn(document);
        when(documentMapper.toDto(document)).thenReturn(documentDTO);

        // When
        DocumentDTO result = documentService.uploadDocument(multipartFile, documentDTO, 1L);

        // Then
        assertNotNull(result);
        assertEquals(documentDTO, result);
        verify(multipartFile).getBytes();
        verify(documentRepository).save(any(Document.class));
        verify(documentAccessLogService).logSuccessfulAccess(
            eq(document.getId()), eq(1L), eq(DocumentAccessType.EDIT), 
            isNull(), isNull(), isNull()
        );
    }

    @Test
    void uploadDocument_ShouldThrowException_WhenFileIsEmpty() {
        // Given
        when(multipartFile.isEmpty()).thenReturn(true);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            documentService.uploadDocument(multipartFile, documentDTO, 1L);
        });
        verify(documentRepository, never()).save(any());
    }

    @Test
    void uploadDocument_ShouldThrowException_WhenFileTooLarge() {
        // Given
        when(multipartFile.isEmpty()).thenReturn(false);
        when(multipartFile.getSize()).thenReturn(20 * 1024 * 1024L); // 20MB

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            documentService.uploadDocument(multipartFile, documentDTO, 1L);
        });
        verify(documentRepository, never()).save(any());
    }

    @Test
    void downloadDocument_ShouldReturnFileContent_WhenUserHasPermission() throws IOException {
        // Given
        byte[] expectedContent = "test content".getBytes();
        when(documentRepository.findActiveDocumentById(1L)).thenReturn(Optional.of(document));
        when(documentPermissionService.hasDownloadPermission(1L, 1L)).thenReturn(true);
        
        // Mock file reading - in real implementation this would read from file system
        // For test purposes, we'll assume the service has a method to read file content
        
        // When
        byte[] result = documentService.downloadDocument(1L, 1L);

        // Then
        verify(documentRepository).findActiveDocumentById(1L);
        verify(documentPermissionService).hasDownloadPermission(1L, 1L);
        verify(documentAccessLogService).logSuccessfulAccess(
            eq(1L), eq(1L), eq(DocumentAccessType.DOWNLOAD), 
            isNull(), isNull(), isNull()
        );
    }

    @Test
    void downloadDocument_ShouldThrowException_WhenUserLacksPermission() {
        // Given
        when(documentRepository.findActiveDocumentById(1L)).thenReturn(Optional.of(document));
        when(documentPermissionService.hasDownloadPermission(1L, 1L)).thenReturn(false);

        // When & Then
        assertThrows(SecurityException.class, () -> {
            documentService.downloadDocument(1L, 1L);
        });
        verify(documentAccessLogService).logFailedAccess(
            eq(1L), eq(1L), eq(DocumentAccessType.DOWNLOAD), 
            isNull(), isNull(), isNull(), eq("Access denied")
        );
    }

    @Test
    void getDocumentsBySchool_ShouldReturnDocuments() {
        // Given
        List<Document> documents = Arrays.asList(document);
        Page<Document> documentPage = new PageImpl<>(documents, pageable, 1);
        when(documentRepository.findBySchoolId(1L, pageable)).thenReturn(documentPage);
        when(documentMapper.toDto(document)).thenReturn(documentDTO);

        // When
        Page<DocumentDTO> result = documentService.getDocumentsBySchool(1L, pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(documentRepository).findBySchoolId(1L, pageable);
    }

    @Test
    void getDocumentsByCategory_ShouldReturnDocuments() {
        // Given
        List<Document> documents = Arrays.asList(document);
        Page<Document> documentPage = new PageImpl<>(documents, pageable, 1);
        when(documentRepository.findByDocumentCategory(DocumentCategory.ACADEMIC_RESOURCE, pageable))
            .thenReturn(documentPage);
        when(documentMapper.toDto(document)).thenReturn(documentDTO);

        // When
        Page<DocumentDTO> result = documentService.getDocumentsByCategory(DocumentCategory.ACADEMIC_RESOURCE, pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(documentRepository).findByDocumentCategory(DocumentCategory.ACADEMIC_RESOURCE, pageable);
    }

    @Test
    void searchDocuments_ShouldReturnMatchingDocuments() {
        // Given
        String searchTerm = "test";
        List<Document> documents = Arrays.asList(document);
        Page<Document> documentPage = new PageImpl<>(documents, pageable, 1);
        when(documentRepository.searchDocuments(searchTerm, pageable)).thenReturn(documentPage);
        when(documentMapper.toDto(document)).thenReturn(documentDTO);

        // When
        Page<DocumentDTO> result = documentService.searchDocuments(searchTerm, pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(documentRepository).searchDocuments(searchTerm, pageable);
    }

    @Test
    void deleteDocument_ShouldSoftDeleteDocument_WhenUserHasPermission() {
        // Given
        when(documentRepository.findActiveDocumentById(1L)).thenReturn(Optional.of(document));
        when(documentPermissionService.hasDeletePermission(1L, 1L)).thenReturn(true);
        when(documentRepository.save(any(Document.class))).thenReturn(document);

        // When
        documentService.deleteDocument(1L, 1L);

        // Then
        verify(documentRepository).findActiveDocumentById(1L);
        verify(documentPermissionService).hasDeletePermission(1L, 1L);
        verify(documentRepository).save(document);
        assertFalse(document.isActive());
        verify(documentAccessLogService).logSuccessfulAccess(
            eq(1L), eq(1L), eq(DocumentAccessType.DELETE), 
            isNull(), isNull(), isNull()
        );
    }

    @Test
    void deleteDocument_ShouldThrowException_WhenUserLacksPermission() {
        // Given
        when(documentRepository.findActiveDocumentById(1L)).thenReturn(Optional.of(document));
        when(documentPermissionService.hasDeletePermission(1L, 1L)).thenReturn(false);

        // When & Then
        assertThrows(SecurityException.class, () -> {
            documentService.deleteDocument(1L, 1L);
        });
        verify(documentRepository, never()).save(any());
        verify(documentAccessLogService).logFailedAccess(
            eq(1L), eq(1L), eq(DocumentAccessType.DELETE), 
            isNull(), isNull(), isNull(), eq("Access denied")
        );
    }

    @Test
    void getDocumentVersions_ShouldReturnVersions() {
        // Given
        Document version2 = new Document();
        version2.setId(2L);
        version2.setVersionNumber(2);
        version2.setParentDocument(document);
        
        List<Document> versions = Arrays.asList(document, version2);
        when(documentRepository.findByParentDocumentId(1L)).thenReturn(versions);
        when(documentMapper.toDto(any(Document.class))).thenReturn(documentDTO);

        // When
        List<DocumentDTO> result = documentService.getDocumentVersions(1L);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(documentRepository).findByParentDocumentId(1L);
    }

    @Test
    void getExpiredDocuments_ShouldReturnExpiredDocuments() {
        // Given
        document.setExpiryDate(LocalDateTime.now().minusDays(1));
        List<Document> expiredDocs = Arrays.asList(document);
        when(documentRepository.findExpiredDocuments(any(LocalDateTime.class))).thenReturn(expiredDocs);
        when(documentMapper.toDto(document)).thenReturn(documentDTO);

        // When
        List<DocumentDTO> result = documentService.getExpiredDocuments();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(documentRepository).findExpiredDocuments(any(LocalDateTime.class));
    }

    @Test
    void getDocumentCountBySchool_ShouldReturnCount() {
        // Given
        when(documentRepository.countBySchoolId(1L)).thenReturn(5L);

        // When
        Long result = documentService.getDocumentCountBySchool(1L);

        // Then
        assertEquals(5L, result);
        verify(documentRepository).countBySchoolId(1L);
    }

    @Test
    void getTotalFileSizeBySchool_ShouldReturnTotalSize() {
        // Given
        when(documentRepository.getTotalFileSizeBySchoolId(1L)).thenReturn(10240L);

        // When
        Long result = documentService.getTotalFileSizeBySchool(1L);

        // Then
        assertEquals(10240L, result);
        verify(documentRepository).getTotalFileSizeBySchoolId(1L);
    }

    @Test
    void hasReadAccess_ShouldReturnTrue_WhenUserHasPermission() {
        // Given
        when(documentPermissionService.hasReadPermission(1L, 1L)).thenReturn(true);

        // When
        boolean result = documentService.hasReadAccess(1L, 1L);

        // Then
        assertTrue(result);
        verify(documentPermissionService).hasReadPermission(1L, 1L);
    }

    @Test
    void hasDownloadAccess_ShouldReturnFalse_WhenUserLacksPermission() {
        // Given
        when(documentPermissionService.hasDownloadPermission(1L, 1L)).thenReturn(false);

        // When
        boolean result = documentService.hasDownloadAccess(1L, 1L);

        // Then
        assertFalse(result);
        verify(documentPermissionService).hasDownloadPermission(1L, 1L);
    }

    @Test
    void uploadDocumentVersion_ShouldCreateNewVersion() throws IOException {
        // Given
        byte[] fileContent = "new version content".getBytes();
        when(multipartFile.getOriginalFilename()).thenReturn("test_v2.pdf");
        when(multipartFile.getSize()).thenReturn(2048L);
        when(multipartFile.getContentType()).thenReturn("application/pdf");
        when(multipartFile.getBytes()).thenReturn(fileContent);
        when(multipartFile.isEmpty()).thenReturn(false);
        
        when(documentRepository.findActiveDocumentById(1L)).thenReturn(Optional.of(document));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        Document newVersion = new Document();
        newVersion.setId(2L);
        newVersion.setVersionNumber(2);
        newVersion.setParentDocument(document);
        
        when(documentRepository.findByParentDocumentId(1L)).thenReturn(Arrays.asList(document));
        when(documentMapper.toEntity(any(DocumentDTO.class))).thenReturn(newVersion);
        when(documentRepository.save(any(Document.class))).thenReturn(newVersion);
        when(documentMapper.toDto(newVersion)).thenReturn(documentDTO);

        // When
        DocumentDTO result = documentService.uploadDocumentVersion(1L, multipartFile, documentDTO, 1L);

        // Then
        assertNotNull(result);
        verify(documentRepository).findActiveDocumentById(1L);
        verify(documentRepository).save(any(Document.class));
        verify(documentAccessLogService).logSuccessfulAccess(
            eq(newVersion.getId()), eq(1L), eq(DocumentAccessType.EDIT), 
            isNull(), isNull(), isNull()
        );
    }

    @Test
    void create_ShouldCreateDocument() {
        // Given
        when(documentMapper.toEntity(documentDTO)).thenReturn(document);
        when(documentRepository.save(document)).thenReturn(document);
        when(documentMapper.toDto(document)).thenReturn(documentDTO);

        // When
        DocumentDTO result = documentService.create(documentDTO);

        // Then
        assertNotNull(result);
        assertEquals(documentDTO, result);
        verify(documentMapper).toEntity(documentDTO);
        verify(documentRepository).save(document);
        verify(documentMapper).toDto(document);
    }

    @Test
    void update_ShouldUpdateDocument() {
        // Given
        when(documentRepository.findById(1L)).thenReturn(Optional.of(document));
        when(documentRepository.save(document)).thenReturn(document);
        when(documentMapper.toDto(document)).thenReturn(documentDTO);

        // When
        DocumentDTO result = documentService.update(1L, documentDTO);

        // Then
        assertNotNull(result);
        assertEquals(documentDTO, result);
        verify(documentRepository).findById(1L);
        verify(documentMapper).updateEntityFromDto(document, documentDTO);
        verify(documentRepository).save(document);
        verify(documentMapper).toDto(document);
    }

    @Test
    void update_ShouldThrowException_WhenDocumentNotFound() {
        // Given
        when(documentRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            documentService.update(1L, documentDTO);
        });
        verify(documentRepository).findById(1L);
        verify(documentRepository, never()).save(any());
    }
} 
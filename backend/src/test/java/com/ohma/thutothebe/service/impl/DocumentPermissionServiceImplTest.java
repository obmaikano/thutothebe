package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.DocumentPermissionDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.DocumentPermissionMapper;
import com.ohma.thutothebe.repository.DocumentPermissionRepository;
import com.ohma.thutothebe.repository.DocumentRepository;
import com.ohma.thutothebe.repository.UserRepository;
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

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DocumentPermissionServiceImplTest {

    @Mock
    private DocumentPermissionRepository documentPermissionRepository;

    @Mock
    private DocumentPermissionMapper documentPermissionMapper;

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DocumentPermissionServiceImpl documentPermissionService;

    private DocumentPermission documentPermission;
    private DocumentPermissionDTO documentPermissionDTO;
    private Document document;
    private User user;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        // Setup test data
        user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");

        document = new Document();
        document.setId(1L);
        document.setTitle("Test Document");

        documentPermission = new DocumentPermission();
        documentPermission.setId(1L);
        documentPermission.setDocument(document);
        documentPermission.setUserRole(UserRole.TEACHER);
        documentPermission.setPermissionType(DocumentPermissionType.READ);
        documentPermission.setActive(true);

        documentPermissionDTO = new DocumentPermissionDTO(
            1L, 1L, "Test Document", UserRole.TEACHER, DocumentPermissionType.READ,
            null, null, null, null, null, null, null, null, null, null,
            true, null, null, 1L
        );

        pageable = PageRequest.of(0, 10);
    }

    @Test
    void getAllActivePermissions_ShouldReturnPageOfPermissions() {
        // Given
        List<DocumentPermission> permissions = Arrays.asList(documentPermission);
        Page<DocumentPermission> permissionPage = new PageImpl<>(permissions, pageable, 1);
        when(documentPermissionRepository.findAllActivePermissions(pageable)).thenReturn(permissionPage);
        when(documentPermissionMapper.toDto(documentPermission)).thenReturn(documentPermissionDTO);

        // When
        Page<DocumentPermissionDTO> result = documentPermissionService.getAllActivePermissions(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(documentPermissionDTO, result.getContent().get(0));
        verify(documentPermissionRepository).findAllActivePermissions(pageable);
        verify(documentPermissionMapper).toDto(documentPermission);
    }

    @Test
    void getPermissionsByDocument_ShouldReturnPermissions() {
        // Given
        List<DocumentPermission> permissions = Arrays.asList(documentPermission);
        when(documentPermissionRepository.findByDocumentId(1L)).thenReturn(permissions);
        when(documentPermissionMapper.toDto(documentPermission)).thenReturn(documentPermissionDTO);

        // When
        List<DocumentPermissionDTO> result = documentPermissionService.getPermissionsByDocument(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(documentPermissionDTO, result.get(0));
        verify(documentPermissionRepository).findByDocumentId(1L);
        verify(documentPermissionMapper).toDto(documentPermission);
    }

    @Test
    void grantPermission_ShouldGrantPermission_WhenPermissionDoesNotExist() {
        // Given
        when(documentPermissionRepository.hasPermission(1L, UserRole.TEACHER, DocumentPermissionType.READ))
            .thenReturn(false);
        when(documentRepository.findById(1L)).thenReturn(Optional.of(document));
        when(documentPermissionRepository.save(any(DocumentPermission.class))).thenReturn(documentPermission);
        when(documentPermissionMapper.toDto(documentPermission)).thenReturn(documentPermissionDTO);

        // When
        DocumentPermissionDTO result = documentPermissionService.grantPermission(
            1L, UserRole.TEACHER, DocumentPermissionType.READ, 1L);

        // Then
        assertNotNull(result);
        assertEquals(documentPermissionDTO, result);
        verify(documentPermissionRepository).hasPermission(1L, UserRole.TEACHER, DocumentPermissionType.READ);
        verify(documentRepository).findById(1L);
        verify(documentPermissionRepository).save(any(DocumentPermission.class));
        verify(documentPermissionMapper).toDto(documentPermission);
    }

    @Test
    void grantPermission_ShouldThrowException_WhenPermissionAlreadyExists() {
        // Given
        when(documentPermissionRepository.hasPermission(1L, UserRole.TEACHER, DocumentPermissionType.READ))
            .thenReturn(true);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            documentPermissionService.grantPermission(1L, UserRole.TEACHER, DocumentPermissionType.READ, 1L);
        });
        verify(documentPermissionRepository).hasPermission(1L, UserRole.TEACHER, DocumentPermissionType.READ);
        verify(documentRepository, never()).findById(any());
        verify(documentPermissionRepository, never()).save(any());
    }

    @Test
    void grantSpecificUserPermission_ShouldGrantPermission_WhenPermissionDoesNotExist() {
        // Given
        when(documentPermissionRepository.hasSpecificUserPermission(1L, 1L, DocumentPermissionType.READ))
            .thenReturn(false);
        when(documentRepository.findById(1L)).thenReturn(Optional.of(document));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(documentPermissionRepository.save(any(DocumentPermission.class))).thenReturn(documentPermission);
        when(documentPermissionMapper.toDto(documentPermission)).thenReturn(documentPermissionDTO);

        // When
        DocumentPermissionDTO result = documentPermissionService.grantSpecificUserPermission(
            1L, 1L, DocumentPermissionType.READ, 1L);

        // Then
        assertNotNull(result);
        assertEquals(documentPermissionDTO, result);
        verify(documentPermissionRepository).hasSpecificUserPermission(1L, 1L, DocumentPermissionType.READ);
        verify(documentRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(documentPermissionRepository).save(any(DocumentPermission.class));
        verify(documentPermissionMapper).toDto(documentPermission);
    }

    @Test
    void hasPermission_ShouldReturnTrue_WhenPermissionExists() {
        // Given
        when(documentPermissionRepository.hasPermission(1L, UserRole.TEACHER, DocumentPermissionType.READ))
            .thenReturn(true);

        // When
        boolean result = documentPermissionService.hasPermission(1L, UserRole.TEACHER, DocumentPermissionType.READ);

        // Then
        assertTrue(result);
        verify(documentPermissionRepository).hasPermission(1L, UserRole.TEACHER, DocumentPermissionType.READ);
    }

    @Test
    void hasSpecificUserPermission_ShouldReturnFalse_WhenPermissionDoesNotExist() {
        // Given
        when(documentPermissionRepository.hasSpecificUserPermission(1L, 1L, DocumentPermissionType.READ))
            .thenReturn(false);

        // When
        boolean result = documentPermissionService.hasSpecificUserPermission(1L, 1L, DocumentPermissionType.READ);

        // Then
        assertFalse(result);
        verify(documentPermissionRepository).hasSpecificUserPermission(1L, 1L, DocumentPermissionType.READ);
    }

    @Test
    void hasReadPermission_ShouldReturnTrue_WhenUserHasReadPermission() {
        // Given
        when(documentPermissionRepository.hasSpecificUserPermission(1L, 1L, DocumentPermissionType.READ))
            .thenReturn(true);

        // When
        boolean result = documentPermissionService.hasReadPermission(1L, 1L);

        // Then
        assertTrue(result);
        verify(documentPermissionRepository).hasSpecificUserPermission(1L, 1L, DocumentPermissionType.READ);
    }

    @Test
    void revokePermission_ShouldRevokePermission_WhenPermissionExists() {
        // Given
        when(documentPermissionRepository.findById(1L)).thenReturn(Optional.of(documentPermission));
        when(documentPermissionRepository.save(documentPermission)).thenReturn(documentPermission);

        // When
        documentPermissionService.revokePermission(1L, 1L);

        // Then
        verify(documentPermissionRepository).findById(1L);
        verify(documentPermissionRepository).save(documentPermission);
        assertFalse(documentPermission.isActive());
    }

    @Test
    void revokePermission_ShouldThrowException_WhenPermissionNotFound() {
        // Given
        when(documentPermissionRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            documentPermissionService.revokePermission(1L, 1L);
        });
        verify(documentPermissionRepository).findById(1L);
        verify(documentPermissionRepository, never()).save(any());
    }

    @Test
    void getPermissionsByDocumentAndUserRole_ShouldReturnPermissions() {
        // Given
        List<DocumentPermission> permissions = Arrays.asList(documentPermission);
        when(documentPermissionRepository.findByDocumentIdAndUserRole(1L, UserRole.TEACHER))
            .thenReturn(permissions);
        when(documentPermissionMapper.toDto(documentPermission)).thenReturn(documentPermissionDTO);

        // When
        List<DocumentPermissionDTO> result = documentPermissionService.getPermissionsByDocumentAndUserRole(
            1L, UserRole.TEACHER);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(documentPermissionDTO, result.get(0));
        verify(documentPermissionRepository).findByDocumentIdAndUserRole(1L, UserRole.TEACHER);
        verify(documentPermissionMapper).toDto(documentPermission);
    }

    @Test
    void create_ShouldCreatePermission() {
        // Given
        when(documentPermissionMapper.toEntity(documentPermissionDTO)).thenReturn(documentPermission);
        when(documentPermissionRepository.save(documentPermission)).thenReturn(documentPermission);
        when(documentPermissionMapper.toDto(documentPermission)).thenReturn(documentPermissionDTO);

        // When
        DocumentPermissionDTO result = documentPermissionService.create(documentPermissionDTO);

        // Then
        assertNotNull(result);
        assertEquals(documentPermissionDTO, result);
        verify(documentPermissionMapper).toEntity(documentPermissionDTO);
        verify(documentPermissionRepository).save(documentPermission);
        verify(documentPermissionMapper).toDto(documentPermission);
    }

    @Test
    void update_ShouldUpdatePermission() {
        // Given
        when(documentPermissionRepository.findById(1L)).thenReturn(Optional.of(documentPermission));
        when(documentPermissionRepository.save(documentPermission)).thenReturn(documentPermission);
        when(documentPermissionMapper.toDto(documentPermission)).thenReturn(documentPermissionDTO);

        // When
        DocumentPermissionDTO result = documentPermissionService.update(1L, documentPermissionDTO);

        // Then
        assertNotNull(result);
        assertEquals(documentPermissionDTO, result);
        verify(documentPermissionRepository).findById(1L);
        verify(documentPermissionMapper).updateEntityFromDto(documentPermission, documentPermissionDTO);
        verify(documentPermissionRepository).save(documentPermission);
        verify(documentPermissionMapper).toDto(documentPermission);
    }
} 
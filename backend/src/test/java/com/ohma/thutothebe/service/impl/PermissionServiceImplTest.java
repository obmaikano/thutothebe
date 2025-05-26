package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.PermissionDTO;
import com.ohma.thutothebe.entity.Permission;
import com.ohma.thutothebe.entity.PermissionAction;
import com.ohma.thutothebe.mapper.PermissionMapper;
import com.ohma.thutothebe.repository.PermissionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PermissionServiceImplTest {

    @Mock
    private PermissionRepository permissionRepository;

    @Mock
    private PermissionMapper permissionMapper;

    @InjectMocks
    private PermissionServiceImpl permissionService;

    private Permission testPermission;
    private PermissionDTO testPermissionDTO;

    @BeforeEach
    void setUp() {
        testPermission = new Permission();
        testPermission.setId(1L);
        testPermission.setName("USER_CREATE");
        testPermission.setResource("USER");
        testPermission.setAction(PermissionAction.CREATE);
        testPermission.setDescription("Create new users");
        testPermission.setActive(true);

        testPermissionDTO = new PermissionDTO(
            1L,
            "USER_CREATE",
            "USER",
            PermissionAction.CREATE,
            "Create new users",
            true
        );
    }

    @Test
    void create_ShouldCreatePermission_WhenValidDTOProvided() {
        // Arrange
        when(permissionMapper.toEntity(testPermissionDTO)).thenReturn(testPermission);
        when(permissionRepository.save(any(Permission.class))).thenReturn(testPermission);
        when(permissionMapper.toDto(testPermission)).thenReturn(testPermissionDTO);

        // Act
        PermissionDTO result = permissionService.create(testPermissionDTO);

        // Assert
        assertNotNull(result);
        assertEquals(testPermissionDTO.name(), result.name());
        assertEquals(testPermissionDTO.resource(), result.resource());
        assertEquals(testPermissionDTO.action(), result.action());
        verify(permissionRepository).save(any(Permission.class));
        verify(permissionMapper).toEntity(testPermissionDTO);
        verify(permissionMapper).toDto(testPermission);
    }

    @Test
    void findByName_ShouldReturnPermission_WhenPermissionExists() {
        // Arrange
        when(permissionRepository.findByName("USER_CREATE")).thenReturn(Optional.of(testPermission));
        when(permissionMapper.toDto(testPermission)).thenReturn(testPermissionDTO);

        // Act
        PermissionDTO result = permissionService.findByName("USER_CREATE");

        // Assert
        assertNotNull(result);
        assertEquals("USER_CREATE", result.name());
        verify(permissionRepository).findByName("USER_CREATE");
        verify(permissionMapper).toDto(testPermission);
    }

    @Test
    void findByName_ShouldReturnNull_WhenPermissionDoesNotExist() {
        // Arrange
        when(permissionRepository.findByName("NONEXISTENT")).thenReturn(Optional.empty());

        // Act
        PermissionDTO result = permissionService.findByName("NONEXISTENT");

        // Assert
        assertNull(result);
        verify(permissionRepository).findByName("NONEXISTENT");
        verify(permissionMapper, never()).toDto(any());
    }

    @Test
    void findByResourceAndAction_ShouldReturnPermission_WhenExists() {
        // Arrange
        when(permissionRepository.findByResourceAndAction("USER", PermissionAction.CREATE))
            .thenReturn(Optional.of(testPermission));
        when(permissionMapper.toDto(testPermission)).thenReturn(testPermissionDTO);

        // Act
        PermissionDTO result = permissionService.findByResourceAndAction("USER", PermissionAction.CREATE);

        // Assert
        assertNotNull(result);
        assertEquals("USER", result.resource());
        assertEquals(PermissionAction.CREATE, result.action());
        verify(permissionRepository).findByResourceAndAction("USER", PermissionAction.CREATE);
        verify(permissionMapper).toDto(testPermission);
    }

    @Test
    void findByResource_ShouldReturnPermissionList_WhenResourceExists() {
        // Arrange
        Permission permission2 = new Permission();
        permission2.setId(2L);
        permission2.setName("USER_READ");
        permission2.setResource("USER");
        permission2.setAction(PermissionAction.READ);

        PermissionDTO permissionDTO2 = new PermissionDTO(
            2L, "USER_READ", "USER", PermissionAction.READ, "Read user information", true
        );

        List<Permission> permissions = Arrays.asList(testPermission, permission2);
        when(permissionRepository.findByResource("USER")).thenReturn(permissions);
        when(permissionMapper.toDto(testPermission)).thenReturn(testPermissionDTO);
        when(permissionMapper.toDto(permission2)).thenReturn(permissionDTO2);

        // Act
        List<PermissionDTO> result = permissionService.findByResource("USER");

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("USER_CREATE", result.get(0).name());
        assertEquals("USER_READ", result.get(1).name());
        verify(permissionRepository).findByResource("USER");
        verify(permissionMapper, times(2)).toDto(any(Permission.class));
    }

    @Test
    void findByAction_ShouldReturnPermissionList_WhenActionExists() {
        // Arrange
        Permission permission2 = new Permission();
        permission2.setId(2L);
        permission2.setName("COURSE_CREATE");
        permission2.setResource("COURSE");
        permission2.setAction(PermissionAction.CREATE);

        PermissionDTO permissionDTO2 = new PermissionDTO(
            2L, "COURSE_CREATE", "COURSE", PermissionAction.CREATE, "Create courses", true
        );

        List<Permission> permissions = Arrays.asList(testPermission, permission2);
        when(permissionRepository.findByAction(PermissionAction.CREATE)).thenReturn(permissions);
        when(permissionMapper.toDto(testPermission)).thenReturn(testPermissionDTO);
        when(permissionMapper.toDto(permission2)).thenReturn(permissionDTO2);

        // Act
        List<PermissionDTO> result = permissionService.findByAction(PermissionAction.CREATE);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(p -> p.action() == PermissionAction.CREATE));
        verify(permissionRepository).findByAction(PermissionAction.CREATE);
        verify(permissionMapper, times(2)).toDto(any(Permission.class));
    }

    @Test
    void findActivePermissions_ShouldReturnActivePermissions() {
        // Arrange
        List<Permission> activePermissions = Arrays.asList(testPermission);
        when(permissionRepository.findByActiveTrue()).thenReturn(activePermissions);
        when(permissionMapper.toDto(testPermission)).thenReturn(testPermissionDTO);

        // Act
        List<PermissionDTO> result = permissionService.findActivePermissions();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).active());
        verify(permissionRepository).findByActiveTrue();
        verify(permissionMapper).toDto(testPermission);
    }

    @Test
    void findActivePermissionsByResource_ShouldReturnActivePermissionsForResource() {
        // Arrange
        List<Permission> activePermissions = Arrays.asList(testPermission);
        when(permissionRepository.findActivePermissionsByResource("USER")).thenReturn(activePermissions);
        when(permissionMapper.toDto(testPermission)).thenReturn(testPermissionDTO);

        // Act
        List<PermissionDTO> result = permissionService.findActivePermissionsByResource("USER");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("USER", result.get(0).resource());
        assertTrue(result.get(0).active());
        verify(permissionRepository).findActivePermissionsByResource("USER");
        verify(permissionMapper).toDto(testPermission);
    }

    @Test
    void findActivePermissionsByAction_ShouldReturnActivePermissionsForAction() {
        // Arrange
        List<Permission> activePermissions = Arrays.asList(testPermission);
        when(permissionRepository.findActivePermissionsByAction(PermissionAction.CREATE)).thenReturn(activePermissions);
        when(permissionMapper.toDto(testPermission)).thenReturn(testPermissionDTO);

        // Act
        List<PermissionDTO> result = permissionService.findActivePermissionsByAction(PermissionAction.CREATE);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(PermissionAction.CREATE, result.get(0).action());
        assertTrue(result.get(0).active());
        verify(permissionRepository).findActivePermissionsByAction(PermissionAction.CREATE);
        verify(permissionMapper).toDto(testPermission);
    }

    @Test
    void existsByName_ShouldReturnTrue_WhenPermissionExists() {
        // Arrange
        when(permissionRepository.existsByName("USER_CREATE")).thenReturn(true);

        // Act
        boolean result = permissionService.existsByName("USER_CREATE");

        // Assert
        assertTrue(result);
        verify(permissionRepository).existsByName("USER_CREATE");
    }

    @Test
    void existsByName_ShouldReturnFalse_WhenPermissionDoesNotExist() {
        // Arrange
        when(permissionRepository.existsByName("NONEXISTENT")).thenReturn(false);

        // Act
        boolean result = permissionService.existsByName("NONEXISTENT");

        // Assert
        assertFalse(result);
        verify(permissionRepository).existsByName("NONEXISTENT");
    }

    @Test
    void existsByResourceAndAction_ShouldReturnTrue_WhenPermissionExists() {
        // Arrange
        when(permissionRepository.existsByResourceAndAction("USER", PermissionAction.CREATE)).thenReturn(true);

        // Act
        boolean result = permissionService.existsByResourceAndAction("USER", PermissionAction.CREATE);

        // Assert
        assertTrue(result);
        verify(permissionRepository).existsByResourceAndAction("USER", PermissionAction.CREATE);
    }

    @Test
    void existsByResourceAndAction_ShouldReturnFalse_WhenPermissionDoesNotExist() {
        // Arrange
        when(permissionRepository.existsByResourceAndAction("NONEXISTENT", PermissionAction.CREATE)).thenReturn(false);

        // Act
        boolean result = permissionService.existsByResourceAndAction("NONEXISTENT", PermissionAction.CREATE);

        // Assert
        assertFalse(result);
        verify(permissionRepository).existsByResourceAndAction("NONEXISTENT", PermissionAction.CREATE);
    }

    @Test
    void update_ShouldUpdatePermission_WhenValidDTOProvided() {
        // Arrange
        PermissionDTO updatedDTO = new PermissionDTO(
            1L, "USER_CREATE_UPDATED", "USER", PermissionAction.CREATE, "Updated description", true
        );
        
        when(permissionRepository.findById(1L)).thenReturn(Optional.of(testPermission));
        when(permissionRepository.save(any(Permission.class))).thenReturn(testPermission);
        when(permissionMapper.toDto(testPermission)).thenReturn(updatedDTO);

        // Act
        PermissionDTO result = permissionService.update(1L, updatedDTO);

        // Assert
        assertNotNull(result);
        assertEquals("USER_CREATE_UPDATED", result.name());
        verify(permissionRepository).findById(1L);
        verify(permissionRepository).save(any(Permission.class));
        verify(permissionMapper).updateEntity(eq(testPermission), eq(updatedDTO));
        verify(permissionMapper).toDto(testPermission);
    }

    @Test
    void delete_ShouldDeletePermission_WhenPermissionExists() {
        // Arrange
        when(permissionRepository.existsById(1L)).thenReturn(true);

        // Act
        permissionService.delete(1L);

        // Assert
        verify(permissionRepository).existsById(1L);
        verify(permissionRepository).deleteById(1L);
    }

    @Test
    void delete_ShouldThrowException_WhenPermissionDoesNotExist() {
        // Arrange
        when(permissionRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> permissionService.delete(1L));
        verify(permissionRepository).existsById(1L);
        verify(permissionRepository, never()).deleteById(any());
    }

    @Test
    void initializeDefaultPermissions_ShouldCreateDefaultPermissions() {
        // Arrange
        when(permissionService.existsByName(anyString())).thenReturn(false);
        when(permissionRepository.save(any(Permission.class))).thenReturn(testPermission);

        // Act
        permissionService.initializeDefaultPermissions();

        // Assert
        verify(permissionRepository, atLeastOnce()).save(any(Permission.class));
    }

    @Test
    void initializeDefaultPermissions_ShouldNotCreateDuplicatePermissions() {
        // Arrange
        when(permissionService.existsByName(anyString())).thenReturn(true);

        // Act
        permissionService.initializeDefaultPermissions();

        // Assert
        verify(permissionRepository, never()).save(any(Permission.class));
    }

    @Test
    void getById_ShouldReturnPermission_WhenPermissionExists() {
        // Arrange
        when(permissionRepository.findById(1L)).thenReturn(Optional.of(testPermission));
        when(permissionMapper.toDto(testPermission)).thenReturn(testPermissionDTO);

        // Act
        PermissionDTO result = permissionService.getById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.id());
        assertEquals("USER_CREATE", result.name());
        verify(permissionRepository).findById(1L);
        verify(permissionMapper).toDto(testPermission);
    }

    @Test
    void getAll_ShouldReturnAllPermissions() {
        // Arrange
        List<Permission> permissions = Arrays.asList(testPermission);
        when(permissionRepository.findAll()).thenReturn(permissions);
        when(permissionMapper.toDto(testPermission)).thenReturn(testPermissionDTO);

        // Act
        List<PermissionDTO> result = permissionService.getAll();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("USER_CREATE", result.get(0).name());
        verify(permissionRepository).findAll();
        verify(permissionMapper).toDto(testPermission);
    }
} 
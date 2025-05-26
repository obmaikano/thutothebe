package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.RolePermissionDTO;
import com.ohma.thutothebe.dto.UserPermissionCheckDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.mapper.RolePermissionMapper;
import com.ohma.thutothebe.repository.PermissionRepository;
import com.ohma.thutothebe.repository.RolePermissionRepository;
import com.ohma.thutothebe.repository.UserRepository;
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
class RolePermissionServiceImplTest {

    @Mock
    private RolePermissionRepository rolePermissionRepository;

    @Mock
    private PermissionRepository permissionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RolePermissionMapper rolePermissionMapper;

    @InjectMocks
    private RolePermissionServiceImpl rolePermissionService;

    private RolePermission testRolePermission;
    private RolePermissionDTO testRolePermissionDTO;
    private Permission testPermission;
    private User testUser;

    @BeforeEach
    void setUp() {
        testPermission = new Permission();
        testPermission.setId(1L);
        testPermission.setName("USER_CREATE");
        testPermission.setResource("USER");
        testPermission.setAction(PermissionAction.CREATE);
        testPermission.setDescription("Create new users");
        testPermission.setActive(true);

        testRolePermission = new RolePermission();
        testRolePermission.setId(1L);
        testRolePermission.setRole(UserRole.SCHOOL_ADMIN);
        testRolePermission.setPermission(testPermission);
        testRolePermission.setScopeType(PermissionScope.SCHOOL);
        testRolePermission.setScopeId(1L);
        testRolePermission.setActive(true);

        testRolePermissionDTO = new RolePermissionDTO(
            1L,
            UserRole.SCHOOL_ADMIN,
            1L,
            "USER_CREATE",
            "USER",
            "CREATE",
            PermissionScope.SCHOOL,
            1L,
            "SCHOOL:1",
            true
        );

        testUser = new User();
        testUser.setId(1L);
        testUser.setRole(UserRole.SCHOOL_ADMIN);
        testUser.setUsername("admin");
    }

    @Test
    void create_ShouldCreateRolePermission_WhenValidDTOProvided() {
        // Arrange
        when(rolePermissionMapper.toEntity(testRolePermissionDTO)).thenReturn(testRolePermission);
        when(rolePermissionRepository.save(any(RolePermission.class))).thenReturn(testRolePermission);
        when(rolePermissionMapper.toDto(testRolePermission)).thenReturn(testRolePermissionDTO);

        // Act
        RolePermissionDTO result = rolePermissionService.create(testRolePermissionDTO);

        // Assert
        assertNotNull(result);
        assertEquals(testRolePermissionDTO.role(), result.role());
        assertEquals(testRolePermissionDTO.permissionId(), result.permissionId());
        verify(rolePermissionRepository).save(any(RolePermission.class));
        verify(rolePermissionMapper).toEntity(testRolePermissionDTO);
        verify(rolePermissionMapper).toDto(testRolePermission);
    }

    @Test
    void findByRole_ShouldReturnRolePermissions_WhenRoleExists() {
        // Arrange
        List<RolePermission> rolePermissions = Arrays.asList(testRolePermission);
        when(rolePermissionRepository.findByRole(UserRole.SCHOOL_ADMIN)).thenReturn(rolePermissions);
        when(rolePermissionMapper.toDto(testRolePermission)).thenReturn(testRolePermissionDTO);

        // Act
        List<RolePermissionDTO> result = rolePermissionService.findByRole(UserRole.SCHOOL_ADMIN);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(UserRole.SCHOOL_ADMIN, result.get(0).role());
        verify(rolePermissionRepository).findByRole(UserRole.SCHOOL_ADMIN);
        verify(rolePermissionMapper).toDto(testRolePermission);
    }

    @Test
    void findActiveByRole_ShouldReturnActiveRolePermissions_WhenRoleExists() {
        // Arrange
        List<RolePermission> activeRolePermissions = Arrays.asList(testRolePermission);
        when(rolePermissionRepository.findByRoleAndActiveTrue(UserRole.SCHOOL_ADMIN)).thenReturn(activeRolePermissions);
        when(rolePermissionMapper.toDto(testRolePermission)).thenReturn(testRolePermissionDTO);

        // Act
        List<RolePermissionDTO> result = rolePermissionService.findActiveByRole(UserRole.SCHOOL_ADMIN);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).active());
        assertEquals(UserRole.SCHOOL_ADMIN, result.get(0).role());
        verify(rolePermissionRepository).findByRoleAndActiveTrue(UserRole.SCHOOL_ADMIN);
        verify(rolePermissionMapper).toDto(testRolePermission);
    }

    @Test
    void findByPermissionId_ShouldReturnRolePermissions_WhenPermissionExists() {
        // Arrange
        List<RolePermission> rolePermissions = Arrays.asList(testRolePermission);
        when(rolePermissionRepository.findByPermissionId(1L)).thenReturn(rolePermissions);
        when(rolePermissionMapper.toDto(testRolePermission)).thenReturn(testRolePermissionDTO);

        // Act
        List<RolePermissionDTO> result = rolePermissionService.findByPermissionId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).permissionId());
        verify(rolePermissionRepository).findByPermissionId(1L);
        verify(rolePermissionMapper).toDto(testRolePermission);
    }

    @Test
    void findByScope_ShouldReturnRolePermissions_WhenScopeExists() {
        // Arrange
        List<RolePermission> rolePermissions = Arrays.asList(testRolePermission);
        when(rolePermissionRepository.findByScopeTypeAndScopeId(PermissionScope.SCHOOL, 1L)).thenReturn(rolePermissions);
        when(rolePermissionMapper.toDto(testRolePermission)).thenReturn(testRolePermissionDTO);

        // Act
        List<RolePermissionDTO> result = rolePermissionService.findByScope(PermissionScope.SCHOOL, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(PermissionScope.SCHOOL, result.get(0).scopeType());
        assertEquals(1L, result.get(0).scopeId());
        verify(rolePermissionRepository).findByScopeTypeAndScopeId(PermissionScope.SCHOOL, 1L);
        verify(rolePermissionMapper).toDto(testRolePermission);
    }

    @Test
    void findByRoleAndResource_ShouldReturnRolePermissions_WhenRoleAndResourceExist() {
        // Arrange
        List<RolePermission> rolePermissions = Arrays.asList(testRolePermission);
        when(rolePermissionRepository.findByRoleAndResource(UserRole.SCHOOL_ADMIN, "USER")).thenReturn(rolePermissions);
        when(rolePermissionMapper.toDto(testRolePermission)).thenReturn(testRolePermissionDTO);

        // Act
        List<RolePermissionDTO> result = rolePermissionService.findByRoleAndResource(UserRole.SCHOOL_ADMIN, "USER");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(UserRole.SCHOOL_ADMIN, result.get(0).role());
        assertEquals("USER", result.get(0).resource());
        verify(rolePermissionRepository).findByRoleAndResource(UserRole.SCHOOL_ADMIN, "USER");
        verify(rolePermissionMapper).toDto(testRolePermission);
    }

    @Test
    void findResourcesByRole_ShouldReturnResources_WhenRoleExists() {
        // Arrange
        List<String> resources = Arrays.asList("USER", "COURSE", "ASSIGNMENT");
        when(rolePermissionRepository.findResourcesByRole(UserRole.SCHOOL_ADMIN)).thenReturn(resources);

        // Act
        List<String> result = rolePermissionService.findResourcesByRole(UserRole.SCHOOL_ADMIN);

        // Assert
        assertNotNull(result);
        assertEquals(3, result.size());
        assertTrue(result.contains("USER"));
        assertTrue(result.contains("COURSE"));
        assertTrue(result.contains("ASSIGNMENT"));
        verify(rolePermissionRepository).findResourcesByRole(UserRole.SCHOOL_ADMIN);
    }

    @Test
    void hasPermission_ShouldReturnTrue_WhenPermissionExists() {
        // Arrange
        List<RolePermission> rolePermissions = Arrays.asList(testRolePermission);
        when(rolePermissionRepository.findByRoleAndResourceAndAction(UserRole.SCHOOL_ADMIN, "USER", PermissionAction.CREATE))
            .thenReturn(rolePermissions);

        // Act
        boolean result = rolePermissionService.hasPermission(UserRole.SCHOOL_ADMIN, "USER", PermissionAction.CREATE);

        // Assert
        assertTrue(result);
        verify(rolePermissionRepository).findByRoleAndResourceAndAction(UserRole.SCHOOL_ADMIN, "USER", PermissionAction.CREATE);
    }

    @Test
    void hasPermission_ShouldReturnFalse_WhenPermissionDoesNotExist() {
        // Arrange
        when(rolePermissionRepository.findByRoleAndResourceAndAction(UserRole.STUDENT, "USER", PermissionAction.CREATE))
            .thenReturn(Arrays.asList());

        // Act
        boolean result = rolePermissionService.hasPermission(UserRole.STUDENT, "USER", PermissionAction.CREATE);

        // Assert
        assertFalse(result);
        verify(rolePermissionRepository).findByRoleAndResourceAndAction(UserRole.STUDENT, "USER", PermissionAction.CREATE);
    }

    @Test
    void hasPermissionWithScope_ShouldReturnTrue_WhenScopedPermissionExists() {
        // Arrange
        when(rolePermissionRepository.findByRoleAndResourceAndActionAndScope(
            UserRole.SCHOOL_ADMIN, "USER", PermissionAction.CREATE, PermissionScope.SCHOOL, 1L))
            .thenReturn(Optional.of(testRolePermission));

        // Act
        boolean result = rolePermissionService.hasPermissionWithScope(
            UserRole.SCHOOL_ADMIN, "USER", PermissionAction.CREATE, PermissionScope.SCHOOL, 1L);

        // Assert
        assertTrue(result);
        verify(rolePermissionRepository).findByRoleAndResourceAndActionAndScope(
            UserRole.SCHOOL_ADMIN, "USER", PermissionAction.CREATE, PermissionScope.SCHOOL, 1L);
    }

    @Test
    void hasPermissionWithScope_ShouldReturnFalse_WhenScopedPermissionDoesNotExist() {
        // Arrange
        when(rolePermissionRepository.findByRoleAndResourceAndActionAndScope(
            UserRole.STUDENT, "USER", PermissionAction.CREATE, PermissionScope.SCHOOL, 1L))
            .thenReturn(Optional.empty());

        // Act
        boolean result = rolePermissionService.hasPermissionWithScope(
            UserRole.STUDENT, "USER", PermissionAction.CREATE, PermissionScope.SCHOOL, 1L);

        // Assert
        assertFalse(result);
        verify(rolePermissionRepository).findByRoleAndResourceAndActionAndScope(
            UserRole.STUDENT, "USER", PermissionAction.CREATE, PermissionScope.SCHOOL, 1L);
    }

    @Test
    void checkUserPermission_ShouldReturnPermissionGranted_WhenGlobalPermissionExists() {
        // Arrange
        UserPermissionCheckDTO checkRequest = new UserPermissionCheckDTO(
            1L, UserRole.SUPER_ADMIN, "USER", PermissionAction.CREATE, null, null, false, null, null
        );

        List<RolePermission> rolePermissions = Arrays.asList(testRolePermission);
        when(rolePermissionRepository.findByRoleAndResourceAndAction(UserRole.SUPER_ADMIN, "USER", PermissionAction.CREATE))
            .thenReturn(rolePermissions);

        // Act
        UserPermissionCheckDTO result = rolePermissionService.checkUserPermission(checkRequest);

        // Assert
        assertNotNull(result);
        assertTrue(result.hasPermission());
        assertEquals("Global permission granted", result.reason());
        verify(rolePermissionRepository).findByRoleAndResourceAndAction(UserRole.SUPER_ADMIN, "USER", PermissionAction.CREATE);
    }

    @Test
    void checkUserPermission_ShouldReturnPermissionGranted_WhenScopedPermissionExists() {
        // Arrange
        UserPermissionCheckDTO checkRequest = new UserPermissionCheckDTO(
            1L, UserRole.SCHOOL_ADMIN, "USER", PermissionAction.CREATE, PermissionScope.SCHOOL, 1L, false, null, null
        );

        when(rolePermissionRepository.findByRoleAndResourceAndAction(UserRole.SCHOOL_ADMIN, "USER", PermissionAction.CREATE))
            .thenReturn(Arrays.asList());
        when(rolePermissionRepository.findByRoleAndResourceAndActionAndScope(
            UserRole.SCHOOL_ADMIN, "USER", PermissionAction.CREATE, PermissionScope.SCHOOL, 1L))
            .thenReturn(Optional.of(testRolePermission));

        // Act
        UserPermissionCheckDTO result = rolePermissionService.checkUserPermission(checkRequest);

        // Assert
        assertNotNull(result);
        assertTrue(result.hasPermission());
        assertEquals("Scoped permission granted", result.reason());
        assertEquals("SCHOOL:1", result.scopeName());
    }

    @Test
    void checkUserPermission_ShouldReturnPermissionGranted_WhenRoleHierarchyAllows() {
        // Arrange
        UserPermissionCheckDTO checkRequest = new UserPermissionCheckDTO(
            1L, UserRole.SUPER_ADMIN, "USER", PermissionAction.CREATE, null, null, false, null, null
        );

        when(rolePermissionRepository.findByRoleAndResourceAndAction(UserRole.SUPER_ADMIN, "USER", PermissionAction.CREATE))
            .thenReturn(Arrays.asList());

        // Act
        UserPermissionCheckDTO result = rolePermissionService.checkUserPermission(checkRequest);

        // Assert
        assertNotNull(result);
        assertTrue(result.hasPermission());
        assertEquals("Permission granted through role hierarchy", result.reason());
    }

    @Test
    void checkUserPermission_ShouldReturnPermissionDenied_WhenNoPermissionExists() {
        // Arrange
        UserPermissionCheckDTO checkRequest = new UserPermissionCheckDTO(
            1L, UserRole.STUDENT, "USER", PermissionAction.DELETE, null, null, false, null, null
        );

        when(rolePermissionRepository.findByRoleAndResourceAndAction(UserRole.STUDENT, "USER", PermissionAction.DELETE))
            .thenReturn(Arrays.asList());

        // Act
        UserPermissionCheckDTO result = rolePermissionService.checkUserPermission(checkRequest);

        // Assert
        assertNotNull(result);
        assertFalse(result.hasPermission());
        assertEquals("Permission denied", result.reason());
    }

    @Test
    void assignPermissionToRole_ShouldCreateRolePermission_WhenValidParametersProvided() {
        // Arrange
        when(permissionRepository.findById(1L)).thenReturn(Optional.of(testPermission));
        when(rolePermissionRepository.save(any(RolePermission.class))).thenReturn(testRolePermission);
        when(rolePermissionMapper.toDto(testRolePermission)).thenReturn(testRolePermissionDTO);

        // Act
        RolePermissionDTO result = rolePermissionService.assignPermissionToRole(
            UserRole.SCHOOL_ADMIN, 1L, PermissionScope.SCHOOL, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(UserRole.SCHOOL_ADMIN, result.role());
        assertEquals(1L, result.permissionId());
        assertEquals(PermissionScope.SCHOOL, result.scopeType());
        assertEquals(1L, result.scopeId());
        verify(permissionRepository).findById(1L);
        verify(rolePermissionRepository).save(any(RolePermission.class));
        verify(rolePermissionMapper).toDto(testRolePermission);
    }

    @Test
    void assignPermissionToRole_ShouldThrowException_WhenPermissionNotFound() {
        // Arrange
        when(permissionRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> 
            rolePermissionService.assignPermissionToRole(UserRole.SCHOOL_ADMIN, 999L, PermissionScope.SCHOOL, 1L));
        verify(permissionRepository).findById(999L);
        verify(rolePermissionRepository, never()).save(any());
    }

    @Test
    void removePermissionFromRole_ShouldDeleteRolePermission_WhenExists() {
        // Arrange
        when(permissionRepository.findById(1L)).thenReturn(Optional.of(testPermission));
        when(rolePermissionRepository.findByRoleAndResourceAndActionAndScope(
            UserRole.SCHOOL_ADMIN, "USER", PermissionAction.CREATE, PermissionScope.SCHOOL, 1L))
            .thenReturn(Optional.of(testRolePermission));

        // Act
        rolePermissionService.removePermissionFromRole(UserRole.SCHOOL_ADMIN, 1L, PermissionScope.SCHOOL, 1L);

        // Assert
        verify(permissionRepository).findById(1L);
        verify(rolePermissionRepository).findByRoleAndResourceAndActionAndScope(
            UserRole.SCHOOL_ADMIN, "USER", PermissionAction.CREATE, PermissionScope.SCHOOL, 1L);
        verify(rolePermissionRepository).delete(testRolePermission);
    }

    @Test
    void removePermissionFromRole_ShouldThrowException_WhenPermissionNotFound() {
        // Arrange
        when(permissionRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> 
            rolePermissionService.removePermissionFromRole(UserRole.SCHOOL_ADMIN, 999L, PermissionScope.SCHOOL, 1L));
        verify(permissionRepository).findById(999L);
        verify(rolePermissionRepository, never()).delete(any());
    }

    @Test
    void update_ShouldUpdateRolePermission_WhenValidDTOProvided() {
        // Arrange
        RolePermissionDTO updatedDTO = new RolePermissionDTO(
            1L, UserRole.SCHOOL_HEAD, 1L, "USER_CREATE", "USER", "CREATE", 
            PermissionScope.SCHOOL, 2L, "SCHOOL:2", true
        );
        
        when(rolePermissionRepository.findById(1L)).thenReturn(Optional.of(testRolePermission));
        when(rolePermissionRepository.save(any(RolePermission.class))).thenReturn(testRolePermission);
        when(rolePermissionMapper.toDto(testRolePermission)).thenReturn(updatedDTO);

        // Act
        RolePermissionDTO result = rolePermissionService.update(1L, updatedDTO);

        // Assert
        assertNotNull(result);
        assertEquals(UserRole.SCHOOL_HEAD, result.role());
        verify(rolePermissionRepository).findById(1L);
        verify(rolePermissionRepository).save(any(RolePermission.class));
        verify(rolePermissionMapper).updateEntity(eq(testRolePermission), eq(updatedDTO));
        verify(rolePermissionMapper).toDto(testRolePermission);
    }

    @Test
    void delete_ShouldDeleteRolePermission_WhenExists() {
        // Arrange
        when(rolePermissionRepository.existsById(1L)).thenReturn(true);

        // Act
        rolePermissionService.delete(1L);

        // Assert
        verify(rolePermissionRepository).existsById(1L);
        verify(rolePermissionRepository).deleteById(1L);
    }

    @Test
    void delete_ShouldThrowException_WhenRolePermissionDoesNotExist() {
        // Arrange
        when(rolePermissionRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> rolePermissionService.delete(1L));
        verify(rolePermissionRepository).existsById(1L);
        verify(rolePermissionRepository, never()).deleteById(any());
    }

    @Test
    void getById_ShouldReturnRolePermission_WhenExists() {
        // Arrange
        when(rolePermissionRepository.findById(1L)).thenReturn(Optional.of(testRolePermission));
        when(rolePermissionMapper.toDto(testRolePermission)).thenReturn(testRolePermissionDTO);

        // Act
        RolePermissionDTO result = rolePermissionService.getById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.id());
        assertEquals(UserRole.SCHOOL_ADMIN, result.role());
        verify(rolePermissionRepository).findById(1L);
        verify(rolePermissionMapper).toDto(testRolePermission);
    }

    @Test
    void getAll_ShouldReturnAllRolePermissions() {
        // Arrange
        List<RolePermission> rolePermissions = Arrays.asList(testRolePermission);
        when(rolePermissionRepository.findAll()).thenReturn(rolePermissions);
        when(rolePermissionMapper.toDto(testRolePermission)).thenReturn(testRolePermissionDTO);

        // Act
        List<RolePermissionDTO> result = rolePermissionService.getAll();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(UserRole.SCHOOL_ADMIN, result.get(0).role());
        verify(rolePermissionRepository).findAll();
        verify(rolePermissionMapper).toDto(testRolePermission);
    }

    @Test
    void initializeDefaultRolePermissions_ShouldCompleteSuccessfully() {
        // Act
        rolePermissionService.initializeDefaultRolePermissions();

        // Assert - method should complete without throwing exceptions
        // This is a placeholder test as the actual implementation is empty
        assertTrue(true);
    }
} 
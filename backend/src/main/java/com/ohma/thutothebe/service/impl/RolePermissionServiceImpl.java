package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.RolePermissionDTO;
import com.ohma.thutothebe.dto.UserPermissionCheckDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.mapper.RolePermissionMapper;
import com.ohma.thutothebe.repository.PermissionRepository;
import com.ohma.thutothebe.repository.RolePermissionRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.RolePermissionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional
public class RolePermissionServiceImpl extends BaseServiceImpl<RolePermission, RolePermissionDTO, Long> implements RolePermissionService {

    private final RolePermissionRepository rolePermissionRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final RolePermissionMapper rolePermissionMapper;

    public RolePermissionServiceImpl(RolePermissionRepository rolePermissionRepository,
                                   PermissionRepository permissionRepository,
                                   UserRepository userRepository,
                                   RolePermissionMapper rolePermissionMapper) {
        super(rolePermissionRepository);
        this.rolePermissionRepository = rolePermissionRepository;
        this.permissionRepository = permissionRepository;
        this.userRepository = userRepository;
        this.rolePermissionMapper = rolePermissionMapper;
    }

    @Override
    protected RolePermission mapToEntity(RolePermissionDTO dto) {
        return rolePermissionMapper.toEntity(dto);
    }

    @Override
    protected RolePermissionDTO mapToDto(RolePermission entity) {
        return rolePermissionMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(RolePermission entity, RolePermissionDTO dto) {
        rolePermissionMapper.updateEntity(entity, dto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RolePermissionDTO> findByRole(UserRole role) {
        return rolePermissionRepository.findByRole(role)
            .stream()
            .map(rolePermissionMapper::toDto)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RolePermissionDTO> findActiveByRole(UserRole role) {
        return rolePermissionRepository.findByRoleAndActiveTrue(role)
            .stream()
            .map(rolePermissionMapper::toDto)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RolePermissionDTO> findByPermissionId(Long permissionId) {
        return rolePermissionRepository.findByPermissionId(permissionId)
            .stream()
            .map(rolePermissionMapper::toDto)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RolePermissionDTO> findByScope(PermissionScope scopeType, Long scopeId) {
        return rolePermissionRepository.findByScopeTypeAndScopeId(scopeType, scopeId)
            .stream()
            .map(rolePermissionMapper::toDto)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RolePermissionDTO> findByRoleAndResource(UserRole role, String resource) {
        return rolePermissionRepository.findByRoleAndResource(role, resource)
            .stream()
            .map(rolePermissionMapper::toDto)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> findResourcesByRole(UserRole role) {
        return rolePermissionRepository.findResourcesByRole(role);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasPermission(UserRole role, String resource, PermissionAction action) {
        List<RolePermission> permissions = rolePermissionRepository.findByRoleAndResourceAndAction(role, resource, action);
        return !permissions.isEmpty();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasPermissionWithScope(UserRole role, String resource, PermissionAction action, 
                                        PermissionScope scopeType, Long scopeId) {
        return rolePermissionRepository.findByRoleAndResourceAndActionAndScope(role, resource, action, scopeType, scopeId)
            .isPresent();
    }

    @Override
    @Transactional(readOnly = true)
    public UserPermissionCheckDTO checkUserPermission(UserPermissionCheckDTO checkRequest) {
        UserRole userRole = checkRequest.userRole();
        String resource = checkRequest.resource();
        PermissionAction action = checkRequest.action();
        PermissionScope scopeType = checkRequest.scopeType();
        Long scopeId = checkRequest.scopeId();

        boolean hasPermission = false;
        String reason = "Permission denied";
        String scopeName = null;

        if (hasPermission(userRole, resource, action)) {
            hasPermission = true;
            reason = "Global permission granted";
        }
        
        if (!hasPermission && scopeType != null && scopeId != null) {
            if (hasPermissionWithScope(userRole, resource, action, scopeType, scopeId)) {
                hasPermission = true;
                reason = "Scoped permission granted";
                scopeName = scopeType.name() + ":" + scopeId;
            }
        }

        if (!hasPermission) {
            hasPermission = checkRoleHierarchyPermission(userRole, resource, action, scopeType, scopeId);
            if (hasPermission) {
                reason = "Permission granted through role hierarchy";
            }
        }

        return new UserPermissionCheckDTO(
            checkRequest.userId(),
            userRole,
            resource,
            action,
            scopeType,
            scopeId,
            hasPermission,
            reason,
            scopeName
        );
    }

    @Override
    @Transactional
    public RolePermissionDTO assignPermissionToRole(UserRole role, Long permissionId, 
                                                   PermissionScope scopeType, Long scopeId) {
        Permission permission = permissionRepository.findById(permissionId)
            .orElseThrow(() -> new IllegalArgumentException("Permission not found with id: " + permissionId));

        RolePermission rolePermission = new RolePermission(role, permission, scopeType, scopeId);
        RolePermission saved = rolePermissionRepository.save(rolePermission);
        
        log.info("Assigned permission {} to role {} with scope {}:{}", 
                permission.getName(), role, scopeType, scopeId);
        
        return rolePermissionMapper.toDto(saved);
    }

    @Override
    @Transactional
    public void removePermissionFromRole(UserRole role, Long permissionId, 
                                       PermissionScope scopeType, Long scopeId) {
        Permission permission = permissionRepository.findById(permissionId)
            .orElseThrow(() -> new IllegalArgumentException("Permission not found with id: " + permissionId));

        rolePermissionRepository.findByRoleAndResourceAndActionAndScope(
            role, permission.getResource(), permission.getAction(), scopeType, scopeId
        ).ifPresent(rolePermission -> {
            rolePermissionRepository.delete(rolePermission);
            log.info("Removed permission {} from role {} with scope {}:{}", 
                    permission.getName(), role, scopeType, scopeId);
        });
    }

    @Override
    @Transactional
    public void initializeDefaultRolePermissions() {
        log.info("Initializing default role permissions...");
        log.info("Default role permissions initialization completed");
    }

    private boolean checkRoleHierarchyPermission(UserRole userRole, String resource, PermissionAction action, 
                                                PermissionScope scopeType, Long scopeId) {
        switch (userRole) {
            case SUPER_ADMIN:
            case MINISTRY_EXECUTIVE:
                return true;
            case MINISTRY_STAFF:
                return List.of("USER", "SCHEDULE", "ANNOUNCEMENT", "COURSE", "ASSIGNMENT", "GRADE", "MESSAGE", "SCHOOL", "REGION")
                    .contains(resource);
            case DATA_PROTECTION_OFFICER:
                return List.of("USER", "SCHEDULE", "ANNOUNCEMENT", "COURSE", "ASSIGNMENT", "GRADE", "MESSAGE", "SCHOOL", "REGION", "AUDIT", "LOG", "PRIVACY", "PERSONAL_DATA")
                    .contains(resource);
            case DIRECTOR:
                return List.of("USER", "SCHEDULE", "ANNOUNCEMENT", "COURSE", "ASSIGNMENT", "GRADE", "MESSAGE", "SCHOOL", "REGION")
                    .contains(resource);
            case REGIONAL_ADMIN:
                return List.of("USER", "SCHEDULE", "ANNOUNCEMENT", "COURSE", "ASSIGNMENT", "GRADE", "MESSAGE", "SCHOOL")
                    .contains(resource) && (scopeType == null || scopeType == PermissionScope.REGIONAL || scopeType == PermissionScope.SCHOOL);
            case REGIONAL_OFFICER:
                return List.of("USER", "SCHEDULE", "ANNOUNCEMENT", "COURSE", "ASSIGNMENT", "GRADE", "MESSAGE", "SCHOOL")
                    .contains(resource) && (scopeType == null || scopeType == PermissionScope.REGIONAL || scopeType == PermissionScope.SCHOOL);
            case SCHOOL_ADMIN:
            case SCHOOL_HEAD:
                return List.of("USER", "SCHEDULE", "ANNOUNCEMENT", "COURSE", "ASSIGNMENT", "GRADE", "MESSAGE")
                    .contains(resource) && (scopeType == null || scopeType == PermissionScope.SCHOOL || scopeType == PermissionScope.CLASS);
            case DEPARTMENT_HEAD:
                return List.of("SCHEDULE", "ANNOUNCEMENT", "COURSE", "ASSIGNMENT", "GRADE", "MESSAGE")
                    .contains(resource) && (action == PermissionAction.READ || 
                    (scopeType != null && (scopeType == PermissionScope.DEPARTMENT || scopeType == PermissionScope.CLASS)));
            case SENIOR_TEACHER:
            case TEACHER:
                return List.of("SCHEDULE", "ANNOUNCEMENT", "COURSE", "ASSIGNMENT", "GRADE", "MESSAGE")
                    .contains(resource) && (action == PermissionAction.READ || 
                    (scopeType != null && scopeType == PermissionScope.CLASS));
            case STUDENT:
                return (action == PermissionAction.READ && List.of("SCHEDULE", "ANNOUNCEMENT", "COURSE", "ASSIGNMENT", "GRADE")
                    .contains(resource)) || (resource.equals("MESSAGE") && action == PermissionAction.CREATE);
            case PARENT:
                return (action == PermissionAction.READ && List.of("SCHEDULE", "ANNOUNCEMENT", "COURSE", "ASSIGNMENT", "GRADE")
                    .contains(resource)) || (resource.equals("MESSAGE") && action == PermissionAction.CREATE);
            default:
                return false;
        }
    }

    @Override
    protected Long extractSchoolId(RolePermission entity) {
        // RolePermissions are system-level configurations for roles
        // They can have scope but are not directly tied to specific schools
        return null;
    }
    
    @Override
    protected Long extractRegionId(RolePermission entity) {
        // RolePermissions are system-level configurations for roles
        // They can have scope but are not directly tied to specific regions
        return null;
    }
} 
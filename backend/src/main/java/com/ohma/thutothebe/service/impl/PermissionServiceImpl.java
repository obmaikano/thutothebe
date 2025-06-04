package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.PermissionDTO;
import com.ohma.thutothebe.entity.Permission;
import com.ohma.thutothebe.entity.PermissionAction;
import com.ohma.thutothebe.mapper.PermissionMapper;
import com.ohma.thutothebe.repository.PermissionRepository;
import com.ohma.thutothebe.service.PermissionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional
public class PermissionServiceImpl extends BaseServiceImpl<Permission, PermissionDTO, Long> implements PermissionService {

    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;

    public PermissionServiceImpl(PermissionRepository permissionRepository, PermissionMapper permissionMapper) {
        super(permissionRepository);
        this.permissionRepository = permissionRepository;
        this.permissionMapper = permissionMapper;
    }

    @Override
    protected Permission mapToEntity(PermissionDTO dto) {
        return permissionMapper.toEntity(dto);
    }

    @Override
    protected PermissionDTO mapToDto(Permission entity) {
        return permissionMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Permission entity, PermissionDTO dto) {
        permissionMapper.updateEntity(entity, dto);
    }

    @Override
    @Transactional(readOnly = true)
    public PermissionDTO findByName(String name) {
        return permissionRepository.findByName(name)
            .map(permissionMapper::toDto)
            .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public PermissionDTO findByResourceAndAction(String resource, PermissionAction action) {
        return permissionRepository.findByResourceAndAction(resource, action)
            .map(permissionMapper::toDto)
            .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionDTO> findByResource(String resource) {
        return permissionRepository.findByResource(resource)
            .stream()
            .map(permissionMapper::toDto)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionDTO> findByAction(PermissionAction action) {
        return permissionRepository.findByAction(action)
            .stream()
            .map(permissionMapper::toDto)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionDTO> findActivePermissions() {
        return permissionRepository.findByActiveTrue()
            .stream()
            .map(permissionMapper::toDto)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionDTO> findActivePermissionsByResource(String resource) {
        return permissionRepository.findActivePermissionsByResource(resource)
            .stream()
            .map(permissionMapper::toDto)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionDTO> findActivePermissionsByAction(PermissionAction action) {
        return permissionRepository.findActivePermissionsByAction(action)
            .stream()
            .map(permissionMapper::toDto)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return permissionRepository.existsByName(name);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByResourceAndAction(String resource, PermissionAction action) {
        return permissionRepository.existsByResourceAndAction(resource, action);
    }

    @Override
    @Transactional
    public void initializeDefaultPermissions() {
        log.info("Initializing default permissions...");
        
        // Define default permissions for each resource and action
        String[][] defaultPermissions = {
            // User Management
            {"USER_CREATE", "USER", "CREATE", "Create new users"},
            {"USER_READ", "USER", "READ", "View user information"},
            {"USER_UPDATE", "USER", "UPDATE", "Update user information"},
            {"USER_DELETE", "USER", "DELETE", "Delete users"},
            
            // Schedule Management
            {"SCHEDULE_CREATE", "SCHEDULE", "CREATE", "Create schedules"},
            {"SCHEDULE_READ", "SCHEDULE", "READ", "View schedules"},
            {"SCHEDULE_UPDATE", "SCHEDULE", "UPDATE", "Update schedules"},
            {"SCHEDULE_DELETE", "SCHEDULE", "DELETE", "Delete schedules"},
            
            // Announcement Management
            {"ANNOUNCEMENT_CREATE", "ANNOUNCEMENT", "CREATE", "Create announcements"},
            {"ANNOUNCEMENT_READ", "ANNOUNCEMENT", "READ", "View announcements"},
            {"ANNOUNCEMENT_UPDATE", "ANNOUNCEMENT", "UPDATE", "Update announcements"},
            {"ANNOUNCEMENT_DELETE", "ANNOUNCEMENT", "DELETE", "Delete announcements"},
            
            // Course Management
            {"COURSE_CREATE", "COURSE", "CREATE", "Create courses"},
            {"COURSE_READ", "COURSE", "READ", "View courses"},
            {"COURSE_UPDATE", "COURSE", "UPDATE", "Update courses"},
            {"COURSE_DELETE", "COURSE", "DELETE", "Delete courses"},
            
            // Assignment Management
            {"ASSIGNMENT_CREATE", "ASSIGNMENT", "CREATE", "Create assignments"},
            {"ASSIGNMENT_READ", "ASSIGNMENT", "READ", "View assignments"},
            {"ASSIGNMENT_UPDATE", "ASSIGNMENT", "UPDATE", "Update assignments"},
            {"ASSIGNMENT_DELETE", "ASSIGNMENT", "DELETE", "Delete assignments"},
            
            // Grade Management
            {"GRADE_CREATE", "GRADE", "CREATE", "Create grades"},
            {"GRADE_READ", "GRADE", "READ", "View grades"},
            {"GRADE_UPDATE", "GRADE", "UPDATE", "Update grades"},
            {"GRADE_DELETE", "GRADE", "DELETE", "Delete grades"},
            
            // Message Management
            {"MESSAGE_CREATE", "MESSAGE", "CREATE", "Send messages"},
            {"MESSAGE_READ", "MESSAGE", "READ", "View messages"},
            {"MESSAGE_UPDATE", "MESSAGE", "UPDATE", "Update messages"},
            {"MESSAGE_DELETE", "MESSAGE", "DELETE", "Delete messages"},
            
            // School Management
            {"SCHOOL_CREATE", "SCHOOL", "CREATE", "Create schools"},
            {"SCHOOL_READ", "SCHOOL", "READ", "View schools"},
            {"SCHOOL_UPDATE", "SCHOOL", "UPDATE", "Update schools"},
            {"SCHOOL_DELETE", "SCHOOL", "DELETE", "Delete schools"},
            
            // Region Management
            {"REGION_CREATE", "REGION", "CREATE", "Create regions"},
            {"REGION_READ", "REGION", "READ", "View regions"},
            {"REGION_UPDATE", "REGION", "UPDATE", "Update regions"},
            {"REGION_DELETE", "REGION", "DELETE", "Delete regions"}
        };
        
        for (String[] permissionData : defaultPermissions) {
            String name = permissionData[0];
            String resource = permissionData[1];
            PermissionAction action = PermissionAction.valueOf(permissionData[2]);
            String description = permissionData[3];
            
            if (!existsByName(name)) {
                Permission permission = new Permission(name, resource, action, description);
                permissionRepository.save(permission);
                log.info("Created permission: {}", name);
            }
        }
        
        log.info("Default permissions initialization completed");
    }

    @Override
    protected Long extractSchoolId(Permission entity) {
        // Permissions are system-level entities not tied to specific schools
        return null;
    }
    
    @Override
    protected Long extractRegionId(Permission entity) {
        // Permissions are system-level entities not tied to specific regions
        return null;
    }
} 
package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.RolePermissionDTO;
import com.ohma.thutothebe.dto.UserPermissionCheckDTO;
import com.ohma.thutothebe.entity.PermissionAction;
import com.ohma.thutothebe.entity.PermissionScope;
import com.ohma.thutothebe.entity.UserRole;

import java.util.List;

public interface RolePermissionService extends BaseService<RolePermissionDTO, Long> {
    
    List<RolePermissionDTO> findByRole(UserRole role);
    
    List<RolePermissionDTO> findActiveByRole(UserRole role);
    
    List<RolePermissionDTO> findByPermissionId(Long permissionId);
    
    List<RolePermissionDTO> findByScope(PermissionScope scopeType, Long scopeId);
    
    List<RolePermissionDTO> findByRoleAndResource(UserRole role, String resource);
    
    List<String> findResourcesByRole(UserRole role);
    
    boolean hasPermission(UserRole role, String resource, PermissionAction action);
    
    boolean hasPermissionWithScope(UserRole role, String resource, PermissionAction action, 
                                  PermissionScope scopeType, Long scopeId);
    
    UserPermissionCheckDTO checkUserPermission(UserPermissionCheckDTO checkRequest);
    
    RolePermissionDTO assignPermissionToRole(UserRole role, Long permissionId, 
                                           PermissionScope scopeType, Long scopeId);
    
    void removePermissionFromRole(UserRole role, Long permissionId, 
                                 PermissionScope scopeType, Long scopeId);
    
    void initializeDefaultRolePermissions();
} 
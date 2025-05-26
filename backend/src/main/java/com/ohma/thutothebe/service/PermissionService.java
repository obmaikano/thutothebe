package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.PermissionDTO;
import com.ohma.thutothebe.entity.PermissionAction;

import java.util.List;

public interface PermissionService extends BaseService<PermissionDTO, Long> {
    
    PermissionDTO findByName(String name);
    
    PermissionDTO findByResourceAndAction(String resource, PermissionAction action);
    
    List<PermissionDTO> findByResource(String resource);
    
    List<PermissionDTO> findByAction(PermissionAction action);
    
    List<PermissionDTO> findActivePermissions();
    
    List<PermissionDTO> findActivePermissionsByResource(String resource);
    
    List<PermissionDTO> findActivePermissionsByAction(PermissionAction action);
    
    boolean existsByName(String name);
    
    boolean existsByResourceAndAction(String resource, PermissionAction action);
    
    void initializeDefaultPermissions();
} 
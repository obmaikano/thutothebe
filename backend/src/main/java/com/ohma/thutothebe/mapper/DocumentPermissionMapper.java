package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.DocumentPermissionDTO;
import com.ohma.thutothebe.entity.DocumentPermission;
import org.springframework.stereotype.Component;

@Component
public interface DocumentPermissionMapper extends BaseDtoMapper<DocumentPermission, DocumentPermissionDTO> {
    
    @Override
    DocumentPermissionDTO toDto(DocumentPermission documentPermission);
    
    @Override
    DocumentPermission toEntity(DocumentPermissionDTO documentPermissionDTO);
    
    DocumentPermissionDTO toDtoMinimal(DocumentPermission documentPermission);
    
    void updateEntityFromDto(DocumentPermission documentPermission, DocumentPermissionDTO documentPermissionDTO);
} 
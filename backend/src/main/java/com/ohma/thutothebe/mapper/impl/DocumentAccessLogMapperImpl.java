package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.DocumentAccessLogDTO;
import com.ohma.thutothebe.entity.DocumentAccessLog;
import com.ohma.thutothebe.mapper.DocumentAccessLogMapper;
import com.ohma.thutothebe.repository.DocumentRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DocumentAccessLogMapperImpl implements DocumentAccessLogMapper {

    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public DocumentAccessLogDTO toDto(DocumentAccessLog entity) {
        if (entity == null) {
            return null;
        }
        
        return new DocumentAccessLogDTO(
            entity.getId(),
            entity.getDocument() != null ? entity.getDocument().getId() : null,
            entity.getDocument() != null ? entity.getDocument().getTitle() : null,
            entity.getUser() != null ? entity.getUser().getId() : null,
            entity.getUser() != null ? entity.getUser().getFirstName() + " " + entity.getUser().getLastName() : null,
            entity.getAccessType(),
            entity.getAccessedAt(),
            entity.getIpAddress(),
            entity.getUserAgent(),
            entity.getSessionId(),
            entity.isSuccess(),
            entity.getErrorMessage(),
            entity.getCreatedAt(),
            entity.getModifiedAt(),
            entity.getVersion()
        );
    }

    @Override
    public DocumentAccessLog toEntity(DocumentAccessLogDTO dto) {
        if (dto == null) {
            return null;
        }
        
        DocumentAccessLog entity = new DocumentAccessLog();
        entity.setId(dto.id());
        entity.setDocument(dto.documentId() != null ? documentRepository.findById(dto.documentId()).orElse(null) : null);
        entity.setUser(dto.userId() != null ? userRepository.findById(dto.userId()).orElse(null) : null);
        entity.setAccessType(dto.accessType());
        entity.setAccessedAt(dto.accessedAt());
        entity.setIpAddress(dto.ipAddress());
        entity.setUserAgent(dto.userAgent());
        entity.setSessionId(dto.sessionId());
        entity.setSuccess(dto.success());
        entity.setErrorMessage(dto.errorMessage());
        
        return entity;
    }

    @Override
    public DocumentAccessLogDTO toDtoMinimal(DocumentAccessLog entity) {
        if (entity == null) {
            return null;
        }
        
        return new DocumentAccessLogDTO(
            entity.getId(),
            entity.getDocument() != null ? entity.getDocument().getId() : null,
            entity.getDocument() != null ? entity.getDocument().getTitle() : null,
            entity.getUser() != null ? entity.getUser().getId() : null,
            entity.getUser() != null ? entity.getUser().getFirstName() + " " + entity.getUser().getLastName() : null,
            entity.getAccessType(),
            entity.getAccessedAt(),
            null, // ipAddress - not needed for minimal
            null, // userAgent - not needed for minimal
            null, // sessionId - not needed for minimal
            entity.isSuccess(),
            null, // errorMessage - not needed for minimal
            entity.getCreatedAt(),
            entity.getModifiedAt(),
            entity.getVersion()
        );
    }

    @Override
    public void updateEntityFromDto(DocumentAccessLog entity, DocumentAccessLogDTO dto) {
        if (entity == null || dto == null) {
            return;
        }
        
        entity.setAccessType(dto.accessType());
        entity.setAccessedAt(dto.accessedAt());
        entity.setIpAddress(dto.ipAddress());
        entity.setUserAgent(dto.userAgent());
        entity.setSessionId(dto.sessionId());
        entity.setSuccess(dto.success());
        entity.setErrorMessage(dto.errorMessage());
        
        // Update related entities if IDs are provided
        if (dto.documentId() != null) {
            entity.setDocument(documentRepository.findById(dto.documentId()).orElse(null));
        }
        if (dto.userId() != null) {
            entity.setUser(userRepository.findById(dto.userId()).orElse(null));
        }
    }
} 
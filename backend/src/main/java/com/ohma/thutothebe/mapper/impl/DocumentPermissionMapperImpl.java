package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.DocumentPermissionDTO;
import com.ohma.thutothebe.entity.DocumentPermission;
import com.ohma.thutothebe.mapper.DocumentPermissionMapper;
import com.ohma.thutothebe.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DocumentPermissionMapperImpl implements DocumentPermissionMapper {

    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SchoolRepository schoolRepository;
    
    @Autowired
    private RegionRepository regionRepository;
    
    @Autowired
    private ClassRepository classRepository;
    
    @Autowired
    private CourseRepository courseRepository;

    @Override
    public DocumentPermissionDTO toDto(DocumentPermission entity) {
        if (entity == null) {
            return null;
        }
        
        return new DocumentPermissionDTO(
            entity.getId(),
            entity.getDocument() != null ? entity.getDocument().getId() : null,
            entity.getDocument() != null ? entity.getDocument().getTitle() : null,
            entity.getUserRole(),
            entity.getPermissionType(),
            entity.getSpecificUser() != null ? entity.getSpecificUser().getId() : null,
            entity.getSpecificUser() != null ? entity.getSpecificUser().getFirstName() + " " + entity.getSpecificUser().getLastName() : null,
            entity.getSchool() != null ? entity.getSchool().getId() : null,
            entity.getSchool() != null ? entity.getSchool().getName() : null,
            entity.getRegion() != null ? entity.getRegion().getId() : null,
            entity.getRegion() != null ? entity.getRegion().getName() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getId() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getName() : null,
            entity.getCourse() != null ? entity.getCourse().getId() : null,
            entity.getCourse() != null ? entity.getCourse().getName() : null,
            entity.isActive(),
            entity.getCreatedAt(),
            entity.getModifiedAt(),
            entity.getVersion()
        );
    }

    @Override
    public DocumentPermission toEntity(DocumentPermissionDTO dto) {
        if (dto == null) {
            return null;
        }
        
        DocumentPermission entity = new DocumentPermission();
        entity.setId(dto.id());
        entity.setDocument(dto.documentId() != null ? documentRepository.findById(dto.documentId()).orElse(null) : null);
        entity.setUserRole(dto.userRole());
        entity.setPermissionType(dto.permissionType());
        entity.setSpecificUser(dto.specificUserId() != null ? userRepository.findById(dto.specificUserId()).orElse(null) : null);
        entity.setSchool(dto.schoolId() != null ? schoolRepository.findById(dto.schoolId()).orElse(null) : null);
        entity.setRegion(dto.regionId() != null ? regionRepository.findById(dto.regionId()).orElse(null) : null);
        entity.setClassEntity(dto.classId() != null ? classRepository.findById(dto.classId()).orElse(null) : null);
        entity.setCourse(dto.courseId() != null ? courseRepository.findById(dto.courseId()).orElse(null) : null);
        entity.setActive(dto.active());
        
        return entity;
    }

    @Override
    public DocumentPermissionDTO toDtoMinimal(DocumentPermission entity) {
        if (entity == null) {
            return null;
        }
        
        return new DocumentPermissionDTO(
            entity.getId(),
            entity.getDocument() != null ? entity.getDocument().getId() : null,
            entity.getDocument() != null ? entity.getDocument().getTitle() : null,
            entity.getUserRole(),
            entity.getPermissionType(),
            entity.getSpecificUser() != null ? entity.getSpecificUser().getId() : null,
            entity.getSpecificUser() != null ? entity.getSpecificUser().getFirstName() + " " + entity.getSpecificUser().getLastName() : null,
            null, // schoolId - not needed for minimal
            null, // schoolName - not needed for minimal
            null, // regionId - not needed for minimal
            null, // regionName - not needed for minimal
            null, // classId - not needed for minimal
            null, // className - not needed for minimal
            null, // courseId - not needed for minimal
            null, // courseName - not needed for minimal
            entity.isActive(),
            entity.getCreatedAt(),
            entity.getModifiedAt(),
            entity.getVersion()
        );
    }

    @Override
    public void updateEntityFromDto(DocumentPermission entity, DocumentPermissionDTO dto) {
        if (entity == null || dto == null) {
            return;
        }
        
        entity.setUserRole(dto.userRole());
        entity.setPermissionType(dto.permissionType());
        entity.setActive(dto.active());
        
        // Update related entities if IDs are provided
        if (dto.documentId() != null) {
            entity.setDocument(documentRepository.findById(dto.documentId()).orElse(null));
        }
        if (dto.specificUserId() != null) {
            entity.setSpecificUser(userRepository.findById(dto.specificUserId()).orElse(null));
        }
        if (dto.schoolId() != null) {
            entity.setSchool(schoolRepository.findById(dto.schoolId()).orElse(null));
        }
        if (dto.regionId() != null) {
            entity.setRegion(regionRepository.findById(dto.regionId()).orElse(null));
        }
        if (dto.classId() != null) {
            entity.setClassEntity(classRepository.findById(dto.classId()).orElse(null));
        }
        if (dto.courseId() != null) {
            entity.setCourse(courseRepository.findById(dto.courseId()).orElse(null));
        }
    }
} 
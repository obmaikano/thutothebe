package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.DocumentDTO;
import com.ohma.thutothebe.entity.Document;
import com.ohma.thutothebe.mapper.DocumentMapper;
import com.ohma.thutothebe.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DocumentMapperImpl implements DocumentMapper {

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
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private DocumentRepository documentRepository;

    @Override
    public DocumentDTO toDto(Document entity) {
        if (entity == null) {
            return null;
        }
        
        return new DocumentDTO(
            entity.getId(),
            entity.getTitle(),
            entity.getDescription(),
            entity.getFileName(),
            entity.getFilePath(),
            entity.getFileSize(),
            entity.getMimeType(),
            entity.getDocumentType(),
            entity.getDocumentCategory(),
            entity.getAccessLevel(),
            entity.getUploadedBy() != null ? entity.getUploadedBy().getId() : null,
            entity.getUploadedBy() != null ? entity.getUploadedBy().getFirstName() + " " + entity.getUploadedBy().getLastName() : null,
            entity.getUploadedAt(),
            entity.getSchool() != null ? entity.getSchool().getId() : null,
            entity.getSchool() != null ? entity.getSchool().getName() : null,
            entity.getRegion() != null ? entity.getRegion().getId() : null,
            entity.getRegion() != null ? entity.getRegion().getName() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getId() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getName() : null,
            entity.getCourse() != null ? entity.getCourse().getId() : null,
            entity.getCourse() != null ? entity.getCourse().getName() : null,
            entity.getSubject() != null ? entity.getSubject().getId() : null,
            entity.getSubject() != null ? entity.getSubject().getName() : null,
            entity.getTags(),
            entity.getChecksum(),
            entity.getVersionNumber(),
            entity.getParentDocument() != null ? entity.getParentDocument().getId() : null,
            entity.getParentDocument() != null ? entity.getParentDocument().getTitle() : null,
            null, // childDocuments - avoid circular reference
            entity.isPublic(),
            entity.isRequiresApproval(),
            entity.getApprovalStatus(),
            entity.getApprovedBy() != null ? entity.getApprovedBy().getId() : null,
            entity.getApprovedBy() != null ? entity.getApprovedBy().getFirstName() + " " + entity.getApprovedBy().getLastName() : null,
            entity.getApprovedAt(),
            entity.getApprovalNotes(),
            entity.getDownloadCount(),
            entity.getViewCount(),
            entity.getLastAccessedAt(),
            entity.getExpiryDate(),
            entity.isArchived(),
            entity.getArchivedAt(),
            entity.getArchivedBy() != null ? entity.getArchivedBy().getId() : null,
            entity.getArchivedBy() != null ? entity.getArchivedBy().getFirstName() + " " + entity.getArchivedBy().getLastName() : null,
            entity.isActive(),
            null, // documentPermissions - avoid circular reference
            null, // accessLogs - avoid circular reference
            entity.getCreatedAt(),
            entity.getModifiedAt(),
            entity.getVersion()
        );
    }

    @Override
    public Document toEntity(DocumentDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Document entity = new Document();
        entity.setId(dto.id());
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setFileName(dto.fileName());
        entity.setFilePath(dto.filePath());
        entity.setFileSize(dto.fileSize());
        entity.setMimeType(dto.mimeType());
        entity.setDocumentType(dto.documentType());
        entity.setDocumentCategory(dto.documentCategory());
        entity.setAccessLevel(dto.accessLevel());
        entity.setUploadedBy(dto.uploadedById() != null ? userRepository.findById(dto.uploadedById()).orElse(null) : null);
        entity.setUploadedAt(dto.uploadedAt());
        entity.setSchool(dto.schoolId() != null ? schoolRepository.findById(dto.schoolId()).orElse(null) : null);
        entity.setRegion(dto.regionId() != null ? regionRepository.findById(dto.regionId()).orElse(null) : null);
        entity.setClassEntity(dto.classId() != null ? classRepository.findById(dto.classId()).orElse(null) : null);
        entity.setCourse(dto.courseId() != null ? courseRepository.findById(dto.courseId()).orElse(null) : null);
        entity.setSubject(dto.subjectId() != null ? subjectRepository.findById(dto.subjectId()).orElse(null) : null);
        entity.setTags(dto.tags());
        entity.setChecksum(dto.checksum());
        entity.setVersionNumber(dto.versionNumber());
        entity.setParentDocument(dto.parentDocumentId() != null ? documentRepository.findById(dto.parentDocumentId()).orElse(null) : null);
        entity.setExpiryDate(dto.expiryDate());
        entity.setLastAccessedAt(dto.lastAccessedAt());
        entity.setPublic(dto.isPublic());
        entity.setRequiresApproval(dto.requiresApproval());
        entity.setApprovalStatus(dto.approvalStatus());
        entity.setApprovedBy(dto.approvedById() != null ? userRepository.findById(dto.approvedById()).orElse(null) : null);
        entity.setApprovedAt(dto.approvedAt());
        entity.setApprovalNotes(dto.approvalNotes());
        entity.setViewCount(dto.viewCount());
        entity.setDownloadCount(dto.downloadCount());
        entity.setArchived(dto.isArchived());
        entity.setArchivedBy(dto.archivedById() != null ? userRepository.findById(dto.archivedById()).orElse(null) : null);
        entity.setArchivedAt(dto.archivedAt());
        entity.setActive(dto.active());
        
        return entity;
    }

    @Override
    public DocumentDTO toDtoMinimal(Document entity) {
        if (entity == null) {
            return null;
        }
        
        return new DocumentDTO(
            entity.getId(),
            entity.getTitle(),
            entity.getDescription(),
            entity.getFileName(),
            null, // filePath - not needed for minimal
            entity.getFileSize(),
            entity.getMimeType(),
            entity.getDocumentType(),
            entity.getDocumentCategory(),
            entity.getAccessLevel(),
            entity.getUploadedBy() != null ? entity.getUploadedBy().getId() : null,
            entity.getUploadedBy() != null ? entity.getUploadedBy().getFirstName() + " " + entity.getUploadedBy().getLastName() : null,
            entity.getUploadedAt(),
            entity.getSchool() != null ? entity.getSchool().getId() : null,
            entity.getSchool() != null ? entity.getSchool().getName() : null,
            entity.getRegion() != null ? entity.getRegion().getId() : null,
            entity.getRegion() != null ? entity.getRegion().getName() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getId() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getName() : null,
            entity.getCourse() != null ? entity.getCourse().getId() : null,
            entity.getCourse() != null ? entity.getCourse().getName() : null,
            entity.getSubject() != null ? entity.getSubject().getId() : null,
            entity.getSubject() != null ? entity.getSubject().getName() : null,
            entity.getTags(),
            null, // checksum - not needed for minimal
            entity.getVersionNumber(),
            entity.getParentDocument() != null ? entity.getParentDocument().getId() : null,
            entity.getParentDocument() != null ? entity.getParentDocument().getTitle() : null,
            null, // childDocuments - not needed for minimal
            entity.isPublic(),
            entity.isRequiresApproval(),
            entity.getApprovalStatus(),
            null, // approvedById - not needed for minimal
            null, // approvedByName - not needed for minimal
            entity.getApprovedAt(),
            null, // approvalNotes - not needed for minimal
            entity.getDownloadCount(),
            entity.getViewCount(),
            entity.getLastAccessedAt(),
            entity.getExpiryDate(),
            entity.isArchived(),
            entity.getArchivedAt(),
            null, // archivedById - not needed for minimal
            null, // archivedByName - not needed for minimal
            entity.isActive(),
            null, // documentPermissions - not needed for minimal
            null, // accessLogs - not needed for minimal
            entity.getCreatedAt(),
            entity.getModifiedAt(),
            entity.getVersion()
        );
    }

    @Override
    public DocumentDTO toDtoWithoutCircularReferences(Document entity) {
        if (entity == null) {
            return null;
        }
        
        return new DocumentDTO(
            entity.getId(),
            entity.getTitle(),
            entity.getDescription(),
            entity.getFileName(),
            entity.getFilePath(),
            entity.getFileSize(),
            entity.getMimeType(),
            entity.getDocumentType(),
            entity.getDocumentCategory(),
            entity.getAccessLevel(),
            entity.getUploadedBy() != null ? entity.getUploadedBy().getId() : null,
            entity.getUploadedBy() != null ? entity.getUploadedBy().getFirstName() + " " + entity.getUploadedBy().getLastName() : null,
            entity.getUploadedAt(),
            entity.getSchool() != null ? entity.getSchool().getId() : null,
            entity.getSchool() != null ? entity.getSchool().getName() : null,
            entity.getRegion() != null ? entity.getRegion().getId() : null,
            entity.getRegion() != null ? entity.getRegion().getName() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getId() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getName() : null,
            entity.getCourse() != null ? entity.getCourse().getId() : null,
            entity.getCourse() != null ? entity.getCourse().getName() : null,
            entity.getSubject() != null ? entity.getSubject().getId() : null,
            entity.getSubject() != null ? entity.getSubject().getName() : null,
            entity.getTags(),
            entity.getChecksum(),
            entity.getVersionNumber(),
            entity.getParentDocument() != null ? entity.getParentDocument().getId() : null,
            entity.getParentDocument() != null ? entity.getParentDocument().getTitle() : null,
            null, // childDocuments - avoid circular reference
            entity.isPublic(),
            entity.isRequiresApproval(),
            entity.getApprovalStatus(),
            entity.getApprovedBy() != null ? entity.getApprovedBy().getId() : null,
            entity.getApprovedBy() != null ? entity.getApprovedBy().getFirstName() + " " + entity.getApprovedBy().getLastName() : null,
            entity.getApprovedAt(),
            entity.getApprovalNotes(),
            entity.getDownloadCount(),
            entity.getViewCount(),
            entity.getLastAccessedAt(),
            entity.getExpiryDate(),
            entity.isArchived(),
            entity.getArchivedAt(),
            entity.getArchivedBy() != null ? entity.getArchivedBy().getId() : null,
            entity.getArchivedBy() != null ? entity.getArchivedBy().getFirstName() + " " + entity.getArchivedBy().getLastName() : null,
            entity.isActive(),
            null, // documentPermissions - avoid circular reference
            null, // accessLogs - avoid circular reference
            entity.getCreatedAt(),
            entity.getModifiedAt(),
            entity.getVersion()
        );
    }

    @Override
    public void updateEntityFromDto(Document entity, DocumentDTO dto) {
        if (entity == null || dto == null) {
            return;
        }
        
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setDocumentCategory(dto.documentCategory());
        entity.setAccessLevel(dto.accessLevel());
        entity.setTags(dto.tags());
        entity.setExpiryDate(dto.expiryDate());
        entity.setPublic(dto.isPublic());
        entity.setRequiresApproval(dto.requiresApproval());
        entity.setApprovalStatus(dto.approvalStatus());
        entity.setApprovalNotes(dto.approvalNotes());
        entity.setArchived(dto.isArchived());
        entity.setActive(dto.active());
        
        // Update related entities if IDs are provided
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
        if (dto.subjectId() != null) {
            entity.setSubject(subjectRepository.findById(dto.subjectId()).orElse(null));
        }
        if (dto.approvedById() != null) {
            entity.setApprovedBy(userRepository.findById(dto.approvedById()).orElse(null));
        }
        if (dto.archivedById() != null) {
            entity.setArchivedBy(userRepository.findById(dto.archivedById()).orElse(null));
        }
    }
} 
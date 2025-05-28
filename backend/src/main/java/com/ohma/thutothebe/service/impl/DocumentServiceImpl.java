package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.DocumentDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.DocumentMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.DocumentService;
import com.ohma.thutothebe.service.DocumentAccessLogService;
import com.ohma.thutothebe.service.DocumentPermissionService;
import com.ohma.thutothebe.service.impl.BaseServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class DocumentServiceImpl extends BaseServiceImpl<Document, DocumentDTO, Long> implements DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentMapper documentMapper;
    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final RegionRepository regionRepository;
    private final ClassRepository classRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final DocumentAccessLogService documentAccessLogService;
    private final DocumentPermissionService documentPermissionService;

    @Value("${app.document.upload.dir:uploads/documents}")
    private String uploadDirectory;

    @Value("${app.document.max.file.size:10485760}") // 10MB default
    private long maxFileSize;

    @Autowired
    public DocumentServiceImpl(DocumentRepository documentRepository,
                              DocumentMapper documentMapper,
                              UserRepository userRepository,
                              SchoolRepository schoolRepository,
                              RegionRepository regionRepository,
                              ClassRepository classRepository,
                              CourseRepository courseRepository,
                              SubjectRepository subjectRepository,
                              DocumentAccessLogService documentAccessLogService,
                              DocumentPermissionService documentPermissionService) {
        super(documentRepository);
        this.documentRepository = documentRepository;
        this.documentMapper = documentMapper;
        this.userRepository = userRepository;
        this.schoolRepository = schoolRepository;
        this.regionRepository = regionRepository;
        this.classRepository = classRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
        this.documentAccessLogService = documentAccessLogService;
        this.documentPermissionService = documentPermissionService;
    }

    @Override
    protected Document mapToEntity(DocumentDTO dto) {
        return documentMapper.toEntity(dto);
    }

    @Override
    protected DocumentDTO mapToDto(Document entity) {
        return documentMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Document entity, DocumentDTO dto) {
        documentMapper.updateEntityFromDto(entity, dto);
    }

    @Override
    public DocumentDTO uploadDocument(MultipartFile file, DocumentDTO documentDTO, Long uploadedById) {
        validateFile(file);
        
        User uploadedBy = userRepository.findById(uploadedById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + uploadedById));

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDirectory);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(uniqueFilename);

            // Copy file to upload directory
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Calculate checksum
            String checksum = calculateChecksum(file.getBytes());

            // Create document entity
            Document document = new Document();
            document.setTitle(documentDTO.title());
            document.setDescription(documentDTO.description());
            document.setFileName(originalFilename);
            document.setFilePath(filePath.toString());
            document.setFileSize(file.getSize());
            document.setMimeType(file.getContentType());
            document.setDocumentType(determineDocumentType(file.getContentType()));
            document.setDocumentCategory(documentDTO.documentCategory());
            document.setAccessLevel(documentDTO.accessLevel());
            document.setUploadedBy(uploadedBy);
            document.setUploadedAt(LocalDateTime.now());
            document.setChecksum(checksum);
            document.setTags(documentDTO.tags());
            document.setPublic(documentDTO.isPublic());
            document.setRequiresApproval(documentDTO.requiresApproval());
            document.setApprovalStatus(documentDTO.requiresApproval() ? DocumentApprovalStatus.PENDING : DocumentApprovalStatus.APPROVED);

            // Set related entities
            setRelatedEntities(document, documentDTO);

            Document savedDocument = documentRepository.save(document);

            // Log the upload
            documentAccessLogService.logSuccessfulAccess(savedDocument.getId(), uploadedById, 
                    DocumentAccessType.EDIT, null, null, null);

            log.info("Document uploaded successfully: {} by user: {}", savedDocument.getTitle(), uploadedById);
            return documentMapper.toDto(savedDocument);

        } catch (IOException e) {
            log.error("Error uploading document: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload document: " + e.getMessage());
        }
    }

    @Override
    public DocumentDTO uploadDocumentVersion(Long parentDocumentId, MultipartFile file, DocumentDTO documentDTO, Long uploadedById) {
        Document parentDocument = documentRepository.findActiveDocumentById(parentDocumentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent document not found with id: " + parentDocumentId));

        DocumentDTO newVersionDTO = uploadDocument(file, documentDTO, uploadedById);
        
        // Update the new document to be a child of the parent
        Document newVersionDocument = documentRepository.findById(newVersionDTO.id())
                .orElseThrow(() -> new ResourceNotFoundException("New version document not found"));
        
        newVersionDocument.setParentDocument(parentDocument);
        newVersionDocument.setVersionNumber(getNextVersionNumber(parentDocumentId));
        
        Document savedDocument = documentRepository.save(newVersionDocument);
        
        log.info("Document version uploaded successfully: {} for parent: {}", savedDocument.getTitle(), parentDocumentId);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public byte[] downloadDocument(Long documentId, Long userId) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));

        // Check download permissions
        if (!hasDownloadAccess(documentId, userId)) {
            documentAccessLogService.logFailedAccess(documentId, userId, DocumentAccessType.DOWNLOAD, 
                    null, null, null, "Access denied");
            throw new SecurityException("Access denied to download document");
        }

        try {
            Path filePath = Paths.get(document.getFilePath());
            byte[] fileContent = Files.readAllBytes(filePath);

            // Increment download count and log access
            document.incrementDownloadCount();
            documentRepository.save(document);
            
            documentAccessLogService.logSuccessfulAccess(documentId, userId, DocumentAccessType.DOWNLOAD, 
                    null, null, null);

            log.info("Document downloaded: {} by user: {}", document.getTitle(), userId);
            return fileContent;

        } catch (IOException e) {
            log.error("Error downloading document: {}", e.getMessage(), e);
            documentAccessLogService.logFailedAccess(documentId, userId, DocumentAccessType.DOWNLOAD, 
                    null, null, null, "File read error: " + e.getMessage());
            throw new RuntimeException("Failed to download document: " + e.getMessage());
        }
    }

    @Override
    public void deleteDocument(Long documentId, Long userId) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));

        // Check delete permissions
        if (!hasDeleteAccess(documentId, userId)) {
            documentAccessLogService.logFailedAccess(documentId, userId, DocumentAccessType.DELETE, 
                    null, null, null, "Access denied");
            throw new SecurityException("Access denied to delete document");
        }

        try {
            // Soft delete - mark as inactive
            document.setActive(false);
            documentRepository.save(document);

            // Log the deletion
            documentAccessLogService.logSuccessfulAccess(documentId, userId, DocumentAccessType.DELETE, 
                    null, null, null);

            log.info("Document deleted: {} by user: {}", document.getTitle(), userId);

        } catch (Exception e) {
            log.error("Error deleting document: {}", e.getMessage(), e);
            documentAccessLogService.logFailedAccess(documentId, userId, DocumentAccessType.DELETE, 
                    null, null, null, "Delete error: " + e.getMessage());
            throw new RuntimeException("Failed to delete document: " + e.getMessage());
        }
    }

    // Additional helper methods would continue here...
    // Due to length constraints, I'll implement the remaining methods in the next part

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size");
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.'));
    }

    private DocumentType determineDocumentType(String mimeType) {
        if (mimeType == null) return DocumentType.OTHER;
        
        if (mimeType.contains("pdf")) return DocumentType.PDF;
        if (mimeType.contains("word") || mimeType.contains("msword")) return DocumentType.WORD_DOCUMENT;
        if (mimeType.contains("excel") || mimeType.contains("spreadsheet")) return DocumentType.EXCEL_SPREADSHEET;
        if (mimeType.contains("powerpoint") || mimeType.contains("presentation")) return DocumentType.POWERPOINT_PRESENTATION;
        if (mimeType.startsWith("image/")) return DocumentType.IMAGE;
        if (mimeType.startsWith("video/")) return DocumentType.VIDEO;
        if (mimeType.startsWith("audio/")) return DocumentType.AUDIO;
        if (mimeType.contains("text/")) return DocumentType.TEXT_FILE;
        if (mimeType.contains("zip") || mimeType.contains("rar") || mimeType.contains("archive")) return DocumentType.ARCHIVE;
        
        return DocumentType.OTHER;
    }

    private String calculateChecksum(byte[] data) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(data);
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    private void setRelatedEntities(Document document, DocumentDTO documentDTO) {
        if (documentDTO.schoolId() != null) {
            School school = schoolRepository.findById(documentDTO.schoolId())
                    .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + documentDTO.schoolId()));
            document.setSchool(school);
        }
        
        if (documentDTO.regionId() != null) {
            Region region = regionRepository.findById(documentDTO.regionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Region not found with id: " + documentDTO.regionId()));
            document.setRegion(region);
        }
        
        if (documentDTO.classId() != null) {
            com.ohma.thutothebe.entity.Class classEntity = classRepository.findById(documentDTO.classId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + documentDTO.classId()));
            document.setClassEntity(classEntity);
        }
        
        if (documentDTO.courseId() != null) {
            Course course = courseRepository.findById(documentDTO.courseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + documentDTO.courseId()));
            document.setCourse(course);
        }
        
        if (documentDTO.subjectId() != null) {
            Subject subject = subjectRepository.findById(documentDTO.subjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + documentDTO.subjectId()));
            document.setSubject(subject);
        }
    }

    private Integer getNextVersionNumber(Long parentDocumentId) {
        List<Document> versions = documentRepository.findByParentDocumentId(parentDocumentId);
        return versions.stream()
                .mapToInt(Document::getVersionNumber)
                .max()
                .orElse(0) + 1;
    }

    // Implement remaining interface methods...
    @Override
    public DocumentDTO getActiveDocumentById(Long id) {
        Document document = documentRepository.findActiveDocumentById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));
        return documentMapper.toDto(document);
    }

    @Override
    public Page<DocumentDTO> getAllActiveDocuments(Pageable pageable) {
        return documentRepository.findAllActiveDocuments(pageable)
                .map(documentMapper::toDto);
    }

    @Override
    public Page<DocumentDTO> getDocumentsBySchool(Long schoolId, Pageable pageable) {
        return documentRepository.findBySchoolId(schoolId, pageable)
                .map(documentMapper::toDto);
    }

    @Override
    public Page<DocumentDTO> getDocumentsByRegion(Long regionId, Pageable pageable) {
        return documentRepository.findByRegionId(regionId, pageable)
                .map(documentMapper::toDto);
    }

    @Override
    public Page<DocumentDTO> getDocumentsByClass(Long classId, Pageable pageable) {
        return documentRepository.findByClassId(classId, pageable)
                .map(documentMapper::toDto);
    }

    @Override
    public Page<DocumentDTO> getDocumentsByCourse(Long courseId, Pageable pageable) {
        return documentRepository.findByCourseId(courseId, pageable)
                .map(documentMapper::toDto);
    }

    @Override
    public Page<DocumentDTO> getDocumentsBySubject(Long subjectId, Pageable pageable) {
        return documentRepository.findBySubjectId(subjectId, pageable)
                .map(documentMapper::toDto);
    }

    @Override
    public Page<DocumentDTO> getDocumentsByUploadedBy(Long userId, Pageable pageable) {
        return documentRepository.findByUploadedById(userId, pageable)
                .map(documentMapper::toDto);
    }

    @Override
    public Page<DocumentDTO> getDocumentsByCategory(DocumentCategory category, Pageable pageable) {
        return documentRepository.findByDocumentCategory(category, pageable)
                .map(documentMapper::toDto);
    }

    @Override
    public Page<DocumentDTO> getDocumentsByType(DocumentType type, Pageable pageable) {
        return documentRepository.findByDocumentType(type, pageable)
                .map(documentMapper::toDto);
    }

    @Override
    public Page<DocumentDTO> getDocumentsByAccessLevel(DocumentAccessLevel accessLevel, Pageable pageable) {
        return documentRepository.findByAccessLevel(accessLevel, pageable)
                .map(documentMapper::toDto);
    }

    @Override
    public Page<DocumentDTO> getDocumentsByApprovalStatus(DocumentApprovalStatus status, Pageable pageable) {
        return documentRepository.findByApprovalStatus(status, pageable)
                .map(documentMapper::toDto);
    }

    @Override
    public Page<DocumentDTO> getPublicDocuments(Pageable pageable) {
        return documentRepository.findPublicDocuments(pageable)
                .map(documentMapper::toDto);
    }

    @Override
    public Page<DocumentDTO> getArchivedDocuments(Pageable pageable) {
        return documentRepository.findArchivedDocuments(pageable)
                .map(documentMapper::toDto);
    }

    @Override
    public List<DocumentDTO> getDocumentVersions(Long parentDocumentId) {
        return documentRepository.findByParentDocumentId(parentDocumentId)
                .stream()
                .map(documentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentDTO getLatestVersion(Long parentDocumentId) {
        List<Document> versions = documentRepository.findByParentDocumentId(parentDocumentId);
        Document latestVersion = versions.stream()
                .max((d1, d2) -> d1.getVersionNumber().compareTo(d2.getVersionNumber()))
                .orElseThrow(() -> new ResourceNotFoundException("No versions found for document: " + parentDocumentId));
        return documentMapper.toDto(latestVersion);
    }

    @Override
    public Page<DocumentDTO> searchDocuments(String searchTerm, Pageable pageable) {
        return documentRepository.searchDocuments(searchTerm, pageable)
                .map(documentMapper::toDto);
    }

    // Basic access control implementations (simplified for now)
    @Override
    public boolean hasReadAccess(Long documentId, Long userId) {
        return documentPermissionService.hasReadPermission(documentId, userId);
    }

    @Override
    public boolean hasDownloadAccess(Long documentId, Long userId) {
        return documentPermissionService.hasDownloadPermission(documentId, userId);
    }

    @Override
    public boolean hasEditAccess(Long documentId, Long userId) {
        return documentPermissionService.hasEditPermission(documentId, userId);
    }

    @Override
    public boolean hasDeleteAccess(Long documentId, Long userId) {
        return documentPermissionService.hasDeletePermission(documentId, userId);
    }

    @Override
    public boolean hasApprovalAccess(Long documentId, Long userId) {
        return documentPermissionService.hasApprovalPermission(documentId, userId);
    }

    // Placeholder implementations for remaining methods
    // These would be fully implemented in a complete system
    
    @Override
    public Page<DocumentDTO> searchDocumentsByUser(String searchTerm, Long userId, Pageable pageable) {
        // Implementation would filter search results based on user permissions
        return searchDocuments(searchTerm, pageable);
    }

    @Override
    public DocumentDTO approveDocument(Long documentId, Long approverId, String approvalNotes) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has approval permission
        if (!documentPermissionService.hasApprovalPermission(documentId, approverId)) {
            throw new SecurityException("User does not have approval permission for this document");
        }
        
        // Check if document requires approval and is in pending status
        if (!document.isRequiresApproval() || document.getApprovalStatus() != DocumentApprovalStatus.PENDING) {
            throw new IllegalStateException("Document is not in a state that can be approved");
        }
        
        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new ResourceNotFoundException("Approver not found with id: " + approverId));
        
        document.setApprovalStatus(DocumentApprovalStatus.APPROVED);
        document.setApprovedBy(approver);
        document.setApprovedAt(LocalDateTime.now());
        document.setApprovalNotes(approvalNotes);
        
        Document savedDocument = documentRepository.save(document);
        
        // Log the approval action
        documentAccessLogService.logSuccessfulAccess(
            documentId, approverId, DocumentAccessType.EDIT, null, null, null
        );
        
        log.info("Document approved: {} by user: {} with notes: {}", documentId, approverId, approvalNotes);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public DocumentDTO rejectDocument(Long documentId, Long approverId, String approvalNotes) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has approval permission
        if (!documentPermissionService.hasApprovalPermission(documentId, approverId)) {
            throw new SecurityException("User does not have approval permission for this document");
        }
        
        // Check if document requires approval and is in pending status
        if (!document.isRequiresApproval() || document.getApprovalStatus() != DocumentApprovalStatus.PENDING) {
            throw new IllegalStateException("Document is not in a state that can be rejected");
        }
        
        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new ResourceNotFoundException("Approver not found with id: " + approverId));
        
        document.setApprovalStatus(DocumentApprovalStatus.REJECTED);
        document.setApprovedBy(approver);
        document.setApprovedAt(LocalDateTime.now());
        document.setApprovalNotes(approvalNotes);
        
        Document savedDocument = documentRepository.save(document);
        
        // Log the rejection action
        documentAccessLogService.logSuccessfulAccess(
            documentId, approverId, DocumentAccessType.EDIT, null, null, null
        );
        
        log.info("Document rejected: {} by user: {} with notes: {}", documentId, approverId, approvalNotes);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public DocumentDTO requestRevision(Long documentId, Long reviewerId, String revisionNotes) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has edit permission
        if (!documentPermissionService.hasEditPermission(documentId, reviewerId)) {
            throw new SecurityException("User does not have permission to request revision for this document");
        }
        
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found with id: " + reviewerId));
        
        // Reset approval status to pending and add revision notes
        document.setApprovalStatus(DocumentApprovalStatus.PENDING);
        document.setApprovedBy(null);
        document.setApprovedAt(null);
        document.setApprovalNotes("REVISION REQUESTED: " + revisionNotes);
        
        Document savedDocument = documentRepository.save(document);
        
        // Log the revision request
        documentAccessLogService.logSuccessfulAccess(
            documentId, reviewerId, DocumentAccessType.EDIT, null, null, null
        );
        
        log.info("Revision requested for document: {} by user: {} with notes: {}", documentId, reviewerId, revisionNotes);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public DocumentDTO submitForApproval(Long documentId, Long submitterId) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has edit permission
        if (!documentPermissionService.hasEditPermission(documentId, submitterId)) {
            throw new SecurityException("User does not have permission to submit this document for approval");
        }
        
        // Check if document requires approval
        if (!document.isRequiresApproval()) {
            throw new IllegalStateException("Document does not require approval");
        }
        
        // Check if document is not already approved
        if (document.getApprovalStatus() == DocumentApprovalStatus.APPROVED) {
            throw new IllegalStateException("Document is already approved");
        }
        
        document.setApprovalStatus(DocumentApprovalStatus.PENDING);
        document.setApprovedBy(null);
        document.setApprovedAt(null);
        document.setApprovalNotes("Submitted for approval");
        
        Document savedDocument = documentRepository.save(document);
        
        // Log the submission
        documentAccessLogService.logSuccessfulAccess(
            documentId, submitterId, DocumentAccessType.EDIT, null, null, null
        );
        
        log.info("Document submitted for approval: {} by user: {}", documentId, submitterId);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public DocumentDTO archiveDocument(Long documentId, Long archivedById) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has archive permission
        if (!documentPermissionService.hasArchivePermission(documentId, archivedById)) {
            throw new SecurityException("User does not have permission to archive this document");
        }
        
        User archiver = userRepository.findById(archivedById)
                .orElseThrow(() -> new ResourceNotFoundException("Archiver not found with id: " + archivedById));
        
        document.setArchived(true);
        document.setArchivedBy(archiver);
        document.setArchivedAt(LocalDateTime.now());
        
        Document savedDocument = documentRepository.save(document);
        
        // Log the archival
        documentAccessLogService.logSuccessfulAccess(
            documentId, archivedById, DocumentAccessType.ARCHIVE, null, null, null
        );
        
        log.info("Document archived: {} by user: {}", documentId, archivedById);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public DocumentDTO restoreDocument(Long documentId, Long restoredById) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has archive permission (same permission needed to restore)
        if (!documentPermissionService.hasArchivePermission(documentId, restoredById)) {
            throw new SecurityException("User does not have permission to restore this document");
        }
        
        // Check if document is archived
        if (!document.isArchived()) {
            throw new IllegalStateException("Document is not archived");
        }
        
        document.setArchived(false);
        document.setArchivedBy(null);
        document.setArchivedAt(null);
        document.setActive(true);
        
        Document savedDocument = documentRepository.save(document);
        
        // Log the restoration
        documentAccessLogService.logSuccessfulAccess(
            documentId, restoredById, DocumentAccessType.EDIT, null, null, null
        );
        
        log.info("Document restored: {} by user: {}", documentId, restoredById);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public Long getDocumentCountBySchool(Long schoolId) {
        return documentRepository.countBySchoolId(schoolId);
    }

    @Override
    public Long getDocumentCountByUser(Long userId) {
        return documentRepository.countByUploadedById(userId);
    }

    @Override
    public Long getTotalFileSizeBySchool(Long schoolId) {
        return documentRepository.getTotalFileSizeBySchoolId(schoolId);
    }

    @Override
    public List<DocumentDTO> getExpiredDocuments() {
        return documentRepository.findExpiredDocuments(LocalDateTime.now())
                .stream()
                .map(documentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentDTO> getDocumentsExpiringWithin(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().plusDays(days);
        return documentRepository.findExpiredDocuments(cutoffDate)
                .stream()
                .map(documentMapper::toDto)
                .collect(Collectors.toList());
    }

    // Additional placeholder implementations for remaining interface methods
    // These would be fully implemented based on specific business requirements
    
    @Override
    public DocumentDTO shareDocument(Long documentId, Long sharedById, List<Long> userIds, String shareNote) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has share permission
        if (!documentPermissionService.hasPermission(documentId, UserRole.TEACHER, DocumentPermissionType.SHARE) &&
            !documentPermissionService.hasSpecificUserPermission(documentId, sharedById, DocumentPermissionType.SHARE)) {
            throw new SecurityException("User does not have permission to share this document");
        }
        
        // Grant read permissions to specified users
        for (Long userId : userIds) {
            try {
                documentPermissionService.grantSpecificUserPermission(
                    documentId, userId, DocumentPermissionType.READ, sharedById
                );
                log.info("Document {} shared with user {} by user {}: {}", 
                        documentId, userId, sharedById, shareNote);
            } catch (IllegalArgumentException e) {
                // Permission already exists, continue
                log.debug("Permission already exists for user {} on document {}", userId, documentId);
            }
        }
        
        // Log the sharing action
        documentAccessLogService.logSuccessfulAccess(
            documentId, sharedById, DocumentAccessType.SHARE, null, null, null
        );
        
        return documentMapper.toDto(document);
    }

    @Override
    public DocumentDTO shareDocumentWithRole(Long documentId, Long sharedById, String userRole, String shareNote) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has share permission
        if (!documentPermissionService.hasPermission(documentId, UserRole.TEACHER, DocumentPermissionType.SHARE) &&
            !documentPermissionService.hasSpecificUserPermission(documentId, sharedById, DocumentPermissionType.SHARE)) {
            throw new SecurityException("User does not have permission to share this document");
        }
        
        UserRole role;
        try {
            role = UserRole.valueOf(userRole.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid user role: " + userRole);
        }
        
        // Grant read permission to the specified role
        try {
            documentPermissionService.grantPermission(documentId, role, DocumentPermissionType.READ, sharedById);
            log.info("Document {} shared with role {} by user {}: {}", 
                    documentId, role, sharedById, shareNote);
        } catch (IllegalArgumentException e) {
            // Permission already exists
            log.debug("Permission already exists for role {} on document {}", role, documentId);
        }
        
        // Log the sharing action
        documentAccessLogService.logSuccessfulAccess(
            documentId, sharedById, DocumentAccessType.SHARE, null, null, null
        );
        
        return documentMapper.toDto(document);
    }

    @Override
    public List<DocumentDTO> uploadBulkDocuments(List<MultipartFile> files, List<DocumentDTO> documentDTOs, Long uploadedById) {
        if (files.size() != documentDTOs.size()) {
            throw new IllegalArgumentException("Number of files must match number of document DTOs");
        }
        
        List<DocumentDTO> uploadedDocuments = new ArrayList<>();
        
        for (int i = 0; i < files.size(); i++) {
            try {
                DocumentDTO uploadedDocument = uploadDocument(files.get(i), documentDTOs.get(i), uploadedById);
                uploadedDocuments.add(uploadedDocument);
                log.info("Bulk upload: Document {} uploaded successfully", uploadedDocument.title());
            } catch (Exception e) {
                log.error("Bulk upload: Failed to upload document {}: {}", 
                         documentDTOs.get(i).title(), e.getMessage());
                // Continue with other files rather than failing the entire batch
            }
        }
        
        log.info("Bulk upload completed: {}/{} documents uploaded successfully", 
                uploadedDocuments.size(), files.size());
        
        return uploadedDocuments;
    }

    @Override
    public void deleteBulkDocuments(List<Long> documentIds, Long userId) {
        List<Long> successfulDeletes = new ArrayList<>();
        List<Long> failedDeletes = new ArrayList<>();
        
        for (Long documentId : documentIds) {
            try {
                deleteDocument(documentId, userId);
                successfulDeletes.add(documentId);
                log.info("Bulk delete: Document {} deleted successfully", documentId);
            } catch (Exception e) {
                failedDeletes.add(documentId);
                log.error("Bulk delete: Failed to delete document {}: {}", documentId, e.getMessage());
            }
        }
        
        log.info("Bulk delete completed: {}/{} documents deleted successfully", 
                successfulDeletes.size(), documentIds.size());
        
        if (!failedDeletes.isEmpty()) {
            log.warn("Failed to delete documents: {}", failedDeletes);
        }
    }

    @Override
    public void approveBulkDocuments(List<Long> documentIds, Long approverId, String approvalNotes) {
        List<Long> successfulApprovals = new ArrayList<>();
        List<Long> failedApprovals = new ArrayList<>();
        
        for (Long documentId : documentIds) {
            try {
                approveDocument(documentId, approverId, approvalNotes);
                successfulApprovals.add(documentId);
                log.info("Bulk approval: Document {} approved successfully", documentId);
            } catch (Exception e) {
                failedApprovals.add(documentId);
                log.error("Bulk approval: Failed to approve document {}: {}", documentId, e.getMessage());
            }
        }
        
        log.info("Bulk approval completed: {}/{} documents approved successfully", 
                successfulApprovals.size(), documentIds.size());
        
        if (!failedApprovals.isEmpty()) {
            log.warn("Failed to approve documents: {}", failedApprovals);
        }
    }

    @Override
    public void archiveBulkDocuments(List<Long> documentIds, Long archivedById) {
        List<Long> successfulArchives = new ArrayList<>();
        List<Long> failedArchives = new ArrayList<>();
        
        for (Long documentId : documentIds) {
            try {
                archiveDocument(documentId, archivedById);
                successfulArchives.add(documentId);
                log.info("Bulk archive: Document {} archived successfully", documentId);
            } catch (Exception e) {
                failedArchives.add(documentId);
                log.error("Bulk archive: Failed to archive document {}: {}", documentId, e.getMessage());
            }
        }
        
        log.info("Bulk archive completed: {}/{} documents archived successfully", 
                successfulArchives.size(), documentIds.size());
        
        if (!failedArchives.isEmpty()) {
            log.warn("Failed to archive documents: {}", failedArchives);
        }
    }

    @Override
    public boolean validateDocumentChecksum(Long documentId) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        try {
            // Read the file from storage
            Path filePath = Paths.get(document.getFilePath());
            if (!Files.exists(filePath)) {
                log.error("File not found for document {}: {}", documentId, document.getFilePath());
                return false;
            }
            
            byte[] fileContent = Files.readAllBytes(filePath);
            String currentChecksum = calculateChecksum(fileContent);
            
            boolean isValid = currentChecksum.equals(document.getChecksum());
            
            if (!isValid) {
                log.warn("Checksum validation failed for document {}: expected {}, got {}", 
                        documentId, document.getChecksum(), currentChecksum);
            } else {
                log.debug("Checksum validation successful for document {}", documentId);
            }
            
            return isValid;
            
        } catch (IOException e) {
            log.error("Error reading file for checksum validation of document {}: {}", documentId, e.getMessage());
            return false;
        }
    }

    @Override
    public DocumentDTO updateDocumentChecksum(Long documentId) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        try {
            // Read the file from storage
            Path filePath = Paths.get(document.getFilePath());
            if (!Files.exists(filePath)) {
                throw new IllegalStateException("File not found for document: " + document.getFilePath());
            }
            
            byte[] fileContent = Files.readAllBytes(filePath);
            String newChecksum = calculateChecksum(fileContent);
            
            document.setChecksum(newChecksum);
            Document savedDocument = documentRepository.save(document);
            
            log.info("Checksum updated for document {}: {}", documentId, newChecksum);
            return documentMapper.toDto(savedDocument);
            
        } catch (IOException e) {
            log.error("Error updating checksum for document {}: {}", documentId, e.getMessage());
            throw new RuntimeException("Failed to update document checksum", e);
        }
    }

    @Override
    public List<DocumentDTO> findDuplicateDocuments(String checksum) {
        if (checksum == null || checksum.trim().isEmpty()) {
            throw new IllegalArgumentException("Checksum cannot be null or empty");
        }
        
        List<Document> duplicates = documentRepository.findByChecksum(checksum);
        
        log.info("Found {} documents with checksum: {}", duplicates.size(), checksum);
        
        return duplicates.stream()
                .map(documentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentDTO updateDocumentMetadata(Long documentId, DocumentDTO documentDTO, Long updatedById) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has edit permission
        if (!documentPermissionService.hasEditPermission(documentId, updatedById)) {
            throw new SecurityException("User does not have permission to update this document");
        }
        
        // Update only metadata fields (not file-related fields)
        document.setTitle(documentDTO.title());
        document.setDescription(documentDTO.description());
        document.setDocumentCategory(documentDTO.documentCategory());
        document.setAccessLevel(documentDTO.accessLevel());
        document.setExpiryDate(documentDTO.expiryDate());
        document.setPublic(documentDTO.isPublic());
        
        // Update related entities if provided
        if (documentDTO.schoolId() != null) {
            School school = schoolRepository.findById(documentDTO.schoolId())
                    .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + documentDTO.schoolId()));
            document.setSchool(school);
        }
        
        if (documentDTO.regionId() != null) {
            Region region = regionRepository.findById(documentDTO.regionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Region not found with id: " + documentDTO.regionId()));
            document.setRegion(region);
        }
        
        if (documentDTO.classId() != null) {
            com.ohma.thutothebe.entity.Class classEntity = classRepository.findById(documentDTO.classId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + documentDTO.classId()));
            document.setClassEntity(classEntity);
        }
        
        if (documentDTO.courseId() != null) {
            Course course = courseRepository.findById(documentDTO.courseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + documentDTO.courseId()));
            document.setCourse(course);
        }
        
        if (documentDTO.subjectId() != null) {
            Subject subject = subjectRepository.findById(documentDTO.subjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + documentDTO.subjectId()));
            document.setSubject(subject);
        }
        
        Document savedDocument = documentRepository.save(document);
        
        // Log the metadata update
        documentAccessLogService.logSuccessfulAccess(
            documentId, updatedById, DocumentAccessType.EDIT, null, null, null
        );
        
        log.info("Document metadata updated: {} by user: {}", documentId, updatedById);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public DocumentDTO addDocumentTags(Long documentId, String tags, Long updatedById) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has edit permission
        if (!documentPermissionService.hasEditPermission(documentId, updatedById)) {
            throw new SecurityException("User does not have permission to update this document");
        }
        
        String currentTags = document.getTags();
        String newTags;
        
        if (currentTags == null || currentTags.trim().isEmpty()) {
            newTags = tags;
        } else {
            // Add new tags, avoiding duplicates
            Set<String> tagSet = new HashSet<>(Arrays.asList(currentTags.split(",")));
            tagSet.addAll(Arrays.asList(tags.split(",")));
            newTags = String.join(",", tagSet);
        }
        
        document.setTags(newTags);
        Document savedDocument = documentRepository.save(document);
        
        // Log the tag addition
        documentAccessLogService.logSuccessfulAccess(
            documentId, updatedById, DocumentAccessType.EDIT, null, null, null
        );
        
        log.info("Tags added to document {}: {} by user: {}", documentId, tags, updatedById);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public DocumentDTO removeDocumentTags(Long documentId, String tags, Long updatedById) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has edit permission
        if (!documentPermissionService.hasEditPermission(documentId, updatedById)) {
            throw new SecurityException("User does not have permission to update this document");
        }
        
        String currentTags = document.getTags();
        if (currentTags == null || currentTags.trim().isEmpty()) {
            log.info("No tags to remove from document {}", documentId);
            return documentMapper.toDto(document);
        }
        
        // Remove specified tags
        Set<String> currentTagSet = new HashSet<>(Arrays.asList(currentTags.split(",")));
        Set<String> tagsToRemove = new HashSet<>(Arrays.asList(tags.split(",")));
        currentTagSet.removeAll(tagsToRemove);
        
        String newTags = currentTagSet.isEmpty() ? null : String.join(",", currentTagSet);
        document.setTags(newTags);
        Document savedDocument = documentRepository.save(document);
        
        // Log the tag removal
        documentAccessLogService.logSuccessfulAccess(
            documentId, updatedById, DocumentAccessType.EDIT, null, null, null
        );
        
        log.info("Tags removed from document {}: {} by user: {}", documentId, tags, updatedById);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public void logDocumentAccess(Long documentId, Long userId, String accessType, String ipAddress, String userAgent, String sessionId) {
        try {
            DocumentAccessType accessTypeEnum = DocumentAccessType.valueOf(accessType.toUpperCase());
            documentAccessLogService.logSuccessfulAccess(documentId, userId, accessTypeEnum, ipAddress, userAgent, sessionId);
            log.debug("Document access logged: {} for document {} by user {}", accessType, documentId, userId);
        } catch (IllegalArgumentException e) {
            log.error("Invalid access type: {}", accessType);
            throw new IllegalArgumentException("Invalid access type: " + accessType);
        }
    }

    @Override
    public void incrementViewCount(Long documentId, Long userId) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has read permission
        if (!documentPermissionService.hasReadPermission(documentId, userId)) {
            throw new SecurityException("User does not have permission to view this document");
        }
        
        document.setViewCount(document.getViewCount() + 1);
        document.setLastAccessedAt(LocalDateTime.now());
        documentRepository.save(document);
        
        // Log the view access
        documentAccessLogService.logSuccessfulAccess(
            documentId, userId, DocumentAccessType.VIEW, null, null, null
        );
        
        log.debug("View count incremented for document {} by user {}", documentId, userId);
    }

    @Override
    public void incrementDownloadCount(Long documentId, Long userId) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has download permission
        if (!documentPermissionService.hasDownloadPermission(documentId, userId)) {
            throw new SecurityException("User does not have permission to download this document");
        }
        
        document.setDownloadCount(document.getDownloadCount() + 1);
        document.setLastAccessedAt(LocalDateTime.now());
        documentRepository.save(document);
        
        // Log the download access
        documentAccessLogService.logSuccessfulAccess(
            documentId, userId, DocumentAccessType.DOWNLOAD, null, null, null
        );
        
        log.debug("Download count incremented for document {} by user {}", documentId, userId);
    }

    @Override
    public DocumentDTO setDocumentExpiry(Long documentId, LocalDateTime expiryDate, Long updatedById) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has edit permission
        if (!documentPermissionService.hasEditPermission(documentId, updatedById)) {
            throw new SecurityException("User does not have permission to update this document");
        }
        
        // Validate expiry date is in the future
        if (expiryDate.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Expiry date must be in the future");
        }
        
        document.setExpiryDate(expiryDate);
        Document savedDocument = documentRepository.save(document);
        
        // Log the expiry update
        documentAccessLogService.logSuccessfulAccess(
            documentId, updatedById, DocumentAccessType.EDIT, null, null, null
        );
        
        log.info("Expiry date set for document {}: {} by user: {}", documentId, expiryDate, updatedById);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public DocumentDTO removeDocumentExpiry(Long documentId, Long updatedById) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has edit permission
        if (!documentPermissionService.hasEditPermission(documentId, updatedById)) {
            throw new SecurityException("User does not have permission to update this document");
        }
        
        document.setExpiryDate(null);
        Document savedDocument = documentRepository.save(document);
        
        // Log the expiry removal
        documentAccessLogService.logSuccessfulAccess(
            documentId, updatedById, DocumentAccessType.EDIT, null, null, null
        );
        
        log.info("Expiry date removed for document {} by user: {}", documentId, updatedById);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public void processExpiredDocuments() {
        List<Document> expiredDocuments = documentRepository.findExpiredDocuments(LocalDateTime.now());
        
        for (Document document : expiredDocuments) {
            // Archive expired documents automatically
            document.setArchived(true);
            document.setArchivedAt(LocalDateTime.now());
            // Set system as archiver (could be a system user ID)
            documentRepository.save(document);
            
            log.info("Expired document automatically archived: {} (expired: {})", 
                    document.getId(), document.getExpiryDate());
        }
        
        log.info("Processed {} expired documents", expiredDocuments.size());
    }

    @Override
    public List<DocumentDTO> getDocumentsRequiringCompliance(DocumentCategory category) {
        // Find documents in specific categories that require compliance review
        List<DocumentCategory> complianceCategories = Arrays.asList(
            DocumentCategory.POLICY, 
            DocumentCategory.PROCEDURE, 
            DocumentCategory.COMPLIANCE,
            DocumentCategory.ADMINISTRATIVE
        );
        
        if (category != null && !complianceCategories.contains(category)) {
            return new ArrayList<>();
        }
        
        DocumentCategory targetCategory = category != null ? category : DocumentCategory.POLICY;
        
        // Find documents that are either pending approval or haven't been reviewed in 6 months
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        
        return documentRepository.findByDocumentCategory(targetCategory, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(doc -> doc.getApprovalStatus() == DocumentApprovalStatus.PENDING ||
                              (doc.getApprovedAt() != null && doc.getApprovedAt().isBefore(sixMonthsAgo)))
                .map(documentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentDTO> getDocumentsPendingReview() {
        return documentRepository.findByApprovalStatus(DocumentApprovalStatus.PENDING, Pageable.unpaged())
                .getContent()
                .stream()
                .map(documentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentDTO> getDocumentsModifiedSince(LocalDateTime since) {
        return documentRepository.findAll()
                .stream()
                .filter(doc -> doc.getModifiedAt().isAfter(since) && doc.isActive())
                .map(documentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentDTO> getDocumentTemplates() {
        // Find documents marked as templates (could be a specific category or tag)
        return documentRepository.findByDocumentCategory(DocumentCategory.REFERENCE_MATERIAL, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(doc -> doc.getTags() != null && doc.getTags().contains("template"))
                .map(documentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentDTO createDocumentFromTemplate(Long templateId, DocumentDTO documentDTO, Long createdById) {
        Document template = documentRepository.findActiveDocumentById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + templateId));
        
        // Check if user has read permission on template
        if (!documentPermissionService.hasReadPermission(templateId, createdById)) {
            throw new SecurityException("User does not have permission to use this template");
        }
        
        // Verify it's actually a template
        if (!template.getTags().contains("template")) {
            throw new IllegalArgumentException("Document is not marked as a template");
        }
        
        User creator = userRepository.findById(createdById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + createdById));
        
        // Create new document based on template
        Document newDocument = new Document();
        newDocument.setTitle(documentDTO.title());
        newDocument.setDescription(documentDTO.description());
        newDocument.setDocumentCategory(template.getDocumentCategory());
        newDocument.setDocumentType(template.getDocumentType());
        newDocument.setAccessLevel(documentDTO.accessLevel());
        newDocument.setUploadedBy(creator);
        newDocument.setUploadedAt(LocalDateTime.now());
        newDocument.setVersionNumber(1);
        newDocument.setApprovalStatus(DocumentApprovalStatus.PENDING);
        newDocument.setRequiresApproval(template.isRequiresApproval());
        newDocument.setActive(true);
        
        // Set related entities from DTO
        setRelatedEntities(newDocument, documentDTO);
        
        // Copy template tags but remove "template" tag
        String templateTags = template.getTags();
        if (templateTags != null) {
            String newTags = templateTags.replace("template", "").replace(",,", ",");
            if (newTags.startsWith(",")) newTags = newTags.substring(1);
            if (newTags.endsWith(",")) newTags = newTags.substring(0, newTags.length() - 1);
            newDocument.setTags(newTags);
        }
        
        Document savedDocument = documentRepository.save(newDocument);
        
        log.info("Document created from template {}: {} by user: {}", templateId, savedDocument.getId(), createdById);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public DocumentDTO linkDocumentToAssignment(Long documentId, Long assignmentId, Long linkedById) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has edit permission
        if (!documentPermissionService.hasEditPermission(documentId, linkedById)) {
            throw new SecurityException("User does not have permission to link this document");
        }
        
        // Add assignment link to tags (simple implementation)
        String currentTags = document.getTags();
        String assignmentTag = "assignment:" + assignmentId;
        
        if (currentTags == null || currentTags.trim().isEmpty()) {
            document.setTags(assignmentTag);
        } else if (!currentTags.contains(assignmentTag)) {
            document.setTags(currentTags + "," + assignmentTag);
        }
        
        Document savedDocument = documentRepository.save(document);
        
        // Log the linking action
        documentAccessLogService.logSuccessfulAccess(
            documentId, linkedById, DocumentAccessType.EDIT, null, null, null
        );
        
        log.info("Document {} linked to assignment {} by user: {}", documentId, assignmentId, linkedById);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public DocumentDTO linkDocumentToAnnouncement(Long documentId, Long announcementId, Long linkedById) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has edit permission
        if (!documentPermissionService.hasEditPermission(documentId, linkedById)) {
            throw new SecurityException("User does not have permission to link this document");
        }
        
        // Add announcement link to tags (simple implementation)
        String currentTags = document.getTags();
        String announcementTag = "announcement:" + announcementId;
        
        if (currentTags == null || currentTags.trim().isEmpty()) {
            document.setTags(announcementTag);
        } else if (!currentTags.contains(announcementTag)) {
            document.setTags(currentTags + "," + announcementTag);
        }
        
        Document savedDocument = documentRepository.save(document);
        
        // Log the linking action
        documentAccessLogService.logSuccessfulAccess(
            documentId, linkedById, DocumentAccessType.EDIT, null, null, null
        );
        
        log.info("Document {} linked to announcement {} by user: {}", documentId, announcementId, linkedById);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public DocumentDTO linkDocumentToSchedule(Long documentId, Long scheduleId, Long linkedById) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Check if user has edit permission
        if (!documentPermissionService.hasEditPermission(documentId, linkedById)) {
            throw new SecurityException("User does not have permission to link this document");
        }
        
        // Add schedule link to tags (simple implementation)
        String currentTags = document.getTags();
        String scheduleTag = "schedule:" + scheduleId;
        
        if (currentTags == null || currentTags.trim().isEmpty()) {
            document.setTags(scheduleTag);
        } else if (!currentTags.contains(scheduleTag)) {
            document.setTags(currentTags + "," + scheduleTag);
        }
        
        Document savedDocument = documentRepository.save(document);
        
        // Log the linking action
        documentAccessLogService.logSuccessfulAccess(
            documentId, linkedById, DocumentAccessType.EDIT, null, null, null
        );
        
        log.info("Document {} linked to schedule {} by user: {}", documentId, scheduleId, linkedById);
        return documentMapper.toDto(savedDocument);
    }

    @Override
    public List<Object[]> getDocumentUsageStatistics(Long schoolId, LocalDateTime startDate, LocalDateTime endDate) {
        // This would typically use a custom repository query to get usage statistics
        // For now, return basic statistics using existing methods
        List<Object[]> statistics = new ArrayList<>();
        
        Long totalDocuments = documentRepository.countBySchoolId(schoolId);
        Long totalFileSize = documentRepository.getTotalFileSizeBySchoolId(schoolId);
        
        // Add basic statistics
        statistics.add(new Object[]{"total_documents", totalDocuments});
        statistics.add(new Object[]{"total_file_size", totalFileSize});
        statistics.add(new Object[]{"period_start", startDate});
        statistics.add(new Object[]{"period_end", endDate});
        
        log.info("Generated usage statistics for school {} from {} to {}", schoolId, startDate, endDate);
        return statistics;
    }

    @Override
    public List<Object[]> getDocumentCategoryStatistics(Long schoolId) {
        // This would typically use a custom repository query
        // For now, return basic category distribution
        List<Object[]> statistics = new ArrayList<>();
        
        for (DocumentCategory category : DocumentCategory.values()) {
            Long count = documentRepository.findByDocumentCategory(category, Pageable.unpaged())
                    .getContent()
                    .stream()
                    .filter(doc -> doc.getSchool() != null && doc.getSchool().getId().equals(schoolId))
                    .count();
            
            if (count > 0) {
                statistics.add(new Object[]{category.name(), count});
            }
        }
        
        log.info("Generated category statistics for school {}", schoolId);
        return statistics;
    }

    @Override
    public List<Object[]> getDocumentTypeStatistics(Long schoolId) {
        // This would typically use a custom repository query
        // For now, return basic type distribution
        List<Object[]> statistics = new ArrayList<>();
        
        for (DocumentType type : DocumentType.values()) {
            Long count = documentRepository.findByDocumentType(type, Pageable.unpaged())
                    .getContent()
                    .stream()
                    .filter(doc -> doc.getSchool() != null && doc.getSchool().getId().equals(schoolId))
                    .count();
            
            if (count > 0) {
                statistics.add(new Object[]{type.name(), count});
            }
        }
        
        log.info("Generated type statistics for school {}", schoolId);
        return statistics;
    }

    @Override
    public List<Object[]> getMostAccessedDocuments(Long schoolId, Pageable pageable) {
        if (schoolId != null) {
            return documentAccessLogService.getMostAccessedDocumentsBySchool(schoolId, pageable);
        } else {
            return documentAccessLogService.getMostAccessedDocuments(pageable);
        }
    }

    @Override
    public List<Object[]> getMostDownloadedDocuments(Long schoolId, int limit) {
        // This would typically use a custom repository query with ORDER BY downloadCount DESC
        // For now, return documents sorted by download count
        List<Object[]> statistics = new ArrayList<>();
        
        List<Document> documents = documentRepository.findBySchoolId(schoolId, Pageable.unpaged())
                .getContent()
                .stream()
                .sorted((d1, d2) -> Long.compare(d2.getDownloadCount(), d1.getDownloadCount()))
                .limit(limit)
                .collect(Collectors.toList());
        
        for (Document doc : documents) {
            statistics.add(new Object[]{
                doc.getId(),
                doc.getTitle(),
                doc.getDownloadCount(),
                doc.getViewCount()
            });
        }
        
        log.info("Generated most downloaded documents for school {} (limit: {})", schoolId, limit);
        return statistics;
    }
} 
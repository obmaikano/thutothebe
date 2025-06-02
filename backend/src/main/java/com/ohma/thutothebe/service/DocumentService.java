package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.DocumentDTO;
import com.ohma.thutothebe.dto.DocumentUploadRequest;
import com.ohma.thutothebe.entity.DocumentAccessLevel;
import com.ohma.thutothebe.entity.DocumentApprovalStatus;
import com.ohma.thutothebe.entity.DocumentCategory;
import com.ohma.thutothebe.entity.DocumentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

public interface DocumentService extends BaseService<DocumentDTO, Long> {

    // File upload and management
    DocumentDTO uploadDocument(MultipartFile file, DocumentUploadRequest uploadRequest, Long uploadedById);
    DocumentDTO uploadDocument(MultipartFile file, DocumentDTO documentDTO, Long uploadedById);
    DocumentDTO uploadDocumentVersion(Long parentDocumentId, MultipartFile file, DocumentDTO documentDTO, Long uploadedById);
    byte[] downloadDocument(Long documentId, Long userId);
    void deleteDocument(Long documentId, Long userId);
    
    // Document retrieval methods
    DocumentDTO getActiveDocumentById(Long id);
    Page<DocumentDTO> getAllActiveDocuments(Pageable pageable);
    Page<DocumentDTO> getDocumentsBySchool(Long schoolId, Pageable pageable);
    Page<DocumentDTO> getDocumentsByRegion(Long regionId, Pageable pageable);
    Page<DocumentDTO> getDocumentsByClass(Long classId, Pageable pageable);
    Page<DocumentDTO> getDocumentsByCourse(Long courseId, Pageable pageable);
    Page<DocumentDTO> getDocumentsBySubject(Long subjectId, Pageable pageable);
    Page<DocumentDTO> getDocumentsByUploadedBy(Long userId, Pageable pageable);
    
    // Category and type filtering
    Page<DocumentDTO> getDocumentsByCategory(DocumentCategory category, Pageable pageable);
    Page<DocumentDTO> getDocumentsByType(DocumentType type, Pageable pageable);
    Page<DocumentDTO> getDocumentsByAccessLevel(DocumentAccessLevel accessLevel, Pageable pageable);
    Page<DocumentDTO> getDocumentsByApprovalStatus(DocumentApprovalStatus status, Pageable pageable);
    
    // Public and archived documents
    Page<DocumentDTO> getPublicDocuments(Pageable pageable);
    Page<DocumentDTO> getArchivedDocuments(Pageable pageable);
    
    // Document versioning
    List<DocumentDTO> getDocumentVersions(Long parentDocumentId);
    DocumentDTO getLatestVersion(Long parentDocumentId);
    
    // Search functionality
    Page<DocumentDTO> searchDocuments(String searchTerm, Pageable pageable);
    Page<DocumentDTO> searchDocumentsByUser(String searchTerm, Long userId, Pageable pageable);
    
    // Document approval workflow
    DocumentDTO approveDocument(Long documentId, Long approverId, String approvalNotes);
    DocumentDTO rejectDocument(Long documentId, Long approverId, String approvalNotes);
    DocumentDTO requestRevision(Long documentId, Long reviewerId, String revisionNotes);
    DocumentDTO submitForApproval(Long documentId, Long submitterId);
    
    // Document archiving
    DocumentDTO archiveDocument(Long documentId, Long archivedById);
    DocumentDTO restoreDocument(Long documentId, Long restoredById);
    
    // Access control and permissions
    boolean hasReadAccess(Long documentId, Long userId);
    boolean hasDownloadAccess(Long documentId, Long userId);
    boolean hasEditAccess(Long documentId, Long userId);
    boolean hasDeleteAccess(Long documentId, Long userId);
    boolean hasApprovalAccess(Long documentId, Long userId);
    
    // Document statistics and analytics
    Long getDocumentCountBySchool(Long schoolId);
    Long getDocumentCountByUser(Long userId);
    Long getTotalFileSizeBySchool(Long schoolId);
    List<DocumentDTO> getExpiredDocuments();
    List<DocumentDTO> getDocumentsExpiringWithin(int days);
    
    // Document sharing
    DocumentDTO shareDocument(Long documentId, Long sharedById, List<Long> userIds, String shareNote);
    DocumentDTO shareDocumentWithRole(Long documentId, Long sharedById, String userRole, String shareNote);
    
    // Bulk operations
    List<DocumentDTO> uploadBulkDocuments(List<MultipartFile> files, List<DocumentDTO> documentDTOs, Long uploadedById);
    void deleteBulkDocuments(List<Long> documentIds, Long userId);
    void approveBulkDocuments(List<Long> documentIds, Long approverId, String approvalNotes);
    void archiveBulkDocuments(List<Long> documentIds, Long archivedById);
    
    // Document validation and integrity
    boolean validateDocumentChecksum(Long documentId);
    DocumentDTO updateDocumentChecksum(Long documentId);
    List<DocumentDTO> findDuplicateDocuments(String checksum);
    
    // Document metadata management
    DocumentDTO updateDocumentMetadata(Long documentId, DocumentDTO documentDTO, Long updatedById);
    DocumentDTO addDocumentTags(Long documentId, String tags, Long updatedById);
    DocumentDTO removeDocumentTags(Long documentId, String tags, Long updatedById);
    
    // Document access tracking
    void logDocumentAccess(Long documentId, Long userId, String accessType, String ipAddress, String userAgent, String sessionId);
    void incrementViewCount(Long documentId, Long userId);
    void incrementDownloadCount(Long documentId, Long userId);
    
    // Document expiry management
    DocumentDTO setDocumentExpiry(Long documentId, LocalDateTime expiryDate, Long updatedById);
    DocumentDTO removeDocumentExpiry(Long documentId, Long updatedById);
    void processExpiredDocuments();
    
    // Document compliance and audit
    List<DocumentDTO> getDocumentsRequiringCompliance(DocumentCategory category);
    List<DocumentDTO> getDocumentsPendingReview();
    List<DocumentDTO> getDocumentsModifiedSince(LocalDateTime since);
    
    // Document templates and forms
    List<DocumentDTO> getDocumentTemplates();
    DocumentDTO createDocumentFromTemplate(Long templateId, DocumentDTO documentDTO, Long createdById);
    
    // Document integration
    DocumentDTO linkDocumentToAssignment(Long documentId, Long assignmentId, Long linkedById);
    DocumentDTO linkDocumentToAnnouncement(Long documentId, Long announcementId, Long linkedById);
    DocumentDTO linkDocumentToSchedule(Long documentId, Long scheduleId, Long linkedById);
    
    // Document reporting
    List<Object[]> getDocumentUsageStatistics(Long schoolId, LocalDateTime startDate, LocalDateTime endDate);
    List<Object[]> getDocumentCategoryStatistics(Long schoolId);
    List<Object[]> getDocumentTypeStatistics(Long schoolId);
    List<Object[]> getMostAccessedDocuments(Long schoolId, Pageable pageable);
    List<Object[]> getMostDownloadedDocuments(Long schoolId, int limit);
} 
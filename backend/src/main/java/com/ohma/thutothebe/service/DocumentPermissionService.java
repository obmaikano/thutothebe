package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.DocumentPermissionDTO;
import com.ohma.thutothebe.entity.DocumentPermissionType;
import com.ohma.thutothebe.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DocumentPermissionService extends BaseService<DocumentPermissionDTO, Long> {

    // Permission retrieval methods
    Page<DocumentPermissionDTO> getAllActivePermissions(Pageable pageable);
    List<DocumentPermissionDTO> getPermissionsByDocument(Long documentId);
    List<DocumentPermissionDTO> getPermissionsByDocumentAndUserRole(Long documentId, UserRole userRole);
    List<DocumentPermissionDTO> getPermissionsByDocumentAndSpecificUser(Long documentId, Long userId);
    List<DocumentPermissionDTO> getPermissionsByDocumentAndPermissionType(Long documentId, DocumentPermissionType permissionType);
    
    // Scope-based permission retrieval
    List<DocumentPermissionDTO> getPermissionsBySchool(Long schoolId);
    List<DocumentPermissionDTO> getPermissionsByRegion(Long regionId);
    List<DocumentPermissionDTO> getPermissionsByClass(Long classId);
    List<DocumentPermissionDTO> getPermissionsByCourse(Long courseId);
    List<DocumentPermissionDTO> getPermissionsBySpecificUser(Long userId);
    
    // Permission management
    DocumentPermissionDTO grantPermission(Long documentId, UserRole userRole, DocumentPermissionType permissionType, Long grantedById);
    DocumentPermissionDTO grantSpecificUserPermission(Long documentId, Long userId, DocumentPermissionType permissionType, Long grantedById);
    DocumentPermissionDTO grantSchoolPermission(Long documentId, Long schoolId, UserRole userRole, DocumentPermissionType permissionType, Long grantedById);
    DocumentPermissionDTO grantRegionPermission(Long documentId, Long regionId, UserRole userRole, DocumentPermissionType permissionType, Long grantedById);
    DocumentPermissionDTO grantClassPermission(Long documentId, Long classId, UserRole userRole, DocumentPermissionType permissionType, Long grantedById);
    DocumentPermissionDTO grantCoursePermission(Long documentId, Long courseId, UserRole userRole, DocumentPermissionType permissionType, Long grantedById);
    
    // Permission revocation
    void revokePermission(Long permissionId, Long revokedById);
    void revokeAllPermissionsForDocument(Long documentId, Long revokedById);
    void revokePermissionByDocumentAndUserRole(Long documentId, UserRole userRole, DocumentPermissionType permissionType, Long revokedById);
    void revokePermissionByDocumentAndSpecificUser(Long documentId, Long userId, DocumentPermissionType permissionType, Long revokedById);
    
    // Permission checking
    boolean hasPermission(Long documentId, UserRole userRole, DocumentPermissionType permissionType);
    boolean hasSpecificUserPermission(Long documentId, Long userId, DocumentPermissionType permissionType);
    boolean hasAnyPermission(Long documentId, Long userId);
    boolean hasReadPermission(Long documentId, Long userId);
    boolean hasDownloadPermission(Long documentId, Long userId);
    boolean hasEditPermission(Long documentId, Long userId);
    boolean hasDeletePermission(Long documentId, Long userId);
    boolean hasApprovalPermission(Long documentId, Long userId);
    boolean hasArchivePermission(Long documentId, Long userId);
    
    // Bulk permission operations
    List<DocumentPermissionDTO> grantBulkPermissions(List<Long> documentIds, UserRole userRole, DocumentPermissionType permissionType, Long grantedById);
    List<DocumentPermissionDTO> grantBulkSpecificUserPermissions(List<Long> documentIds, Long userId, DocumentPermissionType permissionType, Long grantedById);
    void revokeBulkPermissions(List<Long> permissionIds, Long revokedById);
    void revokeBulkPermissionsByDocuments(List<Long> documentIds, Long revokedById);
    
    // Permission templates and inheritance
    List<DocumentPermissionDTO> copyPermissionsFromDocument(Long sourceDocumentId, Long targetDocumentId, Long copiedById);
    List<DocumentPermissionDTO> applyPermissionTemplate(Long documentId, String templateName, Long appliedById);
    void inheritPermissionsFromParent(Long childDocumentId, Long parentDocumentId, Long inheritedById);
    
    // Permission auditing and reporting
    List<DocumentPermissionDTO> getPermissionHistory(Long documentId);
    List<DocumentPermissionDTO> getPermissionsGrantedByUser(Long userId);
    List<DocumentPermissionDTO> getPermissionsForUser(Long userId);
    List<Object[]> getPermissionStatistics(Long schoolId);
    List<Object[]> getPermissionsByRole(Long schoolId);
    List<Object[]> getPermissionsByType(Long schoolId);
    
    // Permission validation and cleanup
    void validatePermissions(Long documentId);
    void cleanupInactivePermissions();
    void cleanupExpiredPermissions();
    List<DocumentPermissionDTO> findConflictingPermissions(Long documentId);
    List<DocumentPermissionDTO> findOrphanedPermissions();
    
    // Advanced permission queries
    List<DocumentPermissionDTO> getEffectivePermissions(Long documentId, Long userId);
    List<DocumentPermissionDTO> getInheritedPermissions(Long documentId);
    List<DocumentPermissionDTO> getDirectPermissions(Long documentId);
    boolean isPermissionInherited(Long permissionId);
    
    // Permission scope management
    DocumentPermissionDTO updatePermissionScope(Long permissionId, Long schoolId, Long regionId, Long classId, Long courseId, Long updatedById);
    void removePermissionScope(Long permissionId, Long removedById);
    List<DocumentPermissionDTO> getPermissionsByScope(String scopeType, Long scopeId);
} 
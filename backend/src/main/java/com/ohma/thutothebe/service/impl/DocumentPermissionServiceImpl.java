package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.DocumentPermissionDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.DocumentPermissionMapper;
import com.ohma.thutothebe.repository.DocumentPermissionRepository;
import com.ohma.thutothebe.repository.DocumentRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.RegionRepository;
import com.ohma.thutothebe.repository.ClassRepository;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.service.DocumentPermissionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Map;

@Slf4j
@Service
@Transactional
public class DocumentPermissionServiceImpl extends BaseServiceImpl<DocumentPermission, DocumentPermissionDTO, Long> implements DocumentPermissionService {

    private final DocumentPermissionRepository documentPermissionRepository;
    private final DocumentPermissionMapper documentPermissionMapper;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final RegionRepository regionRepository;
    private final ClassRepository classRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public DocumentPermissionServiceImpl(DocumentPermissionRepository documentPermissionRepository,
                                       DocumentPermissionMapper documentPermissionMapper,
                                       DocumentRepository documentRepository,
                                       UserRepository userRepository,
                                       SchoolRepository schoolRepository,
                                       RegionRepository regionRepository,
                                       ClassRepository classRepository,
                                       CourseRepository courseRepository) {
        super(documentPermissionRepository);
        this.documentPermissionRepository = documentPermissionRepository;
        this.documentPermissionMapper = documentPermissionMapper;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.schoolRepository = schoolRepository;
        this.regionRepository = regionRepository;
        this.classRepository = classRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    protected DocumentPermission mapToEntity(DocumentPermissionDTO dto) {
        return documentPermissionMapper.toEntity(dto);
    }

    @Override
    protected DocumentPermissionDTO mapToDto(DocumentPermission entity) {
        return documentPermissionMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(DocumentPermission entity, DocumentPermissionDTO dto) {
        documentPermissionMapper.updateEntityFromDto(entity, dto);
    }

    @Override
    public Page<DocumentPermissionDTO> getAllActivePermissions(Pageable pageable) {
        return documentPermissionRepository.findAllActivePermissions(pageable)
                .map(documentPermissionMapper::toDto);
    }

    @Override
    public List<DocumentPermissionDTO> getPermissionsByDocument(Long documentId) {
        return documentPermissionRepository.findByDocumentId(documentId)
                .stream()
                .map(documentPermissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentPermissionDTO> getPermissionsByDocumentAndUserRole(Long documentId, UserRole userRole) {
        return documentPermissionRepository.findByDocumentIdAndUserRole(documentId, userRole)
                .stream()
                .map(documentPermissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentPermissionDTO> getPermissionsByDocumentAndSpecificUser(Long documentId, Long userId) {
        return documentPermissionRepository.findByDocumentIdAndSpecificUserId(documentId, userId)
                .stream()
                .map(documentPermissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentPermissionDTO> getPermissionsByDocumentAndPermissionType(Long documentId, DocumentPermissionType permissionType) {
        return documentPermissionRepository.findByDocumentIdAndPermissionType(documentId, permissionType)
                .stream()
                .map(documentPermissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentPermissionDTO> getPermissionsBySchool(Long schoolId) {
        return documentPermissionRepository.findBySchoolId(schoolId)
                .stream()
                .map(documentPermissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentPermissionDTO> getPermissionsByRegion(Long regionId) {
        return documentPermissionRepository.findByRegionId(regionId)
                .stream()
                .map(documentPermissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentPermissionDTO> getPermissionsByClass(Long classId) {
        return documentPermissionRepository.findByClassId(classId)
                .stream()
                .map(documentPermissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentPermissionDTO> getPermissionsByCourse(Long courseId) {
        return documentPermissionRepository.findByCourseId(courseId)
                .stream()
                .map(documentPermissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentPermissionDTO> getPermissionsBySpecificUser(Long userId) {
        return documentPermissionRepository.findBySpecificUserId(userId)
                .stream()
                .map(documentPermissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentPermissionDTO grantPermission(Long documentId, UserRole userRole, DocumentPermissionType permissionType, Long grantedById) {
        // Check if permission already exists
        if (documentPermissionRepository.hasPermission(documentId, userRole, permissionType)) {
            throw new IllegalArgumentException("Permission already exists for this document and user role");
        }

        DocumentPermission permission = new DocumentPermission();
        permission.setDocument(documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId)));
        permission.setUserRole(userRole);
        permission.setPermissionType(permissionType);
        permission.setActive(true);

        DocumentPermission savedPermission = documentPermissionRepository.save(permission);
        log.info("Permission granted: {} for document: {} and role: {} by user: {}", 
                permissionType, documentId, userRole, grantedById);
        
        return documentPermissionMapper.toDto(savedPermission);
    }

    @Override
    public DocumentPermissionDTO grantSpecificUserPermission(Long documentId, Long userId, DocumentPermissionType permissionType, Long grantedById) {
        // Check if permission already exists
        if (documentPermissionRepository.hasSpecificUserPermission(documentId, userId, permissionType)) {
            throw new IllegalArgumentException("Permission already exists for this document and user");
        }

        DocumentPermission permission = new DocumentPermission();
        permission.setDocument(documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId)));
        permission.setSpecificUser(userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId)));
        permission.setUserRole(UserRole.STUDENT); // Default role for specific user permissions
        permission.setPermissionType(permissionType);
        permission.setActive(true);

        DocumentPermission savedPermission = documentPermissionRepository.save(permission);
        log.info("Specific user permission granted: {} for document: {} and user: {} by user: {}", 
                permissionType, documentId, userId, grantedById);
        
        return documentPermissionMapper.toDto(savedPermission);
    }

    @Override
    public boolean hasPermission(Long documentId, UserRole userRole, DocumentPermissionType permissionType) {
        return documentPermissionRepository.hasPermission(documentId, userRole, permissionType);
    }

    @Override
    public boolean hasSpecificUserPermission(Long documentId, Long userId, DocumentPermissionType permissionType) {
        return documentPermissionRepository.hasSpecificUserPermission(documentId, userId, permissionType);
    }

    @Override
    public boolean hasReadPermission(Long documentId, Long userId) {
        // Implementation would check user's role and specific permissions
        return hasSpecificUserPermission(documentId, userId, DocumentPermissionType.READ);
    }

    @Override
    public boolean hasDownloadPermission(Long documentId, Long userId) {
        // Get the document to check access level and ownership
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Get the user to check role
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        // 1. Check if user is the document owner
        if (document.getUploadedBy() != null && document.getUploadedBy().getId().equals(userId)) {
            return true;
        }
        
        // 2. Check admin roles - they can download any document
        if (user.getRole() == UserRole.SUPER_ADMIN || 
            user.getRole() == UserRole.SCHOOL_ADMIN) {
            return true;
        }
        
        // 3. Check document access level
        switch (document.getAccessLevel()) {
            case PUBLIC:
                // Public documents can be downloaded by anyone
                return true;
                
            case SCHOOL:
                // School-level documents can be downloaded by users in the same school
                if (document.getSchool() != null && user.getSchool() != null && 
                    document.getSchool().getId().equals(user.getSchool().getId())) {
                    return true;
                }
                break;
                
            case CLASS:
                // Class-level documents can be downloaded by teachers and students in the class
                if (document.getClassEntity() != null && user.getRole() == UserRole.TEACHER) {
                    // Teachers can download class documents if they teach the class
                    // This would require checking teacher-class relationships
                    return true;
                }
                break;
                
            case TEACHER_ONLY:
                // Only teachers and above can download
                if (user.getRole() == UserRole.TEACHER || 
                    user.getRole() == UserRole.SENIOR_TEACHER ||
                    user.getRole() == UserRole.DEPARTMENT_HEAD ||
                    user.getRole() == UserRole.SCHOOL_HEAD) {
                    return true;
                }
                break;
                
            case ADMIN_ONLY:
                // Only admins can download
                if (user.getRole() == UserRole.SCHOOL_ADMIN || 
                    user.getRole() == UserRole.SUPER_ADMIN ||
                    user.getRole() == UserRole.DEPARTMENT_HEAD ||
                    user.getRole() == UserRole.SCHOOL_HEAD) {
                    return true;
                }
                break;
                
            case PRIVATE:
                // Private documents require explicit permission
                break;
        }
        
        // 4. Check explicit user permissions as fallback
        boolean hasExplicitPermission = hasSpecificUserPermission(documentId, userId, DocumentPermissionType.DOWNLOAD);
        if (hasExplicitPermission) {
            return true;
        }
        
        // 5. Check role-based permissions
        boolean hasRolePermission = hasPermission(documentId, user.getRole(), DocumentPermissionType.DOWNLOAD);
        if (hasRolePermission) {
            return true;
        }
        
        // 6. For approved documents, allow broader access based on role
        if (document.getApprovalStatus() == DocumentApprovalStatus.APPROVED) {
            switch (user.getRole()) {
                case TEACHER:
                case SENIOR_TEACHER:
                case DEPARTMENT_HEAD:
                case SCHOOL_HEAD:
                    // Teachers can download approved educational content
                    if (document.getDocumentCategory() == DocumentCategory.CURRICULUM ||
                        document.getDocumentCategory() == DocumentCategory.LESSON_PLAN ||
                        document.getDocumentCategory() == DocumentCategory.ACADEMIC_RESOURCE ||
                        document.getDocumentCategory() == DocumentCategory.TRAINING_MATERIAL ||
                        document.getDocumentCategory() == DocumentCategory.REFERENCE_MATERIAL) {
                        return true;
                    }
                    break;
                case STUDENT:
                    // Students can download approved student resources
                    if (document.getDocumentCategory() == DocumentCategory.ACADEMIC_RESOURCE ||
                        document.getDocumentCategory() == DocumentCategory.ASSIGNMENT ||
                        document.getDocumentCategory() == DocumentCategory.REFERENCE_MATERIAL) {
                        return true;
                    }
                    break;
                case PARENT:
                    // Parents can download approved announcements and forms
                    if (document.getDocumentCategory() == DocumentCategory.ANNOUNCEMENT ||
                        document.getDocumentCategory() == DocumentCategory.FORM) {
                        return true;
                    }
                    break;
            }
        }
        
        return false;
    }

    @Override
    public boolean hasEditPermission(Long documentId, Long userId) {
        return hasSpecificUserPermission(documentId, userId, DocumentPermissionType.EDIT);
    }

    @Override
    public boolean hasDeletePermission(Long documentId, Long userId) {
        return hasSpecificUserPermission(documentId, userId, DocumentPermissionType.DELETE);
    }

    @Override
    public boolean hasApprovalPermission(Long documentId, Long userId) {
        return hasSpecificUserPermission(documentId, userId, DocumentPermissionType.APPROVE);
    }

    @Override
    public boolean hasArchivePermission(Long documentId, Long userId) {
        return hasSpecificUserPermission(documentId, userId, DocumentPermissionType.ARCHIVE);
    }

    @Override
    public void revokePermission(Long permissionId, Long revokedById) {
        DocumentPermission permission = documentPermissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + permissionId));
        
        permission.setActive(false);
        documentPermissionRepository.save(permission);
        
        log.info("Permission revoked: {} by user: {}", permissionId, revokedById);
    }

    @Override
    public DocumentPermissionDTO grantSchoolPermission(Long documentId, Long schoolId, UserRole userRole, DocumentPermissionType permissionType, Long grantedById) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        User grantedBy = userRepository.findById(grantedById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + grantedById));
        
        School school = schoolRepository.findById(schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + schoolId));
        
        // Check if permission already exists
        List<DocumentPermission> existingPermissions = documentPermissionRepository
                .findByDocumentIdAndUserRole(documentId, userRole);
        
        for (DocumentPermission existing : existingPermissions) {
            if (existing.getSchool() != null && existing.getSchool().getId().equals(schoolId)) {
                throw new IllegalArgumentException("Permission already exists for this school and role");
            }
        }
        
        DocumentPermission permission = new DocumentPermission();
        permission.setDocument(document);
        permission.setUserRole(userRole);
        permission.setPermissionType(permissionType);
        permission.setSchool(school);
        permission.setActive(true);
        
        DocumentPermission savedPermission = documentPermissionRepository.save(permission);
        
        log.info("School permission granted: {} for document {} to school {} with role {}", 
                permissionType, documentId, schoolId, userRole);
        
        return documentPermissionMapper.toDto(savedPermission);
    }

    @Override
    public DocumentPermissionDTO grantRegionPermission(Long documentId, Long regionId, UserRole userRole, DocumentPermissionType permissionType, Long grantedById) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        User grantedBy = userRepository.findById(grantedById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + grantedById));
        
        Region region = regionRepository.findById(regionId)
                .orElseThrow(() -> new ResourceNotFoundException("Region not found with id: " + regionId));
        
        // Check if permission already exists
        List<DocumentPermission> existingPermissions = documentPermissionRepository
                .findByDocumentIdAndUserRole(documentId, userRole);
        
        for (DocumentPermission existing : existingPermissions) {
            if (existing.getRegion() != null && existing.getRegion().getId().equals(regionId)) {
                throw new IllegalArgumentException("Permission already exists for this region and role");
            }
        }
        
        DocumentPermission permission = new DocumentPermission();
        permission.setDocument(document);
        permission.setUserRole(userRole);
        permission.setPermissionType(permissionType);
        permission.setRegion(region);
        permission.setActive(true);
        
        DocumentPermission savedPermission = documentPermissionRepository.save(permission);
        
        log.info("Region permission granted: {} for document {} to region {} with role {}", 
                permissionType, documentId, regionId, userRole);
        
        return documentPermissionMapper.toDto(savedPermission);
    }

    @Override
    public DocumentPermissionDTO grantClassPermission(Long documentId, Long classId, UserRole userRole, DocumentPermissionType permissionType, Long grantedById) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        User grantedBy = userRepository.findById(grantedById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + grantedById));
        
        com.ohma.thutothebe.entity.Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
        
        // Check if permission already exists
        List<DocumentPermission> existingPermissions = documentPermissionRepository
                .findByDocumentIdAndUserRole(documentId, userRole);
        
        for (DocumentPermission existing : existingPermissions) {
            if (existing.getClassEntity() != null && existing.getClassEntity().getId().equals(classId)) {
                throw new IllegalArgumentException("Permission already exists for this class and role");
            }
        }
        
        DocumentPermission permission = new DocumentPermission();
        permission.setDocument(document);
        permission.setUserRole(userRole);
        permission.setPermissionType(permissionType);
        permission.setClassEntity(classEntity);
        permission.setActive(true);
        
        DocumentPermission savedPermission = documentPermissionRepository.save(permission);
        
        log.info("Class permission granted: {} for document {} to class {} with role {}", 
                permissionType, documentId, classId, userRole);
        
        return documentPermissionMapper.toDto(savedPermission);
    }

    @Override
    public DocumentPermissionDTO grantCoursePermission(Long documentId, Long courseId, UserRole userRole, DocumentPermissionType permissionType, Long grantedById) {
        Document document = documentRepository.findActiveDocumentById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        User grantedBy = userRepository.findById(grantedById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + grantedById));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        
        // Check if permission already exists
        List<DocumentPermission> existingPermissions = documentPermissionRepository
                .findByDocumentIdAndUserRole(documentId, userRole);
        
        for (DocumentPermission existing : existingPermissions) {
            if (existing.getCourse() != null && existing.getCourse().getId().equals(courseId)) {
                throw new IllegalArgumentException("Permission already exists for this course and role");
            }
        }
        
        DocumentPermission permission = new DocumentPermission();
        permission.setDocument(document);
        permission.setUserRole(userRole);
        permission.setPermissionType(permissionType);
        permission.setCourse(course);
        permission.setActive(true);
        
        DocumentPermission savedPermission = documentPermissionRepository.save(permission);
        
        log.info("Course permission granted: {} for document {} to course {} with role {}", 
                permissionType, documentId, courseId, userRole);
        
        return documentPermissionMapper.toDto(savedPermission);
    }

    @Override
    public void revokeAllPermissionsForDocument(Long documentId, Long revokedById) {
        List<DocumentPermission> permissions = documentPermissionRepository.findByDocumentId(documentId);
        
        for (DocumentPermission permission : permissions) {
            if (permission.isActive()) {
                permission.setActive(false);
                documentPermissionRepository.save(permission);
            }
        }
        
        log.info("All permissions revoked for document {} by user {}", documentId, revokedById);
    }

    @Override
    public void revokePermissionByDocumentAndUserRole(Long documentId, UserRole userRole, DocumentPermissionType permissionType, Long revokedById) {
        List<DocumentPermission> permissions = documentPermissionRepository
                .findByDocumentIdAndUserRole(documentId, userRole);
        
        for (DocumentPermission permission : permissions) {
            if (permission.isActive() && permission.getPermissionType() == permissionType) {
                permission.setActive(false);
                documentPermissionRepository.save(permission);
            }
        }
        
        log.info("Permission {} revoked for document {} and role {} by user {}", 
                permissionType, documentId, userRole, revokedById);
    }

    @Override
    public void revokePermissionByDocumentAndSpecificUser(Long documentId, Long userId, DocumentPermissionType permissionType, Long revokedById) {
        List<DocumentPermission> permissions = documentPermissionRepository
                .findByDocumentIdAndSpecificUserId(documentId, userId);
        
        for (DocumentPermission permission : permissions) {
            if (permission.isActive() && permission.getPermissionType() == permissionType) {
                permission.setActive(false);
                documentPermissionRepository.save(permission);
            }
        }
        
        log.info("Permission {} revoked for document {} and user {} by user {}", 
                permissionType, documentId, userId, revokedById);
    }

    @Override
    public boolean hasAnyPermission(Long documentId, Long userId) {
        // Check if user has any permission (read, download, edit, delete, approve, archive, share)
        for (DocumentPermissionType permissionType : DocumentPermissionType.values()) {
            if (hasSpecificUserPermission(documentId, userId, permissionType)) {
                return true;
            }
        }
        return false;
    }

    // Placeholder implementations for remaining methods
    // These would be fully implemented based on specific business requirements
    
    @Override
    public List<DocumentPermissionDTO> grantBulkPermissions(List<Long> documentIds, UserRole userRole, DocumentPermissionType permissionType, Long grantedById) {
        List<DocumentPermissionDTO> grantedPermissions = new ArrayList<>();
        
        for (Long documentId : documentIds) {
            try {
                DocumentPermissionDTO permission = grantPermission(documentId, userRole, permissionType, grantedById);
                grantedPermissions.add(permission);
            } catch (Exception e) {
                log.error("Failed to grant permission for document {}: {}", documentId, e.getMessage());
            }
        }
        
        log.info("Bulk permissions granted: {}/{} documents for role {} with permission {}", 
                grantedPermissions.size(), documentIds.size(), userRole, permissionType);
        
        return grantedPermissions;
    }

    @Override
    public List<DocumentPermissionDTO> grantBulkSpecificUserPermissions(List<Long> documentIds, Long userId, DocumentPermissionType permissionType, Long grantedById) {
        List<DocumentPermissionDTO> grantedPermissions = new ArrayList<>();
        
        for (Long documentId : documentIds) {
            try {
                DocumentPermissionDTO permission = grantSpecificUserPermission(documentId, userId, permissionType, grantedById);
                grantedPermissions.add(permission);
            } catch (Exception e) {
                log.error("Failed to grant permission for document {} to user {}: {}", documentId, userId, e.getMessage());
            }
        }
        
        log.info("Bulk specific user permissions granted: {}/{} documents for user {} with permission {}", 
                grantedPermissions.size(), documentIds.size(), userId, permissionType);
        
        return grantedPermissions;
    }

    @Override
    public void revokeBulkPermissions(List<Long> permissionIds, Long revokedById) {
        int revokedCount = 0;
        
        for (Long permissionId : permissionIds) {
            try {
                revokePermission(permissionId, revokedById);
                revokedCount++;
            } catch (Exception e) {
                log.error("Failed to revoke permission {}: {}", permissionId, e.getMessage());
            }
        }
        
        log.info("Bulk permissions revoked: {}/{} permissions by user {}", 
                revokedCount, permissionIds.size(), revokedById);
    }

    @Override
    public void revokeBulkPermissionsByDocuments(List<Long> documentIds, Long revokedById) {
        int revokedCount = 0;
        
        for (Long documentId : documentIds) {
            try {
                revokeAllPermissionsForDocument(documentId, revokedById);
                revokedCount++;
            } catch (Exception e) {
                log.error("Failed to revoke permissions for document {}: {}", documentId, e.getMessage());
            }
        }
        
        log.info("Bulk document permissions revoked: {}/{} documents by user {}", 
                revokedCount, documentIds.size(), revokedById);
    }

    @Override
    public List<DocumentPermissionDTO> copyPermissionsFromDocument(Long sourceDocumentId, Long targetDocumentId, Long copiedById) {
        List<DocumentPermission> sourcePermissions = documentPermissionRepository.findByDocumentId(sourceDocumentId);
        List<DocumentPermissionDTO> copiedPermissions = new ArrayList<>();
        
        Document targetDocument = documentRepository.findById(targetDocumentId)
                .orElseThrow(() -> new ResourceNotFoundException("Target document not found with id: " + targetDocumentId));
        
        for (DocumentPermission sourcePermission : sourcePermissions) {
            if (sourcePermission.isActive()) {
                DocumentPermission newPermission = new DocumentPermission();
                newPermission.setDocument(targetDocument);
                newPermission.setUserRole(sourcePermission.getUserRole());
                newPermission.setSpecificUser(sourcePermission.getSpecificUser());
                newPermission.setPermissionType(sourcePermission.getPermissionType());
                newPermission.setSchool(sourcePermission.getSchool());
                newPermission.setRegion(sourcePermission.getRegion());
                newPermission.setClassEntity(sourcePermission.getClassEntity());
                newPermission.setCourse(sourcePermission.getCourse());
                newPermission.setActive(true);
                
                DocumentPermission savedPermission = documentPermissionRepository.save(newPermission);
                copiedPermissions.add(documentPermissionMapper.toDto(savedPermission));
            }
        }
        
        log.info("Copied {} permissions from document {} to document {} by user {}", 
                copiedPermissions.size(), sourceDocumentId, targetDocumentId, copiedById);
        
        return copiedPermissions;
    }

    @Override
    public List<DocumentPermissionDTO> applyPermissionTemplate(Long documentId, String templateName, Long appliedById) {
        List<DocumentPermissionDTO> appliedPermissions = new ArrayList<>();
        
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        // Apply predefined permission templates based on template name
        switch (templateName.toUpperCase()) {
            case "TEACHER_FULL_ACCESS":
                appliedPermissions.add(grantPermission(documentId, UserRole.TEACHER, DocumentPermissionType.READ, appliedById));
                appliedPermissions.add(grantPermission(documentId, UserRole.TEACHER, DocumentPermissionType.DOWNLOAD, appliedById));
                appliedPermissions.add(grantPermission(documentId, UserRole.TEACHER, DocumentPermissionType.EDIT, appliedById));
                appliedPermissions.add(grantPermission(documentId, UserRole.TEACHER, DocumentPermissionType.SHARE, appliedById));
                break;
                
            case "STUDENT_READ_ONLY":
                appliedPermissions.add(grantPermission(documentId, UserRole.STUDENT, DocumentPermissionType.READ, appliedById));
                break;
                
            case "STUDENT_READ_DOWNLOAD":
                appliedPermissions.add(grantPermission(documentId, UserRole.STUDENT, DocumentPermissionType.READ, appliedById));
                appliedPermissions.add(grantPermission(documentId, UserRole.STUDENT, DocumentPermissionType.DOWNLOAD, appliedById));
                break;
                
            case "ADMIN_FULL_CONTROL":
                for (DocumentPermissionType permType : DocumentPermissionType.values()) {
                    appliedPermissions.add(grantPermission(documentId, UserRole.SCHOOL_ADMIN, permType, appliedById));
                }
                break;
                
            case "PUBLIC_READ":
                appliedPermissions.add(grantPermission(documentId, UserRole.STUDENT, DocumentPermissionType.READ, appliedById));
                appliedPermissions.add(grantPermission(documentId, UserRole.TEACHER, DocumentPermissionType.READ, appliedById));
                appliedPermissions.add(grantPermission(documentId, UserRole.PARENT, DocumentPermissionType.READ, appliedById));
                break;
                
            default:
                throw new IllegalArgumentException("Unknown permission template: " + templateName);
        }
        
        log.info("Applied permission template '{}' to document {} by user {}, granted {} permissions", 
                templateName, documentId, appliedById, appliedPermissions.size());
        
        return appliedPermissions;
    }

    @Override
    public void inheritPermissionsFromParent(Long childDocumentId, Long parentDocumentId, Long inheritedById) {
        List<DocumentPermissionDTO> inheritedPermissions = copyPermissionsFromDocument(parentDocumentId, childDocumentId, inheritedById);
        
        log.info("Document {} inherited {} permissions from parent document {} by user {}", 
                childDocumentId, inheritedPermissions.size(), parentDocumentId, inheritedById);
    }

    @Override
    public List<DocumentPermissionDTO> getPermissionHistory(Long documentId) {
        // This would require a separate audit table to track permission changes over time
        // For now, return current active permissions
        List<DocumentPermission> permissions = documentPermissionRepository.findByDocumentId(documentId);
        
        return permissions.stream()
                .map(documentPermissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentPermissionDTO> getPermissionsGrantedByUser(Long userId) {
        // This would require tracking who granted each permission
        // For now, return empty list as this field is not currently tracked
        log.info("Permission history requested for grants by user {}", userId);
        return new ArrayList<>();
    }

    @Override
    public List<DocumentPermissionDTO> getPermissionsForUser(Long userId) {
        return documentPermissionRepository.findBySpecificUserId(userId)
                .stream()
                .map(documentPermissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> getPermissionStatistics(Long schoolId) {
        List<Object[]> statistics = new ArrayList<>();
        
        List<DocumentPermission> schoolPermissions = documentPermissionRepository.findBySchoolId(schoolId);
        
        // Count by permission type
        Map<DocumentPermissionType, Long> typeStats = schoolPermissions.stream()
                .filter(DocumentPermission::isActive)
                .collect(Collectors.groupingBy(
                    DocumentPermission::getPermissionType,
                    Collectors.counting()
                ));
        
        for (Map.Entry<DocumentPermissionType, Long> entry : typeStats.entrySet()) {
            statistics.add(new Object[]{"TYPE", entry.getKey().name(), entry.getValue()});
        }
        
        // Count by user role
        Map<UserRole, Long> roleStats = schoolPermissions.stream()
                .filter(DocumentPermission::isActive)
                .filter(p -> p.getUserRole() != null)
                .collect(Collectors.groupingBy(
                    DocumentPermission::getUserRole,
                    Collectors.counting()
                ));
        
        for (Map.Entry<UserRole, Long> entry : roleStats.entrySet()) {
            statistics.add(new Object[]{"ROLE", entry.getKey().name(), entry.getValue()});
        }
        
        log.info("Generated permission statistics for school {}", schoolId);
        return statistics;
    }

    @Override
    public List<Object[]> getPermissionsByRole(Long schoolId) {
        List<DocumentPermission> schoolPermissions = documentPermissionRepository.findBySchoolId(schoolId);
        
        Map<UserRole, Long> roleStats = schoolPermissions.stream()
                .filter(DocumentPermission::isActive)
                .filter(p -> p.getUserRole() != null)
                .collect(Collectors.groupingBy(
                    DocumentPermission::getUserRole,
                    Collectors.counting()
                ));
        
        return roleStats.entrySet().stream()
                .map(entry -> new Object[]{entry.getKey().name(), entry.getValue()})
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> getPermissionsByType(Long schoolId) {
        List<DocumentPermission> schoolPermissions = documentPermissionRepository.findBySchoolId(schoolId);
        
        Map<DocumentPermissionType, Long> typeStats = schoolPermissions.stream()
                .filter(DocumentPermission::isActive)
                .collect(Collectors.groupingBy(
                    DocumentPermission::getPermissionType,
                    Collectors.counting()
                ));
        
        return typeStats.entrySet().stream()
                .map(entry -> new Object[]{entry.getKey().name(), entry.getValue()})
                .collect(Collectors.toList());
    }

    @Override
    public void validatePermissions(Long documentId) {
        List<DocumentPermission> permissions = documentPermissionRepository.findByDocumentId(documentId);
        
        for (DocumentPermission permission : permissions) {
            if (permission.isActive()) {
                // Validate that referenced entities still exist
                if (permission.getSpecificUser() != null && 
                    !userRepository.existsById(permission.getSpecificUser().getId())) {
                    permission.setActive(false);
                    documentPermissionRepository.save(permission);
                    log.warn("Deactivated permission {} due to missing user", permission.getId());
                }
                
                if (permission.getSchool() != null && 
                    !schoolRepository.existsById(permission.getSchool().getId())) {
                    permission.setActive(false);
                    documentPermissionRepository.save(permission);
                    log.warn("Deactivated permission {} due to missing school", permission.getId());
                }
                
                if (permission.getRegion() != null && 
                    !regionRepository.existsById(permission.getRegion().getId())) {
                    permission.setActive(false);
                    documentPermissionRepository.save(permission);
                    log.warn("Deactivated permission {} due to missing region", permission.getId());
                }
                
                if (permission.getClassEntity() != null && 
                    !classRepository.existsById(permission.getClassEntity().getId())) {
                    permission.setActive(false);
                    documentPermissionRepository.save(permission);
                    log.warn("Deactivated permission {} due to missing class", permission.getId());
                }
                
                if (permission.getCourse() != null && 
                    !courseRepository.existsById(permission.getCourse().getId())) {
                    permission.setActive(false);
                    documentPermissionRepository.save(permission);
                    log.warn("Deactivated permission {} due to missing course", permission.getId());
                }
            }
        }
        
        log.info("Validated permissions for document {}", documentId);
    }

    @Override
    public void cleanupInactivePermissions() {
        List<DocumentPermission> inactivePermissions = documentPermissionRepository.findAll()
                .stream()
                .filter(p -> !p.isActive())
                .collect(Collectors.toList());
        
        // In a real system, you might archive these instead of deleting
        documentPermissionRepository.deleteAll(inactivePermissions);
        
        log.info("Cleaned up {} inactive permissions", inactivePermissions.size());
    }

    @Override
    public void cleanupExpiredPermissions() {
        // This would require an expiry date field on permissions
        // For now, just log the operation
        log.info("Cleanup expired permissions operation completed (no expiry tracking implemented)");
    }

    @Override
    public List<DocumentPermissionDTO> findConflictingPermissions(Long documentId) {
        List<DocumentPermission> permissions = documentPermissionRepository.findByDocumentId(documentId);
        List<DocumentPermissionDTO> conflicts = new ArrayList<>();
        
        // Find permissions that might conflict (e.g., same user with different permission levels)
        Map<Long, List<DocumentPermission>> userPermissions = permissions.stream()
                .filter(DocumentPermission::isActive)
                .filter(p -> p.getSpecificUser() != null)
                .collect(Collectors.groupingBy(p -> p.getSpecificUser().getId()));
        
        for (Map.Entry<Long, List<DocumentPermission>> entry : userPermissions.entrySet()) {
            if (entry.getValue().size() > 1) {
                // Multiple permissions for same user might be conflicting
                conflicts.addAll(entry.getValue().stream()
                        .map(documentPermissionMapper::toDto)
                        .collect(Collectors.toList()));
            }
        }
        
        log.info("Found {} potentially conflicting permissions for document {}", conflicts.size(), documentId);
        return conflicts;
    }

    @Override
    public List<DocumentPermissionDTO> findOrphanedPermissions() {
        List<DocumentPermission> allPermissions = documentPermissionRepository.findAll();
        List<DocumentPermissionDTO> orphaned = new ArrayList<>();
        
        for (DocumentPermission permission : allPermissions) {
            if (permission.isActive() && !documentRepository.existsById(permission.getDocument().getId())) {
                orphaned.add(documentPermissionMapper.toDto(permission));
            }
        }
        
        log.info("Found {} orphaned permissions", orphaned.size());
        return orphaned;
    }

    @Override
    public List<DocumentPermissionDTO> getEffectivePermissions(Long documentId, Long userId) {
        List<DocumentPermission> allPermissions = documentPermissionRepository.findByDocumentId(documentId);
        List<DocumentPermissionDTO> effectivePermissions = new ArrayList<>();
        
        // Get user's direct permissions
        List<DocumentPermission> directPermissions = allPermissions.stream()
                .filter(p -> p.isActive() && p.getSpecificUser() != null && 
                           p.getSpecificUser().getId().equals(userId))
                .collect(Collectors.toList());
        
        effectivePermissions.addAll(directPermissions.stream()
                .map(documentPermissionMapper::toDto)
                .collect(Collectors.toList()));
        
        // Note: In a real system, you would also check role-based permissions
        // based on the user's actual roles and organizational membership
        
        log.info("Retrieved {} effective permissions for user {} on document {}", 
                effectivePermissions.size(), userId, documentId);
        
        return effectivePermissions;
    }

    @Override
    public List<DocumentPermissionDTO> getInheritedPermissions(Long documentId) {
        // This would require a parent-child relationship in documents
        // For now, return empty list
        log.info("Inherited permissions requested for document {}", documentId);
        return new ArrayList<>();
    }

    @Override
    public List<DocumentPermissionDTO> getDirectPermissions(Long documentId) {
        return documentPermissionRepository.findByDocumentId(documentId)
                .stream()
                .filter(DocumentPermission::isActive)
                .map(documentPermissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isPermissionInherited(Long permissionId) {
        // This would require tracking inheritance in the permission entity
        // For now, return false (all permissions are direct)
        return false;
    }

    @Override
    public DocumentPermissionDTO updatePermissionScope(Long permissionId, Long schoolId, Long regionId, Long classId, Long courseId, Long updatedById) {
        DocumentPermission permission = documentPermissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + permissionId));
        
        // Update scope entities
        if (schoolId != null) {
            permission.setSchool(schoolRepository.findById(schoolId)
                    .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + schoolId)));
        } else {
            permission.setSchool(null);
        }
        
        if (regionId != null) {
            permission.setRegion(regionRepository.findById(regionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Region not found with id: " + regionId)));
        } else {
            permission.setRegion(null);
        }
        
        if (classId != null) {
            permission.setClassEntity(classRepository.findById(classId)
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId)));
        } else {
            permission.setClassEntity(null);
        }
        
        if (courseId != null) {
            permission.setCourse(courseRepository.findById(courseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId)));
        } else {
            permission.setCourse(null);
        }
        
        DocumentPermission savedPermission = documentPermissionRepository.save(permission);
        
        log.info("Updated permission scope for permission {} by user {}", permissionId, updatedById);
        return documentPermissionMapper.toDto(savedPermission);
    }

    @Override
    public void removePermissionScope(Long permissionId, Long removedById) {
        DocumentPermission permission = documentPermissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + permissionId));
        
        permission.setSchool(null);
        permission.setRegion(null);
        permission.setClassEntity(null);
        permission.setCourse(null);
        
        documentPermissionRepository.save(permission);
        
        log.info("Removed permission scope for permission {} by user {}", permissionId, removedById);
    }

    @Override
    public List<DocumentPermissionDTO> getPermissionsByScope(String scopeType, Long scopeId) {
        List<DocumentPermission> permissions = new ArrayList<>();
        
        switch (scopeType.toUpperCase()) {
            case "SCHOOL":
                permissions = documentPermissionRepository.findBySchoolId(scopeId);
                break;
            case "REGION":
                permissions = documentPermissionRepository.findByRegionId(scopeId);
                break;
            case "CLASS":
                permissions = documentPermissionRepository.findByClassId(scopeId);
                break;
            case "COURSE":
                permissions = documentPermissionRepository.findByCourseId(scopeId);
                break;
            default:
                throw new IllegalArgumentException("Unknown scope type: " + scopeType);
        }
        
        return permissions.stream()
                .filter(DocumentPermission::isActive)
                .map(documentPermissionMapper::toDto)
                .collect(Collectors.toList());
    }
} 
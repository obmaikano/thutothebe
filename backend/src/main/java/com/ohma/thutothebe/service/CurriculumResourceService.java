package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CurriculumResourceDTO;
import com.ohma.thutothebe.entity.CurriculumResource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CurriculumResourceService extends BaseService<CurriculumResourceDTO, Long> {

    // Resource Management
    CurriculumResourceDTO uploadResource(Long curriculumId, MultipartFile file, CurriculumResourceDTO resourceData);
    
    CurriculumResourceDTO addLinkResource(Long curriculumId, CurriculumResourceDTO resourceData);
    
    List<CurriculumResourceDTO> getResourcesByCurriculum(Long curriculumId, String resourceType, Long unitId, Long topicId);
    
    List<CurriculumResourceDTO> getResourcesByUnit(Long unitId);
    
    List<CurriculumResourceDTO> getResourcesByTopic(Long topicId);
    
    List<CurriculumResourceDTO> getResourcesByType(CurriculumResource.ResourceType resourceType);
    
    // Resource Access Tracking
    void trackAccess(Long resourceId, Long userId);
    
    void trackDownload(Long resourceId, Long userId);
    
    Long getAccessCount(Long resourceId);
    
    Long getDownloadCount(Long resourceId);
    
    // Resource Search and Filtering
    List<CurriculumResourceDTO> searchResources(String searchTerm, Long curriculumId);
    
    List<CurriculumResourceDTO> getResourcesByTag(String tag, Long curriculumId);
    
    List<CurriculumResourceDTO> getPublicResources(Long curriculumId);
    
    List<CurriculumResourceDTO> getResourcesByLanguage(String language, Long curriculumId);
    
    // Resource Analytics
    List<CurriculumResourceDTO> getMostAccessedResources(Long curriculumId, int limit);
    
    List<CurriculumResourceDTO> getRecentlyAddedResources(Long curriculumId, int limit);
    
    List<CurriculumResourceDTO> getUnderutilizedResources(Long curriculumId);
    
    // Resource Management
    CurriculumResourceDTO updateResourceMetadata(Long resourceId, CurriculumResourceDTO resourceData);
    
    void deleteResource(Long resourceId);
    
    void activateResource(Long resourceId);
    
    void deactivateResource(Long resourceId);
    
    // File Operations
    String generateThumbnail(Long resourceId);
    
    boolean validateFileIntegrity(Long resourceId);
    
    String getResourceUrl(Long resourceId, Long userId);
    
    byte[] downloadResource(Long resourceId, Long userId);
} 
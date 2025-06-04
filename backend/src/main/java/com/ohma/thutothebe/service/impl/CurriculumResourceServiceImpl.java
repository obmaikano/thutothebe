package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CurriculumResourceDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.mapper.CurriculumResourceMapper;
import com.ohma.thutothebe.repository.*;
import com.ohma.thutothebe.service.CurriculumResourceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class CurriculumResourceServiceImpl extends BaseServiceImpl<CurriculumResource, CurriculumResourceDTO, Long> implements CurriculumResourceService {

    private final CurriculumResourceRepository curriculumResourceRepository;
    private final CurriculumRepository curriculumRepository;
    private final CurriculumUnitRepository curriculumUnitRepository;
    private final CurriculumTopicRepository curriculumTopicRepository;
    private final UserRepository userRepository;
    private final CurriculumResourceMapper curriculumResourceMapper;

    @Autowired
    public CurriculumResourceServiceImpl(
            CurriculumResourceRepository curriculumResourceRepository,
            CurriculumRepository curriculumRepository,
            CurriculumUnitRepository curriculumUnitRepository,
            CurriculumTopicRepository curriculumTopicRepository,
            UserRepository userRepository,
            CurriculumResourceMapper curriculumResourceMapper) {
        super(curriculumResourceRepository);
        this.curriculumResourceRepository = curriculumResourceRepository;
        this.curriculumRepository = curriculumRepository;
        this.curriculumUnitRepository = curriculumUnitRepository;
        this.curriculumTopicRepository = curriculumTopicRepository;
        this.userRepository = userRepository;
        this.curriculumResourceMapper = curriculumResourceMapper;
    }

    // Implement abstract methods from BaseServiceImpl
    @Override
    protected CurriculumResource mapToEntity(CurriculumResourceDTO dto) {
        return curriculumResourceMapper.toEntity(dto);
    }

    @Override
    protected CurriculumResourceDTO mapToDto(CurriculumResource entity) {
        return curriculumResourceMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(CurriculumResource entity, CurriculumResourceDTO dto) {
        curriculumResourceMapper.updateEntity(entity, dto);
    }

    @Override
    public CurriculumResourceDTO uploadResource(Long curriculumId, MultipartFile file, CurriculumResourceDTO resourceData) {
        log.info("Uploading resource for curriculum ID: {}", curriculumId);
        
        Curriculum curriculum = curriculumRepository.findById(curriculumId)
                .orElseThrow(() -> new IllegalArgumentException("Curriculum not found with ID: " + curriculumId));
        
        User uploadedBy = userRepository.findById(resourceData.uploadedById())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + resourceData.uploadedById()));

        CurriculumResource resource = new CurriculumResource();
        resource.setCurriculum(curriculum);
        resource.setTitle(resourceData.title());
        resource.setDescription(resourceData.description());
        resource.setResourceType(resourceData.resourceType());
        resource.setUploadedBy(uploadedBy);
        resource.setUploadedAt(LocalDateTime.now());
        resource.setLanguage(resourceData.language());
        resource.setPublic(resourceData.isPublic());
        resource.setRequiresAuthentication(resourceData.requiresAuthentication());
        resource.setCopyrightInfo(resourceData.copyrightInfo());
        resource.setLicenseType(resourceData.licenseType());
        resource.setActive(true);

        // Set unit and topic if provided
        if (resourceData.curriculumUnitId() != null) {
            CurriculumUnit unit = curriculumUnitRepository.findById(resourceData.curriculumUnitId())
                    .orElseThrow(() -> new IllegalArgumentException("Unit not found with ID: " + resourceData.curriculumUnitId()));
            resource.setCurriculumUnit(unit);
        }

        if (resourceData.curriculumTopicId() != null) {
            CurriculumTopic topic = curriculumTopicRepository.findById(resourceData.curriculumTopicId())
                    .orElseThrow(() -> new IllegalArgumentException("Topic not found with ID: " + resourceData.curriculumTopicId()));
            resource.setCurriculumTopic(topic);
        }

        if (file != null && !file.isEmpty()) {
            // Handle file upload
            try {
                String fileName = file.getOriginalFilename();
                String fileUrl = saveFile(file, curriculumId);
                String checksum = generateFileChecksum(file.getBytes());
                
                resource.setFileName(fileName);
                resource.setUrl(fileUrl);
                resource.setFileSize(file.getSize());
                resource.setMimeType(file.getContentType());
                resource.setChecksum(checksum);
                
                // Generate thumbnail for supported formats
                if (isImageFile(file.getContentType())) {
                    resource.setThumbnailUrl(generateThumbnailUrl(fileUrl));
                }
                
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload file", e);
            }
        } else {
            // Handle link resource
            resource.setUrl(resourceData.url());
        }

        CurriculumResource savedResource = curriculumResourceRepository.save(resource);
        log.info("Resource uploaded successfully with ID: {}", savedResource.getId());
        
        return curriculumResourceMapper.toDto(savedResource);
    }

    @Override
    public CurriculumResourceDTO addLinkResource(Long curriculumId, CurriculumResourceDTO resourceData) {
        log.info("Adding link resource for curriculum ID: {}", curriculumId);
        return uploadResource(curriculumId, null, resourceData);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumResourceDTO> getResourcesByCurriculum(Long curriculumId, String resourceType, Long unitId, Long topicId) {
        log.info("Retrieving resources for curriculum ID: {}, type: {}, unit: {}, topic: {}", 
                curriculumId, resourceType, unitId, topicId);
        
        List<CurriculumResource> resources;
        
        if (resourceType != null && unitId != null && topicId != null) {
            CurriculumResource.ResourceType type = CurriculumResource.ResourceType.valueOf(resourceType.toUpperCase());
            resources = curriculumResourceRepository.findByCurriculumIdAndResourceTypeAndCurriculumUnitIdAndCurriculumTopicId(
                    curriculumId, type, unitId, topicId);
        } else if (resourceType != null && unitId != null) {
            CurriculumResource.ResourceType type = CurriculumResource.ResourceType.valueOf(resourceType.toUpperCase());
            resources = curriculumResourceRepository.findByCurriculumIdAndResourceTypeAndCurriculumUnitId(
                    curriculumId, type, unitId);
        } else if (resourceType != null && topicId != null) {
            CurriculumResource.ResourceType type = CurriculumResource.ResourceType.valueOf(resourceType.toUpperCase());
            resources = curriculumResourceRepository.findByCurriculumIdAndResourceTypeAndCurriculumTopicId(
                    curriculumId, type, topicId);
        } else if (resourceType != null) {
            CurriculumResource.ResourceType type = CurriculumResource.ResourceType.valueOf(resourceType.toUpperCase());
            resources = curriculumResourceRepository.findByCurriculumIdAndResourceType(curriculumId, type);
        } else if (unitId != null) {
            resources = curriculumResourceRepository.findByCurriculumIdAndCurriculumUnitId(curriculumId, unitId);
        } else if (topicId != null) {
            resources = curriculumResourceRepository.findByCurriculumIdAndCurriculumTopicId(curriculumId, topicId);
        } else {
            resources = curriculumResourceRepository.findByCurriculumIdAndIsActive(curriculumId, true);
        }
        
        return resources.stream()
                .map(curriculumResourceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumResourceDTO> getResourcesByUnit(Long unitId) {
        log.info("Retrieving resources for unit ID: {}", unitId);
        
        List<CurriculumResource> resources = curriculumResourceRepository.findByCurriculumUnitIdAndIsActive(unitId, true);
        return resources.stream()
                .map(curriculumResourceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumResourceDTO> getResourcesByTopic(Long topicId) {
        log.info("Retrieving resources for topic ID: {}", topicId);
        
        List<CurriculumResource> resources = curriculumResourceRepository.findByCurriculumTopicIdAndIsActive(topicId, true);
        return resources.stream()
                .map(curriculumResourceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumResourceDTO> getResourcesByType(CurriculumResource.ResourceType resourceType) {
        log.info("Retrieving resources by type: {}", resourceType);
        
        List<CurriculumResource> resources = curriculumResourceRepository.findByResourceTypeAndIsActive(resourceType, true);
        return resources.stream()
                .map(curriculumResourceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void trackAccess(Long resourceId, Long userId) {
        log.info("Tracking access for resource ID: {} by user ID: {}", resourceId, userId);
        
        CurriculumResource resource = curriculumResourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + resourceId));
        
        resource.setAccessCount(resource.getAccessCount() + 1);
        resource.setLastAccessedAt(LocalDateTime.now());
        curriculumResourceRepository.save(resource);
    }

    @Override
    public void trackDownload(Long resourceId, Long userId) {
        log.info("Tracking download for resource ID: {} by user ID: {}", resourceId, userId);
        
        CurriculumResource resource = curriculumResourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + resourceId));
        
        resource.setDownloadCount(resource.getDownloadCount() + 1);
        curriculumResourceRepository.save(resource);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getAccessCount(Long resourceId) {
        log.info("Getting access count for resource ID: {}", resourceId);
        
        CurriculumResource resource = curriculumResourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + resourceId));
        
        return resource.getAccessCount();
    }

    @Override
    @Transactional(readOnly = true)
    public Long getDownloadCount(Long resourceId) {
        log.info("Getting download count for resource ID: {}", resourceId);
        
        CurriculumResource resource = curriculumResourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + resourceId));
        
        return resource.getDownloadCount();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumResourceDTO> searchResources(String searchTerm, Long curriculumId) {
        log.info("Searching resources with term: {} for curriculum ID: {}", searchTerm, curriculumId);
        
        List<CurriculumResource> resources = curriculumResourceRepository.searchByTitleOrDescription(searchTerm, curriculumId);
        return resources.stream()
                .map(curriculumResourceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumResourceDTO> getResourcesByTag(String tag, Long curriculumId) {
        log.info("Getting resources by tag: {} for curriculum ID: {}", tag, curriculumId);
        
        List<CurriculumResource> resources = curriculumResourceRepository.findByTagsContainingAndCurriculumId(tag, curriculumId);
        return resources.stream()
                .map(curriculumResourceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumResourceDTO> getPublicResources(Long curriculumId) {
        log.info("Getting public resources for curriculum ID: {}", curriculumId);
        
        List<CurriculumResource> resources = curriculumResourceRepository.findByCurriculumIdAndIsPublicAndIsActive(curriculumId, true, true);
        return resources.stream()
                .map(curriculumResourceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumResourceDTO> getResourcesByLanguage(String language, Long curriculumId) {
        log.info("Getting resources by language: {} for curriculum ID: {}", language, curriculumId);
        
        List<CurriculumResource> resources = curriculumResourceRepository.findByCurriculumIdAndLanguageAndIsActive(curriculumId, language, true);
        return resources.stream()
                .map(curriculumResourceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumResourceDTO> getMostAccessedResources(Long curriculumId, int limit) {
        log.info("Getting most accessed resources for curriculum ID: {}, limit: {}", curriculumId, limit);
        
        List<CurriculumResource> resources = curriculumResourceRepository.findMostAccessedByCurriculumId(curriculumId, limit);
        return resources.stream()
                .map(curriculumResourceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumResourceDTO> getRecentlyAddedResources(Long curriculumId, int limit) {
        log.info("Getting recently added resources for curriculum ID: {}, limit: {}", curriculumId, limit);
        
        List<CurriculumResource> resources = curriculumResourceRepository.findRecentlyAddedByCurriculumId(curriculumId, limit);
        return resources.stream()
                .map(curriculumResourceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurriculumResourceDTO> getUnderutilizedResources(Long curriculumId) {
        log.info("Getting underutilized resources for curriculum ID: {}", curriculumId);
        
        List<CurriculumResource> resources = curriculumResourceRepository.findUnderutilizedByCurriculumId(curriculumId);
        return resources.stream()
                .map(curriculumResourceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CurriculumResourceDTO updateResourceMetadata(Long resourceId, CurriculumResourceDTO resourceData) {
        log.info("Updating metadata for resource ID: {}", resourceId);
        
        CurriculumResource resource = curriculumResourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + resourceId));
        
        // Update metadata fields
        resource.setTitle(resourceData.title());
        resource.setDescription(resourceData.description());
        resource.setLanguage(resourceData.language());
        resource.setCopyrightInfo(resourceData.copyrightInfo());
        resource.setLicenseType(resourceData.licenseType());
        resource.setPublic(resourceData.isPublic());
        resource.setRequiresAuthentication(resourceData.requiresAuthentication());
        
        // Update tags and accessibility features
        if (resourceData.tags() != null) {
            resource.setTags(String.join(",", resourceData.tags()));
        }
        if (resourceData.accessibilityFeatures() != null) {
            resource.setAccessibilityFeatures(String.join(",", resourceData.accessibilityFeatures()));
        }
        
        CurriculumResource savedResource = curriculumResourceRepository.save(resource);
        return curriculumResourceMapper.toDto(savedResource);
    }

    @Override
    public void deleteResource(Long resourceId) {
        log.info("Deleting resource ID: {}", resourceId);
        
        CurriculumResource resource = curriculumResourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + resourceId));
        
        // Soft delete by setting active to false
        resource.setActive(false);
        curriculumResourceRepository.save(resource);
    }

    @Override
    public void activateResource(Long resourceId) {
        log.info("Activating resource ID: {}", resourceId);
        
        CurriculumResource resource = curriculumResourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + resourceId));
        
        resource.setActive(true);
        curriculumResourceRepository.save(resource);
    }

    @Override
    public void deactivateResource(Long resourceId) {
        log.info("Deactivating resource ID: {}", resourceId);
        
        CurriculumResource resource = curriculumResourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + resourceId));
        
        resource.setActive(false);
        curriculumResourceRepository.save(resource);
    }

    @Override
    public String generateThumbnail(Long resourceId) {
        log.info("Generating thumbnail for resource ID: {}", resourceId);
        
        CurriculumResource resource = curriculumResourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + resourceId));
        
        if (isImageFile(resource.getMimeType())) {
            String thumbnailUrl = generateThumbnailUrl(resource.getUrl());
            resource.setThumbnailUrl(thumbnailUrl);
            curriculumResourceRepository.save(resource);
            return thumbnailUrl;
        }
        
        throw new IllegalArgumentException("Thumbnail generation not supported for this file type");
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateFileIntegrity(Long resourceId) {
        log.info("Validating file integrity for resource ID: {}", resourceId);
        
        CurriculumResource resource = curriculumResourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + resourceId));
        
        if (resource.getChecksum() == null || resource.getUrl() == null) {
            return false;
        }
        
        try {
            // In a real implementation, would read the actual file and calculate checksum
            // For now, return true if checksum exists
            return resource.getChecksum() != null && !resource.getChecksum().isEmpty();
        } catch (Exception e) {
            log.error("Error validating file integrity for resource {}: {}", resourceId, e.getMessage());
            return false;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public String getResourceUrl(Long resourceId, Long userId) {
        log.info("Getting resource URL for resource ID: {} and user ID: {}", resourceId, userId);
        
        CurriculumResource resource = curriculumResourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + resourceId));
        
        // Check access permissions
        if (resource.isRequiresAuthentication() && userId == null) {
            throw new IllegalArgumentException("Authentication required to access this resource");
        }
        
        if (!resource.isPublic() && !resource.isActive()) {
            throw new IllegalArgumentException("Resource is not accessible");
        }
        
        // Track access
        trackAccess(resourceId, userId);
        
        return resource.getUrl();
    }

    @Override
    public byte[] downloadResource(Long resourceId, Long userId) {
        log.info("Downloading resource ID: {} for user ID: {}", resourceId, userId);
        
        CurriculumResource resource = curriculumResourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + resourceId));
        
        // Check access permissions
        if (resource.isRequiresAuthentication() && userId == null) {
            throw new IllegalArgumentException("Authentication required to download this resource");
        }
        
        // Track download
        trackDownload(resourceId, userId);
        
        try {
            // In a real implementation, would read the actual file from storage
            // For now, return dummy data
            return "Resource content".getBytes();
        } catch (Exception e) {
            throw new RuntimeException("Failed to download resource", e);
        }
    }

    // Private helper methods
    private String saveFile(MultipartFile file, Long curriculumId) throws IOException {
        // Simplified file saving logic
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String uploadDir = "/uploads/curriculum/" + curriculumId + "/";
        Path uploadPath = Paths.get(uploadDir);
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        
        return uploadDir + fileName;
    }

    private String generateFileChecksum(byte[] fileBytes) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(fileBytes);
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating file checksum", e);
        }
    }

    private boolean isImageFile(String mimeType) {
        return mimeType != null && mimeType.startsWith("image/");
    }

    private String generateThumbnailUrl(String originalUrl) {
        // Simplified thumbnail generation
        return originalUrl.replace("/uploads/", "/thumbnails/") + "_thumb.jpg";
    }

    @Override
    protected Long extractSchoolId(CurriculumResource entity) {
        // Extract school from curriculum's school
        return entity.getCurriculum() != null && entity.getCurriculum().getSchool() != null 
            ? entity.getCurriculum().getSchool().getId() : null;
    }
    
    @Override
    protected Long extractRegionId(CurriculumResource entity) {
        // Extract region from curriculum's region or school's region
        if (entity.getCurriculum() != null && entity.getCurriculum().getRegion() != null) {
            return entity.getCurriculum().getRegion().getId();
        }
        if (entity.getCurriculum() != null && entity.getCurriculum().getSchool() != null && entity.getCurriculum().getSchool().getRegion() != null) {
            return entity.getCurriculum().getSchool().getRegion().getId();
        }
        return null;
    }
} 
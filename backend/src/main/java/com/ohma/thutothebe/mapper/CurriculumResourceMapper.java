package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CurriculumResourceDTO;
import com.ohma.thutothebe.entity.CurriculumResource;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class CurriculumResourceMapper implements BaseDtoMapper<CurriculumResource, CurriculumResourceDTO> {

    @Override
    public CurriculumResourceDTO toDto(CurriculumResource entity) {
        if (entity == null) {
            return null;
        }

        List<String> tags = null;
        if (entity.getTags() != null && !entity.getTags().isEmpty()) {
            tags = Arrays.asList(entity.getTags().split(","));
        }

        List<String> accessibilityFeatures = null;
        if (entity.getAccessibilityFeatures() != null && !entity.getAccessibilityFeatures().isEmpty()) {
            accessibilityFeatures = Arrays.asList(entity.getAccessibilityFeatures().split(","));
        }

        return new CurriculumResourceDTO(
                entity.getId(),
                entity.getCurriculum() != null ? entity.getCurriculum().getId() : null,
                entity.getCurriculum() != null ? entity.getCurriculum().getTitle() : null,
                entity.getCurriculumUnit() != null ? entity.getCurriculumUnit().getId() : null,
                entity.getCurriculumUnit() != null ? entity.getCurriculumUnit().getTitle() : null,
                entity.getCurriculumTopic() != null ? entity.getCurriculumTopic().getId() : null,
                entity.getCurriculumTopic() != null ? entity.getCurriculumTopic().getTitle() : null,
                entity.getTitle(),
                entity.getDescription(),
                entity.getResourceType(),
                entity.getUrl(),
                entity.getFileName(),
                entity.getFileSize(),
                entity.getMimeType(),
                entity.getThumbnailUrl(),
                entity.getDurationMinutes(),
                entity.getLanguage(),
                accessibilityFeatures,
                tags,
                entity.getMetadata(),
                entity.getUploadedBy() != null ? entity.getUploadedBy().getId() : null,
                entity.getUploadedBy() != null ? 
                    entity.getUploadedBy().getFirstName() + " " + entity.getUploadedBy().getLastName() : null,
                entity.getUploadedAt(),
                entity.getLastAccessedAt(),
                entity.getAccessCount(),
                entity.getDownloadCount(),
                entity.isPublic(),
                entity.isRequiresAuthentication(),
                entity.getCopyrightInfo(),
                entity.getLicenseType(),
                entity.getExternalId(),
                entity.getChecksum(),
                entity.isActive()
        );
    }

    @Override
    public CurriculumResource toEntity(CurriculumResourceDTO dto) {
        if (dto == null) {
            return null;
        }

        CurriculumResource entity = new CurriculumResource();
        entity.setId(dto.id());
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setResourceType(dto.resourceType());
        entity.setUrl(dto.url());
        entity.setFileName(dto.fileName());
        entity.setFileSize(dto.fileSize());
        entity.setMimeType(dto.mimeType());
        entity.setThumbnailUrl(dto.thumbnailUrl());
        entity.setDurationMinutes(dto.durationMinutes());
        entity.setLanguage(dto.language());
        entity.setMetadata(dto.metadata());
        entity.setUploadedAt(dto.uploadedAt());
        entity.setLastAccessedAt(dto.lastAccessedAt());
        entity.setAccessCount(dto.accessCount() != null ? dto.accessCount() : 0L);
        entity.setDownloadCount(dto.downloadCount() != null ? dto.downloadCount() : 0L);
        entity.setPublic(dto.isPublic());
        entity.setRequiresAuthentication(dto.requiresAuthentication());
        entity.setCopyrightInfo(dto.copyrightInfo());
        entity.setLicenseType(dto.licenseType());
        entity.setExternalId(dto.externalId());
        entity.setChecksum(dto.checksum());
        entity.setActive(dto.isActive());

        // Convert lists to strings
        if (dto.tags() != null && !dto.tags().isEmpty()) {
            entity.setTags(String.join(",", dto.tags()));
        }
        if (dto.accessibilityFeatures() != null && !dto.accessibilityFeatures().isEmpty()) {
            entity.setAccessibilityFeatures(String.join(",", dto.accessibilityFeatures()));
        }

        return entity;
    }

    public void updateEntity(CurriculumResource entity, CurriculumResourceDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setResourceType(dto.resourceType());
        entity.setUrl(dto.url());
        entity.setFileName(dto.fileName());
        entity.setFileSize(dto.fileSize());
        entity.setMimeType(dto.mimeType());
        entity.setThumbnailUrl(dto.thumbnailUrl());
        entity.setDurationMinutes(dto.durationMinutes());
        entity.setLanguage(dto.language());
        entity.setMetadata(dto.metadata());
        entity.setPublic(dto.isPublic());
        entity.setRequiresAuthentication(dto.requiresAuthentication());
        entity.setCopyrightInfo(dto.copyrightInfo());
        entity.setLicenseType(dto.licenseType());
        entity.setExternalId(dto.externalId());
        entity.setChecksum(dto.checksum());
        entity.setActive(dto.isActive());

        // Convert lists to strings
        if (dto.tags() != null && !dto.tags().isEmpty()) {
            entity.setTags(String.join(",", dto.tags()));
        } else {
            entity.setTags(null);
        }
        
        if (dto.accessibilityFeatures() != null && !dto.accessibilityFeatures().isEmpty()) {
            entity.setAccessibilityFeatures(String.join(",", dto.accessibilityFeatures()));
        } else {
            entity.setAccessibilityFeatures(null);
        }
    }
} 
package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CurriculumVersionDTO;
import com.ohma.thutothebe.entity.CurriculumVersion;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class CurriculumVersionMapper implements BaseDtoMapper<CurriculumVersion, CurriculumVersionDTO> {

    @Override
    public CurriculumVersionDTO toDto(CurriculumVersion entity) {
        if (entity == null) {
            return null;
        }

        List<String> tags = null;
        if (entity.getTags() != null && !entity.getTags().isEmpty()) {
            // Simple parsing - in real implementation would use JSON parser
            tags = Arrays.asList(entity.getTags().split(","));
        }

        return new CurriculumVersionDTO(
                entity.getId(),
                entity.getCurriculum() != null ? entity.getCurriculum().getId() : null,
                entity.getCurriculum() != null ? entity.getCurriculum().getTitle() : null,
                entity.getVersionNumber(),
                entity.getVersionName(),
                entity.getDescription(),
                entity.getSnapshotData(),
                entity.getCreatedBy() != null ? entity.getCreatedBy().getId() : null,
                entity.getCreatedBy() != null ? 
                    entity.getCreatedBy().getFirstName() + " " + entity.getCreatedBy().getLastName() : null,
                entity.getCreatedAt(),
                entity.getChangeSummary(),
                entity.isMajorVersion(),
                entity.isCurrent(),
                tags,
                entity.getFilePath(),
                entity.getChecksum()
        );
    }

    @Override
    public CurriculumVersion toEntity(CurriculumVersionDTO dto) {
        if (dto == null) {
            return null;
        }

        CurriculumVersion entity = new CurriculumVersion();
        entity.setId(dto.id());
        entity.setVersionNumber(dto.versionNumber());
        entity.setVersionName(dto.versionName());
        entity.setDescription(dto.description());
        entity.setSnapshotData(dto.snapshotData());
        entity.setCreatedAt(dto.createdAt());
        entity.setChangeSummary(dto.changeSummary());
        entity.setMajorVersion(dto.isMajorVersion());
        entity.setCurrent(dto.isCurrent());
        entity.setFilePath(dto.filePath());
        entity.setChecksum(dto.checksum());

        // Convert tags list to string
        if (dto.tags() != null && !dto.tags().isEmpty()) {
            entity.setTags(String.join(",", dto.tags()));
        }

        return entity;
    }

    
    public void updateEntity(CurriculumVersion entity, CurriculumVersionDTO dto) {
        if (entity == null || dto == null) {
            return;
        }

        entity.setVersionName(dto.versionName());
        entity.setDescription(dto.description());
        entity.setSnapshotData(dto.snapshotData());
        entity.setChangeSummary(dto.changeSummary());
        entity.setMajorVersion(dto.isMajorVersion());
        entity.setCurrent(dto.isCurrent());
        entity.setFilePath(dto.filePath());
        entity.setChecksum(dto.checksum());

        // Convert tags list to string
        if (dto.tags() != null && !dto.tags().isEmpty()) {
            entity.setTags(String.join(",", dto.tags()));
        } else {
            entity.setTags(null);
        }
    }
} 
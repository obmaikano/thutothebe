package com.ohma.thutothebe.mapper.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohma.thutothebe.dto.AnnouncementDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.mapper.AnnouncementMapper;
import com.ohma.thutothebe.repository.AnnouncementAcknowledgmentRepository;
import com.ohma.thutothebe.repository.AnnouncementReadReceiptRepository;
import com.ohma.thutothebe.repository.RegionRepository;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AnnouncementMapperImpl implements AnnouncementMapper {

    private final UserRepository userRepository;
    private final RegionRepository regionRepository;
    private final SchoolRepository schoolRepository;
    private final AnnouncementReadReceiptRepository readReceiptRepository;
    private final AnnouncementAcknowledgmentRepository acknowledgmentRepository;
    private final ObjectMapper objectMapper;

    @Override
    public AnnouncementDTO toDto(Announcement entity) {
        if (entity == null) {
            return null;
        }

        return new AnnouncementDTO(
            entity.getId(),
            entity.getTitle(),
            entity.getContent(),
            entity.getType(),
            entity.getPriority(),
            entity.getCreator() != null ? entity.getCreator().getId() : null,
            entity.getCreator() != null ? entity.getCreator().getFirstName() + " " + entity.getCreator().getLastName() : null,
            entity.getCreatorRole(),
            entity.getTargetRegion() != null ? entity.getTargetRegion().getId() : null,
            entity.getTargetRegion() != null ? entity.getTargetRegion().getName() : null,
            entity.getTargetSchool() != null ? entity.getTargetSchool().getId() : null,
            entity.getTargetSchool() != null ? entity.getTargetSchool().getName() : null,
            entity.getTargetRole(),
            entity.getTargetDepartment(),
            entity.getTargetClass(),
            entity.getStartDate(),
            entity.getEndDate(),
            entity.isCommentsEnabled(),
            entity.isAcknowledgmentRequired(),
            parseJsonToList(entity.getAttachmentUrls()),
            parseJsonToList(entity.getTags()),
            entity.isActive(),
            entity.getCreatedAt(),
            entity.getModifiedAt(),
            (long) entity.getReadReceipts().size(),
            (long) entity.getAcknowledgments().size(),
            null, // targetUserCount - to be calculated separately if needed
            null, // isRead - to be set separately if needed
            null  // isAcknowledged - to be set separately if needed
        );
    }

    @Override
    public Announcement toEntity(AnnouncementDTO dto) {
        if (dto == null) {
            return null;
        }

        Announcement entity = new Announcement();
        updateEntityFromDto(dto, entity);
        return entity;
    }

    @Override
    public void updateEntityFromDto(AnnouncementDTO dto, Announcement entity) {
        entity.setTitle(dto.title());
        entity.setContent(dto.content());
        entity.setType(dto.type());
        entity.setPriority(dto.priority());
        entity.setCreatorRole(dto.creatorRole());
        entity.setTargetRole(dto.targetRole());
        entity.setTargetDepartment(dto.targetDepartment());
        entity.setTargetClass(dto.targetClass());
        entity.setStartDate(dto.startDate());
        entity.setEndDate(dto.endDate());
        entity.setCommentsEnabled(dto.commentsEnabled());
        entity.setAcknowledgmentRequired(dto.acknowledgmentRequired());
        entity.setAttachmentUrls(listToJson(dto.attachmentUrls()));
        entity.setTags(listToJson(dto.tags()));
        entity.setActive(dto.active());

        // Set relationships
        if (dto.creatorId() != null) {
            userRepository.findById(dto.creatorId()).ifPresent(entity::setCreator);
        }
        
        if (dto.targetRegionId() != null) {
            regionRepository.findById(dto.targetRegionId()).ifPresent(entity::setTargetRegion);
        } else {
            entity.setTargetRegion(null);
        }
        
        if (dto.targetSchoolId() != null) {
            schoolRepository.findById(dto.targetSchoolId()).ifPresent(entity::setTargetSchool);
        } else {
            entity.setTargetSchool(null);
        }
    }

    @Override
    public AnnouncementDTO toDtoWithUserStatus(Announcement entity, Long userId) {
        AnnouncementDTO baseDto = toDto(entity);
        
        if (userId == null) {
            return baseDto;
        }

        boolean isRead = readReceiptRepository.existsByAnnouncementIdAndUserId(entity.getId(), userId);
        boolean isAcknowledged = acknowledgmentRepository.existsByAnnouncementIdAndUserId(entity.getId(), userId);

        return new AnnouncementDTO(
            baseDto.id(),
            baseDto.title(),
            baseDto.content(),
            baseDto.type(),
            baseDto.priority(),
            baseDto.creatorId(),
            baseDto.creatorName(),
            baseDto.creatorRole(),
            baseDto.targetRegionId(),
            baseDto.targetRegionName(),
            baseDto.targetSchoolId(),
            baseDto.targetSchoolName(),
            baseDto.targetRole(),
            baseDto.targetDepartment(),
            baseDto.targetClass(),
            baseDto.startDate(),
            baseDto.endDate(),
            baseDto.commentsEnabled(),
            baseDto.acknowledgmentRequired(),
            baseDto.attachmentUrls(),
            baseDto.tags(),
            baseDto.active(),
            baseDto.createdAt(),
            baseDto.modifiedAt(),
            baseDto.readCount(),
            baseDto.acknowledgmentCount(),
            baseDto.targetUserCount(),
            isRead,
            isAcknowledged
        );
    }

    private List<String> parseJsonToList(String json) {
        if (json == null || json.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            log.warn("Failed to parse JSON to list: {}", json, e);
            return new ArrayList<>();
        }
    }

    private String listToJson(List<String> list) {
        if (list == null || list.isEmpty()) {
            return null;
        }
        
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            log.warn("Failed to convert list to JSON: {}", list, e);
            return null;
        }
    }
} 
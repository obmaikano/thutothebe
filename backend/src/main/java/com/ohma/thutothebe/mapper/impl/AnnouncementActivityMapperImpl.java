package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.AnnouncementActivityDto;
import com.ohma.thutothebe.entity.Announcement;
import com.ohma.thutothebe.entity.AnnouncementActivity;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.AnnouncementActivityMapper;
import com.ohma.thutothebe.repository.AnnouncementRepository;
import com.ohma.thutothebe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AnnouncementActivityMapperImpl implements AnnouncementActivityMapper {

    private final UserRepository userRepository;
    private final AnnouncementRepository announcementRepository;

    @Override
    public AnnouncementActivityDto toDto(AnnouncementActivity entity) {
        if (entity == null) {
            return null;
        }

        AnnouncementActivityDto dto = new AnnouncementActivityDto();
        dto.setId(entity.getId());
        dto.setType(entity.getType());
        dto.setAnnouncementId(entity.getAnnouncement().getId());
        dto.setUserId(entity.getUser().getId());
        dto.setUserName(entity.getUser().getFirstName() + " " + entity.getUser().getLastName());
        dto.setUserRole(entity.getUser().getRole().name());
        dto.setDetails(entity.getDetails());
        dto.setActive(entity.isActive());
        dto.setTimestamp(entity.getCreatedAt());

        return dto;
    }

    @Override
    public AnnouncementActivity toEntity(AnnouncementActivityDto dto) {
        if (dto == null) {
            return null;
        }

        AnnouncementActivity entity = new AnnouncementActivity();
        entity.setId(dto.getId());
        entity.setType(dto.getType());
        entity.setDetails(dto.getDetails());
        entity.setActive(dto.isActive());

        // Set announcement
        if (dto.getAnnouncementId() != null) {
            Announcement announcement = announcementRepository.findById(dto.getAnnouncementId())
                    .orElseThrow(() -> new RuntimeException("Announcement not found with id: " + dto.getAnnouncementId()));
            entity.setAnnouncement(announcement);
        }

        // Set user
        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getUserId()));
            entity.setUser(user);
        }

        return entity;
    }
} 
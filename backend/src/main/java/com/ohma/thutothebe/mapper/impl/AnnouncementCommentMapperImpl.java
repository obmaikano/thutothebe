package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.AnnouncementCommentDto;
import com.ohma.thutothebe.entity.Announcement;
import com.ohma.thutothebe.entity.AnnouncementComment;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.AnnouncementCommentMapper;
import com.ohma.thutothebe.repository.AnnouncementRepository;
import com.ohma.thutothebe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AnnouncementCommentMapperImpl implements AnnouncementCommentMapper {

    private final UserRepository userRepository;
    private final AnnouncementRepository announcementRepository;

    @Override
    public AnnouncementCommentDto toDto(AnnouncementComment entity) {
        if (entity == null) {
            return null;
        }

        AnnouncementCommentDto dto = new AnnouncementCommentDto();
        dto.setId(entity.getId());
        dto.setContent(entity.getContent());
        dto.setAnnouncementId(entity.getAnnouncement().getId());
        dto.setAuthorId(entity.getAuthor().getId());
        dto.setAuthorName(entity.getAuthor().getFirstName() + " " + entity.getAuthor().getLastName());
        dto.setAuthorRole(entity.getAuthor().getRole().name());
        dto.setParentCommentId(entity.getParentComment() != null ? entity.getParentComment().getId() : null);
        dto.setLikes(entity.getLikeCount());
        dto.setActive(entity.isActive());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setModifiedAt(entity.getModifiedAt());

        // Convert replies
        if (entity.getReplies() != null && !entity.getReplies().isEmpty()) {
            dto.setReplies(entity.getReplies().stream()
                    .filter(AnnouncementComment::isActive)
                    .map(this::toDto)
                    .collect(Collectors.toList()));
        } else {
            dto.setReplies(new ArrayList<>());
        }

        return dto;
    }

    @Override
    public AnnouncementComment toEntity(AnnouncementCommentDto dto) {
        if (dto == null) {
            return null;
        }

        AnnouncementComment entity = new AnnouncementComment();
        entity.setId(dto.getId());
        entity.setContent(dto.getContent());
        entity.setActive(dto.isActive());

        // Set announcement
        if (dto.getAnnouncementId() != null) {
            Announcement announcement = announcementRepository.findById(dto.getAnnouncementId())
                    .orElseThrow(() -> new RuntimeException("Announcement not found with id: " + dto.getAnnouncementId()));
            entity.setAnnouncement(announcement);
        }

        // Set author
        if (dto.getAuthorId() != null) {
            User author = userRepository.findById(dto.getAuthorId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getAuthorId()));
            entity.setAuthor(author);
        }

        return entity;
    }
} 
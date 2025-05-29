package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.AnnouncementActivityType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AnnouncementActivityDto {
    private Long id;
    private AnnouncementActivityType type;
    private Long announcementId;
    private Long userId;
    private String userName;
    private String userRole;
    private String details;
    private boolean active;
    private LocalDateTime timestamp;
} 
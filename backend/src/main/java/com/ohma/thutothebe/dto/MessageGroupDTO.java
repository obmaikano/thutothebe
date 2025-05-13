package com.ohma.thutothebe.dto;

import java.util.Set;

public record MessageGroupDTO(
    Long id,
    String name,
    String description,
    Long creatorId,
    Set<Long> memberIds,
    boolean active
) {
    public MessageGroupDTO {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Group name cannot be null or blank");
        }
        if (creatorId == null) {
            throw new IllegalArgumentException("Creator ID cannot be null");
        }
        if (memberIds == null || memberIds.isEmpty()) {
            throw new IllegalArgumentException("Group must have at least one member");
        }
    }
} 
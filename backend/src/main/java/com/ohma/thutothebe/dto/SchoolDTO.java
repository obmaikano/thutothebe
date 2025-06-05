package com.ohma.thutothebe.dto;

public record SchoolDTO(
    Long id,
    String code,
    String name,
    String description,
    Long regionId,
    Long schoolHeadId,
    String schoolHeadName,
    boolean active
) {
    public SchoolDTO {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("School code cannot be null or blank");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("School name cannot be null or blank");
        }
        if (regionId == null) {
            throw new IllegalArgumentException("Region ID cannot be null");
        }
    }
} 
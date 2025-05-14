package com.ohma.thutothebe.dto;

public record RegionDTO(
    Long id,
    String code,
    String name,
    String description,
    boolean active
) {
    public RegionDTO {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Region code cannot be null or blank");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Region name cannot be null or blank");
        }
    }
} 
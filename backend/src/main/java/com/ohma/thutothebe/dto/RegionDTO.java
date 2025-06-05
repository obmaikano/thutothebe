package com.ohma.thutothebe.dto;

public record RegionDTO(
    Long id,
    String code,
    String name,
    String description,
    boolean active,
    Long schoolCount,
    Long activeSchoolCount
) {
    public RegionDTO {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Region code cannot be null or blank");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Region name cannot be null or blank");
        }
    }

    public RegionDTO withSchoolCount(Long schoolCount) {
        return new RegionDTO(id, code, name, description, active, schoolCount, activeSchoolCount);
    }

    public RegionDTO withActiveSchoolCount(Long activeSchoolCount) {
        return new RegionDTO(id, code, name, description, active, schoolCount, activeSchoolCount);
    }
} 
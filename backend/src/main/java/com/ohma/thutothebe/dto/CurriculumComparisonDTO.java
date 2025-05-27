package com.ohma.thutothebe.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record CurriculumComparisonDTO(
    Long sourceVersionId,
    String sourceVersionName,
    LocalDateTime sourceCreatedAt,
    
    Long targetVersionId,
    String targetVersionName,
    LocalDateTime targetCreatedAt,
    
    List<ChangeDetail> changes,
    ComparisonSummary summary,
    LocalDateTime comparedAt,
    String comparedBy
) {
    
    public record ChangeDetail(
        String section,
        String field,
        ChangeType changeType,
        String oldValue,
        String newValue,
        String description
    ) {}
    
    public record ComparisonSummary(
        int totalChanges,
        int additions,
        int modifications,
        int deletions,
        List<String> affectedSections,
        boolean hasStructuralChanges,
        boolean hasContentChanges,
        double similarityPercentage
    ) {}
    
    public enum ChangeType {
        ADDED,
        MODIFIED,
        DELETED,
        MOVED,
        RENAMED
    }
} 
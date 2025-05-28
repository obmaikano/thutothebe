package com.ohma.thutothebe.entity.enums;

public enum GradingStatus {
    PENDING,           // Not yet graded
    AUTO_COMPLETE,     // Automatic grading completed
    PENDING_MANUAL,    // Waiting for manual grading
    MANUAL_COMPLETE,   // Manual grading completed
    COMPLETE,          // All grading completed
    REQUIRES_REVIEW    // Needs additional review
} 
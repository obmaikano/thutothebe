package com.ohma.thutothebe.entity;

public enum CalendarEventStatus {
    DRAFT,          // Event is being created/edited
    PENDING_APPROVAL, // Event requires approval before being published
    SCHEDULED,      // Event is confirmed and scheduled
    ONGOING,        // Event is currently happening
    COMPLETED,      // Event has finished successfully
    CANCELLED,      // Event has been cancelled
    POSTPONED,      // Event has been postponed to a later date
    RESCHEDULED,    // Event has been moved to a different time
    SUSPENDED       // Event is temporarily suspended
} 
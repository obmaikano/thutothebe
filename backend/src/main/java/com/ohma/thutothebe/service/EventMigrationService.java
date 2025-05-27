package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CalendarEventDTO;

import java.util.List;

public interface EventMigrationService {
    
    /**
     * Migrate all existing Event entities to CalendarEvent entities
     * @return List of migrated CalendarEventDTO objects
     */
    List<CalendarEventDTO> migrateAllEvents();
    
    /**
     * Migrate a specific Event by ID to CalendarEvent
     * @param eventId The ID of the Event to migrate
     * @return The migrated CalendarEventDTO
     */
    CalendarEventDTO migrateEvent(Long eventId);
    
    /**
     * Check if migration is needed (if there are unmigrated events)
     * @return true if migration is needed, false otherwise
     */
    boolean isMigrationNeeded();
    
    /**
     * Get count of events that need migration
     * @return Number of events that need migration
     */
    long getUnmigratedEventCount();
    
    /**
     * Validate migration results
     * @return true if migration was successful, false otherwise
     */
    boolean validateMigration();
    
    /**
     * Rollback migration (for testing purposes)
     */
    void rollbackMigration();
} 
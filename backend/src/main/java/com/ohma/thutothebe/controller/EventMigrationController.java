package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.CalendarEventDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.service.EventMigrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/event-migration")
@Tag(name = "Event Migration", description = "APIs for migrating Event entities to CalendarEvent entities")
public class EventMigrationController {

    private final EventMigrationService eventMigrationService;

    @Autowired
    public EventMigrationController(EventMigrationService eventMigrationService) {
        this.eventMigrationService = eventMigrationService;
    }

    @GetMapping("/status")
    @Operation(summary = "Check migration status")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE')")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getMigrationStatus() {
        try {
            boolean migrationNeeded = eventMigrationService.isMigrationNeeded();
            long unmigratedCount = eventMigrationService.getUnmigratedEventCount();
            
            Map<String, Object> status = Map.of(
                "migrationNeeded", migrationNeeded,
                "unmigratedEventCount", unmigratedCount,
                "message", migrationNeeded ? 
                    "Migration needed: " + unmigratedCount + " events to migrate" : 
                    "No migration needed"
            );
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Migration status retrieved", status, null));
        } catch (Exception e) {
            log.error("Error checking migration status: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/migrate-all")
    @Operation(summary = "Migrate all Event entities to CalendarEvent entities")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE')")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> migrateAllEvents() {
        try {
            log.info("Starting migration of all events");
            List<CalendarEventDTO> migratedEvents = eventMigrationService.migrateAllEvents();
            
            String message = String.format("Successfully migrated %d events to CalendarEvent entities", 
                migratedEvents.size());
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", message, migratedEvents, null));
        } catch (Exception e) {
            log.error("Error during event migration: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/migrate/{eventId}")
    @Operation(summary = "Migrate a specific Event by ID")
    @Parameter(name = "eventId", description = "ID of the Event to migrate")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE') or hasRole('REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> migrateEvent(@PathVariable Long eventId) {
        try {
            log.info("Migrating event with ID: {}", eventId);
            CalendarEventDTO migratedEvent = eventMigrationService.migrateEvent(eventId);
            
            String message = String.format("Successfully migrated event ID %d to CalendarEvent", eventId);
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", message, migratedEvent, null));
        } catch (Exception e) {
            log.error("Error migrating event {}: {}", eventId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/validate")
    @Operation(summary = "Validate migration results")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('MINISTRY_EXECUTIVE')")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> validateMigration() {
        try {
            boolean isValid = eventMigrationService.validateMigration();
            
            Map<String, Object> validation = Map.of(
                "isValid", isValid,
                "message", isValid ? 
                    "Migration validation successful" : 
                    "Migration validation failed"
            );
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Migration validation completed", validation, null));
        } catch (Exception e) {
            log.error("Error validating migration: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/rollback")
    @Operation(summary = "Rollback migration (WARNING: This will delete migrated CalendarEvent entities)")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<OhmaApiResponse<String>> rollbackMigration() {
        try {
            log.warn("Rolling back event migration - this is a destructive operation");
            eventMigrationService.rollbackMigration();
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", 
                "Migration rollback completed successfully", 
                "All migrated CalendarEvent entities have been deleted", null));
        } catch (Exception e) {
            log.error("Error during migration rollback: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 
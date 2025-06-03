package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.CalendarEventDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.EventMigrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/event-migration")
@Tag(name = "Event Migration", description = "APIs for migrating Event entities to CalendarEvent entities")
public class EventMigrationController extends BaseController<CalendarEventDTO, Long> {

    private final EventMigrationService eventMigrationService;

    @Autowired
    public EventMigrationController(EventMigrationService eventMigrationService) {
        super(null); // EventMigrationController doesn't use standard CRUD operations
        this.eventMigrationService = eventMigrationService;
    }

    @GetMapping("/status")
    @Operation(summary = "Check migration status")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getMigrationStatus() {
        try {
            // Get current user ID from authentication context
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access for migration operations
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view migration status", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> migrateAllEvents() {
        try {
            // Get current user ID from authentication context
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access for migration operations
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to perform migration", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> migrateEvent(@PathVariable Long eventId) {
        try {
            // Get current user ID from authentication context
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has regional or global admin access for single event migration
            if (!hasAccess(AccessScope.REGION, null) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to migrate events", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> validateMigration() {
        try {
            // Get current user ID from authentication context
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access for migration validation
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to validate migration", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<String>> rollbackMigration() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access for migration rollback (highest privilege required)
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to rollback migration", null, null));
            }

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
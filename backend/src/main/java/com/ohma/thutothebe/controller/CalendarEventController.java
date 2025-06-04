package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.CalendarEventDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.CalendarEvent;
import com.ohma.thutothebe.entity.CalendarEventType;
import com.ohma.thutothebe.entity.CalendarEventScope;
import com.ohma.thutothebe.entity.CalendarEventStatus;
import com.ohma.thutothebe.entity.CalendarEventPriority;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.service.CalendarEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/calendar-events")
@Tag(name = "Calendar Event Management", description = "APIs for managing school calendar events")
public class CalendarEventController extends BaseController<CalendarEventDTO, Long> {

    private final CalendarEventService calendarEventService;

    public CalendarEventController(CalendarEventService calendarEventService) {
        super(calendarEventService);
        this.calendarEventService = calendarEventService;
    }

    // ==================== SECURE OVERRIDE METHODS ====================
    
    @Override
    @GetMapping
    @Operation(summary = "Get all calendar events with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getAll() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CalendarEventDTO> events = calendarEventService.getCalendarEventsByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving calendar events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @GetMapping("/{id}")
    @Operation(summary = "Get calendar event by ID with access validation")
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> getById(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before retrieving
            if (!calendarEventService.validateCalendarEventAccess(id, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to calendar event", null, null));
            }

            CalendarEventDTO event = calendarEventService.getById(id);
            if (event == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar event retrieved successfully", event, null));
        } catch (Exception e) {
            log.error("Error retrieving calendar event: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    @Operation(summary = "Create calendar event with business rule validation")
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> create(@Valid @RequestBody CalendarEventDTO calendarEventDTO) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate business rules before creation
            if (!calendarEventService.validateCalendarEventBusinessRules(calendarEventDTO, currentUserId)) {
                return ResponseEntity.badRequest()
                        .body(new OhmaApiResponse<>("ERROR", "Calendar event validation failed", null, null));
            }

            CalendarEventDTO createdEvent = calendarEventService.create(calendarEventDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new OhmaApiResponse<>("SUCCESS", "Calendar event created successfully", createdEvent, null));
        } catch (Exception e) {
            log.error("Error creating calendar event: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    @Operation(summary = "Update calendar event with access validation")
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> update(@PathVariable Long id, @Valid @RequestBody CalendarEventDTO calendarEventDTO) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before updating
            if (!calendarEventService.validateCalendarEventAccess(id, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to update calendar event", null, null));
            }

            CalendarEventDTO updatedEvent = calendarEventService.update(id, calendarEventDTO);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar event updated successfully", updatedEvent, null));
        } catch (Exception e) {
            log.error("Error updating calendar event: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete calendar event with access validation")
    public ResponseEntity<OhmaApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Validate access before deleting
            if (!calendarEventService.validateCalendarEventAccess(id, currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to delete calendar event", null, null));
            }

            calendarEventService.delete(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar event deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting calendar event: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== SECURE MULTI-TENANT ENDPOINTS ====================

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get calendar events by school with access validation")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsBySchool(@PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CalendarEventDTO> events = calendarEventService.getCalendarEventsBySchoolIdAndAccessibleScopes(schoolId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School calendar events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving school calendar events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}")
    @Operation(summary = "Get calendar events by region with access validation")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsByRegion(@PathVariable Long regionId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CalendarEventDTO> events = calendarEventService.getCalendarEventsByRegionIdAndAccessibleScopes(regionId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Region calendar events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving region calendar events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get calendar events by type with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsByType(@PathVariable CalendarEventType type) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CalendarEventDTO> events = calendarEventService.getCalendarEventsByTypeAndAccessibleScopes(type, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar events by type retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving calendar events by type: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/priority/{priority}")
    @Operation(summary = "Get calendar events by priority with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsByPriority(@PathVariable CalendarEventPriority priority) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CalendarEventDTO> events = calendarEventService.getCalendarEventsByPriorityAndAccessibleScopes(priority, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar events by priority retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving calendar events by priority: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get calendar events by status with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsByStatus(@PathVariable CalendarEventStatus status) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CalendarEventDTO> events = calendarEventService.getCalendarEventsByStatusAndAccessibleScopes(status, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar events by status retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving calendar events by status: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/creator/{creatorId}")
    @Operation(summary = "Get calendar events by creator with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsByCreator(@PathVariable Long creatorId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CalendarEventDTO> events = calendarEventService.getCalendarEventsByCreatorIdAndAccessibleScopes(creatorId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar events by creator retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving calendar events by creator: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get calendar events by course with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsByCourse(@PathVariable Long courseId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CalendarEventDTO> events = calendarEventService.getCalendarEventsByCourseIdAndAccessibleScopes(courseId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course calendar events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving course calendar events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get calendar events by class with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsByClass(@PathVariable Long classId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CalendarEventDTO> events = calendarEventService.getCalendarEventsByClassIdAndAccessibleScopes(classId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class calendar events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving class calendar events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get calendar events by date range with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CalendarEventDTO> events = calendarEventService.getCalendarEventsByDateRangeAndAccessibleScopes(startDate, endDate, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar events by date range retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving calendar events by date range: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming calendar events with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getUpcomingEvents(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            LocalDateTime startDate = fromDate != null ? fromDate : LocalDateTime.now();
            List<CalendarEventDTO> events = calendarEventService.getUpcomingCalendarEventsByAccessibleScopes(startDate, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Upcoming calendar events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving upcoming calendar events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/ongoing")
    @Operation(summary = "Get ongoing calendar events with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getOngoingEvents() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CalendarEventDTO> events = calendarEventService.getOngoingCalendarEventsByAccessibleScopes(LocalDateTime.now(), currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Ongoing calendar events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving ongoing calendar events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Search calendar events by title with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> searchEventsByTitle(@RequestParam String title) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CalendarEventDTO> events = calendarEventService.searchCalendarEventsByTitleAndAccessibleScopes(title, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar events search completed successfully", events, null));
        } catch (Exception e) {
            log.error("Error searching calendar events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/public")
    @Operation(summary = "Get public calendar events with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getPublicEvents() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CalendarEventDTO> events = calendarEventService.getPublicCalendarEventsByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Public calendar events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving public calendar events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/recurring")
    @Operation(summary = "Get recurring calendar events with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getRecurringEvents() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<CalendarEventDTO> events = calendarEventService.getRecurringCalendarEventsByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Recurring calendar events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving recurring calendar events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== STATISTICS ENDPOINTS ====================

    @GetMapping("/statistics/count")
    @Operation(summary = "Get calendar event count with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<Long>> getEventCount() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long count = calendarEventService.getCalendarEventCountByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar event count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving calendar event count: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/count/type/{type}")
    @Operation(summary = "Get calendar event count by type with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<Long>> getEventCountByType(@PathVariable CalendarEventType type) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long count = calendarEventService.getCalendarEventCountByTypeAndAccessibleScopes(type, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar event count by type retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving calendar event count by type: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/count/status/{status}")
    @Operation(summary = "Get calendar event count by status with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<Long>> getEventCountByStatus(@PathVariable CalendarEventStatus status) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long count = calendarEventService.getCalendarEventCountByStatusAndAccessibleScopes(status, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar event count by status retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving calendar event count by status: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/count/priority/{priority}")
    @Operation(summary = "Get calendar event count by priority with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<Long>> getEventCountByPriority(@PathVariable CalendarEventPriority priority) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long count = calendarEventService.getCalendarEventCountByPriorityAndAccessibleScopes(priority, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar event count by priority retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving calendar event count by priority: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/count/creator/{creatorId}")
    @Operation(summary = "Get calendar event count by creator with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<Long>> getEventCountByCreator(@PathVariable Long creatorId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long count = calendarEventService.getCalendarEventCountByCreatorIdAndAccessibleScopes(creatorId, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar event count by creator retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving calendar event count by creator: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/count/upcoming")
    @Operation(summary = "Get upcoming calendar event count with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<Long>> getUpcomingEventCount(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            LocalDateTime startDate = fromDate != null ? fromDate : LocalDateTime.now();
            Long count = calendarEventService.getUpcomingCalendarEventCountByAccessibleScopes(startDate, currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Upcoming calendar event count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving upcoming calendar event count: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/count/public")
    @Operation(summary = "Get public calendar event count with multi-tenant security")
    public ResponseEntity<OhmaApiResponse<Long>> getPublicEventCount() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Long count = calendarEventService.getPublicCalendarEventCountByAccessibleScopes(currentUserId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Public calendar event count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving public calendar event count: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // ==================== EXISTING METHODS (Updated for Security) ====================

    @GetMapping("/date-range-pageable")
    @Operation(summary = "Get events between dates with pagination")
    public ResponseEntity<OhmaApiResponse<Page<CalendarEventDTO>>> getEventsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            Pageable pageable) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            Page<CalendarEventDTO> events = calendarEventService.getEventsBetweenDates(startTime, endTime, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving events between dates: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Continue with existing methods but add access validation...
    // ... existing code ...
} 
package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.CalendarEventDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.CalendarEventType;
import com.ohma.thutothebe.entity.CalendarEventScope;
import com.ohma.thutothebe.entity.CalendarEventStatus;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.service.CalendarEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/calendar-events")
@Tag(name = "Calendar Event Management", description = "APIs for managing school calendar events")
public class CalendarEventController extends BaseController<CalendarEventDTO, Long> {

    private final CalendarEventService calendarEventService;

    public CalendarEventController(CalendarEventService calendarEventService) {
        super(calendarEventService);
        this.calendarEventService = calendarEventService;
    }

    // Date range queries
    @GetMapping("/date-range")
    @Operation(summary = "Get events between dates")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getEventsBetweenDates(startTime, endTime);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving events between dates: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/date-range/paginated")
    @Operation(summary = "Get events between dates with pagination")
    public ResponseEntity<OhmaApiResponse<Page<CalendarEventDTO>>> getEventsBetweenDatesPaginated(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            Pageable pageable) {
        try {
            Page<CalendarEventDTO> events = calendarEventService.getEventsBetweenDates(startTime, endTime, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving events between dates with pagination: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Scope-based queries
    @GetMapping("/scope/{scope}")
    @Operation(summary = "Get events by scope")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsByScope(
            @PathVariable CalendarEventScope scope) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getEventsByScope(scope);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving events by scope: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/global")
    @Operation(summary = "Get global events")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getGlobalEvents() {
        try {
            List<CalendarEventDTO> events = calendarEventService.getGlobalEvents();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Global events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving global events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/region/{regionId}")
    @Operation(summary = "Get events for region")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsForRegion(
            @PathVariable Long regionId) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getEventsForRegion(regionId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Regional events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving events for region: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{regionId}/{schoolId}")
    @Operation(summary = "Get events for school")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsForSchool(
            @PathVariable Long regionId,
            @PathVariable Long schoolId) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getEventsForSchool(regionId, schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "School events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving events for school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{regionId}/{schoolId}/{classId}")
    @Operation(summary = "Get events for class")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsForClass(
            @PathVariable Long regionId,
            @PathVariable Long schoolId,
            @PathVariable Long classId) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getEventsForClass(regionId, schoolId, classId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Class events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving events for class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // User-specific queries
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all events for user")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getUserEvents(
            @PathVariable Long userId) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getUserEvents(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving user events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/user/{userId}/created")
    @Operation(summary = "Get events created by user")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsByCreatedBy(
            @PathVariable Long userId) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getEventsByCreatedBy(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Created events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving events created by user: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/user/{userId}/attending")
    @Operation(summary = "Get events user is attending")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsByAttendee(
            @PathVariable Long userId) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getEventsByAttendee(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Attending events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving events user is attending: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/user/{userId}/organizing")
    @Operation(summary = "Get events user is organizing")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsByOrganizer(
            @PathVariable Long userId) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getEventsByOrganizer(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Organizing events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving events user is organizing: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Type and status queries
    @GetMapping("/type/{eventType}")
    @Operation(summary = "Get events by type")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsByType(
            @PathVariable CalendarEventType eventType) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getEventsByType(eventType);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving events by type: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get events by status")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsByStatus(
            @PathVariable CalendarEventStatus status) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getEventsByStatus(status);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving events by status: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Time-based queries
    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming events")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getUpcomingEvents() {
        try {
            List<CalendarEventDTO> events = calendarEventService.getUpcomingEvents();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Upcoming events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving upcoming events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/upcoming/paginated")
    @Operation(summary = "Get upcoming events with pagination")
    public ResponseEntity<OhmaApiResponse<Page<CalendarEventDTO>>> getUpcomingEventsPaginated(Pageable pageable) {
        try {
            Page<CalendarEventDTO> events = calendarEventService.getUpcomingEvents(pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Upcoming events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving upcoming events with pagination: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/today")
    @Operation(summary = "Get today's events")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getTodaysEvents() {
        try {
            List<CalendarEventDTO> events = calendarEventService.getTodaysEvents();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Today's events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving today's events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/this-week")
    @Operation(summary = "Get this week's events")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getThisWeeksEvents() {
        try {
            List<CalendarEventDTO> events = calendarEventService.getThisWeeksEvents();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "This week's events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving this week's events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Course-related events
    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get events for course")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getCourseEvents(
            @PathVariable Long courseId) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getCourseEvents(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving course events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Search functionality
    @GetMapping("/search")
    @Operation(summary = "Search events")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> searchEvents(
            @RequestParam String searchTerm) {
        try {
            List<CalendarEventDTO> events = calendarEventService.searchEvents(searchTerm);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Search results retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error searching events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/search/paginated")
    @Operation(summary = "Search events with pagination")
    public ResponseEntity<OhmaApiResponse<Page<CalendarEventDTO>>> searchEventsPaginated(
            @RequestParam String searchTerm,
            Pageable pageable) {
        try {
            Page<CalendarEventDTO> events = calendarEventService.searchEvents(searchTerm, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Search results retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error searching events with pagination: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Event management
    @PostMapping("/{eventId}/attendees/{userId}")
    @Operation(summary = "Add attendee to event")
    @PreAuthorize("hasRole('TEACHER') or hasRole('SCHOOL_ADMIN') or hasRole('SCHOOL_HEAD')")
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> addAttendee(
            @PathVariable Long eventId,
            @PathVariable Long userId) {
        try {
            CalendarEventDTO event = calendarEventService.addAttendee(eventId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Attendee added successfully", event, null));
        } catch (Exception e) {
            log.error("Error adding attendee to event: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{eventId}/attendees/{userId}")
    @Operation(summary = "Remove attendee from event")
    @PreAuthorize("hasRole('TEACHER') or hasRole('SCHOOL_ADMIN') or hasRole('SCHOOL_HEAD')")
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> removeAttendee(
            @PathVariable Long eventId,
            @PathVariable Long userId) {
        try {
            CalendarEventDTO event = calendarEventService.removeAttendee(eventId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Attendee removed successfully", event, null));
        } catch (Exception e) {
            log.error("Error removing attendee from event: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{eventId}/organizers/{userId}")
    @Operation(summary = "Add organizer to event")
    @PreAuthorize("hasRole('SCHOOL_ADMIN') or hasRole('SCHOOL_HEAD')")
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> addOrganizer(
            @PathVariable Long eventId,
            @PathVariable Long userId) {
        try {
            CalendarEventDTO event = calendarEventService.addOrganizer(eventId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Organizer added successfully", event, null));
        } catch (Exception e) {
            log.error("Error adding organizer to event: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{eventId}/organizers/{userId}")
    @Operation(summary = "Remove organizer from event")
    @PreAuthorize("hasRole('SCHOOL_ADMIN') or hasRole('SCHOOL_HEAD')")
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> removeOrganizer(
            @PathVariable Long eventId,
            @PathVariable Long userId) {
        try {
            CalendarEventDTO event = calendarEventService.removeOrganizer(eventId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Organizer removed successfully", event, null));
        } catch (Exception e) {
            log.error("Error removing organizer from event: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Event status management
    @PutMapping("/{eventId}/status/ongoing")
    @Operation(summary = "Mark event as ongoing")
    @PreAuthorize("hasRole('TEACHER') or hasRole('SCHOOL_ADMIN') or hasRole('SCHOOL_HEAD')")
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> markAsOngoing(@PathVariable Long eventId) {
        try {
            CalendarEventDTO event = calendarEventService.markAsOngoing(eventId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Event marked as ongoing", event, null));
        } catch (Exception e) {
            log.error("Error marking event as ongoing: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{eventId}/status/completed")
    @Operation(summary = "Mark event as completed")
    @PreAuthorize("hasRole('TEACHER') or hasRole('SCHOOL_ADMIN') or hasRole('SCHOOL_HEAD')")
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> markAsCompleted(@PathVariable Long eventId) {
        try {
            CalendarEventDTO event = calendarEventService.markAsCompleted(eventId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Event marked as completed", event, null));
        } catch (Exception e) {
            log.error("Error marking event as completed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{eventId}/cancel")
    @Operation(summary = "Cancel event")
    @PreAuthorize("hasRole('SCHOOL_ADMIN') or hasRole('SCHOOL_HEAD')")
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> cancelEvent(
            @PathVariable Long eventId,
            @RequestParam String reason) {
        try {
            CalendarEventDTO event = calendarEventService.cancelEvent(eventId, reason);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Event cancelled successfully", event, null));
        } catch (Exception e) {
            log.error("Error cancelling event: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{eventId}/postpone")
    @Operation(summary = "Postpone event")
    @PreAuthorize("hasRole('SCHOOL_ADMIN') or hasRole('SCHOOL_HEAD')")
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> postponeEvent(
            @PathVariable Long eventId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newStartTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newEndTime) {
        try {
            CalendarEventDTO event = calendarEventService.postponeEvent(eventId, newStartTime, newEndTime);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Event postponed successfully", event, null));
        } catch (Exception e) {
            log.error("Error postponing event: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{eventId}/reschedule")
    @Operation(summary = "Reschedule event")
    @PreAuthorize("hasRole('SCHOOL_ADMIN') or hasRole('SCHOOL_HEAD')")
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> rescheduleEvent(
            @PathVariable Long eventId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newStartTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newEndTime) {
        try {
            CalendarEventDTO event = calendarEventService.rescheduleEvent(eventId, newStartTime, newEndTime);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Event rescheduled successfully", event, null));
        } catch (Exception e) {
            log.error("Error rescheduling event: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Approval workflow
    @GetMapping("/pending-approval")
    @Operation(summary = "Get pending approval events")
    @PreAuthorize("hasRole('SCHOOL_ADMIN') or hasRole('SCHOOL_HEAD') or hasRole('REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getPendingApprovalEvents() {
        try {
            List<CalendarEventDTO> events = calendarEventService.getPendingApprovalEvents();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Pending approval events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving pending approval events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{eventId}/approve")
    @Operation(summary = "Approve event")
    @PreAuthorize("hasRole('SCHOOL_ADMIN') or hasRole('SCHOOL_HEAD') or hasRole('REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> approveEvent(
            @PathVariable Long eventId,
            @RequestParam Long approverId,
            @RequestParam(required = false) String approvalNotes) {
        try {
            CalendarEventDTO event = calendarEventService.approveEvent(eventId, approverId, approvalNotes);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Event approved successfully", event, null));
        } catch (Exception e) {
            log.error("Error approving event: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{eventId}/reject")
    @Operation(summary = "Reject event")
    @PreAuthorize("hasRole('SCHOOL_ADMIN') or hasRole('SCHOOL_HEAD') or hasRole('REGIONAL_ADMIN')")
    public ResponseEntity<OhmaApiResponse<CalendarEventDTO>> rejectEvent(
            @PathVariable Long eventId,
            @RequestParam Long approverId,
            @RequestParam(required = false) String rejectionNotes) {
        try {
            CalendarEventDTO event = calendarEventService.rejectEvent(eventId, approverId, rejectionNotes);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Event rejected successfully", event, null));
        } catch (Exception e) {
            log.error("Error rejecting event: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Calendar view helpers
    @GetMapping("/calendar-view/{userId}")
    @Operation(summary = "Get events for calendar view")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getEventsForCalendarView(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getEventsForCalendarView(userId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Calendar events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving calendar view events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/month/{userId}/{year}/{month}")
    @Operation(summary = "Get month events")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getMonthEvents(
            @PathVariable Long userId,
            @PathVariable int year,
            @PathVariable int month) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getMonthEvents(userId, year, month);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Month events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving month events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Statistics
    @GetMapping("/statistics/school/{schoolId}/count")
    @Operation(summary = "Get event count by school")
    public ResponseEntity<OhmaApiResponse<Long>> getEventCountBySchool(@PathVariable Long schoolId) {
        try {
            Long count = calendarEventService.getEventCountBySchool(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Event count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving event count by school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/type/{eventType}/count")
    @Operation(summary = "Get event count by type")
    public ResponseEntity<OhmaApiResponse<Long>> getEventCountByType(@PathVariable CalendarEventType eventType) {
        try {
            Long count = calendarEventService.getEventCountByType(eventType);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Event count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving event count by type: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Conflict detection
    @GetMapping("/{eventId}/conflicts")
    @Operation(summary = "Find conflicting events")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> findConflictingEvents(
            @PathVariable Long eventId,
            @RequestParam String location,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            List<CalendarEventDTO> conflicts = calendarEventService.findConflictingEvents(eventId, location, startTime, endTime);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Conflicting events retrieved successfully", conflicts, null));
        } catch (Exception e) {
            log.error("Error finding conflicting events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{eventId}/has-conflicts")
    @Operation(summary = "Check if event has conflicts")
    public ResponseEntity<OhmaApiResponse<Boolean>> hasConflicts(
            @PathVariable Long eventId,
            @RequestParam String location,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            boolean hasConflicts = calendarEventService.hasConflicts(eventId, location, startTime, endTime);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Conflict check completed", hasConflicts, null));
        } catch (Exception e) {
            log.error("Error checking for conflicts: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Bulk operations
    @PostMapping("/bulk")
    @Operation(summary = "Create bulk events")
    @PreAuthorize("hasRole('SCHOOL_ADMIN') or hasRole('SCHOOL_HEAD')")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> createBulkEvents(
            @Valid @RequestBody List<CalendarEventDTO> events) {
        try {
            List<CalendarEventDTO> createdEvents = calendarEventService.createBulkEvents(events);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Bulk events created successfully", createdEvents, null));
        } catch (Exception e) {
            log.error("Error creating bulk events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/bulk")
    @Operation(summary = "Delete bulk events")
    @PreAuthorize("hasRole('SCHOOL_ADMIN') or hasRole('SCHOOL_HEAD')")
    public ResponseEntity<OhmaApiResponse<Void>> deleteBulkEvents(@RequestBody List<Long> eventIds) {
        try {
            calendarEventService.deleteBulkEvents(eventIds);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Bulk events deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting bulk events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Academic calendar helpers
    @GetMapping("/academic-year/{academicYear}")
    @Operation(summary = "Get academic year events")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getAcademicYearEvents(
            @PathVariable Integer academicYear) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getAcademicYearEvents(academicYear);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Academic year events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving academic year events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/holidays")
    @Operation(summary = "Get holiday events")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getHolidayEvents(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getHolidayEvents(startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Holiday events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving holiday events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/exams")
    @Operation(summary = "Get exam events")
    public ResponseEntity<OhmaApiResponse<List<CalendarEventDTO>>> getExamEvents(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<CalendarEventDTO> events = calendarEventService.getExamEvents(startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Exam events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving exam events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Export functionality
    @GetMapping("/export")
    @Operation(summary = "Export events to calendar format")
    public ResponseEntity<OhmaApiResponse<String>> exportEventsToCalendar(@RequestParam List<Long> eventIds) {
        try {
            String calendarData = calendarEventService.exportEventsToCalendar(eventIds);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Events exported successfully", calendarData, null));
        } catch (Exception e) {
            log.error("Error exporting events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/export/user/{userId}")
    @Operation(summary = "Export user calendar")
    public ResponseEntity<OhmaApiResponse<String>> exportUserCalendar(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            String calendarData = calendarEventService.exportUserCalendar(userId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User calendar exported successfully", calendarData, null));
        } catch (Exception e) {
            log.error("Error exporting user calendar: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 
package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.EventDto;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.Event;
import com.ohma.thutothebe.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/events")
@Tag(name = "Event Management", description = "APIs for managing calendar events")
public class EventController extends BaseController<EventDto, Long> {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        super(eventService);
        this.eventService = eventService;
    }

    @Operation(summary = "Get events by course ID", description = "Retrieves all calendar events for a specific course")
    @GetMapping("/course/{courseId}")
    public ResponseEntity<OhmaApiResponse<List<EventDto>>> getEventsByCourseId(@PathVariable Long courseId) {
        try {
            List<EventDto> events = eventService.getEventsByCourseId(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error fetching course events: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Operation(summary = "Get events by user ID", description = "Retrieves all calendar events created by a specific user")
    @GetMapping("/user/{userId}")
    public ResponseEntity<OhmaApiResponse<List<EventDto>>> getEventsByUserId(@PathVariable Long userId) {
        try {
            List<EventDto> events = eventService.getEventsByUserId(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error fetching user events: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Operation(summary = "Get events between dates", description = "Retrieves all calendar events between specified start and end dates")
    @GetMapping("/between")
    public ResponseEntity<OhmaApiResponse<List<EventDto>>> getEventsBetweenDates(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime
    ) {
        try {
            List<EventDto> events = eventService.getEventsBetweenDates(startTime, endTime);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error fetching events between dates: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Operation(summary = "Get course events between dates", description = "Retrieves all calendar events for a specific course between specified start and end dates")
    @GetMapping("/course/{courseId}/between")
    public ResponseEntity<OhmaApiResponse<List<EventDto>>> getCourseEventsBetweenDates(
        @PathVariable Long courseId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime
    ) {
        try {
            List<EventDto> events = eventService.getCourseEventsBetweenDates(courseId, startTime, endTime);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error fetching course events between dates: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Operation(summary = "Get all recurring events", description = "Retrieves all calendar events that are recurring")
    @GetMapping("/recurring")
    public ResponseEntity<OhmaApiResponse<List<EventDto>>> getAllRecurringEvents() {
        try {
            List<EventDto> events = eventService.getAllRecurringEvents();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Recurring events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error fetching recurring events: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Operation(summary = "Generate recurring events", description = "Generates recurring event instances for a specific event until a specified date")
    @GetMapping("/{id}/recurring")
    public ResponseEntity<OhmaApiResponse<List<EventDto>>> generateRecurringEvents(
        @PathVariable Long id,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime until
    ) {
        try {
            List<EventDto> events = eventService.generateRecurringEvents(id, until);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Recurring events generated successfully", events, null));
        } catch (Exception e) {
            log.error("Error generating recurring events: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 
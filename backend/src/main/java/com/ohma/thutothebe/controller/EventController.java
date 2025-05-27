package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.EventDto;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.service.EventCompatibilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
@RequestMapping("/events")
@Tag(name = "Event Management", description = "APIs for managing calendar events (Legacy compatibility layer)")
public class EventController extends BaseController<EventDto, Long> {

    private final EventCompatibilityService eventCompatibilityService;

    @Autowired
    public EventController(EventCompatibilityService eventCompatibilityService) {
        super(eventCompatibilityService);
        this.eventCompatibilityService = eventCompatibilityService;
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get events by course ID")
    @Parameter(name = "courseId", description = "Course ID")
    public ResponseEntity<OhmaApiResponse<List<EventDto>>> getEventsByCourseId(@PathVariable Long courseId) {
        try {
            List<EventDto> events = eventCompatibilityService.getEventsByCourseId(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving events for course {}: {}", courseId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get events by user ID")
    @Parameter(name = "userId", description = "User ID")
    public ResponseEntity<OhmaApiResponse<List<EventDto>>> getEventsByUserId(@PathVariable Long userId) {
        try {
            List<EventDto> events = eventCompatibilityService.getEventsByUserId(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving events for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get events between dates")
    @Parameter(name = "startTime", description = "Start time in ISO format")
    @Parameter(name = "endTime", description = "End time in ISO format")
    public ResponseEntity<OhmaApiResponse<List<EventDto>>> getEventsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            List<EventDto> events = eventCompatibilityService.getEventsBetweenDates(startTime, endTime);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving events between dates: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/date-range")
    @Operation(summary = "Get course events between dates")
    @Parameter(name = "courseId", description = "Course ID")
    @Parameter(name = "startTime", description = "Start time in ISO format")
    @Parameter(name = "endTime", description = "End time in ISO format")
    public ResponseEntity<OhmaApiResponse<List<EventDto>>> getCourseEventsBetweenDates(
            @PathVariable Long courseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            List<EventDto> events = eventCompatibilityService.getCourseEventsBetweenDates(courseId, startTime, endTime);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving course events between dates: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/recurring")
    @Operation(summary = "Get all recurring events")
    public ResponseEntity<OhmaApiResponse<List<EventDto>>> getAllRecurringEvents() {
        try {
            List<EventDto> events = eventCompatibilityService.getAllRecurringEvents();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Recurring events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving recurring events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{eventId}/generate-recurring")
    @Operation(summary = "Generate recurring events")
    @Parameter(name = "eventId", description = "Parent event ID")
    @Parameter(name = "until", description = "Generate until this date")
    public ResponseEntity<OhmaApiResponse<List<EventDto>>> generateRecurringEvents(
            @PathVariable Long eventId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime until) {
        try {
            List<EventDto> events = eventCompatibilityService.generateRecurringEvents(eventId, until);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Recurring events generated successfully", events, null));
        } catch (Exception e) {
            log.error("Error generating recurring events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get student events")
    @Parameter(name = "studentId", description = "Student ID")
    public ResponseEntity<OhmaApiResponse<List<EventDto>>> getStudentEvents(@PathVariable Long studentId) {
        try {
            List<EventDto> events = eventCompatibilityService.getStudentEvents(studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving student events: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/student/{studentId}/date-range")
    @Operation(summary = "Get student events between dates")
    @Parameter(name = "studentId", description = "Student ID")
    @Parameter(name = "startTime", description = "Start time in ISO format")
    @Parameter(name = "endTime", description = "End time in ISO format")
    public ResponseEntity<OhmaApiResponse<List<EventDto>>> getStudentEventsBetweenDates(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            List<EventDto> events = eventCompatibilityService.getStudentEventsBetweenDates(studentId, startTime, endTime);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student events retrieved successfully", events, null));
        } catch (Exception e) {
            log.error("Error retrieving student events between dates: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 
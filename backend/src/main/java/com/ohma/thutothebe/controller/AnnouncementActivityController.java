package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.AnnouncementActivityDto;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AnnouncementActivityType;
import com.ohma.thutothebe.service.AnnouncementActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/announcement-activities")
@Tag(name = "Announcement Activities", description = "Announcement activity tracking operations")
public class AnnouncementActivityController extends BaseController<AnnouncementActivityDto, Long> {

    private final AnnouncementActivityService activityService;

    public AnnouncementActivityController(AnnouncementActivityService activityService) {
        super(activityService);
        this.activityService = activityService;
    }

    @GetMapping("/announcement/{announcementId}")
    @Operation(summary = "Get activities for an announcement")
    public ResponseEntity<OhmaApiResponse<List<AnnouncementActivityDto>>> getActivitiesByAnnouncement(
            @PathVariable Long announcementId) {
        try {
            List<AnnouncementActivityDto> activities = activityService.getActivitiesByAnnouncementId(announcementId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Activities retrieved successfully", activities, null));
        } catch (Exception e) {
            log.error("Error retrieving activities for announcement {}: {}", announcementId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/announcement/{announcementId}/type/{type}")
    @Operation(summary = "Get activities for an announcement by type")
    public ResponseEntity<OhmaApiResponse<List<AnnouncementActivityDto>>> getActivitiesByAnnouncementAndType(
            @PathVariable Long announcementId,
            @PathVariable AnnouncementActivityType type) {
        try {
            List<AnnouncementActivityDto> activities = activityService.getActivitiesByAnnouncementIdAndType(announcementId, type);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Activities retrieved successfully", activities, null));
        } catch (Exception e) {
            log.error("Error retrieving activities for announcement {} and type {}: {}", announcementId, type, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get activities for a user")
    public ResponseEntity<OhmaApiResponse<List<AnnouncementActivityDto>>> getActivitiesByUser(
            @PathVariable Long userId) {
        try {
            List<AnnouncementActivityDto> activities = activityService.getActivitiesByUserId(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Activities retrieved successfully", activities, null));
        } catch (Exception e) {
            log.error("Error retrieving activities for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }


    @PostMapping("/create")
    @Operation(summary = "Create a new activity")
    public ResponseEntity<OhmaApiResponse<AnnouncementActivityDto>> createActivity(
            @RequestBody Map<String, Object> request) {
        try {
            Long announcementId = Long.valueOf(request.get("announcementId").toString());
            Long userId = Long.valueOf(request.get("userId").toString());
            AnnouncementActivityType type = AnnouncementActivityType.valueOf(request.get("type").toString());
            String details = request.get("details") != null ? request.get("details").toString() : null;

            AnnouncementActivityDto activity = activityService.createActivity(announcementId, userId, type, details);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Activity created successfully", activity, null));
        } catch (Exception e) {
            log.error("Error creating activity: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/announcement/{announcementId}/type/{type}/count")
    @Operation(summary = "Get activity count for an announcement by type")
    public ResponseEntity<OhmaApiResponse<Long>> getActivityCount(
            @PathVariable Long announcementId,
            @PathVariable AnnouncementActivityType type) {
        try {
            long count = activityService.getActivityCount(announcementId, type);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Activity count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving activity count for announcement {} and type {}: {}", announcementId, type, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 
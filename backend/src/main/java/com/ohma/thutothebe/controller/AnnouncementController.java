package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.AnnouncementDTO;
import com.ohma.thutothebe.dto.AnnouncementReadReceiptDTO;
import com.ohma.thutothebe.dto.AnnouncementAcknowledgmentDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AnnouncementType;
import com.ohma.thutothebe.service.AnnouncementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/announcements")
@Tag(name = "Announcement Management", description = "APIs for managing announcements with role-based access control")
@Slf4j
public class AnnouncementController extends BaseController<AnnouncementDTO, Long> {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        super(announcementService);
        this.announcementService = announcementService;
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get announcements for a specific user based on their role and context")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER', 'STUDENT', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<Page<AnnouncementDTO>>> getAnnouncementsForUser(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        try {
            Page<AnnouncementDTO> announcements = announcementService.getAnnouncementsForUser(userId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Announcements retrieved successfully", announcements, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error retrieving announcements for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }

    @GetMapping("/user/{userId}/type/{type}")
    @Operation(summary = "Get announcements by type for a specific user")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER', 'STUDENT', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<Page<AnnouncementDTO>>> getAnnouncementsByTypeForUser(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Announcement type") @PathVariable AnnouncementType type,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        try {
            Page<AnnouncementDTO> announcements = announcementService.getAnnouncementsByTypeForUser(userId, type, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Announcements retrieved successfully", announcements, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error retrieving announcements by type for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }

    @GetMapping("/creator/{creatorId}")
    @Operation(summary = "Get announcements created by a specific user")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<Page<AnnouncementDTO>>> getAnnouncementsByCreator(
            @Parameter(description = "Creator ID") @PathVariable Long creatorId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        try {
            Page<AnnouncementDTO> announcements = announcementService.getAnnouncementsByCreator(creatorId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Announcements retrieved successfully", announcements, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error retrieving announcements by creator {}: {}", creatorId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }

    @PostMapping("/create/{creatorId}")
    @Operation(summary = "Create a new announcement with role-based validation")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<AnnouncementDTO>> createAnnouncement(
            @Parameter(description = "Creator ID") @PathVariable Long creatorId,
            @Valid @RequestBody AnnouncementDTO dto) {
        try {
            AnnouncementDTO created = announcementService.createAnnouncement(dto, creatorId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Announcement created successfully", created, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error creating announcement: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }

    @PutMapping("/{id}/update/{userId}")
    @Operation(summary = "Update an announcement with role-based validation")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<AnnouncementDTO>> updateAnnouncement(
            @Parameter(description = "Announcement ID") @PathVariable Long id,
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Valid @RequestBody AnnouncementDTO dto) {
        try {
            AnnouncementDTO updated = announcementService.updateAnnouncement(id, dto, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Announcement updated successfully", updated, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error updating announcement {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }

    @DeleteMapping("/{id}/delete/{userId}")
    @Operation(summary = "Delete an announcement with role-based validation")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<Void>> deleteAnnouncement(
            @Parameter(description = "Announcement ID") @PathVariable Long id,
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            announcementService.deleteAnnouncement(id, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Announcement deleted successfully", null, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error deleting announcement {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }

    @PostMapping("/{announcementId}/read/{userId}")
    @Operation(summary = "Mark an announcement as read")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER', 'STUDENT', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<AnnouncementReadReceiptDTO>> markAsRead(
            @Parameter(description = "Announcement ID") @PathVariable Long announcementId,
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            AnnouncementReadReceiptDTO receipt = announcementService.markAsRead(announcementId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Announcement marked as read", receipt, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error marking announcement {} as read for user {}: {}", announcementId, userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }

    @PostMapping("/{announcementId}/acknowledge/{userId}")
    @Operation(summary = "Acknowledge an announcement")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER', 'STUDENT', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<AnnouncementAcknowledgmentDTO>> acknowledgeAnnouncement(
            @Parameter(description = "Announcement ID") @PathVariable Long announcementId,
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Acknowledgment note") @RequestParam(required = false) String note) {
        try {
            AnnouncementAcknowledgmentDTO acknowledgment = announcementService.acknowledgeAnnouncement(announcementId, userId, note);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Announcement acknowledged", acknowledgment, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error acknowledging announcement {} for user {}: {}", announcementId, userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }

    @GetMapping("/user/{userId}/pending-acknowledgments/count")
    @Operation(summary = "Get pending acknowledgments count for a user")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER', 'STUDENT', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<Long>> getPendingAcknowledgmentsCount(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            Long count = announcementService.getPendingAcknowledgmentsCount(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Pending acknowledgments count retrieved", count, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error getting pending acknowledgments count for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }

    @GetMapping("/user/{userId}/search")
    @Operation(summary = "Search announcements for a user")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER', 'STUDENT', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<Page<AnnouncementDTO>>> searchAnnouncementsForUser(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Search term") @RequestParam String searchTerm,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        try {
            Page<AnnouncementDTO> announcements = announcementService.searchAnnouncementsForUser(userId, searchTerm, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Search results retrieved successfully", announcements, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error searching announcements for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }

    @GetMapping("/user/{userId}/tag/{tag}")
    @Operation(summary = "Get announcements by tag for a user")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER', 'STUDENT', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<Page<AnnouncementDTO>>> getAnnouncementsByTagForUser(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Tag") @PathVariable String tag,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        try {
            Page<AnnouncementDTO> announcements = announcementService.getAnnouncementsByTagForUser(userId, tag, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Announcements by tag retrieved successfully", announcements, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error retrieving announcements by tag for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }

    @GetMapping("/{announcementId}/read-receipts/{requesterId}")
    @Operation(summary = "Get read receipts for an announcement")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<AnnouncementReadReceiptDTO>>> getReadReceipts(
            @Parameter(description = "Announcement ID") @PathVariable Long announcementId,
            @Parameter(description = "Requester ID") @PathVariable Long requesterId) {
        try {
            List<AnnouncementReadReceiptDTO> receipts = announcementService.getReadReceipts(announcementId, requesterId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Read receipts retrieved successfully", receipts, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error retrieving read receipts for announcement {}: {}", announcementId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }

    @GetMapping("/{announcementId}/acknowledgments/{requesterId}")
    @Operation(summary = "Get acknowledgments for an announcement")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<List<AnnouncementAcknowledgmentDTO>>> getAcknowledgments(
            @Parameter(description = "Announcement ID") @PathVariable Long announcementId,
            @Parameter(description = "Requester ID") @PathVariable Long requesterId) {
        try {
            List<AnnouncementAcknowledgmentDTO> acknowledgments = announcementService.getAcknowledgments(announcementId, requesterId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Acknowledgments retrieved successfully", acknowledgments, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error retrieving acknowledgments for announcement {}: {}", announcementId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }

    @GetMapping("/global")
    @Operation(summary = "Get global announcements (visible to all users)")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER', 'STUDENT', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<Page<AnnouncementDTO>>> getGlobalAnnouncements(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        try {
            Page<AnnouncementDTO> announcements = announcementService.getGlobalAnnouncements(pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Global announcements retrieved successfully", announcements, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error retrieving global announcements: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }

    @PutMapping("/{id}/toggle-status/{userId}")
    @Operation(summary = "Activate/deactivate an announcement")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER')")
    public ResponseEntity<OhmaApiResponse<AnnouncementDTO>> toggleAnnouncementStatus(
            @Parameter(description = "Announcement ID") @PathVariable Long id,
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            AnnouncementDTO updated = announcementService.toggleAnnouncementStatus(id, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Announcement status updated successfully", updated, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error toggling announcement status {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }

    @GetMapping("/{announcementId}/user/{userId}")
    @Operation(summary = "Get announcement by ID with user-specific status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER', 'STUDENT', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<AnnouncementDTO>> getAnnouncementByIdWithUserStatus(
            @Parameter(description = "Announcement ID") @PathVariable Long announcementId,
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            AnnouncementDTO announcement = announcementService.getAnnouncementByIdWithUserStatus(announcementId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Announcement retrieved successfully", announcement, LocalDateTime.now()));
        } catch (Exception e) {
            log.error("Error retrieving announcement {} for user {}: {}", announcementId, userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, LocalDateTime.now()));
        }
    }
} 
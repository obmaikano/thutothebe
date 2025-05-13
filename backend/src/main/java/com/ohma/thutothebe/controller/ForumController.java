package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.ForumDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.service.ForumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/forums")
@Tag(name = "Forum Management", description = "APIs for managing forums")
public class ForumController extends BaseController<ForumDTO, Long> {

    private final ForumService forumService;

    public ForumController(ForumService forumService) {
        super(forumService);
        this.forumService = forumService;
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get forum by course ID")
    public ResponseEntity<OhmaApiResponse<ForumDTO>> getByCourseId(@PathVariable Long courseId) {
        try {
            ForumDTO forum = forumService.findByCourseId(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Forum retrieved successfully", forum, null));
        } catch (Exception e) {
            log.error("Error retrieving forum: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/active")
    @Operation(summary = "Get active forum by course ID")
    public ResponseEntity<OhmaApiResponse<ForumDTO>> getByCourseIdAndActive(
            @PathVariable Long courseId,
            @RequestParam(defaultValue = "true") boolean active) {
        try {
            ForumDTO forum = forumService.findByCourseIdAndActive(courseId, active);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Forum retrieved successfully", forum, null));
        } catch (Exception e) {
            log.error("Error retrieving forum: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{id}/threads")
    @Operation(summary = "Get forum with threads by ID")
    public ResponseEntity<OhmaApiResponse<ForumDTO>> getByIdWithThreads(@PathVariable Long id) {
        try {
            ForumDTO forum = forumService.findByIdWithThreads(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Forum with threads retrieved successfully", forum, null));
        } catch (Exception e) {
            log.error("Error retrieving forum with threads: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/threads")
    @Operation(summary = "Get forum with threads by course ID")
    public ResponseEntity<OhmaApiResponse<ForumDTO>> getByCourseIdWithThreads(@PathVariable Long courseId) {
        try {
            ForumDTO forum = forumService.findByCourseIdWithThreads(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Forum with threads retrieved successfully", forum, null));
        } catch (Exception e) {
            log.error("Error retrieving forum with threads: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 
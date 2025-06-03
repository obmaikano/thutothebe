package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.ForumDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.ForumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/forums")
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
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view forums for this course (class-level access)
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to course forum", null, null));
            }

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
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view forums for this course (class-level access)
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to course forum", null, null));
            }

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
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get forum first to check course access
            ForumDTO forum = forumService.getById(id);
            if (forum == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if user has access to view this forum's course (class-level access)
            if (!hasAccess(AccessScope.CLASS, forum.courseId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to forum threads", null, null));
            }

            ForumDTO forumWithThreads = forumService.findByIdWithThreads(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Forum with threads retrieved successfully", forumWithThreads, null));
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
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view forums for this course (class-level access)
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to course forum threads", null, null));
            }

            ForumDTO forum = forumService.findByCourseIdWithThreads(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Forum with threads retrieved successfully", forum, null));
        } catch (Exception e) {
            log.error("Error retrieving forum with threads: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<ForumDTO>> create(@RequestBody ForumDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to create forums for this course (class-level access required)
            if (!hasAccess(AccessScope.CLASS, dto.courseId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to create forum for this course", null, null));
            }

            return super.create(dto);
        } catch (Exception e) {
            log.error("Error creating forum: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<ForumDTO>> update(@PathVariable Long id, @RequestBody ForumDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get existing forum to check course access
            ForumDTO existingForum = forumService.getById(id);
            if (existingForum == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if user has access to update forums for this course (class-level access required)
            if (!hasAccess(AccessScope.CLASS, existingForum.courseId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to update this forum", null, null));
            }

            return super.update(id, dto);
        } catch (Exception e) {
            log.error("Error updating forum: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get existing forum to check course access
            ForumDTO existingForum = forumService.getById(id);
            if (existingForum == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if user has access to delete forums for this course (class-level access required)
            if (!hasAccess(AccessScope.CLASS, existingForum.courseId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to delete this forum", null, null));
            }

            return super.delete(id);
        } catch (Exception e) {
            log.error("Error deleting forum: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 
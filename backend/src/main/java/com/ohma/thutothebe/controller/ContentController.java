package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.ContentDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.ContentType;
import com.ohma.thutothebe.service.ContentService;
import com.ohma.thutothebe.util.LoggingUtil;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/content")
public class ContentController extends BaseController<ContentDTO, Long> {

    private final ContentService contentService;
    private final Logger logger = LoggingUtil.getLogger(ContentController.class);

    @Autowired
    public ContentController(ContentService contentService) {
        super(contentService);
        this.contentService = contentService;
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<OhmaApiResponse<?>> getByCourse(@PathVariable Long courseId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view content for this course (class-level access)
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to course content", null, null));
            }

            LoggingUtil.logInfo(logger,"Getting content for course: {}", courseId);
            List<ContentDTO> content = contentService.getByCourse(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Content retrieved successfully", content, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error getting content for course: {}", courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/type/{type}")
    public ResponseEntity<OhmaApiResponse<?>> getByType(@PathVariable Long courseId, @PathVariable ContentType type) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view content for this course (class-level access)
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to course content", null, null));
            }

            LoggingUtil.logInfo(logger,"Getting content of type {} for course: {}", type, courseId);
            List<ContentDTO> content = contentService.getByType(courseId, type);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Content retrieved successfully", content, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger,"Error getting content of type {} for course: {}", type, courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/active")
    public ResponseEntity<OhmaApiResponse<?>> getActiveByCourse(@PathVariable Long courseId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view content for this course (class-level access)
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to course content", null, null));
            }

            LoggingUtil.logInfo(logger,"Getting active content for course: {}", courseId);
            List<ContentDTO> content = contentService.getActiveByCourse(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active content retrieved successfully", content, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger,"Error getting active content for course: {}", courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/type/{type}/active")
    public ResponseEntity<OhmaApiResponse<?>> getActiveByType(@PathVariable Long courseId, @PathVariable ContentType type) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view content for this course (class-level access)
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to course content", null, null));
            }

            LoggingUtil.logInfo(logger,"Getting active content of type {} for course: {}", type, courseId);
            List<ContentDTO> content = contentService.getActiveByType(courseId, type);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active content retrieved successfully", content, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger,"Error getting active content of type {} for course: {}", type, courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/exists")
    public ResponseEntity<OhmaApiResponse<?>> existsByTitleAndCourse(@RequestParam String title, @RequestParam Long courseId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view content for this course (class-level access)
            if (!hasAccess(AccessScope.CLASS, courseId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to course content", null, null));
            }

            LoggingUtil.logInfo(logger,"Checking if content exists with title {} in course: {}", title, courseId);
            boolean exists = contentService.existsByTitleAndCourse(title, courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Content existence checked successfully", exists, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger,"Error checking if content exists with title {} in course: {}", title, courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<OhmaApiResponse<?>> getContentByTeacher(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view content for this teacher (self-access or admin access)
            if (!hasAccess(AccessScope.USER, teacherId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to teacher's content", null, null));
            }

            LoggingUtil.logInfo(logger,"Getting content for teacher: {}", teacherId);
            List<ContentDTO> content = contentService.getContentByTeacher(teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher content retrieved successfully", content, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger,"Error getting content for teacher: {}", teacherId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}/active")
    public ResponseEntity<OhmaApiResponse<?>> getActiveContentByTeacher(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view content for this teacher (self-access or admin access)
            if (!hasAccess(AccessScope.USER, teacherId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to teacher's content", null, null));
            }

            LoggingUtil.logInfo(logger,"Getting active content for teacher: {}", teacherId);
            List<ContentDTO> content = contentService.getActiveContentByTeacher(teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active teacher content retrieved successfully", content, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger,"Error getting active content for teacher: {}", teacherId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}/type/{type}")
    public ResponseEntity<OhmaApiResponse<?>> getContentByTeacherAndType(@PathVariable Long teacherId, @PathVariable ContentType type) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view content for this teacher (self-access or admin access)
            if (!hasAccess(AccessScope.USER, teacherId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to teacher's content", null, null));
            }

            LoggingUtil.logInfo(logger,"Getting content of type {} for teacher: {}", type, teacherId);
            List<ContentDTO> content = contentService.getContentByTeacherAndType(teacherId, type);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher content by type retrieved successfully", content, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger,"Error getting content of type {} for teacher: {}", type, teacherId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/created-by/{userId}")
    public ResponseEntity<OhmaApiResponse<?>> getContentByCreator(@PathVariable Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view content created by this user (self-access or admin access)
            if (!hasAccess(AccessScope.USER, userId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to user's created content", null, null));
            }

            LoggingUtil.logInfo(logger,"Getting content created by user: {}", userId);
            List<ContentDTO> content = contentService.getContentByCreator(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Content by creator retrieved successfully", content, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger,"Error getting content created by user: {}", userId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/created-by/{userId}/active")
    public ResponseEntity<OhmaApiResponse<?>> getActiveContentByCreator(@PathVariable Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view content created by this user (self-access or admin access)
            if (!hasAccess(AccessScope.USER, userId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to user's created content", null, null));
            }

            LoggingUtil.logInfo(logger,"Getting active content created by user: {}", userId);
            List<ContentDTO> content = contentService.getActiveContentByCreator(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active content by creator retrieved successfully", content, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger,"Error getting active content created by user: {}", userId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<ContentDTO>> create(@RequestBody ContentDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to create content for this course (class-level access required)
            if (dto.courseId() != null && !hasAccess(AccessScope.CLASS, dto.courseId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to create content for this course", null, null));
            }

            return super.create(dto);
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error creating content: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<ContentDTO>> update(@PathVariable Long id, @RequestBody ContentDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get existing content to check access
            ContentDTO existingContent = contentService.getById(id);
            if (existingContent == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if user has access to update content for this course (class-level access required)
            if (existingContent.courseId() != null && !hasAccess(AccessScope.CLASS, existingContent.courseId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to update this content", null, null));
            }

            return super.update(id, dto);
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error updating content: {}", e.getMessage(), e);
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

            // Get existing content to check access
            ContentDTO existingContent = contentService.getById(id);
            if (existingContent == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if user has access to delete content for this course (class-level access required)
            if (existingContent.courseId() != null && !hasAccess(AccessScope.CLASS, existingContent.courseId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to delete this content", null, null));
            }

            return super.delete(id);
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error deleting content: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 
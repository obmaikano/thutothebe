package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.LessonDTO;
import com.ohma.thutothebe.dto.CreateLessonRequest;
import com.ohma.thutothebe.dto.UpdateLessonRequest;
import com.ohma.thutothebe.service.LessonService;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/lessons")
@Tag(name = "Lesson Management", description = "APIs for managing lessons")
public class LessonController extends BaseController<LessonDTO, Long> {

    private final LessonService lessonService;

    @Autowired
    public LessonController(LessonService lessonService) {
        super(lessonService);
        this.lessonService = lessonService;
    }

    @GetMapping
    public ResponseEntity<OhmaApiResponse<List<LessonDTO>>> getAllLessons() {
        try {
            List<LessonDTO> lessons = lessonService.getAllLessons();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lessons retrieved successfully", lessons, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve lessons: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<LessonDTO>> getLessonById(@PathVariable Long id) {
        try {
            LessonDTO lesson = lessonService.getLessonById(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lesson retrieved successfully", lesson, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve lesson: " + e.getMessage(), null, null));
        }
    }

    @PostMapping
    public ResponseEntity<OhmaApiResponse<LessonDTO>> createLesson(@RequestBody CreateLessonRequest request) {
        try {
            LessonDTO lesson = lessonService.createLesson(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(new OhmaApiResponse<>("SUCCESS", "Lesson created successfully", lesson, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to create lesson: " + e.getMessage(), null, null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<LessonDTO>> updateLesson(@PathVariable Long id, @RequestBody UpdateLessonRequest request) {
        try {
            LessonDTO lesson = lessonService.updateLesson(id, request);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lesson updated successfully", lesson, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to update lesson: " + e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<String>> deleteLesson(@PathVariable Long id) {
        try {
            lessonService.deleteLesson(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lesson deleted successfully", "Lesson with ID " + id + " has been deleted", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to delete lesson: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<OhmaApiResponse<List<LessonDTO>>> getLessonsByCourseId(@PathVariable Long courseId) {
        try {
            List<LessonDTO> lessons = lessonService.getLessonsByCourseId(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lessons retrieved successfully", lessons, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve lessons: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/active/{active}")
    public ResponseEntity<OhmaApiResponse<List<LessonDTO>>> getLessonsByCourseIdAndActive(@PathVariable Long courseId, @PathVariable Boolean active) {
        try {
            List<LessonDTO> lessons = lessonService.getLessonsByCourseIdAndActive(courseId, active);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lessons retrieved successfully", lessons, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve lessons: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<OhmaApiResponse<List<LessonDTO>>> getLessonsByInstructorId(@PathVariable Long instructorId) {
        try {
            List<LessonDTO> lessons = lessonService.getLessonsByInstructorId(instructorId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lessons retrieved successfully", lessons, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve lessons: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<OhmaApiResponse<List<LessonDTO>>> getLessonsByStatus(@PathVariable String status) {
        try {
            List<LessonDTO> lessons = lessonService.getLessonsByStatus(status);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lessons retrieved successfully", lessons, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve lessons: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/status/{status}")
    public ResponseEntity<OhmaApiResponse<List<LessonDTO>>> getLessonsByCourseIdAndStatus(@PathVariable Long courseId, @PathVariable String status) {
        try {
            List<LessonDTO> lessons = lessonService.getLessonsByCourseIdAndStatus(courseId, status);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lessons retrieved successfully", lessons, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve lessons: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/order/{lessonOrder}")
    public ResponseEntity<OhmaApiResponse<LessonDTO>> getLessonByCourseIdAndLessonOrder(@PathVariable Long courseId, @PathVariable Integer lessonOrder) {
        try {
            LessonDTO lesson = lessonService.getLessonByCourseIdAndLessonOrder(courseId, lessonOrder);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lesson retrieved successfully", lesson, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve lesson: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/count")
    public ResponseEntity<OhmaApiResponse<Long>> countLessonsByCourseId(@PathVariable Long courseId) {
        try {
            Long count = lessonService.countLessonsByCourseId(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lesson count retrieved successfully", count, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve lesson count: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/status/{status}/count")
    public ResponseEntity<OhmaApiResponse<Long>> countLessonsByCourseIdAndStatus(@PathVariable Long courseId, @PathVariable String status) {
        try {
            Long count = lessonService.countLessonsByCourseIdAndStatus(courseId, status);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lesson count retrieved successfully", count, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve lesson count: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/max-order")
    public ResponseEntity<OhmaApiResponse<Integer>> getMaxLessonOrderByCourseId(@PathVariable Long courseId) {
        try {
            Integer maxOrder = lessonService.getMaxLessonOrderByCourseId(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Max lesson order retrieved successfully", maxOrder, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve max lesson order: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/scheduled")
    public ResponseEntity<OhmaApiResponse<List<LessonDTO>>> getLessonsByCourseIdAndScheduledDateBetween(
            @PathVariable Long courseId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            List<LessonDTO> lessons = lessonService.getLessonsByCourseIdAndScheduledDateBetween(courseId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lessons retrieved successfully", lessons, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve lessons: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/instructor/{instructorId}/scheduled")
    public ResponseEntity<OhmaApiResponse<List<LessonDTO>>> getLessonsByInstructorIdAndScheduledDateBetween(
            @PathVariable Long instructorId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            List<LessonDTO> lessons = lessonService.getLessonsByInstructorIdAndScheduledDateBetween(instructorId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lessons retrieved successfully", lessons, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve lessons: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/mandatory")
    public ResponseEntity<OhmaApiResponse<List<LessonDTO>>> getMandatoryLessonsByCourseId(@PathVariable Long courseId) {
        try {
            List<LessonDTO> lessons = lessonService.getMandatoryLessonsByCourseId(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Mandatory lessons retrieved successfully", lessons, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve mandatory lessons: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/completed")
    public ResponseEntity<OhmaApiResponse<List<LessonDTO>>> getCompletedLessonsByCourseId(@PathVariable Long courseId) {
        try {
            List<LessonDTO> lessons = lessonService.getCompletedLessonsByCourseId(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Completed lessons retrieved successfully", lessons, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve completed lessons: " + e.getMessage(), null, null));
        }
    }

    @PutMapping("/{lessonId}/schedule")
    public ResponseEntity<OhmaApiResponse<LessonDTO>> scheduleLesson(@PathVariable Long lessonId, @RequestBody Map<String, String> request) {
        try {
            String scheduledDate = request.get("scheduledDate");
            LessonDTO lesson = lessonService.scheduleLesson(lessonId, scheduledDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lesson scheduled successfully", lesson, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to schedule lesson: " + e.getMessage(), null, null));
        }
    }

    @PutMapping("/{lessonId}/start")
    public ResponseEntity<OhmaApiResponse<LessonDTO>> startLesson(@PathVariable Long lessonId) {
        try {
            LessonDTO lesson = lessonService.startLesson(lessonId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lesson started successfully", lesson, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to start lesson: " + e.getMessage(), null, null));
        }
    }

    @PutMapping("/{lessonId}/complete")
    public ResponseEntity<OhmaApiResponse<LessonDTO>> completeLesson(@PathVariable Long lessonId) {
        try {
            LessonDTO lesson = lessonService.completeLesson(lessonId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lesson completed successfully", lesson, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to complete lesson: " + e.getMessage(), null, null));
        }
    }

    @PutMapping("/{lessonId}/cancel")
    public ResponseEntity<OhmaApiResponse<LessonDTO>> cancelLesson(@PathVariable Long lessonId, @RequestBody Map<String, String> request) {
        try {
            String reason = request.get("reason");
            LessonDTO lesson = lessonService.cancelLesson(lessonId, reason);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lesson cancelled successfully", lesson, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to cancel lesson: " + e.getMessage(), null, null));
        }
    }

    @PutMapping("/{lessonId}/postpone")
    public ResponseEntity<OhmaApiResponse<LessonDTO>> postponeLesson(@PathVariable Long lessonId, @RequestBody Map<String, String> request) {
        try {
            String newScheduledDate = request.get("newScheduledDate");
            LessonDTO lesson = lessonService.postponeLesson(lessonId, newScheduledDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lesson postponed successfully", lesson, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to postpone lesson: " + e.getMessage(), null, null));
        }
    }

    @PutMapping("/{lessonId}/order")
    public ResponseEntity<OhmaApiResponse<LessonDTO>> updateLessonOrder(@PathVariable Long lessonId, @RequestBody Map<String, Integer> request) {
        try {
            Integer newOrder = request.get("newOrder");
            LessonDTO lesson = lessonService.updateLessonOrder(lessonId, newOrder);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lesson order updated successfully", lesson, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to update lesson order: " + e.getMessage(), null, null));
        }
    }

    @PutMapping("/course/{courseId}/reorder")
    public ResponseEntity<OhmaApiResponse<List<LessonDTO>>> reorderLessons(@PathVariable Long courseId, @RequestBody Map<String, List<Long>> request) {
        try {
            List<Long> lessonIds = request.get("lessonIds");
            List<LessonDTO> lessons = lessonService.reorderLessons(courseId, lessonIds);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lessons reordered successfully", lessons, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to reorder lessons: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/analytics")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getLessonAnalytics(@PathVariable Long courseId) {
        try {
            Map<String, Object> analytics = lessonService.getLessonAnalytics(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Lesson analytics retrieved successfully", analytics, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve lesson analytics: " + e.getMessage(), null, null));
        }
    }

    @GetMapping("/instructor/{instructorId}/analytics")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getInstructorLessonAnalytics(
            @PathVariable Long instructorId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            Map<String, Object> analytics = lessonService.getInstructorLessonAnalytics(instructorId, startDate, endDate);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Instructor lesson analytics retrieved successfully", analytics, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OhmaApiResponse<>("ERROR", "Failed to retrieve instructor lesson analytics: " + e.getMessage(), null, null));
        }
    }
} 
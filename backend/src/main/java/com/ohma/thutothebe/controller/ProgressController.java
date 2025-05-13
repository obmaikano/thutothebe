package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.ProgressDTO;
import com.ohma.thutothebe.service.ProgressService;
import com.ohma.thutothebe.util.LoggingUtil;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/progress")
public class ProgressController extends BaseController<ProgressDTO, Long> {

    private final ProgressService progressService;
    private final Logger logger = LoggingUtil.getLogger(ProgressController.class);

    @Autowired
    public ProgressController(ProgressService progressService) {
        super(progressService);
        this.progressService = progressService;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<OhmaApiResponse<?>> getByStudent(@PathVariable Long studentId) {
        try {
            LoggingUtil.logInfo(logger, "Getting progress for student: {}", studentId);
            List<ProgressDTO> progress = progressService.getByStudent(studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Progress retrieved successfully", progress, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error getting progress for student: {}", studentId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<OhmaApiResponse<?>> getByCourse(@PathVariable Long courseId) {
        try {
            LoggingUtil.logInfo(logger, "Getting progress for course: {}", courseId);
            List<ProgressDTO> progress = progressService.getByCourse(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Progress retrieved successfully", progress, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error getting progress for course: {}", courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<OhmaApiResponse<?>> getByStudentAndCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        try {
            LoggingUtil.logInfo(logger, "Getting progress for student {} in course: {}", studentId, courseId);
            ProgressDTO progress = progressService.getByStudentAndCourse(studentId, courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Progress retrieved successfully", progress, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error getting progress for student {} in course: {}", studentId, courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/student/{studentId}/active")
    public ResponseEntity<OhmaApiResponse<?>> getActiveByStudent(@PathVariable Long studentId) {
        try {
            LoggingUtil.logInfo(logger, "Getting active progress for student: {}", studentId);
            List<ProgressDTO> progress = progressService.getActiveByStudent(studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active progress retrieved successfully", progress, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error getting active progress for student: {}", studentId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/active")
    public ResponseEntity<OhmaApiResponse<?>> getActiveByCourse(@PathVariable Long courseId) {
        try {
            LoggingUtil.logInfo(logger, "Getting active progress for course: {}", courseId);
            List<ProgressDTO> progress = progressService.getActiveByCourse(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active progress retrieved successfully", progress, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error getting active progress for course: {}", courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/student/{studentId}/completed")
    public ResponseEntity<OhmaApiResponse<?>> getCompletedByStudent(@PathVariable Long studentId) {
        try {
            LoggingUtil.logInfo(logger, "Getting completed progress for student: {}", studentId);
            List<ProgressDTO> progress = progressService.getCompletedByStudent(studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Completed progress retrieved successfully", progress, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error getting completed progress for student: {}", studentId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/completed")
    public ResponseEntity<OhmaApiResponse<?>> getCompletedByCourse(@PathVariable Long courseId) {
        try {
            LoggingUtil.logInfo(logger, "Getting completed progress for course: {}", courseId);
            List<ProgressDTO> progress = progressService.getCompletedByCourse(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Completed progress retrieved successfully", progress, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error getting completed progress for course: {}", courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/average-grade")
    public ResponseEntity<OhmaApiResponse<?>> getAverageGradeByCourse(@PathVariable Long courseId) {
        try {
            LoggingUtil.logInfo(logger, "Getting average grade for course: {}", courseId);
            Double averageGrade = progressService.getAverageGradeByCourse(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Average grade retrieved successfully", averageGrade, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error getting average grade for course: {}", courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/average-completion")
    public ResponseEntity<OhmaApiResponse<?>> getAverageCompletionByCourse(@PathVariable Long courseId) {
        try {
            LoggingUtil.logInfo(logger, "Getting average completion for course: {}", courseId);
            Double averageCompletion = progressService.getAverageCompletionByCourse(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Average completion retrieved successfully", averageCompletion, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error getting average completion for course: {}", courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<OhmaApiResponse<?>> updateProgress(
            @PathVariable Long studentId,
            @PathVariable Long courseId,
            @RequestParam Double completionPercentage,
            @RequestParam Double grade) {
        try {
            LoggingUtil.logInfo(logger, "Updating progress for student {} in course: {}", studentId, courseId);
            ProgressDTO progress = progressService.updateProgress(studentId, courseId, completionPercentage, grade);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Progress updated successfully", progress, null));
        } catch (Exception e) {
            LoggingUtil.logError(logger, "Error updating progress for student {} in course: {}", studentId, courseId, e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 
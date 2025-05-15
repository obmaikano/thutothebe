package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.StudentPerformanceDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.service.StudentPerformanceService;
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
@RequestMapping("/analytics/student-performance")
@Tag(name = "Student Performance", description = "APIs for managing student performance")
public class StudentPerformanceController extends BaseController<StudentPerformanceDTO, Long> {

    private final StudentPerformanceService studentPerformanceService;

    @Autowired
    public StudentPerformanceController(StudentPerformanceService studentPerformanceService) {
        super(studentPerformanceService);
        this.studentPerformanceService = studentPerformanceService;
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    @Operation(summary = "Get performance for a student in a course")
    public ResponseEntity<OhmaApiResponse<StudentPerformanceDTO>> getStudentPerformance(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        try {
            StudentPerformanceDTO performance = studentPerformanceService.getStudentPerformance(studentId, courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(performance));
        } catch (Exception e) {
            log.error("Error getting performance for student {} in course {}: {}", studentId, courseId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/student/{studentId}/history")
    @Operation(summary = "Get performance history for a student")
    public ResponseEntity<OhmaApiResponse<List<StudentPerformanceDTO>>> getStudentPerformanceHistory(
            @PathVariable Long studentId) {
        try {
            List<StudentPerformanceDTO> performance = studentPerformanceService.getStudentPerformanceHistory(studentId);
            return ResponseEntity.ok(OhmaApiResponse.success(performance));
        } catch (Exception e) {
            log.error("Error getting performance history for student {}: {}", studentId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get performance for all students in a course")
    public ResponseEntity<OhmaApiResponse<List<StudentPerformanceDTO>>> getCoursePerformance(
            @PathVariable Long courseId) {
        try {
            List<StudentPerformanceDTO> performance = studentPerformanceService.getCoursePerformance(courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(performance));
        } catch (Exception e) {
            log.error("Error getting performance for course {}: {}", courseId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get performance by date range")
    public ResponseEntity<OhmaApiResponse<List<StudentPerformanceDTO>>> getPerformanceByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<StudentPerformanceDTO> performance = studentPerformanceService.getPerformanceByDateRange(startDate, endDate);
            return ResponseEntity.ok(OhmaApiResponse.success(performance));
        } catch (Exception e) {
            log.error("Error getting performance by date range: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @PostMapping("/student/{studentId}/course/{courseId}/update")
    @Operation(summary = "Update performance for a student in a course")
    public ResponseEntity<OhmaApiResponse<Void>> updateStudentPerformance(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        try {
            studentPerformanceService.updateStudentPerformance(studentId, courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(null));
        } catch (Exception e) {
            log.error("Error updating performance for student {} in course {}: {}", studentId, courseId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }
} 
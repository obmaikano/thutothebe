package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.CurriculumProgressDTO;
import com.ohma.thutothebe.dto.CreateCurriculumProgressRequest;
import com.ohma.thutothebe.dto.UpdateCurriculumProgressRequest;
import com.ohma.thutothebe.service.CurriculumProgressService;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.config.GlobalExceptionHandler;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/curriculum-progress")
@Tag(name = "Curriculum Progress Management", description = "APIs for managing curriculum progress")
public class CurriculumProgressController extends BaseController<CurriculumProgressDTO, Long> {

    private final CurriculumProgressService curriculumProgressService;

    @Autowired
    public CurriculumProgressController(CurriculumProgressService curriculumProgressService) {
        super(curriculumProgressService);
        this.curriculumProgressService = curriculumProgressService;
    }

    @GetMapping
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getAllCurriculumProgress() {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.getAllCurriculumProgress();
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<CurriculumProgressDTO>> getCurriculumProgressById(@PathVariable Long id) {
        try {
            CurriculumProgressDTO progress = curriculumProgressService.getCurriculumProgressById(id);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<OhmaApiResponse<CurriculumProgressDTO>> createCurriculumProgress(@RequestBody CreateCurriculumProgressRequest request) {
        try {
            CurriculumProgressDTO progress = curriculumProgressService.createCurriculumProgress(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to create curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<CurriculumProgressDTO>> updateCurriculumProgress(@PathVariable Long id, @RequestBody UpdateCurriculumProgressRequest request) {
        try {
            CurriculumProgressDTO progress = curriculumProgressService.updateCurriculumProgress(id, request);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to update curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<String>> deleteCurriculumProgress(@PathVariable Long id) {
        try {
            curriculumProgressService.deleteCurriculumProgress(id);
            return ResponseEntity.ok(OhmaApiResponse.success("Curriculum progress with ID " + id + " has been deleted"));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to delete curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getCurriculumProgressByStudentId(@PathVariable Long studentId) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.getCurriculumProgressByStudentId(studentId);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getCurriculumProgressByCourseId(@PathVariable Long courseId) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.getCurriculumProgressByCourseId(courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/curriculum/{curriculumId}")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getCurriculumProgressByCurriculumId(@PathVariable Long curriculumId) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.getCurriculumProgressByCurriculumId(curriculumId);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<OhmaApiResponse<CurriculumProgressDTO>> getCurriculumProgressByStudentIdAndCourseId(@PathVariable Long studentId, @PathVariable Long courseId) {
        try {
            CurriculumProgressDTO progress = curriculumProgressService.getCurriculumProgressByStudentIdAndCourseId(studentId, courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getCurriculumProgressByStatus(@PathVariable String status) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.getCurriculumProgressByStatus(status);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/student/{studentId}/status/{status}")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getCurriculumProgressByStudentIdAndStatus(@PathVariable Long studentId, @PathVariable String status) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.getCurriculumProgressByStudentIdAndStatus(studentId, status);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/course/{courseId}/status/{status}")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getCurriculumProgressByCourseIdAndStatus(@PathVariable Long courseId, @PathVariable String status) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.getCurriculumProgressByCourseIdAndStatus(courseId, status);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/student/{studentId}/count")
    public ResponseEntity<OhmaApiResponse<Long>> countCurriculumProgressByStudentId(@PathVariable Long studentId) {
        try {
            Long count = curriculumProgressService.countCurriculumProgressByStudentId(studentId);
            return ResponseEntity.ok(OhmaApiResponse.success(count));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress count: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/course/{courseId}/count")
    public ResponseEntity<OhmaApiResponse<Long>> countCurriculumProgressByCourseId(@PathVariable Long courseId) {
        try {
            Long count = curriculumProgressService.countCurriculumProgressByCourseId(courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(count));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress count: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/student/{studentId}/status/{status}/count")
    public ResponseEntity<OhmaApiResponse<Long>> countCurriculumProgressByStudentIdAndStatus(@PathVariable Long studentId, @PathVariable String status) {
        try {
            Long count = curriculumProgressService.countCurriculumProgressByStudentIdAndStatus(studentId, status);
            return ResponseEntity.ok(OhmaApiResponse.success(count));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress count: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/course/{courseId}/status/{status}/count")
    public ResponseEntity<OhmaApiResponse<Long>> countCurriculumProgressByCourseIdAndStatus(@PathVariable Long courseId, @PathVariable String status) {
        try {
            Long count = curriculumProgressService.countCurriculumProgressByCourseIdAndStatus(courseId, status);
            return ResponseEntity.ok(OhmaApiResponse.success(count));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress count: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/progress-between")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getCurriculumProgressByProgressPercentageBetween(
            @RequestParam Double minPercentage,
            @RequestParam Double maxPercentage) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.getCurriculumProgressByProgressPercentageBetween(minPercentage, maxPercentage);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/student/{studentId}/progress-between")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getCurriculumProgressByStudentIdAndProgressPercentageBetween(
            @PathVariable Long studentId,
            @RequestParam Double minPercentage,
            @RequestParam Double maxPercentage) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.getCurriculumProgressByStudentIdAndProgressPercentageBetween(studentId, minPercentage, maxPercentage);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/course/{courseId}/progress-between")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getCurriculumProgressByCourseIdAndProgressPercentageBetween(
            @PathVariable Long courseId,
            @RequestParam Double minPercentage,
            @RequestParam Double maxPercentage) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.getCurriculumProgressByCourseIdAndProgressPercentageBetween(courseId, minPercentage, maxPercentage);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/student/{studentId}/completed")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getCompletedCurriculumProgressByStudentId(@PathVariable Long studentId) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.getCompletedCurriculumProgressByStudentId(studentId);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve completed curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/course/{courseId}/completed")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getCompletedCurriculumProgressByCourseId(@PathVariable Long courseId) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.getCompletedCurriculumProgressByCourseId(courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve completed curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/course/{courseId}/score-above/{minScore}")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getCurriculumProgressByCourseIdAndScoreAbove(@PathVariable Long courseId, @PathVariable Double minScore) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.getCurriculumProgressByCourseIdAndScoreAbove(courseId, minScore);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/course/{courseId}/score-below/{maxScore}")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getCurriculumProgressByCourseIdAndScoreBelow(@PathVariable Long courseId, @PathVariable Double maxScore) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.getCurriculumProgressByCourseIdAndScoreBelow(courseId, maxScore);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/course/{courseId}/score-between")
    public ResponseEntity<OhmaApiResponse<List<CurriculumProgressDTO>>> getCurriculumProgressByCourseIdAndScoreBetween(
            @PathVariable Long courseId,
            @RequestParam Double minScore,
            @RequestParam Double maxScore) {
        try {
            List<CurriculumProgressDTO> progress = curriculumProgressService.getCurriculumProgressByCourseIdAndScoreBetween(courseId, minScore, maxScore);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/student/{studentId}/course/{courseId}/curriculum/{curriculumId}/start")
    public ResponseEntity<OhmaApiResponse<CurriculumProgressDTO>> startProgress(@PathVariable Long studentId, @PathVariable Long courseId, @PathVariable Long curriculumId) {
        try {
            CurriculumProgressDTO progress = curriculumProgressService.startProgress(studentId, courseId, curriculumId);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to start curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{progressId}/progress")
    public ResponseEntity<OhmaApiResponse<CurriculumProgressDTO>> updateProgressPercentage(@PathVariable Long progressId, @RequestBody Map<String, Double> request) {
        try {
            Double progressPercentage = request.get("progressPercentage");
            CurriculumProgressDTO progress = curriculumProgressService.updateProgressPercentage(progressId, progressPercentage);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to update progress percentage: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{progressId}/complete")
    public ResponseEntity<OhmaApiResponse<CurriculumProgressDTO>> completeProgress(@PathVariable Long progressId, @RequestBody Map<String, Double> request) {
        try {
            Double averageScore = request.get("averageScore");
            CurriculumProgressDTO progress = curriculumProgressService.completeProgress(progressId, averageScore);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to complete curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{progressId}/pause")
    public ResponseEntity<OhmaApiResponse<CurriculumProgressDTO>> pauseProgress(@PathVariable Long progressId, @RequestBody Map<String, String> request) {
        try {
            String notes = request.get("notes");
            CurriculumProgressDTO progress = curriculumProgressService.pauseProgress(progressId, notes);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to pause curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{progressId}/resume")
    public ResponseEntity<OhmaApiResponse<CurriculumProgressDTO>> resumeProgress(@PathVariable Long progressId) {
        try {
            CurriculumProgressDTO progress = curriculumProgressService.resumeProgress(progressId);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to resume curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{progressId}/drop")
    public ResponseEntity<OhmaApiResponse<CurriculumProgressDTO>> dropProgress(@PathVariable Long progressId, @RequestBody Map<String, String> request) {
        try {
            String notes = request.get("notes");
            CurriculumProgressDTO progress = curriculumProgressService.dropProgress(progressId, notes);
            return ResponseEntity.ok(OhmaApiResponse.success(progress));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to drop curriculum progress: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/course/{courseId}/analytics")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getCurriculumProgressAnalytics(@PathVariable Long courseId) {
        try {
            Map<String, Object> analytics = curriculumProgressService.getCurriculumProgressAnalytics(courseId);
            return ResponseEntity.ok(OhmaApiResponse.success(analytics));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress analytics: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/student/{studentId}/analytics")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getStudentCurriculumProgressAnalytics(
            @PathVariable Long studentId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            Map<String, Object> analytics = curriculumProgressService.getStudentCurriculumProgressAnalytics(studentId, startDate, endDate);
            return ResponseEntity.ok(OhmaApiResponse.success(analytics));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve student curriculum progress analytics: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/curriculum/{curriculumId}/analytics")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getCurriculumProgressAnalyticsByCurriculum(@PathVariable Long curriculumId) {
        try {
            Map<String, Object> analytics = curriculumProgressService.getCurriculumProgressAnalyticsByCurriculum(curriculumId);
            return ResponseEntity.ok(OhmaApiResponse.success(analytics));
        } catch (Exception e) {
            return GlobalExceptionHandler.errorResponseEntity("Failed to retrieve curriculum progress analytics: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 
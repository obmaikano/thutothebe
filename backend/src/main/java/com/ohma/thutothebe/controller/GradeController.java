package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.GradeDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.GradeType;
import com.ohma.thutothebe.entity.Term;
import com.ohma.thutothebe.service.GradeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/grades")
@Tag(name = "Grade Management", description = "Grade management operations for ThutoLMS")
public class GradeController extends BaseController<GradeDTO, Long> {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        super(gradeService);
        this.gradeService = gradeService;
    }

    @Override
    @GetMapping
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getAll() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get accessible user IDs and filter grades by student access
            List<Long> accessibleUserIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            
            if (accessibleUserIds.isEmpty()) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "No accessible grades", List.of(), null));
            }

            List<GradeDTO> allGrades = gradeService.getAll();
            List<GradeDTO> accessibleGrades = allGrades.stream()
                    .filter(grade -> accessibleUserIds.contains(grade.studentId()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grades retrieved successfully", accessibleGrades, null));
        } catch (Exception e) {
            log.error("Error retrieving grades: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<GradeDTO>> getById(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            GradeDTO grade = gradeService.getById(id);
            
            // Check if user has access to view this student's grade
            if (!hasAccess(AccessScope.USER, grade.studentId())) {
                return createAccessDeniedResponse();
            }

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grade retrieved successfully", grade, null));
        } catch (Exception e) {
            log.error("Error retrieving grade: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<GradeDTO>> create(@RequestBody GradeDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has permission to create grades for this student
            if (!hasAccess(AccessScope.USER, dto.studentId())) {
                return createAccessDeniedResponse();
            }

            GradeDTO created = gradeService.create(dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grade created successfully", created, null));
        } catch (Exception e) {
            log.error("Error creating grade: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<GradeDTO>> update(@PathVariable Long id, @RequestBody GradeDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has access to update this grade
            GradeDTO existingGrade = gradeService.getById(id);
            if (!hasAccess(AccessScope.USER, existingGrade.studentId())) {
                return createAccessDeniedResponse();
            }

            GradeDTO updated = gradeService.update(id, dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grade updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating grade: {}", e.getMessage(), e);
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

            // Check if user has access to delete this grade
            GradeDTO grade = gradeService.getById(id);
            if (!hasAccess(AccessScope.USER, grade.studentId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            gradeService.delete(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grade deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting grade: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get all grades for a student")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getGradesByStudent(
            @Parameter(description = "Student ID") @PathVariable Long studentId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this student's grades
            if (!hasAccess(AccessScope.USER, studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to student data", null, null));
            }

            List<GradeDTO> grades = gradeService.findByStudentId(studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student grades retrieved successfully", grades, null));
        } catch (Exception e) {
            log.error("Error retrieving student grades: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get all grades for a course")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getGradesByCourse(
            @Parameter(description = "Course ID") @PathVariable Long courseId) {
        try {
            List<GradeDTO> grades = gradeService.findByCourseId(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course grades retrieved successfully", grades, null));
        } catch (Exception e) {
            log.error("Error retrieving course grades: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    @Operation(summary = "Get grades for a student in a specific course")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getGradesByStudentAndCourse(
            @Parameter(description = "Student ID") @PathVariable Long studentId,
            @Parameter(description = "Course ID") @PathVariable Long courseId) {
        try {
            List<GradeDTO> grades = gradeService.findByStudentIdAndCourseId(studentId, courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student course grades retrieved successfully", grades, null));
        } catch (Exception e) {
            log.error("Error retrieving student course grades: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/type/{gradeType}")
    @Operation(summary = "Get grades by type")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getGradesByType(
            @Parameter(description = "Grade type") @PathVariable GradeType gradeType) {
        try {
            List<GradeDTO> grades = gradeService.findByGradeType(gradeType);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grades by type retrieved successfully", grades, null));
        } catch (Exception e) {
            log.error("Error retrieving grades by type: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/term/{term}")
    @Operation(summary = "Get grades by term")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getGradesByTerm(
            @Parameter(description = "Academic term") @PathVariable Term term) {
        try {
            List<GradeDTO> grades = gradeService.findByTerm(term);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grades by term retrieved successfully", grades, null));
        } catch (Exception e) {
            log.error("Error retrieving grades by term: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/assessment/{assessmentId}")
    @Operation(summary = "Get grades for an assessment")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getGradesByAssessment(
            @Parameter(description = "Assessment ID") @PathVariable Long assessmentId) {
        try {
            List<GradeDTO> grades = gradeService.findByAssessmentId(assessmentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Assessment grades retrieved successfully", grades, null));
        } catch (Exception e) {
            log.error("Error retrieving assessment grades: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/assignment/{assignmentId}")
    @Operation(summary = "Get grades for an assignment")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getGradesByAssignment(
            @Parameter(description = "Assignment ID") @PathVariable Long assignmentId) {
        try {
            List<GradeDTO> grades = gradeService.findByAssignmentId(assignmentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Assignment grades retrieved successfully", grades, null));
        } catch (Exception e) {
            log.error("Error retrieving assignment grades: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get grades entered by a teacher")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getGradesByTeacher(
            @Parameter(description = "Teacher ID") @PathVariable Long teacherId) {
        try {
            List<GradeDTO> grades = gradeService.findByTeacherId(teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Teacher grades retrieved successfully", grades, null));
        } catch (Exception e) {
            log.error("Error retrieving teacher grades: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/student/{studentId}/paginated")
    @Operation(summary = "Get paginated grades for a student")
    public ResponseEntity<OhmaApiResponse<Page<GradeDTO>>> getGradesByStudentPaginated(
            @Parameter(description = "Student ID") @PathVariable Long studentId,
            Pageable pageable) {
        try {
            Page<GradeDTO> grades = gradeService.findByStudentId(studentId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Paginated student grades retrieved successfully", grades, null));
        } catch (Exception e) {
            log.error("Error retrieving paginated student grades: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/average/student/{studentId}/course/{courseId}")
    @Operation(summary = "Calculate average score for student in course")
    public ResponseEntity<OhmaApiResponse<Double>> getAverageScoreByStudentAndCourse(
            @Parameter(description = "Student ID") @PathVariable Long studentId,
            @Parameter(description = "Course ID") @PathVariable Long courseId) {
        try {
            Double average = gradeService.calculateAverageScoreByStudentAndCourse(studentId, courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Average score calculated successfully", average, null));
        } catch (Exception e) {
            log.error("Error calculating average score: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/average/course/{courseId}")
    @Operation(summary = "Calculate average score for course")
    public ResponseEntity<OhmaApiResponse<Double>> getAverageScoreByCourse(
            @Parameter(description = "Course ID") @PathVariable Long courseId) {
        try {
            Double average = gradeService.calculateAverageScoreByCourse(courseId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Course average calculated successfully", average, null));
        } catch (Exception e) {
            log.error("Error calculating course average: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/average/student/{studentId}")
    @Operation(summary = "Calculate overall average score for student")
    public ResponseEntity<OhmaApiResponse<Double>> getAverageScoreByStudent(
            @Parameter(description = "Student ID") @PathVariable Long studentId) {
        try {
            Double average = gradeService.calculateAverageScoreByStudent(studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student average calculated successfully", average, null));
        } catch (Exception e) {
            log.error("Error calculating student average: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/moderate/{gradeId}")
    @Operation(summary = "Moderate a grade")
    public ResponseEntity<OhmaApiResponse<GradeDTO>> moderateGrade(
            @Parameter(description = "Grade ID") @PathVariable Long gradeId,
            @Parameter(description = "Moderator ID") @RequestParam Long moderatorId,
            @Parameter(description = "Moderation notes") @RequestParam String moderationNotes,
            @Parameter(description = "New score") @RequestParam Double newScore) {
        try {
            GradeDTO moderatedGrade = gradeService.moderateGrade(gradeId, moderatorId, moderationNotes, newScore);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grade moderated successfully", moderatedGrade, null));
        } catch (Exception e) {
            log.error("Error moderating grade: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/unmoderated")
    @Operation(summary = "Get all unmoderated grades")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getUnmoderatedGrades() {
        try {
            List<GradeDTO> grades = gradeService.findUnmoderatedGrades();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Unmoderated grades retrieved successfully", grades, null));
        } catch (Exception e) {
            log.error("Error retrieving unmoderated grades: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/moderated")
    @Operation(summary = "Get all moderated grades")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getModeratedGrades() {
        try {
            List<GradeDTO> grades = gradeService.findModeratedGrades();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Moderated grades retrieved successfully", grades, null));
        } catch (Exception e) {
            log.error("Error retrieving moderated grades: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/assessment")
    @Operation(summary = "Create grade for assessment")
    public ResponseEntity<OhmaApiResponse<GradeDTO>> createGradeForAssessment(
            @Parameter(description = "Student ID") @RequestParam Long studentId,
            @Parameter(description = "Assessment ID") @RequestParam Long assessmentId,
            @Parameter(description = "Score") @RequestParam Double score,
            @Parameter(description = "Graded by user ID") @RequestParam Long gradedById) {
        try {
            GradeDTO grade = gradeService.createGradeForAssessment(studentId, assessmentId, score, gradedById);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Assessment grade created successfully", grade, null));
        } catch (Exception e) {
            log.error("Error creating assessment grade: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/assignment")
    @Operation(summary = "Create grade for assignment")
    public ResponseEntity<OhmaApiResponse<GradeDTO>> createGradeForAssignment(
            @Parameter(description = "Student ID") @RequestParam Long studentId,
            @Parameter(description = "Assignment ID") @RequestParam Long assignmentId,
            @Parameter(description = "Score") @RequestParam Double score,
            @Parameter(description = "Graded by user ID") @RequestParam Long gradedById) {
        try {
            GradeDTO grade = gradeService.createGradeForAssignment(studentId, assignmentId, score, gradedById);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Assignment grade created successfully", grade, null));
        } catch (Exception e) {
            log.error("Error creating assignment grade: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/bulk")
    @Operation(summary = "Create multiple grades in bulk")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> createBulkGrades(
            @RequestBody List<GradeDTO> grades) {
        try {
            List<GradeDTO> createdGrades = gradeService.bulkCreateGrades(grades);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Bulk grades created successfully", createdGrades, null));
        } catch (Exception e) {
            log.error("Error creating bulk grades: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{gradeId}/deactivate")
    @Operation(summary = "Deactivate a grade")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateGrade(
            @Parameter(description = "Grade ID") @PathVariable Long gradeId) {
        try {
            gradeService.deactivateGrade(gradeId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grade deactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error deactivating grade: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{gradeId}/reactivate")
    @Operation(summary = "Reactivate a grade")
    public ResponseEntity<OhmaApiResponse<Void>> reactivateGrade(
            @Parameter(description = "Grade ID") @PathVariable Long gradeId) {
        try {
            gradeService.reactivateGrade(gradeId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grade reactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error reactivating grade: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/exists/student/{studentId}/assessment/{assessmentId}")
    @Operation(summary = "Check if grade exists for student and assessment")
    public ResponseEntity<OhmaApiResponse<Boolean>> checkGradeExistsForAssessment(
            @Parameter(description = "Student ID") @PathVariable Long studentId,
            @Parameter(description = "Assessment ID") @PathVariable Long assessmentId) {
        try {
            boolean exists = gradeService.existsByStudentIdAndAssessmentId(studentId, assessmentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grade existence checked successfully", exists, null));
        } catch (Exception e) {
            log.error("Error checking grade existence: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/exists/student/{studentId}/assignment/{assignmentId}")
    @Operation(summary = "Check if grade exists for student and assignment")
    public ResponseEntity<OhmaApiResponse<Boolean>> checkGradeExistsForAssignment(
            @Parameter(description = "Student ID") @PathVariable Long studentId,
            @Parameter(description = "Assignment ID") @PathVariable Long assignmentId) {
        try {
            boolean exists = gradeService.existsByStudentIdAndAssignmentId(studentId, assignmentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grade existence checked successfully", exists, null));
        } catch (Exception e) {
            log.error("Error checking grade existence: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/category/{gradeCategoryId}")
    @Operation(summary = "Get grades by grade category")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getGradesByCategory(
            @Parameter(description = "Grade Category ID") @PathVariable Long gradeCategoryId) {
        try {
            List<GradeDTO> grades = gradeService.findByGradeCategoryId(gradeCategoryId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grade category grades retrieved successfully", grades, null));
        } catch (Exception e) {
            log.error("Error retrieving grade category grades: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/student/{studentId}/category/{gradeCategoryId}")
    @Operation(summary = "Get grades for student in specific grade category")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getGradesByStudentAndCategory(
            @Parameter(description = "Student ID") @PathVariable Long studentId,
            @Parameter(description = "Grade Category ID") @PathVariable Long gradeCategoryId) {
        try {
            List<GradeDTO> grades = gradeService.findByStudentIdAndGradeCategoryId(studentId, gradeCategoryId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student grade category grades retrieved successfully", grades, null));
        } catch (Exception e) {
            log.error("Error retrieving student grade category grades: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/statistics/average/category/{gradeCategoryId}")
    @Operation(summary = "Calculate average score for grade category")
    public ResponseEntity<OhmaApiResponse<Double>> getAverageScoreByGradeCategory(
            @Parameter(description = "Grade Category ID") @PathVariable Long gradeCategoryId) {
        try {
            Double average = gradeService.calculateAverageScoreByGradeCategory(gradeCategoryId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grade category average calculated successfully", average, null));
        } catch (Exception e) {
            log.error("Error calculating grade category average: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/category")
    @Operation(summary = "Create grade for grade category")
    public ResponseEntity<OhmaApiResponse<GradeDTO>> createGradeForCategory(
            @Parameter(description = "Student ID") @RequestParam Long studentId,
            @Parameter(description = "Grade Category ID") @RequestParam Long gradeCategoryId,
            @Parameter(description = "Score") @RequestParam Double score,
            @Parameter(description = "Graded by user ID") @RequestParam Long gradedById,
            @Parameter(description = "Feedback") @RequestParam(required = false) String feedback) {
        try {
            GradeDTO grade = gradeService.createGradeForCategory(studentId, gradeCategoryId, score, gradedById, feedback);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grade category grade created successfully", grade, null));
        } catch (Exception e) {
            log.error("Error creating grade category grade: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/exists/student/{studentId}/category/{gradeCategoryId}")
    @Operation(summary = "Check if grade exists for student and grade category")
    public ResponseEntity<OhmaApiResponse<Boolean>> checkGradeExistsForCategory(
            @Parameter(description = "Student ID") @PathVariable Long studentId,
            @Parameter(description = "Grade Category ID") @PathVariable Long gradeCategoryId) {
        try {
            boolean exists = gradeService.existsByStudentIdAndGradeCategoryId(studentId, gradeCategoryId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Grade existence checked successfully", exists, null));
        } catch (Exception e) {
            log.error("Error checking grade existence: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 
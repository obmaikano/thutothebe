package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.StudentDTO;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/students")
@Tag(name = "Student Management", description = "APIs for managing students")
public class StudentController extends BaseController<StudentDTO, Long> {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        super(studentService);
        this.studentService = studentService;
    }

    @GetMapping("/admission-number/{admissionNumber}")
    @Operation(summary = "Get student by admission number")
    public ResponseEntity<OhmaApiResponse<StudentDTO>> getByAdmissionNumber(@PathVariable String admissionNumber) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            StudentDTO student = studentService.getStudentByAdmissionNumber(admissionNumber);
            
            // Check if user has access to view this student's data
            if (!hasAccess(AccessScope.USER, student.userId())) {
                return createAccessDeniedResponse();
            }
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student retrieved successfully", student, null));
        } catch (Exception e) {
            log.error("Error retrieving student: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get student by email")
    public ResponseEntity<OhmaApiResponse<StudentDTO>> getByEmail(@PathVariable String email) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            StudentDTO student = studentService.getStudentByEmail(email);
            
            // Check if user has access to view this student's data
            if (!hasAccess(AccessScope.USER, student.userId())) {
                return createAccessDeniedResponse();
            }
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student retrieved successfully", student, null));
        } catch (Exception e) {
            log.error("Error retrieving student: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get student by user ID")
    public ResponseEntity<OhmaApiResponse<StudentDTO>> getByUserId(@PathVariable Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has access to view this student's data
            if (!hasAccess(AccessScope.USER, userId)) {
                return createAccessDeniedResponse();
            }

            StudentDTO student = studentService.getStudentByUserId(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student retrieved successfully", student, null));
        } catch (Exception e) {
            log.error("Error retrieving student: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active students")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getActiveStudents() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get accessible user IDs for filtering students
            List<Long> accessibleUserIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            
            if (accessibleUserIds.isEmpty()) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "No accessible students", List.of(), null));
            }

            List<StudentDTO> allActiveStudents = studentService.getActiveStudents();
            List<StudentDTO> accessibleStudents = allActiveStudents.stream()
                    .filter(student -> accessibleUserIds.contains(student.userId()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active students retrieved successfully", accessibleStudents, null));
        } catch (Exception e) {
            log.error("Error retrieving active students: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get students by course ID")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getStudentsByCourseId(@PathVariable Long courseId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view students in this course context
            List<Long> accessibleUserIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            
            if (accessibleUserIds.isEmpty()) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "No accessible students", List.of(), null));
            }

            List<StudentDTO> courseStudents = studentService.getStudentsByCourseId(courseId);
            List<StudentDTO> accessibleStudents = courseStudents.stream()
                    .filter(student -> accessibleUserIds.contains(student.userId()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Students for course retrieved successfully", accessibleStudents, null));
        } catch (Exception e) {
            log.error("Error retrieving students for course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get students by class ID")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getStudentsByClassId(@PathVariable Long classId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this class
            if (!hasAccess(AccessScope.CLASS, classId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this class", null, null));
            }

            List<StudentDTO> students = studentService.getStudentsByClassId(classId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Students for class retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving students for class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{classId}/enrolled")
    @Operation(summary = "Get students enrolled in class via join table")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getStudentsEnrolledInClass(@PathVariable Long classId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this class
            if (!hasAccess(AccessScope.CLASS, classId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this class", null, null));
            }

            List<StudentDTO> students = studentService.getStudentsEnrolledInClass(classId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Enrolled students for class retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving enrolled students for class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get students by school ID")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getStudentsBySchoolId(@PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this school's data
            if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this school", null, null));
            }

            List<StudentDTO> students = studentService.getStudentsBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Students for school retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving students for school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a student")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateStudent(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get student to check access
            StudentDTO student = studentService.getById(id);
            
            // Check if user has access to manage this student (requires USER scope access)
            if (!hasAccess(AccessScope.USER, student.userId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            studentService.deactivateStudent(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student deactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error deactivating student: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a student")
    public ResponseEntity<OhmaApiResponse<Void>> activateStudent(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get student to check access
            StudentDTO student = studentService.getById(id);
            
            // Check if user has access to manage this student (requires USER scope access)
            if (!hasAccess(AccessScope.USER, student.userId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            studentService.activateStudent(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating student: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{classId}/debug")
    @Operation(summary = "Debug enrollment data for a class")
    public ResponseEntity<OhmaApiResponse<String>> debugClassEnrollment(@PathVariable Long classId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access for debug operations
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Admin access required for debug operations", null, null));
            }

            String debugInfo = studentService.debugClassEnrollment(classId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Debug info retrieved", debugInfo, null));
        } catch (Exception e) {
            log.error("Error getting debug info: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/class/{classId}/cleanup")
    @Operation(summary = "Cleanup enrollment inconsistencies for a class")
    public ResponseEntity<OhmaApiResponse<Void>> cleanupClassEnrollment(@PathVariable Long classId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has global admin access for cleanup operations
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Admin access required for cleanup operations", null, null));
            }

            studentService.cleanupClassEnrollmentInconsistencies(classId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Enrollment inconsistencies cleaned up", null, null));
        } catch (Exception e) {
            log.error("Error cleaning up enrollment: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get students by teacher ID (from assigned courses)")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getStudentsByTeacherId(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view teacher's students (requires USER access to teacher)
            if (!hasAccess(AccessScope.USER, teacherId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to teacher data", null, null));
            }

            List<StudentDTO> students = studentService.getStudentsByTeacherId(teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Students for teacher retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving students for teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/teacher/{teacherId}/active")
    @Operation(summary = "Get active students by teacher ID (from assigned courses)")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getActiveStudentsByTeacherId(@PathVariable Long teacherId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view teacher's students (requires USER access to teacher)
            if (!hasAccess(AccessScope.USER, teacherId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to teacher data", null, null));
            }

            List<StudentDTO> students = studentService.getActiveStudentsByTeacherId(teacherId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active students for teacher retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving active students for teacher: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/subject/{subjectId}")
    @Operation(summary = "Get students by subject ID")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getStudentsBySubjectId(@PathVariable Long subjectId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view students in this subject context
            List<Long> accessibleUserIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            
            if (accessibleUserIds.isEmpty()) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "No accessible students", List.of(), null));
            }

            List<StudentDTO> subjectStudents = studentService.getStudentsBySubjectId(subjectId);
            List<StudentDTO> accessibleStudents = subjectStudents.stream()
                    .filter(student -> accessibleUserIds.contains(student.userId()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Students for subject retrieved successfully", accessibleStudents, null));
        } catch (Exception e) {
            log.error("Error retrieving students for subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/subject/{subjectId}/active")
    @Operation(summary = "Get active students by subject ID")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getActiveStudentsBySubjectId(@PathVariable Long subjectId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view students in this subject context
            List<Long> accessibleUserIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            
            if (accessibleUserIds.isEmpty()) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "No accessible students", List.of(), null));
            }

            List<StudentDTO> subjectStudents = studentService.getStudentsBySubjectId(subjectId);
            List<StudentDTO> accessibleStudents = subjectStudents.stream()
                    .filter(student -> accessibleUserIds.contains(student.userId()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active students for subject retrieved successfully", accessibleStudents, null));
        } catch (Exception e) {
            log.error("Error retrieving active students for subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/course/{courseId}/active")
    @Operation(summary = "Get active students by course ID")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getActiveStudentsByCourseId(@PathVariable Long courseId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view students in this course context
            List<Long> accessibleUserIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            
            if (accessibleUserIds.isEmpty()) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "No accessible students", List.of(), null));
            }

            List<StudentDTO> courseStudents = studentService.getActiveStudentsByCourseId(courseId);
            List<StudentDTO> accessibleStudents = courseStudents.stream()
                    .filter(student -> accessibleUserIds.contains(student.userId()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active students for course retrieved successfully", accessibleStudents, null));
        } catch (Exception e) {
            log.error("Error retrieving active students for course: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/class/{classId}/active")
    @Operation(summary = "Get active students by class ID")
    public ResponseEntity<OhmaApiResponse<List<StudentDTO>>> getActiveStudentsByClassId(@PathVariable Long classId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this class
            if (!hasAccess(AccessScope.CLASS, classId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to this class", null, null));
            }

            List<StudentDTO> students = studentService.getActiveStudentsByClassId(classId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active students for class retrieved successfully", students, null));
        } catch (Exception e) {
            log.error("Error retrieving active students for class: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Student-specific endpoints for student role access
    @GetMapping("/{studentId}/courses")
    @Operation(summary = "Get enrolled courses for a student")
    public ResponseEntity<OhmaApiResponse<List<Object>>> getStudentCourses(@PathVariable Long studentId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this student's data
            if (!hasAccess(AccessScope.USER, studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to student data", null, null));
            }

            List<Object> courses = studentService.getStudentCourses(studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student courses retrieved successfully", courses, null));
        } catch (Exception e) {
            log.error("Error retrieving courses for student: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{studentId}/assignments")
    @Operation(summary = "Get assignments for a student's enrolled courses")
    public ResponseEntity<OhmaApiResponse<List<Object>>> getStudentAssignments(@PathVariable Long studentId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this student's data
            if (!hasAccess(AccessScope.USER, studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to student data", null, null));
            }

            List<Object> assignments = studentService.getStudentAssignments(studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student assignments retrieved successfully", assignments, null));
        } catch (Exception e) {
            log.error("Error retrieving assignments for student: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{studentId}/performance")
    @Operation(summary = "Get performance analytics for a student")
    public ResponseEntity<OhmaApiResponse<Object>> getStudentPerformance(@PathVariable Long studentId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this student's data
            if (!hasAccess(AccessScope.USER, studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to student data", null, null));
            }

            Object performance = studentService.getStudentPerformanceAnalytics(studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student performance retrieved successfully", performance, null));
        } catch (Exception e) {
            log.error("Error retrieving performance for student: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{studentId}/dashboard")
    @Operation(summary = "Get dashboard data for a student")
    public ResponseEntity<OhmaApiResponse<Object>> getStudentDashboard(@PathVariable Long studentId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this student's data
            if (!hasAccess(AccessScope.USER, studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to student data", null, null));
            }

            Object dashboardData = studentService.getStudentDashboardData(studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student dashboard data retrieved successfully", dashboardData, null));
        } catch (Exception e) {
            log.error("Error retrieving dashboard data for student: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/create-for-user/{userId}")
    @Operation(summary = "Create a student record for a user if it doesn't exist")
    public ResponseEntity<OhmaApiResponse<StudentDTO>> createStudentForUser(@PathVariable Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to create a student record for this user
            if (!hasAccess(AccessScope.USER, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            StudentDTO student = studentService.createStudentForUser(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Student record created successfully", student, null));
        } catch (Exception e) {
            log.error("Error creating student record for user: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 
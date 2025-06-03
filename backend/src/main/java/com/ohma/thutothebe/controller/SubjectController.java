package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.SubjectDTO;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.SubjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/subjects")
@Tag(name = "Subject Management", description = "APIs for managing subjects")
public class SubjectController extends BaseController<SubjectDTO, Long> {

    private final SubjectService subjectService;

    @Autowired
    public SubjectController(SubjectService subjectService) {
        super(subjectService);
        this.subjectService = subjectService;
    }

    @Override
    @GetMapping
    public ResponseEntity<OhmaApiResponse<List<SubjectDTO>>> getAll() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Subjects are generally accessible to all authenticated users (they're academic content)
            // but we may want to filter based on user's scope in future
            List<SubjectDTO> subjects = subjectService.getAll();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subjects retrieved successfully", subjects, null));
        } catch (Exception e) {
            log.error("Error retrieving subjects: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<SubjectDTO>> getById(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Subjects are generally accessible to all authenticated users
            SubjectDTO subject = subjectService.getById(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject retrieved successfully", subject, null));
        } catch (Exception e) {
            log.error("Error retrieving subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<SubjectDTO>> create(@RequestBody SubjectDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Only admin level users can create subjects (global or regional admin)
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return createAccessDeniedResponse();
            }

            SubjectDTO created = subjectService.create(dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject created successfully", created, null));
        } catch (Exception e) {
            log.error("Error creating subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<SubjectDTO>> update(@PathVariable Long id, @RequestBody SubjectDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Only admin level users can update subjects
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return createAccessDeniedResponse();
            }

            SubjectDTO updated = subjectService.update(id, dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating subject: {}", e.getMessage(), e);
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

            // Only admin level users can delete subjects
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            subjectService.delete(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get subject by code")
    public ResponseEntity<OhmaApiResponse<SubjectDTO>> getByCode(@PathVariable String code) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            SubjectDTO subject = subjectService.getSubjectByCode(code);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject retrieved successfully", subject, null));
        } catch (Exception e) {
            log.error("Error retrieving subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active subjects")
    public ResponseEntity<OhmaApiResponse<List<SubjectDTO>>> getActiveSubjects() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            List<SubjectDTO> subjects = subjectService.getActiveSubjects();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active subjects retrieved successfully", subjects, null));
        } catch (Exception e) {
            log.error("Error retrieving active subjects: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a subject")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateSubject(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Only admin level users can deactivate subjects
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            subjectService.deactivateSubject(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject deactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error deactivating subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a subject")
    public ResponseEntity<OhmaApiResponse<Void>> activateSubject(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Only admin level users can activate subjects
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            subjectService.activateSubject(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 
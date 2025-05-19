package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.SubjectDTO;
import com.ohma.thutothebe.service.SubjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/subjects")
@Tag(name = "Subject Management", description = "APIs for managing academic subjects")
public class SubjectController extends BaseController<SubjectDTO, Long> {

    private final SubjectService subjectService;

    @Autowired
    public SubjectController(SubjectService subjectService) {
        super(subjectService);
        this.subjectService = subjectService;
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get subject by code")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<SubjectDTO>> getByCode(@PathVariable String code) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<OhmaApiResponse<List<SubjectDTO>>> getActiveSubjects() {
        try {
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateSubject(@PathVariable Long id) {
        try {
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> activateSubject(@PathVariable Long id) {
        try {
            subjectService.activateSubject(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Subject activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating subject: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 
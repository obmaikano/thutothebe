package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.StaffDTO;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController extends BaseController<StaffDTO, Long> {

    @Autowired
    private StaffService staffService;

    public StaffController(StaffService staffService) {
        super(staffService);
    }

    @GetMapping("/school/{schoolId}")
    public ResponseEntity<OhmaApiResponse<List<StaffDTO>>> getStaffBySchoolId(@PathVariable Long schoolId) {
        try {
            List<StaffDTO> staff = staffService.getStaffBySchoolId(schoolId);
            return ResponseEntity.ok(OhmaApiResponse.success(staff));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to retrieve staff: " + e.getMessage()));
        }
    }

    @GetMapping("/school/{schoolId}/active")
    public ResponseEntity<OhmaApiResponse<List<StaffDTO>>> getActiveStaffBySchoolId(@PathVariable Long schoolId) {
        try {
            List<StaffDTO> staff = staffService.getActiveStaffBySchoolId(schoolId);
            return ResponseEntity.ok(OhmaApiResponse.success(staff));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to retrieve active staff: " + e.getMessage()));
        }
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<OhmaApiResponse<List<StaffDTO>>> getStaffByRole(@PathVariable UserRole role) {
        try {
            List<StaffDTO> staff = staffService.getStaffByRole(role);
            return ResponseEntity.ok(OhmaApiResponse.success(staff));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to retrieve staff by role: " + e.getMessage()));
        }
    }

    @GetMapping("/region/{regionId}")
    public ResponseEntity<OhmaApiResponse<List<StaffDTO>>> getStaffByRegionId(@PathVariable Long regionId) {
        try {
            List<StaffDTO> staff = staffService.getStaffByRegionId(regionId);
            return ResponseEntity.ok(OhmaApiResponse.success(staff));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to retrieve staff by region: " + e.getMessage()));
        }
    }

    @PutMapping("/{staffId}/toggle-status")
    public ResponseEntity<OhmaApiResponse<StaffDTO>> toggleStaffStatus(
            @PathVariable Long staffId,
            @RequestParam boolean active) {
        try {
            StaffDTO updatedStaff = staffService.toggleStaffStatus(staffId, active);
            return ResponseEntity.ok(OhmaApiResponse.success(updatedStaff));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(OhmaApiResponse.error(400, "Invalid request: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to toggle staff status: " + e.getMessage()));
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<OhmaApiResponse<StaffDTO>> getStaffByEmail(@PathVariable String email) {
        try {
            StaffDTO staff = staffService.getStaffByEmail(email);
            return ResponseEntity.ok(OhmaApiResponse.success(staff));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(OhmaApiResponse.error(400, "Staff not found: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to retrieve staff: " + e.getMessage()));
        }
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<OhmaApiResponse<Boolean>> checkEmailExists(@PathVariable String email) {
        try {
            boolean exists = staffService.existsByEmail(email);
            return ResponseEntity.ok(OhmaApiResponse.success(exists));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to check email: " + e.getMessage()));
        }
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<OhmaApiResponse<Boolean>> checkUsernameExists(@PathVariable String username) {
        try {
            boolean exists = staffService.existsByUsername(username);
            return ResponseEntity.ok(OhmaApiResponse.success(exists));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to check username: " + e.getMessage()));
        }
    }
} 
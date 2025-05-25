package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Tag(name = "User Management", description = "APIs for managing users")
@Slf4j
public class UserController extends BaseController<UserDTO, Long> {

    private final UserService userService;

    public UserController(UserService userService) {
        super(userService);
        this.userService = userService;
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<OhmaApiResponse<UserDTO>> getUserByEmail(@PathVariable String email) {
        try {
            UserDTO user = userService.getUserByEmail(email);
            return ResponseEntity.ok(OhmaApiResponse.success(user));
        } catch (Exception e) {
            log.error("Error retrieving user: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/teachers")
    public ResponseEntity<OhmaApiResponse<List<UserDTO>>> getAllTeachers() {
        try {
            List<UserDTO> teachers = userService.getAllTeachers();
            return ResponseEntity.ok(OhmaApiResponse.success(teachers));
        } catch (Exception e) {
            log.error("Error retrieving teachers: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/students")
    public ResponseEntity<OhmaApiResponse<List<UserDTO>>> getAllStudents() {
        try {
            List<UserDTO> students = userService.getAllStudents();
            return ResponseEntity.ok(OhmaApiResponse.success(students));
        } catch (Exception e) {
            log.error("Error retrieving students: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @PutMapping("/{id}/update-profile")
    public ResponseEntity<OhmaApiResponse<UserDTO>> updateWithoutRoleAndPassword(
            @PathVariable Long id, 
            @RequestBody UserDTO userDTO) {
        try {
            UserDTO updated = userService.updateWithoutRoleAndPassword(id, userDTO);
            return ResponseEntity.ok(OhmaApiResponse.success(updated));
        } catch (Exception e) {
            log.error("Error updating user profile: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }
} 
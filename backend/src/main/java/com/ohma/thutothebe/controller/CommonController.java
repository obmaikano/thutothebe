package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.Nationality;
import com.ohma.thutothebe.entity.enums.Gender;
import com.ohma.thutothebe.entity.UserRole;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/common")
public class CommonController {

    @GetMapping("/nationalities")
    public ResponseEntity<OhmaApiResponse<List<String>>> getNationalities() {
        try {
            List<String> nationalities = Arrays.stream(Nationality.values())
                .map(Enum::name)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(OhmaApiResponse.success(nationalities));
        } catch (Exception e) {
            log.error("Error fetching nationalities: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(OhmaApiResponse.error(400, "Failed to fetch nationalities: " + e.getMessage()));
        }
    }

    @GetMapping("/genders")
    public ResponseEntity<OhmaApiResponse<List<String>>> getGenders() {
        try {
            List<String> genders = Arrays.stream(Gender.values())
                .map(Enum::name)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(OhmaApiResponse.success(genders));
        } catch (Exception e) {
            log.error("Error fetching genders: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(OhmaApiResponse.error(400, "Failed to fetch genders: " + e.getMessage()));
        }
    }

    @GetMapping("/user-roles")
    public ResponseEntity<OhmaApiResponse<List<String>>> getUserRoles() {
        try {
            List<String> roles = Arrays.stream(UserRole.values())
                .map(Enum::name)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(OhmaApiResponse.success(roles));
        } catch (Exception e) {
            log.error("Error fetching user roles: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body(OhmaApiResponse.error(400, "Failed to fetch user roles: " + e.getMessage()));
        }
    }
} 
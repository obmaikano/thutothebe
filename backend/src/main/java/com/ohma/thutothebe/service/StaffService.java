package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.StaffDTO;
import com.ohma.thutothebe.entity.UserRole;

import java.util.List;

public interface StaffService extends BaseService<StaffDTO, Long> {
    
    /**
     * Get all staff members (users with staff roles) by school ID
     * @param schoolId School ID
     * @return List of staff DTOs
     */
    List<StaffDTO> getStaffBySchoolId(Long schoolId);
    
    /**
     * Get all staff members by role
     * @param role User role
     * @return List of staff DTOs
     */
    List<StaffDTO> getStaffByRole(UserRole role);
    
    /**
     * Get all active staff members by school ID
     * @param schoolId School ID
     * @return List of active staff DTOs
     */
    List<StaffDTO> getActiveStaffBySchoolId(Long schoolId);
    
    /**
     * Get all staff members by region ID
     * @param regionId Region ID
     * @return List of staff DTOs
     */
    List<StaffDTO> getStaffByRegionId(Long regionId);
    
    /**
     * Toggle staff member active status
     * @param staffId Staff member ID
     * @param active New active status
     * @return Updated staff DTO
     */
    StaffDTO toggleStaffStatus(Long staffId, boolean active);
    
    /**
     * Get staff member by email
     * @param email Staff member email
     * @return Staff DTO
     */
    StaffDTO getStaffByEmail(String email);
    
    /**
     * Check if staff member exists by email
     * @param email Staff member email
     * @return true if exists, false otherwise
     */
    boolean existsByEmail(String email);
    
    /**
     * Check if staff member exists by username
     * @param username Staff member username
     * @return true if exists, false otherwise
     */
    boolean existsByUsername(String username);
} 